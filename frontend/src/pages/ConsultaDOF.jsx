import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

const sanitizeDOF = (html) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
import {
  Newspaper, TrendingUp, FileText, Search,
  ArrowLeft, Loader2, AlertCircle, BookOpen,
  Lightbulb, ArrowRight, CheckCircle2,
} from "lucide-react";
import SectionLabel from "../components/ui/SectionLabel.jsx";
import Button from "../components/ui/Button.jsx";

/* ─── Config ─────────────────────────────────────────────────────────────────── */
const DOF_BASE = "/dof-api/dof/sidof";

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const toApi = (htmlDate) => {
  if (!htmlDate) return "";
  const [y, m, d] = htmlDate.split("-");
  return `${d}-${m}-${y}`;
};

async function dofGet(path) {
  const res = await fetch(DOF_BASE + path);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

/* ─── Shared UI components ───────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div className="flex items-center justify-center gap-2.5 py-10 text-ink-mid">
      <Loader2 size={20} className="animate-spin text-brand-green" />
      <span className="text-sm">Consultando el DOF…</span>
    </div>
  );
}

function ErrBox({ msg }) {
  return (
    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-light border border-red/20 mt-4">
      <AlertCircle size={15} className="text-red flex-shrink-0 mt-0.5" />
      <p className="text-red text-xs leading-relaxed">{msg}</p>
    </div>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center py-10 text-ink-muted gap-2">
      <BookOpen size={28} className="opacity-30" />
      <p className="text-sm">Sin resultados para esta consulta.</p>
    </div>
  );
}

function InsightBox({ children, ctaLabel = "Solicitar asesoría" }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-light border border-brand-muted mt-5">
      <Lightbulb size={15} className="text-brand-green flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-ink-mid text-xs leading-relaxed">{children}</p>
        <a
          href="/#contacto"
          className="inline-flex items-center gap-1 text-brand-green text-xs font-heading font-semibold mt-2 hover:gap-2 transition-all duration-200"
        >
          {ctaLabel} <ArrowRight size={12} />
        </a>
      </div>
    </div>
  );
}

function ModeBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3.5 py-1.5 rounded-pill border font-heading font-medium transition-all duration-200 ${
        active
          ? "bg-brand-green text-white border-brand-green"
          : "bg-white border-ui-border text-ink-mid hover:border-brand-green hover:text-brand-green"
      }`}
    >
      {children}
    </button>
  );
}

function DataTable({ head, rows }) {
  if (!rows?.length) return <Empty />;
  return (
    <div className="overflow-x-auto rounded-xl border border-ui-border mt-4">
      <table className="w-full">
        <thead className="bg-ui-bg-alt border-b border-ui-border">
          <tr>
            {head.map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-ink-mid font-medium text-xs whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-ui-border last:border-0 hover:bg-ui-bg-alt transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-xs text-ink">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Nota Card ──────────────────────────────────────────────────────────────── */
function NotaCard({ nota, showContent = false }) {
  return (
    <div className="p-4 rounded-xl border border-ui-border bg-white hover:border-brand-muted hover:shadow-card transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-[10px] text-brand-green font-medium">{nota.codNota}</span>
            {nota.codSeccion && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-ui-bg-2 text-ink-mid font-mono">
                {nota.codSeccion}
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-ink leading-relaxed">{nota.titulo}</p>
          {(nota.codOrgaDos || nota.nombreCodOrgaUno) && (
            <p className="text-ink-muted text-[10px] mt-1 truncate">
              {nota.codOrgaDos || nota.nombreCodOrgaUno}
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0 space-y-1">
          {nota.pagina > 0 && (
            <p className="text-ink-muted text-[10px]">Pág. {nota.pagina}</p>
          )}
          {nota.existeHtml === "S" && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-brand-green font-mono">
              <CheckCircle2 size={9} /> HTML
            </span>
          )}
        </div>
      </div>
      {showContent && nota.cadenaContenido?.trim() && (
        <div
          className="mt-3 pt-3 border-t border-ui-border text-xs text-ink-mid leading-relaxed overflow-auto max-h-64"
          dangerouslySetInnerHTML={{ __html: sanitizeDOF(nota.cadenaContenido) }}
        />
      )}
    </div>
  );
}

/* ─── Diarios Panel ──────────────────────────────────────────────────────────── */
function DiariosPanel() {
  const [mode, setMode] = useState("fecha");
  const [fecha, setFecha] = useState("");
  const [anio, setAnio] = useState(String(new Date().getFullYear()));
  const [edicion, setEdicion] = useState("MAT");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function reset() { setResult(null); setError(null); }
  const valid = mode === "anio" ? anio.length === 4 : fecha.length > 0;

  async function query() {
    setLoading(true); reset();
    try {
      const d = toApi(fecha);
      if (mode === "fecha")    setResult(await dofGet(`/diarios/porFecha/${d}`));
      else if (mode === "anio") setResult(await dofGet(`/diarios/${anio}`));
      else                      setResult(await dofGet(`/diarios/obtieneDiario/${d}/${edicion}`));
    } catch (e) {
      setError(e.message || "Error al consultar. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function renderResults() {
    if (!result) return null;
    if (result.messageCode !== 200) return <ErrBox msg={result.response} />;

    if (mode === "fecha") {
      const ediciones = [
        { label: "Matutina",      data: result.Matutina },
        { label: "Vespertina",    data: result.Vespertina },
        { label: "Extraordinaria", data: result.Extraordinaria },
      ].filter((e) => e.data?.length);
      if (!ediciones.length) return <Empty />;
      return ediciones.map(({ label, data }) => (
        <div key={label} className="mt-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-green mb-2">
            Edición {label}
          </p>
          <DataTable
            head={["Cód. Diario", "Sección", "Pág. Inicial", "Pág. Máxima"]}
            rows={data.map((i) => [
              <span className="font-mono text-brand-green font-medium">{i.codDiario}</span>,
              i.codSeccion,
              i.paginaIni,
              i.paginaMax,
            ])}
          />
        </div>
      ));
    }

    if (mode === "anio") {
      const list = result.ListaDiarios ?? [];
      return (
        <>
          <DataTable
            head={["Cód. Diario", "Fecha", "Edición"]}
            rows={list.map((d) => [
              <span className="font-mono text-brand-green font-medium">{d.codDiario}</span>,
              d.fecha,
              <span className="label-green !text-[0.6rem] !py-0.5 !px-2">{d.codEdicion}</span>,
            ])}
          />
          {result.FechasSinPublicacion?.length > 0 && (
            <p className="text-ink-muted text-xs mt-3">
              {result.FechasSinPublicacion.length} fecha(s) sin publicación en {anio}.
            </p>
          )}
        </>
      );
    }

    if (mode === "edicion") {
      const d = result.diario;
      if (!d) return <Empty />;
      return (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ["Cód. Diario", d.codDiario, true],
            ["Edición",     d.codEdicion, false],
            ["Fecha",       d.fecha, false],
            ["Estado",      d.estado ?? "—", false],
          ].map(([lbl, val, green]) => (
            <div key={lbl} className="p-3 rounded-xl bg-ui-bg-alt border border-ui-border">
              <p className="text-ink-muted text-[10px] uppercase tracking-wide mb-1">{lbl}</p>
              <p className={`text-sm font-medium ${green ? "font-mono text-brand-green" : "text-ink"}`}>
                {val}
              </p>
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {[["fecha", "Por fecha"], ["anio", "Por año"], ["edicion", "Por fecha y edición"]].map(([v, l]) => (
          <ModeBtn key={v} active={mode === v} onClick={() => { setMode(v); reset(); }}>{l}</ModeBtn>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        {mode !== "anio" ? (
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-ink-mid mb-1.5">Fecha</label>
            <input
              type="date"
              className="input-field"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-ink-mid mb-1.5">Año</label>
            <input
              type="number"
              className="input-field w-32"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              min="2000"
              max="2099"
            />
          </div>
        )}
        {mode === "edicion" && (
          <div className="min-w-[180px]">
            <label className="block text-xs font-medium text-ink-mid mb-1.5">Edición</label>
            <select
              className="input-field"
              value={edicion}
              onChange={(e) => setEdicion(e.target.value)}
            >
              <option value="MAT">Matutina (MAT)</option>
              <option value="VES">Vespertina (VES)</option>
              <option value="EXT">Extraordinaria (EXT)</option>
            </select>
          </div>
        )}
        <Button onClick={query} disabled={!valid || loading}>
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
          {loading ? "Consultando…" : "Consultar"}
        </Button>
      </div>

      {error && <ErrBox msg={error} />}
      {loading ? <Spinner /> : renderResults()}
      {result?.messageCode === 200 && !loading && (
        <InsightBox ctaLabel="Solicitar monitoreo personalizado">
          ¿Necesitas rastrear publicaciones relevantes para tu sector? En coSAFE implementamos
          sistemas de monitoreo del DOF para que siempre estés al día con los cambios normativos
          que te afectan.
        </InsightBox>
      )}
    </div>
  );
}

/* ─── Indicadores Panel ──────────────────────────────────────────────────────── */
const INDICATOR_OPTIONS = [
  { code: "158", label: "158 — Dólar (USD/MXN)" },
  { code: "159", label: "159 — Euro (EUR/MXN)" },
  { code: "165", label: "165 — UDIS" },
  { code: "166", label: "166 — CCP-Dólares" },
];

function IndicadoresPanel() {
  const [mode, setMode] = useState("hoy");
  const [fecha, setFecha] = useState("");
  const [codInd, setCodInd] = useState("158");
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function reset() { setResult(null); setError(null); }

  const valid =
    mode === "hoy" ||
    (mode === "fecha" && fecha.length > 0) ||
    (mode === "rango" && codInd && fechaIni && fechaFin);

  async function query() {
    setLoading(true); reset();
    try {
      if (mode === "hoy")        setResult(await dofGet("/indicadores/"));
      else if (mode === "fecha") setResult(await dofGet(`/indicadores/${toApi(fecha)}`));
      else                        setResult(await dofGet(`/indicadores/${codInd}/${toApi(fechaIni)}/${toApi(fechaFin)}`));
    } catch (e) {
      setError(e.message || "Error al consultar indicadores.");
    } finally {
      setLoading(false);
    }
  }

  function renderResults() {
    if (!result) return null;
    if (result.messageCode !== 200) return <ErrBox msg={result.response} />;
    const list = result.ListaIndicadores ?? [];
    if (!list.length) return <Empty />;
    return (
      <DataTable
        head={["Cód. Indicador", "Tipo", "Fecha", "Valor"]}
        rows={list.map((i) => [
          <span className="font-mono text-brand-green font-medium">{i.codIndicador}</span>,
          i.codTipoIndicador,
          i.fecha,
          <span className="font-mono font-semibold text-ink">{i.valor}</span>,
        ])}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {[["hoy", "Día actual"], ["fecha", "Por fecha"], ["rango", "Por tipo y rango"]].map(([v, l]) => (
          <ModeBtn key={v} active={mode === v} onClick={() => { setMode(v); reset(); }}>{l}</ModeBtn>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        {mode === "fecha" && (
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-ink-mid mb-1.5">Fecha</label>
            <input
              type="date"
              className="input-field"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        )}
        {mode === "rango" && (
          <>
            <div className="min-w-[180px]">
              <label className="block text-xs font-medium text-ink-mid mb-1.5">Tipo de indicador</label>
              <select
                className="input-field"
                value={codInd}
                onChange={(e) => setCodInd(e.target.value)}
              >
                {INDICATOR_OPTIONS.map((o) => (
                  <option key={o.code} value={o.code}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[180px]">
              <label className="block text-xs font-medium text-ink-mid mb-1.5">Fecha inicio</label>
              <input
                type="date"
                className="input-field"
                value={fechaIni}
                onChange={(e) => setFechaIni(e.target.value)}
              />
            </div>
            <div className="min-w-[180px]">
              <label className="block text-xs font-medium text-ink-mid mb-1.5">Fecha fin</label>
              <input
                type="date"
                className="input-field"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </>
        )}
        <Button onClick={query} disabled={!valid || loading}>
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
          {loading ? "Consultando…" : "Consultar"}
        </Button>
      </div>

      {error && <ErrBox msg={error} />}
      {loading ? <Spinner /> : renderResults()}
      {result?.messageCode === 200 && !loading && (
        <InsightBox ctaLabel="Hablar con un especialista">
          Los indicadores económicos como el tipo de cambio y las tasas de referencia impactan
          directamente en tus costos de cumplimiento normativo. Nuestros especialistas pueden
          orientarte en la planificación financiera ante volatilidad en estos índices.
        </InsightBox>
      )}
    </div>
  );
}

/* ─── Notas Panel ────────────────────────────────────────────────────────────── */
function NotasPanel() {
  const [mode, setMode] = useState("fecha");
  const [fecha, setFecha] = useState("");
  const [codNota, setCodNota] = useState("");
  const [codDiario, setCodDiario] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function reset() { setResult(null); setError(null); }

  const valid =
    (mode === "fecha"   && fecha.length > 0) ||
    (mode === "codigo"  && codNota.length >= 4) ||
    (mode === "diario"  && codDiario.length >= 4);

  async function query() {
    setLoading(true); reset();
    try {
      if (mode === "fecha")       setResult(await dofGet(`/notas/${toApi(fecha)}`));
      else if (mode === "codigo") setResult(await dofGet(`/notas/nota/${codNota}`));
      else                        setResult(await dofGet(`/notas/obtenerNotasPorDiario/${codDiario}`));
    } catch (e) {
      setError(e.message || "Error al consultar notas.");
    } finally {
      setLoading(false);
    }
  }

  function renderNotasList(notas) {
    const withTitle = notas.filter((n) => n.titulo);
    if (!withTitle.length) return <Empty />;
    return (
      <div className="mt-4 space-y-2">
        {withTitle.map((nota) => (
          <NotaCard key={nota.codNota} nota={nota} />
        ))}
      </div>
    );
  }

  function renderResults() {
    if (!result) return null;
    if (result.messageCode !== 200) return <ErrBox msg={result.response} />;

    if (mode === "fecha") {
      const notas = [
        ...(result.NotasMatutinas ?? []),
        ...(result.NotasVespertinas ?? []),
        ...(result.NotasExtraordinarias ?? []),
      ];
      return renderNotasList(notas);
    }

    if (mode === "codigo") {
      const nota = result.Nota;
      if (!nota) return <Empty />;
      return (
        <div className="mt-4">
          <NotaCard nota={nota} showContent />
        </div>
      );
    }

    if (mode === "diario") {
      return renderNotasList(result.Notas ?? []);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {[["fecha", "Por fecha"], ["codigo", "Por código"], ["diario", "Por diario"]].map(([v, l]) => (
          <ModeBtn key={v} active={mode === v} onClick={() => { setMode(v); reset(); }}>{l}</ModeBtn>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        {mode === "fecha" && (
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-ink-mid mb-1.5">Fecha</label>
            <input
              type="date"
              className="input-field"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        )}
        {mode === "codigo" && (
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-ink-mid mb-1.5">Código de nota</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ej: 5441022"
              value={codNota}
              onChange={(e) => setCodNota(e.target.value)}
            />
          </div>
        )}
        {mode === "diario" && (
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-ink-mid mb-1.5">Código de diario</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ej: 270281"
              value={codDiario}
              onChange={(e) => setCodDiario(e.target.value)}
            />
          </div>
        )}
        <Button onClick={query} disabled={!valid || loading}>
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
          {loading ? "Consultando…" : "Consultar"}
        </Button>
      </div>

      {error && <ErrBox msg={error} />}
      {loading ? <Spinner /> : renderResults()}
      {result?.messageCode === 200 && !loading && (
        <InsightBox>
          ¿Alguna de estas publicaciones afecta la normatividad de tu empresa? Nuestro equipo
          puede analizar el impacto específico para tu sector y orientarte en los pasos a seguir
          para mantener el cumplimiento.
        </InsightBox>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
const TABS = [
  { id: "diarios",     label: "Diarios",     Icon: Newspaper,  Panel: DiariosPanel },
  { id: "indicadores", label: "Indicadores", Icon: TrendingUp, Panel: IndicadoresPanel },
  { id: "notas",       label: "Notas",       Icon: FileText,   Panel: NotasPanel },
];

export default function ConsultaDOF() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("diarios");
  const { Panel: ActivePanel } = TABS.find((t) => t.id === activeTab);

  return (
    <main>
      {/* ── Hero header ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-forest relative overflow-hidden pt-20 lg:pt-[120px] pb-14">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="max-w-5xl mx-auto px-5 lg:px-8 relative z-10">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-white/60 text-xs font-medium hover:text-white transition-colors mb-5"
          >
            <ArrowLeft size={14} /> Volver al inicio
          </button>
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-green mb-3">
            Fuente oficial
          </p>
          <h1 className="font-heading font-bold text-display-md text-white mb-3">
            Consultor del{" "}
            <span className="gradient-brand">Diario Oficial</span>
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-xl">
            Consulta diarios, indicadores económicos y notas publicadas directamente desde el
            Sistema de Información del DOF (SIDOF).
          </p>
        </div>
      </section>

      {/* ── Tabs + content ───────────────────────────────────────────────────── */}
      <section className="section-pad bg-ui-bg-alt">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          {/* Tab bar */}
          <div className="overflow-x-auto mb-8 -mx-1 px-1">
          <div className="flex gap-1 bg-white border border-ui-border rounded-pill p-1 w-fit shadow-card">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-pill text-xs font-heading font-semibold transition-all duration-200 ${
                  activeTab === id
                    ? "bg-brand-green text-white shadow-green-sm"
                    : "text-ink-mid hover:text-ink"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
          </div>

          {/* Panel */}
          <div className="bg-white rounded-card border border-ui-border shadow-card p-5 sm:p-6 lg:p-8">
            <ActivePanel />
          </div>
        </div>
      </section>

      {/* ── Commercial CTA ───────────────────────────────────────────────────── */}
      <section className="section-pad bg-brand-light border-t border-brand-muted">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 text-center">
          <SectionLabel>Consultoría especializada</SectionLabel>
          <h2 className="font-heading font-bold text-display-md text-ink mt-4 mb-4">
            ¿Esta publicación impacta a tu empresa?
          </h2>
          <p className="text-ink-mid text-sm leading-relaxed mb-8 max-w-2xl mx-auto">
            Los cambios en el DOF generan nuevas obligaciones normativas, fiscales o ambientales.
            En coSAFE interpretamos, implementamos y mantenemos tu cumplimiento sin complicaciones.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => navigate("/")}>
              Solicitar diagnóstico gratuito
            </Button>
            <Button variant="outline" href="https://www.dof.gob.mx" target="_blank" rel="noopener noreferrer">
              Visitar dof.gob.mx
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
