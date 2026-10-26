/* ==========================================================================
   main.js – serve-mock (gjelder alle mock-sidene)
   - FAQ-trekkspill (tilgjengelig, én åpen om gangen)
   - Skjemavalidering + lokal bekreftelse (INGEN nettverkskall)
   - Forhåndsvalg i skjema fra klikkbare kort/CTA-er (data-preset-*)
   - M: vis/skjul MOCK-stripe
   - B: A/B-bryter for hero-overskrift (3) og CTA-tekst (2)
   Ingen tracking, ingen eksterne kall.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. FAQ-trekkspill
     ------------------------------------------------------------------------ */
  var faq = document.getElementById('faq');
  if (faq) {
    var questions = faq.querySelectorAll('.faq__q');

    function close(item) {
      var btn = item.querySelector('.faq__q');
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
    }

    function open(item) {
      var btn = item.querySelector('.faq__q');
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    }

    questions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq__item');
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        // Lukk alle, åpne den valgte (enkelt og forutsigbart på mobil)
        faq.querySelectorAll('.faq__item').forEach(close);
        if (!isOpen) open(item);
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. Skjema – klientvalidering og lokal bekreftelse
     Generisk: validerer alle felt med [required] og samler alle navngitte felt.
     Skjemaet sender ingenting – takkemelding vises i siden, data logges lokalt.
     ------------------------------------------------------------------------ */
  var form = document.getElementById('lead-form');
  var success = document.getElementById('form-success');
  var errorBox = document.getElementById('form-error');

  if (form) {
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setInvalid(field, invalid) {
      if (invalid) {
        field.setAttribute('aria-invalid', 'true');
      } else {
        field.removeAttribute('aria-invalid');
      }
    }

    // Returnerer en feilmelding, eller '' hvis feltet er OK
    function fieldError(field) {
      var value = (field.value || '').trim();

      if (field.type === 'checkbox') {
        return field.checked ? '' : 'Du må samtykke til at vi kan kontakte deg.';
      }
      if (field.type === 'email') {
        return EMAIL_RE.test(value) ? '' : 'Fyll inn en gyldig e-postadresse.';
      }
      if (field.type === 'tel') {
        return value.replace(/[^\d]/g, '').length >= 8 ? '' : 'Fyll inn et gyldig telefonnummer.';
      }
      if (field.id === 'navn') {
        return value.length >= 2 ? '' : 'Fyll inn navn.';
      }
      return value ? '' : 'Fyll ut ' + (field.id || field.name) + '.';
    }

    function validate() {
      var errors = [];
      form.querySelectorAll('[required]').forEach(function (field) {
        var message = fieldError(field);
        setInvalid(field, !!message);
        if (message && errors.indexOf(message) === -1) errors.push(message);
      });
      return errors;
    }

    function collect() {
      var data = {};
      var radioNames = {};

      form.querySelectorAll('input[name], select[name], textarea[name]').forEach(function (el) {
        if (el.type === 'radio') {
          radioNames[el.name] = true;
          if (el.checked) data[el.name] = el.value;
        } else if (el.type === 'checkbox') {
          data[el.name] = el.checked;
        } else {
          data[el.name] = (el.value || '').trim() || '(ikke oppgitt)';
        }
      });

      // Radiogrupper uten valg skal også med i loggen
      Object.keys(radioNames).forEach(function (name) {
        if (data[name] === undefined) data[name] = '(ikke oppgitt)';
      });

      return data;
    }

    form.addEventListener('submit', function (e) {
      // Hindre at siden navigerer / sender data noe sted
      e.preventDefault();

      var errors = validate();
      if (errors.length) {
        errorBox.textContent = errors.join(' ');
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      errorBox.textContent = '';

      // Kun lokal logging – ingen fetch, ingen POST
      console.log('[serve-mock] Skjemadata (sendes IKKE):', collect());

      form.hidden = true;
      success.hidden = false;
      success.focus();
    });

    // Fjern feilmarkering så snart brukeren retter opp
    form.addEventListener('input', function (e) {
      if (e.target.matches('.form__input, .form__select, .form__textarea, input[type="checkbox"]')) {
        setInvalid(e.target, false);
        errorBox.textContent = '';
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Forhåndsvalg fra klikkbare kort og CTA-er
     Element med data-preset-field + data-preset-value setter feltet i skjemaet
     når det klikkes (f.eks. «Resepsjon» eller «LED-vegg»).
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-preset-field]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var field = document.getElementById(trigger.getAttribute('data-preset-field'));
      var value = trigger.getAttribute('data-preset-value');
      if (!field) return;

      field.value = value;
      setPresetHighlight(field);
      // Vekk eventuell feilmarkering og la anker-hoppet (#tilbud) gå som normalt
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // Kort visuell bekreftelse på at valget ble satt
  function setPresetHighlight(field) {
    field.classList.add('is-preset');
    window.setTimeout(function () { field.classList.remove('is-preset'); }, 1600);
  }

  /* ------------------------------------------------------------------------
     4. MOCK-stripe av/på med tast M
     ------------------------------------------------------------------------ */
  var mockbar = document.getElementById('mockbar');

  function toggleMockbar() {
    if (!mockbar) return;
    var hidden = mockbar.hasAttribute('hidden');
    if (hidden) {
      mockbar.removeAttribute('hidden');
      document.body.classList.add('is-mockbar-on');
    } else {
      mockbar.setAttribute('hidden', '');
      document.body.classList.remove('is-mockbar-on');
    }
  }

  // Start med stripa synlig
  document.body.classList.add('is-mockbar-on');

  /* ------------------------------------------------------------------------
     5. A/B-bryter med tast B (3 hero-overskrifter, 2 CTA-tekster)
     CTA-tekstene leses fra <body data-cta-a="…" data-cta-b="…"> slik at hver
     side kan ha sine egne varianter. Uten data-attributter brukes møteroms-
     sidens standardtekster.
     ------------------------------------------------------------------------ */
  var FALLBACK_CTA = ['Få gratis møteroms-sjekk', 'Få prisforslag innen 2 dager'];
  var CTA_TEXTS = [
    document.body.getAttribute('data-cta-a'),
    document.body.getAttribute('data-cta-b')
  ].filter(Boolean);
  if (CTA_TEXTS.length !== 2) CTA_TEXTS = FALLBACK_CTA;

  var heroEl = document.getElementById('hero-title');
  var statusEl = document.getElementById('ab-status');

  // Tell hero-alternativene (data-hero-1, data-hero-2, …)
  var HERO_COUNT = 0;
  if (heroEl) {
    while (heroEl.hasAttribute('data-hero-' + (HERO_COUNT + 1))) HERO_COUNT += 1;
  }

  var heroIndex = 1;
  var ctaIndex = 0;

  function applyAB() {
    if (heroEl && HERO_COUNT > 0) {
      var txt = heroEl.getAttribute('data-hero-' + heroIndex);
      if (txt) {
        heroEl.textContent = txt;
        document.title = txt + ' – Serve AS [MOCK]';
      }
    }

    // Alle primære CTA-er får samme tekst (krav: lik CTA overalt)
    document.querySelectorAll('[data-cta="primary"]').forEach(function (el) {
      el.textContent = CTA_TEXTS[ctaIndex];
    });

    // Sekundær CTA viser den andre varianten, så begge alltid er synlige
    var other = CTA_TEXTS[ctaIndex === 0 ? 1 : 0];
    document.querySelectorAll('[data-cta="secondary"]').forEach(function (el) {
      el.textContent = other;
    });

    if (statusEl) {
      statusEl.textContent = 'Hero ' + heroIndex + '/' + (HERO_COUNT || 1) + ' · CTA ' + (ctaIndex === 0 ? 'A' : 'B');
    }
  }

  function cycleAB() {
    // Første trykk: neste hero. Etter siste hero: neste CTA og tilbake til hero 1.
    if (heroIndex < HERO_COUNT) {
      heroIndex += 1;
    } else {
      heroIndex = 1;
      ctaIndex = (ctaIndex + 1) % CTA_TEXTS.length;
    }
    applyAB();
  }

  document.addEventListener('keydown', function (e) {
    // Ikke stjel tastetrykk fra skjemafelt
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    var key = e.key.toLowerCase();
    if (key === 'm') {
      e.preventDefault();
      toggleMockbar();
    } else if (key === 'b') {
      e.preventDefault();
      cycleAB();
    }
  });

  applyAB();
})();
