export function bookingModal(cfg){
  return `
  <div id="book-modal">
    <div class="modal-panel">
      <span class="modal-close" data-close-book>&times;</span>
      <h3 class="display">Book Your Stay</h3>
      <form id="booking-form">
        <div class="field"><label>Name</label><input type="text" name="name" required></div>
        <div class="field"><label>Phone</label><input type="tel" name="phone" required></div>
        <div class="field"><label>Email</label><input type="email" name="email" required></div>
        <div class="field">
          <label>Location</label>
          <select name="reason">
            <option>Rome · Aventino</option>
            <option>Crete · Palekastro</option>
            <option>Not sure yet</option>
          </select>
        </div>
        <div class="field"><label>Preferred dates</label><input type="text" name="dates" placeholder="e.g. 12–18 June"></div>
        <div class="field consent-row">
          <input type="checkbox" name="privacy" id="privacy" required>
          <label for="privacy" style="text-transform:none;letter-spacing:0;font-size:.82rem">I agree to the <a href="/privacy-policy/" style="text-decoration:underline" target="_blank">Privacy Policy</a> and consent to being contacted about my enquiry.</label>
        </div>
        <button class="btn solid" type="submit" style="width:100%;border:none;cursor:pointer">Send Enquiry</button>
        <div class="form-msg" id="form-msg"></div>
      </form>
      <div class="modal-alt">
        <a class="btn ghost" href="${cfg.contact.whatsapp}" target="_blank">WhatsApp</a>
        <a class="btn ghost" href="tel:${cfg.contact.phoneHref}">Call ${cfg.contact.phone}</a>
      </div>
    </div>
  </div>`;
}
