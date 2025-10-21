import express from "express";
const router = express.Router();

// Home
router.get("/", (req, res) => {
  res.render("pages/index", {
    title: "Cause Connect",
    page: "home",
    extraCss: []
  });
});

router.get("/sdgs", (req, res) => {
  res.render("pages/sdg-section", {
    title: "Cause Connect - SDGs",
    page: "sdgs",
    extraCss: []
  });
});

export default router;
