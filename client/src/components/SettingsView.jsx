import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  Coins,
  ShieldCheck,
  Sparkles,
  Bot,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  LogOut,
  RefreshCw,
  Building
} from 'lucide-react';

export default function SettingsView({
  currentUser,
  onUpdateUser,
  onLogout
}) {
  // Form State
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    title: currentUser?.title || 'Full-Stack Web Developer',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || 'Building modern, fast, and scalable web solutions for growing businesses.',
    location: currentUser?.location || 'India',
    currency: currentUser?.currency || 'INR',
    hourlyRate: currentUser?.hourlyRate || '₹1,500',
    warrantyDays: currentUser?.warrantyDays || 30,
    proposalSignoff: currentUser?.proposalSignoff || (currentUser?.name ? `${currentUser.name} • Freelance Solutions Architect` : 'Freelance Solutions Architect'),
    proposalTone: currentUser?.proposalTone || 'fresher-friendly'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync if currentUser updates
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        title: currentUser.title || prev.title,
        phone: currentUser.phone || prev.phone,
        bio: currentUser.bio || prev.bio,
        location: currentUser.location || prev.location,
        currency: currentUser.currency || prev.currency,
        hourlyRate: currentUser.hourlyRate || prev.hourlyRate,
        warrantyDays: currentUser.warrantyDays || prev.warrantyDays,
        proposalSignoff: currentUser.proposalSignoff || prev.proposalSignoff,
        proposalTone: currentUser.proposalTone || prev.proposalTone
      }));
    }
  }, [currentUser]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const updatedPayload = {
      ...currentUser,
      ...formData
    };

    try {
      if (currentUser?._id && !currentUser._id.startsWith('guest')) {
        await axios
          .put(`/api/users/${currentUser._id}`, formData)
          .catch(() => axios.put(`http://localhost:5000/api/users/${currentUser._id}`, formData));
      }

      // Update parent and localStorage
      if (onUpdateUser) {
        onUpdateUser(updatedPayload);
      } else {
        localStorage.setItem('freelancermate_user', JSON.stringify(updatedPayload));
      }

      setSuccessMessage('Profile & settings saved successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.warn('Backend update failed, saved to local session:', err);
      // Still update local session
      if (onUpdateUser) {
        onUpdateUser(updatedPayload);
      }
      setSuccessMessage('Settings saved to your current session!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const initials = formData.name
    ? formData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'FM';

  return (
    <div className="fm-settings-view-container">
      {/* Top Header */}
      <div className="fm-dash-header">
        <div>
          <h1 className="fm-dash-title">Settings & Profile</h1>
          <p className="fm-dash-subtitle">
            Manage your personal profile, freelance identity, and proposal defaults
          </p>
        </div>

        <button
          type="button"
          className="fm-btn-secondary"
          onClick={onLogout}
          title="Sign out of your account"
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>

      {/* Success / Error Alerts */}
      {successMessage && (
        <div className="fm-settings-alert success">
          <CheckCircle2 size={18} color="#15803d" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fm-settings-alert error">
          <AlertCircle size={18} color="#b91c1c" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="fm-settings-form">
        {/* ============================================================
            CARD 1: FREELANCER IDENTITY & PROFILE EDITING
           ============================================================ */}
        <div className="fm-settings-card-box">
          <div className="fm-scard-header">
            <div className="fm-scard-icon">
              <User size={20} color="#4338ca" />
            </div>
            <div>
              <h2 className="fm-scard-title">Freelancer Profile & Identity</h2>
              <p className="fm-scard-subtitle">
                This information appears on your dashboard, client proposals, and system communications.
              </p>
            </div>
          </div>

          {/* Profile Overview Header Pill */}
          <div className="fm-profile-badge-row">
            <div className="fm-profile-avatar-large">
              <span>{initials}</span>
            </div>
            <div className="fm-profile-meta-info">
              <h3 className="fm-pmeta-name">{formData.name || 'Your Name'}</h3>
              <span className="fm-pmeta-title">{formData.title || 'Freelancer'}</span>
              <span className="fm-pmeta-email">{formData.email || 'Email address'}</span>
            </div>
          </div>

          <div className="fm-settings-fields-grid">
            {/* Field 1: Full Name */}
            <div className="fm-form-field">
              <label className="fm-form-label" htmlFor="settings-name">
                Full Name *
              </label>
              <div className="fm-input-icon-wrap">
                <User size={16} className="fm-field-icon" />
                <input
                  id="settings-name"
                  type="text"
                  className="fm-form-input with-icon"
                  placeholder="e.g. Ram Pathare"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Field 2: Email Address */}
            <div className="fm-form-field">
              <label className="fm-form-label" htmlFor="settings-email">
                Email Address *
              </label>
              <div className="fm-input-icon-wrap">
                <Mail size={16} className="fm-field-icon" />
                <input
                  id="settings-email"
                  type="email"
                  className="fm-form-input with-icon"
                  placeholder="e.g. ram@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Field 3: Professional Title / Role */}
            <div className="fm-form-field">
              <label className="fm-form-label" htmlFor="settings-title">
                Professional Title / Specialty
              </label>
              <div className="fm-input-icon-wrap">
                <Briefcase size={16} className="fm-field-icon" />
                <input
                  id="settings-title"
                  type="text"
                  className="fm-form-input with-icon"
                  placeholder="e.g. Full-Stack Web Developer & MERN Architect"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
            </div>

            {/* Field 4: Phone / WhatsApp Number */}
            <div className="fm-form-field">
              <label className="fm-form-label" htmlFor="settings-phone">
                Phone / WhatsApp (for Client Inquiries)
              </label>
              <div className="fm-input-icon-wrap">
                <Phone size={16} className="fm-field-icon" />
                <input
                  id="settings-phone"
                  type="text"
                  className="fm-form-input with-icon"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </div>

            {/* Field 5: Location / City */}
            <div className="fm-form-field">
              <label className="fm-form-label" htmlFor="settings-location">
                City / Location
              </label>
              <div className="fm-input-icon-wrap">
                <MapPin size={16} className="fm-field-icon" />
                <input
                  id="settings-location"
                  type="text"
                  className="fm-form-input with-icon"
                  placeholder="e.g. Mumbai, India"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>
            </div>

            {/* Field 6: Bio / Client Pitch */}
            <div className="fm-form-field full-width">
              <label className="fm-form-label" htmlFor="settings-bio">
                Professional Bio & Value Proposition
              </label>
              <textarea
                id="settings-bio"
                rows={3}
                className="fm-form-input"
                placeholder="Briefly describe your experience and what problems you solve for clients..."
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
              />
              <span className="fm-form-tip">
                Tip: This helps the AI customize client proposals to highlight your specific strengths.
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================
            CARD 2: PROPOSAL & COMMERCIAL DEFAULTS
           ============================================================ */}
        <div className="fm-settings-card-box">
          <div className="fm-scard-header">
            <div className="fm-scard-icon">
              <Coins size={20} color="#4338ca" />
            </div>
            <div>
              <h2 className="fm-scard-title">Commercial & Proposal Defaults</h2>
              <p className="fm-scard-subtitle">
                Configure your default currency, milestone payment structure, and post-launch guarantees.
              </p>
            </div>
          </div>

          <div className="fm-settings-fields-grid">
            {/* Currency Preference */}
            <div className="fm-form-field">
              <label className="fm-form-label" htmlFor="settings-currency">
                Default Currency
              </label>
              <select
                id="settings-currency"
                className="fm-form-select"
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="USD">USD ($ United States Dollar)</option>
                <option value="EUR">EUR (€ Euro)</option>
                <option value="GBP">GBP (£ British Pound)</option>
              </select>
            </div>

            {/* Standard Hourly Rate */}
            <div className="fm-form-field">
              <label className="fm-form-label" htmlFor="settings-hourly">
                Standard Hourly Rate (Reference)
              </label>
              <input
                id="settings-hourly"
                type="text"
                className="fm-form-input"
                placeholder="e.g. ₹1,500 / hr"
                value={formData.hourlyRate}
                onChange={(e) => handleChange('hourlyRate', e.target.value)}
              />
            </div>

            {/* Default Free Warranty Support */}
            <div className="fm-form-field">
              <label className="fm-form-label" htmlFor="settings-warranty">
                Post-Launch Free Bug Support
              </label>
              <select
                id="settings-warranty"
                className="fm-form-select"
                value={formData.warrantyDays}
                onChange={(e) => handleChange('warrantyDays', Number(e.target.value))}
              >
                <option value={14}>14 Days Free Bug Fixing</option>
                <option value={30}>30 Days Free Bug Fixing (Standard)</option>
                <option value={60}>60 Days Free Bug Fixing (Premium)</option>
                <option value={90}>90 Days Free Bug Fixing (Enterprise)</option>
              </select>
            </div>

            {/* Proposal Sign-off Signature */}
            <div className="fm-form-field">
              <label className="fm-form-label" htmlFor="settings-signoff">
                Proposal Sign-off Signature
              </label>
              <input
                id="settings-signoff"
                type="text"
                className="fm-form-input"
                placeholder="e.g. Ram Pathare • Freelance Solutions Architect"
                value={formData.proposalSignoff}
                onChange={(e) => handleChange('proposalSignoff', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ============================================================
            CARD 3: AI COPILOT & PROPOSAL TONE PREFERENCES
           ============================================================ */}
        <div className="fm-settings-card-box">
          <div className="fm-scard-header">
            <div className="fm-scard-icon">
              <Sparkles size={20} color="#4338ca" />
            </div>
            <div>
              <h2 className="fm-scard-title">AI Engine & Scoping Preferences</h2>
              <p className="fm-scard-subtitle">
                Tailor how FreelanceMate AI architects your projects and writes proposals.
              </p>
            </div>
          </div>

          <div className="fm-settings-fields-grid">
            <div className="fm-form-field">
              <label className="fm-form-label" htmlFor="settings-engine">
                Active AI Engine
              </label>
              <input
                id="settings-engine"
                type="text"
                className="fm-form-input"
                value="Ollama Local Gemma 4B (Private & Zero Cost)"
                readOnly
              />
              <span className="fm-form-tip">
                Runs 100% locally on your machine with offline fallback capabilities.
              </span>
            </div>

            <div className="fm-form-field">
              <label className="fm-form-label" htmlFor="settings-tone">
                Proposal Writing Tone
              </label>
              <select
                id="settings-tone"
                className="fm-form-select"
                value={formData.proposalTone}
                onChange={(e) => handleChange('proposalTone', e.target.value)}
              >
                <option value="fresher-friendly">
                  Fresher & Non-Technical Client Friendly (Plain English, High Conversion)
                </option>
                <option value="formal-technical">
                  Formal & Enterprise Technical (Specifications & Strict Milestones)
                </option>
              </select>
              <span className="fm-form-tip">
                Fresher-friendly translates technical jargon into clear business benefits for the client.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="fm-settings-actions-bar">
          <button
            type="submit"
            className="fm-btn-primary fm-btn-save-settings"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw size={17} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={17} />
                <span>Save Profile & Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
