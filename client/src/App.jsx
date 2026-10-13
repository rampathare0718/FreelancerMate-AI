import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Sparkles,
  Bot,
  Users,
  Terminal,
  Activity,
  Layers,
  Code2,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';
import AiBotScoper from './components/AiBotScoper';
import UserManagement from './components/UserManagement';
import './App.css';

export default function App() {
  const [activeView, setActiveView] = useState('ai'); // 'ai' | 'users'
  const [serverStatus, setServerStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  const checkServerHealth = async () => {
    try {
      await axios.get('/api/health').catch(() => {
        return axios.get('http://localhost:5000/api/health');
      });
      setServerStatus('online');
    } catch (err) {
      setServerStatus('offline');
    }
  };

  useEffect(() => {
    checkServerHealth();
  }, []);

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <h1 className="brand-title">FreelancerMate AI</h1>
          </div>
          <span className="badge-pill">Gemma 2B + MERN</span>
        </div>

        {/* View Switcher Navigation Tabs */}
        <div className="nav-view-switcher">
          <button
            type="button"
            className={`view-tab-btn ${activeView === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveView('ai')}
          >
            <Bot size={16} />
            <span>AI Bot Scoper</span>
          </button>

          <button
            type="button"
            className={`view-tab-btn ${activeView === 'users' ? 'active' : ''}`}
            onClick={() => setActiveView('users')}
          >
            <Users size={16} />
            <span>Users & Database</span>
          </button>
        </div>

        {/* System Status Pill */}
        <div className="system-status">
          <div className="status-badge" title="Express REST API & MongoDB connection status">
            <div
              className={`status-dot ${
                serverStatus === 'online' ? 'online' : 'offline'
              }`}
            />
            <span>
              {serverStatus === 'online'
                ? 'Backend Online (Port 5000)'
                : serverStatus === 'checking'
                ? 'Connecting to Server...'
                : 'Backend Offline'}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="main-content">
        {activeView === 'ai' ? (
          <div>
            {/* Hero Header for AI Bot */}
            <header className="hero">
              <div className="hero-tag">
                <Zap size={15} color="#818cf8" />
                <span>Local AI Inference with Google Gemma</span>
              </div>
              <h1 className="hero-heading">
                Turn Client Inquiries into <br />
                <span className="text-gradient">Scopes, Roadmaps & Proposals</span>
              </h1>
              <p className="hero-subtitle">
                Paste raw client requirements below. The Gemma bot will break down the features,
                recommend optimal tech stacks, calculate timeline & pricing in INR, and craft a client proposal.
              </p>
            </header>

            {/* AI Bot Scoper Component */}
            <AiBotScoper />
          </div>
        ) : (
          <div>
            {/* Header for Users View */}
            <header className="hero">
              <div className="hero-tag">
                <Users size={15} color="#818cf8" />
                <span>MongoDB User Schema Verification</span>
              </div>
              <h1 className="hero-heading">
                Manage Registered <span className="text-gradient">Users</span>
              </h1>
              <p className="hero-subtitle">
                Verify the Mongoose User model with name, email, age, and auto-hashed password.
              </p>
            </header>

            {/* User Management Component */}
            <UserManagement />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>FreelancerMate AI &copy; 2026 • Powered by Google Gemma & MERN Stack</p>
      </footer>
    </div>
  );
}
