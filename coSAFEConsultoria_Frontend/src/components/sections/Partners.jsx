import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "../ui/SectionLabel.jsx";

gsap.registerPlugin(ScrollTrigger);

const CERTS = [
  { src: "/img/Certificacines/certificacion-stps-cosafe.png",              alt: "STPS" },
  { src: "/img/Certificacines/cosafe-certificacion-REPSE.png",             alt: "REPSE" },
  { src: "/img/Certificacines/cosafe-certificacion-conocer.png",           alt: "CONOCER" },
  { src: "/img/Certificacines/cosafe-certificacion-proteccioncivil.png",   alt: "Protección Civil" },
  { src: "/img/Certificacines/cosafe-certificacion-reconocer.png",         alt: "RECONOCER" },
  { src: "/img/Certificacines/cosafe-certificacion-527909.png",            alt: "Certificación" },
];

const ALLIES = [
  { src: "/img/Aliados/2560px-SEMARNAT_Logo_2019 1.png",                   alt: "SEMARNAT" },
  { src: "/img/Aliados/OrozcoLab_Laboratorio_Ema_Profepa_Conagua 1.png",   alt: "PROFEPA / CONAGUA" },
  { src: "/img/Aliados/Logo-ISO-500x283-removebg-preview 1.png",           alt: "ISO" },
  { src: "/img/Aliados/cosafe-Desarrollo-Urbano-y-Medio-Ambiente.png",     alt: "Desarrollo Urbano" },
  { src: "/img/Aliados/cmsDhsLogoComp_WhiteText 1.png",                    alt: "DHS" },
];

const ALLIES_LOOP = [...ALLIES, ...ALLIES];

export default function Partners() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".partners-header",
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" } }
    );
    gsap.fromTo(
      ".cert-item",
      { autoAlpha: 0, scale: 0.85, y: 16, rotate: -2 },
      { autoAlpha: 1, scale: 1, y: 0, rotate: 0, stagger: 0.07, duration: 0.55, ease: "back.out(1.8)",
        scrollTrigger: { trigger: ".certs-grid", start: "top 84%" } }
    );

    // Stagger the section label & heading lines
    gsap.fromTo(
      ".partners-line",
      { autoAlpha: 0, x: -20 },
      { autoAlpha: 1, x: 0, stagger: 0.1, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 84%" } }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-ui-bg-alt border-y border-ui-border overflow-hidden">

      {/* ── Header + Certificaciones ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-14 pb-12">

        <div className="partners-header text-center mb-10 opacity-0">
          <div className="partners-line opacity-0">
            <SectionLabel>Reconocimientos y Aliados</SectionLabel>
          </div>
          <h2 className="partners-line opacity-0 font-heading font-bold text-display-md text-ink mt-4 mb-2">
            Respaldados por las autoridades
          </h2>
          <p className="partners-line opacity-0 text-ink-mid text-sm max-w-md mx-auto">
            Certificaciones, reconocimientos y alianzas que garantizan la calidad de nuestro trabajo.
          </p>
        </div>

        {/* Label */}
        <p className="text-center text-ink-muted text-xs font-mono uppercase tracking-widest mb-6">
          Certificaciones y registros
        </p>

        {/* Grid de certificaciones */}
        <div className="certs-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CERTS.map((item) => (
            <div
              key={item.alt}
              className="cert-item card-shimmer opacity-0 group aspect-square rounded-xl border border-ui-border bg-white shadow-sm hover:shadow-card-hover hover:border-brand-muted hover:-translate-y-1.5 transition-all duration-300 overflow-hidden relative"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => { e.target.parentElement.style.display = "none"; }}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-brand-green/0 group-hover:bg-brand-green/5 transition-all duration-300 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Allies — Infinite Marquee Strip ───────────────────────────── */}
      <div className="relative bg-brand-forest py-10 overflow-hidden">

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none animate-divider-pulse"
          style={{ background: "linear-gradient(to right, transparent, rgba(1,167,88,0.5), transparent)" }}
        />

        {/* Radial glow center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(1,167,88,0.07) 0%, transparent 70%)" }}
        />

        {/* Label */}
        <p className="relative z-10 text-center text-white/40 text-xs font-mono uppercase tracking-widest mb-8">
          Instituciones y aliados estratégicos
        </p>

        {/* Marquee */}
        <div className="relative">
          {/* Fade izquierda */}
          <div
            className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #0f2d1a 0%, transparent 100%)" }}
          />
          {/* Fade derecha */}
          <div
            className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #0f2d1a 0%, transparent 100%)" }}
          />

          <div className="overflow-hidden">
            <div className="animate-marquee items-center">
              {ALLIES_LOOP.map((item, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 mx-12 flex items-center justify-center h-12 group"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-7 sm:h-9 max-w-[100px] sm:max-w-[140px] w-auto object-contain brightness-0 invert opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    onError={(e) => { e.target.parentElement.style.display = "none"; }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none animate-divider-pulse"
          style={{ background: "linear-gradient(to right, transparent, rgba(1,167,88,0.5), transparent)", animationDelay: "1.5s" }}
        />
      </div>

    </section>
  );
}
