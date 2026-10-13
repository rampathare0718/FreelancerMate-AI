import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  GitMerge,
  ListOrdered,
  Copy,
  Check,
  ZoomIn,
  RefreshCw,
  ArrowRight,
  User,
  Cpu,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#0B0F17',
    primaryColor: '#1e1b4b',
    primaryBorderColor: '#6366f1',
    primaryTextColor: '#f8fafc',
    lineColor: '#818cf8',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a',
    edgeLabelBackground: '#1e1b4b',
    nodeTextColor: '#f8fafc'
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    useMaxWidth: true
  }
});

export default function FlowchartViewer({ flowchartCode, flowchartSteps, title }) {
  const [viewMode, setViewMode] = useState('diagram'); // 'diagram' | 'steps'
  const [svgContent, setSvgContent] = useState('');
  const [renderError, setRenderError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const containerRef = useRef(null);

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
    const code = cleanMermaidSyntax(flowchartCode);

    if (!code) {
      setRenderError('No flowchart diagram code available.');
      return;
    }

    try {
      const uniqueId = `mermaid-chart-${Date.now()}`;
      const { svg } = await mermaid.render(uniqueId, code);
      setSvgContent(svg);
    } catch (err) {
      console.warn('Mermaid render error:', err);
      setRenderError('Could not render direct diagram; displaying workflow steps.');
      // Auto fallback to steps if mermaid syntax was malformed
      setViewMode('steps');
    }
  };

  useEffect(() => {
    renderDiagram();
  }, [flowchartCode]);

  const handleCopyCode = () => {
    if (!flowchartCode) return;
    navigator.clipboard.writeText(cleanMermaidSyntax(flowchartCode));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flowchart-viewer">
      {/* Flowchart Header & Switcher */}
      <div className="flowchart-toolbar">
        <div className="flowchart-title-area">
          <GitMerge size={18} color="#818cf8" />
          <h4>Architecture & Workflow Process Diagram</h4>
        </div>

        <div className="flowchart-actions">
          <div className="view-mode-pill">
            <button
              type="button"
              className={`mode-btn ${viewMode === 'diagram' ? 'active' : ''}`}
              onClick={() => setViewMode('diagram')}
            >
              <GitMerge size={14} />
              <span>Diagram</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${viewMode === 'steps' ? 'active' : ''}`}
              onClick={() => setViewMode('steps')}
            >
              <ListOrdered size={14} />
              <span>Step-by-Step Flow</span>
            </button>
          </div>

          <button
            type="button"
            className="btn-copy-mermaid"
            onClick={handleCopyCode}
            title="Copy Mermaid.js diagram code"
          >
            {isCopied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            <span>{isCopied ? 'Copied' : 'Copy Diagram'}</span>
          </button>
        </div>
      </div>

      {/* Render Area */}
      <div className="flowchart-canvas">
        {viewMode === 'diagram' ? (
          renderError ? (
            <div className="flowchart-fallback-notice">
              <AlertCircle size={20} color="#f59e0b" />
              <p>{renderError}</p>
              <button
                type="button"
                className="btn-switch-mode"
                onClick={() => setViewMode('steps')}
              >
                Switch to Interactive Process Steps
              </button>
            </div>
          ) : (
            <div
              className="mermaid-svg-container"
              ref={containerRef}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          )
        ) : (
          /* Step-by-Step Process Flow */
          <div className="flowchart-steps-grid">
            {flowchartSteps && flowchartSteps.length > 0 ? (
              flowchartSteps.map((s, idx) => (
                <div key={idx} className="flow-step-card">
                  <div className="step-badge-col">
                    <div className="step-circle">{s.step || idx + 1}</div>
                    {idx < flowchartSteps.length - 1 && <div className="step-connector-line" />}
                  </div>

                  <div className="step-content-box">
                    <div className="step-header">
                      <span className="step-actor-pill">
                        {s.actor?.toLowerCase().includes('user') || s.actor?.toLowerCase().includes('client') ? (
                          <User size={13} />
                        ) : s.actor?.toLowerCase().includes('data') ? (
                          <Database size={13} />
                        ) : (
                          <Cpu size={13} />
                        )}
                        <span>{s.actor || 'Actor'}</span>
                      </span>
                      <span className="step-order-label">Stage {idx + 1}</span>
                    </div>

                    <h5 className="step-action-text">{s.action}</h5>

                    <div className="step-outcome-box">
                      <ArrowRight size={14} color="#34d399" />
                      <span>{s.outcome}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-steps-text">No detailed process stages provided.</p>
            )}
          </div>
        )}
      </div>

      <div className="flowchart-footer">
        <small>
          💡 <strong>Freelancer Pro-Tip:</strong> Share this workflow diagram with your client during kickoff to prevent misunderstandings and align on system expectations.
        </small>
      </div>
    </div>
  );
}
