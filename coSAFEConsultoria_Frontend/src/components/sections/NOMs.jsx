import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Scale, ClipboardCheck, Search, ArrowUpRight, ShieldAlert, ArrowRight, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SectionLabel from "../ui/SectionLabel.jsx";
import Button from "../ui/Button.jsx";

gsap.registerPlugin(ScrollTrigger);

const NOMS = [
  { code: "NOM-001-STPS", title: "Edificios, locales e instalaciones",   category: "Seguridad",   color: "#01A758" },
  { code: "NOM-017-STPS", title: "Equipo de protección personal",        category: "EPP",         color: "#01A758" },
  { code: "NOM-026-STPS", title: "Colores y señales de seguridad",       category: "Señalización", color: "#01A758" },
  { code: "NOM-030-STPS", title: "Servicios preventivos de seguridad",   category: "Servicios",   color: "#1a56db" },
  { code: "NOM-035-STPS", title: "Factores de riesgo psicosocial",       category: "Salud",       color: "#1a56db" },
  { code: "NOM-045-SEMARNAT", title: "Emisiones de vehículos en circulación", category: "Ambiental", color: "#d97706" },
];

const BENEFITS = [
  { Icon: Search,        title: "Consulta directa al DOF",      desc: "Accede a las NOMs vigentes publicadas en el Diario Oficial de la Federación sin intermediarios." },
  { Icon: ClipboardCheck,title: "Diagnóstico de cumplimiento",  desc: "Evaluamos el estado de cumplimiento de tu empresa frente a cada norma aplicable." },
  { Icon: Scale,         title: "Asesoría legal-técnica",       desc: "Interpretamos la normatividad y traducimos los requisitos en acciones concretas para tu operación." },
  { Icon: ShieldAlert,   title: "Prevención de sanciones",      desc: "Detectamos incumplimientos antes de que llegue una inspección de STPS, PROFEPA o Protección Civil." },
];

export default function NOMs() {
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.fromTo(
      ".noms-header",
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" } }
    );
    gsap.fromTo(
      ".nom-chip",
      { autoAlpha: 0, scale: 0.88, y: 14 },
      { autoAlpha: 1, scale: 1, y: 0, stagger: 0.07, duration: 0.55, ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".noms-chips", start: "top 82%" } }
    );
    gsap.fromTo(
      ".nom-benefit",
      { autoAlpha: 0, y: 32, scale: 0.93 },
      { autoAlpha: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.65, ease: "power3.out",
        scrollTrigger: { trigger: ".noms-benefits", start: "top 82%" } }
    );

    // Animated left accent bar — pulse then settle
    gsap.fromTo(
      ".noms-left-bar",
      { scaleY: 0 },
      {
        scaleY: 1, duration: 1.2, ease: "power3.out", transformOrigin: "top",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      }
    );
    gsap.to(".noms-left-bar", {
      opacity: 0.5,
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.5,
    });
  }, { scope: sectionRef });

  return (
    <section id="noms" ref={sectionRef} className="section-pad bg-white relative overflow-hidden">
      {/* Decorative left bar */}
      <div className="noms-left-bar absolute left-0 top-12 sm:top-20 lg:top-24 bottom-12 sm:bottom-20 lg:bottom-24 w-1 bg-gradient-to-b from-transparent via-brand-green to-transparent rounded-r-full origin-top" />

      {/* Background subtle orb — responsive */}
      <div
        className="absolute bottom-0 right-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-[400px] lg:h-[400px] rounded-full blur-3xl pointer-events-none opacity-30 animate-orb-1"
        style={{ background: "radial-gradient(circle, rgba(1,167,88,0.07) 0%, transparent 70%)", transform: "translate(40%, 40%)" }}
      />

      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — text */}
          <div>
            <div className="noms-header opacity-0">
              <SectionLabel>NOMs & DOF</SectionLabel>
              <h2 className="font-heading font-bold text-display-lg text-ink mt-4 mb-5">
                Cumple con la normatividad
                <br />
                <span className="gradient-brand">vigente en México</span>
              </h2>
              <p className="text-ink-mid text-base leading-relaxed mb-6">
                Las Normas Oficiales Mexicanas (NOMs) publicadas en el Diario Oficial de la Federación
                definen los requisitos mínimos de seguridad, salud y ambiente que toda empresa debe cumplir.
                En coSAFE somos tu guía experta para navegar este marco normativo.
              </p>
              <div className="p-4 rounded-xl bg-ui-bg-alt border border-ui-border mb-4 hover:border-brand-muted transition-all duration-300 group">
                <div className="flex items-start gap-3">
                  <BookOpen size={18} className="text-brand-green flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                  <p className="text-ink-mid text-sm leading-relaxed">
                    También somos expertos en <strong className="text-ink">PIPC</strong> (Programa Interno de
                    Protección Civil), un requisito fundamental para establecimientos de mediano y alto riesgo
                    ante las autoridades de Protección Civil municipales y estatales.
                  </p>
                </div>
              </div>

              {/* Consultar DOF CTA */}
              <div className="mb-8">
                <Button onClick={() => navigate("/consultadof")} variant="outline">
                  <Search size={14} />
                  Consultar DOF
                </Button>
              </div>
            </div>

            {/* Benefits grid */}
            <div className="noms-benefits grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFITS.map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="nom-benefit card-shimmer opacity-0 p-4 rounded-xl border border-ui-border bg-white hover:border-brand-muted hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-light border border-brand-muted flex items-center justify-center mb-3 group-hover:bg-brand-green group-hover:border-brand-green group-hover:scale-110 transition-all duration-300">
                    <Icon size={16} className="text-brand-green group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="font-heading font-semibold text-ink text-sm mb-1">{title}</h4>
                  <p className="text-ink-muted text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — NOM chips */}
          <div className="flex flex-col gap-4">
            <div className="noms-header opacity-0">
              <h3 className="font-heading font-semibold text-ink text-xl mb-1">
                NOMs frecuentes en nuestros proyectos
              </h3>
              <p className="text-ink-muted text-sm">
                Estas son algunas de las normas que más gestionamos para nuestros clientes.
              </p>
            </div>

            <div className="noms-chips grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NOMS.map((nom) => (
                <div
                  key={nom.code}
                  className="nom-chip card-shimmer opacity-0 flex items-center gap-3 px-4 py-3 rounded-xl border border-ui-border bg-white hover:shadow-card hover:border-brand-muted hover:-translate-y-0.5 transition-all duration-300 cursor-default group h-full"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-glow-dot transition-transform duration-300 group-hover:scale-125"
                    style={{ background: nom.color }}
                  />
                  <div>
                    <div className="font-mono font-medium text-xs text-ink leading-none mb-0.5">
                      {nom.code}
                    </div>
                    <div className="text-ink-muted text-xs leading-tight">{nom.title}</div>
                  </div>
                  <span
                    className="ml-auto text-[0.6rem] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border"
                    style={{ color: nom.color, borderColor: nom.color + "40", background: nom.color + "10" }}
                  >
                    {nom.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Diagnosis CTA card */}
            <div className="p-5 rounded-xl border border-brand-muted bg-brand-light relative overflow-hidden group hover:shadow-card transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-brand-muted flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 group-hover:shadow-green-sm transition-all duration-300">
                  <ClipboardList size={18} className="text-brand-green" strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-mono uppercase tracking-widest text-brand-green mb-1">Diagnóstico gratuito</p>
                  <h4 className="font-heading font-semibold text-ink text-sm mb-1">
                    ¿Sabes qué NOMs aplican a tu empresa?
                  </h4>
                  <p className="text-ink-mid text-xs leading-relaxed mb-3">
                    Evaluamos tu situación normativa sin costo y te entregamos un reporte de brechas de cumplimiento.
                  </p>
                  <button
                    onClick={() => document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex items-center gap-1.5 text-brand-green text-xs font-heading font-semibold hover:gap-3 transition-all duration-300"
                  >
                    Solicitar diagnóstico <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* DOF reference card */}
            <div className="p-5 rounded-xl bg-brand-forest text-white relative overflow-hidden group hover:shadow-green transition-all duration-300">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* Hover orb */}
              <div
                className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle, rgba(1,167,88,0.3) 0%, transparent 70%)" }}
              />
              <div className="relative z-10">
                <p className="text-white/60 text-xs font-mono uppercase tracking-widest mb-2">
                  Fuente oficial
                </p>
                <h4 className="font-heading font-bold text-lg mb-2 text-white">
                  Diario Oficial de la Federación
                </h4>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Consultamos directamente el DOF para garantizar que las normas que aplicamos sean las versiones
                  más recientes y vigentes.
                </p>
                <a
                  href="https://www.dof.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-green text-sm font-medium hover:gap-3 transition-all duration-300"
                >
                  dof.gob.mx <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
