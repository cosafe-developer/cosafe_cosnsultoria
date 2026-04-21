/**
 * @file server.js
 * @description Punto de entrada del servidor Express para la API de coSAFE Consultoría.
 *
 * Rutas principales:
 *   GET  /api/health          — Health check
 *   GET  /api/services        — Catálogo de servicios
 *   GET  /api/services/:slug  — Servicio por slug
 *   GET  /api/content         — Contenido del sitio
 *   GET  /api/content/projects— Proyectos / casos de éxito
 *   POST /api/contact         — Formulario de cotización (envía email via Resend)
 *
 * Variables de entorno requeridas (.env):
 *   PORT             — Puerto del servidor (default: 3001)
 *   RESEND_API_KEY   — API key de Resend para envío de emails
 *   RESEND_FROM      — Dirección remitente verificada en Resend
 *   RESEND_TO        — Dirección de destino para cotizaciones
 *   ALLOWED_ORIGINS  — Orígenes CORS permitidos, separados por coma
 *                      (default: http://localhost:5173,http://localhost:3000)
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import servicesRouter from "./routes/services.js";
import contentRouter  from "./routes/content.js";
import { submitContact } from "./controllers/contentController.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = process.env.PORT ?? 3001;

// ── CORS — soporta múltiples orígenes configurables por env ───────────────
// En producción, establece ALLOWED_ORIGINS=https://cosafeconsultoria.com
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ?? "http://localhost:5173,http://localhost:3000"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Permitir requests sin origen (curl, Postman, SSR server-side)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));   // pre-flight para todos los endpoints
app.use(morgan("dev"));
app.use(express.json({ limit: "64kb" }));  // limita payload para evitar DoS

// ── Static assets ──────────────────────────────────────────────────────────
app.use("/img", express.static(join(__dirname, "../img")));

// ── Routes ─────────────────────────────────────────────────────────────────
/** @route GET /api/health — Verificación de disponibilidad del servidor */
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

app.use("/api/services", servicesRouter);
app.use("/api/content",  contentRouter);
app.post("/api/contact", submitContact);

// ── Error handling ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`\n  coSAFE API  →  http://localhost:${PORT}/api/health\n`)
);
