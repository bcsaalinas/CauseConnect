import express from "express";

const router = express.Router();

// Directory with Mexican NGOs from API
router.get("/", async (req, res) => {
  const { q = "", cause = "", location = "" } = req.query;

  try {
    // Build API URL with query parameters
    const apiUrl = new URL(
      `${req.protocol}://${req.get("host")}/api/mexican-ngos`
    );
    if (q) apiUrl.searchParams.append("q", q);
    if (cause) apiUrl.searchParams.append("cause", cause);
    if (location) apiUrl.searchParams.append("location", location);

    // Fetch NGOs from our API
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch NGOs");
    }

    // Extract filter options for dropdowns
    const { causes, cities, states } = data.filterOptions;

    res.render("pages/directory", {
      title: "NGO Directory - Mexican Organizations",
      ngos: data.ngos,
      q,
      cause,
      location,
      causes,
      cities,
      states,
      totalResults: data.total,
      error: null,
      page: "directory",
      extraCss: [],
    });
  } catch (error) {
    console.error("Error loading directory:", error);

    // Render error state
    res.render("pages/directory", {
      title: "NGO Directory",
      ngos: [],
      q,
      cause,
      location,
      causes: [],
      cities: [],
      states: [],
      totalResults: 0,
      error: "Unable to load organizations. Please try again later.",
      page: "directory",
      extraCss: [],
    });
  }
});

export default router;
