/**
 * @file routes/content.js
 * @description Rutas de contenido del sitio.
 *
 * Base: /api/content
 *
 * @route GET  /              → getSiteContent  — Devuelve todo el contenido del sitio (JSON)
 * @route GET  /projects      → getProjects     — Devuelve los proyectos / casos de éxito
 * @route POST /contact       → submitContact   — Procesa y envía el formulario de cotización
 */
import { Router } from "express";
import { getSiteContent, getProjects, submitContact } from "../controllers/contentController.js";

const router = Router();

router.get("/",         getSiteContent);
router.get("/projects", getProjects);
router.post("/contact", submitContact);

export default router;
