/**
 * @file routes/services.js
 * @description Rutas del catálogo de servicios.
 *
 * Base: /api/services
 *
 * @route GET /          → getAllServices      — Lista todos los servicios disponibles
 * @route GET /:slug     → getServiceBySlug   — Devuelve un servicio por su slug único
 */
import { Router } from "express";
import { getAllServices, getServiceBySlug } from "../controllers/servicesController.js";

const router = Router();

router.get("/",      getAllServices);
router.get("/:slug", getServiceBySlug);

export default router;
