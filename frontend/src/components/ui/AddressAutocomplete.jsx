import { useEffect, useRef } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { useGoogleMaps } from "../../hooks/useGoogleMaps.js";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

/**
 * Input de dirección con Google Places PlaceAutocompleteElement (API v2025+).
 *
 * Props:
 *   value        — formatted_address seleccionado (string). Controla el display.
 *   onSelect(d)  — se llama con { formatted_address, lat, lng, components } al elegir.
 *   onClear()    — se llama cuando el usuario borra la selección.
 *   placeholder  — texto de placeholder
 *   className    — clases extra para el wrapper
 */
export default function AddressAutocomplete({
  value       = "",
  onSelect,
  onClear,
  placeholder = "Busca la dirección de tu empresa o instalación...",
  className   = "",
}) {
  const containerRef = useRef(null);
  const elementRef   = useRef(null);
  const onSelectRef  = useRef(onSelect);

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  const hasApiKey = Boolean(API_KEY);
  const { isLoaded, loadError } = useGoogleMaps(hasApiKey ? API_KEY : null);

  // Sincroniza reset desde el padre (limpiar formulario)
  useEffect(() => {
    if (!value && elementRef.current) {
      elementRef.current.value = "";
    }
  }, [value]);

  // Inicializa PlaceAutocompleteElement una vez que el SDK está listo
  useEffect(() => {
    if (!isLoaded || !containerRef.current || elementRef.current) return;

    const el = new window.google.maps.places.PlaceAutocompleteElement({
      componentRestrictions: { country: "mx" },
    });

    if (placeholder) el.setAttribute("placeholder", placeholder);

    // Estilos para integrarse con el design system
    el.style.cssText = [
      "width:100%",
      "--gmp-input-placeholder-color:#7a9484",
      "--gmp-filled-input-border-radius:0.5rem",
      "--gmp-color-surface:#ffffff",
    ].join(";");

    el.addEventListener("gmp-placeselect", async (e) => {
      try {
        const place = e.placePrediction.toPlace();
        await place.fetchFields({
          fields: ["formattedAddress", "addressComponents", "location"],
        });

        // Normalizar al mismo formato que esperaba la API antigua
        const components = (place.addressComponents ?? []).map((c) => ({
          long_name : c.longText  ?? "",
          short_name: c.shortText ?? "",
          types     : c.types     ?? [],
        }));

        onSelectRef.current({
          formatted_address: place.formattedAddress ?? "",
          lat       : place.location?.lat() ?? null,
          lng       : place.location?.lng() ?? null,
          components,
        });
      } catch {
        // Si fetchFields falla, pasar solo el texto de predicción
        onSelectRef.current({
          formatted_address: e.placePrediction?.text?.toString() ?? "",
          lat: null, lng: null, components: [],
        });
      }
    });

    containerRef.current.appendChild(el);
    elementRef.current = el;

    return () => {
      elementRef.current = null;
    };
  }, [isLoaded, placeholder]);

  // ── Sin API key: input de texto simple ──────────────────────────────────
  if (!hasApiKey) {
    return (
      <div className={`relative ${className}`}>
        <input
          type="text"
          placeholder="Escribe la dirección de tu empresa o instalación"
          className="input-field"
          onChange={(e) =>
            onSelect?.({ formatted_address: e.target.value, lat: null, lng: null, components: [] })
          }
        />
      </div>
    );
  }

  // ── Error de carga del SDK ───────────────────────────────────────────────
  if (loadError) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <AlertCircle size={15} className="text-red-400" />
        </div>
        <input
          type="text"
          placeholder="Escribe tu dirección (autocompletado no disponible)"
          className="input-field pl-9"
          onChange={(e) =>
            onSelectRef.current({ formatted_address: e.target.value, lat: null, lng: null, components: [] })
          }
        />
        <p className="text-xs text-red-500 mt-1">{loadError.message}</p>
      </div>
    );
  }

  // ── Cargando SDK ─────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border border-ui-border bg-ui-bg-alt text-ink-muted text-sm ${className}`}>
        <Loader2 size={14} className="animate-spin flex-shrink-0" />
        <span>Cargando autocompletado...</span>
      </div>
    );
  }

  // ── PlaceAutocompleteElement activo ──────────────────────────────────────
  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="w-full" />

      {/* Botón limpiar — solo visible cuando hay selección */}
      {value && (
        <button
          type="button"
          onClick={() => {
            if (elementRef.current) elementRef.current.value = "";
            onClear?.();
          }}
          aria-label="Limpiar dirección"
          className="absolute inset-y-0 right-3 flex items-center text-ink-muted hover:text-ink transition-colors z-10"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
