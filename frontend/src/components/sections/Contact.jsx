import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Send, MapPin, Phone, Mail, CheckCircle, AlertCircle,
} from "lucide-react";
import SectionLabel from "../ui/SectionLabel.jsx";
import Button from "../ui/Button.jsx";
import AddressAutocomplete from "../ui/AddressAutocomplete.jsx";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_OPTIONS = [
  "Trámites y Soluciones Ambientales",
  "Salud y Medicina del Trabajo",
  "Seguridad Personal y EPP",
  "Cursos y Certificaciones",
  "Industria y Manufactura",
  "cosafe soft",
  "Otro",
];

const TRUST_BADGES = [
  "Respuesta en < 24 h",
  "Consulta inicial gratuita",
  "Más de 200 empresas atendidas",
];

const EMPTY_FORM    = { name: "", email: "", company: "", service: "", message: "" };
const EMPTY_ADDRESS = null;

export default function Contact({ content }) {
  const sectionRef = useRef(null);
  const company    = content?.company ?? {};

  const [form,       setForm]       = useState(EMPTY_FORM);
  const [address,    setAddress]    = useState(EMPTY_ADDRESS);
  const [status,     setStatus]     = useState(null);   // null | "loading" | "success" | "error"
  const [errMsg,     setErrMsg]     = useState("");
  const [privacyOk,  setPrivacyOk]  = useState(false);  // GDPR/LFPDPPP consent

  // ── Animations ─────────────────────────────────────────────────────────────
  useGSAP(() => {
    gsap.fromTo(
      ".contact-left",
      { autoAlpha: 0, x: -40 },
      { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 76%" } }
    );
    gsap.fromTo(
      ".contact-right",
      { autoAlpha: 0, x: 40, scale: 0.97 },
      { autoAlpha: 1, x: 0, scale: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 76%" } }
    );
    gsap.fromTo(
      ".contact-info-item",
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.55, ease: "power2.out",
        scrollTrigger: { trigger: ".contact-info", start: "top 82%" }, delay: 0.2 }
    );
    gsap.fromTo(
      ".trust-badge",
      { autoAlpha: 0, scale: 0.8, y: 8 },
      { autoAlpha: 1, scale: 1, y: 0, stagger: 0.09, duration: 0.4, ease: "back.out(1.7)",
        scrollTrigger: { trigger: ".trust-badges", start: "top 86%" }, delay: 0.3 }
    );
  }, { scope: sectionRef });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");

    try {
      const res  = await fetch("/api/contact", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({
          ...form,
          // Solo enviamos la dirección si el usuario seleccionó una sugerencia de Google
          address: address
            ? {
                formatted_address: address.formatted_address,
                lat       : address.lat,
                lng       : address.lng,
                components: address.components,
              }
            : null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "Error al enviar");

      setStatus("success");
      setForm(EMPTY_FORM);
      setAddress(EMPTY_ADDRESS);
    } catch (err) {
      setStatus("error");
      setErrMsg(err.message);
    }
  };

  const resetForm = () => {
    setStatus(null);
    setErrMsg("");
    setPrivacyOk(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section id="contacto" ref={sectionRef} className="section-pad bg-white relative overflow-hidden">
      {/* Top rule — animated */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ui-border-strong to-transparent animate-divider-pulse" />

      {/* Background orbs */}
      <div
        className="absolute top-0 right-0 w-56 h-56 sm:w-80 sm:h-80 lg:w-[500px] lg:h-[500px] rounded-full blur-3xl pointer-events-none opacity-40 animate-orb-2"
        style={{ background: "radial-gradient(circle, rgba(1,167,88,0.05) 0%, transparent 70%)", transform: "translate(40%, -40%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-44 h-44 sm:w-64 sm:h-64 lg:w-[350px] lg:h-[350px] rounded-full blur-3xl pointer-events-none opacity-30 animate-orb-3"
        style={{ background: "radial-gradient(circle, rgba(1,107,62,0.06) 0%, transparent 70%)", transform: "translate(-40%, 40%)" }}
      />

      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14">

          {/* ── Left ── */}
          <div className="contact-left opacity-0">
            <SectionLabel>Contacto</SectionLabel>
            <h2 className="font-heading font-bold text-display-lg text-ink mt-4 mb-4">
              Hablemos de tu
              <br />
              <span className="gradient-brand">próximo proyecto</span>
            </h2>
            <p className="text-ink-mid text-base leading-relaxed mb-8">
              Cuéntanos tu reto. Nuestro equipo analizará tu situación y te presentará
              una propuesta concreta alineada con la normatividad aplicable.
            </p>

            {/* Contact info */}
            <div className="contact-info space-y-3 mb-8">
              {[
                { Icon: Phone,  label: "Teléfono",  value: company.phone,    href: `tel:${company.phone}` },
                { Icon: Mail,   label: "Email",     value: company.email,    href: `mailto:${company.email}` },
                { Icon: MapPin, label: "Ubicación", value: company.location, href: null },
              ].map(({ Icon, label, value, href }) => (
                <div
                  key={label}
                  className="contact-info-item opacity-0 flex items-start gap-3.5 p-4 rounded-xl border border-ui-border bg-ui-bg-alt hover:border-brand-muted hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-ui-border flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-brand-muted group-hover:shadow-green-sm group-hover:scale-110 transition-all duration-300">
                    <Icon size={16} className="text-brand-green" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="text-ink-subtle text-xs font-mono uppercase tracking-wider mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="text-ink text-sm hover:text-brand-green transition-colors">{value}</a>
                    ) : (
                      <span className="text-ink text-sm">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="trust-badges flex flex-wrap gap-2">
              {TRUST_BADGES.map((b) => (
                <span
                  key={b}
                  className="trust-badge opacity-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-light border border-brand-muted text-brand-dark text-xs font-medium hover:border-brand-green hover:shadow-green-sm transition-all duration-200"
                >
                  <CheckCircle size={12} className="text-brand-green" />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right — Form ── */}
          <div className="contact-right opacity-0">
            <div className="bg-white rounded-2xl border border-ui-border shadow-card p-7 lg:p-8 hover:shadow-card-hover transition-shadow duration-300">

              {status === "success" ? (
                /* ── Estado: éxito ── */
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-brand-light border border-brand-muted flex items-center justify-center relative">
                    <CheckCircle size={30} className="text-brand-green" />
                    <div
                      className="absolute inset-0 rounded-full border-2 border-brand-green/30"
                      style={{ animation: "pulseRing 1.5s ease-out 1" }}
                    />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-ink">¡Mensaje enviado!</h3>
                  <p className="text-ink-mid text-sm max-w-xs">
                    Gracias por contactarnos. Te responderemos en menos de 24 horas hábiles.
                  </p>
                  <button
                    className="text-brand-green text-sm font-medium hover:underline mt-2 transition-all duration-200"
                    onClick={resetForm}
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                /* ── Formulario ── */
                <form onSubmit={onSubmit} className="space-y-4">

                  {/* Nombre + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-ink-mid text-xs font-mono uppercase tracking-wider mb-1.5">
                        Nombre *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={onChange}
                        required
                        autoComplete="name"
                        autoCapitalize="words"
                        autoCorrect="off"
                        className="input-field"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-ink-mid text-xs font-mono uppercase tracking-wider mb-1.5">
                        Email *
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        required
                        autoComplete="email"
                        inputMode="email"
                        autoCapitalize="off"
                        autoCorrect="off"
                        className="input-field"
                        placeholder="tu@empresa.com"
                      />
                    </div>
                  </div>

                  {/* Empresa */}
                  <div>
                    <label htmlFor="contact-company" className="block text-ink-mid text-xs font-mono uppercase tracking-wider mb-1.5">
                      Empresa
                    </label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      value={form.company}
                      onChange={onChange}
                      autoComplete="organization"
                      autoCorrect="off"
                      className="input-field"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>

                  {/* Dirección — Google Places Autocomplete */}
                  <div>
                    <label className="block text-ink-mid text-xs font-mono uppercase tracking-wider mb-1.5">
                      Dirección de instalación
                    </label>
                    <AddressAutocomplete
                      value={address?.formatted_address ?? ""}
                      onSelect={setAddress}
                      onClear={() => setAddress(null)}
                    />
                    {/* Confirmación visual de selección */}
                    {address?.formatted_address && (
                      <p className="flex items-center gap-1.5 text-xs text-brand-green mt-1.5 font-mono">
                        <CheckCircle size={11} />
                        Dirección seleccionada
                      </p>
                    )}
                  </div>

                  {/* Servicio */}
                  <div>
                    <label className="block text-ink-mid text-xs font-mono uppercase tracking-wider mb-1.5">
                      Servicio de interés
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={onChange}
                      className="input-field"
                    >
                      <option value="">Selecciona un servicio...</option>
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="block text-ink-mid text-xs font-mono uppercase tracking-wider mb-1.5">
                      Mensaje *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      required
                      rows={4}
                      className="input-field resize-none"
                      placeholder="Describe tu reto, necesidad o proyecto..."
                    />
                  </div>

                  {/* Error banner */}
                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      <AlertCircle size={14} />
                      {errMsg || "Error al enviar. Intenta nuevamente."}
                    </div>
                  )}

                  {/* ── Consentimiento de privacidad (LFPDPPP / GDPR) ── */}
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={privacyOk}
                      onChange={(e) => setPrivacyOk(e.target.checked)}
                      required
                      className="
                        mt-0.5 flex-shrink-0
                        w-4 h-4 rounded border-ui-border
                        accent-brand-green
                        cursor-pointer
                      "
                    />
                    <span className="text-xs text-ink-mid leading-relaxed">
                      He leído y acepto el{" "}
                      <a
                        href="#aviso-privacidad"
                        className="text-brand-green underline underline-offset-2 hover:text-brand-dark transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Aviso de Privacidad
                      </a>
                      . Entiendo que mis datos serán utilizados exclusivamente
                      para dar respuesta a mi solicitud, conforme a la
                      LFPDPPP y, en su caso, al RGPD.
                    </span>
                  </label>

                  {/* Submit */}
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!privacyOk || status === "loading"}
                    className="w-full justify-center py-3.5 text-sm"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      <>Enviar mensaje <Send size={15} /></>
                    )}
                  </Button>

                  <p className="text-center text-ink-subtle text-xs">
                    Sin compromisos · Respuesta garantizada en 24 h hábiles
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
