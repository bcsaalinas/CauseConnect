import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    console.log('Login button clicked');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      setMessage(response.data.message);
      if (response.status === 200) {
        console.log('Login successful, redirecting...');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      console.error('Login failed:', errorMsg);
      setMessage(errorMsg);
    }
  };

  return (
    <div className="container mt-3" style={{ maxWidth: '400px' }}>
      <h1 className="text-center mb-3">Log In</h1>
      <form className="mt-2">
        <div className="mb-2">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control form-control-sm"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
        </div>
        <button type="button" id="login" className="btn w-100" style={{ borderRadius: '999px', padding: '0.5rem 1rem', fontWeight: 600, boxShadow: '0 6px 16px rgba(6, 113, 79, 0.18)' }} onClick={handleLogin}>Log In</button>
      </form>
      {message && <p className="mt-2 text-center text-danger">{message}</p>}
    </div>
  );
}

export default LoginPage;