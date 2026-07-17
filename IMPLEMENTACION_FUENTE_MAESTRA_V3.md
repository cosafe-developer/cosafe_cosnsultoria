# Matriz de ejecución — Fuente Maestra CoSAFE v3

Fuente única: `Contenido_Sitio_CoSAFE_v3_Fuente_Maestra.md`.

Esta matriz separa contenido público, comportamiento frontend, requisitos backend y datos pendientes. Las notas internas y afirmaciones sin respaldo no se publican como hechos.

| Orden | Bloque maestro | Ejecución |
|---:|---|---|
| 1 | Objetivo del sitio | Navegación simple, catálogo macro/micro y cotizador guiado implementados. |
| 2 | Tono de comunicación | Copy concreto y técnico; se retiraron promesas y frases genéricas. |
| 3 | Navegación principal | Unificada mediante un único contrato en `main.js`, incluyendo acciones móviles. |
| 4 | Home | Hero, ocho accesos, experiencia confirmable, sectores, alcance, destacados, proceso, seguimiento, cobertura, CTA y FAQ implementados en orden. |
| 5 | Servicios | Seis categorías EHSS, línea transversal y dos complementarias; filtros y matriz completa desde `catalog.js`. |
| 6–13 | Fichas detalladas | Se cargan directamente desde la fuente maestra, en orden, dentro de `service.html`; incluyen qué resuelve, alcance, datos, entregables, modalidad, botones y advertencias. |
| 14 | Bloques comerciales | Se cargan desde la fuente maestra después de las fichas. |
| 15 | FAQ de Servicios / formularios dinámicos | FAQ se carga desde la fuente; todos los microservicios y campos condicionales están en `catalog.js` y `quote.js`. |
| 16 | Precio y estimación | El frontend no inventa tarifas. Muestra “Precio sujeto a revisión de alcance”. Las unidades quedan reservadas para configuración backend. |
| 17 | Reglas comerciales | Recargos, descuentos, impuestos, vigencia, anticipo y pago no se muestran hasta que exista política aprobada. Requiere backend. |
| 18 | Estados de cotización | Taxonomía conservada como requisito backend: borrador, enviada, revisión, incompleta, visita, preparación, cotizada, aprobada, rechazada, vencida, convertida y cerrada. |
| 19 | Panel administrativo | Requiere aplicación, autenticación, base de datos, almacenamiento de archivos y permisos; no se simula en el sitio público estático. |
| 20 | Conceptos de cotización | Esquema conservado para backend; el frontend recopila categoría, servicio, cantidad/contexto, lugar, fechas y requisitos. |
| 21 | Mensajes del sistema | Guardado, información incompleta, archivo inválido, visita/precio sujeto a revisión y confirmación implementados; vencimiento requiere backend. |
| 22 | Contacto | Datos, mapa, botones, formulario rápido, archivo, ubicación y advertencia de cobertura US implementados. |
| 23 | Footer | Contrato único global con cuatro columnas, año dinámico y datos no confirmados marcados como pendientes. |
| 24 | SEO | Títulos y descripciones aplicados en Inicio, Servicios, Acerca de y Cotizar. |
| 25 | URLs | La estructura actual conserva `.html`; la migración a rutas limpias requiere configuración del servidor. |
| 26 | Contenido visual | Se reutilizan activos locales; no se agregan sellos o acreditaciones nuevas. Las fotos deben validarse como reales y autorizadas antes de publicación. |
| 27 | Información pendiente | Ningún dato pendiente se completa por inferencia. Horario, cobertura exacta, catálogos, evidencias, acreditaciones, privacidad y políticas permanecen marcados o fuera de publicación. |
| 28 | Mensaje comercial | Integrado en hero, secciones principales y footer. |

## Dependencias para completar la parte no estática

- Backend y base de datos para folios persistentes, estados e historial.
- Almacenamiento seguro y análisis de archivos.
- Autenticación y permisos del panel administrativo.
- Servicio de correo y generación de PDF/Excel.
- Políticas comerciales aprobadas.
- Aviso de privacidad y responsable de datos confirmados.
- Evidencias y catálogos listados en el apartado 27.
