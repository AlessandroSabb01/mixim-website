export function locationPage(cfg, which){
  const data = which === "rome" ? {
    hero:"The Roman Home",
    heroImg:"Giotto_Picture-10.webp",
    intro:"A 45 sqm apartment in Rome's Aventino district at Viale Giotto. Air-conditioned, with TV and hair dryer. Suitable for 3–5 guests. Parking available on request.",
    features:["King-size bedroom","Living room with double sofa bed","Fully equipped kitchen","Bathroom with washing machine"],
    rooms:[
      {name:"Giotto 1", meta:"3 persons · double bed", desc:"Elegant double room with natural light and quiet surroundings."},
      {name:"Giotto 2", meta:"4 persons · double or twin bed", desc:"Ideal for couples or guests."},
      {name:"Giotto 3", meta:"4 persons · single bed", desc:"Suited to solo travelers or longer stays."},
      {name:"Giotto 4", meta:"5 persons · flexible arrangement", desc:"Suitable for families or friends."},
    ],
    experiences:["Colosseum","Vatican City","San Saba District","Restaurants in Aventino","Roman Rooftops","Aventino District"],
    pricing:{
      rows:[
        ["Per night (2 people)","€100","€75"],
        ["Additional person","€15","€10"],
        ["City tax (per person/day)","€6","€6"],
        ["Final cleaning","€50","€50"],
      ],
      seasons:["High Season (1 Apr–31 Oct, 22 Dec–6 Jan)","Low Season (1 Nov–2 Mar)"]
    },
    other: {label:"Crete · Palekastro", href:"/crete/"}
  } : {
    hero:"The Cretan Home",
    heroImg:"Creta_Picture-13.webp",
    intro:"A peaceful house surrounded by nature and sea, designed for slow living and complete relaxation.",
    features:["Sea and olive-grove views","Private garden","Flexible sleeping arrangements","Quiet, slow-living setting"],
    rooms:[
      {name:"Palekastro 1", meta:"5 persons · double bed", desc:"Wake up to the sound of waves and stunning Aegean views."},
      {name:"Palekastro 2", meta:"3 persons · double or twin bed", desc:"Peaceful room overlooking the olive grove and private garden."},
      {name:"Palekastro 3", meta:"2 persons · single bed", desc:"Flexible space ideal for families or additional guests."},
    ],
    experiences:["Local Tavernas","Island Living","Pristine Beaches","Aegean Sunsets","Coastal Exploration","Ancient Villages"],
    pricing:{
      rows:[
        ["Per apartment","€70 – €100","€40 – €80"],
        ["Additional person","€15","€10"],
        ["City tax (per person/day)","€8","€8"],
        ["Final cleaning","€30","€30"],
      ],
      seasons:["High Season (15 May – 15 Oct)","Low Season (15 Oct – 15 May)"]
    },
    other: {label:"Rome · Aventino", href:"/rome/"}
  };

  return `
  <section class="hero" style="height:80vh;min-height:460px">
    <img src="/assets/img/raw/${data.heroImg}" alt="${data.hero}">
    <div class="wrap hero-content">
      <div class="eyebrow reveal">${cfg.locations[which].label}</div>
      <h1 class="display reveal">${data.hero}</h1>
    </div>
  </section>

  <section>
    <div class="wrap grid-2">
      <div>
        <div class="kicker reveal">Overview</div>
        <p class="lead reveal">${data.intro}</p>
        <ul class="reveal" style="margin-top:20px;line-height:1.8;opacity:.85">
          ${data.features.map(f=>`<li>${f}</li>`).join("")}
        </ul>
        <a href="#" class="btn solid" data-open-book style="margin-top:10px">Book Now</a>
      </div>
      <div class="clip-reveal"><img src="/assets/img/raw/${data.heroImg}" alt=""></div>
    </div>
  </section>

  <section class="soft">
    <div class="wrap">
      <div class="kicker reveal">Rooms &amp; Spaces</div>
      <div class="grid-3" style="margin-top:30px">
        ${data.rooms.map(r=>`
        <div class="card reveal">
          <h3 class="display" style="font-size:1.2rem">${r.name}</h3>
          <p style="opacity:.6;font-size:.82rem;text-transform:uppercase;letter-spacing:.05em">${r.meta}</p>
          <p style="opacity:.85;margin-top:10px">${r.desc}</p>
        </div>`).join("")}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="kicker reveal">Experiences Nearby</div>
      <div class="grid-3" style="margin-top:30px">
        ${data.experiences.map(e=>`<div class="feature reveal"><h3>${e}</h3></div>`).join("")}
      </div>
    </div>
  </section>

  <section class="soft">
    <div class="wrap">
      <div class="kicker reveal">Pricing</div>
      <table class="reveal" style="width:100%;margin-top:20px;border-collapse:collapse">
        <thead><tr style="text-align:left;border-bottom:1px solid var(--line)">
          <th style="padding:12px 0"></th><th>${data.pricing.seasons[0]}</th><th>${data.pricing.seasons[1]}</th>
        </tr></thead>
        <tbody>
          ${data.pricing.rows.map(r=>`<tr style="border-bottom:1px solid var(--line)"><td style="padding:12px 0">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}
        </tbody>
      </table>
      <p style="margin-top:16px;opacity:.7;font-size:.9rem">Contact us for special offers.</p>
    </div>
  </section>

  <section class="dark">
    <div class="wrap" style="text-align:center">
      <h2 class="display reveal" style="font-size:clamp(1.8rem,3.4vw,2.6rem)">Also Explore ${data.other.label}</h2>
      <div style="margin-top:24px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
        <a href="${data.other.href}" class="btn ghost">Explore ${data.other.label}</a>
        <a href="#" class="btn solid" data-open-book>Book Now</a>
      </div>
    </div>
  </section>
  `;
}
