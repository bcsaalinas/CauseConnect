import express from "express";
const router = express.Router();

// Home
router.get("/", (req, res) => {
  res.render("index", {
    title: "Cause Connect",
    extraCss: ["/styles/main.css"]
  });
});

// SDGs
router.get("/sdgs", (req, res) => {
  res.render("sdgs", {
    title: "Cause Connect - SDGs",
    extraCss: ["/styles/main.css", "/styles/sdg-section.css"]
  });
});

export default router;
