import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const response = await axios.post('http://localhost:3000/api/auth/signup', { name, email, password });
      if (response.status === 201 && response.data.user) {
        // Redirect to profile page with user info
        navigate(`/profile?email=${encodeURIComponent(response.data.user.email)}&name=${encodeURIComponent(response.data.user.name)}`);
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
    <div className="container mt-3" style={{ maxWidth: '400px' }}>
      <h1 className="text-center mb-3">Sign Up</h1>
      <form className="mt-2" onSubmit={e => e.preventDefault()}>
        <div className="mb-2">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control form-control-sm"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control form-control-sm"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control form-control-sm"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <button
          type="button"
          id="sign-up"
          className="btn w-100"
          style={{ borderRadius: '999px', padding: '0.5rem 1rem', fontWeight: 700, boxShadow: '0 6px 16px rgba(6, 113, 79, 0.18)' }}
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>
      {message && <p className="mt-2 text-center text-danger">{message}</p>}
    </div>
  );
}

export default SignUpPage;