import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  GitMerge,
  ListOrdered,
  Layers,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  RefreshCw,
  ArrowRight,
  User,
  Cpu,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  HelpCircle,
  ExternalLink,
  Server,
  Smartphone,
  Globe
} from 'lucide-react';

// Configure Mermaid with a clean modern light-mode theme
try {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    themeVariables: {
      darkMode: false,
      background: '#ffffff',
      mainBkg: '#f8fafc',
      primaryColor: '#e0e7ff',
      primaryBorderColor: '#4338ca',
      primaryTextColor: '#0f172a',
      lineColor: '#4338ca',
      secondaryColor: '#ede9fe',
      secondaryBorderColor: '#6d28d9',
      secondaryTextColor: '#0f172a',
      tertiaryColor: '#f0fdf4',
      tertiaryBorderColor: '#16a34a',
      tertiaryTextColor: '#0f172a',
      edgeLabelBackground: '#ffffff',
      nodeTextColor: '#0f172a',
      clusterBkg: '#f8fafc',
      clusterBorder: '#cbd5e1',
      defaultLinkColor: '#4338ca',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      fontSize: '13px'
    },
    flowchart: {
      htmlLabels: true,
      curve: 'basis',
      useMaxWidth: false,
      nodeSpacing: 50,
      rankSpacing: 50
    }
  });
} catch (e) {
  console.warn('Mermaid initialization note:', e);
}

export default function FlowchartViewer({
  flowchartCode,
  mermaidCode,
  flowchartSteps,
  steps,
  title,
  projectTitle,
  onAskFollowUp
}) {
  // Support both prop naming conventions
  const rawCode = flowchartCode || mermaidCode || '';
  const rawSteps = flowchartSteps || steps || [];
  const displayTitle = title || projectTitle || 'Project System Architecture';

  const [viewMode, setViewMode] = useState('diagram'); // 'diagram' | 'steps' | 'layers'
  const [svgContent, setSvgContent] = useState('');
  const [renderError, setRenderError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  // Local follow-up question input in architecture tab
  const [archQuestion, setArchQuestion] = useState('');
  const [inlineReply, setInlineReply] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const containerRef = useRef(null);

  // Pre-configured architecture suggestions
  const archSuggestions = [
    '⚡ How does failover work if the payment gateway webhook drops?',
    '🔄 Can we add Redis caching to speed up slot reservation checks?',
    '🛡️ How is customer data encrypted in transit and at rest?',
    '📱 What modifications are required to support a React Native mobile app?'
  ];

  const cleanMermaidSyntax = (raw) => {
    if (!raw || typeof raw !== 'string') return '';
    let cleaned = raw.trim();
    // Strip markdown code fences if present
    cleaned = cleaned.replace(/^```(mermaid)?/i, '').replace(/```$/, '').trim();

    // Ensure it starts with graph TD or flowchart TD
    if (!cleaned.startsWith('graph') && !cleaned.startsWith('flowchart')) {
      cleaned = `graph TD\n  ${cleaned}`;
    }
    return cleaned;
  };

  const renderDiagram = async () => {
    setRenderError(null);
    const code = cleanMermaidSyntax(rawCode);

    if (!code) {
      setRenderError('No flowchart diagram code available for this project.');
      return;
    }

    try {
      const uniqueId = `mermaid-chart-${Date.now()}`;
      const { svg } = await mermaid.render(uniqueId, code);
      setSvgContent(svg);
    } catch (err) {
      console.warn('Mermaid render error:', err);
      setRenderError('Could not render direct diagram; displaying workflow steps.');
      setViewMode('steps');
    }
  };

  useEffect(() => {
    renderDiagram();
    setZoomLevel(1);
  }, [rawCode]);

  const handleCopyCode = () => {
    if (!rawCode) return;
    navigator.clipboard.writeText(cleanMermaidSyntax(rawCode));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.15, 2.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleSendArchQuestion = (q) => {
    const questionText = q || archQuestion;
    if (!questionText.trim()) return;

    if (onAskFollowUp) {
      onAskFollowUp(questionText.trim());
    } else {
      // Inline answer fallback
      setIsAnswering(true);
      setTimeout(() => {
        setInlineReply({
          question: questionText.trim(),
          answer: `For **"${questionText.trim()}"**: The system architecture uses an idempotent webhook consumer with exponential backoff retries. If a payment or external API drops, the request is placed on a retry queue and verified against MongoDB transaction logs before failing gracefully.`
        });
        setIsAnswering(false);
      }, 700);
    }
    setArchQuestion('');
  };

  return (
    <div className="flowchart-viewer-card">
      {/* Top Toolbar */}
      <div className="flowchart-top-bar">
        <div className="flowchart-header-left">
          <div className="flowchart-icon-pill">
            <GitMerge size={18} color="#4338ca" />
          </div>
          <div>
            <h3 className="flowchart-main-title">Interactive System Architecture</h3>
            <p className="flowchart-sub-title">
              Visual data lifecycles, user journeys, and component communication
            </p>
          </div>
        </div>

        {/* View Switchers & Zoom Controls */}
        <div className="flowchart-toolbar-actions">
          <div className="flowchart-mode-pill-group">
            <button
              type="button"
              className={`fm-submode-btn ${viewMode === 'diagram' ? 'active' : ''}`}
              onClick={() => setViewMode('diagram')}
            >
              <GitMerge size={14} />
              <span>Diagram</span>
            </button>

            <button
              type="button"
              className={`fm-submode-btn ${viewMode === 'steps' ? 'active' : ''}`}
              onClick={() => setViewMode('steps')}
            >
              <ListOrdered size={14} />
              <span>Step-by-Step Flow ({rawSteps.length})</span>
            </button>

            <button
              type="button"
              className={`fm-submode-btn ${viewMode === 'layers' ? 'active' : ''}`}
              onClick={() => setViewMode('layers')}
            >
              <Layers size={14} />
              <span>Architecture Layers</span>
            </button>
          </div>

          {/* Diagram Zoom Controls (only shown on diagram view) */}
          {viewMode === 'diagram' && (
            <div className="flowchart-zoom-controls">
              <button
                type="button"
                className="fm-zoom-btn"
                onClick={handleZoomOut}
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="fm-zoom-label">{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                className="fm-zoom-btn"
                onClick={handleZoomIn}
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                type="button"
                className="fm-zoom-btn reset"
                onClick={handleResetZoom}
                title="Reset Zoom"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          )}

          <button
            type="button"
            className="fm-btn-copy-mermaid"
            onClick={handleCopyCode}
            title="Copy Mermaid syntax"
          >
            {isCopied ? <Check size={14} color="#15803d" /> : <Copy size={14} />}
            <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="flowchart-stage-container">
        {/* VIEW 1: Visual Mermaid Diagram */}
        {viewMode === 'diagram' && (
          <div className="flowchart-diagram-stage">
            {renderError ? (
              <div className="flowchart-error-banner">
                <AlertCircle size={20} color="#b45309" />
                <p>{renderError}</p>
                <button
                  type="button"
                  className="fm-btn-pill-action"
                  onClick={() => setViewMode('steps')}
                >
                  View Step-by-Step Flow Instead
                </button>
              </div>
            ) : (
              <div className="flowchart-svg-viewport">
                <div
                  className="flowchart-svg-wrapper"
                  ref={containerRef}
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Interactive Step-by-Step Lifecycle Flow */}
        {viewMode === 'steps' && (
          <div className="flowchart-interactive-steps-view">
            <div className="flow-steps-timeline">
              {rawSteps && rawSteps.length > 0 ? (
                rawSteps.map((s, idx) => (
                  <div
                    key={idx}
                    className={`flow-step-card-modern ${selectedStepIndex === idx ? 'selected' : ''}`}
                    onClick={() => setSelectedStepIndex(idx)}
                  >
                    <div className="step-circle-badge">
                      <span>{s.step || idx + 1}</span>
                      {idx < rawSteps.length - 1 && <div className="step-vertical-tracker" />}
                    </div>

                    <div className="step-info-card">
                      <div className="step-header-row">
                        <span className="step-actor-badge">
                          {s.actor?.toLowerCase().includes('client') || s.actor?.toLowerCase().includes('user') ? (
                            <User size={13} />
                          ) : s.actor?.toLowerCase().includes('data') || s.actor?.toLowerCase().includes('mongo') ? (
                            <Database size={13} />
                          ) : s.actor?.toLowerCase().includes('gateway') || s.actor?.toLowerCase().includes('razorpay') ? (
                            <ShieldCheck size={13} />
                          ) : (
                            <Cpu size={13} />
                          )}
                          <span>{s.actor || 'System'}</span>
                        </span>
                        <span className="step-stage-counter">Stage {idx + 1} of {rawSteps.length}</span>
                      </div>

                      <h4 className="step-action-heading">{s.action}</h4>

                      <div className="step-outcome-alert">
                        <ArrowRight size={14} color="#15803d" />
                        <span><strong>Outcome:</strong> {s.outcome}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-steps-state">
                  <p>Step-by-step breakdown generated from the project requirements.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: 4-Tier Architecture Layers Breakdown */}
        {viewMode === 'layers' && (
          <div className="flowchart-layers-view">
            <div className="arch-layers-grid">
              {/* Layer 1 */}
              <div className="arch-layer-card">
                <div className="layer-card-header">
                  <div className="layer-icon client">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h4>1. Client / Presentation Layer</h4>
                    <span>Web Browser & Responsive Mobile Viewports</span>
                  </div>
                </div>
                <div className="layer-card-body">
                  <p>Client-side rendering powered by React 19 with optimistic state management and fast DOM updates.</p>
                  <ul className="layer-points">
                    <li>Dynamic catalog browsing & filtering</li>
                    <li>Form validation & client-side token caching</li>
                    <li>Instant feedback on payment interactions</li>
                  </ul>
                </div>
              </div>

              {/* Layer 2 */}
              <div className="arch-layer-card">
                <div className="layer-card-header">
                  <div className="layer-icon gateway">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4>2. API Gateway & Security Layer</h4>
                    <span>Express.js RESTful Endpoints & Middleware</span>
                  </div>
                </div>
                <div className="layer-card-body">
                  <p>Handles traffic ingress, CORS security headers, rate limiting, and authenticates incoming payload signatures.</p>
                  <ul className="layer-points">
                    <li>JWT token & bcrypt verification</li>
                    <li>Input sanitization and schema assertion</li>
                    <li>Payment gateway webhook verification</li>
                  </ul>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="arch-layer-card">
                <div className="layer-card-header">
                  <div className="layer-icon business">
                    <Server size={18} />
                  </div>
                  <div>
                    <h4>3. Business Logic & Processing Layer</h4>
                    <span>Core Domain Services & Transaction Controllers</span>
                  </div>
                </div>
                <div className="layer-card-body">
                  <p>Orchestrates business rules such as order creation, booking slot reservation, and email/SMS triggers.</p>
                  <ul className="layer-points">
                    <li>Concurrency locks on booking slots</li>
                    <li>Pricing calculation, discounts & taxes</li>
                    <li>Async notification dispatch via third-party APIs</li>
                  </ul>
                </div>
              </div>

              {/* Layer 4 */}
              <div className="arch-layer-card">
                <div className="layer-card-header">
                  <div className="layer-icon database">
                    <Database size={18} />
                  </div>
                  <div>
                    <h4>4. Persistence & Data Storage Layer</h4>
                    <span>MongoDB Atlas & Document Collections</span>
                  </div>
                </div>
                <div className="layer-card-body">
                  <p>Stores indexed schemas for Users, Projects, Orders, and System Audit Logs with ACID transactions where needed.</p>
                  <ul className="layer-points">
                    <li>Optimized compound indexes for fast lookups</li>
                    <li>Automated daily backups and point-in-time recovery</li>
                    <li>Encrypted at rest with industry standard AES-256</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dedicated Architecture Follow-Up Questions Section */}
      <div className="flowchart-followup-container">
        <div className="arch-followup-header">
          <MessageSquare size={16} color="#4338ca" />
          <span>Have architecture questions? Ask Gemma AI:</span>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="arch-chips-row">
          {archSuggestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              className="arch-chip-btn"
              onClick={() => handleSendArchQuestion(q)}
              disabled={isAnswering}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Inline Answer Display */}
        {inlineReply && (
          <div className="arch-inline-reply-box">
            <div className="arch-reply-q">
              <strong>Question:</strong> {inlineReply.question}
            </div>
            <div className="arch-reply-a">
              <span className="arch-badge-ai">AI Architect Response</span>
              <p>{inlineReply.answer}</p>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="arch-input-row">
          <input
            type="text"
            className="arch-input-field"
            placeholder="e.g. How does this architecture handle 10,000 concurrent requests? What if database drops?"
            value={archQuestion}
            onChange={(e) => setArchQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendArchQuestion();
              }
            }}
            disabled={isAnswering}
          />
          <button
            type="button"
            className="fm-btn-primary arch-btn-send"
            onClick={() => handleSendArchQuestion()}
            disabled={isAnswering || !archQuestion.trim()}
          >
            {isAnswering ? <RefreshCw size={15} className="animate-spin" /> : <Send size={15} />}
            <span>Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
}
