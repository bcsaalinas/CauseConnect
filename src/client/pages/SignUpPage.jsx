import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('volunteer'); // 'volunteer' or 'organization'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email validation regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignUp = async () => {
    setMessage('');
    if (!name.trim()) {
      setMessage('Please enter your name.');
      return;
    }
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/signup', { name, email, password, role });
      if (response.status === 201 && response.data.user) {
        // Auto-login after signup
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token); // Store JWT
        navigate('/dashboard');
      } else {
        setMessage(response.data.message || 'Sign-up failed');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card p-5" style={{ width: '100%', maxWidth: '450px' }}>
        <h1 className="text-center mb-4 text-gradient">Create Account</h1>
        
        {/* Role Toggle */}
        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group w-100" role="group" aria-label="Role selection">
            <button 
              type="button" 
              className="btn"
              onClick={() => setRole('volunteer')}
              style={{ 
                borderRadius: '999px 0 0 999px',
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                background: role === 'volunteer' ? 'var(--cc-primary)' : 'transparent',
                color: role === 'volunteer' ? '#fff' : 'var(--cc-text)',
                border: `2px solid ${role === 'volunteer' ? 'var(--cc-primary)' : 'rgba(255,255,255,0.2)'}`,
                transition: 'all 0.3s ease'
              }}
            >
              Volunteer
            </button>
            <button 
              type="button" 
              className="btn"
              onClick={() => setRole('organization')}
              style={{ 
                borderRadius: '0 999px 999px 0',
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                background: role === 'organization' ? 'var(--cc-primary)' : 'transparent',
                color: role === 'organization' ? '#fff' : 'var(--cc-text)',
                border: `2px solid ${role === 'organization' ? 'var(--cc-primary)' : 'rgba(255,255,255,0.2)'}`,
                borderLeft: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              Organization
            </button>
          </div>
        </div>

        <form className="mt-2" onSubmit={e => e.preventDefault()}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-uppercase small fw-bold">
              {role === 'organization' ? 'Organization Name' : 'Full Name'}
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cc-text)' }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-uppercase small fw-bold">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cc-text)' }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label text-uppercase small fw-bold">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cc-text)' }}
            />
          </div>
          <button
            type="button"
            id="sign-up"
            className="btn btn-primary-glow w-100"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        {message && <p className="mt-3 text-center text-danger">{message}</p>}
        
        <div className="text-center mt-4">
          <p className="small text-muted">
            Already have an account? <a href="/login" className="text-accent text-decoration-none fw-bold">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;