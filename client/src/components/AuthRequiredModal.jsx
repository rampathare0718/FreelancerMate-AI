import React from 'react';
import { X, Lock, LogIn, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthRequiredModal({
  isOpen,
  onClose,
  onGoToLogin,
  onGoToSignup,
  onPreviewSample
}) {
  if (!isOpen) return null;

  return (
    <div className="fm-modal-backdrop" onClick={onClose}>
      <div
        className="fm-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          type="button"
          className="fm-modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="fm-modal-header">
          <div className="fm-modal-icon-badge">
            <Lock size={22} color="#4338ca" />
          </div>
          <h2 id="auth-modal-title" className="fm-modal-title">
            Sign In to Start Analyzing
          </h2>
          <p className="fm-modal-subtitle">
            To analyze client requirements, generate interactive flowcharts, and save project plans, please log in or create your free account.
          </p>
        </div>

        <div className="fm-modal-benefits">
          <div className="fm-modal-benefit-item">
            <CheckCircle2 size={16} color="#4338ca" />
            <span>Save analyzed projects directly to your MongoDB workspace</span>
          </div>
          <div className="fm-modal-benefit-item">
            <CheckCircle2 size={16} color="#4338ca" />
            <span>Generate interactive Mermaid flowcharts & step-by-step lifecycles</span>
          </div>
          <div className="fm-modal-benefit-item">
            <CheckCircle2 size={16} color="#4338ca" />
            <span>Ask unlimited AI follow-up questions regarding scope and tech stack</span>
          </div>
        </div>

        <div className="fm-modal-actions">
          <button
            type="button"
            className="fm-btn-primary fm-modal-btn"
            onClick={() => {
              onClose();
              onGoToSignup();
            }}
          >
            <UserPlus size={18} />
            <span>Sign up free (Create Account)</span>
          </button>

          <button
            type="button"
            className="fm-btn-secondary fm-modal-btn"
            onClick={() => {
              onClose();
              onGoToLogin();
            }}
          >
            <LogIn size={18} />
            <span>Log in to Existing Account</span>
          </button>
        </div>

        <div className="fm-modal-footer">
          <button
            type="button"
            className="fm-modal-sample-link"
            onClick={() => {
              onClose();
              onPreviewSample();
            }}
          >
            <Sparkles size={14} />
            <span>Or explore a Sample Project Analysis without signing in</span>
          </button>
        </div>
      </div>
    </div>
  );
}
