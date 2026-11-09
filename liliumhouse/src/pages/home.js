export function homePage(cfg){
  return `
  <section class="hero">
    <img src="/assets/img/raw/d55b23f75_ebd5bc7b-b0ff-47a5-a352-f50bb932629d.jpg" alt="Lilium House">
    <div class="wrap hero-content">
      <div class="eyebrow reveal">Lilium House</div>
      <h1 class="display reveal">A Home Between <b>Rome</b> and the <b>Aegean</b></h1>
      <div style="margin-top:28px"><a href="#homes" class="btn solid">Discover Our Homes</a></div>
    </div>
    <div class="dock">
      <a href="#" data-open-book>Book</a>
      <a href="/rome/">Rome Home</a>
      <a href="/crete/">Crete Home</a>
      <a href="/contact/">Where We Are</a>
    </div>
  </section>

  <section>
    <div class="wrap grid-2">
      <div>
        <div class="kicker reveal">Welcome</div>
        <h2 class="display reveal" style="font-size:clamp(1.8rem,3.4vw,2.8rem)">Welcome to Lilium House</h2>
        <p class="lead reveal">Lilium House is not a hotel. It is a collection of homes created for those who value space, quiet, and authenticity.</p>
        <a href="/about/" class="btn ghost" style="margin-top:20px">Our Philosophy</a>
      </div>
      <div class="clip-reveal"><img src="/assets/img/raw/Giotto_Picture-10.webp" alt="Rome apartment interior"></div>
    </div>
  </section>

  <section class="soft" id="homes">
    <div class="wrap">
      <div class="kicker reveal">Our Homes</div>
      <h2 class="display reveal" style="font-size:clamp(1.8rem,3.4vw,2.8rem);margin-bottom:50px">Comfort &amp; Privacy</h2>
      <div class="grid-2">
        <div class="card reveal">
          <img src="/assets/img/raw/Giotto_Picture-10.webp" alt="Rome · Aventino">
          <h3 class="display" style="font-size:1.3rem">Rome · Aventino</h3>
          <p style="opacity:.8">A 45 sqm apartment in Rome's Aventino district, steps from the real life of the city.</p>
          <a href="/rome/" class="btn ghost" style="margin-top:16px">Explore Rome Home</a>
        </div>
        <div class="card reveal">
          <img src="/assets/img/raw/Creta_Picture-13.webp" alt="Crete · Palekastro">
          <h3 class="display" style="font-size:1.3rem">Crete · Palekastro</h3>
          <p style="opacity:.8">A peaceful house surrounded by nature and sea, designed for slow living.</p>
          <a href="/crete/" class="btn ghost" style="margin-top:16px">Explore Crete Home</a>
        </div>
      </div>
    </div>
  </section>

  <section class="dark">
    <div class="wrap">
      <p class="quote reveal">"Carefully chosen locations away from tourist crowds, close to real life."<cite>Guest Experience — Lilium House</cite></p>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="kicker reveal">A Thoughtful Way of Living</div>
      <div class="grid-3" style="margin-top:40px">
        <div class="feature reveal"><h3>Full Kitchens</h3><p>Full kitchens, comfortable workspaces, and everything you need.</p></div>
        <div class="feature reveal"><h3>Carefully Chosen Locations</h3><p>Carefully chosen locations away from tourist crowds, close to real life.</p></div>
        <div class="feature reveal"><h3>Depth Over Rush</h3><p>Designed for those who prefer depth over rushing through destinations.</p></div>
        <div class="feature reveal"><h3>Comfort &amp; Privacy</h3><p>Private, quiet homes where you can truly settle in.</p></div>
        <div class="feature reveal"><h3>Authenticity</h3><p>A collection of homes created for those who value space, quiet, and authenticity.</p></div>
        <div class="feature reveal"><h3>Personal Stays</h3><p>Make your stay truly personal, wherever you choose to be.</p></div>
      </div>
    </div>
  </section>

  ${reviewsSection(cfg)}

  <section class="soft">
    <div class="wrap" style="text-align:center">
      <h2 class="display reveal" style="font-size:clamp(1.8rem,4vw,3rem)">Begin Your Stay with Lilium House</h2>
      <div style="margin-top:28px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
        <a href="/rome/" class="btn solid">Discover Homes</a>
        <a href="/crete/" class="btn ghost">Discover Crete</a>
      </div>
    </div>
  </section>
  `;
}

export function reviewsSection(cfg){
  return `
  <section class="soft" id="reviews">
    <div class="wrap">
      <div class="kicker reveal">Guest Reviews</div>
      <h2 class="display reveal" style="font-size:clamp(1.8rem,3.4vw,2.6rem)">What Our Guests Say</h2>
      <div class="review-cards" style="margin-top:40px">
        <div class="card"><div class="stars">★★★★★</div><p>"A truly peaceful stay — exactly the quiet, authentic home we were looking for in Rome."</p></div>
        <div class="card"><div class="stars">★★★★★</div><p>"The Crete house felt like a real home, not a hotel. We'll be back."</p></div>
        <div class="card"><div class="stars">★★★★★</div><p>"Carefully chosen location, away from the crowds, with everything we needed."</p></div>
      </div>
      <div class="qr-box">
        <img src="/assets/img/review-qr.svg" alt="QR code to leave a Google review" width="96" height="96">
        <div>
          <p style="margin:0 0 10px">Enjoyed your stay? Leave us a review on Google, or scan the QR code.</p>
          <a class="btn solid" href="${cfg.reviews.googleReviewLink}" target="_blank">Leave a Review</a>
        </div>
      </div>
    </div>
  </section>`;
}
