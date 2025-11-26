import React from 'react';
import { Link } from 'react-router-dom';

function HeroCTA() {
  return (
    <section className="page-section hero-cta snap-target">
      <div className="content-max">
        <div className="cta-band glass-panel p-4 p-md-5 text-center text-md-start">
          <div className="row align-items-center g-4">
            <div className="col-md">
              <p className="eyebrow text-uppercase mb-2">ready to act?</p>
              <h2 className="mb-3">Support initiatives that matter to you</h2>
              <p className="mb-0 text-white-50">
                Explore the directory, learn about the Sustainable Development Goals, and start making a difference today.
              </p>
            </div>
            <div className="col-md-auto d-flex flex-column flex-md-row gap-2 justify-content-center">
              <Link to="/directory" className="btn btn-pill btn-pill-primary">
                Browse directory
              </Link>
              <Link to="/contact" className="btn btn-pill btn-pill-outline">
                Partner with us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default HeroCTA;
