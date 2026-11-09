(function(){
  "use strict";

  // ---- loader ----
  window.addEventListener("load",function(){
    var fill=document.querySelector("#loader .fill");
    if(fill) fill.style.strokeDasharray="300 1000";
    setTimeout(function(){document.body.classList.add("loaded")},650);
  });

  // ---- header scroll state ----
  var header=document.querySelector("header.site");
  function onScroll(){
    if(!header) return;
    header.classList.toggle("scrolled", window.scrollY>10);
  }
  window.addEventListener("scroll",onScroll);
  onScroll();

  // ---- mobile menu ----
  var burger=document.querySelector(".burger");
  if(burger){
    burger.addEventListener("click",function(){
      document.body.classList.toggle("menu-open");
    });
    document.querySelectorAll("#mobile-menu a").forEach(function(a){
      a.addEventListener("click",function(){document.body.classList.remove("menu-open")});
    });
  }

  // ---- scroll reveal (respects reduced motion) ----
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!reduce && "IntersectionObserver" in window){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add("in"); obs.unobserve(e.target); }
      });
    },{threshold:.2});
    document.querySelectorAll(".reveal,.clip-reveal").forEach(function(el){obs.observe(el)});
  } else {
    document.querySelectorAll(".reveal,.clip-reveal").forEach(function(el){el.classList.add("in")});
  }

  // ---- booking modal ----
  var modal=document.getElementById("book-modal");
  function openModal(){ if(modal) modal.classList.add("open"); document.body.style.overflow="hidden"; }
  function closeModal(){ if(modal) modal.classList.remove("open"); document.body.style.overflow=""; }
  document.querySelectorAll("[data-open-book]").forEach(function(b){b.addEventListener("click",function(e){e.preventDefault();openModal();})});
  document.querySelectorAll("[data-close-book]").forEach(function(b){b.addEventListener("click",closeModal)});
  if(modal) modal.addEventListener("click",function(e){ if(e.target===modal) closeModal(); });

  var form=document.getElementById("booking-form");
  if(form){
    form.addEventListener("submit",function(e){
      e.preventDefault();
      var msg=document.getElementById("form-msg");
      var data=new FormData(form);
      if(!data.get("privacy")){
        msg.textContent="Please accept the privacy policy to continue.";
        return;
      }
      fetch("/api/contact.php",{method:"POST",body:data})
        .then(function(r){return r.json().catch(function(){return {ok:true}})})
        .then(function(res){
          if(res && res.ok===false){
            msg.textContent="Something went wrong. Please try WhatsApp or call us instead.";
          } else {
            msg.textContent="Thank you — we will get back to you shortly.";
            form.reset();
          }
        })
        .catch(function(){
          var name=encodeURIComponent(data.get("name")||"");
          var reason=encodeURIComponent(data.get("reason")||"");
          var waText=encodeURIComponent("Hi Lilium House, my name is "+decodeURIComponent(name)+". I'd like to enquire about: "+decodeURIComponent(reason));
          msg.innerHTML='We couldn\'t reach the server. <a target="_blank" href="https://wa.me/393283243518?text='+waText+'">Continue on WhatsApp →</a>';
        });
    });
  }

  // ---- cookie consent ----
  var CONSENT_KEY="lh_cookie_consent";
  var SIX_MONTHS=1000*60*60*24*180;
  function getConsent(){
    try{
      var raw=localStorage.getItem(CONSENT_KEY);
      if(!raw) return null;
      var v=JSON.parse(raw);
      if(Date.now()-v.ts>SIX_MONTHS) return null;
      return v;
    }catch(e){ return null; }
  }
  function setConsent(value){
    try{ localStorage.setItem(CONSENT_KEY, JSON.stringify({value:value, ts:Date.now()})); }catch(e){}
    applyConsent(value);
    hideBanner();
  }
  function applyConsent(value){
    document.querySelectorAll("[data-consent-embed]").forEach(function(el){
      if(value==="all"){
        var src=el.getAttribute("data-src");
        if(src && !el.querySelector("iframe")){
          var ph=el.querySelector(".consent-placeholder");
          if(ph) ph.remove();
          var iframe=document.createElement("iframe");
          iframe.src=src; iframe.width="100%"; iframe.height="340"; iframe.style.border="0"; iframe.loading="lazy";
          el.appendChild(iframe);
        }
      }
    });
  }
  var banner=document.getElementById("cookie-banner");
  function showBanner(){ if(banner) banner.classList.add("show"); }
  function hideBanner(){ if(banner) banner.classList.remove("show"); }
  var existing=getConsent();
  if(existing){ applyConsent(existing.value); } else { showBanner(); }
  var accept=document.getElementById("cookie-accept");
  var reject=document.getElementById("cookie-reject");
  if(accept) accept.addEventListener("click",function(){setConsent("all")});
  if(reject) reject.addEventListener("click",function(){setConsent("none")});
  document.querySelectorAll("[data-reopen-cookie]").forEach(function(b){
    b.addEventListener("click",function(e){e.preventDefault();showBanner();});
  });
  document.querySelectorAll(".consent-placeholder").forEach(function(ph){
    ph.addEventListener("click",function(){ setConsent("all"); });
  });
})();
