import React from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import HeroHighlightGrid from '../components/HeroHighlightGrid';
import ChapterSection from '../components/ChapterSection';
import HeroStats from '../components/HeroStats';
import GlobalGivingSection from '../components/GlobalGivingSection';
import CreatorsSection from '../components/CreatorsSection';
import HeroCTA from '../components/HeroCTA';

function HomePage() {
  useDocumentTitle("Home");
  return (
    <>
      <section className="hero hero-premium position-relative overflow-hidden" data-animate="hero" id="hero-intro">
        <div className="hero-ambient" aria-hidden="true">
          <span className="hero-ambient__layer hero-ambient__layer--one" data-parallax="0.12"></span>
          <span className="hero-ambient__layer hero-ambient__layer--two" data-parallax="0.18"></span>
          <span className="hero-ambient__layer hero-ambient__layer--three" data-parallax="0.24"></span>
        </div>
        <div className="container-xl hero-shell py-5 py-md-6">
          <div className="row align-items-center g-5 g-xl-4 justify-content-between">
            <div className="col-12 col-md-6 col-xl-5 text-center text-md-start hero-copy fade-up" data-animate="hero-copy">
              <div className="hero-copy-inner">
                <p className="eyebrow text-uppercase mb-3">Cause Connect</p>
                <h1 className="hero-title mb-3" data-animate="split-lines">
                  Connecting causes with people
                </h1>
                <p className="hero-subtitle mb-4" data-animate="fade">
                  Discover NGOs, projects, and opportunities aligned with the Sustainable Development Goals.
                </p>
                <div className="d-inline-flex flex-wrap gap-2 justify-content-center justify-content-lg-start" data-animate="stagger" data-stagger-target=".btn">
                  <Link to="/directory" className="btn btn-pill btn-pill-primary" data-animate="magnet">
                    Explore directory
                  </Link>
                  <Link to="/sdgs" className="btn btn-pill btn-pill-outline" data-animate="magnet">
                    Learn about the SDGs
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-6 position-relative hero-visual-wrap fade-up" data-animate="hero-visual">
              <div className="hero-media-inner">
                <div className="hero-glass-panel glass-panel mx-auto">
                  <img src="/images/logo.png" alt="Cause Connect logo" className="hero-visual hero-logo img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section hero-highlights snap-target" data-animate="section">
        <div className="content-max">
          <div className="section-heading fade-up" data-animate="stagger">
            <p className="eyebrow text-uppercase">why cause connect</p>
            <h2>Bringing communities and changemakers together</h2>
            <p>We help people discover meaningful initiatives, while empowering NGOs with visibility and support.</p>
          </div>
          <HeroHighlightGrid />
        </div>
      </section>

      <ChapterSection />
      <HeroStats />
      <GlobalGivingSection
        title="Featured Projects from GlobalGiving"
        description="Discover verified projects from around the world making real impact in their communities."
      />

      <CreatorsSection />

      <HeroCTA />
    </>
  );
}

export default HomePage;
