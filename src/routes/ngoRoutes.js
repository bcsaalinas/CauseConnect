import express from "express";
import { getPaginatedPrograms, getUniqueFocusAreas } from "../services/data/federalInventory.js";
import { ngos } from "../services/data/ngos.js";

const router = express.Router();

// Helper functions
function getCausesList(ngos) {
  return [...new Set(ngos.map(n => n.cause))].filter(Boolean);
}

function getLocationsList(ngos) {
  return [...new Set(ngos.map(n => n.location))].filter(Boolean);
}

// Directory con filtros básicos por query para NGOs y programas federales
router.get("/", (req, res) => {
  const { q = "", cause = "", location = "", page = "1", showFederal = "false" } = req.query;
  const term = q.trim().toLowerCase();

  // Filter NGOs
  const filtered = ngos.filter(n => {
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
      // Get unique focus areas from federal programs
      federalFocusAreas = getUniqueFocusAreas();
      console.log('Federal data loaded:', { 
        programsCount: federalData.programs.length,
        currentPage: federalData.currentPage,
        totalPages: federalData.totalPages
      });
    } catch (error) {
      console.error('Error loading federal programs:', error);
      federalData = {
        programs: [],
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10
      };
    }
  }

  res.json({
    data: filtered,
    federalPrograms: federalData,
    metadata: {
      total: filtered.length,
      causes: getCausesList(filtered),
      locations: getLocationsList(filtered),
      federalFocusAreas
    }
  });
});

export default router;
