/**
 * Mixim consultation requests -> Google Sheet (+ email notification)
 *
 * Setup (5 minutes):
 * 1. Create a Google Sheet, e.g. "Mixim · Consultation requests". Keep its sharing RESTRICTED
 *    (only the founders). Anyone who can open the Sheet can read the requests.
 * 2. Extensions > Apps Script, paste this file, set NOTIFY below, save.
 * 3. Deploy > New deployment > type "Web app"
 *      Execute as: Me        Who has access: Anyone
 *    ("Anyone" only means anyone can SUBMIT the form; nobody can read the Sheet through it.)
 * 4. Copy the Web app URL into build/config.json -> "form_endpoint", then run python3 build/build.py
 */
const NOTIFY = 'studio.miximfx@gmail.com'; // who receives an email for each new request ('' to disable)
const SHEET_NAME = 'Requests';
const HEADERS = ['Received', 'Name', 'Email', 'Company', 'Website', 'Interests', 'Format', 'Message', 'Language', 'Consent', 'Page'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    if (d.company_url) return ok_(); // honeypot
    if (!d.name || !d.email || d.consent !== 'yes') return ok_();

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS);

    const row = [new Date(), d.name, d.email, d.company, d.website, d.interests, d.format, d.message, d.lang, d.consent, d.page]
      .map(safe_);
    sh.appendRow(row);

    if (NOTIFY) {
      MailApp.sendEmail({
        to: NOTIFY,
        replyTo: String(d.email).slice(0, 200),
        subject: 'New consultation request · ' + String(d.name).slice(0, 80),
        body: HEADERS.slice(1).map(function (h, i) { return h + ': ' + (row[i + 1] || ''); }).join('\n')
      });
    }
    return ok_();
  } finally {
    lock.releaseLock();
  }
}

/* Neutralise spreadsheet formulas (= + - @) and cap the length of every cell. */
function safe_(v) {
  let s = v instanceof Date ? v : String(v == null ? '' : v).slice(0, 5000);
  if (typeof s === 'string' && /^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function ok_() {
  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
}
