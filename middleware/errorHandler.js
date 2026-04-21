/**
 * @file errorHandler.js
 * @description Middleware de manejo de errores centralizado para Express.
 *
 * Exporta dos middlewares:
 *  - notFound     — 404 para rutas no definidas
 *  - errorHandler — manejador de errores global (debe registrarse al final)
 */

/**
 * Middleware 404 — responde cuando ninguna ruta coincide.
 * @type {import("express").RequestHandler}
 */
export const notFound = (_req, res) =>
  res.status(404).json({ success: false, error: "Route not found" });

/**
 * Manejador de errores global — captura cualquier error lanzado con next(err).
 * Registra el stack trace en consola y devuelve una respuesta JSON segura
 * (nunca expone el stack al cliente).
 *
 * @type {import("express").ErrorRequestHandler}
 */
export const errorHandler = (err, _req, res, _next) => {
  console.error("[ErrorHandler]", err.stack ?? err.message);
  const status = err.status ?? 500;
  // Never expose internal error details to the client
  const message = status >= 500 ? "Internal server error" : (err.message ?? "Error");
  res.status(status).json({ success: false, error: message });
};
