import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission refresh
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.status === 200 && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token); // Store JWT
        navigate('/dashboard');
      } else {
        setMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card p-5" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <h1 className="mb-2 text-gradient">Welcome Back</h1>
          <p className="text-muted">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600 }}>Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cc-text)' }}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="form-label text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600 }}>Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cc-text)' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary-glow w-100 mb-3"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Log In'}
          </button>
        </form>

        {message && (
          <div className="alert alert-danger mt-3 text-center" style={{ background: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.2)', color: '#ff6b6b' }}>
            {message}
          </div>
        )}
        
        <div className="text-center mt-4">
          <p className="small text-muted">
            Don't have an account? <a href="/signup" className="text-accent text-decoration-none fw-bold">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;