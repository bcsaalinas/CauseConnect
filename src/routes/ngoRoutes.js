import express from "express";
import { ngos } from "../services/data/ngos.js";

const router = express.Router();

// Directory con filtros básicos por query 
router.get("/", (req, res) => {
  const { q = "", cause = "", location = "" } = req.query;
  const term = q.trim().toLowerCase();

  const filtered = ngos.filter(n => {
    const matchText =
      !term ||
      n.name.toLowerCase().includes(term) ||
      (n.blurb || "").toLowerCase().includes(term);
    const matchCause = !cause || n.cause === cause;
    const matchLoc = !location || n.location === location;
    return matchText && matchCause && matchLoc;
  });

  res.render("pages/directory", {
    title: "NGO Directory",
    ngos: filtered,
    q,
    cause,
    location,
    page: "directory",
    extraCss: []
  });
});

export default router;
