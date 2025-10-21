import express from "express";
import NodeCache from "node-cache";

const router = express.Router();

// In-memory cache with TTL
const cache = new NodeCache({
  stdTTL: 600, // 10 minutes default
  checkperiod: 120 // Check for expired keys every 2 minutes
});

// GlobalGiving API configuration
const GG_BASE_URL = "https://api.globalgiving.org/api/public";
const GG_PROJECTS_URL = `${GG_BASE_URL}/projectservice/all/projects`;
const GG_FEATURED_URL = `${GG_BASE_URL}/projectservice/featured/projects`;
const GG_COUNTRIES_URL = `${GG_BASE_URL}/projectservice/regions/countries/projects/count`;

// Helper to get API key (lazy evaluation)
function getApiKey() {
  const key = process.env.GLOBALGIVING_API_KEY;
  if (!key) {
    throw new Error("GLOBALGIVING_API_KEY environment variable is not set");
  }
  return key;
}

/**
 * Data normalization: Transform GlobalGiving project to UI-friendly shape
 */
function normalizeProject(project) {
  return {
    id: project.id || null,
    title: project.title || "Untitled Project",
    summary: project.summary || "",
    description: project.description || project.summary || "",
    organization: {
      id: project.organization?.id || null,
      name: project.organization?.name || "Unknown Organization",
    },
    location: {
      country: project.country || "Unknown",
      region: project.region || "",
      city: project.city || "",
    },
    theme: project.themes?.[0]?.name || project.theme?.name || "General",
    imageUrl: project.imageLink || project.image?.imagelink?.[0]?.url || "/images/placeholder-project.jpg",
    goal: {
      amount: project.goal || 0,
      currency: "USD",
    },
    raised: {
      amount: project.funding || 0,
      currency: "USD",
    },
    progress: project.goal > 0 ? Math.round((project.funding / project.goal) * 100) : 0,
    numberOfDonations: project.numberOfDonations || 0,
    status: project.status || "active",
    url: project.url || `https://www.globalgiving.org/projects/${project.id}/`,
    activities: project.activities || "",
    contactUrl: project.contactUrl || null,
  };
}

/**
 * Fetch from GlobalGiving API with error handling
 */
async function fetchGlobalGiving(endpoint, params = {}) {
  try {
    const url = new URL(endpoint);

    // Add API key and additional params as query parameters
    url.searchParams.append("api_key", getApiKey());

    // Add additional params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GlobalGiving API error (${response.status}):`, errorText);
      throw new Error(`GlobalGiving API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("GlobalGiving API fetch error:", error);
    throw error;
  }
}

/**
 * GET /api/gg/projects/featured/summary
 * Returns quick stats about featured projects (15 min cache)
 */
router.get("/projects/featured/summary", async (req, res) => {
  const cacheKey = "gg_featured_summary";

  try {
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Fetch featured projects
    const data = await fetchGlobalGiving(GG_FEATURED_URL, {
      numberPerPage: 20,
    });

    const projects = data.projects?.project || [];

    const summary = {
      count: projects.length,
      totalGoal: projects.reduce((sum, p) => sum + (p.goal || 0), 0),
      totalRaised: projects.reduce((sum, p) => sum + (p.funding || 0), 0),
      countries: [...new Set(projects.map(p => p.country).filter(Boolean))].length,
      themes: [...new Set(projects.map(p => p.theme?.name || p.themes?.[0]?.name).filter(Boolean))],
    };

    // Cache for 15 minutes
    cache.set(cacheKey, summary, 900);

    res.json(summary);
  } catch (error) {
    console.error("Error fetching featured summary:", error);
    res.status(500).json({
      error: "Failed to fetch featured projects summary",
      message: error.message
    });
  }
});

/**
 * GET /api/gg/projects/featured
 * Returns featured projects with full details (10 min cache)
 */
router.get("/projects/featured", async (req, res) => {
  const cacheKey = "gg_featured_projects";

  try {
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Fetch featured projects
    const data = await fetchGlobalGiving(GG_FEATURED_URL, {
      numberPerPage: 12,
    });

    const projects = (data.projects?.project || []).map(normalizeProject);

    const response = {
      projects,
      total: data.projects?.total || projects.length,
      fetched: projects.length,
    };

    // Cache for 10 minutes
    cache.set(cacheKey, response, 600);

    res.json(response);
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    res.status(500).json({
      error: "Failed to fetch featured projects",
      message: error.message
    });
  }
});

/**
 * GET /api/gg/projects/by-country/:country
 * Returns projects filtered by country (10 min cache)
 */
router.get("/projects/by-country/:country", async (req, res) => {
  const { country } = req.params;

  // Validate country parameter
  if (!country || country.length < 2) {
    return res.status(400).json({ error: "Invalid country parameter" });
  }

  const cacheKey = `gg_country_${country.toLowerCase()}`;

  try {
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Fetch projects by country
    const data = await fetchGlobalGiving(GG_PROJECTS_URL, {
      country,
      numberPerPage: 20,
    });

    const projects = (data.projects?.project || []).map(normalizeProject);

    const response = {
      country,
      projects,
      total: data.projects?.total || projects.length,
      fetched: projects.length,
    };

    // Cache for 10 minutes
    cache.set(cacheKey, response, 600);

    res.json(response);
  } catch (error) {
    console.error(`Error fetching projects for country ${country}:`, error);
    res.status(500).json({
      error: "Failed to fetch projects by country",
      message: error.message
    });
  }
});

/**
 * GET /api/gg/projects/by-theme/:theme
 * Returns projects filtered by theme (10 min cache)
 */
router.get("/projects/by-theme/:theme", async (req, res) => {
  const { theme } = req.params;

  // Validate theme parameter
  if (!theme || theme.length < 2) {
    return res.status(400).json({ error: "Invalid theme parameter" });
  }

  const cacheKey = `gg_theme_${theme.toLowerCase()}`;

  try {
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Fetch projects by theme
    const data = await fetchGlobalGiving(GG_PROJECTS_URL, {
      theme,
      numberPerPage: 20,
    });

    const projects = (data.projects?.project || []).map(normalizeProject);

    const response = {
      theme,
      projects,
      total: data.projects?.total || projects.length,
      fetched: projects.length,
    };

    // Cache for 10 minutes
    cache.set(cacheKey, response, 600);

    res.json(response);
  } catch (error) {
    console.error(`Error fetching projects for theme ${theme}:`, error);
    res.status(500).json({
      error: "Failed to fetch projects by theme",
      message: error.message
    });
  }
});

/**
 * GET /api/gg/projects/search
 * Search projects by keyword (3 min cache)
 */
router.get("/projects/search", async (req, res) => {
  const { q, country, theme, limit = 20 } = req.query;

  // Validate search query
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: "Search query must be at least 2 characters" });
  }

  const searchTerm = q.trim();
  const cacheKey = `gg_search_${searchTerm.toLowerCase()}_${country || ''}_${theme || ''}`;

  try {
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Build search params
    const params = {
      q: searchTerm,
      numberPerPage: Math.min(parseInt(limit) || 20, 50), // Max 50
    };

    if (country) params.country = country;
    if (theme) params.theme = theme;

    // Fetch search results
    const data = await fetchGlobalGiving(GG_PROJECTS_URL, params);

    const projects = (data.projects?.project || []).map(normalizeProject);

    const response = {
      query: searchTerm,
      filters: { country, theme },
      projects,
      total: data.projects?.total || projects.length,
      fetched: projects.length,
    };

    // Cache for 3 minutes
    cache.set(cacheKey, response, 180);

    res.json(response);
  } catch (error) {
    console.error(`Error searching projects for "${searchTerm}":`, error);
    res.status(500).json({
      error: "Failed to search projects",
      message: error.message
    });
  }
});

/**
 * GET /api/gg/projects/directory
 * Returns projects for directory page with filters (10 min cache)
 * Query params: country, theme, q (search), limit
 */
router.get("/projects/directory", async (req, res) => {
  const { country, theme, q, limit = 50 } = req.query;

  // Build cache key from filters
  const cacheKey = `gg_directory_${country || 'all'}_${theme || 'all'}_${q || 'none'}_${limit}`;

  try {
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Build search params
    const params = {
      numberPerPage: Math.min(parseInt(limit) || 50, 100), // Max 100
    };

    if (country) params.country = country;
    if (theme) params.theme = theme;
    if (q) params.q = q;

    // Fetch projects
    const data = await fetchGlobalGiving(GG_PROJECTS_URL, params);

    const projects = (data.projects?.project || []).map(normalizeProject);

    const response = {
      projects,
      total: data.projects?.total || projects.length,
      fetched: projects.length,
      filters: { country, theme, q },
    };

    // Cache for 10 minutes
    cache.set(cacheKey, response, 600);

    res.json(response);
  } catch (error) {
    console.error("Error fetching directory projects:", error);
    res.status(500).json({
      error: "Failed to fetch projects",
      message: error.message
    });
  }
});

/**
 * GET /api/gg/atlas/countries
 * Returns list of countries with active projects (24 hour cache)
 */
router.get("/atlas/countries", async (req, res) => {
  const cacheKey = "gg_countries";

  try {
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Fetch countries list
    const data = await fetchGlobalGiving(GG_COUNTRIES_URL);

    const countries = (data.countries?.country || []).map(c => ({
      code: c.iso3166CountryCode || null,
      name: c.name || "Unknown",
      projectCount: c.numProjects || 0,
    })).sort((a, b) => a.name.localeCompare(b.name));

    const response = {
      countries,
      total: countries.length,
    };

    // Cache for 24 hours
    cache.set(cacheKey, response, 86400);

    res.json(response);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({
      error: "Failed to fetch countries list",
      message: error.message
    });
  }
});

export default router;
