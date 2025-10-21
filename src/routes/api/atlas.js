import express from "express";
import NodeCache from "node-cache";

const router = express.Router();

// In-memory cache with TTL
const cache = new NodeCache({
  stdTTL: 3600, // 1 hour default
  checkperiod: 300 // Check for expired keys every 5 minutes
});

// GlobalGiving Atlas API configuration
const ATLAS_BASE_URL = "https://api.globalgiving.org/v2/atlas";

// Helper to get API key (lazy evaluation)
function getApiKey() {
  const key = process.env.GLOBALGIVING_API_KEY;
  if (!key) {
    throw new Error("GLOBALGIVING_API_KEY environment variable is not set");
  }
  return key;
}

/**
 * Fetch from GlobalGiving Atlas API with error handling
 */
async function fetchAtlas(endpoint) {
  try {
    const url = `${endpoint}?api_key=${getApiKey()}`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Atlas API error (${response.status}):`, errorText);
      throw new Error(`Atlas API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Atlas API fetch error:", error);
    throw error;
  }
}

/**
 * Normalize organization data to consistent format
 */
function normalizeOrganization(org) {
  return {
    id: org.registration_id || org.id || null,
    name: org.organization_name || org.name || "Unknown Organization",
    mission: org.mission || org.description || "",
    registration_active: org.registration_active === "Active" || org.registration_active === true,
    mailing_address: {
      city: org.mailing_city || org.city || "",
      state: org.mailing_state || org.state || "",
      country: "Mexico",
    },
    website: org.organization_website || org.website || null,
    year_founded: org.year_founded ? parseInt(org.year_founded) : null,
    employee_count: org.employee_count ? parseInt(org.employee_count) : 0,
    volunteer_count: org.volunteer_count ? parseInt(org.volunteer_count) : 0,
    contact_email: org.contact_email || null,
    phone: org.phone_number || org.phone || null,
  };
}

/**
 * Filter organizations by search query
 */
function filterOrganizations(organizations, query) {
  if (!query || query.trim().length === 0) {
    return organizations;
  }

  const searchTerm = query.trim().toLowerCase();

  return organizations.filter(org => {
    const nameMatch = org.name.toLowerCase().includes(searchTerm);
    const missionMatch = org.mission.toLowerCase().includes(searchTerm);
    const cityMatch = org.mailing_address.city.toLowerCase().includes(searchTerm);
    const stateMatch = org.mailing_address.state.toLowerCase().includes(searchTerm);

    return nameMatch || missionMatch || cityMatch || stateMatch;
  });
}

/**
 * GET /api/atlas/organizations/mx
 * Returns organizations from Mexico with optional search filtering (1 hour cache)
 */
router.get("/organizations/mx", async (req, res) => {
  const { q } = req.query;
  const cacheKey = "atlas_mx_organizations";

  try {
    // Check cache for full dataset
    let organizations = cache.get(cacheKey);

    if (!organizations) {
      // Fetch from Atlas API
      const data = await fetchAtlas(`${ATLAS_BASE_URL}/organizations/MX.json`);

      // The Atlas API returns organizations in different formats depending on the endpoint
      // Handle both array and object with organizations property
      let rawOrgs = [];
      if (Array.isArray(data)) {
        rawOrgs = data;
      } else if (data.organizations && Array.isArray(data.organizations)) {
        rawOrgs = data.organizations;
      } else if (data.organization && Array.isArray(data.organization)) {
        rawOrgs = data.organization;
      } else {
        console.warn("Unexpected Atlas API response format:", Object.keys(data));
        rawOrgs = [];
      }

      // Normalize all organizations
      organizations = rawOrgs
        .map(normalizeOrganization)
        .filter(org => org.name !== "Unknown Organization") // Filter out invalid entries
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

      // Cache for 1 hour
      cache.set(cacheKey, organizations, 3600);

      console.log(`✓ Fetched and cached ${organizations.length} Mexican organizations from Atlas API`);
    }

    // Apply search filter if query provided
    let filtered = organizations;
    if (q && q.trim().length > 0) {
      filtered = filterOrganizations(organizations, q);
    }

    // Return results
    res.json({
      organizations: filtered,
      total: filtered.length,
      query: q || null,
      cached: cache.has(cacheKey),
    });

  } catch (error) {
    console.error("Error fetching Atlas organizations:", error);

    // Return appropriate error status
    if (error.message.includes("404")) {
      res.status(404).json({
        error: "Organizations not found",
        message: "No organizations found for Mexico"
      });
    } else if (error.message.includes("GLOBALGIVING_API_KEY")) {
      res.status(503).json({
        error: "Service unavailable",
        message: "API configuration error"
      });
    } else {
      res.status(503).json({
        error: "Service unavailable",
        message: "Unable to fetch organizations from Atlas API"
      });
    }
  }
});

/**
 * GET /api/atlas/countries
 * Returns list of available countries in Atlas
 */
router.get("/countries", async (req, res) => {
  const cacheKey = "atlas_countries";

  try {
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Fetch countries
    const data = await fetchAtlas(`${ATLAS_BASE_URL}/countries`);

    const countries = (data.countries || data.country || []).map(c => ({
      code: c.iso3166CountryCode || c.code || null,
      name: c.name || "Unknown",
    })).sort((a, b) => a.name.localeCompare(b.name));

    const response = {
      countries,
      total: countries.length,
    };

    // Cache for 24 hours
    cache.set(cacheKey, response, 86400);

    res.json(response);
  } catch (error) {
    console.error("Error fetching Atlas countries:", error);
    res.status(503).json({
      error: "Service unavailable",
      message: "Unable to fetch countries list"
    });
  }
});

export default router;
