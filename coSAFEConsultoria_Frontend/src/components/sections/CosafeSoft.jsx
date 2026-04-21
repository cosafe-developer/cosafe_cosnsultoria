import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Zap, Brain, BarChart3, Users2, Clock, FileText,
  ChevronRight, ArrowRight, Sparkles,
} from "lucide-react";
import SectionLabel from "../ui/SectionLabel.jsx";
import Button from "../ui/Button.jsx";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    Icon: Brain,
    title: "Inteligencia normativa",
    desc: "El sistema interpreta automáticamente los requisitos de cada NOM y genera planes de acción personalizados para tu giro industrial.",
    tag: "IA + NOM",
  },
  {
    Icon: Zap,
    title: "Procesos optimizados",
    desc: "Reduce hasta un 60% el tiempo en diagnósticos de cumplimiento. Automatizamos las tareas repetitivas para que el consultor se enfoque en lo que importa.",
    tag: "Eficiencia",
  },
  {
    Icon: BarChart3,
    title: "Dashboard de cumplimiento",
    desc: "Visualiza el estado de cumplimiento de toda tu empresa en un solo panel: NOM por NOM, área por área, riesgo por riesgo.",
    tag: "Visibilidad",
  },
  {
    Icon: FileText,
    title: "Generación de dictámenes",
    desc: "Produce estudios técnicos y dictámenes de cumplimiento con la estructura requerida por STPS, SEMARNAT y Protección Civil.",
    tag: "Documentación",
  },
  {
    Icon: Users2,
    title: "Para agentes y empresas",
    desc: "coSAFE SOFT sirve tanto al consultor EHSS como al responsable de EHS de la empresa cliente, con vistas y permisos adaptados.",
    tag: "Multirol",
  },
  {
    Icon: Clock,
    title: "PIPC en tiempo récord",
    desc: "Guía paso a paso para elaborar el Programa Interno de Protección Civil con todas las secciones requeridas por las autoridades.",
    tag: "PIPC",
  },
];

const PROCESS_STEPS = [
  { n: "01", title: "Diagnóstico inicial", desc: "El sistema analiza tu empresa y detecta brechas normativas." },
  { n: "02", title: "Plan de cumplimiento", desc: "Genera un roadmap priorizado según nivel de riesgo." },
  { n: "03", title: "Gestión continua", desc: "Seguimiento de acciones, fechas límite y evidencias." },
  { n: "04", title: "Reportes y dictámenes", desc: "Entrega documentación técnica lista para autoridades." },
];

const METRICS = [
  { value: "60%", label: "menos tiempo en diagnósticos" },
  { value: "100%", label: "alineado con NOMs vigentes" },
  { value: "2x",   label: "más resultados por consultor" },
];

export default function CosafeSoft() {
  const sectionRef  = useRef(null);
  const screenRef   = useRef(null);
  const [activeFeature, setActiveFeature] = useState(0);

  useGSAP(() => {
    gsap.fromTo(
      ".soft-header",
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" } }
    );
    gsap.fromTo(
      ".soft-metric",
      { autoAlpha: 0, y: 20, scale: 0.88 },
      { autoAlpha: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".soft-metrics", start: "top 84%" } }
    );
    gsap.fromTo(
      ".soft-feature",
      { autoAlpha: 0, y: 36, scale: 0.93 },
      { autoAlpha: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ".soft-features-grid", start: "top 82%" } }
    );
    gsap.fromTo(
      ".soft-step",
      { autoAlpha: 0, x: -28 },
      { autoAlpha: 1, x: 0, stagger: 0.13, duration: 0.55, ease: "power2.out",
        scrollTrigger: { trigger: ".soft-process", start: "top 82%" } }
    );

    // Screen entrance then continuous float
    gsap.fromTo(
      screenRef.current,
      { autoAlpha: 0, y: 50, scale: 0.94 },
      {
        autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: screenRef.current, start: "top 82%", once: true },
        onComplete() {
          gsap.to(screenRef.current, {
            y: -12, duration: 4.5, ease: "sine.inOut", repeat: -1, yoyo: true,
          });
        },
      }
    );

    // Step connector lines animate in
    gsap.fromTo(
      ".step-connector",
      { scaleY: 0 },
      {
        scaleY: 1, stagger: 0.15, duration: 0.4, ease: "power2.out", transformOrigin: "top",
        scrollTrigger: { trigger: ".soft-process", start: "top 82%" },
        delay: 0.4,
      }
    );
  }, { scope: sectionRef });

  return (
    <section id="cosafe-soft" ref={sectionRef} className="section-pad relative overflow-hidden bg-white">
      {/* Animated gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(1,167,88,0.06) 0%, transparent 70%)",
        }}
      />
      {/* Top accent bar — animated */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-brand animate-gradient-shift"
        style={{ backgroundSize: "200% 100%" }}
      />

      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -bottom-20 -left-20 w-56 h-56 sm:w-80 sm:h-80 lg:w-[500px] lg:h-[500px] rounded-full blur-3xl animate-orb-3"
          style={{ background: "radial-gradient(circle, rgba(1,167,88,0.06) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-20 -right-32 w-48 h-48 sm:w-72 sm:h-72 lg:w-[420px] lg:h-[420px] rounded-full blur-3xl animate-orb-1"
          style={{ background: "radial-gradient(circle, rgba(1,107,62,0.05) 0%, transparent 70%)", animationDelay: "4s" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="soft-header opacity-0 text-center max-w-3xl mx-auto mb-12">
          <SectionLabel variant="ink">Producto</SectionLabel>
          <div className="flex items-center justify-center gap-3 mt-4 mb-4">
            <h2 className="font-heading font-bold text-display-lg text-ink">
              coSAFE
            </h2>
            <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-brand-green bg-brand-light overflow-hidden">
              {/* Shimmer on the badge */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(1,167,88,0.2) 50%, transparent 100%)",
                  animation: "shimmerSweep 2.5s ease-in-out infinite",
                }}
              />
              <Sparkles size={14} className="text-brand-green relative z-10" />
              <span className="font-heading font-bold text-brand-green text-xl tracking-tight relative z-10">soft</span>
            </div>
          </div>
          <p className="text-ink-mid text-lg leading-relaxed">
            El sistema inteligente que transforma la gestión de cumplimiento normativo en México.
            Diseñado para consultores EHSS y empresas que exigen velocidad, precisión y resultados.
          </p>

          {/* Key metrics */}
          <div className="soft-metrics flex flex-wrap items-center justify-center gap-8 mt-8">
            {METRICS.map(({ value, label }) => (
              <div key={label} className="soft-metric opacity-0 text-center group">
                <div className="font-heading font-bold text-3xl text-brand-green transition-transform duration-300 group-hover:scale-110">
                  {value}
                </div>
                <div className="text-ink-muted text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Features grid ──────────────────────────────────────────── */}
        <div className="soft-features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`soft-feature card-shimmer opacity-0 group p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                activeFeature === i
                  ? "border-brand-green bg-brand-light shadow-card-hover scale-[1.02]"
                  : "border-ui-border bg-white hover:border-brand-muted hover:shadow-card hover:-translate-y-0.5"
              }`}
              onClick={() => setActiveFeature(i)}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    activeFeature === i
                      ? "bg-brand-green shadow-green-sm"
                      : "bg-ui-bg-alt border border-ui-border group-hover:bg-brand-light group-hover:border-brand-muted"
                  }`}
                >
                  <f.Icon
                    size={18}
                    strokeWidth={1.8}
                    className={`transition-all duration-300 ${activeFeature === i ? "text-white scale-110" : "text-ink-mid group-hover:text-brand-green"}`}
                  />
                </div>
                <span className="label-green text-[0.6rem] py-0.5 px-2">{f.tag}</span>
              </div>
              <h4 className="font-heading font-semibold text-ink text-sm mb-1.5">{f.title}</h4>
              <p className="text-ink-muted text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Two-col: process + screen mockup ───────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Process steps */}
          <div className="soft-process">
            <h3 className="font-heading font-bold text-ink text-display-md mb-8">
              De la brecha normativa
              <br />
              <span className="gradient-brand">al cumplimiento en pasos</span>
            </h3>
            <div className="space-y-0">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.n} className="relative">
                  <div
                    className="soft-step opacity-0 flex items-start gap-4 p-4 rounded-xl border border-ui-border bg-white hover:border-brand-muted hover:shadow-card transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-forest text-white font-mono font-bold text-sm flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-brand-green">
                      {step.n}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <h5 className="font-heading font-semibold text-ink text-sm mb-1">{step.title}</h5>
                      <p className="text-ink-muted text-xs leading-relaxed">{step.desc}</p>
                    </div>
                    <ChevronRight size={15} className="text-ui-border group-hover:text-brand-green transition-all duration-200 group-hover:translate-x-0.5 mt-1 flex-shrink-0" />
                  </div>
                  {/* Connector line */}
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="step-connector absolute left-[27px] top-full w-px h-3 bg-brand-green/30 origin-top" style={{ zIndex: 1 }} />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button
                variant="primary"
                onClick={() => document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3.5"
              >
                Solicitar acceso <ArrowRight size={15} />
              </Button>
            </div>
          </div>

          {/* UI Mockup — floats after entrance */}
          <div ref={screenRef} className="opacity-0" style={{ willChange: "transform" }}>
            <div className="soft-glow-border relative rounded-2xl overflow-hidden border-2 border-brand-green/30 shadow-[0_8px_48px_rgba(1,167,88,0.15)]">
              {/* Browser chrome */}
              <div className="bg-brand-forest px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  {["#ff5f57","#febc2e","#28c840"].map((c) => (
                    <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white/10 rounded-md px-3 py-1 text-xs font-mono text-white/60 text-center">
                    cosafesoft.com
                  </div>
                </div>
                {/* Traffic indicator */}
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-brand-green animate-glow-dot" />
                  <span className="text-white/40 text-[0.6rem] font-mono">live</span>
                </div>
              </div>
              {/* Dashboard image */}
              <div className="bg-white p-4">
                <img
                  src="/cosafesoft-com.png"
                  alt="cosafe soft — panel de cumplimiento"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Caption */}
            <p className="text-ink-muted text-xs text-center mt-4 font-mono">
              Vista representativa del panel de cumplimiento
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
