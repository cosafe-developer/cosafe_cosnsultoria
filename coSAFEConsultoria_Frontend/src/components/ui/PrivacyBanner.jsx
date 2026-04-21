/**
 * PrivacyBanner — Aviso de cookies y servicios de terceros.
 *
 * Aplica:
 *  - LFPDPPP (México): informa sobre el tratamiento de datos personales.
 *  - ePrivacy Directive (UE): informa sobre servicios de terceros que
 *    pueden transferir datos (Google Fonts, Google Maps).
 *  - GDPR Art. 13 (UE): transparencia en el punto de recolección de datos.
 *
 * Se muestra una sola vez; la aceptación se persiste en localStorage.
 * No bloquea el uso del sitio (banner informativo, no modal forzado),
 * lo cual es apropiado para un sitio institucional B2B sin tracking
 * publicitario ni cookies de sesión propias.
 */
import { useState, useEffect } from "react";
import { X, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "cosafe_privacy_accepted";

export default function PrivacyBanner() {
  const [visible, setVisible] = useState(false);

  // Only show if the user hasn't already acknowledged
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage blocked (private mode edge case) — just show the banner
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }

    // Google Consent Mode v2 — actualizar a "granted" en tiempo real.
    // GA4 cambia de cookieless mode a full tracking sin recargar la página.
    try {
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", { analytics_storage: "granted" });
      }
    } catch { /* noop */ }

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de privacidad"
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-[#0f2d1a] border-t border-white/10
        shadow-[0_-4px_24px_rgba(0,0,0,0.25)]
        transition-transform duration-500
        /* Safe-area for iOS home-bar */
        pb-[env(safe-area-inset-bottom)]
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3">

        {/* Icon + text */}
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <ShieldCheck
            size={16}
            className="text-[#01A758] flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-white/70 text-xs leading-relaxed">
            Este sitio utiliza&nbsp;
            <strong className="text-white/90 font-medium">Google Fonts</strong>
            &nbsp;y&nbsp;
            <strong className="text-white/90 font-medium">Google Maps</strong>
            &nbsp;para mejorar tu experiencia. Estos servicios de terceros pueden
            transferir datos técnicos (como tu IP) a servidores de Google.
            Al usar el sitio aceptas nuestro&nbsp;
            <a
              href="#aviso-privacidad"
              onClick={accept}
              className="text-[#01A758] underline underline-offset-2 hover:text-[#4ade80] transition-colors"
            >
              Aviso de Privacidad
            </a>
            .
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={accept}
            className="
              px-4 py-1.5 rounded-pill
              bg-[#01A758] text-white text-xs font-heading font-semibold
              hover:bg-[#016B3E] active:scale-95
              transition-all duration-200
              touch-manipulation
            "
          >
            Entendido
          </button>
          <button
            onClick={accept}
            aria-label="Cerrar aviso"
            className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/10 transition-all duration-200 touch-manipulation"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
