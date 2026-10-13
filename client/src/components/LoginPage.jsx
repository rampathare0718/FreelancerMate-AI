import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, ArrowLeft, AlertCircle, CheckCircle2, Lock, Mail } from 'lucide-react';

export default function LoginPage({
  onLoginSuccess,
  onGoToSignup,
  onGoToHome
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('/api/users/login', {
        email: email.trim().toLowerCase(),
        password
      }).catch(err => {
        // Fallback directly to localhost:5000 if proxy isn't caught
        return axios.post('http://localhost:5000/api/users/login', {
          email: email.trim().toLowerCase(),
          password
        });
      });

      if (res.data && res.data.success) {
        setSuccessMsg('Welcome back! Logging you in...');
        setTimeout(() => {
          onLoginSuccess(res.data.data);
        }, 500);
      } else {
        setError(res.data?.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fm-auth-page-wrapper">
      <div className="fm-auth-card">
        <button
          type="button"
          className="fm-auth-back-link"
          onClick={onGoToHome}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="fm-auth-header">
          <div className="fm-auth-icon-badge">
            <LogIn size={22} color="#4338ca" />
          </div>
          <h2 className="fm-auth-title">Welcome Back</h2>
          <p className="fm-auth-subtitle">
            Log in to FreelanceMate AI to scope projects and generate plans.
          </p>
        </div>

        {error && (
          <div className="fm-auth-alert error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="fm-auth-alert success">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="fm-auth-form">
          <div className="fm-form-field">
            <label className="fm-form-label" htmlFor="login-email">
              Email Address
            </label>
            <div className="fm-input-with-icon">
              <Mail size={16} className="fm-field-icon" />
              <input
                id="login-email"
                type="email"
                className="fm-form-input"
                placeholder="e.g. alex@freelance.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="fm-form-field">
            <label className="fm-form-label" htmlFor="login-password">
              Password
            </label>
            <div className="fm-input-with-icon">
              <Lock size={16} className="fm-field-icon" />
              <input
                id="login-password"
                type="password"
                className="fm-form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="fm-btn-primary fm-auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Log In'}
          </button>
        </form>

        <div className="fm-auth-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="fm-auth-switch-btn"
              onClick={onGoToSignup}
            >
              Sign up free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
