import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function StatItem({ stat, index }) {
  const numRef  = useRef(null);
  const itemRef = useRef(null);

  useGSAP(() => {
    // Count-up animation
    const obj = { val: 0 };
    gsap.to(obj, {
      val: stat.value,
      duration: 2.2,
      ease: "power2.out",
      scrollTrigger: { trigger: itemRef.current, start: "top 85%" },
      onUpdate() {
        if (numRef.current) numRef.current.textContent = Math.round(obj.val);
      },
      onComplete() {
        // Bounce the number on finish
        if (numRef.current) {
          numRef.current.classList.add("animate-num-bounce");
          numRef.current.classList.add("animate-counter-glow");
          setTimeout(() => {
            numRef.current?.classList.remove("animate-num-bounce");
            numRef.current?.classList.remove("animate-counter-glow");
          }, 2600);
        }
      },
    });

    // Card entrance
    gsap.fromTo(
      itemRef.current,
      { autoAlpha: 0, y: 28, scale: 0.92 },
      {
        autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.4)",
        scrollTrigger: { trigger: itemRef.current, start: "top 85%" },
        delay: index * 0.1,
      }
    );

    // Subtle idle pulse on the accent line
    gsap.to(itemRef.current.querySelector(".stat-line"), {
      scaleX: 1.4,
      duration: 1.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1 + index * 0.3,
    });
  }, { scope: itemRef });

  return (
    <div ref={itemRef} className="opacity-0 group text-center relative">
      {/* Background glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle at center, rgba(1,167,88,0.06) 0%, transparent 70%)" }}
      />

      <div className="font-heading font-bold text-4xl lg:text-5xl text-brand-light tabular-nums mb-1 relative">
        <span ref={numRef}>0</span>
        <span className="text-brand-green">{stat.suffix}</span>
      </div>
      <p className="text-brand-light/60 text-sm">{stat.label}</p>
      <div className="mt-3 mx-auto h-px w-8 bg-brand-green rounded stat-line origin-center" />
    </div>
  );
}

export default function Stats({ stats = [] }) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Subtle background shimmer line
    gsap.fromTo(
      ".stats-shimmer",
      { x: "-110%" },
      {
        x: "110%",
        duration: 2.5,
        ease: "power2.inOut",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section-pad-sm bg-brand-forest relative overflow-hidden">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "radial-gradient(rgba(1,167,88,0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Animated shimmer sweep */}
      <div
        className="stats-shimmer absolute inset-y-0 w-32 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(1,167,88,0.08) 50%, transparent 100%)",
          transform: "skewX(-12deg)",
        }}
      />

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(1,167,88,0.07) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-x-0 lg:divide-x divide-white/5">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              stat={{ ...stat, value: stat.value, suffix: stat.suffix }}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
