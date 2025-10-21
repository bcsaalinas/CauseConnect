import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import dotenv from "dotenv";

import pageRoutes from "./src/routes/pageRoutes.js";
import ngoRoutes from "./src/routes/ngoRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Seguridad básica (desactivamos CSP para permitir CDNs/iframes sin configurar listas)
app.use(helmet({ contentSecurityPolicy: false }));

// EJS y estáticos
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "src", "public")));
app.use("/vendor/gsap", express.static(path.join(__dirname, "node_modules", "gsap")));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/", pageRoutes);         // "/", "/directory", "/sdgs"
app.use("/api/directory", ngoRoutes);  // API para datos del directorio
app.use("/contact", messageRoutes);     // "/contact" (GET/POST)

// 404
app.use((req, res) => {
  res.status(404).render("pages/index", {
    title: "CauseConnect",
    page: "home",
    extraCss: [],
    notFound: true
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 CauseConnect running on http://localhost:${PORT}`)
);
