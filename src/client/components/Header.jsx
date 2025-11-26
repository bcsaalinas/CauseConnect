import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';

function Header() {
  const navClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;
  const location = useLocation();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    // Check for user info in URL (profile page)
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    if (name) {
      setUserName(name);
    }
  }, [location]);

  return (
    <header>
      <div className="cc-header-shell">
        <div className="blur-blob hero-blob d-none d-md-block" aria-hidden="true"></div>
        <nav className="navbar navbar-expand-md navbar-dark cc-header cc-header-minimal sticky-top cc-header-glass">
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

              <form role="search" className="d-flex ms-md-4 ms-0 cc-search align-items-center gap-2">
                <span className="visually-hidden" id="site-search-label">
                  Search directory
                </span>
                <input className="flex-grow-1" type="search" placeholder="Search" aria-labelledby="site-search-label" />
              </form>

              <div className="d-flex ms-auto">
                {userName ? (
                  <span className="navbar-text fw-bold px-3" style={{ color: '#fff', borderRadius: '999px', background: 'var(--cc-accent-dark)' }}>
                    {userName}
                  </span>
                ) : (
                  <>
                    <NavLink to="/login" className="btn btn-outline-light me-2">Log In</NavLink>
                    <NavLink to="/signup" className="btn btn-primary">Sign Up</NavLink>
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
