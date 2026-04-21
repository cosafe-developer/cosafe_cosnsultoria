import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export default function LoadingScreen() {
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Orbs enter
    tl.fromTo(
      ".cs-orb",
      { scale: 0, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.8, ease: "power3.out", stagger: 0.15 }
    );

    // Letters stagger in
    tl.fromTo(
      ".cs-char",
      { autoAlpha: 0, y: 24, skewX: 8 },
      { autoAlpha: 1, y: 0, skewX: 0, stagger: 0.06, duration: 0.5, ease: "power3.out" },
      "-=0.3"
    );

    // Progress bar
    tl.to(".cs-progress", {
      scaleX: 1, duration: 1.5, ease: "power3.inOut",
      transformOrigin: "left center",
    }, "-=0.1");

    // Tagline
    tl.fromTo(
      ".cs-tagline",
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.6"
    );

    // Orbs ambient float
    gsap.to(".cs-orb-1", { y: -12, duration: 2.5, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 0.5 });
    gsap.to(".cs-orb-2", { y:  10, duration: 3,   ease: "sine.inOut", repeat: -1, yoyo: true, delay: 0.8 });
    gsap.to(".cs-orb-3", { y:  -8, duration: 2,   ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.2 });
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center gap-6 overflow-hidden"
    >
      {/* Ambient orbs */}
      <div className="cs-orb cs-orb-1 absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(1,167,88,0.1) 0%, transparent 70%)", opacity: 0 }} />
      <div className="cs-orb cs-orb-2 absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(1,107,62,0.08) 0%, transparent 70%)", opacity: 0 }} />
      <div className="cs-orb cs-orb-3 absolute top-1/2 right-1/3 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full blur-2xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(1,167,88,0.06) 0%, transparent 70%)", opacity: 0 }} />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

      {/* Logo letters */}
      <div className="flex items-center gap-0.5 font-heading font-bold text-4xl text-ink overflow-hidden relative z-10">
        {"coSAFE".split("").map((c, i) => (
          <span key={i} className="cs-char inline-block" style={{ opacity: 0 }}>
            <span className={i >= 2 ? "text-brand-green" : "text-ink"}>{c}</span>
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative w-40 h-0.5 bg-ui-bg-alt rounded-full overflow-hidden">
        <div className="cs-progress h-full bg-gradient-brand rounded-full" style={{ transform: "scaleX(0)" }} />
        {/* Shimmer on bar */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
            animation: "shimmerSweep 1.5s ease-in-out infinite",
          }}
        />
      </div>

      <p className="cs-tagline text-ink-muted text-xs font-mono tracking-widest uppercase relative z-10" style={{ opacity: 0 }}>
        Cargando plataforma...
      </p>
    </div>
  );
}
