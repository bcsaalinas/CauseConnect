import dotenv from "dotenv";
// Load environment variables FIRST before other imports
dotenv.config();
console.log(
  "✓ .env loaded, API key present:",
  !!process.env.GLOBALGIVING_API_KEY
);

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";

import pageRoutes from "./src/routes/pageRoutes.js";
import ngoRoutes from "./src/routes/ngoRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import globalGivingRoutes from "./src/routes/api/globalgiving.js";
import atlasRoutes from "./src/routes/api/atlas.js";
import mexicanNGOsRoutes from "./src/routes/api/mexican-ngos.js";
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Seguridad básica (desactivamos CSP para permitir CDNs/iframes sin configurar listas)
app.use(helmet({ contentSecurityPolicy: false }));

// EJS y estáticos
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "src", "public")));
app.use(
  "/vendor/gsap",
  express.static(path.join(__dirname, "node_modules", "gsap"))
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use("/", pageRoutes); // "/" y "/sdgs"
app.use("/directory", ngoRoutes); // "/ngos"
app.use("/contact", messageRoutes); // "/contact" (GET/POST)
app.use("/api/gg", globalGivingRoutes); // GlobalGiving API proxy
app.use("/api/atlas", atlasRoutes); // GlobalGiving Atlas API proxy
app.use("/api/mexican-ngos", mexicanNGOsRoutes); // Mexican NGOs API

// 404
app.use((req, res) => {
  res.status(404).render("pages/index", {
    title: "CauseConnect",
    page: "home",
    extraCss: [],
    notFound: true,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 CauseConnect running on http://localhost:${PORT}`)
);
