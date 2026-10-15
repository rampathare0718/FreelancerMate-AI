import React from 'react';
import {
  Sparkles,
  Bot,
  User,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import FreelanceMateLogo from './FreelanceMateLogo';

export default function Navbar({
  currentView,
  setCurrentView,
  currentUser,
  onLogout,
  onOpenAuthModal
}) {
  return (
    <header className="fm-header">
      <div className="fm-header-container">
        {/* Brand Logo with Glowing SVG Emblem */}
        <button
          type="button"
          className="fm-brand-btn"
          onClick={() => setCurrentView('home')}
          title="FreelanceMate AI - Home"
        >
          <FreelanceMateLogo size="md" />
        </button>

        {/* Navigation Items */}
        <nav className="fm-nav-links">
          <button
            type="button"
            className={`fm-nav-link ${currentView === 'features' ? 'active' : ''}`}
            onClick={() => setCurrentView('features')}
          >
            Features
          </button>

          <button
            type="button"
            className={`fm-nav-link ${currentView === 'how-it-works' ? 'active' : ''}`}
            onClick={() => setCurrentView('how-it-works')}
          >
            How it works
          </button>

          {/* Conditional based on Auth state */}
          {currentUser ? (
            <div className="fm-user-nav-group">
              <button
                type="button"
                className={`fm-nav-link fm-analyzer-nav ${currentView === 'analyzer' ? 'active' : ''}`}
                onClick={() => setCurrentView('analyzer')}
              >
                <Bot size={16} />
                <span>AI Scoper</span>
              </button>

              <div className="fm-user-pill" title={`Logged in as ${currentUser.email}`}>
                <User size={14} />
                <span>{currentUser.name.split(' ')[0]}</span>
              </div>

              <button
                type="button"
                className="fm-nav-link fm-logout-btn"
                onClick={onLogout}
                title="Log out"
              >
                <LogOut size={15} />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="fm-auth-nav-group">
              <button
                type="button"
                className={`fm-nav-link fm-login-link ${currentView === 'login' ? 'active' : ''}`}
                onClick={() => setCurrentView('login')}
              >
                Log in
              </button>

              <button
                type="button"
                className="fm-btn-primary fm-signup-nav-btn"
                onClick={() => setCurrentView('signup')}
              >
                Sign up free
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
