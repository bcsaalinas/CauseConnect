import React from 'react';
import { useLocation } from 'react-router-dom';

function ProfilePage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get('email');
  const name = params.get('name');

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h1 className="text-center mb-3">Profile Created</h1>
      <div className="card p-4 shadow-sm" style={{ borderRadius: '1rem' }}>
        <p className="mb-2"><strong>Name:</strong> {name}</p>
        <p className="mb-2"><strong>Email:</strong> {email}</p>
        <p className="mb-2"><strong>Password:</strong> <span style={{ color: '#888' }}>[Hidden]</span></p>
        <p className="mb-0 mt-3">Your account has been successfully created. Welcome to Cause Connect!</p>
      </div>
    </div>
  );
}

export default ProfilePage;
