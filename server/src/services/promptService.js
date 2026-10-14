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
9. Create an intuitive system & user journey flowchart. Provide both a valid Mermaid.js flowchart string (using "graph TD") and structured sequential steps to give the client complete clarity.

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
  "proposal": "Professional, polite client proposal starting with greeting, demonstrating understanding of their goals, highlighting the approach, timeline, and inviting a kickoff discussion.",
  "flowchart": "graph TD;\n  A[Client / User Request] --> B[Frontend Interface];\n  B --> C[API Server & Validation];\n  C --> D[(MongoDB Database)];\n  C --> E[3rd Party Services / Payments];\n  D --> F[Response to User];",
  "flowchartSteps": [
    {
      "step": "1",
      "actor": "Client / User",
      "action": "Initiates action on client application",
      "outcome": "Sends secure request to backend API"
    },
    {
      "step": "2",
      "actor": "Backend Service",
      "action": "Authenticates and executes business logic",
      "outcome": "Queries or updates database record"
    },
    {
      "step": "3",
      "actor": "Database / Integration",
      "action": "Performs persistence or external API communication",
      "outcome": "Confirms data integrity and returns response"
    }
  ]
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
    ),
    flowchart: cleanString(
      rawData.flowchart,
      `graph TD;
  A[Client Request / Brief] --> B[Frontend Interface];
  B --> C[API Server & Validation];
  C --> D[(MongoDB Database)];
  C --> E[External Services & APIs];
  D --> F[Success Response to User];`
    ),
    flowchartSteps: Array.isArray(rawData.flowchartSteps) && rawData.flowchartSteps.length > 0
      ? rawData.flowchartSteps.map((step, idx) => ({
          step: String(step.step || idx + 1),
          actor: cleanString(step.actor, 'System Actor'),
          action: cleanString(step.action, 'Executes workflow action'),
          outcome: cleanString(step.outcome, 'Proceeds to next milestone')
        }))
      : [
          {
            step: '1',
            actor: 'End User / Client',
            action: 'Submits project brief or triggers feature action',
            outcome: 'Sends request to backend API'
          },
          {
            step: '2',
            actor: 'Backend Server',
            action: 'Validates input and applies business logic',
            outcome: 'Queries database or invokes third-party integration'
          },
          {
            step: '3',
            actor: 'Database / MongoDB',
            action: 'Stores structured data and verifies transaction integrity',
            outcome: 'Returns verified record to frontend UI'
          }
        ]
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

/**
 * Parses a single unified prompt containing structured key-value lines
 * or free-form text into individual project fields.
 * @param {string} text - Raw input prompt
 * @returns {Object} Extracted project attributes
 */
export const parseUnifiedPrompt = (text) => {
  if (!text || typeof text !== 'string') return {};

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const result = {
    title: '',
    clientName: '',
    clientRequest: '',
    budget: undefined,
    deadline: undefined,
    preferredTechnologies: undefined,
    additionalContext: undefined
  };

  let currentKey = null;
  const sections = {};

  for (const line of lines) {
    const match = line.match(
      /^(owner|client|client\s*name|customer|title|project\s*title|description|requirements|brief|budget|deadline|timeline|tech|technologies|stack|notes|context)\s*[:=-]\s*(.*)$/i
    );
    if (match) {
      const rawKey = match[1].toLowerCase().replace(/\s+/g, '');
      const content = match[2].trim();

      if (rawKey.includes('client') || rawKey.includes('owner') || rawKey.includes('customer'))
        currentKey = 'client';
      else if (rawKey.includes('title')) currentKey = 'title';
      else if (rawKey.includes('desc') || rawKey.includes('require') || rawKey.includes('brief'))
        currentKey = 'description';
      else if (rawKey.includes('budget')) currentKey = 'budget';
      else if (rawKey.includes('deadline') || rawKey.includes('time')) currentKey = 'deadline';
      else if (rawKey.includes('tech') || rawKey.includes('stack')) currentKey = 'tech';
      else if (rawKey.includes('note') || rawKey.includes('context')) currentKey = 'context';

      sections[currentKey] =
        (sections[currentKey] || '') + (content ? (sections[currentKey] ? '\n' : '') + content : '');
    } else if (currentKey) {
      sections[currentKey] = (sections[currentKey] || '') + '\n' + line;
    }
  }

  if (sections.client) result.clientName = sections.client.trim();
  if (sections.title) result.title = sections.title.trim();
  if (sections.description) result.clientRequest = sections.description.trim();
  if (sections.budget) {
    const num = sections.budget.replace(/[^0-9]/g, '');
    if (num) result.budget = Number(num);
  }
  if (sections.deadline) result.deadline = sections.deadline.trim();
  if (sections.tech) result.preferredTechnologies = sections.tech.trim();
  if (sections.context) result.additionalContext = sections.context.trim();

  // If no labeled headers were found, treat first line as title and remaining as description
  if (!result.title && !result.clientRequest) {
    if (lines.length > 0) {
      result.title = lines[0].replace(/^#+\s*/, '').slice(0, 80);
      result.clientRequest = lines.slice(1).join('\n').trim() || lines[0];
    }
  } else if (!result.title && result.clientRequest) {
    result.title = result.clientRequest.split('\n')[0].slice(0, 60) || 'Client Project Request';
  } else if (result.title && !result.clientRequest) {
    result.clientRequest = result.title;
  }

  return result;
};

/**
 * Builds the prompt for Gemma to answer follow-up questions about a project.
 * @param {Object} params
 * @param {string} params.question - Follow-up question from freelancer
 * @param {Object} [params.previousAnalysis] - Existing analysis context
 * @param {string} [params.projectTitle] - Project title
 * @param {Array} [params.chatHistory] - Array of previous messages [{role, content}]
 * @returns {string} Formatted follow-up prompt
 */
export const buildFollowUpPrompt = ({
  question,
  previousAnalysis,
  projectTitle,
  chatHistory = []
}) => {
  const analysisContext = previousAnalysis
    ? `
### EXISTING PROJECT ANALYSIS CONTEXT:
- **Project Title**: ${projectTitle || 'Project'}
- **Summary**: ${previousAnalysis.summary || 'N/A'}
- **Tech Stack**: ${JSON.stringify(previousAnalysis.techStack || {})}
- **Requirements**: ${(previousAnalysis.requirements || []).join('; ')}
- **Estimated Timeline**: ${previousAnalysis.timeEstimate || 'N/A'}
- **Estimated Pricing**: ${previousAnalysis.pricingEstimate || 'N/A'}
`
    : '';

  const formattedHistory =
    chatHistory && chatHistory.length > 0
      ? `\n### PREVIOUS CONVERSATION:\n${chatHistory
          .map((m) => `${m.role === 'user' ? 'Freelancer' : 'AI Assistant'}: ${m.content}`)
          .join('\n')}\n`
      : '';

  return `You are FreelancerMate AI, a senior solutions architect and veteran freelance strategy consultant.
You are helping a freelancer scope, refine, and deliver a client project.

${analysisContext}
${formattedHistory}

### FREELANCER'S FOLLOW-UP QUESTION:
"${question}"

### INSTRUCTIONS:
- Answer the freelancer's question directly, practically, and professionally.
- Provide clear technical details, trade-offs, code considerations, or client communication tips where relevant.
- Keep the response organized with clear headings or bullet points if explaining multiple items.
- If the freelancer is asking to adjust the scope, timeline, tech stack, or budget, provide clear recommendations and rationale.`;
};

