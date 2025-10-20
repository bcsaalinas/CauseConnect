import express from "express";
const router = express.Router();

// Contact (GET)
router.get("/", (req, res) => {
  res.render("contact", {
    title: "Contact",
    flash: null,
    extraCss: ["/styles/main.css", "/styles/contact.css"]
  });
});

// Contact (POST) — solo mensaje exito
router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).render("contact", {
      title: "Contact",
      flash: { type: "danger", message: "All fields are required." },
      extraCss: ["/styles/main.css", "/styles/contact.css"]
    });
  }

  return res.render("contact", {
    title: "Contact",
    flash: { type: "success", message: "Message sent successfully!" },
    extraCss: ["/styles/main.css", "/styles/contact.css"]
  });
});

export default router;
