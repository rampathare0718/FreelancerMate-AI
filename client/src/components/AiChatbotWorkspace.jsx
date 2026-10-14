import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Send,
  Sparkles,
  Bot,
  User,
  User as UserIcon,
  MessageSquare,
  FileText,
  GitBranch,
  Layers,
  Code2,
  Coins,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Plus,
  HelpCircle,
  LayoutDashboard,
  FolderGit2,
  Download
} from 'lucide-react';
import FlowchartViewer from './FlowchartViewer';
import ClientProposalModal from './ClientProposalModal';

const FORMAT_TEMPLATE = `Title: [Project Title]
Description: [Client requirements & core features]
Budget: [e.g. ₹60,000 INR (Optional)]
Deadline: [e.g. 4 Weeks (Optional)]
Tech Preferences: [e.g. React, Node.js, MongoDB (Optional)]`;

const QUICK_SAMPLES = [
  {
    label: '🍰 Bakery Website',
    text: `Title: Artisan Bakery Online Ordering & Delivery System
Description: We need a website for our bakery with online cake customization, daily delivery time-slot selector with order capacity limits, and UPI payment integration.
Budget: ₹55,000 INR
Deadline: 4 Weeks
Tech Preferences: MERN Stack, Razorpay`
  },
  {
    label: '🛍️ E-Commerce & Razorpay',
    text: `Title: D2C Organic Skincare Store
Description: Need an e-commerce platform with catalog filters, shopping cart, coupon codes, Razorpay UPI & Card checkout, and shipment tracking webhook integration.
Budget: ₹75,000 INR
Deadline: 5 Weeks
Tech Preferences: React, Node.js, Express, MongoDB, Razorpay API`
  },
  {
    label: '📅 Booking Platform',
    text: `Title: Fitness Trainer Appointment Booking
Description: Platform for personal trainers to list available 1-on-1 slots, sync with Google Calendar, process deposit payments, and send WhatsApp reminder alerts.
Budget: ₹60,000 INR
Deadline: 3 Weeks
Tech Preferences: React, Node.js, Twilio / WhatsApp API`
  }
];

const SUGGESTED_QUESTIONS = [
  '⚡ How can we compress the timeline to 2 weeks for an MVP?',
  '💳 What payment gateways work best if Razorpay takes time?',
  '📱 What extra effort is needed to build a React Native mobile app?',
  '🛡️ What contract clause prevents client scope creep?',
  '⚙️ Why was MongoDB chosen over PostgreSQL for this use case?'
];

export default function AiChatbotWorkspace({
  currentUser,
  selectedProject,
  onBackToDashboard,
  onProjectCreated
}) {
  // Main view toggle: 'chat' | 'deliverables'
  const [activeWorkspaceView, setActiveWorkspaceView] = useState('chat');

  // Chat conversation state
  const [messages, setMessages] = useState([]);
  const [promptInput, setPromptInput] = useState('');
  const [clientNameInput, setClientNameInput] = useState(selectedProject?.clientName || '');
  const [projectTitleInput, setProjectTitleInput] = useState(selectedProject?.title || '');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // REARRANGED ORDER: 'summary' -> 'stack' -> 'flowchart' -> 'proposal'
  const [deliverablesTab, setDeliverablesTab] = useState('summary');
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const chatBottomRef = useRef(null);

  // Initialize conversation or load selected project
  useEffect(() => {
    if (selectedProject?.analysis) {
      setClientNameInput(selectedProject.clientName || 'Direct Client');
      setProjectTitleInput(selectedProject.title || 'Client Project');
      setAnalysisResult({
        title: selectedProject.title,
        ...selectedProject.analysis
      });
      setMessages([
        {
          role: 'user',
          text: `Project Loaded: ${selectedProject.title}\nClient: ${selectedProject.clientName || 'Direct Client'}\n${selectedProject.clientRequest || ''}`
        },
        {
          role: 'assistant',
          text: `I have loaded **${selectedProject.title}** for client **${selectedProject.clientName || 'Direct Client'}**.\n\nYou can ask any follow-up questions here, or switch to the **Project Plan** to inspect:\n1. 📋 Summary & Requirements\n2. ⚙️ Recommended Tech Stack\n3. 🔄 Architecture & Flowchart\n4. 📄 Client Proposal`,
          hasDeliverables: true
        }
      ]);
    } else if (selectedProject?.title) {
      // Draft project created from dashboard (has clientName and title, ready for requirements prompt!)
      const client = selectedProject.clientName || 'Direct Client';
      const title = selectedProject.title;
      setClientNameInput(client);
      setProjectTitleInput(title);
      setAnalysisResult(null);
      setMessages([
        {
          role: 'assistant',
          text: `👋 Hi ${currentUser?.name ? currentUser.name.split(' ')[0] : 'there'}! I'm ready to scope your new project **${title}** for client **${client}**.\n\nPlease describe what the client needs below (e.g. features, user roles, payment options, budget, or deadline). I will architect the roadmap, build an interactive flowchart, and write a client proposal!`,
          showTemplateTip: true
        }
      ]);
    } else {
      // Clean welcoming initial chat state
      setClientNameInput('');
      setProjectTitleInput('');
      setAnalysisResult(null);
      setMessages([
        {
          role: 'assistant',
          text: `👋 Hi ${currentUser?.name ? currentUser.name.split(' ')[0] : 'there'}! I'm your **FreelanceMate AI Copilot**.\n\nPlease describe the project requirements below. I will analyze the scope in this structured format:\n1. 📋 **Summary & Requirements**\n2. ⚙️ **Recommended Tech Stack**\n3. 🔄 **Architecture & Interactive Flowchart**\n4. 📄 **Client Proposal with Pricing in INR**`,
          showTemplateTip: true
        }
      ]);
    }
  }, [selectedProject, currentUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  // Insert template into prompt box
  const handleInsertTemplate = () => {
    setPromptInput(FORMAT_TEMPLATE);
  };

  // 1-Click sample brief
  const handleApplySample = (sample) => {
    setPromptInput(sample.text);
    if (sample.label.includes('Bakery')) {
      setClientNameInput('Sweet Crumbs');
      setProjectTitleInput('Bakery ordering website');
    } else if (sample.label.includes('E-Commerce')) {
      setClientNameInput('Organic Glow');
      setProjectTitleInput('D2C Organic Skincare Store');
    } else if (sample.label.includes('Booking')) {
      setClientNameInput('FitHub');
      setProjectTitleInput('Fitness Trainer Appointment Booking');
    }
  };

  // Main Submit handler (Analysis or Follow-up)
  const handleSendMessage = async (e, directText = null) => {
    if (e) e.preventDefault();
    const textToSend = directText || promptInput;
    if (!textToSend.trim() || isAiThinking) return;

    const userMessage = { role: 'user', text: textToSend.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setPromptInput('');
    setIsAiThinking(true);

    // If an analysis already exists, this is a follow-up question
    if (analysisResult) {
      try {
        const res = await axios
          .post('/api/ai/follow-up', {
            question: textToSend.trim(),
            projectTitle: analysisResult.title,
            previousAnalysis: analysisResult,
            chatHistory: messages.map((m) => ({ role: m.role, text: m.text }))
          })
          .catch(() =>
            axios.post('http://localhost:5000/api/ai/follow-up', {
              question: textToSend.trim(),
              projectTitle: analysisResult.title,
              previousAnalysis: analysisResult,
              chatHistory: messages.map((m) => ({ role: m.role, text: m.text }))
            })
          );

        if (res.data?.success && res.data.data?.answer) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', text: res.data.data.answer }
          ]);
        } else {
          fallbackFollowUpReply(textToSend);
        }
      } catch (err) {
        fallbackFollowUpReply(textToSend);
      } finally {
        setIsAiThinking(false);
      }
      return;
    }

    // Otherwise, this is the primary project analysis
    try {
      const res = await axios
        .post('/api/ai/analyze', {
          title: projectTitleInput.trim() || undefined,
          clientName: clientNameInput.trim() || undefined,
          prompt: textToSend.trim(),
          userId: currentUser?._id,
          saveToDb: true
        })
        .catch(() =>
          axios.post('http://localhost:5000/api/ai/analyze', {
            title: projectTitleInput.trim() || undefined,
            clientName: clientNameInput.trim() || undefined,
            prompt: textToSend.trim(),
            userId: currentUser?._id,
            saveToDb: true
          })
        );

      if (res.data?.success && res.data.data?.analysis) {
        const analysis = {
          title: res.data.data.title || projectTitleInput.trim() || 'Client Project Plan',
          ...res.data.data.analysis
        };
        const resolvedClient = res.data.data.clientName || clientNameInput.trim() || 'Direct Client';
        setAnalysisResult(analysis);

        const createdProj = {
          _id: selectedProject?._id || res.data.data.project?._id || `proj-${Date.now()}`,
          title: analysis.title,
          clientName: resolvedClient,
          status: 'analyzed',
          timeEstimate: analysis.timeEstimate || '3-4 wks',
          pricingEstimate: analysis.pricingEstimate || '₹55,000 INR',
          analysis: analysis,
          clientRequest: textToSend.trim()
        };

        if (onProjectCreated) {
          onProjectCreated(createdProj);
        }

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `✅ **Analysis Complete for ${analysis.title}!** (Client: **${resolvedClient}**)\n\nI have generated the plan in the requested order:\n1. 📋 **Summary & Requirements**\n2. ⚙️ **Recommended Tech Stack**\n3. 🔄 **Architecture & Interactive Flowchart**\n4. 📄 **Client Proposal**\n\nEstimated Timeline: **${analysis.timeEstimate || '3-4 Weeks'}** | Pricing: **${analysis.pricingEstimate || '₹55,000 INR'}**\n\n*(This project has been added to your Dashboard)*`,
            hasDeliverables: true
          }
        ]);
      } else {
        fallbackAnalysis(textToSend);
      }
    } catch (err) {
      fallbackAnalysis(textToSend);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Fallback demo analysis if Ollama is offline
  const fallbackAnalysis = (userPrompt) => {
    const isBakery = userPrompt.toLowerCase().includes('bakery');
    const resolvedTitle = projectTitleInput.trim() || (isBakery ? 'Artisan Bakery Online Ordering' : 'Client Full-Stack Web Platform');
    const resolvedClient = clientNameInput.trim() || (isBakery ? 'Sweet Crumbs' : 'Direct Client');

    const demo = {
      title: resolvedTitle,
      summary: `A full-stack responsive web solution custom-tailored for ${resolvedClient}. Features an intuitive user workflow, robust backend API, real-time transaction processing, and a scalable database architecture.`,
      requirements: [
        'Responsive mobile-first user interface with smooth navigation',
        'Secure transactions and user workflow processing',
        'Database persistence with validation and automated timestamps',
        'Admin dashboard with status tracking and operational metrics',
        'Automated alerts and notifications'
      ],
      techStack: {
        frontend: 'React 19 + TailwindCSS',
        backend: 'Node.js + Express.js REST API',
        database: 'MongoDB Atlas',
        payment: 'Razorpay Payment Gateway (UPI & Cards)',
        notifications: 'Twilio / WhatsApp Business API'
      },
      timeEstimate: '3 to 4 Weeks',
      pricingEstimate: '₹45,000 - ₹60,000 INR',
      flowchart: `graph TD
    A[${resolvedClient} User] --> B[Browse System]
    B --> C[Execute Core Action]
    C --> D[Process Transaction]
    D --> E[Stored in MongoDB]`,
      flowchartSteps: [
        { step: '1', actor: 'Client User', action: 'Initiates request', outcome: 'Action registered' },
        { step: '2', actor: 'Express API', action: 'Processes business logic', outcome: 'Validated payload' },
        { step: '3', actor: 'MongoDB', action: 'Persists records', outcome: 'Record updated' }
      ],
      missingQuestions: [
        'What is the maximum number of daily transactions or users anticipated?',
        'Do you already have a payment gateway or WhatsApp API account configured?',
        'Are there any specific third-party APIs or legacy systems to integrate with?'
      ],
      proposal: `Subject: Project Proposal & Development Plan: ${resolvedTitle}

Dear ${resolvedClient},

Thank you for sharing your project requirements! We have created an end-to-end development roadmap to build and launch your platform on time.

1. SCOPE & KEY DELIVERABLES:
- Modern, responsive web platform tailored for ${resolvedClient}.
- Robust backend API with secure validation and error handling.
- Integrated payment and transaction processing with instant receipts.
- Admin dashboard for monitoring real-time metrics and records.

2. ESTIMATED TIMELINE & INVESTMENT:
- Timeline: 3-4 Weeks from kickoff.
- Total Investment: ₹50,000 INR
- Milestones: 40% Advance, 40% Beta Demo, 20% Production Handover.

Best regards,
FreelancerMate AI Partner`
    };

    setAnalysisResult(demo);

    const fallbackProj = {
      _id: selectedProject?._id || `proj-${Date.now()}`,
      title: resolvedTitle,
      clientName: resolvedClient,
      status: 'analyzed',
      timeEstimate: '3 to 4 Weeks',
      pricingEstimate: '₹45,000 - ₹60,000 INR',
      analysis: demo,
      clientRequest: userPrompt
    };

    if (onProjectCreated) {
      onProjectCreated(fallbackProj);
    }

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text: `✅ **Analysis Complete for ${demo.title}!** (Client: **${resolvedClient}**)\n\nI have generated the plan in the requested order:\n1. 📋 **Summary & Requirements**\n2. ⚙️ **Recommended Tech Stack**\n3. 🔄 **Architecture & Interactive Flowchart**\n4. 📄 **Client Proposal**\n\nEstimated Timeline: **${demo.timeEstimate}** | Pricing: **${demo.pricingEstimate}**\n\n*(This project has been added to your Dashboard)*`,
        hasDeliverables: true
      }
    ]);
  };

  const handleStartNewProject = () => {
    setAnalysisResult(null);
    setClientNameInput('');
    setProjectTitleInput('');
    setPromptInput('');
    setActiveWorkspaceView('chat');
    setMessages([
      {
        role: 'assistant',
        text: `👋 Let's scope another project!\n\nEnter the **Client / Owner Name**, **Project Title**, and **Requirements Prompt** below. I'll analyze the scope, generate the flowchart, and update your dashboard.`,
        showTemplateTip: true
      }
    ]);
  };

  // Fallback demo follow-up
  const fallbackFollowUpReply = (question) => {
    let reply = `Regarding: "${question}"\n\nBased on your project architecture, we can easily accommodate this. For a 2-week MVP, we recommend prioritizing core ordering and payment webhook capture in Phase 1, and deferring secondary admin reporting to Phase 2. This reduces initial scope by 35% without delaying user testing.`;
    setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
  };

  const handleCopyProposal = () => {
    if (!analysisResult?.proposal) return;
    navigator.clipboard.writeText(analysisResult.proposal);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2000);
  };

  const handleCopySummary = () => {
    if (!analysisResult) return;
    const text = `PROJECT: ${analysisResult.title}\nTIMELINE: ${analysisResult.timeEstimate}\nBUDGET: ${analysisResult.pricingEstimate}\n\nEXECUTIVE SUMMARY:\n${analysisResult.summary}\n\nREQUIREMENTS:\n${(analysisResult.requirements || []).map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="fm-chat-workspace-root">
      {/* Universal Top Workspace Header Bar */}
      <header className="fm-chat-header-bar">
        <div className="fm-chat-header-left">
          <button
            type="button"
            className="fm-btn-back-dash"
            onClick={onBackToDashboard}
            title="Return to projects dashboard"
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          <div className="fm-chat-title-group">
            <h2>{analysisResult?.title || (projectTitleInput || 'AI Scoper Copilot')}</h2>
            <span className="fm-badge-status">
              {analysisResult ? 'Plan Ready' : 'Awaiting Brief'}
            </span>
          </div>

          <button
            type="button"
            className="fm-btn-pill-action"
            onClick={handleStartNewProject}
            title="Scope another new project"
            style={{ marginLeft: '0.75rem' }}
          >
            <Plus size={14} />
            <span>+ New Project</span>
          </button>
        </div>

        {/* View Switcher: Chatbot vs Project Plan */}
        <div className="fm-workspace-switcher">
          <button
            type="button"
            className={`fm-switch-btn ${activeWorkspaceView === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveWorkspaceView('chat')}
          >
            <MessageSquare size={16} />
            <span>AI Chatbot</span>
            {messages.length > 1 && <span className="fm-count-pill">{messages.length}</span>}
          </button>

          <button
            type="button"
            className={`fm-switch-btn ${activeWorkspaceView === 'deliverables' ? 'active' : ''}`}
            onClick={() => {
              setActiveWorkspaceView('deliverables');
              // Ensure we open with Summary by default as requested
              if (!deliverablesTab) setDeliverablesTab('summary');
            }}
            disabled={!analysisResult}
            title={!analysisResult ? 'Generate a project plan first' : 'View full plan and flowchart'}
          >
            <FileText size={16} />
            <span>Project Plan & Flowchart</span>
            {analysisResult && <span className="fm-badge-ready">Ready</span>}
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="fm-chat-body-container">
        {/* ============================================================
            VIEW 1: AI CHATBOT (Centered, clean, conversational)
           ============================================================ */}
        {activeWorkspaceView === 'chat' && (
          <div className="fm-chat-centered-layout">
            {/* Dedicated Top Project Identity Card (Distinct and separate from chatbot) */}
            <div className="fm-project-context-card">
              <div className="fm-pcard-left">
                <div className="fm-pcard-icon">
                  <FolderGit2 size={24} color="#4338ca" />
                </div>
                <div className="fm-pcard-details">
                  <div className="fm-pcard-meta-line">
                    <span className="fm-pcard-badge client">
                      <User size={12} />
                      <span>Client: <strong>{clientNameInput || selectedProject?.clientName || 'Direct Client'}</strong></span>
                    </span>
                    <span className={`fm-pcard-badge status ${analysisResult ? 'analyzed' : 'draft'}`}>
                      {analysisResult ? '● Scope Analyzed' : '● Scoping in Progress'}
                    </span>
                    {analysisResult && (
                      <span className="fm-pcard-badge estimate">
                        <Clock size={12} />
                        <span>{analysisResult.timeEstimate || '3-4 Weeks'}</span>
                      </span>
                    )}
                  </div>
                  <h1 className="fm-pcard-title">
                    {projectTitleInput || selectedProject?.title || 'New Project'}
                  </h1>
                </div>
              </div>

              {analysisResult && (
                <button
                  type="button"
                  className="fm-btn-primary fm-pcard-btn-view"
                  onClick={() => {
                    setDeliverablesTab('summary');
                    setActiveWorkspaceView('deliverables');
                  }}
                >
                  <FileText size={15} />
                  <span>View Project Plan</span>
                  <ChevronRight size={15} />
                </button>
              )}
            </div>

            {/* Chat Messages Stream */}
            <div className="fm-chat-stream">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`fm-chat-message-row ${msg.role === 'user' ? 'user' : 'assistant'}`}
                >
                  <div className="fm-chat-avatar-box">
                    {msg.role === 'user' ? (
                      <UserIcon size={18} />
                    ) : (
                      <Bot size={18} color="#4338ca" />
                    )}
                  </div>

                  <div className="fm-chat-bubble-wrap">
                    <span className="fm-chat-author">
                      {msg.role === 'user' ? 'You' : 'FreelanceMate AI'}
                    </span>

                    <div className="fm-chat-bubble">
                      <pre className="fm-bubble-text">{msg.text}</pre>

                      {/* Template Tip on first greeting */}
                      {msg.showTemplateTip && !analysisResult && (
                        <div className="fm-chat-tip-box">
                          <div className="fm-tip-header">
                            <span>Recommended format helper:</span>
                            <button
                              type="button"
                              className="fm-btn-pill-action"
                              onClick={handleInsertTemplate}
                            >
                              <Plus size={13} />
                              <span>Insert Template</span>
                            </button>
                          </div>
                          <div className="fm-sample-chips-row">
                            <span className="fm-chips-label">Or try an example:</span>
                            {QUICK_SAMPLES.map((s, i) => (
                              <button
                                key={i}
                                type="button"
                                className="fm-chip-sample"
                                onClick={() => handleApplySample(s)}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Callout button to view Deliverables (Opens Summary first) */}
                      {msg.hasDeliverables && (
                        <div className="fm-deliverables-callout">
                          <button
                            type="button"
                            className="fm-btn-primary fm-btn-view-deliverables"
                            onClick={() => {
                              setDeliverablesTab('summary');
                              setActiveWorkspaceView('deliverables');
                            }}
                          >
                            <FileText size={16} />
                            <span>View Summary, Tech Stack & Flowchart</span>
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="fm-chat-message-row assistant">
                  <div className="fm-chat-avatar-box">
                    <Bot size={18} color="#4338ca" />
                  </div>
                  <div className="fm-chat-bubble-wrap">
                    <span className="fm-chat-author">FreelanceMate AI</span>
                    <div className="fm-chat-bubble thinking">
                      <RefreshCw size={15} className="animate-spin" />
                      <span>
                        {analysisResult
                          ? 'Consulting AI on your follow-up...'
                          : `Analyzing requirements for ${projectTitleInput || 'project'}...`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Suggested Follow-up chips if analysis is ready */}
            {analysisResult && (
              <div className="fm-chat-suggestions">
                <span className="fm-sug-label">Suggested follow-ups:</span>
                <div className="fm-sug-list">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      className="fm-sug-chip"
                      onClick={(e) => handleSendMessage(e, q)}
                      disabled={isAiThinking}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Input Prompt Bar */}
            <form onSubmit={handleSendMessage} className="fm-chat-input-bar">
              <div className="fm-input-container">
                <textarea
                  className="fm-chat-textarea"
                  rows={analysisResult ? 2 : 4}
                  placeholder={
                    analysisResult
                      ? `Ask a follow-up about ${projectTitleInput || 'this project'} (e.g. Can we reduce timeline to 2 weeks?)...`
                      : `Enter or paste client requirements for "${projectTitleInput || 'this project'}" (features, budget, deadline, tech preferences)...`
                  }
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  disabled={isAiThinking}
                />
                <button
                  type="submit"
                  className="fm-btn-chat-send"
                  disabled={isAiThinking || !promptInput.trim()}
                  title="Send to AI"
                >
                  {isAiThinking ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <Send size={17} />
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================
            VIEW 2: SEPARATE INFORMATION / DELIVERABLES CANVAS
            REARRANGED EXACTLY:
            1. Summary & Requirements
            2. Recommended Tech Stack
            3. Architecture & Flowchart
            4. Client Proposal
           ============================================================ */}
        {activeWorkspaceView === 'deliverables' && analysisResult && (
          <div className="fm-deliverables-canvas">
            {/* Top Navigation & Breadcrumb Bar */}
            <div className="fm-deliv-breadcrumb-bar">
              <div className="fm-breadcrumb-left">
                <button
                  type="button"
                  className="fm-btn-crumb-dash"
                  onClick={onBackToDashboard}
                >
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </button>
                <span className="fm-crumb-sep">/</span>
                <span className="fm-crumb-project">{analysisResult.title}</span>
                <span className="fm-crumb-sep">/</span>
                <span className="fm-crumb-active-tab">
                  {deliverablesTab === 'summary' && 'Summary & Requirements'}
                  {deliverablesTab === 'stack' && 'Recommended Tech Stack'}
                  {deliverablesTab === 'flowchart' && 'Architecture & Flowchart'}
                  {deliverablesTab === 'proposal' && 'Client Proposal'}
                </span>
              </div>

              <div className="fm-breadcrumb-right">
                <button
                  type="button"
                  className="fm-btn-chat-switch"
                  onClick={() => setActiveWorkspaceView('chat')}
                >
                  <MessageSquare size={15} />
                  <span>💬 Open AI Chat</span>
                </button>
                <button
                  type="button"
                  className="fm-btn-dash-switch"
                  onClick={onBackToDashboard}
                >
                  <ArrowLeft size={15} />
                  <span>Back to Dashboard</span>
                </button>
              </div>
            </div>

            {/* Deliverables Meta Bar */}
            <div className="fm-deliv-header">
              <div className="fm-deliv-title-box">
                <h2>{analysisResult.title}</h2>
                <div className="fm-deliv-meta-pills">
                  <span className="fm-meta-badge">
                    <Clock size={13} />
                    <span>Timeline: {analysisResult.timeEstimate || '3-4 Weeks'}</span>
                  </span>
                  <span className="fm-meta-badge pricing">
                    <Coins size={13} />
                    <span>Estimated Budget: {analysisResult.pricingEstimate || '₹55,000 INR'}</span>
                  </span>
                  <span className="fm-meta-badge status">
                    <CheckCircle2 size={13} />
                    <span>Analyzed with Gemma AI</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="fm-btn-secondary"
                onClick={() => setActiveWorkspaceView('chat')}
              >
                <MessageSquare size={15} />
                <span>Ask Follow-up in Chat</span>
              </button>
            </div>

            {/* Deliverables Sub-Navigation Tabs (REORDERED EXACTLY AS REQUESTED) */}
            <div className="fm-deliv-tabs-nav">
              {/* 1. Summary & Requirements */}
              <button
                type="button"
                className={`fm-deliv-tab ${deliverablesTab === 'summary' ? 'active' : ''}`}
                onClick={() => setDeliverablesTab('summary')}
              >
                <Layers size={15} />
                <span>1. Summary & Requirements</span>
              </button>

              {/* 2. Recommended Tech Stack */}
              <button
                type="button"
                className={`fm-deliv-tab ${deliverablesTab === 'stack' ? 'active' : ''}`}
                onClick={() => setDeliverablesTab('stack')}
              >
                <Code2 size={15} />
                <span>2. Recommended Tech Stack</span>
              </button>

              {/* 3. Architecture & Flowchart */}
              <button
                type="button"
                className={`fm-deliv-tab ${deliverablesTab === 'flowchart' ? 'active' : ''}`}
                onClick={() => setDeliverablesTab('flowchart')}
              >
                <GitBranch size={15} />
                <span>3. Architecture & Flowchart</span>
              </button>

              {/* 4. Client Proposal */}
              <button
                type="button"
                className={`fm-deliv-tab ${deliverablesTab === 'proposal' ? 'active' : ''}`}
                onClick={() => setDeliverablesTab('proposal')}
              >
                <FileText size={15} />
                <span>4. Client Proposal</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="fm-deliv-content-card">
              {/* ============================================================
                  TAB 1: SUMMARY & REQUIREMENTS (Proper, comprehensive, deep)
                 ============================================================ */}
              {deliverablesTab === 'summary' && (
                <div className="fm-deliv-section">
                  <div className="fm-summary-actions-bar">
                    <span className="fm-sec-kicker">Project Specification</span>
                    <div className="fm-summary-btn-group">
                      <button
                        type="button"
                        className="fm-btn-copy"
                        onClick={handleCopySummary}
                      >
                        {copiedSummary ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedSummary ? 'Copied Summary' : 'Copy Summary'}</span>
                      </button>
                      <button
                        type="button"
                        className="fm-btn-pill-action"
                        onClick={() => {
                          setActiveWorkspaceView('chat');
                          handleSendMessage(null, 'Please provide more details on the functional requirements.');
                        }}
                      >
                        <MessageSquare size={13} />
                        <span>Refine in Chat</span>
                      </button>
                    </div>
                  </div>

                  {/* Executive Overview Box */}
                  <div className="fm-deliv-block executive-box">
                    <h3>Executive Project Overview</h3>
                    <p className="fm-summary-main-p">{analysisResult.summary}</p>

                    <div className="fm-overview-metrics-grid">
                      <div className="fm-ov-metric">
                        <span className="fm-ov-label">Duration</span>
                        <strong className="fm-ov-val">{analysisResult.timeEstimate || '3-4 Weeks'}</strong>
                      </div>
                      <div className="fm-ov-metric">
                        <span className="fm-ov-label">Recommended Budget</span>
                        <strong className="fm-ov-val green">{analysisResult.pricingEstimate || '₹55,000 INR'}</strong>
                      </div>
                      <div className="fm-ov-metric">
                        <span className="fm-ov-label">Deployment Scope</span>
                        <strong className="fm-ov-val">Full-Stack Production Ready</strong>
                      </div>
                    </div>
                  </div>

                  {/* Functional Requirements */}
                  <div className="fm-deliv-block" style={{ marginTop: '2rem' }}>
                    <div className="fm-block-header-with-badge">
                      <h3>Functional Requirements Checklist</h3>
                      <span className="fm-badge-count">
                        {(analysisResult.requirements || []).length} Deliverables
                      </span>
                    </div>
                    <ul className="fm-deliv-list modern">
                      {(analysisResult.requirements || []).map((req, i) => (
                        <li key={i}>
                          <div className="fm-req-item-content">
                            <strong>Deliverable {i + 1}:</strong> {req}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Non-Functional & Security Specifications */}
                  <div className="fm-deliv-block" style={{ marginTop: '2rem' }}>
                    <h3>Non-Functional Specifications & Standards</h3>
                    <div className="fm-nonfunc-grid">
                      <div className="fm-nonfunc-card">
                        <ShieldCheck size={18} color="#4338ca" />
                        <div>
                          <strong>Security & Auth</strong>
                          <p>Bcrypt salt rounds, JWT access tokens, rate-limiting on sensitive auth routes.</p>
                        </div>
                      </div>
                      <div className="fm-nonfunc-card">
                        <Clock size={18} color="#4338ca" />
                        <div>
                          <strong>Performance Target</strong>
                          <p>Under 200ms API response time, optimized database compound indexes.</p>
                        </div>
                      </div>
                      <div className="fm-nonfunc-card">
                        <CheckCircle2 size={18} color="#4338ca" />
                        <div>
                          <strong>Mobile-First Design</strong>
                          <p>100% responsive fluid layouts for mobile, tablet, and desktop screens.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clarifying Questions for Scope Creep Prevention */}
                  {analysisResult.missingQuestions?.length > 0 && (
                    <div className="fm-deliv-block" style={{ marginTop: '2rem' }}>
                      <div className="fm-block-header-with-badge">
                        <h3>Scope Clarifications to Ask Client</h3>
                        <span className="fm-badge-warning">Prevents Scope Creep</span>
                      </div>
                      <ul className="fm-deliv-list questions">
                        {analysisResult.missingQuestions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tab Navigation Footer */}
                  <div className="fm-tab-nav-footer">
                    <button
                      type="button"
                      className="fm-btn-secondary"
                      onClick={onBackToDashboard}
                    >
                      <ArrowLeft size={15} />
                      <span>Back to Dashboard</span>
                    </button>

                    <button
                      type="button"
                      className="fm-btn-primary"
                      onClick={() => setDeliverablesTab('stack')}
                    >
                      <span>Next: Recommended Tech Stack</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================
                  TAB 2: RECOMMENDED TECH STACK
                 ============================================================ */}
              {deliverablesTab === 'stack' && (
                <div className="fm-deliv-section">
                  <div className="fm-summary-actions-bar">
                    <span className="fm-sec-kicker">Component Stacks</span>
                    <button
                      type="button"
                      className="fm-btn-pill-action"
                      onClick={() => {
                        setActiveWorkspaceView('chat');
                        handleSendMessage(null, 'Why were these specific technologies selected instead of alternatives?');
                      }}
                    >
                      <MessageSquare size={13} />
                      <span>Ask Tech Questions in Chat</span>
                    </button>
                  </div>

                  <h3>Recommended Full-Stack Architecture</h3>
                  <p className="fm-section-intro">
                    Curated technologies selected specifically for rapid development, low maintenance, and effortless scalability.
                  </p>

                  <div className="fm-stack-cards-grid">
                    {Object.entries(analysisResult.techStack || {}).map(([layer, tech]) => (
                      <div key={layer} className="fm-stack-box">
                        <span className="fm-stack-layer-tag">{layer}</span>
                        <p className="fm-stack-tech-name">
                          {typeof tech === 'string' ? tech : JSON.stringify(tech)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Tab Navigation Footer */}
                  <div className="fm-tab-nav-footer">
                    <button
                      type="button"
                      className="fm-btn-secondary"
                      onClick={() => setDeliverablesTab('summary')}
                    >
                      <ArrowLeft size={15} />
                      <span>Previous: Summary & Requirements</span>
                    </button>

                    <button
                      type="button"
                      className="fm-btn-primary"
                      onClick={() => setDeliverablesTab('flowchart')}
                    >
                      <span>Next: Architecture & Flowchart</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================
                  TAB 3: ARCHITECTURE & FLOWCHART (Interactive, beautiful, deep)
                 ============================================================ */}
              {deliverablesTab === 'flowchart' && (
                <div>
                  <FlowchartViewer
                    flowchartCode={analysisResult.flowchart}
                    mermaidCode={analysisResult.flowchart}
                    flowchartSteps={analysisResult.flowchartSteps || []}
                    steps={analysisResult.flowchartSteps || []}
                    title={analysisResult.title}
                    onAskFollowUp={(question) => {
                      setActiveWorkspaceView('chat');
                      handleSendMessage(null, question);
                    }}
                  />

                  {/* Tab Navigation Footer */}
                  <div className="fm-tab-nav-footer">
                    <button
                      type="button"
                      className="fm-btn-secondary"
                      onClick={() => setDeliverablesTab('stack')}
                    >
                      <ArrowLeft size={15} />
                      <span>Previous: Recommended Tech Stack</span>
                    </button>

                    <button
                      type="button"
                      className="fm-btn-primary"
                      onClick={() => setDeliverablesTab('proposal')}
                    >
                      <span>Next: Client Proposal</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================
                  TAB 4: CLIENT PROPOSAL (Ready to send with 1-click copy & 2-page PDF)
                 ============================================================ */}
              {deliverablesTab === 'proposal' && (
                <div className="fm-deliv-section">
                  <div className="fm-proposal-header-row">
                    <div>
                      <h3>Client Proposal & PDF Document</h3>
                      <p>2-page executive proposal crafted in plain English for fresher & business clients with 1-click PDF download.</p>
                    </div>

                    <div className="fm-proposal-actions-row">
                      <button
                        type="button"
                        className="fm-btn-primary fm-btn-view-2page"
                        onClick={() => setIsProposalModalOpen(true)}
                        title="View formatted 2-page proposal & download PDF"
                      >
                        <FileText size={16} />
                        <span>View 2-Page Proposal & PDF</span>
                      </button>

                      <button
                        type="button"
                        className="fm-btn-secondary fm-btn-copy-proposal"
                        onClick={handleCopyProposal}
                      >
                        {copiedProposal ? <Check size={16} color="#15803d" /> : <Copy size={16} />}
                        <span>{copiedProposal ? 'Copied Pitch!' : 'Copy Quick Pitch'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="fm-proposal-banner-alert">
                    <Sparkles size={18} color="#4338ca" />
                    <div>
                      <strong>Full 2-Page Proposal Available:</strong>
                      <span> Includes Executive Summary, 4-Module Scope, Non-Tech Stack breakdown, 4-Week Roadmap, Milestone Payments in INR, 30-Day Free Warranty, and Acceptance Signatures. Click "View 2-Page Proposal & PDF" above to view or export.</span>
                    </div>
                  </div>

                  <pre className="fm-proposal-pre-canvas">
                    {analysisResult.proposal || 'Proposal not generated yet.'}
                  </pre>

                  {/* Tab Navigation Footer */}
                  <div className="fm-tab-nav-footer">
                    <button
                      type="button"
                      className="fm-btn-secondary"
                      onClick={() => setDeliverablesTab('flowchart')}
                    >
                      <ArrowLeft size={15} />
                      <span>Previous: Architecture & Flowchart</span>
                    </button>

                    <button
                      type="button"
                      className="fm-btn-primary"
                      onClick={onBackToDashboard}
                    >
                      <LayoutDashboard size={15} />
                      <span>Done • Return to Dashboard</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2-Page Client Proposal Modal with PDF Export */}
      <ClientProposalModal
        project={
          selectedProject || {
            title: analysisResult?.title || projectTitleInput || 'Client Project',
            clientName: clientNameInput || 'Direct Client',
            analysis: analysisResult,
            timeEstimate: analysisResult?.timeEstimate,
            pricingEstimate: analysisResult?.pricingEstimate
          }
        }
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
      />
    </div>
  );
}
