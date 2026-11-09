import { head, } from "./head.js";
import { loader, header, stickyBar } from "./header.js";
import { footer, cookieBanner } from "./footer.js";
import { bookingModal } from "./booking.js";

const NAV = [
  { href:"/", label:"Home" },
  { href:"/rome/", label:"Rome" },
  { href:"/crete/", label:"Crete" },
  { href:"/about/", label:"About" },
  { href:"/contact/", label:"Contact" },
];

export function layout(cfg, page, bodyHtml){
  return `<!doctype html>
<html lang="en">
<head>
${head(cfg, page)}
</head>
<body>
${loader()}
${header(NAV, page.path)}
<main>
${bodyHtml}
</main>
${footer(cfg)}
${stickyBar()}
${bookingModal(cfg)}
${cookieBanner()}
<script src="/assets/js/main.js" defer></script>
</body>
</html>`;
}

export { NAV };
