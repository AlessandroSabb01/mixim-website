export function contactPage(cfg){
  const rome = cfg.locations.rome, crete = cfg.locations.crete;
  return `
  <section class="page-hero">
    <div class="wrap">
      <div class="kicker reveal">Contact</div>
      <h1 class="display reveal" style="font-size:clamp(2rem,4.4vw,3.4rem)">Where We Are</h1>
    </div>
  </section>

  <section>
    <div class="wrap grid-2">
      <div class="card reveal">
        <h3 class="display" style="font-size:1.3rem">${rome.label}</h3>
        <p style="opacity:.8">${rome.address}</p>
        <a class="btn ghost" style="margin-top:14px" href="${rome.mapsLink}" target="_blank">View on Google Maps</a>
        <div class="consent-placeholder" data-consent-embed data-src="https://www.google.com/maps?q=${encodeURIComponent(rome.embedQuery)}&output=embed" style="margin-top:16px">
          Click to load Google Maps (requires cookie consent)
        </div>
      </div>
      <div class="card reveal">
        <h3 class="display" style="font-size:1.3rem">${crete.label}</h3>
        <p style="opacity:.8">${crete.address}</p>
        <a class="btn ghost" style="margin-top:14px" href="${crete.mapsLink}" target="_blank">View on Google Maps</a>
        <div class="consent-placeholder" data-consent-embed data-src="https://www.google.com/maps?q=${encodeURIComponent(crete.embedQuery)}&output=embed" style="margin-top:16px">
          Click to load Google Maps (requires cookie consent)
        </div>
      </div>
    </div>
  </section>

  <section class="soft">
    <div class="wrap grid-2">
      <div>
        <div class="kicker reveal">Get in Touch</div>
        <p class="lead reveal">Reservations and availability are handled directly via WhatsApp and phone.</p>
        <div style="display:flex;gap:12px;margin-top:20px;flex-wrap:wrap">
          <a class="btn solid" href="${cfg.contact.whatsapp}" target="_blank">WhatsApp</a>
          <a class="btn ghost" href="tel:${cfg.contact.phoneHref}">${cfg.contact.phone}</a>
        </div>
      </div>
      <div>
        <a href="#" class="btn solid" data-open-book>Open Booking Form</a>
      </div>
    </div>
  </section>
  `;
}
