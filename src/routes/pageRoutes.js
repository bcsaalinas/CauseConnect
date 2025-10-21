import express from "express";
import { ngos } from "../services/data/ngos.js";
import { getPaginatedPrograms, getUniqueFocusAreas } from "../services/data/federalInventory.js";

const router = express.Router();

// Home
router.get("/", (req, res) => {
  res.render("pages/index", {
    title: "Cause Connect",
    page: "home",
    extraCss: []
  });
});

// Directory
router.get("/directory", (req, res) => {
  const { q = "", cause = "", location = "", page = "1", showFederal = "true" } = req.query;
  const term = q.trim().toLowerCase();

  // Filter NGOs
  const filteredNgos = ngos.filter(n => {
    const matchText =
      !term ||
      n.name.toLowerCase().includes(term) ||
      (n.blurb || "").toLowerCase().includes(term);
    const matchCause = !cause || n.cause === cause;
    const matchLoc = !location || n.location === location;
    return matchText && matchCause && matchLoc;
  });

  // Get federal programs if requested
  let federalData = null;
  let federalFocusAreas = [];
  
  if (showFederal === "true") {
    try {
      federalData = getPaginatedPrograms(parseInt(page), 10, {
        search: q,
        focusArea: cause
      });
      federalFocusAreas = getUniqueFocusAreas();
    } catch (error) {
      console.error('Error loading federal programs:', error);
    }
  }

  // Get unique values for filters
  const causes = [...new Set(ngos.map(n => n.cause))].filter(Boolean);
  const locations = [...new Set(ngos.map(n => n.location))].filter(Boolean);
  
  res.render("pages/directory", {
    title: "Cause Connect - Directory",
    page: "directory",
    extraCss: ['/css/directory.css'],
    q,
    cause,
    location,
    page,
    showFederal,
    ngos: filteredNgos,
    federalPrograms: federalData,
    metadata: {
      total: filteredNgos.length,
      causes,
      locations,
      federalFocusAreas
    }
  });
});

// SDGs
router.get("/sdgs", (req, res) => {
  res.render("pages/sdg-section", {
    title: "Cause Connect - SDGs",
    page: "sdgs",
    extraCss: []
  });
});

export default router;
