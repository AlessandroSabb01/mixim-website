export function loader(){
  return `
  <div id="loader" aria-hidden="true">
    <svg viewBox="0 0 120 120">
      <circle class="outline" cx="60" cy="60" r="48"></circle>
      <circle class="fill" cx="60" cy="60" r="48" transform="rotate(-90 60 60)"></circle>
    </svg>
  </div>`;
}

export function header(nav, current){
  const links = nav.map(n => `<a href="${n.href}" class="${n.href===current?'active':''}">${n.label}</a>`).join("");
  return `
  <header class="site">
    <div class="wrap bar">
      <a href="/" class="logo">Lilium House</a>
      <nav class="primary">
        ${links}
        <a href="#" class="btn solid" data-open-book>Book Now</a>
      </nav>
      <div class="burger" aria-label="Open menu"><span></span><span></span><span></span></div>
    </div>
  </header>
  <div id="mobile-menu">
    <nav>${nav.map(n=>`<a href="${n.href}">${n.label}</a>`).join("")}</nav>
    <div>
      <div class="menu-quick" style="margin-bottom:18px">
        <a class="btn ghost" href="https://wa.me/393283243518" target="_blank">WhatsApp</a>
        <a class="btn ghost" href="tel:+393283243518">Call</a>
      </div>
      <a href="#" class="btn solid" data-open-book>Book Now</a>
    </div>
  </div>`;
}

export function stickyBar(){
  return `
  <div id="sticky-bar">
    <a href="tel:+393283243518">Call</a>
    <a href="https://wa.me/393283243518" target="_blank">WhatsApp</a>
    <a href="#" data-open-book>Book</a>
  </div>`;
}
