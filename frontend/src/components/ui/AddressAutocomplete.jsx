import { useEffect, useRef } from "react";
import { MapPin, X, Loader2, AlertCircle } from "lucide-react";
import { useGoogleMaps } from "../../hooks/useGoogleMaps.js";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

/**
 * Input de dirección con Google Places Autocomplete.
 *
 * Props:
 *   value        — formatted_address seleccionado (string). Controla el display del input.
 *   onSelect(d)  — se llama con { formatted_address, lat, lng, components } al elegir.
 *   onClear()    — se llama cuando el usuario borra la selección.
 *   placeholder  — texto de placeholder
 *   className    — clases extra para el input
 *
 * Importante:
 *   El input es "semi-controlado": Google Autocomplete maneja su valor interno,
 *   pero sincronizamos desde `value` para reflejar el estado del padre
 *   (ej: cuando el padre resetea el formulario).
 */
export default function AddressAutocomplete({
  value       = "",
  onSelect,
  onClear,
  placeholder = "Busca la dirección de tu empresa o instalación...",
  className   = "",
}) {
  const inputRef        = useRef(null);
  const autocompleteRef = useRef(null);
  // Ref para el callback: evita recrear el Autocomplete cuando onSelect cambia en el padre
  const onSelectRef     = useRef(onSelect);

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  const hasApiKey = Boolean(API_KEY);
  const { isLoaded, loadError } = useGoogleMaps(hasApiKey ? API_KEY : null);

  // Sin API key: input de texto simple, sin autocompletado
  if (!hasApiKey) {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <MapPin size={15} className="text-ink-mid" />
        </div>
        <input
          type="text"
          placeholder="Escribe la dirección de tu empresa o instalación"
          className={`input-field pl-9 ${className}`}
          onChange={(e) =>
            onSelect?.({
              formatted_address: e.target.value,
              lat: null, lng: null, components: [],
            })
          }
        />
      </div>
    );
  }

  // Sincroniza el input con el estado del padre (reset de formulario, etc.)
  useEffect(() => {
    if (!inputRef.current) return;
    // Solo limpiar — no sobreescribir lo que el usuario escribe
    if (!value) {
      inputRef.current.value = "";
    }
  }, [value]);

  // Inicializa Google Places Autocomplete una vez que el script está listo
  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields               : ["formatted_address", "address_components", "geometry"],
      types                : ["address"],
      componentRestrictions: { country: "mx" },
    });

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();

      // El usuario presionó Enter sin seleccionar sugerencia
      if (!place?.geometry?.location) return;

      onSelectRef.current({
        formatted_address: place.formatted_address ?? "",
        lat       : place.geometry.location.lat(),
        lng       : place.geometry.location.lng(),
        components: place.address_components ?? [],
      });
    });

    autocompleteRef.current = ac;

    return () => {
      // Limpiar listeners al desmontar para evitar memory leaks
      window.google?.maps?.event?.clearInstanceListeners(ac);
      autocompleteRef.current = null;
    };
  }, [isLoaded]);

  // Borrar selección: limpiar input visualmente y notificar al padre
  const handleClear = (e) => {
    e.preventDefault();
    if (inputRef.current) inputRef.current.value = "";
    onClear();
    // Enfocar el input para que el usuario pueda escribir de nuevo
    inputRef.current?.focus();
  };

  // ── Error de carga ───────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <AlertCircle size={15} className="text-red-400" />
        </div>
        <input
          type="text"
          placeholder="Escribe tu dirección (autocompletado no disponible)"
          className={`input-field pl-9 ${className}`}
          onChange={(e) =>
            onSelectRef.current({
              formatted_address: e.target.value,
              lat       : null,
              lng       : null,
              components: [],
            })
          }
        />
        <p className="text-xs text-red-500 mt-1">{loadError.message}</p>
      </div>
    );
  }

  // ── Input con Autocomplete ────────────────────────────────────────────────
  return (
    <div className="relative">
      {/* Icono izquierdo */}
      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10">
        {isLoaded ? (
          <MapPin size={15} className="text-brand-green" />
        ) : (
          <Loader2 size={15} className="text-ink-muted animate-spin" />
        )}
      </div>

      {/* Input — Google Autocomplete se adjunta a este elemento */}
      <input
        ref={inputRef}
        type="text"
        autoComplete="off"
        disabled={!isLoaded}
        defaultValue={value}
        placeholder={isLoaded ? placeholder : "Cargando autocompletado..."}
        className={`input-field pl-9 pr-9 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity ${className}`}
      />

      {/* Botón limpiar — solo visible cuando hay una selección */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar dirección"
          className="absolute inset-y-0 right-3 flex items-center text-ink-muted hover:text-ink transition-colors z-10"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
