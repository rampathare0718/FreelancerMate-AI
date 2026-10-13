/**
 * Prompt Service
 * Responsible for constructing AI prompts and validating structured AI output.
 */

/**
 * Builds the structured prompt for Gemma to analyze client project requests.
 * @param {Object} params
 * @param {string} params.title - Project title
 * @param {string} params.clientRequest - Raw client requirements
 * @param {number|string} [params.budget] - Client budget
 * @param {string|Date} [params.deadline] - Project deadline
 * @param {string|string[]} [params.preferredTechnologies] - Preferred technologies
 * @param {string} [params.additionalContext] - Extra notes or context
 * @returns {string} Fully formatted prompt string
 */
export const buildAnalysisPrompt = ({
  title,
  clientRequest,
  budget,
  deadline,
  preferredTechnologies,
  additionalContext
}) => {
  const formattedTech = Array.isArray(preferredTechnologies)
    ? preferredTechnologies.join(', ')
    : preferredTechnologies || 'Open to expert recommendation';

  const formattedBudget = budget
    ? `₹${budget} INR (or equivalent)`
    : 'Not specified by client (estimate standard market pricing in INR)';

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString()
    : 'Not specified / Flexible';

  return `You are an elite freelance technical consultant, solutions architect, and project strategist.
A freelancer received a project inquiry from a client. Your job is to thoroughly analyze the client's request and generate a complete, high-value project scoping document.

### PROJECT DETAILS PROVIDED BY CLIENT:
- **Project Title**: ${title}
- **Client Requirements / Brief**:
"""
${clientRequest}
"""
- **Client Stated Budget**: ${formattedBudget}
- **Client Stated Deadline**: ${formattedDeadline}
- **Preferred Technologies**: ${formattedTech}
- **Additional Context / Constraints**: ${additionalContext || 'None provided'}

### INSTRUCTIONS:
1. Break down the project into clear functional and non-functional requirements.
2. Recommend an optimal, modern tech stack suited for the project scale and explain why each technology is chosen.
3. Provide a clear system architecture description.
4. Construct a phased, milestone-based development roadmap.
5. Identify ambiguities or missing details and list questions the freelancer must ask the client to clarify scope.
6. Provide an honest, realistic development time estimate.
7. Provide an approximate freelance pricing estimate in Indian Rupees (INR) reflecting industry rates.
8. Write a polite, persuasive, and professional proposal letter that the freelancer can directly send to the client.

### REQUIRED OUTPUT FORMAT:
You MUST output ONLY a valid JSON object matching the schema below. Do NOT include markdown code blocks, do NOT add introductory text, and do NOT add any closing remarks.

{
  "summary": "A concise executive summary of the project scope, goals, and solution (2-4 sentences).",
  "requirements": [
    "Functional: Feature or user capability description",
    "Functional: Another specific feature",
    "Non-Functional: Performance, security, or responsive design standard"
  ],
  "techStack": {
    "frontend": "Recommended framework/library and specific reason",
    "backend": "Recommended server runtime/framework and reason",
    "database": "Recommended database and reason",
    "deployment": "Recommended hosting/cloud platform and reason",
    "additionalTools": "Key libraries, auth, or 3rd party APIs"
  },
  "architecture": "High-level architectural overview describing component interactions, APIs, and data flow.",
  "roadmap": [
    "Phase 1 - Planning & Setup: Milestones and deliverables",
    "Phase 2 - Core MVP Development: Milestones and deliverables",
    "Phase 3 - Polish, Testing & Deployment: Milestones and deliverables"
  ],
  "missingQuestions": [
    "Specific question to clarify requirement ambiguity with the client",
    "Another question to protect the freelancer against scope creep"
  ],
  "timeEstimate": "e.g., 3 - 4 Weeks (approx. 70-90 hours)",
  "pricingEstimate": "e.g., ₹45,000 - ₹65,000 INR",
  "proposal": "Professional, polite client proposal starting with greeting, demonstrating understanding of their goals, highlighting the approach, timeline, and inviting a kickoff discussion."
}`;
};

/**
 * Validates and normalizes the parsed JSON response from the AI model.
 * Ensures all expected fields exist and match expected types before returning to frontend.
 * @param {Object} rawData - Parsed JSON object from Gemma
 * @returns {{ isValid: boolean, data: Object, errors: string[] }}
 */
export const validateAndNormalizeAnalysis = (rawData) => {
  const errors = [];

  if (!rawData || typeof rawData !== 'object') {
    return {
      isValid: false,
      data: null,
      errors: ['AI response is not a valid JSON object']
    };
  }

  // Helper to ensure string
  const cleanString = (val, fallback = '') =>
    typeof val === 'string' && val.trim() ? val.trim() : fallback;

  // Helper to ensure array of strings
  const cleanStringArray = (val, fallback = []) => {
    if (Array.isArray(val)) {
      return val
        .map((item) => (typeof item === 'string' ? item.trim() : JSON.stringify(item)))
        .filter(Boolean);
    }
    if (typeof val === 'string' && val.trim()) {
      return [val.trim()];
    }
    return fallback;
  };

  // Helper to ensure object
  const cleanObject = (val, fallback = {}) => {
    return val && typeof val === 'object' && !Array.isArray(val) ? val : fallback;
  };

  const normalized = {
    summary: cleanString(rawData.summary, 'Project summary generated based on client requirements.'),
    requirements: cleanStringArray(rawData.requirements, [
      'Functional: Core application features per client specification',
      'Non-Functional: Responsive, secure, and reliable user experience'
    ]),
    techStack: cleanObject(rawData.techStack, {
      frontend: 'React / Next.js',
      backend: 'Node.js / Express',
      database: 'MongoDB',
      deployment: 'Vercel / Render'
    }),
    architecture: cleanString(
      rawData.architecture,
      'Modular client-server architecture with RESTful communication.'
    ),
    roadmap: cleanStringArray(rawData.roadmap, [
      'Phase 1: Project setup and architectural foundations',
      'Phase 2: Core feature implementation',
      'Phase 3: Testing, refinement, and final delivery'
    ]),
    missingQuestions: cleanStringArray(rawData.missingQuestions, [
      'What is your target launch date?',
      'Are there existing brand assets, design systems, or third-party APIs to integrate?'
    ]),
    timeEstimate: cleanString(rawData.timeEstimate, '2 - 4 Weeks'),
    pricingEstimate: cleanString(rawData.pricingEstimate, '₹35,000 - ₹50,000 INR'),
    proposal: cleanString(
      rawData.proposal,
      'Thank you for sharing your project requirements. Based on the scope outlined, I have prepared a detailed execution plan.'
    )
  };

  // Check critical fields
  if (!rawData.summary && !rawData.requirements) {
    errors.push('Model output missing both summary and requirements.');
  }

  return {
    isValid: errors.length === 0,
    data: normalized,
    errors
  };
};
