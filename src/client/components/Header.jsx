import React from 'react';
import { NavLink, Link } from 'react-router-dom';

function Header() {
  const navClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;
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

              <button type="button" className="btn btn-pill btn-pill-outline ms-md-3 my-md-auto my-2" id="login">
                Login
              </button>
              <button type="button" className="btn btn-pill btn-pill-primary ms-md-2 my-md-auto my-2" id="sign-up">
                Sign-up
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
