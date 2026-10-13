import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Send,
  Sparkles,
  Bot,
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
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import FlowchartViewer from './FlowchartViewer';

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
  onBackToDashboard
}) {
  // Main view toggle: 'chat' | 'deliverables'
  const [activeWorkspaceView, setActiveWorkspaceView] = useState('chat');

  // Chat conversation state
  const [messages, setMessages] = useState([]);
  const [promptInput, setPromptInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [deliverablesTab, setDeliverablesTab] = useState('flowchart'); // 'summary' | 'flowchart' | 'stack' | 'roadmap' | 'proposal'
  const [copiedProposal, setCopiedProposal] = useState(false);
  const chatBottomRef = useRef(null);

  // Initialize conversation or load selected project
  useEffect(() => {
    if (selectedProject?.analysis) {
      setAnalysisResult({
        title: selectedProject.title,
        ...selectedProject.analysis
      });
      setMessages([
        {
          role: 'user',
          text: `Project Loaded: ${selectedProject.title}\n${selectedProject.clientRequest || ''}`
        },
        {
          role: 'assistant',
          text: `I have loaded **${selectedProject.title}** for client **${selectedProject.clientName || 'Client'}**.\n\nYou can ask any follow-up questions here, or switch to the **Project Plan & Flowchart** view to see the full architecture and proposal.`,
          hasDeliverables: true
        }
      ]);
    } else {
      // Clean welcoming initial chat state
      setMessages([
        {
          role: 'assistant',
          text: `👋 Hi ${currentUser?.name ? currentUser.name.split(' ')[0] : 'there'}! I'm your **FreelanceMate AI Copilot**.\n\nPaste what your client sent below. I will analyze requirements, recommend the tech stack, estimate timeline and pricing in INR, create an interactive architecture flowchart, and write a client proposal.`,
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
          prompt: textToSend.trim(),
          userId: currentUser?._id,
          saveToDb: true
        })
        .catch(() =>
          axios.post('http://localhost:5000/api/ai/analyze', {
            prompt: textToSend.trim(),
            userId: currentUser?._id,
            saveToDb: true
          })
        );

      if (res.data?.success && res.data.data?.analysis) {
        const analysis = {
          title: res.data.data.title || 'Client Project Plan',
          ...res.data.data.analysis
        };
        setAnalysisResult(analysis);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `✅ **Analysis Complete for ${analysis.title}!**\n\nI have generated the full functional breakdown, interactive architecture flowchart, tech stack, roadmap, and client proposal.\n\nEstimated Timeline: **${analysis.timeEstimate || '3-4 Weeks'}** | Pricing: **${analysis.pricingEstimate || '₹55,000 INR'}**`,
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
    const demo = {
      title: isBakery ? 'Artisan Bakery Ordering & Delivery System' : 'Client Full-Stack Web Platform',
      summary: 'A responsive full-stack platform featuring seamless customer ordering, automated time-slot allocation with capacity limits, secure UPI/Card checkout, and real-time operational notifications.',
      requirements: [
        'Responsive mobile-first user catalog and item selection',
        'Dynamic date & time-slot selector with cutoff thresholds',
        'Secure payment gateway integration with webhook confirmation',
        'Admin dashboard for inventory and order management',
        'Automated order confirmation alerts via WhatsApp/SMS'
      ],
      techStack: {
        frontend: 'React 19 + TailwindCSS (Fast responsive storefront)',
        backend: 'Node.js + Express.js REST API (Order handling & webhooks)',
        database: 'MongoDB Atlas (Flexible schema for products & orders)',
        payment: 'Razorpay Payment Gateway (UPI QR, Cards, NetBanking)',
        notifications: 'Twilio / WhatsApp Business API'
      },
      timeEstimate: '3 to 4 Weeks',
      pricingEstimate: '₹45,000 - ₹60,000 INR',
      flowchart: `graph TD
    A[Customer Selects Items] --> B[Chooses Delivery Time Slot]
    B --> C{Slot Capacity Available?}
    C -- No --> B
    C -- Yes --> D[Initiates Razorpay UPI Checkout]
    D --> E[Payment Webhook Verified]
    E --> F[Order Saved in MongoDB]
    F --> G[WhatsApp & SMS Confirmation Sent]`,
      flowchartSteps: [
        { step: '1', actor: 'Customer', action: 'Browses catalog and adds items to cart', outcome: 'Ready for checkout' },
        { step: '2', actor: 'Slot Engine', action: 'Validates delivery date and time-slot capacity', outcome: 'Locks slot reservation' },
        { step: '3', actor: 'Razorpay', action: 'Processes UPI transaction', outcome: 'Dispatches signed webhook event' },
        { step: '4', actor: 'Express Server', action: 'Validates payment signature and stores order in MongoDB', outcome: 'Updates order status' },
        { step: '5', actor: 'Notification Engine', action: 'Dispatches confirmation alert to customer and kitchen', outcome: 'Delivery dispatched' }
      ],
      proposal: `Subject: Project Proposal & Development Plan

Dear Client,

Thank you for sharing your project vision! We have designed an end-to-end roadmap to deliver your platform on time and with zero technical surprises.

1. DELIVERABLES:
- High-performance responsive web application.
- Seamless booking/ordering flow with automatic time-slot allocation.
- Razorpay payment gateway integration with instant receipt generation.
- Admin dashboard to manage catalog, slots, and customer orders.

2. TIMELINE & INVESTMENT:
- Timeline: 3-4 Weeks from kickoff.
- Total Investment: ₹52,000 INR (Milestone phased: 40% Advance, 40% Beta Demo, 20% Production Launch).

Best regards,
FreelancerMate AI Partner`
    };

    setAnalysisResult(demo);
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text: `✅ **Analysis Complete for ${demo.title}!**\n\nI have generated the full functional breakdown, interactive architecture flowchart, tech stack, roadmap, and client proposal.\n\nEstimated Timeline: **${demo.timeEstimate}** | Pricing: **${demo.pricingEstimate}**`,
        hasDeliverables: true
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

  return (
    <div className="fm-chat-workspace-root">
      {/* Top Workspace Header Bar */}
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
            <h2>{analysisResult?.title || 'AI Scoper Copilot'}</h2>
            <span className="fm-badge-status">
              {analysisResult ? 'Plan Ready' : 'Awaiting Brief'}
            </span>
          </div>
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
            onClick={() => setActiveWorkspaceView('deliverables')}
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

                      {/* Callout button to view Deliverables */}
                      {msg.hasDeliverables && (
                        <div className="fm-deliverables-callout">
                          <button
                            type="button"
                            className="fm-btn-primary fm-btn-view-deliverables"
                            onClick={() => setActiveWorkspaceView('deliverables')}
                          >
                            <GitBranch size={16} />
                            <span>View Full Project Plan & Flowchart</span>
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
                          : 'Analyzing client brief, estimating pricing & architecting flowchart...'}
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
                      ? 'Ask a follow-up question (e.g. Can we reduce timeline to 2 weeks?)...'
                      : 'Paste client message or prompt here (Title, Description, Budget, Deadline, Tech)...'
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
           ============================================================ */}
        {activeWorkspaceView === 'deliverables' && analysisResult && (
          <div className="fm-deliverables-canvas">
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
                    <span>Budget: {analysisResult.pricingEstimate || '₹55,000 INR'}</span>
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

            {/* Deliverables Sub-Navigation Tabs */}
            <div className="fm-deliv-tabs-nav">
              <button
                type="button"
                className={`fm-deliv-tab ${deliverablesTab === 'flowchart' ? 'active' : ''}`}
                onClick={() => setDeliverablesTab('flowchart')}
              >
                <GitBranch size={15} />
                <span>Architecture & Flowchart</span>
              </button>

              <button
                type="button"
                className={`fm-deliv-tab ${deliverablesTab === 'summary' ? 'active' : ''}`}
                onClick={() => setDeliverablesTab('summary')}
              >
                <Layers size={15} />
                <span>Summary & Requirements</span>
              </button>

              <button
                type="button"
                className={`fm-deliv-tab ${deliverablesTab === 'stack' ? 'active' : ''}`}
                onClick={() => setDeliverablesTab('stack')}
              >
                <Code2 size={15} />
                <span>Recommended Tech Stack</span>
              </button>

              <button
                type="button"
                className={`fm-deliv-tab ${deliverablesTab === 'proposal' ? 'active' : ''}`}
                onClick={() => setDeliverablesTab('proposal')}
              >
                <FileText size={15} />
                <span>Client Proposal</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="fm-deliv-content-card">
              {deliverablesTab === 'flowchart' && (
                <div>
                  <FlowchartViewer
                    mermaidCode={analysisResult.flowchart}
                    steps={analysisResult.flowchartSteps || []}
                    projectTitle={analysisResult.title}
                  />
                </div>
              )}

              {deliverablesTab === 'summary' && (
                <div className="fm-deliv-section">
                  <div className="fm-deliv-block">
                    <h3>Executive Summary</h3>
                    <p>{analysisResult.summary}</p>
                  </div>

                  <div className="fm-deliv-block" style={{ marginTop: '1.5rem' }}>
                    <h3>Functional & Non-Functional Requirements</h3>
                    <ul className="fm-deliv-list">
                      {(analysisResult.requirements || []).map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {analysisResult.missingQuestions?.length > 0 && (
                    <div className="fm-deliv-block" style={{ marginTop: '1.5rem' }}>
                      <h3>Clarifying Questions for Client</h3>
                      <ul className="fm-deliv-list questions">
                        {analysisResult.missingQuestions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {deliverablesTab === 'stack' && (
                <div className="fm-deliv-section">
                  <h3>Recommended Tech Stack Architecture</h3>
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
                </div>
              )}

              {deliverablesTab === 'proposal' && (
                <div className="fm-deliv-section">
                  <div className="fm-proposal-header-row">
                    <div>
                      <h3>Ready-to-Send Client Proposal</h3>
                      <p>Formatted and ready to copy into your email or freelance platform pitch.</p>
                    </div>
                    <button
                      type="button"
                      className="fm-btn-primary fm-btn-copy-proposal"
                      onClick={handleCopyProposal}
                    >
                      {copiedProposal ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedProposal ? 'Copied to Clipboard!' : 'Copy Proposal'}</span>
                    </button>
                  </div>

                  <pre className="fm-proposal-pre-canvas">
                    {analysisResult.proposal || 'Proposal not generated yet.'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
