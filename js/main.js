(function ($) {
    "use strict";

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate animations only when motion is welcome and the library is available.
    if (!reducedMotion && typeof WOW !== 'undefined') {
        new WOW().init();
    } else {
        $('.wow').css('visibility', 'visible');
    }

    // One navigation contract across every page.
    $('.navbar-nav').html(
        '<a href="index.html" class="nav-item nav-link">Inicio</a>' +
        '<a href="about.html" class="nav-item nav-link">Acerca de</a>' +
        '<a href="service.html" class="nav-item nav-link">Servicios</a>' +
        '<a href="quote.html" class="nav-item nav-link">Cotizar</a>' +
        '<a href="contact.html" class="nav-item nav-link">Contacto</a>'
    );
    $('.navbar-collapse > .btn.d-none.d-lg-block, .navbar-collapse > .btn.d-none.d-lg-inline-flex').remove();
    $('.navbar-collapse > .d-lg-none, .navbar-collapse > .btn.d-lg-none').remove();
    $('.navbar-collapse').append(
        '<a href="quote.html" class="btn btn-primary px-3 d-none d-lg-inline-flex align-items-center">Solicitar cotización</a>' +
        '<div class="mobile-nav-actions d-grid gap-2 mx-4 mb-4 d-lg-none"><a href="quote.html" class="btn btn-primary">Solicitar cotización</a><a href="tel:+528683546152" class="btn btn-outline-primary">Llamar</a><a href="mailto:gerencias@cosafeconsultoria.com" class="btn btn-outline-dark">Enviar correo</a></div>'
    );

    // Keep navigation state accurate across the static multipage site.
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var currentHash = window.location.hash;

    // Give the legacy resource route a deliberate EHSS information architecture.
    // The old template contained six duplicated cards and placeholder captions;
    // this compact hub keeps the route useful while matching the current system.
    if (currentPage === 'team.html') {
        document.title = 'Recursos tecnicos EHSS | coSAFE Consultoria';
        $('.page-header h1').text('Recursos técnicos EHSS');
        $('.page-header .breadcrumb-item.active').text('Recursos técnicos');
        var resourceHost = $('.page-header').next('.container-xxl').find('.container').first();
        if (resourceHost.length) {
            resourceHost.html(
                '<div class="resource-hub" data-reveal>' +
                '<div class="resource-hub__intro"><span class="section-code">EHSS / RECURSOS 01</span><h2>Decisiones m&aacute;s claras en campo</h2><p>Consulta criterios pr&aacute;cticos para ordenar riesgos ambientales, de salud y seguridad en tu operaci&oacute;n.</p></div>' +
                '<div class="resource-hub__grid">' +
                '<article class="resource-panel"><span class="resource-panel__index">01</span><h3>Medio ambiente</h3><p>Identifica impactos, controles y evidencias antes de que se conviertan en desviaciones.</p><a href="service.html#ambiental" class="btn btn-outline-primary">Ver alcance ambiental</a></article>' +
                '<article class="resource-panel"><span class="resource-panel__index">02</span><h3>Seguridad industrial</h3><p>Relaciona peligros, permisos y medidas de control con el trabajo real de tus equipos.</p><a href="service.html#seguridad-industrial" class="btn btn-outline-primary">Ver seguridad industrial</a></article>' +
                '<article class="resource-panel"><span class="resource-panel__index">03</span><h3>Salud ocupacional</h3><p>Organiza vigilancia, aptitud y seguimiento con una ruta que tu personal pueda ejecutar.</p><a href="service.html#salud" class="btn btn-outline-primary">Ver salud ocupacional</a></article>' +
                '</div><div class="resource-hub__footer"><span class="section-code">FUENTE / CO SAFE V3</span><a href="quote.html" class="btn btn-primary">Solicitar orientaci&oacute;n</a></div></div>'
            );
        }
    }
    $('.navbar-nav .nav-link').each(function () {
        var rawHref = $(this).attr('href') || '';
        var parts = rawHref.split('#');
        var href = parts[0];
        var linkHash = parts[1] ? '#' + parts[1] : '';
        var isQuoteHash = currentPage === 'contact.html' && currentHash === '#cotizacion';
        var isCurrent = href === currentPage && (isQuoteHash ? linkHash === currentHash : !linkHash);
        $(this).toggleClass('active', isCurrent);
        if (isCurrent) {
            $(this).attr('aria-current', 'page');
        } else {
            $(this).removeAttr('aria-current');
        }
    });

    // Legacy pages share the same guided quote destination.
    $('a[href="contact.html#cotizacion"]').attr('href', 'quote.html');

    // Keep legal/footer dates current without hard-coded yearly maintenance.
    $('[data-current-year]').text(new Date().getFullYear());

    // One shared footer contract prevents content and layout drift between legacy pages.
    var footerMarkup = '<div class="container py-4"><div class="row g-5">' +
        '<div class="col-lg-4 col-md-6"><img class="footer-logo" src="img/cosafe-consultoria-ehss.png" alt="CoSAFE Consultoría" width="167" height="63"><p class="mt-4">Soluciones EHSS para la industria maquiladora y de servicios desde 2016.</p><p class="topbar-kicker text-light">Atención en México y Estados Unidos, sujeta a cobertura.</p></div>' +
        '<div class="col-lg-2 col-md-6"><h2 class="h5 text-white mb-4">Accesos</h2><a class="btn btn-link" href="index.html">Inicio</a><a class="btn btn-link" href="about.html">Acerca de</a><a class="btn btn-link" href="service.html">Servicios</a><a class="btn btn-link" href="quote.html">Cotizar</a><a class="btn btn-link" href="contact.html">Contacto</a><span class="footer-pending">Aviso de privacidad: pendiente</span></div>' +
        '<div class="col-lg-3 col-md-6"><h2 class="h5 text-white mb-4">Servicios</h2><a class="btn btn-link" href="service.html#proteccion-civil">Protección Civil</a><a class="btn btn-link" href="service.html#salud">Salud ocupacional</a><a class="btn btn-link" href="service.html#seguridad-industrial">Estudios técnicos</a><a class="btn btn-link" href="service.html#ambiental">Estudios ambientales</a><a class="btn btn-link" href="service.html#extintores">Extintores y EPP</a></div>' +
        '<div class="col-lg-3 col-md-6"><h2 class="h5 text-white mb-4">Contacto</h2><address><p>Mezquite 43, Las Arboledas<br>Heroica Matamoros, Tamaulipas</p><a href="tel:+528683546152">+52 868 354 6152</a><br><a href="mailto:gerencias@cosafeconsultoria.com">gerencias@cosafeconsultoria.com</a></address><p class="small mb-0">Horario pendiente de confirmar.</p></div>' +
        '</div></div>';
    $('.footer').attr('role', 'contentinfo').removeClass('mt-5 wow fadeIn').removeAttr('data-wow-delay').html(footerMarkup);
    $('.copyright .container').html('<p class="mb-0">© <span data-current-year>' + new Date().getFullYear() + '</span> CoSAFE Consultoría. Todos los derechos reservados.</p>');

    // Restrained section reveals: hierarchy and continuity, never a content dependency.
    var revealElements = document.querySelectorAll('[data-reveal]');
    if (!reducedMotion && 'IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
        revealElements.forEach(function (element) { revealObserver.observe(element); });
    } else {
        revealElements.forEach(function (element) { element.classList.add('is-revealed'); });
    }

    // Lightweight reading progress for the long-form home page.
    var progressBar = document.querySelector('.reading-progress span');
    var progressTicking = false;
    function updateReadingProgress() {
        var scrollable = document.documentElement.scrollHeight - window.innerHeight;
        var progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
        progressBar.style.transform = 'scaleX(' + progress + ')';
        progressTicking = false;
    }
    if (progressBar && !reducedMotion) {
        window.addEventListener('scroll', function () {
            if (!progressTicking) {
                window.requestAnimationFrame(updateReadingProgress);
                progressTicking = true;
            }
        }, { passive: true });
        updateReadingProgress();
    }

    // Repair empty template links without inventing social profiles.
    $('a[href=""]').each(function () {
        var $link = $(this);
        var label = $.trim($link.text()).toLowerCase();
        var destination = null;

        if (label.indexOf('cotizar') !== -1 || label.indexOf('read more') !== -1) {
            destination = 'contact.html#cotizacion';
        } else if (label.indexOf('conocer') !== -1 || label === 'mas' || label === 'más') {
            destination = 'service.html';
        } else if (label.indexOf('acerca') !== -1) {
            destination = 'about.html';
        } else if (label.indexOf('contacto') !== -1) {
            destination = 'contact.html';
        } else if (label.indexOf('servicio') !== -1) {
            destination = 'service.html';
        } else if ($link.hasClass('project-item')) {
            destination = 'contact.html#cotizacion';
        }

        if (destination) {
            $link.attr('href', destination);
        } else if (!label) {
            $link.attr({ 'aria-hidden': 'true', 'tabindex': '-1' }).hide();
        } else {
            $link.attr({ 'aria-disabled': 'true', 'tabindex': '-1' }).on('click', function (event) {
                event.preventDefault();
            });
        }
    });

    // Improve legacy image markup without changing local assets.
    $('img').each(function (index) {
        var $image = $(this);
        var source = $image.attr('src') || '';
        var alt = $image.attr('alt');

        if ($image.closest('.service-img').length) {
            $image.attr({ alt: '', 'aria-hidden': 'true' });
        } else if (alt === undefined || /^(image|imagen\s*\d*)$/i.test($.trim(alt))) {
            var filename = source.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
            $image.attr('alt', filename || 'Imagen de coSAFE Consultoría');
        }

        if (!$image.closest('#header-carousel').length && index > 1) {
            $image.attr('loading', 'lazy');
        }
        $image.attr('decoding', 'async');
    });

    $('.carousel-control-prev').attr('aria-label', 'Ver elemento anterior');
    $('.carousel-control-next').attr('aria-label', 'Ver elemento siguiente');
    $('.back-to-top').attr('aria-label', 'Volver al inicio de la página');

    // Announce progress before the external form service takes over.
    $('.form_contact').on('submit', function () {
        var $form = $(this);
        var $button = $form.find('button[type="submit"]');
        $button.prop('disabled', true).text('Enviando solicitud…');
        $form.find('.contact-status').text('Procesando tu solicitud. Serás redirigido para completar el envío.');
    });


    // Sticky Navbar
    $(window).scroll(function () {
        $('.sticky-top').toggleClass('shadow-sm', $(this).scrollTop() > 24).css('top', '0px');
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        if (reducedMotion) {
            window.scrollTo(0, 0);
        } else {
            $('html, body').animate({scrollTop: 0}, 450, 'easeInOutExpo');
        }
        return false;
    });


    // Modal Video
    var $videoSrc;
    $('.btn-play').click(function () {
        $videoSrc = $(this).data("src");
    });
    $('#videoModal').on('shown.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    })
    $('#videoModal').on('hide.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc);
    })


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Project carousel
    $(".project-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:2
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            },
            1200:{
                items:5
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

    
})(jQuery);

