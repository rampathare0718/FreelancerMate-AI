import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Code2,
  GitBranch,
  Coins,
  FileText,
  Copy,
  Check,
  ArrowRight
} from 'lucide-react';
import FlowchartViewer from './FlowchartViewer';

export default function SamplePreviewModal({
  isOpen,
  onClose,
  onStartAnalyzing
}) {
  const [activeTab, setActiveTab] = useState('summary');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sampleData = {
    title: 'Artisan Bakery E-Commerce & Delivery Slot System',
    originalPrompt: 'Hi, we need a website for our bakery with online ordering and delivery slots...',
    summary: 'A responsive direct-to-consumer bakery web application enabling customers to browse fresh confectionery products, customize cake orders, pick delivery or pickup time slots with slot capacity limits, and complete online checkout with instant WhatsApp notifications.',
    requirements: [
      'Customer catalog with categorized breads, pastries, and custom occasion cakes',
      'Delivery date and 2-hour delivery slot selector with daily order limit management',
      'Secure shopping cart with promo coupon application and tax calculation',
      'Razorpay payment gateway supporting UPI (Google Pay / PhonePe) and cards',
      'Automated SMS / WhatsApp order confirmations and kitchen preparation receipts',
      'Admin dashboard to manage daily inventory, pause sold-out items, and view delivery runs'
    ],
    techStack: {
      frontend: 'React 19 + TailwindCSS (Mobile-first responsive storefront)',
      backend: 'Node.js + Express.js REST API (Order state machine & webhook handling)',
      database: 'MongoDB Atlas (Flexible product catalog & order documents)',
      payment: 'Razorpay Payment Gateway (Instant UPI QR & cards)',
      notifications: 'Twilio / WhatsApp Business API (Automated dispatch alerts)'
    },
    timeline: '3 to 4 Weeks',
    pricingInr: '₹45,000 - ₹60,000 INR',
    flowchart: `graph TD
    A[Customer Browses Bakery Menu] --> B[Adds Pastries to Cart]
    B --> C[Selects Delivery Date & 2-Hour Slot]
    C --> D{Slot Capacity Available?}
    D -- No --> C
    D -- Yes --> E[Initiate Razorpay UPI Checkout]
    E --> F[Payment Verified Webhook]
    F --> G[Order Saved in MongoDB]
    G --> H[Kitchen Alert & WhatsApp Confirmation Sent]
    H --> I[Courier Dispatched in Selected Slot]`,
    flowchartSteps: [
      { step: '1', actor: 'Customer', action: 'Browses fresh bakery menu', outcome: 'Selects items and proceeds to checkout' },
      { step: '2', actor: 'Slot Engine', action: 'Validates delivery date and time slot capacity', outcome: 'Locks slot reservation for 10 minutes' },
      { step: '3', actor: 'Razorpay Gateway', action: 'Processes UPI transaction', outcome: 'Dispatches signed webhook event to Express server' },
      { step: '4', actor: 'Server & Database', action: 'Creates order record and decreases available slot limit', outcome: 'Kitchen dashboard reflects new prep order' },
      { step: '5', actor: 'Dispatch Driver', action: 'Delivers freshly baked goods', outcome: 'Customer receives doorstep delivery on time' }
    ],
    proposal: `Subject: Proposal: Online Ordering & Delivery Slot Platform for Bakery

Dear Client,

Thank you for reaching out regarding your new bakery web application! We have structured a complete scope designed to maximize your online orders while keeping daily kitchen operations smooth with automated delivery time slots.

1. SCOPE & DELIVERABLES:
- Mobile-first catalog with high-resolution imagery and allergen badges.
- Delivery Date & Time Slot engine with automatic cutoff thresholds.
- UPI & Card checkout via Razorpay with instant order confirmation.
- Kitchen admin panel to manage product availability and print pack lists.

2. ESTIMATED TIMELINE & INVESTMENT:
- Timeline: 3-4 Weeks from kickoff to production launch.
- Investment: ₹52,000 INR (Milestone phased: 40% Advance, 40% Beta Demo, 20% Launch).

3. NEXT STEPS:
We can kick off the initial wireframes this week. Let us know if you would like to review the prototype!

Best regards,
FreelancerMate AI Partner`
  };

  const handleCopyProposal = () => {
    navigator.clipboard.writeText(sampleData.proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fm-modal-backdrop" onClick={onClose}>
      <div
        className="fm-modal-card fm-sample-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="fm-modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="fm-sample-modal-header">
          <div className="fm-sample-badge">
            <Sparkles size={14} />
            <span>Sample Project Plan</span>
          </div>
          <h2 className="fm-sample-title">{sampleData.title}</h2>
          <p className="fm-sample-subtitle">
            Original brief: <em>"{sampleData.originalPrompt}"</em>
          </p>

          <div className="fm-sample-meta-row">
            <span className="fm-meta-chip">⏱️ Timeline: {sampleData.timeline}</span>
            <span className="fm-meta-chip">💰 Estimate: {sampleData.pricingInr}</span>
          </div>
        </div>

        {/* Tab Switcher - Ordered: Summary -> Tech Stack -> Flowchart -> Proposal */}
        <div className="fm-sample-tabs">
          <button
            type="button"
            className={`fm-sample-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <Layers size={15} />
            <span>1. Summary & Requirements</span>
          </button>

          <button
            type="button"
            className={`fm-sample-tab-btn ${activeTab === 'stack' ? 'active' : ''}`}
            onClick={() => setActiveTab('stack')}
          >
            <Code2 size={15} />
            <span>2. Recommended Tech Stack</span>
          </button>

          <button
            type="button"
            className={`fm-sample-tab-btn ${activeTab === 'flowchart' ? 'active' : ''}`}
            onClick={() => setActiveTab('flowchart')}
          >
            <GitBranch size={15} />
            <span>3. Architecture & Flowchart</span>
          </button>

          <button
            type="button"
            className={`fm-sample-tab-btn ${activeTab === 'proposal' ? 'active' : ''}`}
            onClick={() => setActiveTab('proposal')}
          >
            <FileText size={15} />
            <span>4. Client Proposal</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="fm-sample-body">
          {activeTab === 'summary' && (
            <div className="fm-sample-content-view">
              <div className="fm-sample-block">
                <h4>Project Summary</h4>
                <p>{sampleData.summary}</p>
              </div>

              <div className="fm-sample-block">
                <h4>Functional Requirements</h4>
                <ul className="fm-sample-list">
                  {sampleData.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'stack' && (
            <div className="fm-sample-content-view">
              <div className="fm-sample-block">
                <h4>Recommended Tech Stack</h4>
                <div className="fm-sample-stack-grid">
                  {Object.entries(sampleData.techStack).map(([layer, tech]) => (
                    <div key={layer} className="fm-sample-stack-item">
                      <span className="fm-stack-layer">{layer}:</span>
                      <span className="fm-stack-val">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flowchart' && (
            <div className="fm-sample-content-view">
              <FlowchartViewer
                flowchartCode={sampleData.flowchart}
                flowchartSteps={sampleData.flowchartSteps}
                title={sampleData.title}
              />
            </div>
          )}

          {activeTab === 'proposal' && (
            <div className="fm-sample-content-view">
              <div className="fm-proposal-actions-bar">
                <span>Formatted Ready-to-Send Proposal:</span>
                <button
                  type="button"
                  className="fm-btn-copy"
                  onClick={handleCopyProposal}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Proposal'}</span>
                </button>
              </div>
              <pre className="fm-proposal-pre">{sampleData.proposal}</pre>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="fm-sample-modal-footer">
          <p>Like what you see? Analyze your own client briefs in seconds.</p>
          <button
            type="button"
            className="fm-btn-primary"
            onClick={() => {
              onClose();
              onStartAnalyzing();
            }}
          >
            <span>Analyze Your Own Brief</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
