import express from 'express';
import { analyzeProject, getAiStatus, askFollowUp } from '../controllers/aiController.js';

const router = express.Router();

// GET /api/ai/status - Verify Ollama daemon and Gemma model status
router.get('/status', getAiStatus);

// POST /api/ai/analyze - Analyze project brief with Gemma (supports unified prompt or individual fields)
router.post('/analyze', analyzeProject);

// POST /api/ai/follow-up - Ask conversational follow-up questions about analyzed project
router.post('/follow-up', askFollowUp);

export default router;
