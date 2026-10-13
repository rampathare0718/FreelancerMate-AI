import {
  checkOllamaHealth,
  generateWithGemma,
  generateFollowUpReply
} from '../services/ollamaService.js';
import {
  buildAnalysisPrompt,
  validateAndNormalizeAnalysis,
  parseUnifiedPrompt,
  buildFollowUpPrompt
} from '../services/promptService.js';
import Project from '../models/Project.js';

/**
 * @desc    Check Ollama daemon connection and Gemma model availability
 * @route   GET /api/ai/status
 * @access  Public
 */
export const getAiStatus = async (req, res) => {
  try {
    const health = await checkOllamaHealth();
    return res.status(200).json({
      success: true,
      data: health
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to query AI service status',
      error: error.message
    });
  }
};

/**
 * @desc    Analyze client requirements using Gemma via Ollama
 * @route   POST /api/ai/analyze
 * @access  Public
 */
export const analyzeProject = async (req, res) => {
  try {
    const {
      prompt: unifiedPrompt,
      title,
      projectTitle,
      clientRequest,
      clientRequirements,
      budget,
      deadline,
      preferredTechnologies,
      additionalContext,
      saveToDb,
      projectId,
      userId
    } = req.body;

    // 1. Extract from unified single prompt if supplied
    let parsedFields = {};
    if (unifiedPrompt && typeof unifiedPrompt === 'string') {
      parsedFields = parseUnifiedPrompt(unifiedPrompt);
    }

    // 2. Normalize field aliases with fallback to unified prompt parsing
    const resolvedTitle = (
      title ||
      projectTitle ||
      parsedFields.title ||
      ''
    ).trim();

    const resolvedRequest = (
      clientRequest ||
      clientRequirements ||
      parsedFields.clientRequest ||
      ''
    ).trim();

    const resolvedBudget = budget !== undefined ? budget : parsedFields.budget;
    const resolvedDeadline = deadline || parsedFields.deadline;
    const resolvedTech = preferredTechnologies || parsedFields.preferredTechnologies;
    const resolvedContext = additionalContext || parsedFields.additionalContext;

    // 3. Input Validation
    if (!resolvedTitle) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'title' (or project title in prompt) is required."
      });
    }

    if (!resolvedRequest || resolvedRequest.length < 10) {
      return res.status(400).json({
        success: false,
        message:
          "Validation Error: 'clientRequest' (or description in prompt) is required and must contain at least 10 characters."
      });
    }

    // 4. Build Structured Prompt for Gemma
    const prompt = buildAnalysisPrompt({
      title: resolvedTitle,
      clientRequest: resolvedRequest,
      budget: resolvedBudget,
      deadline: resolvedDeadline,
      preferredTechnologies: resolvedTech,
      additionalContext: resolvedContext
    });

    // 3. Call Ollama Service with Gemma
    const rawAnalysis = await generateWithGemma(prompt);

    // 4. Validate Structured JSON Response
    const { isValid, data: validatedAnalysis, errors } = validateAndNormalizeAnalysis(rawAnalysis);

    if (!isValid) {
      return res.status(502).json({
        success: false,
        message: 'AI response failed schema validation.',
        errors,
        rawAnalysis
      });
    }

    // 5. Optional Database Persistence (if requested or projectId provided)
    let savedProject = null;

    if (projectId) {
      // Update existing project
      savedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          status: 'analyzed',
          analysis: validatedAnalysis
        },
        { new: true }
      );
    } else if (saveToDb || userId) {
      // Create new project document
      try {
        savedProject = await Project.create({
          userId: userId || undefined,
          title: resolvedTitle,
          clientRequest: resolvedRequest,
          budget: budget ? Number(budget) : undefined,
          deadline: deadline ? new Date(deadline) : undefined,
          status: 'analyzed',
          analysis: validatedAnalysis
        });
      } catch (dbErr) {
        console.warn('Project document could not be saved to MongoDB:', dbErr.message);
        // Continue returning the AI analysis even if MongoDB save had non-fatal error
      }
    }

    // 6. Return Structured Result
    return res.status(200).json({
      success: true,
      message: 'Client project requirements successfully analyzed by Gemma',
      data: {
        title: resolvedTitle,
        analysis: validatedAnalysis,
        ...(savedProject ? { project: savedProject } : {})
      }
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error(`AI Analysis Error [${statusCode}]:`, error.message);

    return res.status(statusCode).json({
      success: false,
      message: error.message,
      ...(error.rawResponse ? { rawResponse: error.rawResponse } : {})
    });
  }
};

/**
 * @desc    Answer freelancer follow-up questions regarding the analyzed project
 * @route   POST /api/ai/follow-up
 * @access  Public
 */
export const askFollowUp = async (req, res) => {
  try {
    const { question, previousAnalysis, projectTitle, chatHistory } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'question' is required."
      });
    }

    const prompt = buildFollowUpPrompt({
      question: question.trim(),
      previousAnalysis,
      projectTitle,
      chatHistory: Array.isArray(chatHistory) ? chatHistory : []
    });

    const answer = await generateFollowUpReply(prompt);

    return res.status(200).json({
      success: true,
      message: 'Follow-up question answered successfully',
      data: {
        question: question.trim(),
        answer
      }
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error(`AI Follow-Up Error [${statusCode}]:`, error.message);

    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

