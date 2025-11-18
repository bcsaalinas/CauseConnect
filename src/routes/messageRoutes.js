import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "All fields are required.",
    });
  }

  return res.json({
    success: true,
    message: "Message sent successfully!",
  });
});

export default router;
