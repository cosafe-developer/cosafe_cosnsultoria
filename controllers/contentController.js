import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Resend } from "resend";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath     = join(__dirname, "../data/content.json");
const projectsPath = join(__dirname, "../data/projects.json");

const loadContent  = () => JSON.parse(readFileSync(dataPath,     "utf-8"));
const loadProjects = () => JSON.parse(readFileSync(projectsPath, "utf-8"));

// ── Resend client (lazy — evita crash en arranque si falta la API key) ────
const getResend = () => new Resend(process.env.RESEND_API_KEY);

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Formatea una fecha como DD-MM-YYYY
 */
function formatDate(date = new Date()) {
  const d  = String(date.getDate()).padStart(2, "0");
  const m  = String(date.getMonth() + 1).padStart(2, "0");
  const y  = date.getFullYear();
  return `${d}-${m}-${y}`;
}

/**
 * Formatea fecha y hora legible en español para el cuerpo del email
 * Ejemplo: "miércoles, 16 de abril de 2026 — 14:32 hrs (UTC-6)"
 */
function formatDatetimeLong(date = new Date()) {
  return date.toLocaleString("es-MX", {
    weekday:  "long",
    day:      "2-digit",
    month:    "long",
    year:     "numeric",
    hour:     "2-digit",
    minute:   "2-digit",
    timeZone: "America/Monterrey",
    timeZoneName: "short",
  });
}

/**
 * Desglosa address_components de Google Places en campos legibles.
 * Null-safe: devuelve null en cada campo que Google no provea.
 */
function parseAddressComponents(components = []) {
  const get = (type) =>
    components.find((c) => Array.isArray(c.types) && c.types.includes(type))
      ?.long_name ?? null;

  return {
    estado        : get("administrative_area_level_1"),
    ciudad        : get("locality")
                 ?? get("sublocality_level_1")
                 ?? get("administrative_area_level_2"),
    codigo_postal : get("postal_code"),
    pais          : get("country"),
  };
}

/**
 * Construye el asunto del email
 * Formato: DD-MM-YYYY_Cotizacion_<Servicio>_<Empresa>
 */
function buildSubject({ service, company, date }) {
  const safeService = (service || "Sin especificar").trim();
  const safeCompany = (company || "Sin empresa").trim();
  return `${formatDate(date)}_Cotizacion_${safeService}_${safeCompany}`;
}

/**
 * Genera el HTML corporativo del email
 */
function buildEmailHtml({ name, email, company, service, message, submittedAt, addressParsed }) {
  const datetimeLong = formatDatetimeLong(submittedAt);

  // Sección de dirección (solo si el usuario seleccionó una dirección)
  const hasAddress    = Boolean(addressParsed?.direccion_completa);
  const msgSecNum     = hasAddress ? "04" : "03";
  const mapsUrl       = hasAddress && addressParsed.lat != null && addressParsed.lng != null
    ? `https://www.google.com/maps?q=${addressParsed.lat},${addressParsed.lng}`
    : addressParsed?.direccion_completa
      ? `https://www.google.com/maps?q=${encodeURIComponent(addressParsed.direccion_completa)}`
      : null;

  // Colores de marca coSAFE
  const GREEN       = "#01A758";
  const DARK_GREEN  = "#016B3E";
  const FOREST      = "#0f2d1a";
  const LIGHT_GREEN = "#e8f5ed";
  const INK         = "#0f1c14";
  const INK_MID     = "#4a6358";
  const BORDER      = "#dde8e3";
  const BG          = "#f7faf8";

  return /* html */`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nueva Cotización — coSAFE Consultoría</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BORDER};box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,${FOREST} 0%,${DARK_GREEN} 60%,${GREEN} 100%);padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:11px;font-family:monospace;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.55);">
                coSAFE Consultoría EHSS
              </p>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
                Nueva Cotización Recibida
              </h1>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.65);">
                ${datetimeLong}
              </p>
            </td>
          </tr>

          <!-- Alerta de nuevo lead -->
          <tr>
            <td style="background:${LIGHT_GREEN};padding:14px 40px;border-bottom:1px solid ${BORDER};">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:8px;background:${GREEN};border-radius:4px;"></td>
                  <td style="padding-left:14px;">
                    <p style="margin:0;font-size:13px;font-weight:600;color:${DARK_GREEN};">
                      &#128276;&nbsp; Un prospecto ha completado el formulario de cotización en cosafeconsultoria.com
                    </p>
                    <p style="margin:4px 0 0;font-size:12px;color:${INK_MID};">
                      Responder en menos de 24 horas hábiles para maximizar la tasa de conversión.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Cuerpo -->
          <tr>
            <td style="padding:36px 40px;">

              <!-- Sección: Datos del prospecto -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding-bottom:12px;border-bottom:2px solid ${GREEN};">
                    <p style="margin:0;font-size:11px;font-family:monospace;letter-spacing:0.12em;text-transform:uppercase;color:${GREEN};font-weight:600;">
                      01 &mdash; Datos del Prospecto
                    </p>
                  </td>
                </tr>
                <tr><td style="height:16px;"></td></tr>

                <!-- Nombre -->
                <tr>
                  <td style="padding:12px 16px;background:${BG};border-radius:8px;border:1px solid ${BORDER};margin-bottom:10px;">
                    <p style="margin:0 0 3px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:${INK_MID};">Nombre completo</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:${INK};">${escapeHtml(name)}</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>

                <!-- Dos columnas: email + empresa -->
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="48%" style="padding:12px 16px;background:${BG};border-radius:8px;border:1px solid ${BORDER};vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:${INK_MID};">Correo electrónico</p>
                          <a href="mailto:${escapeHtml(email)}" style="margin:0;font-size:14px;font-weight:600;color:${GREEN};text-decoration:none;">${escapeHtml(email)}</a>
                        </td>
                        <td width="4%"></td>
                        <td width="48%" style="padding:12px 16px;background:${BG};border-radius:8px;border:1px solid ${BORDER};vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:${INK_MID};">Empresa</p>
                          <p style="margin:0;font-size:14px;font-weight:600;color:${INK};">${company ? escapeHtml(company) : '<span style="color:#a8bfb3;font-style:italic;font-weight:400;">No especificada</span>'}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Sección: Servicio solicitado -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding-bottom:12px;border-bottom:2px solid ${GREEN};">
                    <p style="margin:0;font-size:11px;font-family:monospace;letter-spacing:0.12em;text-transform:uppercase;color:${GREEN};font-weight:600;">
                      02 &mdash; Servicio de Interés
                    </p>
                  </td>
                </tr>
                <tr><td style="height:16px;"></td></tr>
                <tr>
                  <td style="padding:14px 20px;background:${LIGHT_GREEN};border-radius:8px;border:1px solid #c6e8d5;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:10px;height:10px;background:${GREEN};border-radius:50%;"></td>
                        <td style="padding-left:12px;font-size:15px;font-weight:700;color:${DARK_GREEN};">
                          ${service ? escapeHtml(service) : '<span style="color:#7a9484;font-style:italic;font-weight:400;">No especificado</span>'}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${hasAddress ? /* html */`
              <!-- Sección 03: Dirección -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding-bottom:12px;border-bottom:2px solid ${GREEN};">
                    <p style="margin:0;font-size:11px;font-family:monospace;letter-spacing:0.12em;text-transform:uppercase;color:${GREEN};font-weight:600;">
                      03 &mdash; Dirección de Instalación
                    </p>
                  </td>
                </tr>
                <tr><td style="height:16px;"></td></tr>

                <!-- Dirección completa -->
                <tr>
                  <td style="padding:12px 16px;background:${BG};border-radius:8px;border:1px solid ${BORDER};margin-bottom:10px;">
                    <p style="margin:0 0 3px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:${INK_MID};">Dirección completa</p>
                    <p style="margin:0;font-size:14px;font-weight:600;color:${INK};">${escapeHtml(addressParsed.direccion_completa)}</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>

                <!-- Ciudad / Estado / CP / País en grid 2×2 -->
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="48%" style="padding:10px 14px;background:${BG};border-radius:8px;border:1px solid ${BORDER};vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:${INK_MID};">Ciudad</p>
                          <p style="margin:0;font-size:13px;font-weight:600;color:${INK};">${addressParsed.ciudad ? escapeHtml(addressParsed.ciudad) : '<span style="color:#a8bfb3;font-style:italic;font-weight:400;">—</span>'}</p>
                        </td>
                        <td width="4%"></td>
                        <td width="48%" style="padding:10px 14px;background:${BG};border-radius:8px;border:1px solid ${BORDER};vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:${INK_MID};">Estado</p>
                          <p style="margin:0;font-size:13px;font-weight:600;color:${INK};">${addressParsed.estado ? escapeHtml(addressParsed.estado) : '<span style="color:#a8bfb3;font-style:italic;font-weight:400;">—</span>'}</p>
                        </td>
                      </tr>
                      <tr><td colspan="3" style="height:8px;"></td></tr>
                      <tr>
                        <td width="48%" style="padding:10px 14px;background:${BG};border-radius:8px;border:1px solid ${BORDER};vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:${INK_MID};">Código Postal</p>
                          <p style="margin:0;font-size:13px;font-weight:600;color:${INK};">${addressParsed.codigo_postal ? escapeHtml(addressParsed.codigo_postal) : '<span style="color:#a8bfb3;font-style:italic;font-weight:400;">—</span>'}</p>
                        </td>
                        <td width="4%"></td>
                        <td width="48%" style="padding:10px 14px;background:${BG};border-radius:8px;border:1px solid ${BORDER};vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:${INK_MID};">País</p>
                          <p style="margin:0;font-size:13px;font-weight:600;color:${INK};">${addressParsed.pais ? escapeHtml(addressParsed.pais) : '<span style="color:#a8bfb3;font-style:italic;font-weight:400;">—</span>'}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${mapsUrl ? /* html */`
                <tr><td style="height:12px;"></td></tr>
                <tr>
                  <td>
                    <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer"
                       style="display:inline-flex;align-items:center;gap:6px;padding:9px 18px;background:${FOREST};color:#ffffff;text-decoration:none;border-radius:9999px;font-size:12px;font-weight:600;font-family:monospace;">
                      &#128205;&nbsp; Ver en Google Maps
                    </a>
                  </td>
                </tr>` : ""}

              </table>
              ` : ""}

              <!-- Sección: Mensaje -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding-bottom:12px;border-bottom:2px solid ${GREEN};">
                    <p style="margin:0;font-size:11px;font-family:monospace;letter-spacing:0.12em;text-transform:uppercase;color:${GREEN};font-weight:600;">
                      ${msgSecNum} &mdash; Mensaje del Prospecto
                    </p>
                  </td>
                </tr>
                <tr><td style="height:16px;"></td></tr>
                <tr>
                  <td style="padding:20px 24px;background:${BG};border-radius:8px;border:1px solid ${BORDER};border-left:4px solid ${GREEN};">
                    <p style="margin:0;font-size:14px;color:${INK};line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
                  </td>
                </tr>
              </table>

              <!-- Acciones rápidas -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:12px;">
                          <a href="mailto:${escapeHtml(email)}?subject=Re: Cotización ${escapeHtml(service || '')}&body=Estimado/a ${escapeHtml(name)},%0A%0AEn relación a su consulta sobre ${escapeHtml(service || 'nuestros servicios')}..."
                             style="display:inline-block;padding:12px 28px;background:${GREEN};color:#ffffff;text-decoration:none;border-radius:9999px;font-size:13px;font-weight:700;letter-spacing:0.01em;">
                            &#9993;&nbsp; Responder ahora
                          </a>
                        </td>
                        <td>
                          <a href="tel:${escapeHtml(email)}"
                             style="display:inline-block;padding:12px 28px;background:#ffffff;color:${GREEN};text-decoration:none;border-radius:9999px;font-size:13px;font-weight:700;border:2px solid ${GREEN};">
                            Ver en CRM
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid ${BORDER};margin:0;" />
            </td>
          </tr>

          <!-- Metadatos técnicos -->
          <tr>
            <td style="padding:20px 40px;background:${BG};">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:10px;font-family:monospace;letter-spacing:0.12em;text-transform:uppercase;color:${INK_MID};">
                      Metadatos del envío
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:50%;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:10px;font-family:monospace;color:#a8bfb3;text-transform:uppercase;letter-spacing:0.08em;">Fecha y hora</p>
                          <p style="margin:0;font-size:11px;font-family:monospace;color:${INK_MID};">${datetimeLong}</p>
                        </td>
                        <td style="width:50%;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:10px;font-family:monospace;color:#a8bfb3;text-transform:uppercase;letter-spacing:0.08em;">Origen</p>
                          <p style="margin:0;font-size:11px;font-family:monospace;color:${INK_MID};">cosafeconsultoria.com — Formulario de Contacto</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${FOREST};padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#ffffff;letter-spacing:-0.01em;">
                co<span style="color:${GREEN};">SAFE</span> Consultoría EHSS
              </p>
              <p style="margin:0 0 8px;font-size:11px;color:rgba(255,255,255,0.45);font-family:monospace;">
                Matamoros, Tamaulipas, México &nbsp;·&nbsp; +52 868 354 6152 &nbsp;·&nbsp; cosafeconsultoria.com
              </p>
              <p style="margin:8px 0 0;font-size:10px;color:rgba(255,255,255,0.25);font-family:monospace;">
                Este correo fue generado automáticamente por el sistema de cotizaciones de coSAFE.<br />
                No responder directamente a este remitente — usar el botón "Responder ahora" de arriba.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

/**
 * Enmascara una dirección de email para logs — protección de datos personales.
 * Ejemplo: "juan.perez@empresa.com" → "j***@empresa.com"
 * @param {string} email
 * @returns {string}
 */
function maskEmail(email = "") {
  const [user = "", domain = ""] = email.split("@");
  const masked = user.length <= 1
    ? "*".repeat(user.length)
    : user[0] + "*".repeat(Math.min(user.length - 1, 4));
  return `${masked}@${domain}`;
}

/**
 * Escapa caracteres HTML para evitar XSS en el cuerpo del email
 */
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Controllers ────────────────────────────────────────────────────────────

export const getSiteContent = (_req, res) => {
  try {
    res.json({ success: true, data: loadContent() });
  } catch {
    res.status(500).json({ success: false, error: "Could not load content" });
  }
};

export const getProjects = (_req, res) => {
  try {
    res.json({ success: true, data: loadProjects() });
  } catch {
    res.status(500).json({ success: false, error: "Could not load projects" });
  }
};

export const submitContact = async (req, res) => {
  const { name, email, company, service, message, address } = req.body ?? {};

  // ── Validación básica ────────────────────────────────────────────────────
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      success: false,
      error: "Los campos nombre, email y mensaje son obligatorios.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "El formato del correo electrónico no es válido.",
    });
  }

  // ── Parsear dirección (opcional) ─────────────────────────────────────────
  // address puede ser null (campo no completado) o el objeto de Google Places
  const addressParsed = address?.formatted_address
    ? {
        direccion_completa: address.formatted_address,
        lat               : address.lat   ?? null,
        lng               : address.lng   ?? null,
        ...parseAddressComponents(address.components ?? []),
      }
    : null;

  const submittedAt = new Date();
  const subject     = buildSubject({ service, company, date: submittedAt });

  // ── Log en consola — datos minimizados (LFPDPPP / GDPR Art. 5.1.c) ──────
  // No se registran datos personales en claro (email completo, dirección exacta).
  console.log("\n[Contact Form] Nueva cotización recibida");
  console.log("  Subject :", subject);
  console.log("  De      :", name, `<${maskEmail(email)}>`);
  console.log("  Empresa :", company || "—");
  console.log("  Servicio:", service || "—");
  if (addressParsed) {
    console.log("  Ciudad   :", addressParsed.ciudad ?? "—", "/", addressParsed.estado ?? "—");
    // Coordenadas no se registran en log (dato de localización sensible)
  }
  console.log("  Hora    :", submittedAt.toISOString(), "\n");

  // ── Envío con Resend ─────────────────────────────────────────────────────
  try {
    const { data, error } = await getResend().emails.send({
      from   : process.env.RESEND_FROM ?? "cotizaciones@cosafeconsultoria.com",
      to     : [process.env.RESEND_TO  ?? "administracion@cosafeconsultoria.com"],
      replyTo: email,
      subject,
      html   : buildEmailHtml({ name, email, company, service, message, submittedAt, addressParsed }),
    });

    if (error) {
      console.error("[Resend Error]", JSON.stringify(error, null, 2));
      return res.status(500).json({
        success: false,
        error: "No se pudo enviar el correo. Intenta de nuevo más tarde.",
      });
    }

    console.log("[Resend OK] Email ID:", data?.id, "| Subject:", subject);

    return res.status(200).json({
      success: true,
      message: "¡Mensaje enviado! Te contactaremos en menos de 24 horas hábiles.",
    });

  } catch (err) {
    console.error("[submitContact] Error inesperado:", err.message ?? err);
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor. Intenta de nuevo más tarde.",
    });
  }
};
