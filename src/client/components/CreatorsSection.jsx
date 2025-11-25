import React from 'react';
import { CREATOR_TEAM } from '../data';

function CreatorsSection() {
  return (
    <section className="page-section creators-section" data-animate="section">
      <div className="content-max">
        <div className="section-heading text-center fade-up" data-animate="stagger">
          <p className="eyebrow text-uppercase">voices from the creators</p>
          <h2>Voices from the Creators</h2>
          <p>Built by students who believe technology can connect purpose with people.</p>
        </div>
        <div className="creators-intro text-center mb-5 fade-up" data-animate="float-card">
          <p className="lead mx-auto" style={{ maxWidth: "800px" }}>
            Cause Connect was born from a shared belief that impact shouldn't be hidden — it should be accessible. We wanted to make a bridge between people who care and the causes that need them most.
          </p>
        </div>
        <div className="row g-4 justify-content-center mb-4" data-animate="stagger-cards" data-stagger-target=".creator-card">
          {CREATOR_TEAM.map((creator) => (
            <div className="col-12 col-md-6 col-lg-4" key={creator.name}>
              <div className="creator-card glass-panel p-4 fade-up">
                <h3 className="h5 mb-2">{creator.name}</h3>
                <p className="text-muted small mb-3">{creator.role}</p>
                <p className="mb-0">{creator.copy}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center text-muted small fade-up" data-animate="float-card">
          <p className="mb-0">Made with purpose in Guadalajara, for everyone who believes change can start online.</p>
        </div>
      </div>
    </section>
  );
}

export default CreatorsSection;
