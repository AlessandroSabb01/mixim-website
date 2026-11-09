/* =========================================================
   Cookie consent — GDPR / Italian DPA guidelines (10/06/2021)
   - Nessun cookie/contenuto di terze parti prima del consenso
   - "Rifiuta" con la stessa evidenza di "Accetta"; la X chiude = rifiuto
   - Scelta memorizzata 6 mesi, revocabile in ogni momento dal footer
   ========================================================= */
(function () {
  "use strict";
  var KEY = "lh-consent";
  var VERSION = 1;
  var MAX_AGE = 1000 * 60 * 60 * 24 * 180; // 6 mesi

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (!c || c.v !== VERSION || Date.now() - c.ts > MAX_AGE) return null;
      return c;
    } catch (e) { return null; }
  }
  function write(external) {
    var c = { v: VERSION, ts: Date.now(), necessary: true, external: !!external };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    state = c;
    apply();
    document.dispatchEvent(new CustomEvent("consent:change", { detail: c }));
    return c;
  }

  var state = read();
  var banner, prefsToggle;

  function allowed(cat) { return !!(state && state[cat]); }

  /* ---------- Contenuti bloccati preventivamente ---------- */
  function loadEmbed(el) {
    if (el.dataset.loaded) return;
    var type = el.dataset.embed;
    if (type === "maps") {
      var f = document.createElement("iframe");
      f.src = el.dataset.src;
      f.title = el.dataset.title || "Google Maps";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.setAttribute("allowfullscreen", "");
      el.appendChild(f);
      var ph = el.querySelector(".map__placeholder");
      if (ph) ph.hidden = true;
    }
    el.dataset.loaded = "1";
    el.setAttribute("data-loaded", "1");
  }

  function apply() {
    document.querySelectorAll('[data-consent="external"]').forEach(function (el) {
      if (allowed("external")) loadEmbed(el);
    });
  }

  /* ---------- Banner ---------- */
  function open(showPrefs) {
    if (!banner) return;
    banner.hidden = false;
    banner.classList.toggle("show-prefs", !!showPrefs);
    var ext = banner.querySelector('input[name="external"]');
    if (ext) ext.checked = allowed("external");
    requestAnimationFrame(function () { banner.classList.add("is-open"); });
    setTimeout(function () {
      var first = banner.querySelector(showPrefs ? 'input[name="external"]' : "[data-cookie-accept]");
      if (first && document.documentElement.classList.contains("intro-done")) first.focus({ preventScroll: true });
    }, 400);
  }
  function close() {
    if (!banner) return;
    banner.classList.remove("is-open");
    setTimeout(function () { banner.hidden = true; }, 700);
  }

  function init() {
    banner = document.getElementById("cookie");
    if (!banner) return;

    banner.addEventListener("click", function (e) {
      var t = e.target.closest("button");
      if (!t) return;
      if (t.hasAttribute("data-cookie-accept")) { write(true); close(); }
      else if (t.hasAttribute("data-cookie-reject")) { write(false); close(); }
      else if (t.hasAttribute("data-cookie-more")) {
        var showing = banner.classList.toggle("show-prefs");
        t.setAttribute("aria-expanded", showing ? "true" : "false");
        t.textContent = showing ? banner.dataset.labelSave : banner.dataset.labelCustomize;
        if (!showing) { write(banner.querySelector('input[name="external"]').checked); close(); }
      }
    });

    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-cookie-prefs]");
      if (t) { e.preventDefault(); open(true); var m = banner.querySelector("[data-cookie-more]"); if (m) { m.textContent = banner.dataset.labelSave; m.setAttribute("aria-expanded", "true"); } }
      var l = e.target.closest("[data-consent-load]");
      if (l) {
        // Il click esplicito su "Mostra contenuto" vale come consenso alla categoria "Contenuti esterni"
        e.preventDefault();
        write(true);
        close();
      }
    });

    apply();
    if (!state) {
      var show = function () { open(false); };
      if (document.documentElement.classList.contains("intro-done") || document.documentElement.classList.contains("no-intro")) setTimeout(show, 600);
      else document.addEventListener("intro:done", function () { setTimeout(show, 500); }, { once: true });
    }
  }

  window.LHConsent = { allowed: allowed, open: open, set: write };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
