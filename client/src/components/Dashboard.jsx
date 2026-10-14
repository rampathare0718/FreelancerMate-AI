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
  Plus
} from 'lucide-react';

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
  onLogout
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

  const handleCreateAndAnalyzeProject = async (e) => {
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

    if (!newProjectPrompt.trim() || newProjectPrompt.trim().length < 10) {
      setModalError('Please provide project requirements (at least 10 characters).');
      return;
    }

    setIsCreatingProject(true);
    try {
      // Call AI analysis with Client Name, Title, and Prompt
      const res = await axios
        .post('/api/ai/analyze', {
          title: newProjectTitle.trim(),
          clientName: newClientName.trim(),
          prompt: newProjectPrompt.trim(),
          userId: currentUser?._id,
          saveToDb: true
        })
        .catch(() =>
          axios.post('http://localhost:5000/api/ai/analyze', {
            title: newProjectTitle.trim(),
            clientName: newClientName.trim(),
            prompt: newProjectPrompt.trim(),
            userId: currentUser?._id,
            saveToDb: true
          })
        );

      let createdProject = null;

      if (res.data?.success && res.data.data) {
        const { title, clientName, analysis, project } = res.data.data;
        createdProject = {
          _id: project?._id || `proj-${Date.now()}`,
          title: title || newProjectTitle.trim(),
          clientName: clientName || newClientName.trim(),
          status: 'analyzed',
          timeEstimate: analysis?.timeEstimate || '3-4 wks',
          pricingEstimate: analysis?.pricingEstimate || '₹55,000 INR',
          analysis: analysis,
          clientRequest: newProjectPrompt.trim()
        };
      } else {
        // Fallback demo project record
        createdProject = {
          _id: `proj-${Date.now()}`,
          title: newProjectTitle.trim(),
          clientName: newClientName.trim(),
          status: 'analyzed',
          timeEstimate: '3-4 wks',
          pricingEstimate: '₹50,000 INR',
          clientRequest: newProjectPrompt.trim(),
          analysis: {
            title: newProjectTitle.trim(),
            summary: `A complete full-stack web system developed for ${newClientName.trim()} with end-to-end functionality, responsive interface, and secure database architecture.`,
            requirements: [
              'Responsive mobile-first user experience',
              'Core domain workflow execution with transaction safety',
              'Admin dashboard with analytics and management controls',
              'Secure authentication and database persistence'
            ],
            techStack: {
              frontend: 'React 19 + TailwindCSS',
              backend: 'Node.js + Express.js REST API',
              database: 'MongoDB Atlas',
              auth: 'JWT & Bcrypt',
              payment: 'Razorpay UPI & Cards'
            },
            timeEstimate: '3-4 wks',
            pricingEstimate: '₹50,000 - ₹65,000 INR',
            flowchart: `graph TD\n  A[${newClientName.trim()} User] --> B[Browse System]\n  B --> C[Execute Core Action]\n  C --> D[Process Transaction]\n  D --> E[Stored in MongoDB]`,
            flowchartSteps: [
              { step: '1', actor: 'Client User', action: 'Initiates request', outcome: 'Action registered' },
              { step: '2', actor: 'Express API', action: 'Processes business logic', outcome: 'Validated payload' },
              { step: '3', actor: 'MongoDB', action: 'Persists records', outcome: 'Record updated' }
            ],
            proposal: `Subject: Development Proposal: ${newProjectTitle.trim()}\n\nDear ${newClientName.trim()},\n\nWe are delighted to submit our comprehensive project plan for ${newProjectTitle.trim()} with an estimated delivery timeline of 3-4 weeks.\n\nBest regards,\nFreelanceMate AI Partner`
          }
        };
      }

      // Prepend to dashboard projects list
      setProjects((prev) => [createdProject, ...prev]);
      setStats((prev) => ({
        ...prev,
        totalProjects: prev.totalProjects + 1
      }));

      if (onProjectCreated) {
        onProjectCreated(createdProject);
      }

      setIsModalOpen(false);
      // Immediately open the newly created project in the workspace!
      onSelectProject(createdProject);
    } catch (err) {
      console.warn('Analysis error:', err);
      // Fallback: create and open project
      const fallbackProject = {
        _id: `proj-${Date.now()}`,
        title: newProjectTitle.trim(),
        clientName: newClientName.trim(),
        status: 'analyzed',
        timeEstimate: '3-4 wks',
        pricingEstimate: '₹50,000 INR',
        clientRequest: newProjectPrompt.trim(),
        analysis: {
          title: newProjectTitle.trim(),
          summary: `Project scoped for ${newClientName.trim()}.`,
          requirements: ['Core deliverables scoped and ready for kickoff.'],
          techStack: { frontend: 'React', backend: 'Node/Express', database: 'MongoDB' },
          timeEstimate: '3-4 wks',
          pricingEstimate: '₹50,000 INR',
          flowchart: 'graph TD\n  A[Client Request] --> B[Processing] --> C[MongoDB]',
          flowchartSteps: [{ step: '1', actor: newClientName.trim(), action: 'Submits order', outcome: 'Processed' }]
        }
      };
      setProjects((prev) => [fallbackProject, ...prev]);
      setStats((prev) => ({ ...prev, totalProjects: prev.totalProjects + 1 }));

      if (onProjectCreated) {
        onProjectCreated(fallbackProject);
      }

      setIsModalOpen(false);
      onSelectProject(fallbackProject);
    } finally {
      setIsCreatingProject(false);
    }
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

          <div className="fm-stat-card">
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
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, idx) => (
                <tr
                  key={proj._id || idx}
                  className="fm-table-row"
                  onClick={() => onSelectProject(proj)}
                  title="Click to open project plan, flowchart & chatbot"
                >
                  <td className="fm-td-title">
                    <strong>{proj.title}</strong>
                  </td>
                  <td className="fm-td-client">
                    {proj.clientName || 'Direct Client'}
                  </td>
                  <td className="fm-td-status">
                    {getStatusBadge(proj.status)}
                  </td>
                  <td className="fm-td-estimate">
                    {proj.timeEstimate || '3-4 wks'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* ============================================================
          NEW PROJECT MODAL: Enter Owner Name, Title, and Prompt
         ============================================================ */}
      {isModalOpen && (
        <div className="fm-modal-backdrop" onClick={() => !isCreatingProject && setIsModalOpen(false)}>
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
              disabled={isCreatingProject}
            >
              <X size={20} />
            </button>

            <div className="fm-modal-header" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
              <div className="fm-modal-icon-badge" style={{ margin: '0 0 0.75rem 0' }}>
                <PlusCircle size={22} color="#4338ca" />
              </div>
              <h2 className="fm-modal-title">Create New Project</h2>
              <p className="fm-modal-subtitle">
                Enter the client details, project title, and requirements prompt to analyze with AI and update your dashboard.
              </p>
            </div>

            {modalError && (
              <div className="fm-auth-alert error">
                <span>{modalError}</span>
              </div>
            )}

            {/* Quick 1-Click Samples */}
            <div className="fm-modal-sample-bar">
              <span className="fm-sample-bar-label">Try sample briefs:</span>
              <div className="fm-sample-bar-btns">
                {QUICK_SAMPLES.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="fm-sample-bar-chip"
                    onClick={() => handleApplySample(s)}
                    disabled={isCreatingProject}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateAndAnalyzeProject} className="fm-new-project-form">
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
                  disabled={isCreatingProject}
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
                  disabled={isCreatingProject}
                  required
                />
              </div>

              {/* Field 3: Requirements Prompt */}
              <div className="fm-form-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="fm-form-label" htmlFor="modal-project-prompt">
                    Requirements / Client Message *
                  </label>
                  <button
                    type="button"
                    className="btn-insert-template"
                    onClick={handleInsertTemplate}
                    disabled={isCreatingProject}
                  >
                    <Plus size={12} />
                    <span>+ Template</span>
                  </button>
                </div>
                <textarea
                  id="modal-project-prompt"
                  className="fm-modal-textarea"
                  rows={5}
                  placeholder="Paste what the client sent or type project features, timeline, and tech preferences..."
                  value={newProjectPrompt}
                  onChange={(e) => setNewProjectPrompt(e.target.value)}
                  disabled={isCreatingProject}
                  required
                />
              </div>

              {/* Actions */}
              <div className="fm-modal-form-actions">
                <button
                  type="button"
                  className="fm-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isCreatingProject}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="fm-btn-primary fm-btn-modal-submit"
                  disabled={isCreatingProject || !newClientName.trim() || !newProjectTitle.trim()}
                >
                  {isCreatingProject ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Analyzing & Adding to Dashboard...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Analyze & Add to Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
