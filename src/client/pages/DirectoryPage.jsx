import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useDebouncedValue from '../hooks/useDebouncedValue';
import SectionHeading from '../components/SectionHeading';

const formatNumber = (value) => {
  return value.toLocaleString("en-US");
};

function GlobalGivingCard({ project, initialBookmarked }) {
  const progress = Math.min(project.progress || 0, 100);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleBookmark = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to bookmark projects.');
      return;
    }

    try {
      await axios.post('/api/user/bookmarks', {
        projectId: project.id,
        title: project.title,
        imageUrl: project.imageUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsBookmarked(true);
      alert('Project bookmarked!');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Already bookmarked!');
      } else {
        console.error('Error bookmarking:', error);
        alert('Failed to bookmark.');
      }
    }
  };

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
        <button 
          className={`btn btn-pill btn-sm ${isBookmarked ? 'btn-primary-glow' : 'btn-outline-primary'}`}
          onClick={handleBookmark}
        >
          {isBookmarked ? 'Saved' : 'Bookmark'}
        </button>
      </div>
    </article>
  );
}

function GlobalGivingExplorer({ myBookmarks = [] }) {
  const [filters, setFilters] = useState({ q: "", country: "Mexico", theme: "" });
  const debouncedQuery = useDebouncedValue(filters.q, 350);
  const [state, setState] = useState({ loading: true, error: "", projects: [], total: 0 });

  const updateFilters = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    let active = true;
    async function load() {
      setState((prev) => ({ ...prev, loading: true, error: "" }));
      const params = new URLSearchParams();
      if (debouncedQuery) params.append("q", debouncedQuery);
      if (filters.country) params.append("country", filters.country);
      if (filters.theme) params.append("theme", filters.theme);
      params.append("limit", "50");

      try {
        const response = await fetch(`/api/gg/projects/directory?${params.toString()}`);
        if (!response.ok) throw new Error("Unable to load projects");
        const data = await response.json();
        if (!active) return;
        setState({ loading: false, error: "", projects: data.projects || [], total: data.total || 0 });
      } catch (error) {
        if (!active) return;
        setState({ loading: false, error: error.message || "Unable to load projects.", projects: [], total: 0 });
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [debouncedQuery, filters.country, filters.theme]);

  const resetFilters = () => setFilters({ q: "", country: "", theme: "" });

  return (
    <section className="page-section globalgiving-directory-section snap-target" data-animate="section" id="globalgiving">
      <div className="content-max">
        <SectionHeading
          eyebrow="global projects"
          title="Verified Projects from GlobalGiving"
          description="Discover real-time projects making impact around the world. All projects are verified by GlobalGiving."
        />
        <div className="gg-directory-controls glass-panel mb-4 p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label visually-hidden" htmlFor="gg-search">
                Search projects
              </label>
              <input
                id="gg-search"
                type="text"
                className="form-control"
                placeholder="Search projects"
                value={filters.q}
                onChange={(e) => updateFilters({ q: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filters.country}
                onChange={(e) => updateFilters({ country: e.target.value })}
              >
                <option value="">All countries</option>
                <option value="Mexico">Mexico</option>
                <option value="United States">United States</option>
                <option value="Colombia">Colombia</option>
                <option value="Brazil">Brazil</option>
                <option value="India">India</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.theme}
                onChange={(e) => updateFilters({ theme: e.target.value })}
              >
                <option value="">All themes</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
                <option value="Children">Children</option>
                <option value="Health">Health</option>
                <option value="Women">Women</option>
              </select>
            </div>
            <div className="col-md-1 text-md-end">
              <button type="button" className="btn btn-link p-0" onClick={resetFilters}>
                Reset
              </button>
            </div>
          </div>
          <div className="text-muted small mt-3">
            Showing {state.total} {state.total === 1 ? "project" : "projects"}
          </div>
        </div>

        <div className="gg-projects-grid fade-up mt-4" data-animate="stagger-cards">
          {state.loading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div className="directory-card glass-panel skeleton-loader" key={index}>
                <div className="skeleton-header mb-3"></div>
                <div className="skeleton-text mb-2"></div>
                <div className="skeleton-text mb-3"></div>
                <div className="skeleton-progress mb-3"></div>
                <div className="skeleton-footer"></div>
              </div>
            ))}
          {!state.loading && state.error && (
            <div className="directory-empty glass-panel text-center p-5" style={{ gridColumn: "1 / -1" }}>
              <p className="mb-0">{state.error}</p>
            </div>
          )}
          {!state.loading && !state.error && state.projects.length === 0 && (
            <div className="directory-empty glass-panel text-center p-5" style={{ gridColumn: "1 / -1" }}>
              <h3 className="h4 mb-3">No projects found</h3>
              <p className="mb-4">Try adjusting your filters or search term to discover more projects.</p>
              <button className="btn btn-pill btn-pill-outline" onClick={resetFilters}>
                Reset filters
              </button>
            </div>
          )}
          {!state.loading && !state.error &&
            state.projects.map((project) => (
              <GlobalGivingCard 
                key={project.id} 
                project={project} 
                initialBookmarked={myBookmarks.some(b => b.projectId === project.id.toString())}
              />
            ))}
        </div>
      </div>
    </section>
  );
}

function CauseConnectCard({ activity, initialSignedUp }) {
  const [signedUp, setSignedUp] = useState(initialSignedUp);

  useEffect(() => {
    setSignedUp(initialSignedUp);
  }, [initialSignedUp]);

  const handleSignUp = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to sign up.');
      return;
    }
    try {
      await axios.post(`/api/activities/${activity._id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSignedUp(true);
      alert('Successfully signed up!');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error('Error signing up:', error);
        alert('Failed to sign up.');
      }
    }
  };

  return (
    <article className="directory-card glass-panel">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h3 className="h5 mb-0">{activity.title}</h3>
        <span className="badge-soft">CauseConnect</span>
      </div>
      <p className="text-muted small mb-2">
        📍 {activity.location} • 📅 {new Date(activity.date).toLocaleDateString()}
      </p>
      <p className="flex-grow-1 mb-3">{activity.description}</p>
      <div className="mb-3">
        <div className="small text-muted">Duration: {activity.duration} Hours</div>
        <div className="small text-muted mt-1">Organizer: {activity.organizer?.name || 'Unknown'}</div>
      </div>
      <div className="d-flex justify-content-between align-items-center gap-2 mt-auto">
        <button 
          className={`btn btn-pill btn-sm ${signedUp ? 'btn-success' : 'btn-primary-glow'}`}
          onClick={handleSignUp}
          disabled={signedUp}
        >
          {signedUp ? 'Signed Up' : 'Sign Up'}
        </button>
        {activity.externalLink && (
          <a 
            href={activity.externalLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-pill btn-sm btn-outline-info"
          >
            Learn More
          </a>
        )}
      </div>
    </article>
  );

}

function MexicanNgoCard({ org, initialBookmarked }) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  // juan: handling bookmarks for local ngos here
  // had to use a placeholder img cause the api doesnt give us one yet
  const handleBookmark = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to bookmark organizations.');
      return;
    }

    try {
      // Use a placeholder image since Mexican NGOs don't have one in the API
      // TODO: (alberto) maybe we can scrape logos later?
      const placeholderImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

      await axios.post('/api/user/bookmarks', {
        projectId: org.id,
        title: org.name,
        imageUrl: placeholderImage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsBookmarked(true);
      alert('Organization bookmarked!');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Already bookmarked!');
      } else {
        console.error('Error bookmarking:', error);
        alert('Failed to bookmark.');
      }
    }
  };

  return (
    <article className="directory-card glass-panel">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h3 className="h5 mb-0">{org.name}</h3>
        <div className="d-flex gap-2 align-items-center">
          <span className="badge-soft">{org.cause}</span>
          {org.verified && (
            <span className="badge-soft" title="Verified Organization">
              ✓
            </span>
          )}
        </div>
      </div>
      <div className="mb-2">
        <p className="text-muted small mb-1">
          📍 {org.location?.city}, {org.location?.state}
        </p>
        {org.yearFounded && (
          <p className="text-muted small mb-0">Founded: {org.yearFounded}</p>
        )}
      </div>
      <p className="flex-grow-1 mb-3">
        {org.mission.length > 200 ? `${org.mission.substring(0, 200)}...` : org.mission}
      </p>
      <div className="d-flex flex-column gap-2">
        <div className="d-flex justify-content-between align-items-center gap-2">
          {org.website ? (
            <a href={org.website} target="_blank" rel="noopener noreferrer" className="btn btn-pill btn-sm btn-outline-secondary">
              Visit Website
            </a>
          ) : (
            <span className="text-muted small">No website</span>
          )}
          <button 
            className={`btn btn-pill btn-sm ${isBookmarked ? 'btn-primary-glow' : 'btn-outline-primary'}`}
            onClick={handleBookmark}
          >
            {isBookmarked ? 'Saved' : 'Bookmark'}
          </button>
        </div>
        {(org.email || org.phone) && (
          <div className="text-muted small d-flex flex-wrap gap-3">
            {org.email && <span>✉️ {org.email}</span>}
            {org.phone && <span>📞 {org.phone}</span>}
          </div>
        )}
      </div>
    </article>
  );
}

function DirectoryPage() {
  useDocumentTitle("Directory");
  const location = useLocation();
  const initialFilters = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      q: params.get("q") || "",
      cause: params.get("cause") || "",
      location: params.get("location") || "",
    };
  }, [location.search]);

  const [formState, setFormState] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  const [state, setState] = useState({ loading: true, error: "", ngos: [], total: 0, options: { causes: [], cities: [] } });
  
  const [ccActivities, setCcActivities] = useState([]);
  const [myParticipations, setMyParticipations] = useState([]);
  const [myBookmarks, setMyBookmarks] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get('/api/activities');
        setCcActivities(res.data);
      } catch (err) {
        console.error('Error fetching activities:', err);
      }
    };

    const fetchMyParticipations = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('/api/activities/my-activities', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Store just the activity IDs for easy checking
        setMyParticipations(res.data.map(p => p._id));
      } catch (err) {
        console.error('Error fetching participations:', err);
      }
    };

    const fetchMyBookmarks = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('/api/user/bookmarks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyBookmarks(res.data);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
      }
    };

    fetchActivities();
    fetchMyParticipations();
    fetchMyBookmarks();
  }, []);

  useEffect(() => {
    setFormState(initialFilters);
    setFilters(initialFilters);
  }, [initialFilters]);

  const fetchNgos = useCallback(async (activeFilters) => {
    setState((prev) => ({ ...prev, loading: true, error: "" }));
    const params = new URLSearchParams();
    if (activeFilters.q) params.append("q", activeFilters.q);
    if (activeFilters.cause) params.append("cause", activeFilters.cause);
    if (activeFilters.location) params.append("location", activeFilters.location);

    try {
      const response = await fetch(`/api/mexican-ngos?${params.toString()}`);
      if (!response.ok) throw new Error("Unable to load organizations");
      const data = await response.json();
      setState({
        loading: false,
        error: "",
        ngos: data.ngos || [],
        total: data.total || (data.ngos ? data.ngos.length : 0),
        options: {
          causes: data.filterOptions?.causes || [],
          cities: data.filterOptions?.cities || [],
        },
      });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message || "Unable to load organizations" }));
    }
  }, []);

  useEffect(() => {
    fetchNgos(filters);
  }, [filters, fetchNgos]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFilters(formState);
  };

  const handleReset = () => {
    const empty = { q: "", cause: "", location: "" };
    setFormState(empty);
    setFilters(empty);
  };

  const appliedFilters = [
    filters.q && `Search: "${filters.q}"`,
    filters.cause && `Cause: ${filters.cause}`,
    filters.location && `City: ${filters.location}`,
  ].filter(Boolean);

  return (
    <>
      <section className="page-section directory-hero snap-target" data-animate="section">
        <div className="content-max">
          <div className="section-heading text-center fade-up" data-animate="stagger">
            <p className="eyebrow text-uppercase mb-2">ngo directory</p>
            <h1 className="hero-title fs-1 mb-3" data-animate="split-lines">
              Discover causes near you
            </h1>
            <p className="hero-subtitle fs-5 mb-0" data-animate="fade">
              Use filters to find organizations aligned with your interests and location.
            </p>
          </div>

          <div className="directory-banner">
            <div className="parallax-banner glass-panel" data-animate="mask">
              <div className="parallax-banner__bg" data-parallax="0.22"></div>
              <div className="parallax-banner__content d-flex flex-column flex-md-row align-items-md-center gap-3">
                <div className="flex-grow-1">
                  <h2 className="h4 mb-2">Filter smarter, connect faster</h2>
                  <p className="mb-0">Dial in location, focus area, and SDG alignment to surface the organizations that benefit most from your time and resources.</p>
                </div>
                <div className="d-inline-flex gap-2">
                  <span className="badge-soft">Real-time updates</span>
                  <span className="badge-soft">Verified NGOs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="directory-filter glass-panel fade-up" data-animate="float-card">
            <form className="directory-form" onSubmit={handleSubmit} data-animate="stagger" data-stagger-target=".directory-input, .directory-submit">
              <div className="directory-form-row">
                <label className="visually-hidden" htmlFor="directory-search">
                  Search by name or mission
                </label>
                <input
                  id="directory-search"
                  className="form-control directory-input"
                  type="text"
                  name="q"
                  placeholder="Search organizations..."
                  value={formState.q}
                  onChange={(e) => setFormState({ ...formState, q: e.target.value })}
                />

                <label className="visually-hidden" htmlFor="directory-cause">
                  Filter by cause
                </label>
                <select
                  className="form-select directory-input"
                  id="directory-cause"
                  value={formState.cause}
                  onChange={(e) => setFormState({ ...formState, cause: e.target.value })}
                >
                  <option value="">All Causes</option>
                  {state.options.causes.map((cause) => (
                    <option key={cause} value={cause}>
                      {cause}
                    </option>
                  ))}
                </select>

                <label className="visually-hidden" htmlFor="directory-location">
                  Filter by city
                </label>
                <select
                  className="form-select directory-input"
                  id="directory-location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                >
                  <option value="">All Cities</option>
                  {state.options.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <button type="submit" className="btn btn-pill btn-pill-primary directory-submit" data-animate="magnet">
                  Search
                </button>
              </div>
              <div className="directory-form-helper">
                <span className="text-muted small">
                  {state.total} {state.total === 1 ? "organization" : "organizations"} found
                </span>
                {appliedFilters.map((filter) => (
                  <span className="badge-soft" key={filter}>
                    {filter}
                  </span>
                ))}
                <button type="button" className="btn btn-link btn-sm ms-auto" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CauseConnect Opportunities Section */}
      <section className="page-section snap-target" data-animate="section">
        <div className="content-max">
          <SectionHeading
            eyebrow="Get Involved"
            title="CauseConnect Opportunities"
            description="Direct volunteering opportunities hosted by our partner organizations."
          />
          <div className="gg-projects-grid fade-up mt-4" data-animate="stagger-cards">
            {ccActivities.length > 0 ? (
              ccActivities.map(activity => (
                <CauseConnectCard 
                  key={activity._id} 
                  activity={activity} 
                  initialSignedUp={myParticipations.includes(activity._id)}
                />
              ))
            ) : (
              <div className="col-12 text-center text-muted p-5 glass-panel">
                <p>No active opportunities at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="page-section directory-results-section snap-target" data-animate="section">
        <div className="content-max">
          {state.loading && (
            <div className="directory-results" data-animate="stagger-cards">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="directory-card glass-panel skeleton-loader" key={index}>
                  <div className="skeleton-header mb-3"></div>
                  <div className="skeleton-text mb-2"></div>
                  <div className="skeleton-text mb-3"></div>
                  <div className="skeleton-progress mb-3"></div>
                  <div className="skeleton-footer"></div>
                </div>
              ))}
            </div>
          )}

          {!state.loading && state.error && (
            <div className="directory-empty glass-panel text-center p-5 fade-up" data-animate="float-card">
              <h3 className="h4 mb-3 text-danger">⚠️ Error</h3>
              <p className="mb-4">{state.error}</p>
              <button className="btn btn-pill btn-pill-outline" onClick={() => fetchNgos(filters)}>
                Try again
              </button>
            </div>
          )}

          {!state.loading && !state.error && state.ngos.length === 0 && (
            <div className="directory-empty glass-panel text-center p-5 fade-up" data-animate="float-card">
              <h3 className="h4 mb-3">No organizations found</h3>
              <p className="mb-4">Try adjusting your filters or search term to discover more Mexican NGOs.</p>
              <button className="btn btn-pill btn-pill-outline" onClick={handleReset}>
                Reset filters
              </button>
            </div>
          )}

          {!state.loading && !state.error && state.ngos.length > 0 && (
            <div className="directory-results fade-up" data-animate="stagger-cards" data-stagger-target=".directory-card">
              {state.ngos.map((org) => (
                <MexicanNgoCard 
                  key={org.id} 
                  org={org} 
                  initialBookmarked={myBookmarks.some(b => b.projectId === org.id.toString())}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <GlobalGivingExplorer myBookmarks={myBookmarks} />
    </>
  );
}

export default DirectoryPage;
