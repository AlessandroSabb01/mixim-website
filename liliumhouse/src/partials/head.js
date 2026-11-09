export function head(cfg, page){
  const url = `${cfg.seo.siteUrl}${page.path}`;
  const staging = process.env.STAGING === "1";
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${page.title} — Lilium House</title>
  <meta name="description" content="${page.description || cfg.seo.description}">
  <link rel="canonical" href="${url}">
  ${staging ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow">'}
  <meta property="og:title" content="${page.title} — Lilium House">
  <meta property="og:description" content="${page.description || cfg.seo.description}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${cfg.seo.siteUrl}/assets/img/raw/d55b23f75_ebd5bc7b-b0ff-47a5-a352-f50bb932629d.jpg">
  <link rel="icon" href="/assets/img/raw/cropped-FAVICON_LiliumHouse-192x192.png">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
  <script type="application/ld+json">
  ${JSON.stringify({
    "@context":"https://schema.org",
    "@type":"LodgingBusiness",
    "name":"Lilium House",
    "description": cfg.seo.description,
    "url": cfg.seo.siteUrl,
    "telephone": cfg.contact.phone,
    "sameAs": cfg.social.instagram && !cfg.social.instagram.startsWith("[[") ? [cfg.social.instagram] : []
  })}
  </script>`;
}
