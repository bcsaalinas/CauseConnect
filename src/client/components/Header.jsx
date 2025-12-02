import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const navClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check localStorage for user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header>
      <div className="cc-header-shell">
        <div className="blur-blob hero-blob d-none d-md-block" aria-hidden="true"></div>
        <nav className="navbar navbar-expand-md navbar-light cc-header cc-header-minimal sticky-top cc-header-glass">
          <div className="container-xl">
            <NavLink to="/" className="navbar-brand d-inline-block">
              <img src="/images/logo.png" alt="Cause Connect" className="cc-brand-logo" />
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse flex-md-row flex-column align-items-md-center align-items-stretch gap-2 gap-md-3" id="navbarSupportedContent">
              <ul className="navbar-nav ms-md-auto align-items-md-center align-items-start gap-md-2">
                <li className="nav-item">
                  <NavLink to="/" end className={navClass}>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/directory" className={navClass}>
                    Directory
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/sdgs" className={navClass}>
                    SDGs
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contact" className={navClass}>
                    Contact
                  </NavLink>
                </li>
              </ul>



              <div className="d-flex ms-auto align-items-center">
                {user ? (
                  <div className="position-relative" ref={dropdownRef}>
                    <button 
                      className="btn btn-link text-decoration-none d-flex align-items-center gap-2" 
                      type="button" 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      style={{ color: 'var(--cc-text)', cursor: 'pointer' }}
                    >
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: '32px', height: '32px', background: 'var(--gradient-accent)', color: '#fff', fontSize: '14px' }}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="d-none d-lg-inline fw-medium">{user.name}</span>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor" style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    {dropdownOpen && (
                      <div 
                        className="glass-card border-0 shadow-lg position-absolute end-0 mt-2"
                        style={{ 
                          minWidth: '200px',
                          zIndex: 1000,
                          animation: 'fadeIn 0.2s ease'
                        }}
                      >
                        <NavLink 
                          className="dropdown-item px-4 py-2 d-block text-decoration-none" 
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          style={{ color: 'var(--cc-text)' }}
                        >
                          Dashboard
                        </NavLink>
                        <NavLink 
                          className="dropdown-item px-4 py-2 d-block text-decoration-none" 
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          style={{ color: 'var(--cc-text)' }}
                        >
                          Profile Settings
                        </NavLink>
                        <hr className="my-1" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                        <button 
                          className="dropdown-item px-4 py-2 text-danger w-100 text-start bg-transparent border-0" 
                          onClick={handleLogout}
                          style={{ cursor: 'pointer' }}
                        >
                          Log Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <NavLink to="/login" className="btn btn-outline-light me-2" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'var(--cc-text)' }}>Log In</NavLink>
                    <NavLink to="/signup" className="btn btn-primary-glow">Sign Up</NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
