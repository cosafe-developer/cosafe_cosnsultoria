import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Leaf, Users, ArrowRight } from "lucide-react";
import SectionLabel from "../ui/SectionLabel.jsx";

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = { shield: Shield, leaf: Leaf, users: Users };

export default function About({ content }) {
  const sectionRef = useRef(null);
  const statRef    = useRef(null);
  const about = content?.about ?? {};

  useGSAP(() => {
    gsap.fromTo(
      ".about-left",
      { autoAlpha: 0, x: -44 },
      { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 76%" } }
    );
    gsap.fromTo(
      ".about-right",
      { autoAlpha: 0, x: 44 },
      { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 76%" } }
    );
    gsap.fromTo(
      ".value-item",
      { autoAlpha: 0, y: 28, scale: 0.93 },
      { autoAlpha: 1, y: 0, scale: 1, stagger: 0.14, duration: 0.6, ease: "back.out(1.4)",
        scrollTrigger: { trigger: ".values-grid", start: "top 82%" } }
    );

    // Count-up for the 98% stat card
    const obj = { val: 0 };
    gsap.to(obj, {
      val: 98,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 76%", once: true },
      onUpdate() {
        if (statRef.current) statRef.current.textContent = Math.round(obj.val) + "%";
      },
      onComplete() {
        if (statRef.current) {
          statRef.current.classList.add("animate-counter-glow");
          setTimeout(() => statRef.current?.classList.remove("animate-counter-glow"), 2600);
        }
      },
    });

    // About images parallax
    gsap.to(".about-img-1", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: ".about-right",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(".about-img-2", {
      yPercent: -4,
      ease: "none",
      scrollTrigger: {
        trigger: ".about-right",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: sectionRef });

  return (
    <section id="nosotros" ref={sectionRef} className="section-pad bg-white relative overflow-hidden">
      {/* Background orb — responsive size */}
      <div
        className="absolute top-0 left-0 w-56 h-56 sm:w-80 sm:h-80 lg:w-[500px] lg:h-[500px] rounded-full blur-3xl pointer-events-none opacity-50 animate-orb-2"
        style={{ background: "radial-gradient(circle, rgba(1,167,88,0.05) 0%, transparent 70%)", transform: "translate(-40%, -40%)" }}
      />

      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">

          {/* Left */}
          <div className="about-left opacity-0">
            <SectionLabel>Sobre coSAFE</SectionLabel>
            <h2 className="font-heading font-bold text-display-lg text-ink mt-4 mb-5">
              {about.heading ?? "Comprometidos con la seguridad industrial de México"}
            </h2>
            <p className="text-ink-mid text-base leading-relaxed mb-6">
              {about.body ?? ""}
            </p>
            <a
              href="#contacto"
              onClick={(e) => { e.preventDefault(); document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-flex items-center gap-2 text-brand-green font-heading font-semibold text-sm hover:gap-3.5 transition-all duration-300 group"
            >
              Conoce nuestro equipo
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Right — image collage */}
          <div className="about-right opacity-0">
            <div className="grid grid-cols-2 xs:grid-cols-2 gap-3 sm:gap-4">
              {/* Tall left */}
              <div className="about-img-1 row-span-2 rounded-xl overflow-hidden shadow-card aspect-[3/4] relative group">
                <img
                  src="/img/about-1.jpg"
                  alt="Equipo coSAFE"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.target.src = "/img/feature.JPG"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
              </div>
              {/* Top right */}
              <div className="about-img-2 rounded-xl overflow-hidden shadow-card aspect-video relative group">
                <img
                  src="/img/about-2.jpg"
                  alt="Consultoría de campo"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.target.src = "/img/service-1.jpg"; }}
                />
              </div>
              {/* Bottom right — stat card */}
              <div className="rounded-xl bg-brand-forest text-white p-5 flex flex-col justify-end relative overflow-hidden group">
                {/* Animated background */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(rgba(1,167,88,0.4) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                {/* Glow orb that expands on hover */}
                <div
                  className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full pointer-events-none transition-all duration-500 group-hover:w-36 group-hover:h-36"
                  style={{ background: "radial-gradient(circle, rgba(1,167,88,0.25) 0%, transparent 70%)" }}
                />
                <div className="relative z-10">
                  <div
                    ref={statRef}
                    className="font-heading font-bold text-3xl text-brand-green mb-1"
                  >
                    0%
                  </div>
                  <div className="text-white/70 text-xs font-body leading-snug">
                    clientes satisfechos<br />en proyectos completados
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="values-grid grid grid-cols-1 md:grid-cols-3 gap-5">
          {(about.values ?? []).map((val) => {
            const Icon = ICON_MAP[val.icon] ?? Shield;
            return (
              <div
                key={val.title}
                className="value-item card-border-trace opacity-0 p-6 rounded-xl border border-ui-border bg-ui-bg-alt hover:border-brand-muted hover:shadow-card hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-ui-border flex items-center justify-center mb-4 shadow-sm group-hover:border-brand-muted group-hover:shadow-green-sm group-hover:scale-110 transition-all duration-300">
                  <Icon size={19} className="text-brand-green" strokeWidth={1.8} />
                </div>
                <h4 className="font-heading font-semibold text-ink text-base mb-2">{val.title}</h4>
                <p className="text-ink-mid text-sm leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
