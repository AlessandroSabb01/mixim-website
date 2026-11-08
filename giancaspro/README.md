# Studio Dentistico Giancaspro: sito 2027

Il nuovo sito di [studiogiancaspro.it](https://www.studiogiancaspro.it) è statico: HTML, CSS e JS già pronti, con un piccolo script PHP per il modulo di contatto.
Funziona su qualsiasi hosting Hostinger, senza Node.js sul server.

## Struttura

```
giancaspro/
├── src/
│   ├── config.json         ← telefono, orari, link Google/Instagram, P.IVA…  (modifica qui)
│   ├── pages/              ← 5 pagine + Privacy, Cookie e 404
│   ├── partials/           ← header, footer, modale Prenota, banner cookie, recensioni, Instagram
│   ├── assets/css|js|img   ← stile, interazioni, foto WebP ingrandite in HD
│   ├── api/contact.php     ← invio delle richieste di appuntamento via email
│   └── htaccess.txt        ← diventa dist/.htaccess
├── scripts/images.py       ← conversione delle foto in WebP responsive
├── build.mjs               ← genera dist/ e giancaspro-hostinger.zip
├── dist/                   ← SITO PRONTO (contenuto di public_html)
└── giancaspro-hostinger.zip
```

## Build

```bash
cd giancaspro && npm install && npm run build
```

Per vederlo in locale:

```bash
npm run serve
```

Poi apri http://localhost:4173.

## Pubblicazione su Hostinger

**Opzione A: zip (la più rapida)**
1. hPanel → File Manager → `public_html`. Fai un backup del vecchio WordPress e svuota la cartella.
2. Carica `giancaspro-hostinger.zip` → tasto destro → *Extract*.
3. Controlla che `.htaccess` sia nella radice di `public_html` (i file nascosti vanno resi visibili).

**Opzione B: auto deploy da GitHub**
1. A ogni push su `giancaspro/**`, la GitHub Action `.github/workflows/giancaspro-deploy.yml` fa la build e pubblica `dist/` sul branch `hostinger-giancaspro`.
2. hPanel → Avanzate → **Git** → repository `alessandrosabb01/mixim-website`, branch `hostinger-giancaspro`, cartella `public_html`.
3. Attiva **Auto Deployment** e copia l'URL del webhook in GitHub → Settings → Webhooks.

**Dopo il primo upload**
- hPanel → Email: crea la casella `noreply@studiogiancaspro.it`, usata come mittente del modulo (vedi `src/api/contact.php`).
- Fai un invio di prova del modulo e controlla che arrivi su info@studiogiancaspro.it.
- hPanel → SSL attivo e Cache LiteSpeed attiva.

## Da completare con la cliente

| Cosa | Dove |
|---|---|
| Ragione sociale, P.IVA, PEC, DPO, date, tempi di conservazione | `src/pages/privacy-policy.html`, `cookie-policy.html` (evidenziati in giallo) |
| P.IVA e n. iscrizione all'Albo del Direttore Sanitario (obbligatori nella pubblicità sanitaria) | `src/config.json` → `vatNumber`, `medicalDirectorRegistration` |
| **Orari corretti**: la vecchia Home diceva *Lun–Ven 9–19, sabato su appuntamento*, la pagina Contatti *Lun–Ven 10–20, weekend chiuso* | `src/config.json` → `hoursWeek`, `hoursWeekend` (oggi: versione della pagina Contatti) |
| Il telefono fisso `+39 06 841 2345` sembra un numero di prova | `src/config.json` → `phoneLandline` |
| Feed Instagram automatico: crea un feed gratuito su behold.so collegando l'account Instagram (Business/Creator) e incolla il *Feed ID* | `src/config.json` → `beholdFeedId` |
| Link diretto "Lascia una recensione": Google Business Profile → *Chiedi recensioni* → copia il link `g.page/r/…/review` | `src/config.json` → `googleReviewWriteUrl` (rigenera anche il QR) |

Il QR code da stampare per lo studio viene generato a ogni build: `dist/assets/qr-recensioni-google.png` (1200 px) e `.svg`.

## GDPR in sintesi
- Prima del consenso non parte nessuna richiesta a terze parti: i font sono sul nostro server, Google Maps e Instagram sono bloccati con un'anteprima.
- Il banner ha "Rifiuta" in evidenza quanto "Accetta", la X equivale a rifiuto, c'è "Personalizza" e la scelta viene richiesta di nuovo dopo 6 mesi. Si può revocare da *Preferenze cookie* nel footer.
- Il modulo ha la casella privacy non preselezionata, un honeypot anti-spam e un limite di frequenza. I dati non vengono salvati su database.
- Nessun analytics. Se in futuro verrà aggiunto, va inserito come nuova categoria nel banner (`src/assets/js/consent.js`).
