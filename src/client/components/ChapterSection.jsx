import React from 'react';
import { CHAPTER_STEPS } from '../data';

function ChapterSection() {
  return (
    <section className="page-section chapters-section">
      <div className="container-xl">
        <div className="section-heading text-center">
          <p className="eyebrow text-uppercase mb-2">inside the platform</p>
          <h2>Every cause has a story worth amplifying</h2>
          <p>Follow a changemaker's journey from discovery to measurable impact across the Cause Connect ecosystem.</p>
        </div>
        <div className="chapters-container">
          {CHAPTER_STEPS.map((step) => (
            <div className="chapter-row" key={step.id}>
              <div className="row align-items-stretch g-4 g-lg-5">
                <div className="col-12 col-lg-6">
                  <div className="chapter-image-wrapper">
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="chapter-img"
                      loading="eager"
                    />

                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <div className="chapter-card glass-panel">
                    <span className="badge-soft mb-3">{step.badge}</span>
                    <h3 className="chapter-title mb-3">{step.title}</h3>
                    <p className="chapter-copy mb-0">{step.copy}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default ChapterSection;
