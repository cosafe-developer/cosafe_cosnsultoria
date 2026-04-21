import { useState, useEffect } from "react";

/**
 * Carga el script de Google Maps una sola vez, de forma dinámica.
 * Múltiples componentes pueden llamar a este hook sin generar scripts duplicados.
 *
 * Usa el patrón "callback global" que Google recomienda para carga asíncrona
 * sin librerías externas.
 */

const SCRIPT_ID   = "google-maps-api";
const CALLBACK_FN = "__googleMapsReady";

// Cola de resolvers esperando que el script cargue.
// Vive fuera del hook para ser compartida entre todas las instancias.
let pendingResolvers = [];

// Función global que Google invocará cuando el script termine de cargar.
// Se define una sola vez al importar el módulo.
window[CALLBACK_FN] = () => {
  pendingResolvers.forEach((fn) => fn());
  pendingResolvers = [];
};

// ─────────────────────────────────────────────────────────────────────────────

export function useGoogleMaps(apiKey, libraries = ["places"]) {
  const [isLoaded, setIsLoaded] = useState(
    () => typeof window !== "undefined" && Boolean(window.google?.maps?.places)
  );
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    // Sin API key: no intentar cargar nada
    if (!apiKey) return;

    // Ya disponible (ej: Hot Reload en dev)
    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    // Registrar callback para cuando el script cargue
    pendingResolvers.push(() => setIsLoaded(true));

    // Si el script ya fue inyectado por otra instancia del hook, esperar
    if (document.getElementById(SCRIPT_ID)) return;

    // Inyectar el script
    const script    = document.createElement("script");
    script.id       = SCRIPT_ID;
    script.async    = true;
    script.defer    = true;
    script.src      = `https://maps.googleapis.com/maps/api/js`
      + `?key=${apiKey}`
      + `&libraries=${libraries.join(",")}`
      + `&callback=${CALLBACK_FN}`;

    script.onerror = () => {
      setLoadError(new Error("No se pudo cargar Google Maps. Verifica la API key."));
      pendingResolvers = [];
    };

    document.head.appendChild(script);

    // No se elimina el script al desmontar: es un recurso global compartido.
  }, [apiKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isLoaded, loadError };
}
