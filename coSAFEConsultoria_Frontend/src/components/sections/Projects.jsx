import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrendingUp, CalendarDays, Building2 } from "lucide-react";
import SectionLabel from "../ui/SectionLabel.jsx";

gsap.registerPlugin(ScrollTrigger);

/* ── Category styles ──────────────────────────────────────────────────────── */
const CAT_STYLE = {
  Seguridad: { pill: "bg-brand-light text-brand-green border-brand-muted", accent: "#01A758" },
  Ambiental: { pill: "bg-amber-50 text-amber border-amber/30",             accent: "#d97706" },
  Salud:     { pill: "bg-blue-50 text-steel border-steel-border",          accent: "#1a56db" },
};

const METRICS = [
  { value: "3",    label: "Casos destacados" },
  { value: "100%", label: "Tasa de éxito" },
  { value: "10+",  label: "Años de respaldo" },
];

/* ── Single project card ─────────────────────────────────────────────────── */
function ProjectCard({ project, index }) {
  const cat    = CAT_STYLE[project.category] ?? CAT_STYLE.Seguridad;
  const num    = String(index + 1).padStart(2, "0");
  const cardRef = useRef(null);

  // Subtle tilt — only on pointer-precise (non-touch) devices
  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const onMouseMove = (e) => {
    if (isTouch) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotX = ((y - rect.height / 2) / rect.height) * -4;
    const rotY = ((x - rect.width  / 2) / rect.width)  *  4;
    gsap.to(card, { rotateX: rotX, rotateY: rotY, transformPerspective: 900, duration: 0.3, ease: "power1.out" });
  };
  const onMouseLeave = () => {
    if (isTouch) return;
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
  };

  return (
    <article
      ref={cardRef}
      className="gsap-proj card-shimmer opacity-0 group relative flex flex-col bg-white rounded-card border border-ui-border shadow-card hover:shadow-card-hover hover:-translate-y-1.5 hover:border-brand-muted transition-all duration-300 overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* Accent top bar — animated width on hover */}
      <div
        className="h-1 w-full flex-shrink-0 transition-all duration-500 group-hover:h-1.5"
        style={{ background: cat.accent }}
      />

      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Row: category badge + year */}
        <div className="flex items-center justify-between">
          <span className={`text-[0.65rem] font-mono font-medium px-2.5 py-1 rounded-full border ${cat.pill}`}>
            {project.category}
          </span>
          <div className="flex items-center gap-1 text-ink-subtle text-[0.65rem] font-mono">
            <CalendarDays size={11} />
            {project.year}
          </div>
        </div>

        {/* Number + title */}
        <div className="flex items-start gap-3">
          <span
            className="font-heading font-bold text-3xl leading-none select-none flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110 origin-top-left"
            style={{ color: cat.accent + "30" }}
            aria-hidden="true"
          >
            {num}
          </span>
          <h3 className="font-heading font-semibold text-ink text-[0.95rem] leading-snug">
            {project.title}
          </h3>
        </div>

        {/* Client */}
        <div className="flex items-center gap-1.5 text-ink-muted text-xs font-mono">
          <Building2 size={11} className="flex-shrink-0" />
          <span className="truncate">{project.client}</span>
        </div>

        {/* Description */}
        <p className="text-ink-mid text-sm leading-relaxed line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Result pill — pinned to bottom */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-light border border-brand-muted mt-auto transition-all duration-300 group-hover:border-brand-green/50 group-hover:shadow-green-sm">
          <TrendingUp size={12} className="text-brand-green flex-shrink-0" />
          <span className="text-brand-dark text-xs font-heading font-semibold leading-tight">
            {project.result}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-ui-border">
          {project.tags?.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full bg-ui-bg-alt border border-ui-border text-ink-muted text-[0.6rem] font-mono hover:border-brand-muted transition-colors duration-200"
            >
              {t}
            </span>
          ))}
        </div>

      </div>
    </article>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */
export default function Projects({ projects = [] }) {
  const sectionRef = useRef(null);

  const gridRef    = useRef(null);
  const metricsRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".proj-label, .proj-title, .proj-subtitle",
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      }
    );
    gsap.fromTo(
      ".proj-metric",
      { autoAlpha: 0, y: 18, scale: 0.9 },
      {
        autoAlpha: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.55, ease: "back.out(1.5)",
        scrollTrigger: { trigger: metricsRef.current, start: "top 85%", once: true },
      }
    );
    if (gridRef.current && gridRef.current.children.length > 0) {
      gsap.fromTo(
        ".gsap-proj",
        { autoAlpha: 0, y: 36, scale: 0.95 },
        {
          autoAlpha: 1, y: 0, scale: 1, stagger: 0.14, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 88%", once: true },
        }
      );
    }
  }, { scope: sectionRef, dependencies: [projects] });

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      className="relative overflow-x-hidden section-pad"
    >

      {/* ── Video background ──────────────────────────────────────────────── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/Video-bg.mp4" type="video/mp4" />
      </video>

      {/* ── Overlay ───────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "rgb(247 250 248 / 0.91)" }}
      />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header — centered */}
        <div className="text-center mb-8">
          <div className="proj-label inline-block opacity-0">
            <SectionLabel>Casos de Éxito</SectionLabel>
          </div>
          <h2 className="proj-title font-heading font-bold text-display-lg text-ink mt-4 mb-3 opacity-0">
            Resultados que hablan
            <br />
            <span className="gradient-brand">por sí mismos</span>
          </h2>
          <p className="proj-subtitle text-ink-mid text-base max-w-lg mx-auto leading-relaxed opacity-0">
            Proyectos reales con impacto medible en seguridad,
            cumplimiento y cultura organizacional.
          </p>
        </div>

        {/* Metrics strip */}
        <div ref={metricsRef} className="proj-metrics flex items-center justify-center gap-0 mb-10 border border-ui-border rounded-xl bg-white/70 backdrop-blur-sm divide-x divide-ui-border overflow-hidden w-full max-w-xs sm:max-w-sm md:max-w-lg mx-auto shadow-card">
          {METRICS.map(({ value, label }) => (
            <div
              key={label}
              className="proj-metric opacity-0 flex-1 flex flex-col items-center justify-center py-4 px-2 group hover:bg-brand-light/60 transition-all duration-300"
            >
              <span className="font-heading font-bold text-xl text-brand-green leading-none mb-0.5 transition-transform duration-300 group-hover:scale-110">
                {value}
              </span>
              <span className="text-ink-muted text-[0.65rem] font-mono text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Cards grid */}
        <div ref={gridRef} className="proj-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.length > 0 ? (
            projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))
          ) : (
            /* Skeleton placeholders mientras carga */
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-card border border-ui-border bg-white/60 shadow-card animate-pulse"
                style={{ minHeight: "320px" }}
              />
            ))
          )}
        </div>

      </div>
    </section>
  );
}
