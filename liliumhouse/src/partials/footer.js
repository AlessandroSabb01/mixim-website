export function footer(cfg){
  return `
  <footer class="site">
    <div class="wrap grid-2">
      <div>
        <h4>Lilium House</h4>
        <p style="opacity:.75;max-width:34ch;line-height:1.6">${cfg.seo.description}</p>
      </div>
      <div>
        <h4>Locations</h4>
        <a href="/rome/">${cfg.locations.rome.label}</a>
        <a href="/crete/">${cfg.locations.crete.label}</a>
      </div>
      <div>
        <h4>Contact</h4>
        <a href="tel:${cfg.contact.phoneHref}">${cfg.contact.phone}</a>
        <a href="${cfg.contact.whatsapp}" target="_blank">WhatsApp</a>
        <a href="/contact/">Enquire</a>
        <a href="#" data-reopen-cookie>Cookie preferences</a>
      </div>
    </div>
    <div class="wrap credit">
      <div>© ${new Date().getFullYear()} Lilium House. All rights reserved. · <mark class="placeholder">${cfg.brand.legalName}</mark> · VAT <mark class="placeholder">${cfg.brand.vat}</mark> ·
        <a href="/privacy-policy/">Privacy Policy</a> · <a href="/cookie-policy/">Cookie Policy</a>
      </div>
      <div>Sito progettato e sviluppato da Alessandro Sabbadini — <a href="https://alessandrosabbadini.com/" target="_blank">Ti piace questo sito? Scopri come posso creare il tuo →</a></div>
    </div>
  </footer>`;
}

export function cookieBanner(){
  return `
  <div id="cookie-banner">
    <div class="cookie-row">
      <p style="margin:0;max-width:52ch;font-size:.9rem">We use cookies to run this site and, with your consent, to show embedded maps and social content. See our <a href="/cookie-policy/" style="text-decoration:underline">Cookie Policy</a>.</p>
      <div class="cookie-actions">
        <button id="cookie-reject" class="btn ghost">Reject</button>
        <button id="cookie-accept" class="btn solid">Accept all</button>
      </div>
    </div>
  </div>`;
}
