export function aboutPage(cfg){
  return `
  <section class="page-hero">
    <div class="wrap">
      <div class="kicker reveal">Our Philosophy</div>
      <h1 class="display reveal" style="font-size:clamp(2rem,4.4vw,3.4rem)">Make Your Stay <b>Truly Personal</b></h1>
    </div>
  </section>

  <section>
    <div class="wrap grid-2">
      <div class="clip-reveal"><img src="/assets/img/raw/hf_20260210_184732_bf11b955-bfe2-4bee-874b-f229d4c17d3a.webp" alt="Lilium House"></div>
      <div>
        <p class="lead reveal">Lilium House is not a hotel. It is a collection of homes created for those who value space, quiet, and authenticity.</p>
        <p class="lead reveal">Carefully chosen locations away from tourist crowds, close to real life. Designed for those who prefer depth over rushing through destinations.</p>
      </div>
    </div>
  </section>

  <section class="soft">
    <div class="wrap">
      <div class="kicker reveal">A Thoughtful Way of Living</div>
      <div class="grid-3" style="margin-top:30px">
        <div class="feature reveal"><h3>Full Kitchens</h3><p>Comfortable workspaces, and everything you need.</p></div>
        <div class="feature reveal"><h3>Comfort &amp; Privacy</h3><p>Private, quiet homes in both Rome and Crete.</p></div>
        <div class="feature reveal"><h3>Real Life</h3><p>Close to the real rhythm of each place, not the tourist trail.</p></div>
      </div>
    </div>
  </section>

  <section class="dark">
    <div class="wrap">
      <div class="kicker reveal" style="color:var(--gold)">Legal Information</div>
      <p style="opacity:.85;line-height:1.7;max-width:60ch">
        <mark class="placeholder">${cfg.brand.legalName}</mark> — VAT <mark class="placeholder">${cfg.brand.vat}</mark> — Registered office: <mark class="placeholder">${cfg.brand.registeredOffice}</mark>
      </p>
    </div>
  </section>
  `;
}
