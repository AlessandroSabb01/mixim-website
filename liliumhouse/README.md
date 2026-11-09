# Lilium House 2.0

Nuovo sito di [liliumhouse.com](https://liliumhouse.com): stesse pagine, testi, foto, font (Cormorant Garamond + Inter) e colori del sito attuale, con animazioni, prenotazione, GDPR e versione italiana.
È statico (HTML, CSS, JS) con un piccolo script PHP per il modulo: funziona su qualsiasi hosting Hostinger.

## Struttura

```
liliumhouse/
├── src/
│   ├── config.json        ← telefono, link Google/Maps, dati legali (modifica qui)
│   ├── i18n/en.json|it.json ← tutti i testi, inglese e italiano
│   ├── pages/             ← Home, Roma/Creta (un solo template), About, Contact, Privacy, Cookie, 404
│   ├── partials/          ← header, footer, prenotazione, cookie, recensioni
│   ├── assets/            ← CSS, JS, foto WebP (originali del sito, nessun ritocco)
│   ├── api/contact.php    ← invio delle richieste di soggiorno via email
│   └── htaccess.txt       ← diventa dist/.htaccess
├── scripts/images.py      ← conversione delle foto originali in WebP responsive
└── build.mjs              ← genera dist/ e liliumhouse-hostinger.zip
```

URL: inglese su `/`, `/rome/`, `/crete/`, `/about/`, `/contact/` (come il sito attuale); italiano su `/it/`, `/it/roma/`, `/it/creta/`, `/it/chi-siamo/`, `/it/contatti/`.

## Build

```bash
cd liliumhouse && npm install && npm run build
```

Anteprima su sottodominio (noindex ovunque, niente redirect www):

```bash
SITE_URL=https://liliumhouse.miximcreativestudio.com STAGING=1 node build.mjs
```

## Pubblicazione su Hostinger

1. hPanel → File Manager → `public_html`: fai un backup del vecchio WordPress e svuota la cartella.
2. Carica `liliumhouse-hostinger.zip` → tasto destro → *Extract*. Controlla che `.htaccess` sia nella radice.
3. hPanel → Email: crea `noreply@liliumhouse.com` (mittente del modulo) e fai un invio di prova.
4. SSL attivo e cache LiteSpeed attiva.

## Da completare con la cliente

| Cosa | Dove |
|---|---|
| Email a cui arrivano le richieste (oggi il modulo, se non configurato, passa a WhatsApp) | `src/config.json` → `email` |
| Ragione sociale, P.IVA, sede | `src/config.json` → `legalName`, `vatNumber`, `registeredOffice` |
| Codice CIN dell'appartamento di Roma (obbligatorio negli annunci) e numero MHTE/AMA di Creta | `src/config.json` → `cinRome`, `mhteCrete` |
| Date e tempi di conservazione nella Privacy/Cookie Policy | `src/pages/*-policy.*.html` (evidenziati in giallo) |
| Indirizzo e link Google Maps della casa di Creta (oggi punta a Palekastro) | `src/config.json` → `creteMapsUrl`, `creteMapsEmbedUrl` |
| Link "Lascia una recensione": meglio quello ufficiale da Google Business Profile → *Chiedi recensioni* (`g.page/r/…/review`) | `src/config.json` → `googleReviewWriteUrl` (il QR si rigenera) |
| Bassa stagione Roma: 1 nov – 2 mar, alta 1 apr – 31 ott: manca il periodo 3 – 31 marzo | `src/i18n/*.json` → `pricing.rome` |
| Foto "Island Living" (Creta): è una foto stock di Mykonos; foto della home in alta definizione (l'originale è 1113 px) | `scripts/images.py` |

QR da stampare per le case: `dist/assets/qr-google-review.png` (1200 px) e `.svg`.
