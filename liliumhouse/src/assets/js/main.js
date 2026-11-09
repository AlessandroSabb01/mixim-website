/* =========================================================
   Lilium House 2.0 — interactions
   Lenis (smooth scroll) + GSAP/ScrollTrigger (motion)
   ========================================================= */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && !reduce;
  var lenis = null;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var T = {};
  try { T = JSON.parse(document.body.getAttribute("data-i18n") || "{}"); } catch (e) {}

  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Smooth scroll ---------------- */
  function initLenis() {
    if (reduce || typeof window.Lenis === "undefined") return;
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false });
    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    lenis.stop();
  }
  function lockScroll(on) {
    document.body.classList.toggle("is-locked", on);
    if (lenis) on ? lenis.stop() : lenis.start();
  }
  function scrollToTarget(el, offset) {
    if (lenis) lenis.scrollTo(el, { offset: offset || -80, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (offset || -80), behavior: reduce ? "auto" : "smooth" });
  }

  /* ---------------- Intro: the lily fills from 0 to 100 ---------------- */
  function runIntro(done) {
    var loader = $("#loader");
    if (!loader || doc.classList.contains("no-intro")) { if (loader) loader.remove(); done(); return; }
    try { sessionStorage.setItem("lh-intro", "1"); } catch (e) {}
    var wave = $("#lily-wave", loader);
    var pctEl = $(".loader__pct", loader);
    var bar = $(".loader__bar i", loader);
    var start = performance.now();
    var MIN = 2200, MAX = 6000;
    var ready = false, shown = 0;
    var waits = [];
    var heroImg = $(".hero__media img, .page-hero__media img");
    if (heroImg && !heroImg.complete) waits.push(new Promise(function (r) { heroImg.addEventListener("load", r, { once: true }); heroImg.addEventListener("error", r, { once: true }); }));
    if (document.fonts && document.fonts.ready) waits.push(document.fonts.ready);
    Promise.all(waits).then(function () { ready = true; });
    setTimeout(function () { ready = true; }, MAX);

    function wavePath(level, t) {
      var y = 118 - level * 124;
      var amp = 2.4 * (1 - level) + 0.5;
      var d = "M -10 " + y.toFixed(2);
      for (var x = -10; x <= 110; x += 5) d += " L " + x + " " + (y + Math.sin((x / 100) * Math.PI * 2.2 + t / 280) * amp).toFixed(2);
      return d + " L 110 130 L -10 130 Z";
    }
    function frame(now) {
      var timeP = Math.min((now - start) / MIN, 1);
      var eased = 1 - Math.pow(1 - timeP, 3);
      var target = ready ? eased : Math.min(eased, 0.9);
      shown += (target - shown) * 0.12;
      if (target >= 1 && shown > 0.995) shown = 1;
      if (wave) wave.setAttribute("d", wavePath(shown, now));
      if (pctEl) pctEl.textContent = Math.round(shown * 100);
      if (bar) bar.style.transform = "scaleX(" + shown + ")";
      if (shown < 1) requestAnimationFrame(frame); else finish();
    }
    function finish() {
      if (hasGsap) {
        gsap.timeline({ onComplete: function () { loader.remove(); } })
          .to(".loader__lily", { scale: 1.08, duration: 0.45, ease: "back.out(2.5)" })
          .add(function () { done(); }, "+=0.05")
          .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 1.05, ease: "expo.inOut" }, "<")
          .to(".loader__inner", { y: -60, opacity: 0, duration: 0.8, ease: "power2.in" }, "<");
      } else {
        loader.style.transition = "opacity .6s"; loader.style.opacity = "0";
        done(); setTimeout(function () { loader.remove(); }, 650);
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- Header ---------------- */
  function initHeader() {
    var header = $(".site-header");
    if (!header) return;
    var hero = $(".hero, .page-hero");
    var bar = $(".action-bar");
    function onScroll() {
      var y = window.scrollY;
      var limit = hero ? Math.max(40, hero.offsetHeight - header.offsetHeight - 40) : 0;
      header.classList.toggle("is-scrolled", y > 8);
      header.classList.toggle("is-solid", !hero || y > limit || doc.classList.contains("menu-open"));
      if (bar) bar.classList.toggle("is-visible", y > (hero ? hero.offsetHeight * 0.6 : 300));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    var burger = $(".nav__burger");
    var menu = $("#menu");
    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = burger.getAttribute("aria-expanded") !== "true";
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        burger.setAttribute("aria-label", open ? burger.dataset.labelClose : burger.dataset.labelOpen);
        menu.classList.toggle("is-open", open);
        menu.setAttribute("aria-hidden", open ? "false" : "true");
        if (open) menu.removeAttribute("inert"); else menu.setAttribute("inert", "");
        doc.classList.toggle("menu-open", open);
        onScroll();
        lockScroll(open);
        if (open && hasGsap) gsap.fromTo($$(".menu__list li, .menu__foot > *", menu), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: "expo.out", delay: 0.2, clearProps: "transform,opacity" });
      });
      menu.addEventListener("click", function (e) { if (e.target.closest("a")) burger.click(); });
    }
  }

  /* ---------------- Split titles into words ---------------- */
  function splitWords(el) {
    if (el.dataset.splitDone) return [];
    var words = [];
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span");
            w.className = "split-line"; w.innerHTML = "<span></span>";
            w.firstChild.textContent = p;
            frag.appendChild(w); words.push(w.firstChild);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR" && n.tagName !== "svg") walk(n);
      });
    };
    walk(el);
    el.dataset.splitDone = "1";
    return words;
  }

  /* ---------------- Scroll reveals ---------------- */
  function initReveals() {
    if (!hasGsap) { doc.classList.remove("js"); return; }

    $$("[data-split]").forEach(function (el) {
      var w = splitWords(el);
      if (el.closest(".hero, .page-hero")) return;
      gsap.from(w, { yPercent: 115, rotate: 2, duration: 1.15, ease: "expo.out", stagger: 0.03,
        scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });

    $$("[data-reveal]").forEach(function (el) {
      if (el.closest(".hero, .page-hero")) return;
      var delay = parseFloat(el.getAttribute("data-delay") || 0);
      var st = { trigger: el, start: "top 90%", once: true };
      if (el.getAttribute("data-reveal") === "clip") {
        var im = el.querySelector("img");
        gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out", delay: delay, scrollTrigger: st });
        if (im) gsap.to(im, { scale: 1, duration: 1.8, ease: "expo.out", delay: delay, scrollTrigger: st });
      } else {
        gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", delay: delay, scrollTrigger: st });
      }
    });

    $$("[data-stagger]").forEach(function (group) {
      var kids = Array.prototype.slice.call(group.children);
      gsap.set(kids, { opacity: 0, y: 46 });
      ScrollTrigger.batch(kids, { start: "top 92%", once: true,
        onEnter: function (b) {
          b.forEach(function (k) { k.style.transition = "none"; });
          gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, clearProps: "transform,opacity,transition" });
        } });
    });

    // Sections that "open" as they enter the viewport
    $$("[data-open]").forEach(function (el) {
      gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: el, start: "top 95%", end: "top 35%", scrub: 0.6 } });
    });

    // Gentle parallax on landscape/interior photos (no people in the photos)
    $$(".photo-band__media img").forEach(function (im) {
      gsap.fromTo(im, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: im.closest(".photo-band"), start: "top bottom", end: "bottom top", scrub: true } });
    });
    $$(".page-hero__media img").forEach(function (im) {
      gsap.to(im, { yPercent: 10, scale: 1.16, ease: "none", scrollTrigger: { trigger: im.closest(".page-hero"), start: "top top", end: "bottom top", scrub: true } });
    });

    var wm = $(".footer__wordmark");
    if (wm) gsap.from(wm, { yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: wm, start: "top 95%", once: true } });
  }

  /* ---------------- Hero entrance ---------------- */
  function heroIn() {
    doc.classList.add("intro-done");
    document.dispatchEvent(new Event("intro:done"));
    if (lenis) lenis.start();
    var hero = $(".hero") || $(".page-hero");
    if (!hero || !hasGsap) { $$(".hero [data-reveal], .page-hero [data-reveal]").forEach(function (e) { e.style.opacity = 1; e.style.transform = "none"; }); return; }
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    var media = $(".hero__media img, .page-hero__media img", hero);
    if (media) tl.fromTo(media, { scale: 1.22 }, { scale: hero.classList.contains("hero") ? 1.04 : 1.1, duration: 2.6, ease: "power3.out" }, 0);
    var words = [];
    $$("[data-split]", hero).forEach(function (el) { words = words.concat($$(".split-line > span", el)); });
    if (words.length) tl.from(words, { yPercent: 120, rotate: 3, duration: 1.3, stagger: 0.05 }, 0.15);
    var rev = $$("[data-reveal]", hero);
    if (rev.length) tl.to(rev, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.45);
    var tiles = $$(".dock .tile", hero);
    if (tiles.length) {
      tiles.forEach(function (t) { t.style.transition = "none"; });
      tl.fromTo(tiles, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.07, clearProps: "transform,opacity,transition" }, 0.6);
    }
    if (media && hero.classList.contains("hero")) gsap.to(media, { yPercent: 10, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  }

  /* ---------------- Pointer: glow + magnetic buttons ---------------- */
  function initPointer() {
    if (!window.matchMedia("(hover: hover)").matches) return;
    document.addEventListener("pointermove", function (e) {
      var t = e.target.closest(".btn, .feature, .tile");
      if (!t) return;
      var r = t.getBoundingClientRect();
      t.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      t.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
    }, { passive: true });
    if (!hasGsap) return;
    $$("[data-magnetic]").forEach(function (el) {
      var xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      var yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.22);
        yTo((e.clientY - r.top - r.height / 2) * 0.3);
      });
      el.addEventListener("pointerleave", function () { xTo(0); yTo(0); });
    });
  }

  /* ---------------- Booking modal ---------------- */
  var lastFocus = null;
  function waUrl(home) {
    var wa = (T.wa && (T.wa[home] || T.wa.generic)) || "";
    var form = $("#booking form");
    var num = form ? form.getAttribute("data-wa") : "";
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(wa);
  }
  function openModal(home) {
    var m = $("#booking");
    if (!m) return;
    lastFocus = document.activeElement;
    m.hidden = false;
    m.removeAttribute("inert");
    requestAnimationFrame(function () { m.classList.add("is-open"); });
    lockScroll(true);
    var sel = $("select[name=casa]", m);
    if (sel && home) sel.value = home;
    var wl = $("[data-wa-link]", m);
    if (wl) wl.href = waUrl(home || "generic");
    setTimeout(function () { var f = $("input[name=nome]", m); if (f) f.focus({ preventScroll: true }); }, 450);
  }
  function closeModal() {
    var m = $("#booking");
    if (!m || !m.classList.contains("is-open")) return;
    m.classList.remove("is-open");
    lockScroll(false);
    setTimeout(function () { m.hidden = true; m.setAttribute("inert", ""); }, 600);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  function initModal() {
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-book]");
      if (b) { e.preventDefault(); openModal(b.getAttribute("data-book")); return; }
      if (e.target.closest("[data-close]")) { e.preventDefault(); closeModal(); }
    });
    document.addEventListener("keydown", function (e) {
      var m = $("#booking");
      if (!m || !m.classList.contains("is-open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") {
        var f = $$("a[href], button:not([disabled]), input:not([type=hidden]):not(.hp input), select, textarea", m).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ---------------- Stay request form ---------------- */
  function initForms() {
    $$("form[data-form]").forEach(function (form) {
      var status = $(".form__status", form);
      var inEl = $("input[name=arrivo]", form), outEl = $("input[name=partenza]", form);
      var today = new Date().toISOString().slice(0, 10);
      if (inEl) inEl.min = today;
      if (outEl) outEl.min = today;
      if (inEl && outEl) inEl.addEventListener("change", function () { outEl.min = inEl.value || today; if (outEl.value && outEl.value < inEl.value) outEl.value = ""; });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var invalid = false;
        $$("[required]", form).forEach(function (f) {
          var ok = f.type === "checkbox" ? f.checked : f.value.trim() !== "" && (!f.checkValidity || f.checkValidity());
          f.setAttribute("aria-invalid", ok ? "false" : "true");
          if (!ok && !invalid) { invalid = true; f.focus(); }
        });
        if (invalid) { status.className = "form__status is-error"; status.textContent = T.required; return; }
        var btn = $("button[type=submit]", form);
        btn.disabled = true;
        var label = btn.innerHTML;
        btn.textContent = T.sending;
        var data = new FormData(form);
        data.append("pagina", location.pathname);
        fetch(form.getAttribute("action"), { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
          .then(function (res) {
            if (!res || !res.ok) throw new Error((res && res.error) || "send");
            status.className = "form__status is-ok";
            status.textContent = T.ok;
            form.reset();
          })
          .catch(function () {
            var home = (T.homes && T.homes[data.get("casa") || ""]) || "Lilium House";
            var dates = [data.get("arrivo"), data.get("partenza")].filter(Boolean).join(" → ") || "—";
            var msg = (T.waMsg || "")
              .replace("{name}", ((data.get("nome") || "") + " " + (data.get("cognome") || "")).trim())
              .replace("{home}", home).replace("{dates}", dates)
              .replace("{guests}", data.get("ospiti") || "")
              .replace("{msg}", data.get("messaggio") || "").trim();
            var a = document.createElement("a");
            a.href = "https://wa.me/" + form.getAttribute("data-wa") + "?text=" + encodeURIComponent(msg);
            a.target = "_blank"; a.rel = "noopener"; a.textContent = "WhatsApp";
            status.className = "form__status is-error";
            status.textContent = T.fail + " ";
            status.appendChild(a);
            status.appendChild(document.createTextNode(" " + T.failOr));
          })
          .finally(function () { btn.disabled = false; btn.innerHTML = label; });
      });
    });
  }

  /* ---------------- Carousels (drag + progress) ---------------- */
  function initCarousels() {
    $$(".carousel").forEach(function (c) {
      var track = $(".carousel__track", c);
      var prog = $(".carousel__progress i", c);
      if (!track) return;
      var update = function () {
        var max = track.scrollWidth - track.clientWidth;
        if (prog) prog.style.width = (max > 0 ? Math.max(12, (track.scrollLeft / max) * 100) : 100) + "%";
      };
      track.addEventListener("scroll", update, { passive: true });
      update();
      var stepW = function () { var it = track.firstElementChild; return it ? it.getBoundingClientRect().width + 16 : 300; };
      var prev = $("[data-prev]", c), next = $("[data-next]", c);
      if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -stepW(), behavior: reduce ? "auto" : "smooth" }); });
      if (next) next.addEventListener("click", function () { track.scrollBy({ left: stepW(), behavior: reduce ? "auto" : "smooth" }); });
      var down = false, sx = 0, sl = 0, moved = false;
      track.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
      window.addEventListener("pointermove", function (e) {
        if (!down) return;
        var dx = e.clientX - sx;
        if (Math.abs(dx) > 4) { moved = true; track.classList.add("is-dragging"); }
        track.scrollLeft = sl - dx;
      });
      window.addEventListener("pointerup", function () {
        if (!down) return; down = false;
        track.classList.remove("is-dragging");
        if (moved) { var w = stepW(); track.scrollTo({ left: Math.round(track.scrollLeft / w) * w, behavior: "smooth" }); }
      });
    });
  }

  /* ---------------- Room galleries (auto-advance, pause on hover) ---------------- */
  function initGalleries() {
    $$("[data-gallery]").forEach(function (g, gi) {
      var figs = $$(".room__frame figure", g);
      var count = $(".room__count", g);
      if (figs.length < 2) return;
      var i = 0, timer = null, visible = false, hover = false;
      var pad = function (n) { return ("0" + n).slice(-2); };
      function show(n) {
        i = (n + figs.length) % figs.length;
        figs.forEach(function (f, k) { f.classList.toggle("is-active", k === i); });
        if (count) count.textContent = pad(i + 1) + " / " + pad(figs.length);
      }
      function stop() { if (timer) clearInterval(timer); timer = null; }
      function play() { stop(); if (!reduce && visible && !hover) timer = setInterval(function () { show(i + 1); }, 4200 + gi * 350); }
      var p = $("[data-gprev]", g), n = $("[data-gnext]", g);
      if (p) p.addEventListener("click", function () { show(i - 1); play(); });
      if (n) n.addEventListener("click", function () { show(i + 1); play(); });
      g.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { hover = true; stop(); } });
      g.addEventListener("pointerleave", function () { hover = false; play(); });
      var sx = null;
      g.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
      g.addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { show(i + (dx < 0 ? 1 : -1)); play(); } sx = null; });
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) play(); else stop(); }, { threshold: 0.4 }).observe(g);
    });
  }

  /* ---------------- In-page anchors with smooth scroll ---------------- */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var el = document.getElementById(id.slice(1));
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el, -80);
      history.replaceState(null, "", id);
    });
    if (location.hash && location.hash.length > 1) {
      var el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(function () { scrollToTarget(el, -80); }, 400);
    }
  }

  /* ---------------- Page transition curtain ---------------- */
  function initTransitions() {
    var curtain = $(".curtain");
    if (!curtain || !hasGsap) return;
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank" || a.hasAttribute("download")) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash) || url.pathname === location.pathname || /\.(pdf|zip|jpe?g|png|webp)$/i.test(url.pathname)) return;
      e.preventDefault();
      curtain.classList.add("is-leaving");
      gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "expo.in", onComplete: function () { location.href = url.href; } });
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) { curtain.classList.remove("is-leaving"); gsap.set(curtain, { yPercent: 100 }); } });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    initLenis();
    initHeader();
    initModal();
    initForms();
    initCarousels();
    initGalleries();
    initPointer();
    initReveals();
    initAnchors();
    initTransitions();
    $$("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
    runIntro(heroIn);
    if (hasGsap) window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
