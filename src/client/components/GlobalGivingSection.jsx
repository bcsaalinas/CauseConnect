import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';

const formatNumber = (value) => {
  return value.toLocaleString("en-US");
};

function GlobalGivingCard({ project }) {
  const progress = Math.min(project.progress || 0, 100);
  return (
    <article className="directory-card glass-panel">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h3 className="h5 mb-0">{project.title}</h3>
        <span className="badge-soft">{project.theme}</span>
      </div>
      <p className="text-muted small mb-2">{project.location?.country}</p>
      <p className="flex-grow-1 mb-3">{project.summary}</p>
      <div className="mb-3">
        <div className="d-flex justify-content-between small text-muted mb-1">
          <span>${formatNumber(project.raised?.amount || 0)}</span>
          <span>{progress}%</span>
        </div>
        <div className="progress" style={{ height: "6px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%`, backgroundColor: "var(--cc-accent)" }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className="small text-muted mt-1">Goal: ${formatNumber(project.goal?.amount || 0)}</div>
      </div>
      <div className="d-flex justify-content-between align-items-center gap-2 mt-auto">
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-pill btn-sm btn-outline-secondary">
          View project
        </a>
        <span className="text-muted small">{project.numberOfDonations} donors</span>
      </div>
    </article>
  );
}

function GlobalGivingSection({ title, description }) {
  const [projects, setProjects] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });

  useEffect(() => {
    let active = true;
    async function load() {
      setState({ loading: true, error: "" });
      try {
        const response = await fetch("/api/gg/projects/featured");
        if (!response.ok) {
          throw new Error("Unable to load projects");
        }
        const data = await response.json();
        if (!active) return;
        setProjects(data.projects || []);
        setState({ loading: false, error: "" });
      } catch (error) {
        if (!active) return;
        setState({ loading: false, error: error.message || "Unable to load projects" });
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="page-section globalgiving-section" data-animate="section">
      <div className="content-max">
        <SectionHeading eyebrow="global impact" title={title} description={description} />
        <div className="gg-featured-scroll fade-up" data-animate="stagger-cards">
          {state.loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div className="directory-card glass-panel skeleton-loader" key={index}>
                <div className="skeleton-header mb-3"></div>
                <div className="skeleton-text mb-2"></div>
                <div className="skeleton-text mb-3"></div>
                <div className="skeleton-progress mb-3"></div>
                <div className="skeleton-footer"></div>
              </div>
            ))}
          {!state.loading && state.error && (
            <div className="directory-card glass-panel text-center p-4" role="alert">
              <p className="mb-0">{state.error}</p>
            </div>
          )}
          {!state.loading && !state.error &&
            projects.slice(0, 6).map((project) => <GlobalGivingCard key={project.id} project={project} />)}
        </div>
        <div className="text-center mt-4 fade-up">
          <Link to="/directory#globalgiving" className="btn btn-pill btn-pill-outline">
            Explore all projects
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GlobalGivingSection;
