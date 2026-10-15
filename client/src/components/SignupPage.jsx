import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, ArrowLeft, AlertCircle, CheckCircle2, User, Mail, Lock, Calendar } from 'lucide-react';
import FreelanceMateLogo from './FreelanceMateLogo';

export default function SignupPage({
  onSignupSuccess,
  onGoToLogin,
  onGoToHome
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const { name, email, age, password } = formData;

    if (!name || !email || !age || !password) {
      setError('Please fill in all fields (Name, Email, Age, Password).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('/api/users', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        age: Number(age),
        password
      }).catch(err => {
        return axios.post('http://localhost:5000/api/users', {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          age: Number(age),
          password
        });
      });

      if (res.data && res.data.success) {
        setSuccessMsg('Account created successfully! Welcome to FreelanceMate AI.');
        setTimeout(() => {
          onSignupSuccess(res.data.data);
        }, 600);
      } else {
        setError(res.data?.message || 'Registration failed.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not create account. Please check your details.';
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
          <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>
            <FreelanceMateLogo size="lg" />
          </div>
          <h2 className="fm-auth-title">Create your free account</h2>
          <p className="fm-auth-subtitle">
            Start turning complex client messages into structured project plans.
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
            <label className="fm-form-label" htmlFor="signup-name">
              Full Name
            </label>
            <div className="fm-input-with-icon">
              <User size={16} className="fm-field-icon" />
              <input
                id="signup-name"
                name="name"
                type="text"
                className="fm-form-input"
                placeholder="e.g. Alex Morgan"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="fm-form-field">
            <label className="fm-form-label" htmlFor="signup-email">
              Email Address
            </label>
            <div className="fm-input-with-icon">
              <Mail size={16} className="fm-field-icon" />
              <input
                id="signup-email"
                name="email"
                type="email"
                className="fm-form-input"
                placeholder="e.g. alex@freelance.dev"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="fm-form-field">
            <label className="fm-form-label" htmlFor="signup-age">
              Age
            </label>
            <div className="fm-input-with-icon">
              <Calendar size={16} className="fm-field-icon" />
              <input
                id="signup-age"
                name="age"
                type="number"
                min="14"
                max="100"
                className="fm-form-input"
                placeholder="e.g. 25"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="fm-form-field">
            <label className="fm-form-label" htmlFor="signup-password">
              Password
            </label>
            <div className="fm-input-with-icon">
              <Lock size={16} className="fm-field-icon" />
              <input
                id="signup-password"
                name="password"
                type="password"
                minLength="6"
                className="fm-form-input"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="fm-btn-primary fm-auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign up free'}
          </button>
        </form>

        <div className="fm-auth-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="fm-auth-switch-btn"
              onClick={onGoToLogin}
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
