import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import FeaturesPage from './components/FeaturesPage';
import HowItWorksPage from './components/HowItWorksPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import AiChatbotWorkspace from './components/AiChatbotWorkspace';
import AuthRequiredModal from './components/AuthRequiredModal';
import SamplePreviewModal from './components/SamplePreviewModal';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'features' | 'how-it-works' | 'login' | 'signup' | 'dashboard' | 'chatbot'
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  // Restore authenticated session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('freelancermate_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setCurrentUser(parsed);
          // If already logged in, show dashboard by default
          setCurrentView('dashboard');
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored user session:', e);
    }
  }, []);

  // Handle Login success -> Directly direct user to Dashboard
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('freelancermate_user', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  // Handle Signup success -> Directly direct user to Dashboard
  const handleSignupSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('freelancermate_user', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedProject(null);
    localStorage.removeItem('freelancermate_user');
    setCurrentView('home');
  };

  // Handle Start Analyzing click
  const handleStartAnalyzing = () => {
    if (currentUser) {
      setSelectedProject(null);
      setCurrentView('chatbot');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Handle Open New Project in Chatbot
  const handleOpenNewProject = () => {
    setSelectedProject(null);
    setCurrentView('chatbot');
  };

  // Handle Select Project from Dashboard Table
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setCurrentView('chatbot');
  };

  return (
    <div className="fm-app-root">
      {/* Show Top Header Navbar on public marketing & auth views */}
      {currentView !== 'dashboard' && currentView !== 'chatbot' && (
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* Main View Display */}
      <main className="fm-main-content">
        {currentView === 'home' && (
          <HomePage
            onStartAnalyzing={handleStartAnalyzing}
            onSeeSample={() => setIsSampleModalOpen(true)}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'features' && (
          <FeaturesPage
            onStartAnalyzing={handleStartAnalyzing}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowItWorksPage
            onStartAnalyzing={handleStartAnalyzing}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onGoToSignup={() => setCurrentView('signup')}
            onGoToHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'signup' && (
          <SignupPage
            onSignupSuccess={handleSignupSuccess}
            onGoToLogin={() => setCurrentView('login')}
            onGoToHome={() => setCurrentView('home')}
          />
        )}

        {/* User Dashboard View (Matching user's screenshot with projects table & stats) */}
        {currentView === 'dashboard' && (
          <Dashboard
            currentUser={currentUser}
            onNewProject={handleOpenNewProject}
            onSelectProject={handleSelectProject}
            onGoToHome={() => setCurrentView('home')}
            onLogout={handleLogout}
          />
        )}

        {/* Dedicated Chatbot Workspace (Redesigned: Clean chat in center, separate deliverables canvas) */}
        {currentView === 'chatbot' && (
          <AiChatbotWorkspace
            currentUser={currentUser}
            selectedProject={selectedProject}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Public Footer (only on landing & info views) */}
      {currentView !== 'dashboard' && currentView !== 'chatbot' && (
        <footer className="fm-footer">
          <div className="fm-footer-container">
            <div className="fm-footer-brand">
              <span className="fm-footer-logo">FreelanceMate AI</span>
              <p>
                AI-powered project scoping, roadmap creation, and client proposals
                for modern freelance developers.
              </p>
            </div>
            <div className="fm-footer-links">
              <button type="button" onClick={() => setCurrentView('features')}>
                Features
              </button>
              <button type="button" onClick={() => setCurrentView('how-it-works')}>
                How it works
              </button>
              {currentUser ? (
                <button type="button" onClick={() => setCurrentView('dashboard')}>
                  Dashboard
                </button>
              ) : (
                <>
                  <button type="button" onClick={() => setCurrentView('login')}>
                    Log in
                  </button>
                  <button type="button" onClick={() => setCurrentView('signup')}>
                    Sign up free
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="fm-footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} FreelanceMate AI. Powered by Google
              Gemma & MERN Stack.
            </p>
          </div>
        </footer>
      )}

      {/* Modal: Account Required Prompt */}
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onGoToLogin={() => setCurrentView('login')}
        onGoToSignup={() => setCurrentView('signup')}
        onPreviewSample={() => setIsSampleModalOpen(true)}
      />

      {/* Modal: Sample Project Preview */}
      <SamplePreviewModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onStartAnalyzing={handleStartAnalyzing}
      />
    </div>
  );
}
