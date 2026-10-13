import React from 'react';
import {
  Sparkles,
  GitMerge,
  Cpu,
  Coins,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function FeaturesPage({ onStartAnalyzing, setCurrentView }) {
  const featuresList = [
    {
      icon: <Sparkles size={24} color="#4338ca" />,
      tag: 'Core Intelligence',
      title: 'Instant Client Requirement Analysis',
      desc: 'Paste chaotic client emails, transcripts, or chat messages. Our local AI extracts clear functional deliverables, non-functional security goals, and business logic instantly.'
    },
    {
      icon: <GitMerge size={24} color="#4338ca" />,
      tag: 'Visual Architecture',
      title: 'Auto-Generated Mermaid Flowcharts',
      desc: 'Clients understand diagrams better than paragraphs. FreelanceMate AI generates interactive step-by-step system workflows and data lifecycles to include directly in your pitch.'
    },
    {
      icon: <Cpu size={24} color="#4338ca" />,
      tag: 'Technical Scoping',
      title: 'Tailored Tech Stack Recommendations',
      desc: 'Receive curated technology picks (Frontend, Backend, Database, Cloud) with clear technical justifications so you can explain exactly why each tool was chosen.'
    },
    {
      icon: <Coins size={24} color="#4338ca" />,
      tag: 'Commercial Clarity',
      title: 'Realistic INR Pricing & Milestones',
      desc: 'Stop undercharging. Get automated effort estimates in weeks and approximate market rates in INR, broken down across development phases from setup to QA.'
    },
    {
      icon: <ShieldCheck size={24} color="#4338ca" />,
      tag: 'Risk Management',
      title: 'Scope Creep Defense & Clarifying Questions',
      desc: 'Avoid doing free work. Receive the exact questions you need to ask the client before signing, plus formal assumptions to insert into your work agreements.'
    },
    {
      icon: <MessageSquare size={24} color="#4338ca" />,
      tag: 'Interactive AI',
      title: 'Conversational Follow-Up Engine',
      desc: 'Need to reduce the deadline to 2 weeks? Want to explore PostgreSQL instead of MongoDB? Ask the AI follow-up questions to customize the plan interactively.'
    }
  ];

  return (
    <div className="fm-page-wrapper">
      <div className="fm-container">
        {/* Page Hero */}
        <div className="fm-page-header">
          <div className="fm-badge-pill">Platform Capabilities</div>
          <h1 className="fm-page-title">
            Everything you need to turn <br />
            inquiries into winning proposals.
          </h1>
          <p className="fm-page-subtitle">
            FreelanceMate AI bridges the gap between chaotic client ideas and professional software architecture.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="fm-features-detail-grid">
          {featuresList.map((item, idx) => (
            <div key={idx} className="fm-feature-detail-card">
              <div className="fm-feature-icon-box">{item.icon}</div>
              <span className="fm-feature-tag">{item.tag}</span>
              <h3 className="fm-feature-heading">{item.title}</h3>
              <p className="fm-feature-body">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="fm-comparison-card">
          <div className="fm-comparison-header">
            <h2>The FreelanceMate AI Advantage</h2>
            <p>Why modern freelance developers win more projects with AI scoping</p>
          </div>

          <div className="fm-comparison-cols">
            <div className="fm-comp-col negative">
              <h4>❌ The Old Manual Way</h4>
              <ul>
                <li>Hours spent parsing unformatted client WhatsApp messages</li>
                <li>Vague estimates that lead to scope creep and unpaid revisions</li>
                <li>No visual diagrams to prove technical credibility</li>
                <li>Guessing market rates and underpricing complex integrations</li>
              </ul>
            </div>

            <div className="fm-comp-col positive">
              <h4>✅ With FreelanceMate AI</h4>
              <ul>
                <li>Single prompt instant breakdown in under 30 seconds</li>
                <li>Bulletproof milestone scopes and protective client questions</li>
                <li>Auto-rendered interactive Mermaid flowcharts</li>
                <li>Ready-to-send professional proposals with pricing in INR</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="fm-cta-banner">
          <div className="fm-cta-content">
            <h2>Ready to scope your next client project?</h2>
            <p>Join freelancers using AI to close deals faster and protect their project timelines.</p>
          </div>
          <button
            type="button"
            className="fm-btn-primary fm-cta-btn"
            onClick={onStartAnalyzing}
          >
            <span>Start analyzing now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
