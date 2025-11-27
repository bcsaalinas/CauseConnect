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
import cors from "cors";

import messageRoutes from "./src/routes/messageRoutes.js";
import globalGivingRoutes from "./src/routes/api/globalgiving.js";
import atlasRoutes from "./src/routes/api/atlas.js";
import mexicanNGOsRoutes from "./src/routes/api/mexican-ngos.js";
import authRoutes from "./routes/authRoutes.js"; // Import authRoutes
import mongoose from 'mongoose';

const app = express();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/causeconnect';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch(err => console.error('✕ MongoDB connection error:', err));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "src", "public");
const indexHtml = path.join(publicDir, "index.html");

// Seguridad básica (desactivamos CSP para permitir CDNs/iframes sin configurar listas)
app.use(helmet({ contentSecurityPolicy: false }));

// Enable CORS
app.use(cors());

// Archivos estáticos
app.use(express.static(publicDir));
app.use(
  "/vendor/gsap",
  express.static(path.join(__dirname, "node_modules", "gsap"))
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas API
app.use("/api/contact", messageRoutes);
app.use("/api/gg", globalGivingRoutes); // GlobalGiving API proxy
app.use("/api/atlas", atlasRoutes); // GlobalGiving Atlas API proxy
app.use("/api/mexican-ngos", mexicanNGOsRoutes); // Mexican NGOs API
app.use("/api/auth", authRoutes); // Rutas de autenticación
import activityRoutes from "./src/routes/activityRoutes.js";
app.use("/api/activities", activityRoutes);
import userRoutes from "./src/routes/userRoutes.js";
app.use("/api/user", userRoutes);
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
app.use("/api/dashboard", dashboardRoutes);

// Fallback para SPA
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/vendor")) {
    return next();
  }
  res.sendFile(indexHtml);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 CauseConnect running on http://localhost:${PORT}`)
);
