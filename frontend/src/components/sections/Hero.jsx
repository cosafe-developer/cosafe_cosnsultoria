import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Shield, Leaf, HeartPulse, CheckCircle2 } from "lucide-react";
import Button from "../ui/Button.jsx";
import SectionLabel from "../ui/SectionLabel.jsx";

gsap.registerPlugin(ScrollTrigger);

const HERO_SLIDES = [
  { src: "/img/carousel-1.jpg", alt: "Consultoría ambiental industrial" },
  { src: "/img/carousel-2.jpg", alt: "Seguridad industrial coSAFE" },
];

const TRUST_ITEMS = [
  { Icon: Shield,     label: "Certificados STPS",   sublabel: "Cumplimiento normativo" },
  { Icon: Leaf,       label: "Gestión Ambiental",    sublabel: "SEMARNAT & PROFEPA" },
  { Icon: HeartPulse, label: "Medicina del Trabajo", sublabel: "NOM-035 & IMSS" },
];

const CHECKS = [
  "Auditorías NOM-STPS",
  "ISO 14001 & ISO 45001",
  "Trámites SEMARNAT",
  "PIPC & Protección Civil",
];

export default function Hero({ content }) {
  const containerRef = useRef(null);
  const imageRef     = useRef(null);
  const [slide, setSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(".hero-label",  { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" })
      .fromTo(".hero-title",  { autoAlpha: 0, y: 36, skewY: 1 }, { autoAlpha: 1, y: 0, skewY: 0, duration: 0.8, ease: "power3.out" }, "-=0.2")
      .fromTo(".hero-body",   { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")
      .fromTo(".hero-checks", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.4, ease: "power2.out" }, "-=0.2")
      .fromTo(".hero-ctas",   { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.1")
      .fromTo(".hero-image",  { autoAlpha: 0, x: 50, scale: 0.96 }, { autoAlpha: 1, x: 0, scale: 1, duration: 1, ease: "power3.out" }, "-=0.7")
      .fromTo(".trust-item",  { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.5, ease: "power2.out" }, "-=0.3");

    // Floating badges
    gsap.to(".hero-badge-float",   { y: -8, duration: 3,   ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.5 });
    gsap.to(".hero-badge-float-2", { y:  6, duration: 4,   ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2 });

    // Parallax scroll — only on non-touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch && imageRef.current) {
      gsap.to(imageRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Trust strip idle pulse
    gsap.to(".trust-item", {
      scale: 1.02,
      duration: 1.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.6, repeat: -1 },
      delay: 2,
    });
  }, { scope: containerRef });

  const hero = content?.hero ?? {};
  const go   = (href) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="inicio"
      ref={containerRef}
      className="relative bg-white overflow-hidden pt-16 lg:pt-[104px]"
    >
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />

      {/* ── Ambient orbs — responsive sizes ─────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -left-20 sm:-top-32 sm:-left-32 w-56 h-56 sm:w-80 sm:h-80 lg:w-[480px] lg:h-[480px] rounded-full blur-3xl animate-orb-1"
          style={{ background: "radial-gradient(circle, rgba(1,167,88,0.13) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-32 sm:-right-44 w-64 h-64 sm:w-96 sm:h-96 lg:w-[560px] lg:h-[560px] rounded-full blur-3xl animate-orb-2"
          style={{ background: "radial-gradient(circle, rgba(1,107,62,0.09) 0%, transparent 70%)", animationDelay: "3s" }}
        />
        <div
          className="absolute -bottom-20 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-[400px] lg:h-[400px] rounded-full blur-3xl animate-orb-3"
          style={{ background: "radial-gradient(circle, rgba(1,167,88,0.07) 0%, transparent 70%)", animationDelay: "1.5s" }}
        />
      </div>

      {/* Right green wash */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(1,167,88,0.04) 100%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10 lg:py-20">

          {/* ── Left column ──────────────────────────────────────────── */}
          <div>
            <div className="hero-label mb-5 sm:mb-6" style={{ opacity: 0 }}>
              <SectionLabel>Consultoría EHSS · México</SectionLabel>
            </div>

            <h1 className="hero-title font-heading font-bold text-display-xl text-ink mb-4 sm:mb-5" style={{ opacity: 0 }}>
              {hero.headline ?? "Seguridad, Salud"}
              <br />
              <span className="gradient-brand">
                {hero.subheadline ?? "y Ambiente"}
              </span>
              <br />
              <span className="text-ink-mid font-light text-display-md">
                para la industria mexicana
              </span>
            </h1>

            <p className="hero-body text-ink-mid text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg" style={{ opacity: 0 }}>
              {hero.body ?? "Consultoría especializada en EHS. Cumplimiento normativo, gestión ambiental y cultura de seguridad para empresas de manufactura, servicios e industria."}
            </p>

            {/* Checkmarks */}
            <ul className="mb-6 sm:mb-8 grid grid-cols-2 gap-y-2 sm:gap-y-2.5 gap-x-3 sm:gap-x-4">
              {CHECKS.map((c) => (
                <li key={c} className="hero-checks flex items-center gap-2 text-sm text-ink-mid" style={{ opacity: 0 }}>
                  <CheckCircle2 size={15} className="text-brand-green flex-shrink-0" />
                  <span className="leading-tight">{c}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="hero-ctas flex flex-col sm:flex-row items-start gap-3" style={{ opacity: 0 }}>
              <Button variant="primary" onClick={() => go("#servicios")} className="w-full sm:w-auto px-7 py-3.5 text-sm justify-center">
                Explorar servicios <ArrowRight size={15} />
              </Button>
              <Button variant="outline" onClick={() => go("#cosafe-soft")} className="w-full sm:w-auto px-7 py-3.5 text-sm justify-center">
                Ver coSAFE SOFT
              </Button>
            </div>
          </div>

          {/* ── Right column — image ──────────────────────────────── */}
          <div className="hero-image relative mt-6 lg:mt-0" style={{ opacity: 0 }} ref={imageRef}>
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_48px_rgba(0,0,0,0.15)] aspect-[4/3]">
              {HERO_SLIDES.map((s, i) => (
                <img
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                  style={{
                    opacity:    slide === i ? 1 : 0,
                    transform:  slide === i ? "scale(1.04)" : "scale(1)",
                    transition: "opacity 1s, transform 6s ease-out",
                  }}
                  onError={(e) => (e.target.src = "/img/about-1.jpg")}
                />
              ))}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent pointer-events-none" />
              {/* Slide dots */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    aria-label={`Ir a imagen ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${slide === i ? "bg-white w-8" : "bg-white/40 w-5"}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating stat card — top left */}
            <div className="hero-badge-float absolute -top-4 -left-3 sm:-top-5 sm:-left-5 bg-white rounded-xl shadow-card-hover border border-ui-border px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-brand-green" />
              </div>
              <div>
                <div className="font-heading font-bold text-ink text-sm leading-none">10+ años</div>
                <div className="text-ink-muted text-xs mt-0.5">de experiencia</div>
              </div>
            </div>

            {/* Floating stat card — bottom right */}
            <div className="hero-badge-float-2 absolute -bottom-4 -right-3 sm:-bottom-5 sm:-right-5 z-10 bg-white rounded-xl shadow-card-hover border border-ui-border px-3 sm:px-4 py-2 sm:py-3">
              <div className="font-heading font-bold text-brand-green text-xl leading-none">200+</div>
              <div className="text-ink-muted text-xs mt-0.5">empresas atendidas</div>
            </div>

            {/* Decorative dashed ring — hidden on very small screens */}
            <div
              className="hidden sm:block absolute -inset-3 rounded-2xl border border-brand-green/10 pointer-events-none animate-spin-slow"
              style={{ borderStyle: "dashed" }}
            />

            {/* Green accent bar */}
            <div className="absolute -bottom-1 left-6 right-6 sm:left-8 sm:right-8 h-1 bg-gradient-brand rounded-full animate-divider-pulse" />
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="border-t border-ui-border bg-ui-bg-alt">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {TRUST_ITEMS.map(({ Icon, label, sublabel }) => (
              <div key={label} className="trust-item flex items-center justify-center gap-3 opacity-0">
                <div className="w-9 h-9 rounded-lg bg-white border border-ui-border flex items-center justify-center shadow-card flex-shrink-0">
                  <Icon size={17} className="text-brand-green" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="font-heading font-semibold text-ink text-sm">{label}</div>
                  <div className="text-ink-muted text-xs">{sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
