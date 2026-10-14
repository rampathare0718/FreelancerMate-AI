import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Bot,
  User,
  Clock,
  Coins,
  Search,
  Filter,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { exportProposalToPdf } from '../utils/pdfExporter';
import { generateStructuredProposal } from '../utils/proposalGenerator';

export default function ProposalsView({
  projects = [],
  onOpenProposalModal,
  onOpenInChatbot,
  onOpenNewProjectModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'proposal_sent' | 'analyzed' | 'draft'
  const [downloadingProjectId, setDownloadingProjectId] = useState(null);

  // Filter projects/proposals
  const filteredProjects = projects.filter((proj) => {
    const titleMatch = (proj.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const clientMatch = (proj.clientName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || clientMatch;

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return proj.status === statusFilter;
  });

  // Calculate quick proposal stats
  const totalProposals = projects.length;
  const sentProposals = projects.filter((p) => p.status === 'proposal_sent').length;
  const draftProposals = projects.filter((p) => p.status === 'draft').length;

  const handleQuickPdfDownload = async (e, proj) => {
    e.stopPropagation();
    setDownloadingProjectId(proj._id);

    try {
      // First open the modal or export directly using temporary container
      onOpenProposalModal(proj);
      // Brief timeout to let the DOM element mount if not already present
      setTimeout(async () => {
        const cleanName = (proj.clientName || 'Client').replace(/\s+/g, '_');
        await exportProposalToPdf('fm-proposal-print-area', `${cleanName}_Project_Proposal.pdf`);
        setDownloadingProjectId(null);
      }, 500);
    } catch (err) {
      console.error('Quick PDF download failed:', err);
      setDownloadingProjectId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'proposal_sent':
        return <span className="fm-status-pill proposal-sent">Proposal sent</span>;
      case 'analyzed':
        return <span className="fm-status-pill analyzed">Analyzed</span>;
      case 'draft':
        return <span className="fm-status-pill draft">Draft</span>;
      default:
        return <span className="fm-status-pill analyzed">{status || 'Ready'}</span>;
    }
  };

  return (
    <div className="fm-proposals-view-container">
      {/* Top Header */}
      <div className="fm-dash-header">
        <div>
          <h1 className="fm-dash-title">Client Proposals</h1>
          <p className="fm-dash-subtitle">
            Formal, 2-page executive proposals generated for your clients with 1-click PDF export
          </p>
        </div>

        <button
          type="button"
          className="fm-btn-primary fm-btn-new-project"
          onClick={onOpenNewProjectModal}
        >
          <PlusCircle size={16} />
          <span>+ Generate New Proposal</span>
        </button>
      </div>

      {/* Metric Stats Banner */}
      <section className="fm-stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="fm-stat-card">
          <span className="fm-stat-label">Total Proposals</span>
          <div className="fm-stat-num">{totalProposals}</div>
        </div>

        <div className="fm-stat-card">
          <span className="fm-stat-label">Proposals Sent</span>
          <div className="fm-stat-num">{sentProposals || 1}</div>
        </div>

        <div className="fm-stat-card">
          <span className="fm-stat-label">Ready / Draft</span>
          <div className="fm-stat-num">{draftProposals || totalProposals - (sentProposals || 1)}</div>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <div className="fm-proposals-filter-bar">
        <div className="fm-search-input-wrap">
          <Search size={16} className="fm-search-icon" />
          <input
            type="text"
            className="fm-search-input"
            placeholder="Search by client name or project title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="fm-filter-pills-row">
          <button
            type="button"
            className={`fm-filter-chip ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Proposals ({projects.length})
          </button>
          <button
            type="button"
            className={`fm-filter-chip ${statusFilter === 'proposal_sent' ? 'active' : ''}`}
            onClick={() => setStatusFilter('proposal_sent')}
          >
            Sent
          </button>
          <button
            type="button"
            className={`fm-filter-chip ${statusFilter === 'analyzed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('analyzed')}
          >
            Analyzed
          </button>
          <button
            type="button"
            className={`fm-filter-chip ${statusFilter === 'draft' ? 'active' : ''}`}
            onClick={() => setStatusFilter('draft')}
          >
            Draft
          </button>
        </div>
      </div>

      {/* Proposals Grid */}
      {filteredProjects.length === 0 ? (
        <div className="fm-empty-proposals-card">
          <div className="fm-empty-icon-wrap">
            <FileText size={36} color="#94a3b8" />
          </div>
          <h3>No proposals found</h3>
          <p>
            {searchQuery
              ? `No proposals match "${searchQuery}". Try a different search term.`
              : 'You haven\'t created any proposals yet. Scope a project with our AI to generate a full 2-page proposal!'}
          </p>
          <button
            type="button"
            className="fm-btn-primary"
            onClick={onOpenNewProjectModal}
            style={{ marginTop: '0.75rem' }}
          >
            <Sparkles size={16} />
            <span>Generate First Proposal</span>
          </button>
        </div>
      ) : (
        <div className="fm-proposals-grid">
          {filteredProjects.map((proj, idx) => {
            const data = generateStructuredProposal(proj);
            const isDownloadingThis = downloadingProjectId === proj._id;

            return (
              <div
                key={proj._id || idx}
                className="fm-proposal-card"
                onClick={() => onOpenProposalModal(proj)}
              >
                {/* Card Top: Client & Status */}
                <div className="fm-pcard-header">
                  <div className="fm-pcard-client-badge">
                    <div className="fm-client-avatar">
                      <User size={14} />
                    </div>
                    <div>
                      <span className="fm-client-label">Client</span>
                      <strong className="fm-client-name">{proj.clientName || 'Direct Client'}</strong>
                    </div>
                  </div>

                  <div>{getStatusBadge(proj.status)}</div>
                </div>

                {/* Card Main: Title & Excerpt */}
                <h3 className="fm-proposal-card-title">{proj.title}</h3>
                <p className="fm-proposal-card-excerpt">
                  {data.executiveSummary.length > 130
                    ? `${data.executiveSummary.substring(0, 130)}...`
                    : data.executiveSummary}
                </p>

                {/* Card Meta details */}
                <div className="fm-proposal-card-meta">
                  <div className="fm-card-meta-item">
                    <Coins size={14} color="#4338ca" />
                    <span><strong>{proj.pricingEstimate || data.pricingEstimate}</strong></span>
                  </div>
                  <div className="fm-card-meta-item">
                    <Clock size={14} color="#64748b" />
                    <span>{proj.timeEstimate || data.timeEstimate}</span>
                  </div>
                  <div className="fm-card-meta-item">
                    <Calendar size={14} color="#64748b" />
                    <span>{data.dateStr}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="fm-proposal-card-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="fm-btn-card-action primary"
                    onClick={() => onOpenProposalModal(proj)}
                    title="View 2-page detailed proposal document"
                  >
                    <Eye size={15} />
                    <span>View Proposal</span>
                  </button>

                  <button
                    type="button"
                    className="fm-btn-card-action secondary"
                    onClick={(e) => handleQuickPdfDownload(e, proj)}
                    disabled={isDownloadingThis}
                    title="Convert and download proposal as PDF"
                  >
                    {isDownloadingThis ? (
                      <>
                        <span className="fm-spinner-inline" />
                        <span>Converting...</span>
                      </>
                    ) : (
                      <>
                        <Download size={15} />
                        <span>Convert to PDF</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="fm-btn-card-action icon-only"
                    onClick={() => onOpenInChatbot(proj)}
                    title="Open in AI Chatbot"
                  >
                    <Bot size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
