(function () {
    'use strict';
    var catalog = window.CoSAFECatalog;
    var target = document.getElementById('serviceCatalog');
    if (!catalog || !target) return;
    var status = document.getElementById('catalogStatus');
    var groupLabels = { principal: 'EHSS', transversal: 'Trámites', complementario: 'Complementarios' };

    function render(filter) {
        var keys = Object.keys(catalog).filter(function (key) {
            return filter === 'all' || catalog[key].group === filter;
        });
        target.innerHTML = keys.map(function (key, index) {
            var item = catalog[key];
            var services = item.services.map(function (service) { return '<li>' + escapeHtml(service) + '</li>'; }).join('');
            return '<article class="catalog-card" id="' + key + '" data-reveal>' +
                '<div class="catalog-card__head"><div class="catalog-card__meta"><span class="catalog-card__index">' + String(index + 1).padStart(2, '0') + '</span><span>' + escapeHtml(groupLabels[item.group] || item.group) + '</span></div><h2>' + escapeHtml(item.title) + '</h2><p>' + escapeHtml(item.description) + '</p></div>' +
                '<details><summary>Ver ' + item.services.length + ' servicios específicos <i class="bi bi-plus"></i></summary><ul>' + services + '</ul></details>' +
                '<a class="btn btn-primary" href="quote.html?category=' + key + '">Cotizar esta categoría</a>' +
                '</article>';
        }).join('');
        target.querySelectorAll('.catalog-card details summary').forEach(function (summary) {
            var count = summary.textContent.match(/\d+/);
            summary.innerHTML = '<span>Explorar ' + (count ? count[0] : '') + ' servicios</span><i class="bi bi-arrow-down-short" aria-hidden="true"></i>';
        });
        target.querySelectorAll('.catalog-card > .btn').forEach(function (button) {
            button.innerHTML = 'Ver esta categoría <i class="bi bi-arrow-up-right" aria-hidden="true"></i>';
        });
        if (status) status.textContent = filter === 'all' ? 'Mostrando todas las rutas de atención' : 'Mostrando ' + (groupLabels[filter] || filter);
        target.querySelectorAll('[data-reveal]').forEach(function (element) {
            requestAnimationFrame(function () { element.classList.add('is-revealed'); });
        });
    }

    document.querySelectorAll('[data-catalog-filter]').forEach(function (button) {
        button.addEventListener('click', function () {
            document.querySelectorAll('[data-catalog-filter]').forEach(function (item) {
                item.classList.toggle('is-active', item === button);
                item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
            });
            render(button.dataset.catalogFilter);
        });
    });
    render('all');

    function escapeHtml(value) {
        return value.replace(/[&<>"']/g, function (character) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character];
        });
    }

    function inlineMarkdown(value) {
        return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>');
    }

    function renderMasterDetails(markdown) {
        var start = markdown.indexOf('# 6. Fichas detalladas:');
        var endMatch = markdown.slice(start).match(/^# (?:14|12)\./m);
        var end = endMatch ? start + endMatch.index : -1;
        if (start < 0 || end < 0) throw new Error('No se encontró el bloque de fichas 6–13.');
        var lines = markdown.slice(start, end).split(/\r?\n/);
        var html = '';
        var listOpen = false;
        var detailOpen = false;
        var skipClientSection = false;
        function normalized(value) {
            return value.normalize ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : value.toLowerCase();
        }
        function closeList() { if (listOpen) { html += '</ul>'; listOpen = false; } }
        function closeDetail() { closeList(); if (detailOpen) { html += '</div></details>'; detailOpen = false; } }

        lines.forEach(function (rawLine) {
            var line = rawLine.trim();
            if (!line || line === '---') { closeList(); return; }
            if (/^#\s/.test(line)) {
                skipClientSection = false;
                closeDetail();
                html += '<h2 class="master-category">' + inlineMarkdown(line.replace(/^#\s+/, '')) + '</h2>';
            } else if (/^##\s/.test(line)) {
                skipClientSection = false;
                closeDetail();
                html += '<details class="master-sheet"><summary><span>' + inlineMarkdown(line.replace(/^##\s+/, '')) + '</span><i class="bi bi-plus"></i></summary><div class="master-sheet__body">';
                detailOpen = true;
            } else if (/^###\s/.test(line)) {
                var subsection = normalized(line.replace(/^###\s+/, ''));
                skipClientSection = ((subsection.indexOf('informacion') === 0 || subsection.indexOf('informaci') === 0) && subsection.indexOf('cotiz') !== -1) || subsection === 'campos' || subsection === 'texto para el sitio' || subsection.indexOf('regla de publicacion') === 0 || subsection.indexOf('regla de cotizacion') === 0;
                closeList();
                if (!skipClientSection) html += '<h3>' + inlineMarkdown(line.replace(/^###\s+/, '')) + '</h3>';
            } else if (/^####\s/.test(line)) {
                if (skipClientSection) return;
                closeList();
                html += '<h4>' + inlineMarkdown(line.replace(/^####\s+/, '')) + '</h4>';
            } else if (/^-\s/.test(line)) {
                if (skipClientSection) return;
                if (!listOpen) { html += '<ul>'; listOpen = true; }
                html += '<li>' + inlineMarkdown(line.replace(/^-\s+/, '')) + '</li>';
            } else if (/^>\s?/.test(line)) {
                if (skipClientSection) return;
                closeList();
                html += '<aside class="master-note">' + inlineMarkdown(line.replace(/^>\s?/, '')) + '</aside>';
            } else if (/^\*\*Botón:\*\*/.test(line)) {
                closeList();
                html += '<a class="btn btn-primary" href="quote.html">' + inlineMarkdown(line.replace(/^\*\*Botón:\*\*\s*/, '').replace(/`/g, '')) + '</a>';
            } else {
                if (skipClientSection) return;
                closeList();
                html += '<p>' + inlineMarkdown(line) + '</p>';
            }
        });
        closeDetail();
        return html;
    }

    var masterTarget = document.getElementById('masterServiceDetails');
    if (masterTarget) {
        fetch('Contenido_Sitio_CoSAFE_v3_Fuente_Maestra.md').then(function (response) {
            if (!response.ok) throw new Error('Fuente no disponible.');
            return response.text();
        }).then(function (markdown) {
            masterTarget.innerHTML = renderMasterDetails(markdown);
        }).catch(function () {
            masterTarget.innerHTML = '<div class="notice-box"><i class="bi bi-info-circle"></i><p>Las fichas detalladas requieren servir el proyecto mediante HTTP. El catálogo principal permanece disponible.</p></div>';
        });
    }
})();
