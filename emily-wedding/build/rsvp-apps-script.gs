/**
 * RSVP → Google Sheet, for the Emily & Alexandre website.
 *
 * Setup (once):
 * 1. Open the RSVP Google Sheet → Extensions → Apps Script, paste this file, save.
 * 2. Deploy → New deployment → type "Web app"; Execute as: Me; Who has access: Anyone.
 * 3. Copy the web-app URL into CONFIG.rsvpEndpoint in build/src.html, then rebuild.
 *
 * Every reply becomes one row. Columns, in order:
 * A First name · B Last name · C Email · D Phone · E Home address ·
 * F Welcome Party · G Ceremony · H Reception · I Shuttle ·
 * J Allergies / intolerances · K Dietary notes · L Hotel · M Note for the couple ·
 * N Language · O Submitted at
 */
const HEADERS = [
  'First name', 'Last name', 'Email', 'Phone', 'Home address',
  'Welcome Party', 'Ceremony', 'Reception', 'Shuttle',
  'Allergies / intolerances', 'Dietary notes', 'Hotel', 'Note for the couple',
  'Language', 'Submitted at'
];
const KEYS = [
  'first', 'last', 'email', 'phone', 'address',
  'welcome', 'ceremony', 'reception', 'shuttle',
  'diet', 'diet_notes', 'hotel', 'message',
  'language', 'submitted'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    const data = JSON.parse(e.postData.contents);
    // Plain text only: a leading = + - @ would otherwise be read as a formula.
    const clean = v => String(v == null ? '' : v).replace(/^[=+\-@]/, "'$&").slice(0, 2000);
    sheet.appendRow(KEYS.map(k => clean(data[k])));
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}
