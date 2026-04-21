import { useEffect, useRef, useState, useCallback } from "react";
import { X, Loader2, AlertCircle, MapPin } from "lucide-react";
import { useGoogleMaps } from "../../hooks/useGoogleMaps.js";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

/**
 * Input de dirección con autocompletado programático (AutocompleteSuggestion API).
 * Usa un <input> estándar con dropdown custom — control total sobre el estilo.
 *
 * Props:
 *   value        — formatted_address seleccionado. Controla el display y el botón limpiar.
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
  const [query, setSuggQuery]     = useState("");
  const [suggestions, setSugg]    = useState([]);
  const [isOpen, setIsOpen]       = useState(false);
  const [fetching, setFetching]   = useState(false);
  const sessionTokenRef           = useRef(null);
  const timerRef                  = useRef(null);
  const wrapperRef                = useRef(null);
  const onSelectRef               = useRef(onSelect);

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  // Sincroniza reset desde el padre (limpiar formulario)
  useEffect(() => {
    if (!value) setSuggQuery("");
  }, [value]);

  const hasApiKey = Boolean(API_KEY);
  const { isLoaded, loadError } = useGoogleMaps(hasApiKey ? API_KEY : null);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = useCallback(async (input) => {
    if (!isLoaded || input.length < 3) {
      setSugg([]);
      setIsOpen(false);
      return;
    }
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
    setFetching(true);
    try {
      const { suggestions: results } =
        await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: sessionTokenRef.current,
          componentRestrictions: { country: "mx" },
        });
      setSugg(results ?? []);
      setIsOpen((results ?? []).length > 0);
    } catch {
      setSugg([]);
      setIsOpen(false);
    } finally {
      setFetching(false);
    }
  }, [isLoaded]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSuggQuery(val);
    clearTimeout(timerRef.current);
    if (!val) {
      setSugg([]);
      setIsOpen(false);
      onClear?.();
      return;
    }
    timerRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelect = async (suggestion) => {
    setIsOpen(false);
    setFetching(true);
    const prediction = suggestion.placePrediction;
    const text = prediction?.text?.toString() ?? "";
    setSuggQuery(text);
    try {
      const place = prediction.toPlace();
      await place.fetchFields({
        fields: ["formattedAddress", "addressComponents", "location"],
      });
      sessionTokenRef.current = null; // nueva sesión para la próxima búsqueda
      const components = (place.addressComponents ?? []).map((c) => ({
        long_name : c.longText  ?? "",
        short_name: c.shortText ?? "",
        types     : c.types     ?? [],
      }));
      onSelectRef.current({
        formatted_address: place.formattedAddress ?? text,
        lat       : place.location?.lat() ?? null,
        lng       : place.location?.lng() ?? null,
        components,
      });
    } catch {
      onSelectRef.current({ formatted_address: text, lat: null, lng: null, components: [] });
    } finally {
      setFetching(false);
    }
  };

  const handleClear = () => {
    setSuggQuery("");
    setSugg([]);
    setIsOpen(false);
    sessionTokenRef.current = null;
    onClear?.();
  };

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
            onSelect?.({ formatted_address: e.target.value, lat: null, lng: null, components: [] })
          }
        />
        <p className="text-xs text-red-500 mt-1">{loadError.message}</p>
      </div>
    );
  }

  // ── Cargando SDK ─────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border border-ui-border bg-ui-bg-alt text-ink-muted text-sm ${className}`}>
        <Loader2 size={14} className="animate-spin flex-shrink-0" />
        <span>Cargando autocompletado...</span>
      </div>
    );
  }

  // ── Input con autocompletado programático ────────────────────────────────
  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          {fetching
            ? <Loader2 size={14} className="animate-spin text-ink-muted" />
            : <MapPin  size={14} className="text-ink-muted" />
          }
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="input-field pl-9 pr-8"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />
        {(query || value) && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar dirección"
            className="absolute inset-y-0 right-3 flex items-center text-ink-muted hover:text-ink transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown de sugerencias */}
      {isOpen && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white border border-ui-border rounded-xl shadow-card overflow-hidden"
        >
          {suggestions.map((s, i) => {
            const pred      = s.placePrediction;
            const main      = pred?.mainText?.toString()      ?? "";
            const secondary = pred?.secondaryText?.toString() ?? "";
            return (
              <li key={i} role="option">
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-ui-bg-alt transition-colors flex items-start gap-3"
                >
                  <MapPin size={13} className="text-brand-green mt-0.5 flex-shrink-0" />
                  <span className="text-sm leading-snug">
                    <span className="font-medium text-ink">{main}</span>
                    {secondary && (
                      <span className="text-ink-muted"> {secondary}</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
