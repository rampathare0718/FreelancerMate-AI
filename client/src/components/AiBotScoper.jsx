import React, { useState, useEffect } from 'react';
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
  FileCheck
} from 'lucide-react';

const SAMPLE_TEMPLATES = [
  {
    label: '🛍️ E-Commerce & Razorpay',
    title: 'E-Commerce Store for Handmade Organic Jewelry',
    clientRequest:
      'I want an online store to sell handmade artisan jewelry. Customers should be able to browse items by category, filter by metal type (Silver, Gold, Brass), add to cart, and pay via Razorpay. I also need an admin dashboard where I can add new jewelry pieces, update stock, and view customer orders. Must look elegant, minimal, and load fast on mobile phones.',
    budget: 65000,
    deadline: '2026-11-20',
    preferredTechnologies: 'React, Node.js, Express, MongoDB, Tailwind CSS',
    additionalContext: 'Client has existing product photography. Brand aesthetic is earthy luxury.'
  },
  {
    label: '📅 SaaS Appointment Booking',
    title: 'Clinic & Doctor Appointment Booking Portal',
    clientRequest:
      'Looking for a patient booking web app for our dental clinic. Patients can select a doctor, choose available time slots from an interactive calendar, enter their contact info, and get an email/SMS confirmation. Doctors should have a login to manage their availability, block vacation days, and view daily appointments.',
    budget: 80000,
    deadline: '2026-12-05',
    preferredTechnologies: 'MERN Stack, SendGrid / Twilio API',
    additionalContext: 'Must comply with basic patient data privacy and prevent double-booking.'
  },
  {
    label: '🎓 EdTech Learning Platform',
    title: 'Video Course & Quiz Platform for Tutors',
    clientRequest:
      'I am an educator wanting to host my coding courses. Need user authentication, video lesson player with chapter progress tracking, multiple-choice quizzes at the end of each module, and PDF certificate generation upon course completion. Payment integration for 1-time course purchase.',
    budget: 95000,
    deadline: '2026-12-30',
    preferredTechnologies: 'React, Node.js, MongoDB, AWS S3 / Cloudinary for video',
    additionalContext: 'Needs video protection to prevent easy downloading of premium lectures.'
  }
];

export default function AiBotScoper() {
  const [formData, setFormData] = useState({
    title: '',
    clientRequest: '',
    budget: '',
    deadline: '',
    preferredTechnologies: '',
    additionalContext: '',
    saveToDb: true
  });

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
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'requirements' | 'techStack' | 'roadmap' | 'questions' | 'proposal'
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApplyTemplate = (tmpl) => {
    setFormData({
      title: tmpl.title,
      clientRequest: tmpl.clientRequest,
      budget: tmpl.budget,
      deadline: tmpl.deadline,
      preferredTechnologies: tmpl.preferredTechnologies,
      additionalContext: tmpl.additionalContext,
      saveToDb: true
    });
    setErrorMessage(null);
  };

  const handleSubmitAnalysis = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.title.trim()) {
      setErrorMessage("Please enter a Project Title.");
      return;
    }

    if (!formData.clientRequest.trim() || formData.clientRequest.trim().length < 10) {
      setErrorMessage("Please enter a Client Request Brief (at least 10 characters).");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress('Connecting to Gemma via Ollama...');

    const payload = {
      title: formData.title.trim(),
      clientRequest: formData.clientRequest.trim(),
      budget: formData.budget ? Number(formData.budget) : undefined,
      deadline: formData.deadline || undefined,
      preferredTechnologies: formData.preferredTechnologies
        ? formData.preferredTechnologies.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined,
      additionalContext: formData.additionalContext.trim() || undefined,
      saveToDb: formData.saveToDb
    };

    try {
      setAnalysisProgress('Analyzing requirements & generating structured roadmap...');
      const res = await axios.post('/api/ai/analyze', payload).catch((err) => {
        // Fallback direct url if proxy is down
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

  // Demo fallback for instant preview if Ollama is still downloading
  const handleLoadDemoPreview = () => {
    setAnalysisResult({
      title: formData.title || 'Online Store for Handmade Organic Jewelry',
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
Your Freelance Engineering Partner`
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

      {/* Main Grid: Form Left, Output Right */}
      <div className="scoper-grid">
        {/* Left Column: Brief Input Form */}
        <div className="scoper-input-card glass-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="tag-pill">
                <Sparkles size={14} />
                <span>Gemma Powered Scoper</span>
              </div>
              <h2>Input Client Request</h2>
              <p>Paste your client's raw brief or choose an example below</p>
            </div>
          </div>

          {/* Quick Templates */}
          <div className="template-chips">
            <span className="template-label">Quick Examples:</span>
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
              <label className="form-label" htmlFor="project-title">
                Project Title <span className="text-required">*</span>
              </label>
              <input
                id="project-title"
                name="title"
                type="text"
                className="form-input"
                placeholder="e.g. E-Commerce Store for Organic Skincare"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="client-request">
                Client Requirements / Brief <span className="text-required">*</span>
              </label>
              <textarea
                id="client-request"
                name="clientRequest"
                className="form-textarea"
                rows={6}
                placeholder="Paste client email, message, or project brief here... (e.g. Client needs a product catalog, Razorpay payments, admin panel, filter by category...)"
                value={formData.clientRequest}
                onChange={handleInputChange}
                required
              />
              <div className="char-count">
                {formData.clientRequest.length} characters
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="project-budget">
                  Client Budget (₹ INR) <span className="text-optional">(Optional)</span>
                </label>
                <div className="input-wrapper">
                  <Coins size={16} className="input-icon" />
                  <input
                    id="project-budget"
                    name="budget"
                    type="number"
                    className="form-input"
                    placeholder="e.g. 50000"
                    value={formData.budget}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="project-deadline">
                  Target Deadline <span className="text-optional">(Optional)</span>
                </label>
                <div className="input-wrapper">
                  <Calendar size={16} className="input-icon" />
                  <input
                    id="project-deadline"
                    name="deadline"
                    type="date"
                    className="form-input"
                    value={formData.deadline}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="preferred-tech">
                Preferred Technologies <span className="text-optional">(Optional)</span>
              </label>
              <div className="input-wrapper">
                <Tag size={16} className="input-icon" />
                <input
                  id="preferred-tech"
                  name="preferredTechnologies"
                  type="text"
                  className="form-input"
                  placeholder="e.g. React, Node.js, MongoDB, Tailwind"
                  value={formData.preferredTechnologies}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="additional-context">
                Additional Notes / Constraints <span className="text-optional">(Optional)</span>
              </label>
              <input
                id="additional-context"
                name="additionalContext"
                type="text"
                className="form-input"
                placeholder="e.g. Client is non-technical, needs clean mobile experience"
                value={formData.additionalContext}
                onChange={handleInputChange}
              />
            </div>

            <div className="checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="saveToDb"
                  checked={formData.saveToDb}
                  onChange={handleInputChange}
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
                    <span>Analyzing with Gemma...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Analyze Brief with Gemma AI</span>
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

        {/* Right Column: AI Analysis Result Display */}
        <div className="scoper-output-card glass-card">
          {!analysisResult ? (
            <div className="empty-analysis-state">
              <div className="empty-icon-circle">
                <Bot size={44} color="#818cf8" />
              </div>
              <h3>Ready to Scope Your Next Project</h3>
              <p>
                Fill out the client brief on the left or select a sample template to generate
                a comprehensive breakdown, system architecture, milestones, pricing in INR,
                and a client proposal.
              </p>
              <div className="empty-feature-bullets">
                <div className="feature-bullet">
                  <CheckCircle2 size={16} color="#34d399" />
                  <span>Structured Functional & Non-Functional Requirements</span>
                </div>
                <div className="feature-bullet">
                  <CheckCircle2 size={16} color="#34d399" />
                  <span>Tech Stack Justifications & Architecture</span>
                </div>
                <div className="feature-bullet">
                  <CheckCircle2 size={16} color="#34d399" />
                  <span>INR Pricing (₹) & Step-by-Step Roadmap</span>
                </div>
                <div className="feature-bullet">
                  <CheckCircle2 size={16} color="#34d399" />
                  <span>Client-Ready Proposal Message</span>
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
                  <span>Client Proposal</span>
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

                {/* 5. Questions Tab */}
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

                {/* 6. Proposal Tab */}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
