import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Menu, X, Phone } from "lucide-react";
import Button from "./ui/Button.jsx";

// Navbar height constants — keep these in sync with Hero's pt-[104px] lg:pt-[116px]
// Mobile/tablet: 40px micro-bar (hidden on mobile) + 64px main bar = 104px on desktop
// On mobile (lg:hidden micro-bar), navbar is just the 64px bar + 40px bar total = 104px
// But micro-bar is hidden on mobile so mobile navbar = 64px → hero uses pt-[64px] md:pt-[104px]
const MOBILE_MENU_TOP = "top-16"; // 64px — just the main bar height on mobile

const NAV_LINKS = [
  { label: "Inicio",      href: "#inicio" },
  { label: "Servicios",   href: "#servicios" },
  { label: "coSAFE SOFT", href: "#cosafe-soft", badge: "Nuevo" },
  { label: "NOMs / DOF",  href: "#noms" },
  { label: "Nosotros",    href: "#nosotros" },
  { label: "Contacto",    href: "#contacto" },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

export default function Navbar() {
  const navRef    = useRef(null);
  const location  = useLocation();
  const navigate  = useNavigate();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [activeHref, setActiveHref] = useState("#inicio");

  useGSAP(() => {
    gsap.fromTo(
      navRef.current,
      { y: -72, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", delay: 0.15 }
    );
    gsap.fromTo(
      ".nav-item-anim",
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.4, ease: "power2.out", delay: 0.45 }
    );
  }, { scope: navRef });

  useEffect(() => {
    const onScroll = () => {
      const sy    = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(sy > 30);
      setProgress(total > 0 ? (sy / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Intersection observer — active section
  useEffect(() => {
    const observers = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveHref(`#${id}`); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const go = (href) => {
    setMenuOpen(false);
    if (location.pathname === "/") {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate({ pathname: "/", hash: href });
    }
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-ui-border shadow-[0_1px_12px_rgba(0,0,0,0.07)]"
            : "bg-white border-b border-transparent"
        }`}
        style={{ opacity: 0 }}
      >
        {/* Top micro-bar — desktop only */}
        <div className="hidden lg:flex items-center justify-between bg-brand-forest text-white px-8 py-1.5 text-xs font-mono">
          <span className="text-white/60">
            Consultoría EHSS · Matamoros, Tamaulipas
          </span>
          <a href="tel:+528683546152" className="flex items-center gap-1.5 text-white/80 hover:text-brand-green transition-colors">
            <Phone size={11} />
            +52 868 354 6152
          </a>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => go("#inicio")}
              className="nav-item-anim flex items-center group flex-shrink-0"
              style={{ opacity: 0 }}
            >
              <img
                src="/img/cosafe-consultoria-ehss.png"
                alt="coSAFE Consultoría"
                className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
              {NAV_LINKS.map((link) => {
                const isActive = activeHref === link.href;
                return (
                  <button
                    key={link.href}
                    onClick={() => go(link.href)}
                    className={`nav-item-anim nav-link flex items-center gap-1.5 group relative ${isActive ? "nav-link-active" : ""}`}
                    style={{ opacity: 0 }}
                  >
                    {link.label}
                    {link.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-brand-light text-brand-green text-[0.6rem] font-mono font-medium leading-none border border-brand-muted">
                        {link.badge}
                      </span>
                    )}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-0.5 bg-brand-green rounded-full transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3 nav-item-anim" style={{ opacity: 0 }}>
              <Button variant="primary" onClick={() => go("#contacto")} className="text-xs px-4 xl:px-5 py-2.5">
                Solicitar diagnóstico
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-ink-mid hover:bg-ui-bg-alt active:bg-ui-bg-alt transition-all touch-manipulation"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer — anchored just below the 64px main bar */}
        <div
          className={`absolute ${MOBILE_MENU_TOP} left-0 right-0 bg-white border-b border-ui-border shadow-card transition-transform duration-300 ${
            menuOpen ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          <nav className="flex flex-col gap-1 p-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className={`flex items-center justify-between text-left px-4 py-3.5 rounded-xl transition-all duration-200 touch-manipulation ${
                  activeHref === link.href
                    ? "text-brand-green bg-brand-light font-semibold"
                    : "text-ink-body hover:text-brand-green hover:bg-brand-light"
                }`}
              >
                <span className="font-body text-sm">{link.label}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-green text-[0.6rem] font-mono border border-brand-muted">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="px-4 pb-5">
            <Button variant="primary" onClick={() => go("#contacto")} className="w-full justify-center py-3.5">
              Solicitar diagnóstico
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
