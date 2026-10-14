import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  X,
  Sparkles,
  Bot,
  User,
  Clock,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Code2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { generateStructuredProposal } from '../utils/proposalGenerator';
import { exportProposalToPdf } from '../utils/pdfExporter';

export default function ClientProposalModal({
  project,
  isOpen,
  onClose,
  onOpenInChatbot
}) {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!isOpen || !project) return null;

  const data = generateStructuredProposal(project);
  const pdfFilename = `${data.clientName.replace(/\s+/g, '_')}_Project_Proposal.pdf`;

  const handleConvertPdf = async () => {
    setIsExportingPdf(true);
    setPdfSuccess(false);
    try {
      await exportProposalToPdf('fm-proposal-print-area', pdfFilename);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyText = () => {
    const rawProposal = project?.analysis?.proposal;
    let textToCopy = '';
    if (rawProposal) {
      textToCopy = rawProposal;
    } else {
      textToCopy = `PROJECT DEVELOPMENT PROPOSAL: ${data.projectTitle}
Client: ${data.clientName}
Date: ${data.dateStr} | Proposal ID: ${data.proposalId}

EXECUTIVE SUMMARY:
${data.executiveSummary}

TOTAL INVESTMENT: ${data.pricingEstimate}
ESTIMATED TIMELINE: ${data.timeEstimate}

KEY INCLUSIONS:
- 100% Full Source Code Ownership
- Production Deployment & Free SSL
- 30 Days Free Post-Launch Bug Fixing Warranty
- 1-on-1 Admin Training Session`;
    }

    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fm-modal-backdrop" onClick={onClose}>
      <div
        className="fm-proposal-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="fm-proposal-modal-toolbar">
          <div className="fm-pmodal-title-box">
            <div className="fm-pmodal-icon">
              <FileText size={20} color="#4338ca" />
            </div>
            <div>
              <h2 className="fm-pmodal-heading">Client Proposal Document</h2>
              <span className="fm-pmodal-subheading">
                Prepared for <strong>{data.clientName}</strong> • {data.projectTitle}
              </span>
            </div>
          </div>

          <div className="fm-pmodal-actions">
            <button
              type="button"
              className="fm-btn-proposal-action primary"
              onClick={handleConvertPdf}
              disabled={isExportingPdf}
              title="Convert this proposal to a professional PDF file"
            >
              {isExportingPdf ? (
                <>
                  <span className="fm-spinner-inline" />
                  <span>Converting to PDF...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check size={16} />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Convert Proposal to PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="fm-btn-proposal-action secondary"
              onClick={handlePrint}
              title="Print document or save using browser dialog"
            >
              <Printer size={15} />
              <span>Print</span>
            </button>

            <button
              type="button"
              className="fm-btn-proposal-action secondary"
              onClick={handleCopyText}
              title="Copy plain text"
            >
              {hasCopied ? <Check size={15} color="#15803d" /> : <Copy size={15} />}
              <span>{hasCopied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            {onOpenInChatbot && (
              <button
                type="button"
                className="fm-btn-proposal-action outline"
                onClick={() => {
                  onClose();
                  onOpenInChatbot(project);
                }}
                title="Open in AI Chatbot to refine or ask follow-ups"
              >
                <Bot size={15} />
                <span>Open in Chatbot</span>
              </button>
            )}

            <button
              type="button"
              className="fm-modal-close-btn"
              onClick={onClose}
              title="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="fm-proposal-doc-viewport">
          <div id="fm-proposal-print-area" className="fm-proposal-document-container">
            {/* ============================================================
                PAGE 1: PROJECT VISION, SCOPE & PLAIN-ENGLISH TECH
               ============================================================ */}
            <div className="fm-proposal-page">
              {/* Top Header Banner */}
              <div className="fm-doc-header">
                <div className="fm-doc-brand">
                  <div className="fm-doc-brand-badge">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="fm-doc-brand-name">FreelanceMate AI</h3>
                    <span className="fm-doc-brand-tag">Verified Project Scoping Document</span>
                  </div>
                </div>

                <div className="fm-doc-ref-box">
                  <div className="fm-ref-item">
                    <span className="fm-ref-label">Proposal ID:</span>
                    <strong className="fm-ref-val">{data.proposalId}</strong>
                  </div>
                  <div className="fm-ref-item">
                    <span className="fm-ref-label">Date Issued:</span>
                    <span className="fm-ref-val">{data.dateStr}</span>
                  </div>
                  <div className="fm-ref-item">
                    <span className="fm-ref-label">Valid Until:</span>
                    <span className="fm-ref-val">{data.validUntilStr}</span>
                  </div>
                </div>
              </div>

              {/* Title & Metadata Ribbon */}
              <div className="fm-doc-title-ribbon">
                <div className="fm-ribbon-tag">FORMAL CLIENT PROPOSAL</div>
                <h1 className="fm-doc-main-title">{data.projectTitle}</h1>
                <p className="fm-doc-sub-title">
                  Custom Development & Digital Transformation Roadmap for <strong>{data.clientName}</strong>
                </p>

                <div className="fm-doc-meta-pills">
                  <div className="fm-meta-pill">
                    <User size={13} />
                    <span>Client: <strong>{data.clientName}</strong></span>
                  </div>
                  <div className="fm-meta-pill">
                    <Clock size={13} />
                    <span>Timeline: <strong>{data.timeEstimate}</strong></span>
                  </div>
                  <div className="fm-meta-pill highlight">
                    <Coins size={13} />
                    <span>Investment: <strong>{data.pricingEstimate}</strong></span>
                  </div>
                </div>
              </div>

              {/* Section 1: Executive Summary */}
              <section className="fm-doc-section">
                <h2 className="fm-doc-section-title">
                  <span className="fm-section-num">1</span>
                  <span>Executive Summary & Project Purpose</span>
                </h2>
                <div className="fm-doc-callout-box">
                  <p className="fm-callout-text">{data.executiveSummary}</p>
                </div>
                <p className="fm-section-note">
                  <strong>Client Note:</strong> We have tailored this proposal specifically for non-technical stakeholders. Every module is clearly defined in terms of how it will help your business generate more revenue, save daily working hours, and offer your customers a seamless digital experience.
                </p>
              </section>

              {/* Section 2: Detailed Scope of Work */}
              <section className="fm-doc-section">
                <h2 className="fm-doc-section-title">
                  <span className="fm-section-num">2</span>
                  <span>Comprehensive Scope of Work & Modules</span>
                </h2>
                <div className="fm-doc-modules-grid">
                  {data.modules.map((mod, idx) => (
                    <div key={idx} className="fm-doc-module-card">
                      <h4 className="fm-module-heading">{mod.title}</h4>
                      <p className="fm-module-desc">{mod.description}</p>
                      <ul className="fm-module-checklist">
                        {mod.features.map((feat, fIdx) => (
                          <li key={fIdx}>
                            <CheckCircle2 size={13} color="#16a34a" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 3: Tech Stack in Plain Words */}
              <section className="fm-doc-section">
                <h2 className="fm-doc-section-title">
                  <span className="fm-section-num">3</span>
                  <span>Recommended Technology Stack (Explained in Plain Words)</span>
                </h2>
                <div className="fm-doc-tech-table-wrap">
                  <table className="fm-doc-tech-table">
                    <thead>
                      <tr>
                        <th style={{ width: '28%' }}>Component</th>
                        <th style={{ width: '25%' }}>Role in Your System</th>
                        <th style={{ width: '47%' }}>Why It Benefits Your Business</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.techStackExplained.map((techItem, tIdx) => (
                        <tr key={tIdx}>
                          <td><strong>{techItem.tech}</strong></td>
                          <td><span className="fm-tech-role-badge">{techItem.simpleExplanation}</span></td>
                          <td>{techItem.whyItMatters}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Page 1 Footer */}
              <div className="fm-doc-page-footer">
                <span>{data.projectTitle} • Confidential Proposal for {data.clientName}</span>
                <span className="fm-page-number">Page 1 of 2</span>
              </div>
            </div>

            {/* ============================================================
                PAGE BREAK FOR PDF & PRINT
               ============================================================ */}
            <div className="fm-pdf-page-break" />

            {/* ============================================================
                PAGE 2: ROADMAP, INVESTMENT, INCLUSIONS & ACCEPTANCE
               ============================================================ */}
            <div className="fm-proposal-page">
              {/* Page 2 Header */}
              <div className="fm-doc-header secondary">
                <span className="fm-header-proj-title">{data.projectTitle}</span>
                <span className="fm-header-client-tag">Client: {data.clientName} | Proposal #{data.proposalId}</span>
              </div>

              {/* Section 4: Phased Development Roadmap */}
              <section className="fm-doc-section" style={{ marginTop: '0.5rem' }}>
                <h2 className="fm-doc-section-title">
                  <span className="fm-section-num">4</span>
                  <span>Step-by-Step Execution Roadmap & Timeline</span>
                </h2>
                <div className="fm-roadmap-cards-list">
                  {data.roadmapPhases.map((phase, pIdx) => (
                    <div key={pIdx} className="fm-roadmap-phase-card">
                      <div className="fm-phase-dot" />
                      <div className="fm-phase-content">
                        <h4 className="fm-phase-title">{phase.phase}</h4>
                        <ul className="fm-phase-items">
                          {phase.deliverables.map((deliv, dIdx) => (
                            <li key={dIdx}>
                              <ArrowRight size={12} color="#4338ca" />
                              <span>{deliv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 5: Commercial Investment & Milestones */}
              <section className="fm-doc-section">
                <h2 className="fm-doc-section-title">
                  <span className="fm-section-num">5</span>
                  <span>Transparent Investment & Milestone Payment Schedule</span>
                </h2>
                <div className="fm-doc-milestones-box">
                  <div className="fm-investment-banner">
                    <div>
                      <span className="fm-inv-label">Total Fixed Project Investment:</span>
                      <h3 className="fm-inv-value">{data.pricingEstimate}</h3>
                    </div>
                    <div className="fm-inv-badge">
                      <span>✓ 100% Fixed Price • No Hidden Charges</span>
                    </div>
                  </div>

                  <table className="fm-milestones-table">
                    <thead>
                      <tr>
                        <th>Milestone Stage</th>
                        <th>% Share</th>
                        <th>Amount (INR)</th>
                        <th>Payment Release Condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.milestones.map((m, idx) => (
                        <tr key={idx}>
                          <td><strong>{m.stage}</strong></td>
                          <td><span className="fm-milestone-pct">{m.percentage}</span></td>
                          <td><strong className="fm-milestone-amt">{m.amount}</strong></td>
                          <td>{m.timing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 6: 100% Guaranteed Inclusions */}
              <section className="fm-doc-section">
                <h2 className="fm-doc-section-title">
                  <span className="fm-section-num">6</span>
                  <span>100% Guaranteed Inclusions (What You Receive)</span>
                </h2>
                <div className="fm-inclusions-grid">
                  {data.inclusions.map((inc, iIdx) => (
                    <div key={iIdx} className="fm-inclusion-item">
                      <div className="fm-inc-icon">
                        <ShieldCheck size={18} color="#15803d" />
                      </div>
                      <div>
                        <h5 className="fm-inc-title">{inc.title}</h5>
                        <p className="fm-inc-desc">{inc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 7: Formal Acceptance & Signatures */}
              <section className="fm-doc-section">
                <h2 className="fm-doc-section-title">
                  <span className="fm-section-num">7</span>
                  <span>Acceptance & Formal Authorization</span>
                </h2>
                <p className="fm-acceptance-text">
                  By signing below or confirming acceptance in writing, <strong>{data.clientName}</strong> agrees to the project scope, investment schedule, and milestones described in this proposal. Work commences immediately upon Milestone 1 confirmation.
                </p>

                <div className="fm-signatures-row">
                  <div className="fm-signature-card">
                    <span className="fm-sig-role">Prepared & Submitted By:</span>
                    <div className="fm-sig-line" />
                    <div className="fm-sig-details">
                      <strong>Freelance Solutions Architect</strong>
                      <span>FreelanceMate AI Verified Partner</span>
                      <span className="fm-sig-date">Date: {data.dateStr}</span>
                    </div>
                  </div>

                  <div className="fm-signature-card">
                    <span className="fm-sig-role">Accepted & Approved By Client:</span>
                    <div className="fm-sig-line" />
                    <div className="fm-sig-details">
                      <strong>{data.clientName}</strong>
                      <span>Authorized Representative Signature</span>
                      <span className="fm-sig-date">Date: ________________________</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Page 2 Footer */}
              <div className="fm-doc-page-footer">
                <span>{data.projectTitle} • Confidential Proposal for {data.clientName}</span>
                <span className="fm-page-number">Page 2 of 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
