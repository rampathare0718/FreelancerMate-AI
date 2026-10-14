import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard,
  PlusCircle,
  FolderGit2,
  FileText,
  Settings,
  ArrowLeft,
  LogOut,
  User,
  Clock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  X,
  Send,
  RefreshCw,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import ProposalsView from './ProposalsView';
import ClientProposalModal from './ClientProposalModal';
import SettingsView from './SettingsView';

const FORMAT_TEMPLATE = `Description: [Client requirements & core features]
Budget: [e.g. ₹60,000 INR (Optional)]
Deadline: [e.g. 4 Weeks (Optional)]
Tech Preferences: [e.g. React, Node.js (Optional)]`;

const QUICK_SAMPLES = [
  {
    client: 'Sweet Crumbs',
    title: 'Bakery ordering website',
    prompt: `Title: Artisan Bakery Online Ordering & Delivery System
Client: Sweet Crumbs
Description: Need a website for our bakery with online cake customization, daily delivery time-slot selector with order capacity limits, and UPI payment integration.
Budget: ₹55,000 INR
Deadline: 4 Weeks
Tech Preferences: MERN Stack, Razorpay`
  },
  {
    client: 'FitHub',
    title: 'Gym booking app',
    prompt: `Title: Gym booking app
Client: FitHub
Description: Class schedule booking, personal trainer slot reservations, and member monthly subscription management with automated WhatsApp alerts.
Budget: ₹80,000 INR
Deadline: 6 Weeks
Tech Preferences: React, Node.js, Express, MongoDB, Twilio API`
  },
  {
    client: 'Nova Traders',
    title: 'Inventory dashboard',
    prompt: `Title: Multi-Warehouse Inventory Dashboard
Client: Nova Traders
Description: Real-time stock tracking across 3 warehouses, low-stock threshold alerts, supplier invoice management, and daily PDF report export.
Budget: ₹70,000 INR
Deadline: 5 Weeks
Tech Preferences: React, Node.js, MongoDB Atlas`
  }
];

export default function Dashboard({
  currentUser,
  customProjects = [],
  onProjectCreated,
  onNewProject,
  onSelectProject,
  onGoToHome,
  onLogout,
  onUpdateUser
}) {
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 8,
    proposalsSent: 5,
    awaitingReply: 2
  });
  const [isLoading, setIsLoading] = useState(true);

  // New Project Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectPrompt, setNewProjectPrompt] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Client Proposal Document Modal State
  const [selectedProposalProject, setSelectedProposalProject] = useState(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  const handleOpenProposalModal = (proj) => {
    setSelectedProposalProject(proj);
    setIsProposalModalOpen(true);
  };

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios
          .get('/api/projects')
          .catch(() => axios.get('http://localhost:5000/api/projects'));

        let fetchedList = [];
        if (res.data && res.data.success) {
          fetchedList = res.data.data.projects || [];
          if (res.data.data.stats) {
            setStats((prev) => ({
              ...res.data.data.stats,
              totalProjects: Math.max(res.data.data.stats.totalProjects, (customProjects.length + fetchedList.length))
            }));
          }
        } else {
          fetchedList = [
            {
              _id: 'seed-1',
              title: 'Bakery ordering website',
              clientName: 'Sweet Crumbs',
              status: 'analyzed',
              timeEstimate: '6-8 wks'
            },
            {
              _id: 'seed-2',
              title: 'Gym booking app',
              clientName: 'FitHub',
              status: 'proposal_sent',
              timeEstimate: '10 wks'
            },
            {
              _id: 'seed-3',
              title: 'Portfolio redesign',
              clientName: 'A. Mehta',
              status: 'draft',
              timeEstimate: '2 wks'
            },
            {
              _id: 'seed-4',
              title: 'Inventory dashboard',
              clientName: 'Nova Traders',
              status: 'analyzed',
              timeEstimate: '5 wks'
            }
          ];
        }

        // Merge customProjects so any projects created in the session show up first
        const merged = [
          ...customProjects,
          ...fetchedList.filter((f) => !customProjects.some((c) => c._id === f._id))
        ];
        setProjects(merged);
      } catch (err) {
        console.warn('Failed to load projects, using defaults:', err.message);
        // Fallback default sample data matching user's screenshot
        const fallbackList = [
          {
            _id: 'seed-1',
            title: 'Bakery ordering website',
            clientName: 'Sweet Crumbs',
            status: 'analyzed',
            timeEstimate: '6-8 wks'
          },
          {
            _id: 'seed-2',
            title: 'Gym booking app',
            clientName: 'FitHub',
            status: 'proposal_sent',
            timeEstimate: '10 wks'
          },
          {
            _id: 'seed-3',
            title: 'Portfolio redesign',
            clientName: 'A. Mehta',
            status: 'draft',
            timeEstimate: '2 wks'
          },
          {
            _id: 'seed-4',
            title: 'Inventory dashboard',
            clientName: 'Nova Traders',
            status: 'analyzed',
            timeEstimate: '5 wks'
          }
        ];
        const merged = [
          ...customProjects,
          ...fallbackList.filter((f) => !customProjects.some((c) => c._id === f._id))
        ];
        setProjects(merged);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [customProjects]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'analyzed':
        return <span className="fm-status-pill analyzed">Analyzed</span>;
      case 'proposal_sent':
        return <span className="fm-status-pill proposal-sent">Proposal sent</span>;
      case 'draft':
        return <span className="fm-status-pill draft">Draft</span>;
      case 'completed':
        return <span className="fm-status-pill completed">Completed</span>;
      default:
        return <span className="fm-status-pill analyzed">{status}</span>;
    }
  };

  const handleOpenNewProjectModal = () => {
    setNewClientName('');
    setNewProjectTitle('');
    setNewProjectPrompt('');
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleApplySample = (sample) => {
    setNewClientName(sample.client);
    setNewProjectTitle(sample.title);
    setNewProjectPrompt(sample.prompt);
  };

  const handleInsertTemplate = () => {
    setNewProjectPrompt(FORMAT_TEMPLATE);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    setModalError(null);

    if (!newClientName.trim()) {
      setModalError('Please enter the Client / Owner Name.');
      return;
    }

    if (!newProjectTitle.trim()) {
      setModalError('Please enter the Project Title.');
      return;
    }

    const initialProject = {
      _id: `proj-${Date.now()}`,
      title: newProjectTitle.trim(),
      clientName: newClientName.trim(),
      status: 'draft',
      timeEstimate: 'Awaiting prompt',
      pricingEstimate: 'To be estimated',
      createdAt: new Date().toISOString()
    };

    // Prepend to dashboard projects list
    setProjects((prev) => [initialProject, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalProjects: prev.totalProjects + 1
    }));

    if (onProjectCreated) {
      onProjectCreated(initialProject);
    }

    setIsModalOpen(false);
    // Redirect directly to the chatbot workspace with this project
    onSelectProject(initialProject);
  };

  return (
    <div className="fm-dashboard-layout">
      {/* Left Sidebar (Matching Screenshot) */}
      <aside className="fm-sidebar">
        <div className="fm-sidebar-top">
          <button
            type="button"
            className="fm-sidebar-brand"
            onClick={onGoToHome}
            title="FreelanceMate AI - Home"
          >
            <h2>FreelanceMate AI</h2>
          </button>

          <nav className="fm-sidebar-nav">
            <button
              type="button"
              className={`fm-sidebar-link ${activeSidebarItem === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSidebarItem('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className="fm-sidebar-link"
              onClick={handleOpenNewProjectModal}
            >
              <PlusCircle size={18} />
              <span>New project</span>
            </button>

            <button
              type="button"
              className={`fm-sidebar-link ${activeSidebarItem === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveSidebarItem('projects')}
            >
              <FolderGit2 size={18} />
              <span>Projects</span>
            </button>

            <button
              type="button"
              className={`fm-sidebar-link ${activeSidebarItem === 'proposals' ? 'active' : ''}`}
              onClick={() => setActiveSidebarItem('proposals')}
            >
              <FileText size={18} />
              <span>Proposals</span>
            </button>

            <button
              type="button"
              className={`fm-sidebar-link ${activeSidebarItem === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSidebarItem('settings')}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with user info & logout */}
        <div className="fm-sidebar-bottom">
          <div className="fm-sidebar-user-box">
            <div className="fm-sidebar-avatar">
              <User size={16} />
            </div>
            <div className="fm-sidebar-user-info">
              <span className="fm-sidebar-user-name">
                {currentUser?.name || 'Freelancer'}
              </span>
              <span className="fm-sidebar-user-email">
                {currentUser?.email || 'Logged in'}
              </span>
            </div>
          </div>

          <div className="fm-sidebar-actions-row">
            <button
              type="button"
              className="fm-sidebar-sublink"
              onClick={onGoToHome}
              title="Return to public landing page"
            >
              <ArrowLeft size={14} />
              <span>Home</span>
            </button>
            <button
              type="button"
              className="fm-sidebar-sublink logout"
              onClick={onLogout}
              title="Log out"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Matching Screenshot) */}
      <main className="fm-dashboard-main">
        {/* VIEW 1: PROPOSALS TAB */}
        {activeSidebarItem === 'proposals' && (
          <ProposalsView
            projects={projects}
            onOpenProposalModal={handleOpenProposalModal}
            onOpenInChatbot={onSelectProject}
            onOpenNewProjectModal={handleOpenNewProjectModal}
          />
        )}

        {/* VIEW 2: DASHBOARD OVERVIEW */}
        {activeSidebarItem === 'dashboard' && (
          <>
            {/* Top Header Row */}
            <header className="fm-dash-header">
              <div>
                <h1 className="fm-dash-title">Your projects</h1>
                <p className="fm-dash-subtitle">Previous analyses and proposals</p>
              </div>

              <button
                type="button"
                className="fm-btn-primary fm-btn-new-project"
                onClick={handleOpenNewProjectModal}
              >
                <span>+ New project</span>
              </button>
            </header>

            {/* 3 Metric Stat Cards */}
            <section className="fm-stats-grid">
              <div className="fm-stat-card">
                <span className="fm-stat-label">Projects</span>
                <div className="fm-stat-num">{stats.totalProjects}</div>
              </div>

              <div
                className="fm-stat-card clickable"
                onClick={() => setActiveSidebarItem('proposals')}
                title="Click to view all Client Proposals"
                style={{ cursor: 'pointer' }}
              >
                <span className="fm-stat-label">Proposals sent</span>
                <div className="fm-stat-num">{stats.proposalsSent}</div>
              </div>

              <div className="fm-stat-card">
                <span className="fm-stat-label">Awaiting reply</span>
                <div className="fm-stat-num">{stats.awaitingReply}</div>
              </div>
            </section>

            {/* Projects Table Card */}
            <section className="fm-table-card">
              <table className="fm-projects-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Estimate</th>
                    <th>Proposal</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj, idx) => (
                    <tr
                      key={proj._id || idx}
                      className="fm-table-row"
                    >
                      <td className="fm-td-title" onClick={() => onSelectProject(proj)} style={{ cursor: 'pointer' }}>
                        <strong>{proj.title}</strong>
                      </td>
                      <td className="fm-td-client" onClick={() => onSelectProject(proj)} style={{ cursor: 'pointer' }}>
                        {proj.clientName || 'Direct Client'}
                      </td>
                      <td className="fm-td-status" onClick={() => onSelectProject(proj)} style={{ cursor: 'pointer' }}>
                        {getStatusBadge(proj.status)}
                      </td>
                      <td className="fm-td-estimate" onClick={() => onSelectProject(proj)} style={{ cursor: 'pointer' }}>
                        {proj.timeEstimate || '3-4 wks'}
                      </td>
                      <td className="fm-td-proposal-action" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="fm-btn-table-proposal"
                          onClick={() => handleOpenProposalModal(proj)}
                          title="View 2-page detailed proposal & export to PDF"
                        >
                          <FileText size={14} />
                          <span>View Proposal & PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {/* VIEW 3: PROJECTS TAB */}
        {activeSidebarItem === 'projects' && (
          <>
            <header className="fm-dash-header">
              <div>
                <h1 className="fm-dash-title">All Projects</h1>
                <p className="fm-dash-subtitle">Complete list of ongoing, analyzed, and draft projects</p>
              </div>

              <button
                type="button"
                className="fm-btn-primary fm-btn-new-project"
                onClick={handleOpenNewProjectModal}
              >
                <span>+ New project</span>
              </button>
            </header>

            <section className="fm-table-card">
              <table className="fm-projects-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Estimate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj, idx) => (
                    <tr key={proj._id || idx} className="fm-table-row">
                      <td className="fm-td-title" onClick={() => onSelectProject(proj)} style={{ cursor: 'pointer' }}>
                        <strong>{proj.title}</strong>
                      </td>
                      <td className="fm-td-client" onClick={() => onSelectProject(proj)} style={{ cursor: 'pointer' }}>
                        {proj.clientName || 'Direct Client'}
                      </td>
                      <td className="fm-td-status" onClick={() => onSelectProject(proj)} style={{ cursor: 'pointer' }}>
                        {getStatusBadge(proj.status)}
                      </td>
                      <td className="fm-td-estimate">
                        {proj.timeEstimate || '3-4 wks'}
                      </td>
                      <td className="fm-td-proposal-action" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '0.45rem' }}>
                          <button
                            type="button"
                            className="fm-btn-table-proposal"
                            onClick={() => handleOpenProposalModal(proj)}
                            title="View 2-page detailed proposal & export to PDF"
                          >
                            <FileText size={14} />
                            <span>Proposal</span>
                          </button>
                          <button
                            type="button"
                            className="fm-btn-table-proposal secondary"
                            onClick={() => onSelectProject(proj)}
                            title="Open in AI Chatbot"
                          >
                            <span>Chat</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {/* VIEW 4: SETTINGS & PROFILE EDITING */}
        {activeSidebarItem === 'settings' && (
          <SettingsView
            currentUser={currentUser}
            onUpdateUser={onUpdateUser}
            onLogout={onLogout}
          />
        )}
      </main>

      {/* ============================================================
          NEW PROJECT MODAL: Enter Client / Owner Name & Project Title
         ============================================================ */}
      {isModalOpen && (
        <div className="fm-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="fm-modal-card fm-new-project-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="fm-modal-close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>

            <div className="fm-modal-header" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
              <div className="fm-modal-icon-badge" style={{ margin: '0 0 0.75rem 0' }}>
                <PlusCircle size={22} color="#4338ca" />
              </div>
              <h2 className="fm-modal-title">New Project</h2>
              <p className="fm-modal-subtitle">
                Enter your client name and project title. You will then be taken directly to the AI Chatbot to provide requirements and scope the full plan.
              </p>
            </div>

            {modalError && (
              <div className="fm-auth-alert error">
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="fm-new-project-form">
              {/* Field 1: Owner / Client Name */}
              <div className="fm-form-field">
                <label className="fm-form-label" htmlFor="modal-client-name">
                  Client / Owner Name *
                </label>
                <input
                  id="modal-client-name"
                  type="text"
                  className="fm-form-input"
                  placeholder="e.g. Sweet Crumbs Bakery, FitHub, Dr. Mehta"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              {/* Field 2: Project Title */}
              <div className="fm-form-field">
                <label className="fm-form-label" htmlFor="modal-project-title">
                  Project Title *
                </label>
                <input
                  id="modal-project-title"
                  type="text"
                  className="fm-form-input"
                  placeholder="e.g. Bakery Ordering Website, Gym Booking App"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  required
                />
              </div>

              {/* Actions */}
              <div className="fm-modal-form-actions" style={{ marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="fm-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="fm-btn-primary fm-btn-modal-submit"
                  disabled={!newClientName.trim() || !newProjectTitle.trim()}
                >
                  <Sparkles size={16} />
                  <span>Continue to AI Chatbot →</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2-Page Client Proposal Modal with PDF Export */}
      <ClientProposalModal
        project={selectedProposalProject}
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        onOpenInChatbot={onSelectProject}
      />
    </div>
  );
}
