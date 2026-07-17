(function () {
    'use strict';

    var catalog = {
        'proteccion-civil': ['Programa Interno de Protección Civil', 'Simulacros', 'Vistos buenos', 'Asesoría de cumplimiento', 'Dictámenes', 'Dictamen estructural', 'Dictamen eléctrico', 'Licencia de funcionamiento', 'Uso de suelo', 'Manifiesto de propiedad', 'Trámite municipal', 'Trámite estatal', 'Seguimiento ante autoridad'],
        'seguridad-industrial': ['Evaluación técnica industrial', 'Estudio técnico', 'Revisión de cumplimiento STPS', 'Dictamen técnico', 'Dictamen estructural', 'Dictamen eléctrico', 'Diagnóstico de necesidades', 'Atención de observaciones', 'Expediente para auditoría o revisión'],
        'ambiental': ['Estudio ambiental', 'Evaluación de cumplimiento', 'Trámite ambiental', 'Integración documental', 'Seguimiento ante autoridad', 'Regularización ambiental', 'Desarrollo urbano', 'Medio ambiente', 'Otro estudio o trámite'],
        'salud': ['Médico industrial', 'Enfermería industrial', 'Atención médica laboral', 'Primer contacto', 'Seguimiento de trabajadores', 'Exámenes médicos', 'Exámenes periódicos', 'Evaluación ocupacional', 'Control de resultados', 'Programa de salud', 'Administración de incapacidades', 'Campaña de salud', 'Promoción de la salud', 'Paramédico', 'Psicología', 'Nutrición', 'Vacunación para viajeros', 'Atención de emergencias', 'Canalización o traslado hospitalario'],
        'epp': ['Venta', 'Suministro empresarial', 'Asesoría de selección', 'Identificación de necesidades', 'Recomendación por riesgo o actividad', 'Suministro recurrente'],
        'extintores': ['Asesoría', 'Identificación de necesidades', 'Selección de equipo', 'Venta', 'Suministro', 'Recarga', 'Reacondicionamiento', 'Recarga periódica', 'Mantenimiento', 'Inspección', 'Revisión preventiva', 'Verificación', 'Seguimiento', 'Señalización', 'Asesoría de ubicación'],
        'tramites': ['Licencia de funcionamiento', 'Uso de suelo', 'Visto bueno', 'Manifiesto de propiedad', 'Dictamen', 'Trámite municipal', 'Trámite estatal', 'Seguimiento ante autoridad', 'Otro trámite'],
        'capacitacion': ['Curso en instalaciones del cliente', 'Curso para grupo cerrado', 'Curso abierto', 'Programa anual de capacitación', 'Capacitación de brigadas', 'Capacitación de seguridad, salud o medio ambiente', 'Evidencia, evaluación y constancias'],
        'intendencia': ['Personal de intendencia por turno', 'Cobertura temporal', 'Servicio recurrente', 'Suministros de limpieza', 'Servicio integral de personal más suministros'],
        'no-seguro': ['Necesito ayuda para clasificar mi solicitud', 'Otro']
    };

    if (window.CoSAFECatalog) {
        Object.keys(window.CoSAFECatalog).forEach(function (key) {
            catalog[key] = window.CoSAFECatalog[key].services.slice();
        });
    }

    var fields = {
        'proteccion-civil': ['Tipo de trámite o servicio', 'Municipio', 'Tipo de inmueble', 'Giro', 'Superficie', 'Niveles', 'Número de trabajadores', 'Turnos', 'Autoridad', 'Fecha límite', 'Documentación actual', 'Programa anterior', 'Planos', 'Observaciones', '¿Requiere visita?', 'Número de ubicaciones'],
        'tramites': ['Tipo de trámite o servicio', 'Municipio', 'Estado actual del expediente', 'Autoridad', 'Giro', 'Tipo de inmueble', 'Fecha límite', 'Documentos disponibles', 'Observaciones', 'Número de ubicaciones'],
        'salud': ['Tipo de servicio', 'Número de trabajadores', 'Turnos', 'Horario', 'Días por semana', 'Duración', 'Fecha de inicio', 'Consultorio disponible', 'Equipo disponible', 'Actividades requeridas', 'Reportes', 'Personal requerido', 'Número de pacientes o participantes', 'Tipo de examen o campaña'],
        'seguridad-industrial': ['Tipo de estudio', 'Área o proceso', 'Superficie', 'Número de equipos', 'Personal expuesto', 'Requerimiento recibido', 'Norma o referencia, si se conoce', 'Planos', 'Fotografías', 'Fecha límite', 'Visita requerida'],
        'ambiental': ['Tipo de estudio o trámite', 'Giro', 'Proceso', 'Insumos', 'Residuos', 'Emisiones', 'Descargas', 'Autoridad', 'Estado actual', 'Documentos', 'Fecha límite', 'Ubicación'],
        'epp': ['Producto', 'Categoría', 'Cantidad', 'Talla', 'Color', 'Marca', 'Especificación', 'Uso', 'Frecuencia', 'Entrega', 'Número de ubicaciones', 'Requiere asesoría', 'Listado disponible'],
        'extintores': ['Tipo de servicio', 'Cantidad', 'Tipo de extintor', 'Capacidad', 'Marca', 'Fecha de fabricación', 'Último mantenimiento', 'Estado', 'Ubicación', 'Recolección', 'Entrega', 'Instalación', 'Señalización', 'Gabinete', 'Número de sucursales', 'Inventario disponible', 'Fotografías'],
        'capacitacion': ['Tema o necesidad', 'Tipo de curso', 'Número de participantes', 'Puestos o áreas', 'Modalidad', 'Ciudad, estado y país', 'Fecha', 'Horario', 'Duración', 'Número de grupos', 'Idioma', 'Evaluación requerida', 'Constancia o evidencia requerida', 'Equipo audiovisual', 'Requisitos de acceso', 'Programa anual o servicio único'],
        'intendencia': ['Tipo de servicio', 'Número de personas', 'Turnos', 'Horarios', 'Días por semana', 'Fecha de inicio', 'Duración', 'Tipo de instalación', 'Superficie', 'Número de edificios o niveles', 'Actividades requeridas', 'Supervisión', 'Uniforme o EPP requerido', 'Materiales del cliente', 'Suministros requeridos', 'Consumo estimado', 'Número de ubicaciones', 'País, estado y ciudad', 'Requisitos de acceso'],
        'no-seguro': ['Describe brevemente qué necesitas', 'Ubicación', 'Fecha requerida', 'Número de ubicaciones']
    };

    var form = document.getElementById('quoteForm');
    if (!form) return;
    var currentStep = 1;
    var selectedFiles = [];
    var draftValues = null;
    var steps = Array.prototype.slice.call(document.querySelectorAll('.quote-step'));
    var progressItems = Array.prototype.slice.call(document.querySelectorAll('#quoteProgress li'));
    var nextButton = document.getElementById('nextStep');
    var prevButton = document.getElementById('prevStep');
    var actions = document.getElementById('quoteActions');
    var errorBox = document.getElementById('formError');

    function selectedCategory() {
        var input = form.querySelector('[name="categoria"]:checked');
        return input ? input.value : '';
    }

    function safeId(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    function renderServices() {
        var target = document.getElementById('microServices');
        var options = catalog[selectedCategory()] || [];
        target.innerHTML = options.map(function (service, index) {
            var id = 'micro-' + index + '-' + safeId(service);
            return '<label><input type="checkbox" name="servicios" value="' + service + '" id="' + id + '"><span>' + service + '</span></label>';
        }).join('') + '<label><input type="checkbox" name="servicios" value="Otro" id="micro-other"><span>Otro servicio</span></label>';
        if (draftValues && Array.isArray(draftValues.servicios)) {
            target.querySelectorAll('[name="servicios"]').forEach(function (input) { input.checked = draftValues.servicios.indexOf(input.value) !== -1; });
        }
    }

    function renderConditionalFields() {
        var target = document.getElementById('conditionalFields');
        target.innerHTML = (fields[selectedCategory()] || []).map(function (label, index) {
            var id = 'scope-' + index + '-' + safeId(label);
            return '<div><label for="' + id + '">' + label + '</label><input class="form-control" id="' + id + '" name="alcance_' + safeId(label) + '"></div>';
        }).join('');
        if (draftValues) {
            target.querySelectorAll('[name]').forEach(function (input) { if (draftValues[input.name]) input.value = draftValues[input.name]; });
        }
    }

    function validateCurrentStep() {
        errorBox.textContent = '';
        var active = steps[currentStep - 1];
        var invalid = active.querySelector(':invalid');
        if (invalid) {
            errorBox.textContent = invalid.validity.patternMismatch ? 'Revisa el formato del campo indicado.' : 'Completa los campos obligatorios para continuar.';
            invalid.focus();
            errorBox.focus();
            return false;
        }
        if (currentStep === 3 && !form.querySelector('[name="servicios"]:checked')) {
            errorBox.textContent = 'Selecciona al menos un servicio para continuar.';
            errorBox.focus();
            return false;
        }
        return true;
    }

    function showStep(step) {
        currentStep = step;
        steps.forEach(function (section, index) {
            var active = index === step - 1;
            section.hidden = !active;
            section.classList.toggle('is-active', active);
        });
        progressItems.forEach(function (item, index) {
            item.classList.toggle('is-active', index === step - 1);
            item.classList.toggle('is-complete', index < step - 1);
        });
        prevButton.hidden = step === 1 || step === 8;
        actions.hidden = step === 8;
        nextButton.textContent = step === 7 ? 'Enviar solicitud' : 'Continuar';
        document.querySelector('.quote-form').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        var title = steps[step - 1].querySelector('h2');
        if (title) title.focus({ preventScroll: true });
    }

    function formValues() {
        var values = {};
        new FormData(form).forEach(function (value, key) {
            if (key === 'servicios') {
                if (!values[key]) values[key] = [];
                values[key].push(value);
            } else values[key] = value;
        });
        return values;
    }

    function buildSummary() {
        var values = formValues();
        var categoryInput = form.querySelector('[name="categoria"]:checked');
        var categoryLabel = categoryInput ? categoryInput.closest('label').querySelector('strong').textContent : '—';
        var rows = [
            ['Empresa', values.empresa], ['Contacto', values.nombre], ['Teléfono', values.telefono], ['Correo', values.correo],
            ['Ubicación', [values.ciudad, values.estado, values.pais].filter(Boolean).join(', ')], ['Categoría', categoryLabel],
            ['Servicios', (values.servicios || []).join(', ')], ['Tipo', values.servicio_recurrente ? 'Recurrente' : (values.varias_ubicaciones ? 'Por sucursal' : 'Única')],
            ['Fecha requerida', values.fecha_requerida || 'Por definir'], ['Urgencia', values.urgencia], ['Archivos', selectedFiles.length ? selectedFiles.map(function (file) { return file.name; }).join(', ') : 'Sin archivos']
        ];
        document.getElementById('quoteSummary').innerHTML = '<dl>' + rows.map(function (row) { return '<div><dt>' + row[0] + '</dt><dd>' + (row[1] || '—') + '</dd></div>'; }).join('') + '</dl><button class="btn btn-link p-0" type="button" data-edit-step="1">Editar información</button>';
    }

    function saveDraft() {
        try {
            localStorage.setItem('cosafeQuoteDraft', JSON.stringify(formValues()));
            document.querySelector('.quote-save-status').textContent = 'Tu avance fue guardado en este dispositivo.';
        } catch (error) {
            document.querySelector('.quote-save-status').textContent = 'No fue posible guardar el borrador en este dispositivo.';
        }
    }

    function finishQuote() {
        var values = formValues();
        var now = new Date();
        var folio = 'COS-' + now.getFullYear() + '-' + String(now.getTime()).slice(-6);
        var payload = new FormData(form);
        payload.append('folio', folio);
        payload.append('_subject', 'Nueva solicitud CoSAFE ' + folio);
        selectedFiles.forEach(function (file) { payload.append('archivos', file, file.name); });
        nextButton.disabled = true;
        nextButton.textContent = 'Enviando…';
        errorBox.textContent = '';
        return fetch('https://formsubmit.co/ajax/gerencias@cosafeconsultoria.com', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: payload
        }).then(function (response) {
            if (!response.ok) throw new Error('No enviado');
            document.getElementById('quoteFolio').textContent = folio;
            document.getElementById('quoteDate').textContent = now.toLocaleDateString('es-MX');
            document.getElementById('quoteChannel').textContent = values.contacto_preferido || 'Correo';
            try { localStorage.removeItem('cosafeQuoteDraft'); } catch (error) { /* storage may be unavailable */ }
            showStep(8);
        }).catch(function () {
            errorBox.textContent = 'No fue posible enviar la solicitud. Intenta nuevamente o comunícate al +52 868 354 6152.';
            errorBox.focus();
        }).finally(function () {
            nextButton.disabled = false;
            nextButton.textContent = 'Enviar solicitud';
        });
    }

    nextButton.addEventListener('click', function () {
        if (!validateCurrentStep()) return;
        if (currentStep === 2) renderServices();
        if (currentStep === 3) renderConditionalFields();
        if (currentStep === 6) buildSummary();
        if (currentStep === 7) { finishQuote(); return; }
        showStep(currentStep + 1);
    });
    prevButton.addEventListener('click', function () { if (currentStep > 1) showStep(currentStep - 1); });
    document.getElementById('saveDraft').addEventListener('click', saveDraft);
    document.getElementById('restartQuote').addEventListener('click', function () { form.reset(); selectedFiles = []; renderFileList(); showStep(1); });
    document.getElementById('quoteSummary').addEventListener('click', function (event) { if (event.target.matches('[data-edit-step]')) showStep(Number(event.target.dataset.editStep)); });

    var fileInput = document.getElementById('q-files');
    function renderFileList() {
        document.getElementById('fileList').innerHTML = selectedFiles.map(function (file, index) {
            return '<li><span><strong>' + file.name + '</strong><small>' + (file.size / 1048576).toFixed(2) + ' MB</small></span><button type="button" data-remove-file="' + index + '" aria-label="Eliminar ' + file.name + '"><i class="bi bi-x"></i></button></li>';
        }).join('');
    }
    fileInput.addEventListener('change', function () {
        var allowed = /\.(pdf|jpe?g|png|xlsx|docx)$/i;
        var incoming = Array.prototype.slice.call(fileInput.files);
        var invalid = incoming.find(function (file) { return file.size > 20 * 1048576 || !allowed.test(file.name); });
        if (invalid || selectedFiles.length + incoming.length > 10) {
            errorBox.textContent = 'El archivo no puede cargarse. Revisa el formato, el límite de 20 MB y el máximo de 10 archivos.';
            return;
        }
        selectedFiles = selectedFiles.concat(incoming);
        renderFileList();
        fileInput.value = '';
    });
    document.getElementById('fileList').addEventListener('click', function (event) {
        var button = event.target.closest('[data-remove-file]');
        if (!button) return;
        selectedFiles.splice(Number(button.dataset.removeFile), 1);
        renderFileList();
    });

    var requestedCategory = new URLSearchParams(window.location.search).get('category');
    if (requestedCategory && catalog[requestedCategory]) {
        var requestedInput = form.querySelector('[name="categoria"][value="' + requestedCategory + '"]');
        if (requestedInput) {
            requestedInput.checked = true;
            document.querySelector('.quote-save-status').textContent = 'La categoría fue preseleccionada desde el servicio consultado.';
        }
    }
    try {
        draftValues = JSON.parse(localStorage.getItem('cosafeQuoteDraft') || 'null');
        if (draftValues) {
            form.querySelectorAll('[name]').forEach(function (input) {
                if (input.type === 'radio') input.checked = input.value === draftValues[input.name];
                else if (input.type === 'checkbox') input.checked = draftValues[input.name] === 'on';
                else if (draftValues[input.name] && input.name !== 'servicios') input.value = draftValues[input.name];
            });
            document.querySelector('.quote-save-status').textContent = 'Se recuperó el borrador guardado en este dispositivo.';
        }
    } catch (error) {
        draftValues = null;
    }
})();
