import { useLocation, useNavigate } from "react-router-dom";
import { Facebook, Linkedin, Instagram, ExternalLink } from "lucide-react";

const NAV_COLS = [
  {
    heading: "Servicios",
    links: [
      { label: "Trámites Ambientales",    href: "#servicios" },
      { label: "Salud Ocupacional",        href: "#servicios" },
      { label: "Seguridad y EPP",          href: "#servicios" },
      { label: "Cursos y Certificaciones", href: "#servicios" },
      { label: "Industria y Manufactura",  href: "#servicios" },
    ],
  },
  {
    heading: "Plataforma",
    links: [
      { label: "coSAFE SOFT",  href: "#cosafe-soft" },
      { label: "NOMs / DOF",   href: "#noms" },
      { label: "Nosotros",     href: "#nosotros" },
      { label: "Casos de éxito", href: "#proyectos" },
      { label: "Contacto",     href: "#contacto" },
    ],
  },
  {
    heading: "Normatividad",
    links: [
      { label: "DOF",        href: "https://www.dof.gob.mx", external: true },
      { label: "STPS",       href: "https://www.gob.mx/stps", external: true },
      { label: "SEMARNAT",   href: "https://www.gob.mx/semarnat", external: true },
      { label: "PROFEPA",    href: "https://www.gob.mx/profepa", external: true },
    ],
  },
];

export default function Footer({ content }) {
  const company  = content?.company ?? {};
  const year     = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const go = (href) => {
    if (location.pathname === "/") {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate({ pathname: "/", hash: href });
    }
  };

  return (
    <footer className="bg-brand-forest text-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Main */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 py-12 lg:py-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <button onClick={() => go("#inicio")} className="flex items-center mb-5 group">
              <img
                src="/img/cosafe-consultoria-ehss.png"
                alt="coSAFE"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </button>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              {company.tagline ?? "Soluciones en Salud, Sostenibilidad, Seguridad y Ambiente"}
            </p>
            <div className="flex gap-2 mb-6">
              {[
                { Icon: Facebook,  href: company.social?.facebook },
                { Icon: Linkedin,  href: company.social?.linkedin },
                { Icon: Instagram, href: company.social?.instagram },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href ?? "#"}
                  className="w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white/50 hover:text-brand-green hover:border-brand-green/50 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
            {/* cosafe soft badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-green/30 bg-brand-green/10">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="text-brand-green text-xs font-mono">cosafe soft — disponible</span>
            </div>
          </div>

          {/* Nav cols */}
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="font-heading font-semibold text-white text-xs uppercase tracking-wider mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map(({ label, href, external }) => (
                  <li key={label}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-white/55 hover:text-brand-green text-sm transition-colors"
                      >
                        {label} <ExternalLink size={10} className="opacity-60" />
                      </a>
                    ) : (
                      <button
                        onClick={() => go(href)}
                        className="text-left text-white/55 hover:text-brand-green text-sm transition-colors"
                      >
                        {label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar — also serves as the Aviso de Privacidad anchor */}
        <div
          id="aviso-privacidad"
          className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-white/40 text-xs font-mono text-center sm:text-left">
            © {year} {company.fullName ?? "coSAFE Consultoría EHSS"}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <p className="text-white/40 text-xs font-mono">{company.location}</p>
            <span className="text-white/20 text-xs hidden sm:inline">·</span>
            {/* LFPDPPP / GDPR: enlace al aviso de privacidad */}
            <button
              onClick={() => go("#aviso-privacidad")}
              className="text-white/40 hover:text-brand-green text-xs font-mono transition-colors duration-200 underline underline-offset-2"
            >
              Aviso de Privacidad
            </button>
          </div>
        </div>

        {/* Aviso de privacidad inline — LFPDPPP Art. 15 / GDPR Art. 13 */}
        <div className="border-t border-white/5 py-4 px-1">
          <p className="text-white/25 text-[0.65rem] font-mono leading-relaxed text-center max-w-3xl mx-auto">
            <strong className="text-white/40">Aviso de Privacidad:</strong>{" "}
            coSAFE Consultoría EHSS, responsable de tus datos personales, los
            utilizará exclusivamente para atender tu solicitud de cotización o
            contacto. No se comparten con terceros sin consentimiento, salvo
            obligación legal. Los datos se tratarán conforme a la{" "}
            <strong className="text-white/40">LFPDPPP</strong> (México) y, para
            residentes de la UE, al{" "}
            <strong className="text-white/40">RGPD</strong>. Este sitio usa
            Google Fonts y Google Maps (servicios de terceros que pueden
            transferir datos técnicos a Google LLC). Para ejercer derechos ARCO
            escríbenos a{" "}
            <a
              href="mailto:administracion@cosafeconsultoria.com"
              className="text-white/40 hover:text-brand-green underline underline-offset-2 transition-colors"
            >
              administracion@cosafeconsultoria.com
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
