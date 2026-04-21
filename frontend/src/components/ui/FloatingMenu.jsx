import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Phone, BookOpen, Zap, FileText, X } from "lucide-react";

// ── Menu options ──────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    id:     "call",
    label:  "Llamar a un consultor",
    desc:   "+52 868 354 6152",
    Icon:   Phone,
    href:   "tel:+528683546152",
    type:   "tel",
    accent: "#01A758",
    bg:     "#e8f5ed",
    border: "#c6e8d5",
  },
  {
    id:     "dof",
    label:  "Consultar DOF",
    desc:   "Diario Oficial de la Federación",
    Icon:   BookOpen,
    href:   "/consultadof",
    type:   "route",
    accent: "#1a56db",
    bg:     "#eff4ff",
    border: "#c3d5ff",
  },
  {
    id:     "soft",
    label:  "Usar coSAFE SOFT",
    desc:   "Plataforma en la nube",
    Icon:   Zap,
    href:   "https://cosafesoft.com",
    type:   "external",
    accent: "#01A758",
    bg:     "#e8f5ed",
    border: "#c6e8d5",
    badge:  "Nuevo",
  },
  {
    id:     "quote",
    label:  "Quiero cotizar",
    desc:   "Diagnóstico gratuito",
    Icon:   FileText,
    href:   "#contacto",
    type:   "scroll",
    accent: "#0f2d1a",
    bg:     "#f7faf8",
    border: "#dde8e3",
  },
];

// ── Arrow icon ────────────────────────────────────────────────────────────────
function ArrowRight({ color }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5"
      style={{ color }}
    >
      <path
        d="M3 7h8M7 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FloatingMenu() {
  const [open, setOpen]   = useState(false);
  const wrapRef           = useRef(null);
  const location          = useLocation();
  const navigate          = useNavigate();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Close on scroll (optional — keeps UI tidy)
  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [open]);

  const handleItem = (item) => {
    setOpen(false);
    if (item.type === "tel") {
      window.location.href = item.href;
    } else if (item.type === "external") {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else if (item.type === "route") {
      navigate(item.href);
    } else if (item.type === "scroll") {
      if (location.pathname === "/") {
        const el = document.querySelector(item.href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate({ pathname: "/", hash: item.href });
      }
    }
  };

  return (
    <div
      ref={wrapRef}
      className="fixed bottom-6 right-4 sm:right-5 lg:right-7 z-40"
    >
      {/* ── Toggle button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar menú" : "Abrir menú de contacto"}
        aria-expanded={open}
        className={`
          relative flex items-center justify-center
          w-14 h-14 sm:w-[60px] sm:h-[60px]
          rounded-full
          transition-all duration-300
          active:scale-95 focus:outline-none
          ${open
            ? "shadow-[0_6px_32px_rgba(1,167,88,0.45)]"
            : "shadow-[0_4px_24px_rgba(1,167,88,0.32)] hover:shadow-[0_6px_36px_rgba(1,167,88,0.48)] hover:scale-110"
          }
        `}
      >
        {/* SVG icon — visible when closed */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            open ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0"
          }`}
        >
          <img
            src="/menu_float_button_cosafe.svg"
            alt="coSAFE menú"
            className="w-full h-full rounded-full"
            draggable={false}
          />
        </span>

        {/* Close X — visible when open */}
        <span
          className={`absolute inset-0 flex items-center justify-center rounded-full bg-[#0f2d1a] transition-all duration-300 ${
            open ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"
          }`}
        >
          <X size={20} className="text-white" />
        </span>

        {/* Subtle pulse ring — only when closed */}
        {!open && (
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              animation: "floatingPulse 2.8s ease-in-out infinite",
              background: "rgba(1,167,88,0.25)",
            }}
          />
        )}
      </button>

      {/* ── Dropdown menu ── */}
      <div
        role="menu"
        aria-hidden={!open}
        className={`
          absolute bottom-full right-0 mb-3
          w-72 sm:w-80
          bg-white rounded-2xl border border-[#dde8e3]
          shadow-[0_8px_40px_rgba(0,0,0,0.11),0_2px_8px_rgba(0,0,0,0.06)]
          overflow-hidden
          transition-all duration-300 origin-bottom-right
          ${open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#f7faf8] border-b border-[#dde8e3]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#01A758] animate-pulse" />
          <span className="text-xs font-mono text-[#4a6358] font-medium tracking-wider">
            ¿En qué te ayudamos?
          </span>
        </div>

        {/* Items */}
        <div className="p-2 flex flex-col gap-0.5">
          {MENU_ITEMS.map((item, i) => {
            const { Icon } = item;
            return (
              <button
                key={item.id}
                role="menuitem"
                onClick={() => handleItem(item)}
                className="group flex items-center gap-3.5 w-full text-left px-3 py-3 rounded-xl transition-all duration-200 hover:bg-[#f7faf8] active:scale-[0.98]"
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              >
                {/* Icon pill */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 group-hover:scale-110"
                  style={{
                    background:   item.bg,
                    borderColor:  item.border,
                    color:        item.accent,
                  }}
                >
                  <Icon size={16} />
                </div>

                {/* Label + description */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-heading font-semibold text-[#0f1c14] truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className="flex-shrink-0 px-1.5 py-0.5 rounded-full text-[0.58rem] font-mono border"
                        style={{
                          background:  "#e8f5ed",
                          borderColor: "#c6e8d5",
                          color:       "#01A758",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#7a9484] font-body leading-snug">
                    {item.desc}
                  </span>
                </div>

                {/* Arrow */}
                <ArrowRight color={item.accent} />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[#dde8e3] bg-[#f7faf8]">
          <p className="text-[0.65rem] font-mono text-[#a8bfb3] text-center tracking-wide">
            coSAFE Consultoría EHSS · Matamoros, Tam.
          </p>
        </div>
      </div>
    </div>
  );
}
