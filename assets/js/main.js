/* =========================================================
   Studio Dentistico Giancaspro — interazioni
   Lenis (scroll fluido) + GSAP/ScrollTrigger (animazioni)
   ========================================================= */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && !reduce;
  var lenis = null;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Scroll fluido ---------------- */
  function initLenis() {
    if (reduce || typeof window.Lenis === "undefined") return;
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
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
  function scrollToTarget(target, offset) {
    if (lenis) lenis.scrollTo(target, { offset: offset || -96, duration: 1.4 });
    else {
      var el = typeof target === "string" ? $(target) : target;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (offset || -96), behavior: reduce ? "auto" : "smooth" });
    }
  }

  /* ---------------- Intro: dente che si "ricarica" ---------------- */
  function runIntro(done) {
    var loader = $("#loader");
    if (!loader || doc.classList.contains("no-intro")) { done(); return; }
    try { sessionStorage.setItem("gc-intro", "1"); } catch (e) {}

    var wave = $("#tooth-wave", loader);
    var pctEl = $(".loader__pct", loader);
    var bar = $(".loader__bar i", loader);
    var spark = $(".loader__spark", loader);
    var start = performance.now();
    var MIN = reduce ? 300 : 2300, MAX = 6000;
    var ready = false, shown = 0;

    // Avanzamento reale: immagine hero + font
    var waits = [];
    var heroImg = $(".hero__media img, .page-hero__media img");
    if (heroImg && !heroImg.complete) waits.push(new Promise(function (r) { heroImg.addEventListener("load", r, { once: true }); heroImg.addEventListener("error", r, { once: true }); }));
    if (document.fonts && document.fonts.ready) waits.push(document.fonts.ready);
    Promise.all(waits).then(function () { ready = true; });
    setTimeout(function () { ready = true; }, MAX);

    function wavePath(level, t) {
      // level 0..1 → y da 118 (vuoto) a -4 (pieno)
      var y = 118 - level * 122;
      var amp = 2.6 * (1 - level) + 0.6;
      var d = "M -10 " + (y).toFixed(2);
      for (var x = -10; x <= 110; x += 5) {
        var yy = y + Math.sin((x / 100) * Math.PI * 2.2 + t / 260) * amp;
        d += " L " + x + " " + yy.toFixed(2);
      }
      return d + " L 110 130 L -10 130 Z";
    }

    function frame(now) {
      var el = now - start;
      var timeP = Math.min(el / MIN, 1);
      var eased = 1 - Math.pow(1 - timeP, 3);
      var target = ready ? eased : Math.min(eased, 0.9);
      shown += (target - shown) * 0.12;
      if (target >= 1 && shown > 0.995) shown = 1;
      var pct = Math.round(shown * 100);
      if (wave) wave.setAttribute("d", wavePath(shown, now));
      if (pctEl) pctEl.textContent = pct;
      if (bar) bar.style.transform = "scaleX(" + shown + ")";
      if (shown < 1) requestAnimationFrame(frame);
      else finish();
    }

    function finish() {
      // "Clink": scintilla in alto a destra del dente, poi dissolvenza nel sito
      if (hasGsap) {
        var tl = gsap.timeline({ onComplete: function () { loader.remove(); } });
        tl.to(spark, { opacity: 1, scale: 1.15, rotate: 0, duration: 0.35, ease: "back.out(3)" })
          .to(spark, { scale: 0.85, opacity: 0, rotate: 45, duration: 0.45, ease: "power2.in" }, "+=0.12")
          .add(function () { done(); }, "-=0.2")
          .to(loader, { opacity: 0, duration: 0.9, ease: "power2.inOut" }, "-=0.15")
          .to(".loader__inner", { scale: 1.06, filter: "blur(6px)", duration: 0.9, ease: "power2.inOut" }, "<");
      } else {
        loader.style.transition = "opacity .6s";
        loader.style.opacity = "0";
        done();
        setTimeout(function () { loader.remove(); }, 650);
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- Header ---------------- */
  function initHeader() {
    var header = $(".site-header");
    if (!header) return;
    var lastY = 0;
    var hero = $(".hero, .page-hero");
    var bar = $(".action-bar");
    function onScroll() {
      var y = window.scrollY;
      // header sempre visibile: l'ombra si intensifica dopo i primi pixel
      header.classList.toggle("is-scrolled", y > 8);
      if (bar) bar.classList.toggle("is-visible", y > (hero ? hero.offsetHeight * 0.7 : 400));
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var burger = $(".nav__burger");
    var menu = $("#menu");
    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = burger.getAttribute("aria-expanded") !== "true";
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        menu.classList.toggle("is-open", open);
        menu.setAttribute("aria-hidden", open ? "false" : "true");
        if (open) menu.removeAttribute("inert"); else menu.setAttribute("inert", "");
        doc.classList.toggle("menu-open", open);
        header.classList.remove("is-hidden");
        lockScroll(open);
        burger.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
        if (open && hasGsap) gsap.fromTo($$(".menu__list li, .menu__foot > *", menu), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: "expo.out", delay: 0.2, clearProps: "transform,opacity" });
      });
      menu.addEventListener("click", function (e) { if (e.target.closest("a")) burger.click(); });
    }
  }

  /* ---------------- Split delle righe dei titoli ---------------- */
  function splitLines(el) {
    if (el.dataset.splitDone) return [];
    var words = [];
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span");
            w.className = "split-line"; w.innerHTML = "<span></span>";
            w.firstChild.textContent = p;
            frag.appendChild(w); words.push(w.firstChild);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR") {
          walk(n);
        }
      });
    };
    walk(el);
    el.querySelectorAll(".split-line").forEach(function (s) { s.style.display = "inline-block"; });
    el.dataset.splitDone = "1";
    return words;
  }

  /* ---------------- Animazioni allo scroll ---------------- */
  function initReveals() {
    if (!hasGsap) { doc.classList.remove("js"); return; }

    $$("[data-split]").forEach(function (el) {
      var w = splitLines(el);
      if (el.closest(".hero, .page-hero")) return; // gestito dall'ingresso hero
      gsap.from(w, { yPercent: 115, rotate: 2, duration: 1.15, ease: "expo.out", stagger: 0.035,
        scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });

    $$("[data-reveal]").forEach(function (el) {
      if (el.closest(".hero, .page-hero")) return;
      var type = el.getAttribute("data-reveal");
      var delay = parseFloat(el.getAttribute("data-delay") || 0);
      var st = { trigger: el, start: "top 90%", once: true };
      if (type === "clip") {
        var img = el.querySelector("img");
        gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out", delay: delay, scrollTrigger: st });
        if (img) gsap.to(img, { scale: 1, duration: 1.8, ease: "expo.out", delay: delay, scrollTrigger: st });
      } else {
        gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", delay: delay, scrollTrigger: st });
      }
    });

    $$("[data-stagger]").forEach(function (group) {
      var kids = Array.prototype.slice.call(group.children);
      gsap.set(kids, { opacity: 0, y: 46 });
      ScrollTrigger.batch(kids, {
        start: "top 92%", once: true,
        onEnter: function (b) {
          b.forEach(function (k) { k.style.transition = "none"; });
          gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, clearProps: "transform,opacity,transition" });
        }
      });
    });

    // Sezioni che "si aprono" mentre entrano nello schermo
    $$("[data-open]").forEach(function (el) {
      gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: el, start: "top 95%", end: "top 35%", scrub: 0.6 } });
    });

    $$("[data-parallax]").forEach(function (el) {
      var amt = parseFloat(el.getAttribute("data-parallax")) || 12;
      gsap.fromTo(el, { yPercent: -amt / 2 }, { yPercent: amt / 2, ease: "none",
        scrollTrigger: { trigger: el.closest("section, .media, figure") || el, start: "top bottom", end: "bottom top", scrub: true } });
    });

    $$(".page-hero__media img").forEach(function (img) {
      gsap.to(img, { yPercent: 12, scale: 1.18, ease: "none", scrollTrigger: { trigger: img.closest(".page-hero"), start: "top top", end: "bottom top", scrub: true } });
    });

    $$("[data-count]").forEach(function (el) {
      var end = parseFloat(el.getAttribute("data-count"));
      var obj = { v: 0 };
      var sup = el.querySelector("sup");
      var supHTML = sup ? sup.outerHTML : "";
      gsap.to(obj, { v: end, duration: end > 500 ? 2.2 : 1.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: function () { el.innerHTML = Math.round(obj.v) + supHTML; } });
    });

    // Rotazione lenta della scritta del footer
    var wm = $(".footer__wordmark");
    if (wm) gsap.from(wm, { yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: wm, start: "top 95%", once: true } });
  }

  /* ---------------- Ingresso hero ---------------- */
  function heroIn() {
    doc.classList.add("intro-done");
    document.dispatchEvent(new Event("intro:done"));
    if (lenis) lenis.start();
    var hero = $(".hero") || $(".page-hero");
    if (!hero || !hasGsap) { $$(".hero [data-reveal], .page-hero [data-reveal]").forEach(function (e) { e.style.opacity = 1; e.style.transform = "none"; }); return; }
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    var media = $(".hero__media img, .page-hero__media img", hero);
    if (media && hero.classList.contains("hero")) tl.fromTo(media, { scale: 1.22 }, { scale: 1.04, duration: 2.6, ease: "power3.out" }, 0);
    var words = [];
    $$("[data-split]", hero).forEach(function (el) { words = words.concat(Array.prototype.slice.call(el.querySelectorAll(".split-line > span"))); });
    if (words.length) tl.from(words, { yPercent: 120, rotate: 3, duration: 1.3, stagger: 0.05 }, 0.15);
    var rev = $$("[data-reveal]", hero);
    if (rev.length) tl.to(rev, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.45);
    var tiles = $$(".dock .tile", hero);
    if (tiles.length) {
      // fromTo esplicito + clearProps: evita conflitti con la transition CSS delle tile
      tiles.forEach(function (t) { t.style.transition = "none"; });
      tl.fromTo(tiles, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.07, clearProps: "transform,opacity,transition" }, 0.6);
    }
    if (media && hero.classList.contains("hero")) {
      gsap.to(media, { yPercent: 10, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    }
  }

  /* ---------------- Puntatore: glow su bottoni e card ---------------- */
  function initPointer() {
    if (!window.matchMedia("(hover: hover)").matches) return;
    document.addEventListener("pointermove", function (e) {
      var t = e.target.closest(".btn, .card");
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
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      el.addEventListener("pointerleave", function () { xTo(0); yTo(0); });
    });
  }

  /* ---------------- Modale prenotazione ---------------- */
  var lastFocus = null;
  function openModal(treatment) {
    var m = $("#booking");
    if (!m) return;
    lastFocus = document.activeElement;
    m.hidden = false;
    m.removeAttribute("inert");
    requestAnimationFrame(function () { m.classList.add("is-open"); });
    lockScroll(true);
    var sel = $("select[name=trattamento]", m);
    if (sel && treatment) {
      Array.prototype.forEach.call(sel.options, function (o) { if (o.value === treatment) sel.value = treatment; });
    }
    setTimeout(function () { var f = $("input[name=nome]", m); if (f) f.focus(); }, 450);
  }
  function closeModal() {
    var m = $("#booking");
    if (!m || !m.classList.contains("is-open")) return;
    m.classList.remove("is-open");
    lockScroll(false);
    setTimeout(function () { m.hidden = true; m.setAttribute("inert", ""); }, 600);
    if (lastFocus) lastFocus.focus();
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

  /* ---------------- Form richiesta appuntamento ---------------- */
  function initForms() {
    $$("form[data-form]").forEach(function (form) {
      var status = $(".form__status", form);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var invalid = false;
        $$("[required]", form).forEach(function (f) {
          var ok = f.type === "checkbox" ? f.checked : f.value.trim() !== "" && (!f.checkValidity || f.checkValidity());
          f.setAttribute("aria-invalid", ok ? "false" : "true");
          if (!ok && !invalid) { invalid = true; f.focus(); }
        });
        if (invalid) {
          status.className = "form__status is-error";
          status.textContent = "Compila i campi obbligatori (*) e accetta l'informativa privacy.";
          return;
        }
        var btn = $("button[type=submit]", form);
        btn.disabled = true;
        var label = btn.innerHTML;
        btn.textContent = "Invio in corso…";
        var data = new FormData(form);
        data.append("pagina", location.pathname);
        fetch(form.getAttribute("action"), { method: "POST", body: data, headers: { "Accept": "application/json" } })
          .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
          .then(function (res) {
            if (!res || !res.ok) throw new Error((res && res.error) || "send");
            status.className = "form__status is-ok";
            status.textContent = "Grazie! Abbiamo ricevuto la tua richiesta: ti ricontatteremo entro 24 ore.";
            form.reset();
          })
          .catch(function () {
            var wa = form.getAttribute("data-wa");
            var msg = "Buongiorno, sono " + (data.get("nome") || "") + " " + (data.get("cognome") || "") + ". Vorrei richiedere un appuntamento" + (data.get("trattamento") ? " per " + data.get("trattamento") : "") + ". " + (data.get("messaggio") || "");
            status.className = "form__status is-error";
            status.innerHTML = 'Invio non riuscito. Puoi scriverci subito su <a href="https://wa.me/' + wa + "?text=" + encodeURIComponent(msg) + '" target="_blank" rel="noopener">WhatsApp</a> o chiamarci.';
          })
          .finally(function () { btn.disabled = false; btn.innerHTML = label; });
      });
    });
  }

  /* ---------------- Caroselli (drag + progress) ---------------- */
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
      var step = function (dir) {
        var item = track.firstElementChild;
        var w = item ? item.getBoundingClientRect().width + 14 : 300;
        track.scrollBy({ left: dir * w, behavior: reduce ? "auto" : "smooth" });
      };
      var prev = $("[data-prev]", c), next = $("[data-next]", c);
      if (prev) prev.addEventListener("click", function () { step(-1); });
      if (next) next.addEventListener("click", function () { step(1); });
      // drag con mouse
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
        if (moved) { var item = track.firstElementChild; var w = item ? item.getBoundingClientRect().width + 14 : 300; track.scrollTo({ left: Math.round(track.scrollLeft / w) * w, behavior: "smooth" }); }
      });
    });
  }

  /* ---------------- Galleria trattamenti ---------------- */
  function initGalleries() {
    $$("[data-gallery]").forEach(function (g) {
      var figs = $$(".tgallery__frame figure", g);
      var thumbs = $$(".tgallery__thumbs button", g);
      var count = $(".tgallery__count", g);
      if (figs.length < 2) return;
      var i = 0, timer = null, visible = false;
      function show(n) {
        i = (n + figs.length) % figs.length;
        figs.forEach(function (f, k) { f.classList.toggle("is-active", k === i); });
        thumbs.forEach(function (t, k) { t.setAttribute("aria-current", k === i ? "true" : "false"); });
        if (count) count.textContent = ("0" + (i + 1)).slice(-2) + " / " + ("0" + figs.length).slice(-2);
      }
      function stop() { if (timer) clearInterval(timer); timer = null; }
      function play() { stop(); if (!reduce && visible) timer = setInterval(function () { show(i + 1); }, 4500); }
      thumbs.forEach(function (t, k) { t.addEventListener("click", function () { show(k); play(); }); });
      g.addEventListener("pointerenter", stop);
      g.addEventListener("pointerleave", play);
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) play(); else stop(); }, { threshold: 0.4 }).observe(g);
    });
  }

  /* ---------------- Indice trattamenti (scrollspy) ---------------- */
  function initTreatmentIndex() {
    var links = $$(".tr-index__list a");
    if (!links.length) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var setActive = function (id) {
      links.forEach(function (a) { a.classList.remove("is-active"); });
      var a = map[id];
      if (!a) return;
      a.classList.add("is-active");
      var list = a.parentElement.parentElement;
      if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: a.offsetLeft - 24, behavior: "smooth" });
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    $$(".treatment[id]").forEach(function (s) { io.observe(s); });
  }

  /* ---------------- Ancore interne con scroll fluido ---------------- */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var el = document.getElementById(id.slice(1));
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el, -100);
      history.replaceState(null, "", id);
    });
    if (location.hash && location.hash.length > 1) {
      var el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(function () { scrollToTarget(el, -100); }, 400);
    }
  }

  /* ---------------- Transizione tra pagine ---------------- */
  function initTransitions() {
    var curtain = $(".curtain");
    if (!curtain || !hasGsap) return;
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank" || a.hasAttribute("download")) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || /\.(pdf|zip|jpe?g|png|webp)$/i.test(url.pathname)) return;
      e.preventDefault();
      curtain.classList.add("is-leaving");
      gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "expo.in", onComplete: function () { location.href = url.href; } });
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) { curtain.classList.remove("is-leaving"); gsap.set(curtain, { yPercent: 100 }); } });
  }

  /* ---------------- Avvio ---------------- */
  function boot() {
    initLenis();
    initHeader();
    initModal();
    initForms();
    initCarousels();
    initTreatmentIndex();
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
