import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import dotenv from "dotenv";

import pageRoutes from "./routes/pageRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Seguridad básica (desactivamos CSP para permitir CDNs/iframes sin configurar listas)
app.use(helmet({ contentSecurityPolicy: false }));

// EJS y estáticos
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/", pageRoutes);         // "/" y "/sdgs"
app.use("/directory", ngoRoutes);      // "/ngos"
app.use("/contact", messageRoutes); // "/contact" (GET/POST)

// 404
app.use((req, res) => {
  res.status(404).render("index", {
    title: "CauseConnect",
    extraCss: [],
    notFound: true
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 CauseConnect running on http://localhost:${PORT}`)
);
