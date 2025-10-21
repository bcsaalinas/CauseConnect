import express from "express";
const router = express.Router();

// Contact (GET)
router.get("/", (req, res) => {
  res.render("pages/contact", {
    title: "Contact",
    page: "contact",
    flash: null,
    extraCss: []
  });
});

// Contact (POST) — solo mensaje exito
router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).render("pages/contact", {
      title: "Contact",
      page: "contact",
      flash: { type: "danger", message: "All fields are required." },
      extraCss: []
    });
  }

  return res.render("pages/contact", {
    title: "Contact",
    page: "contact",
    flash: { type: "success", message: "Message sent successfully!" },
    extraCss: []
  });
});

export default router;
