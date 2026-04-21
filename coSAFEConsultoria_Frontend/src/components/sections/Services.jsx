import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, Leaf, HeartPulse, ShieldCheck, GraduationCap, Factory } from "lucide-react";
import SectionLabel from "../ui/SectionLabel.jsx";
import Button from "../ui/Button.jsx";

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = {
  leaf:             Leaf,
  "heart-pulse":    HeartPulse,
  "shield-check":   ShieldCheck,
  "graduation-cap": GraduationCap,
  factory:          Factory,
};

const SERVICE_IMAGES = {
  ambiental:    "/img/Servicios/cosafe-servicios-ambientales-sostenibilidad.png",
  salud:        "/img/Servicios/cosafe-servicios-salud-medicina.png",
  seguridad:    "/img/Servicios/cosafe-servicios-seguridad-personal-suministros.png",
  capacitacion: "/img/Servicios/cosafe-servicios-cursos-certificaciones-estudios.png",
  industria:    "/img/Servicios/cosafe-servicios-industriayservicios-manufactura.png",
};

function ServiceCard({ service, isActive, onClick }) {
  const Icon   = ICON_MAP[service.icon] ?? ShieldCheck;
  const imgSrc = SERVICE_IMAGES[service.id] ?? "/img/service-1.jpg";
  const cardRef = useRef(null);

  // 3-D tilt — only on pointer-precise devices (not touch)
  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const onMouseMove = (e) => {
    if (isTouch) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -5;
    const rotY = ((x - cx) / cx) *  5;
    gsap.to(card, {
      rotateX: rotX, rotateY: rotY,
      transformPerspective: 900,
      duration: 0.35,
      ease: "power1.out",
    });
  };

  const onMouseLeave = () => {
    if (isTouch) return;
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
  };

  return (
    <div
      ref={cardRef}
      className={`card-shimmer card-border-trace group cursor-pointer rounded-card border overflow-hidden transition-all duration-300 bg-white ${
        isActive
          ? "border-brand-muted shadow-card-hover -translate-y-1.5"
          : "border-ui-border shadow-card hover:shadow-card-hover hover:border-brand-muted hover:-translate-y-0.5"
      }`}
      onClick={() => onClick(service.id)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* Image header */}
      <div className="relative h-40 sm:h-44 overflow-hidden bg-ui-bg-alt">
        <img
          src={imgSrc}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
          onError={(e) => (e.target.style.display = "none")}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />

        {/* Shine layer on active */}
        {isActive && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${service.color}10 0%, transparent 60%)` }}
          />
        )}

        {/* Category chip */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-mono font-medium text-ink-mid border border-white/60 shadow-sm">
            {service.category}
          </span>
        </div>

        {/* Icon */}
        <div
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-card transition-all duration-300 ${
            isActive ? "scale-110" : "group-hover:scale-105"
          }`}
          style={{ background: service.color + "20", border: `1px solid ${service.color}40` }}
        >
          <Icon size={18} style={{ color: service.color }} strokeWidth={1.8} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-ink text-base mb-2 leading-snug line-clamp-2">
          {service.title}
        </h3>
        <p className="text-ink-mid text-sm leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Highlights — expand on active */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isActive ? "max-h-56 opacity-100 mb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-3 border-t border-ui-border">
            <ul className="space-y-1.5">
              {service.highlights?.map((h, i) => (
                <li
                  key={h}
                  className="flex items-start gap-2 text-sm text-ink-mid"
                  style={{
                    animation: isActive ? `fadeUp 0.35s ease forwards ${i * 0.06}s` : "none",
                    opacity: isActive ? undefined : 0,
                  }}
                >
                  <Check size={13} className="text-brand-green flex-shrink-0 mt-0.5" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA row */}
        <div
          className="flex items-center gap-1.5 text-sm font-heading font-medium transition-all duration-200"
          style={{ color: isActive ? service.color : "#7a9484" }}
        >
          {isActive ? "Cerrar detalle" : "Ver detalle"}
          <ArrowRight
            size={13}
            className={`transition-transform duration-300 ${isActive ? "rotate-90" : "group-hover:translate-x-1"}`}
          />
        </div>
      </div>
    </div>
  );
}

export default function Services({ services = [] }) {
  const sectionRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  useGSAP(() => {
    gsap.fromTo(
      ".svc-header",
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      }
    );
    gsap.fromTo(
      ".svc-card",
      { autoAlpha: 0, y: 48, scale: 0.94 },
      {
        autoAlpha: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".svc-grid", start: "top 80%" },
      }
    );
    // Animated top edge
    gsap.fromTo(
      ".svc-top-edge",
      { scaleX: 0 },
      {
        scaleX: 1, duration: 1.2, ease: "power3.inOut",
        transformOrigin: "left",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      }
    );
  }, { scope: sectionRef });

  const toggle = (id) => setActiveId((p) => (p === id ? null : id));

  return (
    <section id="servicios" ref={sectionRef} className="section-pad bg-ui-bg-alt relative">
      {/* Top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ui-border-strong to-transparent svc-top-edge origin-left" />

      {/* Subtle background orb — responsive size */}
      <div
        className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 lg:w-[600px] lg:h-[600px] rounded-full blur-3xl pointer-events-none opacity-40"
        style={{ background: "radial-gradient(circle, rgba(1,167,88,0.05) 0%, transparent 70%)", transform: "translate(40%, -40%)" }}
      />

      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="svc-header max-w-2xl mb-14 opacity-0">
          <SectionLabel>Servicios EHS</SectionLabel>
          <h2 className="font-heading font-bold text-display-lg text-ink mt-4 mb-4">
            Soluciones para cada riesgo
            <br />
            <span className="gradient-brand">de tu empresa</span>
          </h2>
          <p className="text-ink-mid text-base leading-relaxed">
            Atendemos toda la cadena de cumplimiento en materia de seguridad, salud
            ocupacional y medio ambiente — desde el diagnóstico hasta la certificación.
          </p>
        </div>

        {/* Grid */}
        <div className="svc-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <div key={service.id} className="svc-card opacity-0">
              <ServiceCard
                service={service}
                isActive={activeId === service.id}
                onClick={toggle}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="svc-card mt-12 text-center opacity-0">
          <Button
            variant="ghost"
            onClick={() => document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" })}
          >
            Solicitar consulta personalizada <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </section>
  );
}
