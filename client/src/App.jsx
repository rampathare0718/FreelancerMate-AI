import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import FeaturesPage from './components/FeaturesPage';
import HowItWorksPage from './components/HowItWorksPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AiBotScoper from './components/AiBotScoper';
import AuthRequiredModal from './components/AuthRequiredModal';
import SamplePreviewModal from './components/SamplePreviewModal';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'features' | 'how-it-works' | 'login' | 'signup' | 'analyzer'
  const [currentUser, setCurrentUser] = useState(null);
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
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored user session:', e);
    }
  }, []);

  // Handle Login success
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('freelancermate_user', JSON.stringify(userData));
    setCurrentView('analyzer');
  };

  // Handle Signup success
  const handleSignupSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('freelancermate_user', JSON.stringify(userData));
    setCurrentView('analyzer');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('freelancermate_user');
    setCurrentView('home');
  };

  // Handle Start Analyzing click
  const handleStartAnalyzing = () => {
    if (currentUser) {
      setCurrentView('analyzer');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Handle See Sample click
  const handleSeeSample = () => {
    setIsSampleModalOpen(true);
  };

  return (
    <div className="fm-app-root">
      {/* Universal Top Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Display */}
      <main className="fm-main-content">
        {currentView === 'home' && (
          <HomePage
            onStartAnalyzing={handleStartAnalyzing}
            onSeeSample={handleSeeSample}
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

        {currentView === 'analyzer' && (
          <div className="fm-analyzer-view-container">
            <div className="fm-analyzer-subhead">
              <div className="fm-container">
                <div className="fm-analyzer-banner">
                  <span className="fm-analyzer-welcome">
                    👋 Welcome back, <strong>{currentUser ? currentUser.name : 'Freelancer'}</strong>! Your AI workspace is ready.
                  </span>
                  <button
                    type="button"
                    className="fm-btn-text"
                    onClick={() => setCurrentView('home')}
                  >
                    ← Back to Home
                  </button>
                </div>
              </div>
            </div>
            <div className="fm-container">
              <AiBotScoper currentUser={currentUser} />
            </div>
          </div>
        )}
      </main>

      {/* Universal Footer */}
      <footer className="fm-footer">
        <div className="fm-footer-container">
          <div className="fm-footer-brand">
            <span className="fm-footer-logo">FreelanceMate AI</span>
            <p>AI-powered project scoping, roadmap creation, and client proposals for modern freelance developers.</p>
          </div>
          <div className="fm-footer-links">
            <button type="button" onClick={() => setCurrentView('features')}>Features</button>
            <button type="button" onClick={() => setCurrentView('how-it-works')}>How it works</button>
            {currentUser ? (
              <button type="button" onClick={() => setCurrentView('analyzer')}>AI Scoper</button>
            ) : (
              <>
                <button type="button" onClick={() => setCurrentView('login')}>Log in</button>
                <button type="button" onClick={() => setCurrentView('signup')}>Sign up free</button>
              </>
            )}
          </div>
        </div>
        <div className="fm-footer-bottom">
          <p>&copy; {new Date().getFullYear()} FreelanceMate AI. Powered by Google Gemma & MERN Stack.</p>
        </div>
      </footer>

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
