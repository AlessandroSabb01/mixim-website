export function privacyPolicyPage(cfg){
  return `
  <section class="page-hero"><div class="wrap"><h1 class="display">Privacy Policy</h1></div></section>
  <section class="legal">
    <div class="wrap" style="max-width:760px">
      <p>This Privacy Policy explains how <mark class="placeholder">${cfg.brand.legalName}</mark> ("Lilium House", "we", "us") collects, uses and protects your personal data, in accordance with Regulation (EU) 2016/679 (GDPR) and applicable Italian/Greek data protection law.</p>

      <h2>1. Data Controller</h2>
      <p><mark class="placeholder">${cfg.brand.legalName}</mark><br>VAT: <mark class="placeholder">${cfg.brand.vat}</mark><br>Registered office: <mark class="placeholder">${cfg.brand.registeredOffice}</mark><br>Contact: <mark class="placeholder">${cfg.brand.dpoEmail}</mark></p>

      <h2>2. What Data We Collect</h2>
      <p>When you use our booking form or contact us, we may collect: your name, phone number, email address, preferred dates and the content of your message. We do not request payment data through this website.</p>

      <h2>3. Purpose &amp; Legal Basis</h2>
      <p>We process your data to respond to booking enquiries and provide customer support (performance of or steps towards a contract, Art. 6(1)(b) GDPR), and, where you consent, to show embedded third-party content such as Google Maps (consent, Art. 6(1)(a) GDPR).</p>

      <h2>4. Data Retention</h2>
      <p>Enquiry data is kept only as long as needed to respond to your request and for the legal retention periods required for any resulting booking, after which it is deleted. We do not store booking form data beyond email delivery.</p>

      <h2>5. Third Parties &amp; Embeds</h2>
      <p>Google Maps is loaded only after you give consent via our cookie banner. We may use a cookieless or consent-gated analytics tool; no advertising cookies are used.</p>

      <h2>6. Your Rights</h2>
      <p>You have the right to access, rectify, erase, restrict or object to the processing of your data, and to data portability. To exercise these rights, contact us at <mark class="placeholder">${cfg.brand.dpoEmail}</mark>.</p>

      <h2>7. Changes to This Policy</h2>
      <p>We may update this policy from time to time. The latest version is always available on this page.</p>
    </div>
  </section>`;
}

export function cookiePolicyPage(cfg){
  return `
  <section class="page-hero"><div class="wrap"><h1 class="display">Cookie Policy</h1></div></section>
  <section class="legal">
    <div class="wrap" style="max-width:760px">
      <p>This Cookie Policy explains how Lilium House uses cookies and similar technologies on this website.</p>

      <h2>1. What Are Cookies</h2>
      <p>Cookies are small text files stored on your device that help a website function and, where consented, understand how it is used.</p>

      <h2>2. Cookies We Use</h2>
      <p><strong>Strictly necessary:</strong> used to remember your cookie preference (stored in your browser's local storage for 6 months) and basic site functionality. These cannot be disabled.</p>
      <p><strong>Third-party embeds (consent-based):</strong> Google Maps is only loaded after you click "Accept all" or click directly on a map placeholder.</p>

      <h2>3. Managing Your Preferences</h2>
      <p>You can change your cookie choice at any time using the "Cookie preferences" link in the footer of every page. Your previous choice expires automatically after 6 months.</p>

      <h2>4. Contact</h2>
      <p>For questions about this policy, contact <mark class="placeholder">${cfg.brand.dpoEmail}</mark>.</p>
    </div>
  </section>`;
}
