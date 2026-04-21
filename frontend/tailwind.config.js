/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Brand palette — white corporate + industrial green ──────────────
        brand: {
          green:    "#01A758",   // primary — brand green from logo
          dark:     "#016B3E",   // hover / deeper green
          forest:   "#0f2d1a",   // dark text accent, headings
          light:    "#e8f5ed",   // tinted bg surfaces
          muted:    "#c6e8d5",   // borders / dividers
        },
        ink: {
          DEFAULT:  "#0f1c14",   // near-black headings
          body:     "#1e2d25",   // body text
          mid:      "#4a6358",   // secondary text
          muted:    "#7a9484",   // placeholder / muted
          subtle:   "#a8bfb3",   // very muted
        },
        ui: {
          bg:       "#ffffff",   // pure white
          "bg-alt": "#f7faf8",   // alternating section bg (green tint)
          "bg-2":   "#eef5f1",   // deeper tinted surface
          border:   "#dde8e3",   // default borders
          "border-strong": "#b8d2c6", // stronger border
          card:     "#ffffff",   // card bg
          overlay:  "rgba(1,167,88,0.06)", // green overlay
        },
        steel: {
          DEFAULT:  "#1a56db",   // blue accent
          light:    "#eff4ff",
          border:   "#c3d5ff",
        },
        amber: {
          DEFAULT:  "#d97706",
          light:    "#fef3c7",
          border:   "#fcd34d",
        },
        red: {
          DEFAULT: "#dc2626",
          light:   "#fef2f2",
        },
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body:    ["'Inter'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem,5.5vw,5rem)",    { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2rem,4vw,3.5rem)",        { lineHeight: "1.1",  letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.5rem,2.8vw,2.25rem)",  { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        card:   "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 12px 40px rgba(1,167,88,0.12)",
        green:  "0 0 32px rgba(1,167,88,0.18)",
        "green-sm": "0 0 16px rgba(1,167,88,0.12)",
        inset:  "inset 0 1px 0 rgba(255,255,255,0.8)",
      },
      borderRadius: {
        card: "1rem",
        xl:   "0.875rem",
        pill: "9999px",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #01A758 0%, #016B3E 100%)",
        "gradient-brand-light": "linear-gradient(135deg, #e8f5ed 0%, #eef5f1 100%)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-up":  "fadeUp 0.6s ease forwards",
        float:      "float 8s ease-in-out infinite",
        "spin-slow":"spin 12s linear infinite",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(16px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        float:  { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-12px)" } },
      },
    },
  },
  plugins: [],
};
