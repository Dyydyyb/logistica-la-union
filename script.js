/**
 * LOGÍSTICA LA UNIÓN - JAVASCRIPT PRINCIPAL
 * Funcionalidades:
 * - Menú hamburguesa móvil accesible (ARIA + scroll lock)
 * - Observador de scroll para revelación suave (IntersectionObserver)
 * - Contadores numéricos interactivos en franja de datos
 * - Barra de progreso en pasos de servicio
 * - Validación completa de formulario en cliente (español rioplatense)
 * - Modal animado de transición con barra de progreso y redirección a WhatsApp
 * - Accesibilidad de teclado (trampa de foco y tecla Esc)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========================================================
  // 1. AÑO ACTUAL DINÁMICO EN FOOTER
  // ========================================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ========================================================
  // 2. MENÚ MÓVIL HAMBURGUESA ACCESIBLE
  // ========================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMobileMenu() {
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileDrawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileDrawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Cerrar al clickear cualquier enlace interno del menú móvil
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeMobileMenu();
        mobileToggle.focus();
      }
    });
  }

  // ========================================================
  // 3. MICRO-ANIMACIONES AL SCROLL (IntersectionObserver)
  // ========================================================
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback para navegadores antiguos
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // ========================================================
  // 4. CONTADORES NUMÉRICOS ANIMADOS EN LA FRANJA DE DATOS
  // ========================================================
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  function runCounters() {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const duration = 1600; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Función de aceleración suave (easeOutQuad)
        const ease = 1 - (1 - progress) * (1 - progress);
        const currentCount = Math.floor(ease * target);

        counter.textContent = currentCount;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(statsStrip);
  } else {
    runCounters();
  }

  // ========================================================
  // 5. LÍNEA DE PROGRESO EN SECCIÓN CÓMO FUNCIONA
  // ========================================================
  const stepsContainer = document.getElementById('steps-container');
  const stepsProgressBar = document.getElementById('steps-progress-bar');
  const stepCards = document.querySelectorAll('.step-card');

  if (stepsContainer && stepsProgressBar && 'IntersectionObserver' in window) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
          const stepIndex = parseInt(entry.target.getAttribute('data-step'), 10) || 1;
          const percentage = ((stepIndex - 1) / (stepCards.length - 1)) * 100;
          stepsProgressBar.style.width = `${percentage}%`;
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-50px 0px -50px 0px'
    });

    stepCards.forEach((card) => stepObserver.observe(card));
  }

  // ========================================================
  // 6. VALIDACIÓN DEL FORMULARIO Y MODAL → WHATSAPP
  // ========================================================
  const quoteForm = document.getElementById('quote-form');
  const quoteModal = document.getElementById('quote-modal');
  const modalClose = document.getElementById('modal-close');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalLoadingState = document.getElementById('modal-loading-state');
  const modalReadyState = document.getElementById('modal-ready-state');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const modalManualLink = document.getElementById('modal-manual-link');
  let previouslyFocusedElement = null;

  // Teléfono oficial de WhatsApp en formato internacional
  const WHATSAPP_PHONE = '5491132457478';

  // Helper para mostrar error
  function setError(inputElement, errorElementId, message) {
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      errorEl.textContent = message;
    }
    inputElement.classList.add('is-invalid');
  }

  // Helper para limpiar error
  function clearError(inputElement, errorElementId) {
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      errorEl.textContent = '';
    }
    inputElement.classList.remove('is-invalid');
  }

  // Limpiar errores mientras el usuario escribe
  const formInputs = quoteForm ? quoteForm.querySelectorAll('input, select, textarea') : [];
  formInputs.forEach((input) => {
    input.addEventListener('input', () => {
      clearError(input, `error-${input.id}`);
    });
    input.addEventListener('change', () => {
      clearError(input, `error-${input.id}`);
    });
  });

  // Validación de campos
  function validateForm() {
    let isValid = true;

    const nombre = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    const servicio = document.getElementById('servicio');
    const cantidad = document.getElementById('cantidad');
    const retiro = document.getElementById('retiro');
    const entrega = document.getElementById('entrega');

    // Nombre
    if (!nombre.value.trim()) {
      setError(nombre, 'error-nombre', 'Por favor ingresá tu nombre o el de tu negocio.');
      isValid = false;
    } else if (nombre.value.trim().length < 2) {
      setError(nombre, 'error-nombre', 'Ingresá al menos 2 caracteres.');
      isValid = false;
    } else {
      clearError(nombre, 'error-nombre');
    }

    // Teléfono
    const phoneClean = telefono.value.trim().replace(/[^0-9]/g, '');
    if (!telefono.value.trim()) {
      setError(telefono, 'error-telefono', 'Por favor ingresá un número de teléfono o WhatsApp.');
      isValid = false;
    } else if (phoneClean.length < 8) {
      setError(telefono, 'error-telefono', 'Ingresá un teléfono válido (al menos 8 dígitos).');
      isValid = false;
    } else {
      clearError(telefono, 'error-telefono');
    }

    // Tipo de servicio
    if (!servicio.value) {
      setError(servicio, 'error-servicio', 'Elegí el tipo de servicio que necesitás.');
      isValid = false;
    } else {
      clearError(servicio, 'error-servicio');
    }

    // Cantidad estimada
    if (!cantidad.value) {
      setError(cantidad, 'error-cantidad', 'Seleccioná la cantidad aproximada de envíos.');
      isValid = false;
    } else {
      clearError(cantidad, 'error-cantidad');
    }

    // Retiro
    if (!retiro.value.trim()) {
      setError(retiro, 'error-retiro', 'Indicá en qué barrio o localidad se retira.');
      isValid = false;
    } else {
      clearError(retiro, 'error-retiro');
    }

    // Entrega
    if (!entrega.value.trim()) {
      setError(entrega, 'error-entrega', 'Indicá en qué zona o localidades se entrega.');
      isValid = false;
    } else {
      clearError(entrega, 'error-entrega');
    }

    return isValid;
  }

  // Generar mensaje codificado para WhatsApp
  function buildWhatsAppUrl() {
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const servicio = document.getElementById('servicio').value;
    const cantidad = document.getElementById('cantidad').value;
    const retiro = document.getElementById('retiro').value.trim();
    const entrega = document.getElementById('entrega').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    let text = `Hola! Soy ${nombre}. Quiero consultar por ${servicio}. Retiro en: ${retiro}, entrega en: ${entrega}. Envíos por semana: ${cantidad}.`;
    
    if (mensaje) {
      text += ` Detalle adicional: ${mensaje}.`;
    }
    
    text += ` Mi teléfono de contacto: ${telefono}.`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
  }

  // ========================================================
  // 7. ORQUESTACIÓN DEL MODAL Y TRANSICIÓN
  // ========================================================
  let modalTimer = null;
  let progressInterval = null;

  function openModal() {
    previouslyFocusedElement = document.activeElement;
    quoteModal.classList.add('is-active');
    quoteModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Estado inicial: cargando
    modalLoadingState.classList.remove('hidden');
    modalReadyState.classList.add('hidden');
    progressBarFill.style.width = '0%';

    // Animar barra de progreso durante 2.4 segundos
    const totalDuration = 2400; // 2.4s
    const intervalStep = 40;
    let elapsed = 0;

    progressInterval = setInterval(() => {
      elapsed += intervalStep;
      const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
      progressBarFill.style.width = `${progressPercent}%`;

      if (elapsed >= totalDuration) {
        clearInterval(progressInterval);
        showReadyState();
      }
    }, intervalStep);
  }

  function showReadyState() {
    const waUrl = buildWhatsAppUrl();
    modalManualLink.setAttribute('href', waUrl);

    modalLoadingState.classList.add('hidden');
    modalReadyState.classList.remove('hidden');

    // Foco en el botón manual de apertura
    modalManualLink.focus();

    // Redirección automática a WhatsApp tras breve instante
    modalTimer = setTimeout(() => {
      // Intentar abrir en pestaña nueva
      const opened = window.open(waUrl, '_blank');
      // Si el navegador bloqueó el popup, el usuario tiene el botón manual visible
      if (!opened) {
        // Redirigir en misma ventana si falló el popup
        // window.location.href = waUrl;
      }
    }, 600);
  }

  function closeModal() {
    if (modalTimer) clearTimeout(modalTimer);
    if (progressInterval) clearInterval(progressInterval);

    quoteModal.classList.remove('is-active');
    quoteModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm()) {
        openModal();
      } else {
        // Scroll suave al primer elemento inválido
        const firstInvalid = quoteForm.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', closeModal);
  }

  // Cerrar al clickear fuera del card
  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        closeModal();
      }
    });
  }

  // Trampa de foco y tecla Esc para modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quoteModal && quoteModal.classList.contains('is-active')) {
      closeModal();
    }

    if (e.key === 'Tab' && quoteModal && quoteModal.classList.contains('is-active')) {
      const focusable = quoteModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

});
