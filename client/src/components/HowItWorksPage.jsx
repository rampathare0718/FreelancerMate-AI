import React from 'react';
import {
  FileText,
  Cpu,
  GitBranch,
  Send,
  CheckCircle,
  ArrowRight,
  Terminal,
  Clock,
  Sparkles
} from 'lucide-react';

export default function HowItWorksPage({ onStartAnalyzing, setCurrentView }) {
  const steps = [
    {
      num: '01',
      title: 'Paste What Your Client Sent',
      subtitle: 'No complex forms required. Single unified prompt.',
      desc: 'Simply copy the messy message from Upwork, Slack, WhatsApp, or email. You can use our recommended format (Title, Description, Budget, Deadline, Tech) or paste the raw message as-is.',
      highlight: 'Title: Bakery Website\nDescription: Need online ordering, delivery time slots, and UPI payments.'
    },
    {
      num: '02',
      title: 'AI Evaluates Architecture & Effort',
      subtitle: 'Full project breakdown generated in seconds.',
      desc: 'Google Gemma AI analyzes the scope, creates a functional specification, selects the optimal tech stack (e.g. MERN stack), calculates development hours, and generates fair market pricing in INR.',
      highlight: 'Frontend: React | Backend: Node/Express | DB: MongoDB | Payment: Razorpay'
    },
    {
      num: '03',
      title: 'Inspect Interactive Flowchart & Fine-Tune',
      subtitle: 'Visual clarity for you and your client.',
      desc: 'Review the automatically generated Mermaid.js architecture and data flow. Need to deliver in 2 weeks or swap a database? Ask interactive follow-up questions to customize the plan.',
      highlight: 'Flowchart: User -> Auth -> Cart -> Razorpay Webhook -> Order Database'
    },
    {
      num: '04',
      title: 'Copy Ready-to-Send Proposal & Win The Contract',
      subtitle: 'Stand out from other competing freelancers.',
      desc: 'Export the complete client proposal including milestones, deliverables, questions to clarify, and terms. Impress your client with your thoroughness within minutes of receiving their message.',
      highlight: 'Proposal copied to clipboard. Ready to send!'
    }
  ];

  return (
    <div className="fm-page-wrapper">
      <div className="fm-container">
        {/* Page Hero */}
        <div className="fm-page-header">
          <div className="fm-badge-pill">Step-by-Step Workflow</div>
          <h1 className="fm-page-title">
            From client message to contract <br />
            in four simple steps.
          </h1>
          <p className="fm-page-subtitle">
            See how FreelanceMate AI turns ambiguous requirements into clear, professional roadmaps.
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="fm-workflow-timeline">
          {steps.map((step, idx) => (
            <div key={idx} className="fm-workflow-step-card">
              <div className="fm-step-badge-col">
                <span className="fm-step-number">{step.num}</span>
              </div>
              <div className="fm-step-info-col">
                <span className="fm-step-subtitle">{step.subtitle}</span>
                <h3 className="fm-step-title">{step.title}</h3>
                <p className="fm-step-desc">{step.desc}</p>
                <div className="fm-step-code-snippet">
                  <pre>{step.highlight}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Example Card */}
        <div className="fm-workflow-demo-box">
          <div className="fm-demo-box-header">
            <Sparkles size={20} color="#4338ca" />
            <div>
              <h3>Why clients love this format</h3>
              <p>Clients award jobs to freelancers who demonstrate clarity, structure, and technical foresight.</p>
            </div>
          </div>
          <div className="fm-demo-grid">
            <div className="fm-demo-col">
              <span className="fm-demo-label">Freelancer A (Generic Response):</span>
              <div className="fm-demo-quote bad">
                {'"Hello, I can do this website for you very fast and cheap. Please hire me."'}
              </div>
            </div>
            <div className="fm-demo-col">
              <span className="fm-demo-label">Freelancer B (Powered by FreelanceMate AI):</span>
              <div className="fm-demo-quote good">
                {'"Hi! I mapped out your bakery workflow (User → Cart → Delivery Slot Selection → Razorpay UPI). Here is the 4-week milestone roadmap and a few questions regarding slot limits..."'}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="fm-cta-banner">
          <div className="fm-cta-content">
            <h2>Experience the workflow on your next brief</h2>
            <p>Paste your first client message and get a complete roadmap in seconds.</p>
          </div>
          <button
            type="button"
            className="fm-btn-primary fm-cta-btn"
            onClick={onStartAnalyzing}
          >
            <span>Start analyzing</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
