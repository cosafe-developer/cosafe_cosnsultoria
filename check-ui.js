const { chromium } = require('playwright');
const path = require('path');
const fs   = require('fs');

const BASE = 'https://cosafeconsultoria.com';
const PAGES = [
  { name: 'Inicio',        url: '/' },
  { name: 'Acerca de',     url: '/about.html' },
  { name: 'Servicios',     url: '/service.html' },
  { name: 'Proyectos',     url: '/project.html' },
  { name: 'Equipo',        url: '/team.html' },
  { name: 'Testimonios',   url: '/testimonial.html' },
  { name: 'Feature',       url: '/feature.html' },
  { name: 'Contacto',      url: '/contact.html' },
  { name: '404',           url: '/pagina-que-no-existe.html' },
];

const SHOTS_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SHOTS_DIR)) fs.mkdirSync(SHOTS_DIR);

const issues = [];
function log(type, page, msg) {
  const prefix = type === 'OK' ? '✓' : type === 'WARN' ? '⚠' : '✗';
  console.log(`  ${prefix} [${type}] ${page}: ${msg}`);
  if (type !== 'OK') issues.push({ type, page, msg });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36'
  });

  for (const p of PAGES) {
    const page = await context.newPage();
    const jsErrors = [];
    const failedReqs = [];

    page.on('console', msg => {
      if (msg.type() === 'error') jsErrors.push(msg.text());
    });
    page.on('requestfailed', req => {
      const url = req.url();
      if (!url.includes('favicon') && !url.includes('google-analytics')) {
        failedReqs.push(`${req.failure()?.errorText} → ${url.split('/').slice(-2).join('/')}`);
      }
    });

    console.log(`\n[${p.name}] ${BASE}${p.url}`);
    try {
      const res = await page.goto(BASE + p.url, { waitUntil: 'networkidle', timeout: 20000 });
      const status = res?.status();

      // HTTP status
      if (status >= 400) {
        log('ERROR', p.name, `HTTP ${status}`);
      } else {
        log('OK', p.name, `HTTP ${status}`);
      }

      // Title
      const title = await page.title();
      if (!title || title.length < 5) log('WARN', p.name, `Título vacío o muy corto: "${title}"`);
      else log('OK', p.name, `Título: "${title}"`);

      // Navbar visible
      const navbar = await page.$('nav.navbar');
      if (!navbar) log('WARN', p.name, 'Navbar no encontrado');
      else {
        const visible = await navbar.isVisible();
        if (!visible) log('WARN', p.name, 'Navbar no visible'); else log('OK', p.name, 'Navbar visible');
      }

      // Spinner gone after load
      const spinner = await page.$('#spinner');
      if (spinner) {
        const spinnerClass = await spinner.getAttribute('class');
        if (spinnerClass && spinnerClass.includes('show')) log('WARN', p.name, 'Spinner sigue visible después de carga');
        else log('OK', p.name, 'Spinner oculto correctamente');
      }

      // Images: check for broken ones
      const brokenImgs = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
          .filter(img => !img.complete || img.naturalWidth === 0)
          .map(img => img.src.split('/').slice(-2).join('/'));
      });
      if (brokenImgs.length > 0) log('WARN', p.name, `Imágenes rotas (${brokenImgs.length}): ${brokenImgs.slice(0,3).join(', ')}`);
      else log('OK', p.name, 'Todas las imágenes cargaron');

      // JS errors
      if (jsErrors.length > 0) {
        const filtered = jsErrors.filter(e => !e.includes('favicon') && !e.includes('font'));
        if (filtered.length > 0) log('WARN', p.name, `Errores JS (${filtered.length}): ${filtered.slice(0,2).join(' | ')}`);
        else log('OK', p.name, 'Sin errores JS relevantes');
      } else {
        log('OK', p.name, 'Sin errores JS');
      }

      // Failed requests (images, css, js)
      if (failedReqs.length > 0) log('WARN', p.name, `Recursos fallidos: ${failedReqs.slice(0,3).join(', ')}`);

      // Footer present
      const footer = await page.$('.footer, footer');
      if (!footer) log('WARN', p.name, 'Footer no encontrado');
      else log('OK', p.name, 'Footer presente');

      // Mobile viewport check
      await page.setViewportSize({ width: 375, height: 812 });
      const mobileNav = await page.$('.navbar-toggler');
      if (!mobileNav) log('WARN', p.name, 'Botón menú mobile no encontrado');
      else {
        const mobileVisible = await mobileNav.isVisible();
        if (mobileVisible) log('OK', p.name, 'Menú mobile visible en 375px');
        else log('WARN', p.name, 'Botón menú mobile no visible en 375px');
      }
      await page.setViewportSize({ width: 1280, height: 800 });

      // Screenshot
      const shotPath = path.join(SHOTS_DIR, `${p.name.replace(/\s/g,'-').toLowerCase()}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });
      log('OK', p.name, `Screenshot → screenshots/${path.basename(shotPath)}`);

    } catch (err) {
      log('ERROR', p.name, `Error al cargar: ${err.message.slice(0, 100)}`);
    }

    await page.close();
  }

  await browser.close();

  console.log('\n' + '='.repeat(60));
  if (issues.length === 0) {
    console.log('RESULTADO: Sin problemas detectados. Sitio OK.');
  } else {
    const errors = issues.filter(i => i.type === 'ERROR');
    const warns  = issues.filter(i => i.type === 'WARN');
    console.log(`RESULTADO: ${errors.length} errores, ${warns.length} advertencias`);
    if (errors.length > 0) {
      console.log('\nERRORES:');
      errors.forEach(i => console.log(`  ✗ ${i.page}: ${i.msg}`));
    }
    if (warns.length > 0) {
      console.log('\nADVERTENCIAS:');
      warns.forEach(i => console.log(`  ⚠ ${i.page}: ${i.msg}`));
    }
  }
  console.log('='.repeat(60));
  process.exit(issues.filter(i=>i.type==='ERROR').length > 0 ? 1 : 0);
})();
