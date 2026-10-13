import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Sparkles,
  Bot,
  Send,
  Copy,
  Check,
  Clock,
  Coins,
  Layers,
  FileText,
  HelpCircle,
  Code2,
  Server,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Calendar,
  Tag,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  FileCheck,
  GitMerge,
  MessageSquare,
  MessageCircle,
  CornerDownLeft,
  User as UserIcon,
  Zap,
  RotateCcw
} from 'lucide-react';
import FlowchartViewer from './FlowchartViewer.jsx';

const FORMAT_TEMPLATE = `Title: [Project Name / Brief Title]
Description: [Describe client requirements, key features, and user capabilities]
Budget: [Optional client budget, e.g. ₹60,000 INR]
Deadline: [Optional target timeline, e.g. 4 Weeks]
Tech Preferences: [Optional, e.g. React, Node.js, MongoDB]
Additional Notes: [Optional, e.g. Mobile-first design, payment gateway]`;

const SAMPLE_TEMPLATES = [
  {
    label: '🛍️ E-Commerce & Razorpay',
    prompt: `Title: E-Commerce Store for Handmade Organic Jewelry
Description: I want an online store to sell handmade artisan jewelry. Customers should be able to browse items by category, filter by metal type (Silver, Gold, Brass), add to cart, and pay via Razorpay. I also need an admin dashboard where I can add new jewelry pieces, update stock, and view customer orders. Must look elegant, minimal, and load fast on mobile phones.
Budget: ₹65,000 INR
Deadline: 2026-11-20 (approx 4 weeks)
Tech Preferences: React, Node.js, Express, MongoDB, Tailwind CSS
Additional Notes: Client has product photos. Brand aesthetic is earthy luxury.`
  },
  {
    label: '📅 SaaS Appointment Booking',
    prompt: `Title: Clinic & Doctor Appointment Booking Portal
Description: Looking for a patient booking web app for our dental clinic. Patients can select a doctor, choose available time slots from an interactive calendar, enter their contact info, and get email/SMS confirmation. Doctors should have a login to manage their availability, block vacation days, and view daily appointments.
Budget: ₹80,000 INR
Deadline: 2026-12-05 (approx 3 weeks)
Tech Preferences: MERN Stack, SendGrid / Twilio API
Additional Notes: Must prevent double-booking and protect patient privacy.`
  },
  {
    label: '🎓 EdTech Learning Platform',
    prompt: `Title: Video Course & Quiz Platform for Tutors
Description: I am an educator wanting to host my coding courses. Need user authentication, video lesson player with chapter progress tracking, multiple-choice quizzes at the end of each module, and PDF certificate generation upon course completion. Payment integration for 1-time course purchase.
Budget: ₹95,000 INR
Deadline: 2026-12-30 (approx 6 weeks)
Tech Preferences: React, Node.js, MongoDB, Cloudinary / AWS S3
Additional Notes: Needs video playback protection against downloading.`
  }
];

const SUGGESTED_FOLLOW_UPS = [
  '⚡ How can we compress this timeline to 2 weeks for an urgent MVP?',
  '💳 What payment gateways work best if Razorpay verification takes time?',
  '📱 What extra effort is required to add a React Native mobile app?',
  '💰 How can we phase the deliverables if the client has a 30% lower budget?',
  '🛡️ What contract clauses should I add to prevent client scope creep?',
  '⚙️ Why was MongoDB chosen over PostgreSQL for this use case?'
];

export default function AiBotScoper() {
  const [promptText, setPromptText] = useState('');
  const [saveToDb, setSaveToDb] = useState(true);

  const [aiHealth, setAiHealth] = useState({
    isOnline: false,
    activeModel: 'gemma2:2b',
    hasActiveModel: false,
    availableModels: [],
    message: 'Checking AI status...'
  });
  const [isCheckingAi, setIsCheckingAi] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'requirements' | 'techStack' | 'roadmap' | 'flowchart' | 'questions' | 'proposal'
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Follow-up Chat State
  const [chatMessages, setChatMessages] = useState([]); // [{ role: 'user'|'assistant', text: string }]
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);
  const chatEndRef = useRef(null);

  // Check Ollama AI Status
  const checkAiStatus = async () => {
    setIsCheckingAi(true);
    try {
      const res = await axios.get('/api/ai/status').catch(() => {
        return axios.get('http://localhost:5000/api/ai/status');
      });
      if (res.data.success) {
        setAiHealth(res.data.data);
      }
    } catch (err) {
      setAiHealth({
        isOnline: false,
        activeModel: 'gemma2:2b',
        hasActiveModel: false,
        availableModels: [],
        message: 'Could not connect to AI service. Ensure backend is running.'
      });
    } finally {
      setIsCheckingAi(false);
    }
  };

  useEffect(() => {
    checkAiStatus();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isSendingFollowUp]);

  const handleInsertTemplate = () => {
    setPromptText(FORMAT_TEMPLATE);
    setErrorMessage(null);
  };

  const handleApplyTemplate = (tmpl) => {
    setPromptText(tmpl.prompt);
    setErrorMessage(null);
  };

  const handleSubmitAnalysis = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = promptText.trim();
    if (!trimmed || trimmed.length < 15) {
      setErrorMessage(
        'Please enter project details in the prompt box (at least 15 characters). Use the template guide above.'
      );
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress('Connecting to Gemma via Ollama...');
    setChatMessages([]); // Reset chat for new project

    const payload = {
      prompt: trimmed,
      saveToDb
    };

    try {
      setAnalysisProgress('Parsing prompt, extracting requirements, roadmap & flowchart...');
      const res = await axios.post('/api/ai/analyze', payload).catch((err) => {
        return axios.post('http://localhost:5000/api/ai/analyze', payload);
      });

      if (res.data.success && res.data.data) {
        setAnalysisResult(res.data.data);
        setActiveTab('overview');
      }
    } catch (err) {
      const serverMsg =
        err.response?.data?.message || err.message || 'Failed to analyze project with AI.';
      setErrorMessage(serverMsg);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  const handleCopyProposal = () => {
    if (!analysisResult?.analysis?.proposal) return;
    navigator.clipboard.writeText(analysisResult.analysis.proposal);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2500);
  };

  // Follow-up Question Handler
  const handleSendFollowUp = async (e, directText = null) => {
    if (e) e.preventDefault();
    const query = (directText || followUpQuestion).trim();
    if (!query) return;

    if (!analysisResult) {
      setErrorMessage('Please analyze a project first before asking follow-up questions.');
      return;
    }

    // Add user question to stream
    const updatedMessages = [...chatMessages, { role: 'user', text: query }];
    setChatMessages(updatedMessages);
    setFollowUpQuestion('');
    setIsSendingFollowUp(true);

    try {
      const res = await axios
        .post('/api/ai/follow-up', {
          question: query,
          previousAnalysis: analysisResult.analysis,
          projectTitle: analysisResult.title,
          chatHistory: updatedMessages.map((m) => ({ role: m.role, content: m.text }))
        })
        .catch(() => {
          return axios.post('http://localhost:5000/api/ai/follow-up', {
            question: query,
            previousAnalysis: analysisResult.analysis,
            projectTitle: analysisResult.title,
            chatHistory: updatedMessages.map((m) => ({ role: m.role, content: m.text }))
          });
        });

      if (res.data.success && res.data.data?.answer) {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: res.data.data.answer }
        ]);
      }
    } catch (err) {
      // Intelligent fallback demo answer if Ollama isn't running locally yet
      const fallbackReply = generateFallbackFollowUpReply(query, analysisResult);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: fallbackReply,
          isDemoFallback: !aiHealth.isOnline
        }
      ]);
    } finally {
      setIsSendingFollowUp(false);
    }
  };

  // Intelligent fallback answers for testing without Ollama running
  const generateFallbackFollowUpReply = (q, result) => {
    const lower = q.toLowerCase();
    if (lower.includes('timeline') || lower.includes('reduce') || lower.includes('faster') || lower.includes('2 weeks') || lower.includes('mvp')) {
      return `### How to Compress the Timeline to a 2-Week MVP:
1. **Scope Trim**: Launch with basic Stripe/Razorpay standard checkout; defer custom admin analytics to Phase 2.
2. **Pre-built UI Components**: Use Tailwind UI / Radix primitives instead of building custom UI widgets from scratch.
3. **Seed Data**: Have the client prepare CSV/JSON product catalogs in advance so database seeding takes minutes instead of days.
4. **Milestone Target**: 
   - *Week 1*: Auth, Product Grid, and Shopping Cart.
   - *Week 2*: Checkout integration, sandbox payment test, and Vercel/Render deployment.`;
    }
    if (lower.includes('payment') || lower.includes('gateway') || lower.includes('stripe') || lower.includes('razorpay')) {
      return `### Payment Gateway Alternatives & Strategy:
- **Cashfree / PayU**: Fastest alternative KYC approvals in India if Razorpay onboarding experiences merchant delays.
- **Stripe**: Best if the client plans to sell internationally in USD / EUR (supports multi-currency automatically).
- **Recommendation**: Write a modular \`PaymentService\` adapter so you can switch between Razorpay and Cashfree by simply changing an environment variable without refactoring checkout controllers.`;
    }
    if (lower.includes('mobile') || lower.includes('react native') || lower.includes('app')) {
      return `### Extending to React Native Mobile Apps:
- **Shared Codebase**: Since the backend is a REST API built with Express & MongoDB, you can reuse 100% of the API endpoints for both the React Web App and React Native app!
- **State & Logic**: Auth tokens, cart logic, and API calls can be shared directly via utility hooks.
- **Estimated Extra Effort**: Adding Android + iOS apps adds approximately 2.5 to 3 weeks and ₹40,000 - ₹55,000 INR to the project scope.`;
    }
    if (lower.includes('scope creep') || lower.includes('clause') || lower.includes('contract')) {
      return `### Scope-Protection Strategies for Freelancers:
1. **Fixed Revision Cap**: State clearly in the proposal that the budget includes up to 2 rounds of design revisions. Extra features require a formal Change Request.
2. **Phased Sign-Off**: Get written client approval on Phase 2 (Catalog & Cart) before starting Phase 3 (Payment & Admin).
3. **Milestone Payments**: 40% Advance Kickoff, 30% Beta Milestone, 30% Final Handover & Source Code Delivery.`;
    }
    return `### Strategic Recommendation for "${result?.title}":
Regarding **"${q}"**:
- In modern web development, keeping the architecture decoupled allows fast iterations.
- If making this change, update your client agreement to reflect any timeline impact (+/- 3-5 days).
- Ensure error boundaries and logging are configured before rolling out changes to the live environment.`;
  };

  // Demo fallback for instant preview if Ollama is still downloading
  const handleLoadDemoPreview = () => {
    setPromptText(SAMPLE_TEMPLATES[0].prompt);
    setAnalysisResult({
      title: 'E-Commerce Store for Handmade Organic Jewelry',
      analysis: {
        summary:
          'A full-featured e-commerce platform for an artisan jewelry brand featuring custom metal/category filtering, Razorpay payments, persistent shopping cart, and a secure admin inventory management dashboard.',
        requirements: [
          'Functional: Product catalog with filtering by category and metal type (Silver, Gold, Brass)',
          'Functional: Shopping cart, persistent checkout state, and Razorpay payment gateway integration',
          'Functional: Protected Admin dashboard for CRUD operations on jewelry products and order status tracking',
          'Functional: Customer order confirmation emails and order tracking lookup',
          'Non-Functional: Sub-2 second initial page load speed with optimized responsive images',
          'Non-Functional: Mobile-first responsive UI crafted with high-end luxury aesthetics',
          'Non-Functional: Secure JWT authorization for admin endpoints and encrypted transaction logs'
        ],
        techStack: {
          frontend: 'React with Vite - Ultra-fast build times, modular components, and fluid animations',
          backend: 'Node.js & Express - Lightweight REST API with robust security middlewares',
          database: 'MongoDB - Flexible document model ideal for varying product attributes and orders',
          deployment: 'Vercel (Client) & Render (Backend API)',
          additionalTools: 'Razorpay SDK, Cloudinary (Image CDN), Lucide Icons'
        },
        architecture:
          'Three-tier MERN client-server architecture. The React frontend interacts with Express REST endpoints over JSON, MongoDB stores products, orders, and customer queries, and Razorpay webhooks verify payment capture asynchronously.',
        roadmap: [
          'Phase 1 - Planning & Setup (Days 1-3): Architecture design, database schema, and branding system setup',
          'Phase 2 - Product Catalog & Filtering (Days 4-7): Product grid, filtering by metals, and item detail pages',
          'Phase 3 - Cart & Razorpay Integration (Days 8-12): Cart state, Razorpay checkout, and payment confirmation',
          'Phase 4 - Admin Dashboard (Days 13-16): Stock management, product upload form, and order tracking',
          'Phase 5 - QA, Mobile Polish & Handover (Days 17-20): Payment sandbox verification, speed optimization, and launch'
        ],
        missingQuestions: [
          'Do you have an active Razorpay merchant account, GST number, and verified KYC for live payments?',
          'How many initial products and high-resolution images will be uploaded at launch?',
          'Will you be integrating a courier API (e.g., Shiprocket) now or handling shipping manually initially?'
        ],
        timeEstimate: '3 - 4 Weeks (approx. 70 - 85 hours)',
        pricingEstimate: '₹55,000 - ₹75,000 INR',
        proposal: `Dear Client,

Thank you for sharing your project brief for the Handmade Organic Jewelry online store!

Having reviewed your requirements, I would be thrilled to bring this elegant e-commerce experience to life. Your brand deserves a digital storefront that looks minimal, feels luxurious, and converts visitors into loyal customers effortlessly.

Here is what I will deliver for you:
1. Custom-Designed Storefront: Mobile-first, sleek typography, and intuitive filters (Silver, Gold, Brass).
2. Frictionless Checkout: Secure Razorpay payment gateway integration with instant customer order confirmation.
3. Intuitive Admin Dashboard: Effortlessly add new jewelry pieces, manage stock, and track incoming orders.
4. Fast & SEO-Ready: Sub-2 second load times and clean code for high search visibility.

- Estimated Timeline: 3 to 4 Weeks
- Estimated Investment: ₹55,000 - ₹75,000 INR (Milestone-based)

I would love to hop on a brief 15-minute kickoff call this week to review your product catalog and finalize the launch schedule. 

Looking forward to collaborating with you!

Best regards,
Your Freelance Engineering Partner`,
        flowchart: `graph TD;
  A[Client / Visitor Enters Store] --> B[Browse Catalog & Filter by Metal];
  B --> C[Select Product & Add to Cart];
  C --> D[Proceed to Secure Checkout];
  D --> E{Razorpay Payment Processing};
  E -->|Payment Approved| F[Order Stored in MongoDB & Confirmation Sent];
  E -->|Payment Failed| G[Prompt Retry / Alternate Method];
  F --> H[Admin Notified on Inventory Dashboard];
  H --> I[Order Packaged & Dispatched];`,
        flowchartSteps: [
          {
            step: '1',
            actor: 'Customer',
            action: 'Browses catalog and filters by category and metal type (Silver/Gold)',
            outcome: 'Discovers desired jewelry item with real-time stock availability'
          },
          {
            step: '2',
            actor: 'Customer',
            action: 'Adds item to shopping cart and initiates secure checkout',
            outcome: 'Creates pending order intent with line-item breakdown'
          },
          {
            step: '3',
            actor: 'Razorpay Gateway',
            action: 'Processes transaction via UPI, Cards, or NetBanking',
            outcome: 'Sends verified payment capture webhook to Express server'
          },
          {
            step: '4',
            actor: 'MongoDB & Server',
            action: 'Updates stock quantity and stores customer order details',
            outcome: 'Customer receives instant email confirmation receipt'
          },
          {
            step: '5',
            actor: 'Admin Store Manager',
            action: 'Views new order on Admin Dashboard and assigns courier',
            outcome: 'Product dispatched for customer delivery'
          }
        ]
      }
    });
    setActiveTab('overview');
    setErrorMessage(null);
  };

  return (
    <div className="scoper-container">
      {/* AI Engine Status Banner */}
      <div className={`ai-status-card ${aiHealth.isOnline ? 'online' : 'offline'}`}>
        <div className="ai-status-header">
          <div className="ai-status-indicator">
            <div className={`status-dot ${aiHealth.isOnline ? 'online' : 'offline'}`} />
            <div>
              <div className="ai-status-title">
                <strong>Ollama AI Engine:</strong>{' '}
                {aiHealth.isOnline ? (
                  <span className="badge-online">Connected ({aiHealth.activeModel})</span>
                ) : (
                  <span className="badge-offline">Offline / Not Detected</span>
                )}
              </div>
              <p className="ai-status-sub">{aiHealth.message}</p>
            </div>
          </div>

          <div className="ai-status-actions">
            <button
              type="button"
              className="btn-status-refresh"
              onClick={checkAiStatus}
              disabled={isCheckingAi}
              title="Refresh connection status"
            >
              <RefreshCw size={14} className={isCheckingAi ? 'animate-spin' : ''} />
              <span>{isCheckingAi ? 'Checking...' : 'Check Status'}</span>
            </button>
          </div>
        </div>

        {!aiHealth.isOnline && (
          <div className="ai-offline-tips">
            <div className="offline-tip-line">
              <Terminal size={15} />
              <span>
                To run Gemma locally, install Ollama from <strong>ollama.com</strong> and run:
              </span>
              <code>ollama run gemma2:2b</code>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Single Prompt Left, Output Right */}
      <div className="scoper-grid">
        {/* Left Column: Unified Single Prompt Box */}
        <div className="scoper-input-card glass-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="tag-pill">
                <Sparkles size={14} />
                <span>Single-Prompt Scoper</span>
              </div>
              <h2>Project Prompt</h2>
              <p>Provide all project details in one prompt</p>
            </div>
          </div>

          {/* Format Guide Banner with 1-Click Insert */}
          <div className="prompt-format-guide">
            <div className="guide-header">
              <span className="guide-title">
                <FileCheck size={14} color="#818cf8" />
                <span>Recommended Prompt Format:</span>
              </span>
              <button
                type="button"
                className="btn-insert-template"
                onClick={handleInsertTemplate}
                title="Paste formatted structure template into prompt box"
              >
                <span>+ Insert Template</span>
              </button>
            </div>
            <pre className="guide-code">
{`Title: [Project Title]
Description: [Client brief & core features]
Budget: [e.g. ₹60,000 INR (Optional)]
Deadline: [e.g. 4 Weeks (Optional)]
Tech Preferences: [e.g. React, Node.js (Optional)]`}
            </pre>
          </div>

          {/* Quick Example Chips */}
          <div className="template-chips">
            <span className="template-label">Try 1-Click Example Briefs:</span>
            <div className="template-buttons">
              {SAMPLE_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="template-btn"
                  onClick={() => handleApplyTemplate(tmpl)}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="alert alert-error">
              <AlertTriangle size={18} />
              <div>
                <strong>Notice:</strong> {errorMessage}
                {!aiHealth.isOnline && (
                  <div style={{ marginTop: '0.4rem' }}>
                    <button
                      type="button"
                      className="btn-demo-trigger"
                      onClick={handleLoadDemoPreview}
                    >
                      ⚡ Click to Load Full Demo Preview (Skip Ollama)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitAnalysis}>
            <div className="form-group">
              <label className="form-label" htmlFor="unified-prompt">
                All-in-One Client Request Prompt <span className="text-required">*</span>
              </label>
              <textarea
                id="unified-prompt"
                name="prompt"
                className="form-textarea unified-prompt-area"
                rows={11}
                placeholder={`Paste your entire client project request here in one prompt...

Example:
Title: E-Commerce Store for Organic Skincare
Description: Client wants an online storefront with Razorpay checkout, product filters by skin type, cart, and admin inventory control.
Budget: ₹50,000 INR
Deadline: 3 Weeks
Tech: React, Node.js, MongoDB`}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                required
              />
              <div className="char-count">
                {promptText.length} characters
              </div>
            </div>

            <div className="checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={saveToDb}
                  onChange={(e) => setSaveToDb(e.target.checked)}
                />
                <span>Save analysis to MongoDB <code>Project</code> collection</span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary btn-submit-ai"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Analyzing with Gemma AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Analyze Prompt with Gemma AI</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleLoadDemoPreview}
                title="Preview output without running AI"
              >
                <span>Preview Demo Output</span>
              </button>
            </div>

            {isAnalyzing && (
              <div className="analyzing-status-box">
                <div className="pulsing-radar" />
                <p>{analysisProgress}</p>
                <small>Local model inference running on Gemma 2B via Ollama</small>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: AI Analysis Result Display + Follow-Up Chat */}
        <div className="scoper-output-card glass-card">
          {!analysisResult ? (
            <div className="empty-analysis-state">
              <div className="empty-icon-circle">
                <Bot size={44} color="#818cf8" />
              </div>
              <h3>Ready to Scope Your Next Project</h3>
              <p>
                Give all your project requirements in a single prompt on the left. The bot will
                extract features, recommend tech stacks, estimate timelines and INR pricing,
                generate a flowchart, and let you ask interactive follow-up questions!
              </p>
              <div className="empty-feature-bullets">
                <div className="feature-bullet">
                  <CheckCircle2 size={16} color="#34d399" />
                  <span>Single-Prompt Ingestion (Title, Scope, Budget, Tech)</span>
                </div>
                <div className="feature-bullet">
                  <CheckCircle2 size={16} color="#34d399" />
                  <span>Interactive Architecture & Workflow Flowchart</span>
                </div>
                <div className="feature-bullet">
                  <CheckCircle2 size={16} color="#34d399" />
                  <span>INR Pricing (₹) & Step-by-Step Roadmap</span>
                </div>
                <div className="feature-bullet">
                  <CheckCircle2 size={16} color="#34d399" />
                  <span>Ask Interactive Follow-Up Questions Afterwards</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary btn-get-started"
                onClick={() => handleApplyTemplate(SAMPLE_TEMPLATES[0])}
              >
                Load Jewelry E-Commerce Example
              </button>
            </div>
          ) : (
            <div className="analysis-content-wrapper">
              {/* Header with Title and Estimates */}
              <div className="analysis-header">
                <div>
                  <div className="analysis-tag">
                    <CheckCircle2 size={14} color="#34d399" />
                    <span>Analysis Complete • Gemma 2B</span>
                  </div>
                  <h2 className="analysis-project-title">{analysisResult.title}</h2>
                </div>

                <div className="metrics-badges">
                  <div className="metric-pill time">
                    <Clock size={16} />
                    <div>
                      <small>Estimated Time</small>
                      <strong>{analysisResult.analysis.timeEstimate}</strong>
                    </div>
                  </div>

                  <div className="metric-pill price">
                    <Coins size={16} />
                    <div>
                      <small>Suggested Pricing</small>
                      <strong>{analysisResult.analysis.pricingEstimate}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Bar */}
              <div className="analysis-tabs-nav">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <FileText size={16} />
                  <span>Overview</span>
                </button>

                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'requirements' ? 'active' : ''}`}
                  onClick={() => setActiveTab('requirements')}
                >
                  <Layers size={16} />
                  <span>
                    Requirements ({analysisResult.analysis.requirements?.length || 0})
                  </span>
                </button>

                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'techStack' ? 'active' : ''}`}
                  onClick={() => setActiveTab('techStack')}
                >
                  <Code2 size={16} />
                  <span>Tech Stack</span>
                </button>

                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
                  onClick={() => setActiveTab('roadmap')}
                >
                  <Clock size={16} />
                  <span>Roadmap ({analysisResult.analysis.roadmap?.length || 0})</span>
                </button>

                <button
                  type="button"
                  className={`tab-btn tab-btn-flowchart ${activeTab === 'flowchart' ? 'active' : ''}`}
                  onClick={() => setActiveTab('flowchart')}
                >
                  <GitMerge size={16} />
                  <span>Flowchart</span>
                </button>

                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('questions')}
                >
                  <HelpCircle size={16} />
                  <span>Clarifications</span>
                </button>

                <button
                  type="button"
                  className={`tab-btn tab-btn-highlight ${activeTab === 'proposal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('proposal')}
                >
                  <Send size={16} />
                  <span>Proposal</span>
                </button>
              </div>

              {/* Tab Content Panels */}
              <div className="tab-panel-container">
                {/* 1. Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="panel-tab-content fade-in">
                    <div className="panel-section">
                      <h3>Executive Summary</h3>
                      <p className="summary-paragraph">
                        {analysisResult.analysis.summary}
                      </p>
                    </div>

                    <div className="panel-section">
                      <h3>Architecture Overview</h3>
                      <div className="architecture-box">
                        <Server size={20} color="#818cf8" />
                        <p>{analysisResult.analysis.architecture}</p>
                      </div>
                    </div>

                    <div className="panel-grid-2col">
                      <div className="mini-summary-card">
                        <h4>Key Deliverables</h4>
                        <ul>
                          {analysisResult.analysis.requirements?.slice(0, 4).map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mini-summary-card">
                        <h4>Sprint Highlights</h4>
                        <ul>
                          {analysisResult.analysis.roadmap?.slice(0, 3).map((phase, i) => (
                            <li key={i}>{phase}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="panel-section" style={{ marginTop: '1.25rem' }}>
                      <div className="overview-flowchart-card">
                        <div className="flowchart-cta-left">
                          <div className="flowchart-cta-icon">
                            <GitMerge size={22} color="#818cf8" />
                          </div>
                          <div>
                            <h4>System Process & User Journey Flowchart</h4>
                            <p>Visual architecture and sequential workflow designed for client clarity.</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-view-flowchart"
                          onClick={() => setActiveTab('flowchart')}
                        >
                          <span>Explore Flowchart</span>
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Requirements Tab */}
                {activeTab === 'requirements' && (
                  <div className="panel-tab-content fade-in">
                    <div className="requirements-list">
                      {analysisResult.analysis.requirements?.map((req, idx) => {
                        const isNonFunc = req.toLowerCase().startsWith('non-functional');
                        return (
                          <div
                            key={idx}
                            className={`requirement-item ${isNonFunc ? 'non-func' : 'func'}`}
                          >
                            <div className="req-icon">
                              <CheckCircle2
                                size={18}
                                color={isNonFunc ? '#38bdf8' : '#34d399'}
                              />
                            </div>
                            <div className="req-text">
                              <span className="req-badge">
                                {isNonFunc ? 'Non-Functional' : 'Functional'}
                              </span>
                              <p>
                                {req.replace(/^functional:\s*/i, '').replace(/^non-functional:\s*/i, '')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Tech Stack Tab */}
                {activeTab === 'techStack' && (
                  <div className="panel-tab-content fade-in">
                    <div className="tech-stack-grid">
                      {analysisResult.analysis.techStack &&
                        Object.entries(analysisResult.analysis.techStack).map(([layer, desc], idx) => (
                          <div key={idx} className="tech-card">
                            <div className="tech-card-header">
                              {layer.toLowerCase().includes('front') ? (
                                <Code2 size={20} color="#38bdf8" />
                              ) : layer.toLowerCase().includes('back') ? (
                                <Server size={20} color="#818cf8" />
                              ) : layer.toLowerCase().includes('data') ? (
                                <Database size={20} color="#34d399" />
                              ) : layer.toLowerCase().includes('deploy') ? (
                                <Cloud size={20} color="#c084fc" />
                              ) : (
                                <Layers size={20} color="#fbbf24" />
                              )}
                              <h4>{layer.toUpperCase()}</h4>
                            </div>
                            <p>{desc}</p>
                          </div>
                        ))}
                    </div>

                    <div className="panel-section" style={{ marginTop: '1.5rem' }}>
                      <h3>System Architecture Blueprint</h3>
                      <div className="architecture-box">
                        <Server size={20} color="#818cf8" />
                        <p>{analysisResult.analysis.architecture}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Roadmap Tab */}
                {activeTab === 'roadmap' && (
                  <div className="panel-tab-content fade-in">
                    <div className="roadmap-timeline">
                      {analysisResult.analysis.roadmap?.map((step, idx) => (
                        <div key={idx} className="timeline-item">
                          <div className="timeline-marker">
                            <span>{idx + 1}</span>
                          </div>
                          <div className="timeline-content">
                            <p>{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Flowchart & Architecture Tab */}
                {activeTab === 'flowchart' && (
                  <div className="panel-tab-content fade-in">
                    <FlowchartViewer
                      flowchartCode={analysisResult.analysis.flowchart}
                      flowchartSteps={analysisResult.analysis.flowchartSteps}
                      title={analysisResult.title}
                    />
                  </div>
                )}

                {/* 6. Questions Tab */}
                {activeTab === 'questions' && (
                  <div className="panel-tab-content fade-in">
                    <div className="callout-box">
                      <HelpCircle size={20} color="#f59e0b" />
                      <div>
                        <strong>Prevent Scope Creep:</strong>
                        <p>
                          Clarify these details with your client before sending the final invoice
                          or beginning development.
                        </p>
                      </div>
                    </div>

                    <div className="questions-list">
                      {analysisResult.analysis.missingQuestions?.map((q, idx) => (
                        <div key={idx} className="question-item">
                          <div className="question-number">Q{idx + 1}</div>
                          <p>{q}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Proposal Tab */}
                {activeTab === 'proposal' && (
                  <div className="panel-tab-content fade-in">
                    <div className="proposal-header-action">
                      <div>
                        <h3>Client-Ready Proposal Letter</h3>
                        <p>Personalized proposal ready to send to your client via email or Upwork.</p>
                      </div>

                      <button
                        type="button"
                        className="btn-copy-proposal"
                        onClick={handleCopyProposal}
                      >
                        {copiedProposal ? (
                          <>
                            <Check size={16} color="#34d399" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            <span>Copy Proposal</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="proposal-card-box">
                      <pre className="proposal-text">
                        {analysisResult.analysis.proposal}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* ==========================================================
                  Interactive Follow-up Chat & Clarification Section
                  ========================================================== */}
              <section className="followup-chat-section">
                <div className="chat-section-header">
                  <div className="chat-title-group">
                    <MessageSquare size={18} color="#818cf8" />
                    <div>
                      <h3>Ask Follow-Up Questions</h3>
                      <p>Have questions about scope, tech choices, or adjusting the budget? Ask Gemma below!</p>
                    </div>
                  </div>
                </div>

                {/* Quick Suggested Questions */}
                <div className="suggested-chips-container">
                  <span className="suggested-chips-label">Suggested follow-ups:</span>
                  <div className="suggested-chips-list">
                    {SUGGESTED_FOLLOW_UPS.map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        className="chip-btn"
                        onClick={(e) => handleSendFollowUp(e, q)}
                        disabled={isSendingFollowUp}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Message Stream */}
                {chatMessages.length > 0 && (
                  <div className="chat-messages-stream">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`chat-bubble-row ${msg.role === 'user' ? 'user' : 'assistant'}`}
                      >
                        <div className="chat-avatar">
                          {msg.role === 'user' ? (
                            <UserIcon size={16} />
                          ) : (
                            <Bot size={16} color="#818cf8" />
                          )}
                        </div>
                        <div className="chat-bubble-content">
                          <div className="chat-sender-label">
                            {msg.role === 'user' ? 'You' : 'FreelancerMate AI (Gemma)'}
                            {msg.isDemoFallback && (
                              <span className="demo-badge">Demo Mode</span>
                            )}
                          </div>
                          <div className="chat-bubble-text">
                            <pre className="chat-pre-text">{msg.text}</pre>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isSendingFollowUp && (
                      <div className="chat-bubble-row assistant">
                        <div className="chat-avatar">
                          <Bot size={16} color="#818cf8" />
                        </div>
                        <div className="chat-bubble-content">
                          <div className="chat-sender-label">FreelancerMate AI</div>
                          <div className="chat-typing-indicator">
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Consulting Gemma for your follow-up...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}

                {/* Follow-up Question Input Form */}
                <form onSubmit={handleSendFollowUp} className="followup-input-form">
                  <div className="followup-input-wrapper">
                    <input
                      type="text"
                      className="followup-input"
                      placeholder="e.g. Can we swap MongoDB for PostgreSQL? How can we reduce timeline to 2 weeks?"
                      value={followUpQuestion}
                      onChange={(e) => setFollowUpQuestion(e.target.value)}
                      disabled={isSendingFollowUp}
                    />
                    <button
                      type="submit"
                      className="btn-send-followup"
                      disabled={isSendingFollowUp || !followUpQuestion.trim()}
                      title="Send follow-up question"
                    >
                      {isSendingFollowUp ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
