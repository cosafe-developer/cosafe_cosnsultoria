# coSAFE Consultoría — Documentación del Proyecto

Sitio web institucional y plataforma de cotización para **coSAFE Consultoría EHSS**,
empresa de consultoría en Salud, Sostenibilidad, Seguridad y Ambiente con sede en
Matamoros, Tamaulipas, México.

---

## Arquitectura

```
Cosafe/
├── coSAFEConsultoria_Backend/     Express.js REST API  (puerto 3001)
└── coSAFEConsultoria_Frontend/    React + Vite SPA     (puerto 5173)
    └── public/img/                Imágenes estáticas
```

El frontend consume la API del backend vía proxy Vite en desarrollo.
En producción, ambos se despliegan independientemente.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, React Router v6, Vite 5 |
| Estilos | Tailwind CSS 3 con tema personalizado |
| Animaciones | GSAP 3 + ScrollTrigger |
| Iconos | Lucide React |
| Backend | Node.js + Express 4 (ESModules) |
| Email | Resend API |
| Mapas | Google Maps / Places API (lazy load) |
| Fuentes | Google Fonts (Space Grotesk, Inter, JetBrains Mono) |

---

## Comandos de desarrollo

```bash
# Backend (desde /coSAFEConsultoria_Backend)
npm run dev       # Node --watch, recarga en cambios

# Frontend (desde /coSAFEConsultoria_Frontend)
npm run dev       # Vite dev server con HMR
npm run build     # Build de producción en /dist
npm run preview   # Preview del build
```

---

## Variables de entorno

### Backend (`coSAFEConsultoria_Backend/.env`)
Ver `coSAFEConsultoria_Backend/.env.example` para la plantilla completa.

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `PORT` | Puerto del servidor (default: 3001) | No |
| `RESEND_API_KEY` | API key de Resend | Sí |
| `RESEND_FROM` | Email remitente verificado en Resend | Sí |
| `RESEND_TO` | Email destino de cotizaciones | Sí |
| `ALLOWED_ORIGINS` | Orígenes CORS, separados por coma | No (default: localhost) |

### Frontend (`coSAFEConsultoria_Frontend/.env`)
| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `VITE_GOOGLE_MAPS_API_KEY` | API key de Google Maps (Places) | Sí |

---

## Rutas de la aplicación

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `Home.jsx` | Landing page principal con todas las secciones |
| `/consultadof` | `ConsultaDOF.jsx` | Consultor del Diario Oficial de la Federación |

### Secciones de Home (anclas)
`#inicio` → `#servicios` → `#cosafe-soft` → `#noms` → `#nosotros` → `#proyectos` → `#contacto`

---

## API del Backend

Base URL: `http://localhost:3001`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/services` | Lista de servicios |
| GET | `/api/services/:slug` | Servicio por slug |
| GET | `/api/content` | Contenido del sitio |
| GET | `/api/content/projects` | Proyectos / casos de éxito |
| POST | `/api/contact` | Formulario de cotización |

### POST `/api/contact` — Payload
```json
{
  "name":    "string (requerido)",
  "email":   "string (requerido)",
  "company": "string (opcional)",
  "service": "string (opcional)",
  "message": "string (requerido)",
  "address": {
    "formatted_address": "string",
    "lat": "number",
    "lng": "number",
    "components": "array (Google Places)"
  }
}
```

---

## Estructura de componentes Frontend

```
src/
├── App.jsx                     Layout raíz + rutas
├── main.jsx                    Entry point, registra GSAP
├── context/
│   └── AppContext.jsx          Estado global: content, services, loading
├── hooks/
│   ├── useFetch.js             Fetcher genérico con estados data/loading/error
│   └── useGoogleMaps.js        Carga lazy del SDK de Google Maps
├── components/
│   ├── Navbar.jsx              Navbar fija con scroll-spy + menú mobile
│   ├── Footer.jsx              Footer con nav, redes, Aviso de Privacidad
│   └── ui/
│       ├── Button.jsx          Botón polimórfico (primary/outline/ghost/white)
│       ├── FloatingMenu.jsx    Botón flotante con 4 acciones rápidas
│       ├── PrivacyBanner.jsx   Banner de cookies/privacidad (LFPDPPP/GDPR)
│       ├── LoadingScreen.jsx   Pantalla de carga inicial
│       ├── SectionLabel.jsx    Etiqueta verde de sección
│       └── AddressAutocomplete.jsx  Autocompletado Google Places
└── pages/
    ├── Home.jsx                Composición de secciones
    └── ConsultaDOF.jsx         Consultor DOF con 3 tabs (Diarios/Indicadores/Notas)
```

---

## Sistema de diseño

### Paleta de colores
| Token | Valor | Uso |
|-------|-------|-----|
| `brand-green` | `#01A758` | Color primario — botones, acentos |
| `brand-dark` | `#016B3E` | Hover de brand-green |
| `brand-forest` | `#0f2d1a` | Navbar oscura, fondos oscuros |
| `brand-light` | `#e8f5ed` | Fondos tintados, badges |
| `ink` | `#0f1c14` | Headings |
| `ink-body` | `#1e2d25` | Texto de cuerpo |
| `ink-mid` | `#4a6358` | Texto secundario |
| `ui-border` | `#dde8e3` | Bordes de componentes |

### Tipografía
| Variable | Fuente | Uso |
|----------|--------|-----|
| `font-heading` | Space Grotesk | Títulos, botones |
| `font-body` | Inter | Texto de cuerpo |
| `font-mono` | JetBrains Mono | Labels, código, metadata |

### Clases de utilidad clave
- `.btn-primary / .btn-outline / .btn-ghost / .btn-white` — Variantes de botón
- `.card / .card-interactive` — Tarjetas con sombra
- `.input-field` — Campos de formulario
- `.section-pad` — Padding estándar de secciones (6rem)
- `.gradient-brand` — Texto con degradado verde
- `.label-green` — Etiqueta pill verde (font-mono)

---

## Navegación entre rutas

El Navbar y Footer detectan la ruta actual (`useLocation`):
- **En `/`**: los links hacen scroll suave a la sección (`#section`).
- **En otras rutas**: navegan a `{ pathname: "/", hash: "#section" }`.

`Home.jsx` tiene un `useEffect` que al montar detecta el hash de la URL
y hace scroll al elemento correspondiente (para links que llegan de otras páginas).

---

## Cumplimiento normativo (GDPR / LFPDPPP / ePrivacy)

### Lo que aplica a este sitio

| Normativa | Aplica | Implementación |
|-----------|--------|----------------|
| LFPDPPP (México) | ✅ Sí | Aviso de privacidad en Footer, checkbox de consentimiento en formulario |
| GDPR Art. 13 (UE) | ✅ Parcial (visitantes EU) | Mismo aviso, mismo checkbox |
| ePrivacy Directive | ✅ Sí (Google Fonts/Maps) | `PrivacyBanner` — aviso de servicios de terceros, persistido en `localStorage` |
| Cookie Act | ✅ Informativo | El sitio no establece cookies propias; el banner cubre servicios de terceros |

### Lo que NO aplica
- **Tracking publicitario / remarketing**: no hay pixels ni analytics de terceros.
- **Cookies de sesión**: el sitio es stateless (no hay auth, no hay carrito).
- **Transferencias internacionales masivas**: los datos del formulario solo van a Resend (procesador con DPA disponible).

### Derechos ARCO
Email de contacto: `administracion@cosafeconsultoria.com`

---

## Consideraciones de producción

1. **CORS**: establecer `ALLOWED_ORIGINS=https://cosafeconsultoria.com` en el servidor.
2. **HTTPS**: obligatorio en producción (requerido por GDPR y buenas prácticas).
3. **Google Maps API Key**: restringir por dominio en Google Cloud Console.
4. **Resend API Key**: rotar periódicamente, nunca commitear al repositorio.
5. **Rate limiting**: considerar `express-rate-limit` en `/api/contact` para evitar spam.
6. **Logs**: los logs del servidor no registran datos personales completos (email enmascarado, sin dirección exacta ni coordenadas).
