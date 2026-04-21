/**
 * @file controllers/servicesController.js
 * @description Controlador para el catálogo de servicios de coSAFE.
 *
 * Los datos se leen sincrónicamente desde `data/services.json` en cada
 * request. Este patrón es apropiado para datos estáticos de baja frecuencia
 * de cambio; si los datos se actualizaran con frecuencia se recomendaría
 * usar una caché en memoria con TTL.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath  = join(__dirname, "../data/services.json");

/** Lee y parsea el archivo de servicios. @returns {Array} */
const load = () => JSON.parse(readFileSync(dataPath, "utf-8"));

/**
 * GET /api/services
 * Devuelve el arreglo completo de servicios.
 * @type {import("express").RequestHandler}
 */
export const getAllServices = (_req, res) => {
  try {
    res.json({ success: true, data: load() });
  } catch {
    res.status(500).json({ success: false, error: "Could not load services" });
  }
};

/**
 * GET /api/services/:slug
 * Devuelve un único servicio identificado por su slug.
 * Responde 404 si el slug no existe.
 * @type {import("express").RequestHandler}
 */
export const getServiceBySlug = (req, res) => {
  try {
    const service = load().find((s) => s.slug === req.params.slug);
    if (!service)
      return res.status(404).json({ success: false, error: "Service not found" });
    res.json({ success: true, data: service });
  } catch {
    res.status(500).json({ success: false, error: "Could not load service" });
  }
};
