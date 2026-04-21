import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { useFetch } from "../hooks/useFetch.js";
import Hero         from "../components/sections/Hero.jsx";
import Stats        from "../components/sections/Stats.jsx";
import Services     from "../components/sections/Services.jsx";
import NOMs         from "../components/sections/NOMs.jsx";
import CosafeSoft   from "../components/sections/CosafeSoft.jsx";
import Partners     from "../components/sections/Partners.jsx";
import About        from "../components/sections/About.jsx";
import Projects     from "../components/sections/Projects.jsx";
import CTA          from "../components/sections/CTA.jsx";
import Contact      from "../components/sections/Contact.jsx";

export default function Home() {
  const { content, services } = useApp();
  const { data: projects }    = useFetch("/api/content/projects");
  const location              = useLocation();

  const stats = content?.stats ?? [];

  // When arriving from another route with a hash (e.g. /#servicios),
  // scroll to the target section once it has rendered.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const attempt = (tries = 0) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else if (tries < 15) {
        setTimeout(() => attempt(tries + 1), 100);
      }
    };
    setTimeout(() => attempt(), 80);
  }, [location.hash]);

  return (
    <main>
      <Hero       content={content} />
      <Stats      stats={stats} />
      <Services   services={services ?? []} />
      <CosafeSoft />
      <NOMs />
      <Partners />
      <About      content={content} />
      <Projects   projects={projects ?? []} />
      <CTA        content={content} />
      <Contact    content={content} />
    </main>
  );
}
