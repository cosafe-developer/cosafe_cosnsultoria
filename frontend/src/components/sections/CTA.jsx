import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Phone } from "lucide-react";
import Button from "../ui/Button.jsx";

gsap.registerPlugin(ScrollTrigger);

// Pre-generated particles (deterministic — no random at render time)
const PARTICLES = [
  { left: "8%",  dur: "4.2s", delay: "0s",   size: 4, drift: "12px" },
  { left: "18%", dur: "5.1s", delay: "0.7s", size: 3, drift: "-8px" },
  { left: "27%", dur: "3.8s", delay: "1.4s", size: 5, drift: "16px" },
  { left: "38%", dur: "4.6s", delay: "0.3s", size: 3, drift: "-14px" },
  { left: "47%", dur: "5.4s", delay: "1s",   size: 4, drift: "10px" },
  { left: "55%", dur: "3.5s", delay: "2.1s", size: 3, drift: "-6px" },
  { left: "63%", dur: "4.9s", delay: "0.5s", size: 5, drift: "18px" },
  { left: "71%", dur: "4.1s", delay: "1.7s", size: 3, drift: "-12px" },
  { left: "79%", dur: "5.2s", delay: "0.2s", size: 4, drift: "8px" },
  { left: "87%", dur: "3.9s", delay: "1.3s", size: 3, drift: "-16px" },
  { left: "22%", dur: "4.7s", delay: "2.5s", size: 4, drift: "14px" },
  { left: "52%", dur: "3.6s", delay: "0.9s", size: 5, drift: "-10px" },
];

export default function CTA({ content }) {
  const sectionRef = useRef(null);
  const company    = content?.company ?? {};

  useGSAP(() => {
    gsap.fromTo(
      ".cta-inner",
      { autoAlpha: 0, y: 36, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" } }
    );
    gsap.fromTo(
      ".cta-title",
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" }, delay: 0.15 }
    );
    gsap.fromTo(
      ".cta-subtitle",
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" }, delay: 0.3 }
    );
    gsap.fromTo(
      ".cta-actions",
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" }, delay: 0.45 }
    );

    // Slow rotate on the decorative rings
    gsap.to(".cta-ring-1", { rotation: 360, duration: 30, ease: "none", repeat: -1 });
    gsap.to(".cta-ring-2", { rotation: -360, duration: 22, ease: "none", repeat: -1 });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section-pad-sm bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div
          className="cta-inner opacity-0 relative overflow-hidden rounded-2xl text-white py-16 px-8 lg:px-16 text-center"
          style={{ background: "linear-gradient(135deg, #0f2d1a 0%, #016B3E 60%, #01A758 100%)" }}
        >
          {/* Animated dot grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Decorative rotating rings — hidden on xs, scaled on sm */}
          <div className="cta-ring-1 hidden sm:block absolute top-1/2 left-1/2 w-[320px] h-[320px] md:w-[420px] md:h-[420px] lg:w-[520px] lg:h-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 pointer-events-none" />
          <div className="cta-ring-2 hidden sm:block absolute top-1/2 left-1/2 w-[220px] h-[220px] md:w-[300px] md:h-[300px] lg:w-[380px] lg:h-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8 pointer-events-none" style={{ borderStyle: "dashed" }} />

          {/* Top-right light orb */}
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }}
          />
          {/* Bottom-left orb */}
          <div
            className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(1,167,88,0.2) 0%, transparent 70%)" }}
          />

          {/* ── Floating particles ────────────────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {PARTICLES.map((p, i) => (
              <div
                key={i}
                className="absolute bottom-6 rounded-full bg-white/25"
                style={{
                  left: p.left,
                  width:  p.size,
                  height: p.size,
                  "--drift": p.drift,
                  animation: `particleRise ${p.dur} ease-out infinite`,
                  animationDelay: p.delay,
                }}
              />
            ))}
          </div>

          {/* ── Scan line ──────────────────────────────────────────────── */}
          <div
            className="absolute inset-x-0 h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
              animation: "scanLine 5s linear infinite",
              top: 0,
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="cta-title opacity-0 font-heading font-bold text-display-md text-white mb-4">
              ¿Listo para operar con los más altos
              <br />
              estándares de seguridad?
            </h2>
            <p className="cta-subtitle opacity-0 text-white/75 text-base max-w-xl mx-auto mb-8">
              Agenda una consulta sin costo y descubre cómo coSAFE puede ayudarte a
              cumplir la normatividad y eliminar riesgos en tu empresa.
            </p>
            <div className="cta-actions opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="white"
                onClick={() => document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-3.5 text-sm"
              >
                Solicitar diagnóstico gratis <ArrowRight size={15} />
              </Button>
              {company.phone && (
                <a
                  href={`tel:${company.phone}`}
                  className="inline-flex items-center gap-2 text-white/75 hover:text-white transition-colors text-sm"
                >
                  <Phone size={14} /> {company.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
