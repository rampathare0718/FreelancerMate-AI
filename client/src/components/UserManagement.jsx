import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserPlus,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
  User as UserIcon,
  Lock,
  Calendar
} from 'lucide-react';

export default function UserManagement({ onUserAdded }) {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await axios.get('/api/users').catch(() => {
        return axios.get('http://localhost:5000/api/users');
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.warn('Could not fetch users:', err.message);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!formData.name || !formData.email || !formData.age || !formData.password) {
      setAlert({
        type: 'error',
        message: 'Please fill in all fields (Name, Email, Age, Password).'
      });
      return;
    }

    if (formData.password.length < 6) {
      setAlert({
        type: 'error',
        message: 'Password must be at least 6 characters long.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        age: Number(formData.age),
        password: formData.password
      };

      const res = await axios.post('/api/users', payload).catch(() => {
        return axios.post('http://localhost:5000/api/users', payload);
      });

      if (res.data.success) {
        setAlert({
          type: 'success',
          message: `User "${res.data.data.name}" created successfully in MongoDB!`
        });
        setFormData({ name: '', email: '', age: '', password: '' });
        fetchUsers();
        if (onUserAdded) onUserAdded();
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Failed to create user.';
      setAlert({
        type: 'error',
        message: errorMsg
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid-container">
      {/* Registration Form */}
      <section className="glass-card">
        <div className="card-header">
          <div className="card-title-group">
            <h2>User Model Setup</h2>
            <p>Register new users (Schema: Name, Email, Age, Password)</p>
          </div>
          <div className="card-icon-badge">
            <UserPlus size={20} />
          </div>
        </div>

        {alert && (
          <div
            className={`alert ${
              alert.type === 'success' ? 'alert-success' : 'alert-error'
            }`}
          >
            {alert.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{alert.message}</span>
          </div>
        )}

        <form onSubmit={handleRegisterUser}>
          <div className="form-group">
            <label className="form-label" htmlFor="user-name">Full Name</label>
            <div className="input-wrapper">
              <UserIcon size={18} className="input-icon" />
              <input
                id="user-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="e.g. Alex Morgan"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="user-email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="user-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="alex@freelancer.dev"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="user-age">Age</label>
              <div className="input-wrapper">
                <Calendar size={18} className="input-icon" />
                <input
                  id="user-age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  className="form-input"
                  placeholder="e.g. 27"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="user-password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="user-password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Saving to MongoDB...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Save User to Database</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* Live MongoDB Users Collection */}
      <section className="glass-card">
        <div className="card-header">
          <div className="card-title-group">
            <h2>MongoDB Users Collection</h2>
            <p>{users.length} registered {users.length === 1 ? 'user' : 'users'} in database</p>
          </div>
          <button
            type="button"
            onClick={fetchUsers}
            className="card-icon-badge"
            title="Refresh list"
            style={{ cursor: 'pointer' }}
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="user-list">
          {isLoadingUsers ? (
            <div className="empty-state">
              <RefreshCw size={24} className="animate-spin" />
              <p>Loading database records...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <Users size={32} />
              <p>No users registered yet.</p>
              <small style={{ color: 'var(--text-dim)' }}>
                Fill the form on the left to add your first user.
              </small>
            </div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="user-item">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-details">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="user-meta">
                  <span className="age-badge">Age: {user.age}</span>
                  <small style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
