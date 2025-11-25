const { useState, useEffect, useMemo, useCallback } = React;
const { createRoot } = ReactDOM;
const { BrowserRouter, Routes, Route, NavLink, Link, useLocation } = ReactRouterDOM;

const HERO_HIGHLIGHTS = [
  {
    label: "01",
    title: "Curated NGO insights",
    copy:
      "Browse verified organizations, mission statements, and impact snapshots tailored to your interests.",
  },
  {
    label: "02",
    title: "Smart search & filters",
    copy:
      "Find causes by location, SDG, or focus area, then save opportunities as you plan your support.",
  },
  {
    label: "03",
    title: "Community stories",
    copy:
      "Explore testimonials from volunteers and partners that show how collaboration drives real change.",
  },
  {
    label: "04",
    title: "Aligned with the SDGs",
    copy:
      "Stay informed on progress toward the Sustainable Development Goals and discover how to contribute.",
  },
];

const CHAPTER_STEPS = [
  {
    id: "chapter-01",
    badge: "chapter 01",
    title: "Find an organization you believe in",
    copy:
      "Search by SDG, location, or focus area. Curated stories and transparent metrics help you discover organizations that match your purpose.",
    image: "/images/Discover.jpg",
    alt: "Find an organization you believe in",
    priority: "high",
  },
  {
    id: "chapter-02",
    badge: "chapter 02",
    title: "Join and get involved",
    copy:
      "Create an account, follow impact updates, and coordinate with teams. Cause Connect keeps every conversation and opportunity in one place.",
    image: "/images/helpOut.jpg",
    alt: "Join and get involved",
  },
  {
    id: "chapter-03",
    badge: "chapter 03",
    title: "Help out, make an impact",
    copy:
      "Volunteer, donate, or participate — see how every contribution moves the mission forward.",
    image: "/images/beAmazing.jpg",
    alt: "Help out, make an impact",
  },
];

const STAT_BLOCKS = [
  { label: "active ngos", end: 120, suffix: "+" },
  { label: "sdgs represented", end: 25, suffix: "" },
  { label: "community actions", end: 8000, suffix: "", format: "compact" },
];

const CREATOR_TEAM = [
  {
    name: "Alberto Cisneros",
    role: "Front-end Design & Animation",
    copy: "Crafted the UI, GSAP animations, and brought the brand to life with motion.",
  },
  {
    name: "Juan Luna",
    role: "Back-end Development & Systems",
    copy: "Built the server logic, routes, and ensured everything worked seamlessly behind the scenes.",
  },
  {
    name: "Isaac Zenteno",
    role: "Research & Content Curation",
    copy: "Gathered NGO data, verified SDG information, and gave meaning to every directory entry.",
  },
];

const SDG_GOALS = [
  { number: 1, title: "No Poverty", copy: "Eradicate poverty in all forms everywhere." },
  { number: 2, title: "Zero Hunger", copy: "End hunger and ensure food security through sustainable agriculture." },
  { number: 3, title: "Good Health", copy: "Guarantee healthy lives and well-being for all ages." },
  { number: 4, title: "Quality Education", copy: "Provide inclusive and equitable education for everyone." },
  { number: 5, title: "Gender Equality", copy: "Achieve equality and empower all women and girls." },
  { number: 6, title: "Clean Water & Sanitation", copy: "Ensure safe water and sanitation access for all." },
  { number: 7, title: "Affordable & Clean Energy", copy: "Provide sustainable, modern, and reliable energy." },
  { number: 8, title: "Decent Work & Growth", copy: "Promote inclusive economic growth and decent jobs." },
  { number: 9, title: "Industry, Innovation & Infrastructure", copy: "Build resilient infrastructure and foster innovation." },
  { number: 10, title: "Reduced Inequalities", copy: "Decrease inequality within and among countries." },
  { number: 11, title: "Sustainable Cities", copy: "Make cities inclusive, safe, and environmentally friendly." },
  { number: 12, title: "Responsible Consumption", copy: "Ensure sustainable production and consumption patterns." },
  { number: 13, title: "Climate Action", copy: "Take urgent action to combat climate change." },
  { number: 14, title: "Life Below Water", copy: "Conserve oceans and marine resources." },
  { number: 15, title: "Life on Land", copy: "Protect forests, biodiversity, and ecosystems." },
  { number: 16, title: "Peace, Justice & Institutions", copy: "Promote peace, justice, and strong institutions." },
  { number: 17, title: "Partnerships for the Goals", copy: "Strengthen global cooperation for sustainability." },
];

const SDG_SPOTLIGHTS = [
  {
    badge: "Goal 2",
    title: "Community Kitchens MX",
    copy: "Redesigning food rescue programs with zero waste logistics.",
    query: "Community Kitchens",
  },
  {
    badge: "Goal 6",
    title: "Blue Water Alliance",
    copy: "Deploying low-cost filtration to lakeside communities.",
    query: "Blue Water Alliance",
  },
  {
    badge: "Goal 12",
    title: "Circular Craft Labs",
    copy: "Women-led cooperatives transforming textile offcuts into training.",
    query: "Circular Craft Labs",
  },
  {
    badge: "Goal 15",
    title: "Bosque Vivo",
    copy: "Monitoring biodiversity recoveries with local youth scientists.",
    query: "Bosque Vivo",
  },
];

const CONTACT_VALIDATORS = {
  name(value) {
    if (!value.trim()) return "please add your name";
    return "";
  },
  email(value) {
    if (!value.trim()) return "please use a valid email";
    const simplePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!simplePattern.test(value.trim())) return "please use a valid email";
    return "";
  },
  message(value) {
    if (!value.trim()) return "let us know how we can help";
    if (value.trim().length < 10) return "share a little more detail";
    return "";
  },
};

const formatNumber = (value, format) => {
  if (format === "compact") {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(
      value
    );
  }
  return value.toLocaleString("en-US");
};

function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return;
    document.title = `${title} | CauseConnect`;
  }, [title]);
}

function useDebouncedValue(value, delay = 300) {
  const [state, setState] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setState(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return state;
}

function SkipLink() {
  return (
    <a className="skip-link" href="#main-content">
      Skip to content
    </a>
  );
}

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

function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    if (typeof window.initCauseConnectAnimations === "function") {
      window.initCauseConnectAnimations();
    }
  }, [location.pathname, location.hash]);
  return null;
}

function HeroHighlightGrid() {
  return (
    <div className="row g-4" data-animate="stagger-cards" data-stagger-target=".glass-panel">
      {HERO_HIGHLIGHTS.map((item) => (
        <div className="col-12 col-md-6 col-xl-3" key={item.title}>
          <div className="glass-panel h-100 p-4 tilt-card fade-up reveal-mask" data-animate="mask">
            <div className="badge-soft mb-3">{item.label}</div>
            <h3 className="h5 mb-2">{item.title}</h3>
            <p className="mb-0">{item.copy}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChapterSection() {
  return (
    <section className="page-section chapters-section" data-animate="section">
      <div className="container-xl">
        <div className="section-heading text-center fade-up" data-animate="stagger">
          <p className="eyebrow text-uppercase mb-2">inside the platform</p>
          <h2>Every cause has a story worth amplifying</h2>
          <p>Follow a changemaker's journey from discovery to measurable impact across the Cause Connect ecosystem.</p>
        </div>
        <div className="chapters-container">
          {CHAPTER_STEPS.map((step) => (
            <div className="chapter-row fade-up" data-animate="float-card" key={step.id}>
              <div className="row align-items-stretch g-4 g-lg-5">
                <div className="col-12 col-lg-6">
                  <div className="chapter-image-wrapper">
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="chapter-img"
                      loading={step.priority === "high" ? "eager" : "lazy"}
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

function HeroStats() {
  return (
    <section className="page-section hero-stats snap-target" data-animate="metrics">
      <div className="content-max">
        <div className="row gy-4 align-items-center">
          <div className="col-lg-5">
            <div className="section-heading text-lg-start text-center fade-up" data-animate="stagger">
              <p className="eyebrow text-uppercase">impact at a glance</p>
              <h2>Growing a network of hope</h2>
              <p>Cause Connect helps NGOs gain visibility and support while empowering citizens to take action where it matters most.</p>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="row g-4 justify-content-center" data-animate="stagger-cards" data-stagger-target=".glass-panel">
              {STAT_BLOCKS.map((stat) => (
                <div className="col-6 col-md-4" key={stat.label}>
                  <div className="glass-panel p-4 text-center fade-up reveal-mask" data-animate="mask">
                    <div
                      className="display-5 fw-bold mb-2"
                      data-animate="counter"
                      data-counter-end={stat.end}
                      data-counter-suffix={stat.suffix}
                      data-counter-format={stat.format}
                    >
                      {`${formatNumber(stat.end, stat.format)}${stat.suffix}`}
                    </div>
                    <p className="mb-0 small text-muted text-uppercase">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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

function HeroCTA() {
  return (
    <section className="page-section hero-cta snap-target" data-animate="section">
      <div className="content-max">
        <div className="cta-band glass-panel p-4 p-md-5 text-center text-md-start fade-up" data-animate="mask">
          <div className="row align-items-center g-4" data-animate="stagger" data-stagger-target=".btn">
            <div className="col-md" data-animate="stagger">
              <p className="eyebrow text-uppercase mb-2">ready to act?</p>
              <h2 className="mb-3">Support initiatives that matter to you</h2>
              <p className="mb-0 text-white-50">
                Explore the directory, learn about the Sustainable Development Goals, and start making a difference today.
              </p>
            </div>
            <div className="col-md-auto d-flex flex-column flex-md-row gap-2 justify-content-center">
              <Link to="/directory" className="btn btn-pill btn-pill-primary" data-animate="magnet">
                Browse directory
              </Link>
              <Link to="/contact" className="btn btn-pill btn-pill-outline" data-animate="magnet">
                Partner with us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, description, align = "center" }) {
  return (
    <div className={`section-heading text-${align} fade-up`} data-animate="stagger">
      {eyebrow && <p className="eyebrow text-uppercase">{eyebrow}</p>}
      {title && <h2 data-animate="split-lines">{title}</h2>}
      {description && <p>{description}</p>}
    </div>
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
        <a href={project.url} target="_blank" rel="noopener" className="btn btn-pill btn-sm btn-outline-secondary">
          View project
        </a>
        <span className="text-muted small">{project.numberOfDonations} donors</span>
      </div>
    </article>
  );
}

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
                <article className="directory-card glass-panel" key={org.id}>
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
                    </div>
                    {(org.email || org.phone) && (
                      <div className="text-muted small d-flex flex-wrap gap-3">
                        {org.email && <span>✉️ {org.email}</span>}
                        {org.phone && <span>📞 {org.phone}</span>}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <GlobalGivingExplorer />
    </>
  );
}

function GlobalGivingExplorer() {
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
            state.projects.map((project) => <GlobalGivingCard key={project.id} project={project} />)}
        </div>
      </div>
    </section>
  );
}

function SdgPage() {
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
                  <button className="sdg-more btn btn-link p-0 mt-2" type="button">
                    Learn more
                  </button>
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

function ContactPage() {
  useDocumentTitle("Contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ submitting: false, flash: null });

  const validateField = (name, value) => {
    const validator = CONTACT_VALIDATORS[name];
    return validator ? validator(value) : "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fieldErrors = Object.keys(form).reduce((acc, field) => {
      acc[field] = validateField(field, form[field]);
      return acc;
    }, {});
    setErrors(fieldErrors);
    const hasErrors = Object.values(fieldErrors).some(Boolean);
    if (hasErrors) return;

    setStatus({ submitting: true, flash: null });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to send message");
      }
      setForm({ name: "", email: "", message: "" });
      setStatus({ submitting: false, flash: { type: "success", message: data.message } });
    } catch (error) {
      setStatus({ submitting: false, flash: { type: "danger", message: error.message || "Unable to send message" } });
    }
  };

  return (
    <>
      <section className="page-section contact-hero snap-target" data-animate="section">
        <div className="content-max text-center fade-up" data-animate="stagger">
          <p className="eyebrow text-uppercase mb-2">contact</p>
          <h1 className="hero-title fs-1 mb-3" data-animate="split-lines">
            We’d love to hear from you
          </h1>
          <p className="hero-subtitle fs-5 mb-0" data-animate="fade">
            Reach out with questions, partnerships, or ideas to support local initiatives.
          </p>
        </div>
      </section>

      <section className="page-section contact-form-section snap-target" data-animate="section">
        <div className="content-max position-relative" data-animate="stagger">
          <div className="contact-ambient" aria-hidden="true"></div>
          <div className="row g-4 align-items-start position-relative" data-animate="stagger" data-stagger-target=".glass-panel, form[data-animate]">
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="contact-details glass-panel p-4 fade-up reveal-mask" data-animate="float-card">
                <h2 className="h4 mb-3">Office & support</h2>
                <p className="mb-3">Our team is based in Guadalajara. We’ll get back to you within 2 business days.</p>
                <ul className="list-unstyled d-grid gap-3 mb-4">
                  <li className="d-flex gap-3">
                    <span className="badge-soft">Email</span>
                    <span>hello@causeconnect.org</span>
                  </li>
                  <li className="d-flex gap-3">
                    <span className="badge-soft">Phone</span>
                    <span>+52 (33) 5555 1234</span>
                  </li>
                  <li className="d-flex gap-3">
                    <span className="badge-soft">Address</span>
                    <span>Av. Chapultepec 123, Guadalajara, Jal.</span>
                  </li>
                </ul>
                <div className="contact-social d-flex gap-3" data-animate="stagger" data-stagger-target=".social-card">
                  <a href="#" className="social-card glass-panel tilt-card d-flex align-items-center justify-content-center" data-animate="magnet">
                    FB
                  </a>
                  <a href="#" className="social-card glass-panel tilt-card d-flex align-items-center justify-content-center" data-animate="magnet">
                    IG
                  </a>
                  <a href="#" className="social-card glass-panel tilt-card d-flex align-items-center justify-content-center" data-animate="magnet">
                    TW
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2">
              <form className="contact-form glass-panel p-4 p-md-5 fade-up reveal-mask" noValidate data-animate="float-card" onSubmit={handleSubmit}>
                <div className={`contact-field ${errors.name ? "is-invalid" : ""}`}>
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>
                  <input name="name" type="text" className="form-control" id="name" placeholder="Full name" value={form.name} onChange={handleChange} />
                  <small className="form-text invalid-feedback">{errors.name}</small>
                </div>
                <div className={`contact-field ${errors.email ? "is-invalid" : ""}`}>
                  <label className="form-label" htmlFor="email">
                    E-mail
                  </label>
                  <input name="email" type="email" className="form-control" id="email" placeholder="email@example.com" value={form.email} onChange={handleChange} />
                  <small className="form-text invalid-feedback">{errors.email}</small>
                </div>
                <div className={`contact-field ${errors.message ? "is-invalid" : ""}`}>
                  <label className="form-label" htmlFor="message">
                    Message
                  </label>
                  <textarea name="message" className="form-control" id="message" rows="4" placeholder="Write your message..." value={form.message} onChange={handleChange}></textarea>
                  <small className="form-text invalid-feedback">{errors.message}</small>
                </div>
                <button type="submit" className="btn btn-pill btn-pill-primary w-100" data-animate="magnet" disabled={status.submitting}>
                  {status.submitting ? "Sending..." : "Submit"}
                </button>
                {status.flash && (
                  <div className={`contact-flash alert alert-${status.flash.type} mt-3 fade-up is-visible`}>
                    {status.flash.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function NotFoundPage() {
  useDocumentTitle("Page not found");
  return (
    <section className="page-section" data-animate="section">
      <div className="content-max text-center">
        <h1 className="display-4 mb-3">Page not found</h1>
        <p className="mb-4">The page you’re looking for doesn’t exist. Head back to the homepage to keep exploring.</p>
        <Link to="/" className="btn btn-pill btn-pill-primary">
          Go home
        </Link>
      </div>
    </section>
  );
}

function MainRoutes() {
  const location = useLocation();
  const flushHome = location.pathname === "/";
  return (
    <main id="main-content" className={flushHome ? "page-main page-main--flush" : "page-main"}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/sdgs" element={<SdgPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SkipLink />
      <Header />
      <ScrollManager />
      <MainRoutes />
      <Footer />
    </BrowserRouter>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
