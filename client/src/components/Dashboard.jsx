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
  Sparkles
} from 'lucide-react';

export default function Dashboard({
  currentUser,
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

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios
          .get('/api/projects')
          .catch(() => axios.get('http://localhost:5000/api/projects'));

        if (res.data && res.data.success) {
          setProjects(res.data.data.projects || []);
          if (res.data.data.stats) {
            setStats(res.data.data.stats);
          }
        }
      } catch (err) {
        console.warn('Failed to load projects, using defaults:', err.message);
        // Fallback default sample data matching user's screenshot
        setProjects([
          {
            _id: '1',
            title: 'Bakery ordering website',
            clientName: 'Sweet Crumbs',
            status: 'analyzed',
            timeEstimate: '6-8 wks'
          },
          {
            _id: '2',
            title: 'Gym booking app',
            clientName: 'FitHub',
            status: 'proposal_sent',
            timeEstimate: '10 wks'
          },
          {
            _id: '3',
            title: 'Portfolio redesign',
            clientName: 'A. Mehta',
            status: 'draft',
            timeEstimate: '2 wks'
          },
          {
            _id: '4',
            title: 'Inventory dashboard',
            clientName: 'Nova Traders',
            status: 'analyzed',
            timeEstimate: '5 wks'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
              onClick={onNewProject}
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
            onClick={onNewProject}
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
                  title="Click to view full analysis & proposal"
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
    </div>
  );
}
