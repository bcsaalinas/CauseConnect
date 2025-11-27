import React from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { SDG_GOALS, SDG_SPOTLIGHTS } from '../data';

function SDGPage() {
  useDocumentTitle("SDGs");
  return (
    <>
      <section className="page-section sdg-hero snap-target" data-animate="section">
        <div className="content-max" data-animate="stagger">
          <div className="row align-items-center gy-4" data-stagger-target="[data-animate-child]">
            <div className="col-lg-6 fade-up" data-animate-child>
              <div className="section-heading text-lg-start text-center mb-3">
                <p className="eyebrow text-uppercase mb-2">the 17 goals</p>
                <h1 className="hero-title fs-1 mb-4" data-animate="split-lines">
                  Sustainable Development Goals
                </h1>
                <p className="mb-0">A shared blueprint for peace and prosperity. Explore each goal to see how communities and organizations work together to build a better world.</p>
              </div>
            </div>
            <div className="col-lg-6 fade-up" data-animate-child data-animate="parallax-card" data-parallax="0.2">
              <div className="sdg-hero-visual glass-panel reveal-mask" data-animate="mask">
                <img src="/images/sdgs.png" alt="Sustainable Development Goals" className="hero-visual img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section sdg-featured snap-target" data-animate="section">
        <div className="content-max">
          <div className="story-grid">
            <article className="story-card" data-animate="mask">
              <span className="badge-soft d-inline-block text-uppercase small mb-3">focus goal</span>
              <h3 className="h4 mb-3">Goal 11: Sustainable Cities & Communities</h3>
              <p className="mb-0">Our partners co-create urban initiatives that balance housing, green corridors, and inclusive transport so that every neighborhood thrives.</p>
            </article>
            <div className="story-media reveal-mask" data-animate="mask">
              <img src="/images/Charity.jpg" alt="Volunteers supporting a community initiative" />
            </div>
            <article className="story-card story-stat text-center text-lg-start" data-animate="mask">
              <span className="badge-soft d-inline-flex align-items-center px-3 py-1 text-uppercase small">impact signal</span>
              <div className="display-4" data-animate="counter" data-counter-end="48" data-counter-suffix="+">
                48+
              </div>
              <p className="mb-0">projects mapped through the SDG dashboard help residents prioritize next investments.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="page-section sdg-overview snap-target" data-animate="section">
        <div className="content-max">
          <div className="row g-4" data-animate="stagger-cards" data-stagger-target=".sdg-tile" data-skew-target=".sdg-tile">
            {SDG_GOALS.map((goal) => (
              <div className="col-12 col-md-6 col-lg-4 fade-up" key={goal.number}>
                <article className="sdg-tile glass-panel h-100 p-4 reveal-mask" data-animate="mask">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <span className="sdg-number">{goal.number}</span>
                    <div>
                      <h3 className="h5 mb-1">{goal.title}</h3>
                      <p className="mb-0">{goal.copy}</p>
                    </div>
                  </div>
                  <a 
                    href={`https://sdgs.un.org/goals/goal${goal.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sdg-more btn btn-link p-0 mt-2"
                  >
                    Learn more
                  </a>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section sdg-videos snap-target" data-animate="section">
        <div className="content-max">
          <div className="section-heading fade-up" data-animate="stagger">
            <p className="eyebrow text-uppercase">learn more</p>
            <h2 data-animate="split-lines">The goals in action</h2>
            <p>Watch official explainers and community-driven stories that showcase the SDGs around the globe.</p>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-md-6 fade-up">
              <div className="ratio ratio-16x9 glass-panel overflow-hidden reveal-mask" data-animate="mask">
                <iframe src="https://www.youtube.com/embed/o08ykAqLOxk" title="What are the SDGs?" allowFullScreen></iframe>
              </div>
            </div>
            <div className="col-md-6 fade-up">
              <div className="ratio ratio-16x9 glass-panel overflow-hidden reveal-mask" data-animate="mask">
                <iframe src="https://www.youtube.com/embed/enGJyhu6Xr0" title="The 17 Goals Explained" allowFullScreen></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section sdg-horizontal snap-target" data-animate="section">
        <div className="content-max">
          <div className="section-heading text-center fade-up" data-animate="stagger">
            <p className="eyebrow text-uppercase mb-2">spotlight goals</p>
            <h2>Browse featured SDG showcases</h2>
            <p className="mb-0">Navigate through highlighted projects making waves across Latin America.</p>
          </div>
          <div className="horizontal-showcase" data-animate="horizontal-gallery">
            <div className="showcase-track">
              {SDG_SPOTLIGHTS.map((spotlight) => (
                <article className="showcase-card glass-panel p-4 reveal-mask" data-animate="mask" key={spotlight.title}>
                  <span className="badge-soft d-inline-block text-uppercase small mb-2">{spotlight.badge}</span>
                  <h3 className="h5 mb-2">{spotlight.title}</h3>
                  <p className="small text-muted mb-3">{spotlight.copy}</p>
                  <Link to={`/directory?q=${encodeURIComponent(spotlight.query)}`} className="btn btn-pill btn-pill-outline btn-sm">
                    Explore
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SDGPage;
