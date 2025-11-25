import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer mt-0">
      <div className="footer-shell surface-soft py-5">
        <div className="content-max">
          <div className="row gy-4 text-center text-md-start fade-up" data-animate="stagger">
            <div className="col-6 col-md-3">
              <div className="footer-title">Explore</div>
              <ul className="list-unstyled mb-0">
                <li>
                  <Link to="/directory">Directory</Link>
                </li>
                <li>
                  <Link to="/sdgs">SDGs</Link>
                </li>
                <li>
                  <a href="#">Opportunities</a>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md-3">
              <div className="footer-title">Company</div>
              <ul className="list-unstyled mb-0">
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Press</a>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md-3">
              <div className="footer-title">Support</div>
              <ul className="list-unstyled mb-0">
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Guides</a>
                </li>
                <li>
                  <a href="#">Status</a>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md-3">
              <div className="footer-title">Legal</div>
              <ul className="list-unstyled mb-0">
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Use</a>
                </li>
                <li>
                  <a href="#">Cookies</a>
                </li>
              </ul>
            </div>
          </div>
          <hr className="divider my-4" />
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 legal">
            <p className="mb-0">Copyright © {year} Cause Connect. All rights reserved.</p>
            <div className="d-flex gap-3">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
