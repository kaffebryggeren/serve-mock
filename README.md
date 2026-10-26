# serve-mock – lokal konverteringsmock (to sider)

En **lokal, offline mock** av to sider fra serve.no, bygget for å vise anbefalte
konverteringsforbedringer i et internt møte:

| Side | Original | Mock |
|------|----------|------|
| Møteromsløsninger | `https://serve.no/losninger/moteromslosninger/` | `moterom.html` |
| Digital signage | `https://serve.no/losninger/digital-signage/` | `signage.html` |
| Oversikt | – | `index.html` |

> **Status: gjennomgangskopi – ikke produksjon.** Ingenting er lastet opp til serve.no eller
> endret i WordPress. Repoet [`kaffebryggeren/serve-mock`](https://github.com/kaffebryggeren/serve-mock)
> er publisert som en **offentlig gjennomgangskopi** på GitHub Pages, slik at kollegaer kan se de
> faktiske sidene: **https://kaffebryggeren.github.io/serve-mock/**
> Alle tre sider har `noindex, nofollow`, så de skal ikke dukke opp i søkemotorer.
>
> Skjemaene sender **ingen** data – de viser en bekreftelse i siden og logger til konsollen.
> Alt av CSS, fonter, logo og bilder er hentet med **skrivebeskyttede HTTP GET** mot serve.no
> og ligger lokalt i `assets/`, slik at sidene fungerer helt offline. Ingen tracking, analytics
> eller andre eksterne tjenester er inkludert.

---

## 1. Start og stopp

Mocken er rene statiske filer og trenger ingen build. Start en lokal server fra `serve-mock/`:

```powershell
# fra mappen serve-mock/
python -m http.server 8080 --bind 127.0.0.1
```

Åpne deretter:

- **Oversikt (to kort):** http://localhost:8080/
- **Møteromsløsninger:** http://localhost:8080/moterom.html
- **Digital signage:** http://localhost:8080/signage.html

Samme sider er også publisert som gjennomgangskopi (samme innhold, ingen innlogging):

- **Oversikt:** https://kaffebryggeren.github.io/serve-mock/
- **Møteromsløsninger:** https://kaffebryggeren.github.io/serve-mock/moterom.html
- **Digital signage:** https://kaffebryggeren.github.io/serve-mock/signage.html

Stopp serveren med `Ctrl + C` i terminalen (eller stopp jobben i editoren).

**Alternativer:** `npx serve .` eller `php -S 127.0.0.1:8080` fungerer også.
Åpner du `index.html` direkte med `file://` vil fontene lastes, men enkelte nettlesere blokkerer
`@font-face` fra lokale filer – bruk derfor helst den lokale serveren.

### Mock-hjelpere (kun i mocken)

| Tast | Handling |
|------|----------|
| **M** | Viser/skjuler den gule «MOCK – ikke publisert»-stripen |
| **B** | Bytter A/B-variant: 3 hero-overskrifter + 2 CTA-tekster. Status vises i stripen (`Hero 1/3 · CTA A`) |

Tastetrykk ignoreres når markøren står i et skjemafelt, og ved modifier-taster (Ctrl/Alt/Meta).
Begge sidene har egne hero- og CTA-varianter (leses fra `data-*`-attributter på `<body>`/`<h1>`),
slik at samme `main.js` driver begge sider.

Stripa viser fortsatt «MOCK – ikke publisert» også på den publiserte gjennomgangskopien. Det er et
bevisst valg: den markerer at sidene er et forslag med plassholdere, ikke Serve sine produksjonssider.
Den skjules med tast **M** hvis man vil se sidene uten den.

---

## 2. Designkopiering – hva som ble hentet fra serve.no

Hentet 2026-10-26 med headless Chrome (Playwright, kun GET) og gemt i `assets/`.

### Kilder
| Innhold | Kilde |
|---------|-------|
| Farger, `:root`-variabler | `nyg-enfold-child/css/base.css` |
| Temafarger (alternate_color, oliven) | `wp-content/uploads/dynamic_avia/nyg.css` |
| Mørke seksjons-/input-farger | `wp-content/uploads/avia_posts_css/post-385.css` |
| Knappestil | `nyg-base.css` → `#top #wrap_all .single-common-btn a` |
| Fonter | `typekit.css` (Adobe Typekit kit `ism3gmz`) + Google Fonts `Public Sans` |
| Logo (SVG) | `serve-logo.svg` (194×62, `#00B44B` + hvitt) |
| Signage-bilder | `signage-hero.png`, `signage-miljo.jpg`, `signage-led.jpg` (fra digital-signage-siden) |

### Designtokens (alle ligger i [`assets/css/tokens.css`](assets/css/tokens.css))

**Farger**
| Token | Verdi | Kommentar |
|-------|-------|-----------|
| `--color-brand` | `#00b44b` | Serve-grønn (logo + knappekant) |
| `--color-dark-900` | `#192f28` | Footer / mørke kolonner |
| `--color-dark-800` | `#1c3c32` | Hovedseksjoner (mørk bakgrunn) |
| `--color-dark-700` | `#0d3d31` | Input-bakgrunn (`.newsletter-wrapp`) |
| `--color-olive` / `-light` / `-dark` | `#719430` / `#8bba34` / `#507210` | Sekundærfarge (alternate_color) |
| `--color-text` | `#444444` | Brødtekst på lys bakgrunn |
| `--color-text-muted` | `#969696` | Meta / undermeny |
| `--color-border` | `#ebebeb` | Enfold basis border |
| `--color-danger` | `#ff7f56` | Valideringsfeil |
| `--color-surface` / `-alt` | `#ffffff` / `#f8f8f8` | Tema-bakgrunn |

**Typografi**
| Token | Verdi |
|-------|-------|
| `--font-display` | `"dico-sans", "Public Sans", sans-serif` |
| `--font-body` | `"Public Sans", sans-serif` |
| `--fs-h1` / `--lh-h1` | `60px / 75px` (mobil `40 / 45`) |
| `--fs-h2` / `--lh-h2` | `50px / 60px` (mobil `35 / 40`) |
| `--fs-h3` / `--lh-h3` | `40px / 45px` (mobil `30 / 35`) |
| `--fs-h4` / `--lh-h4` | `25px / 30px` |
| `--fs-h6` / `--lh-h6` | `20px / 25px` (kicker/overline) |
| `--fs-body` / `--lh-body` | `17px / 28.05px` (1.65) |

**Layout, spacing og rammer**
| Token | Verdi |
|-------|-------|
| `--container-max` / `--container-pad` | `1460px` / `50px` (mobil `24px`) |
| `--spacing` | `20px` |
| `--section-pad-y` / `-lg` | `70px` / `100px` |
| `--radius-pill` | `100px` (knapper) |
| `--shadow-header` | `0 0 2px 1px rgba(0,0,0,.10)` |
| Knapp | `padding 8px 28px`, `border 2px`, pill-radius, transparent bg → `#00b44b` på hover |
| Breakpoints | `576 / 768 / 992 / 1200 / 1640` |

### Sammenligningsskjermbilder
Ligger i `compare/` (møterom) og `compare/signage/` (signage):

| Fil | Innhold |
|-----|---------|
| `compare/original-desktop-1440.png` m.fl. | Møteromsoriginalen, serve.no |
| `compare/mock-desktop-1440.png` m.fl. | Møteromsmocken |
| `compare/signage/original-desktop-1440.png` m.fl. | Digital-signage-originalen, serve.no |
| `compare/signage/mock-desktop-1440.png` m.fl. | Signage-mocken |

Alle finnes i desktop 1440 px og mobil 390 px, både «above the fold» og full side.

Mobilskjermbildet av originalene er kun «above the fold» (originalsidene bruker lazy-loading og
uendelig scroll, så full-page capture gir et misvisende resultat).

---

## 3. Hva som IKKE er kopiert nøyaktig

Disse avvikene er bevisste eller skyldes tilgjengelige filer. De er også merket i koden.

### Typografi
- **`dico-sans` finnes kun i vekt 700 lokalt.** Adobe Typekit-kitet (`ism3gmz`) leverer bare
  `n7` og `i7`. Originalen ber om **800** på `h2` og **600** på kicker/overline – nettleseren
  syntetiserer da en tyngre/lettere vekt. Mocken får 700. Dette er det mest synlige avviket, og
  gjelder begge sider.
- `Public Sans` er brukt som variabel font (vekt 100–900) – lik originalens Google Fonts-import.

### Knapper
- Originalens `.single-common-btn a` er en **outline-knapp** (transparent bakgrunn, `#00B44B`
  kant) som fylles på hover. Mocken bruker samme stil på `.btn`, men har i tillegg en fylt
  variant `.btn--solid` for maksimal kontrast på mørk bakgrunn. Sistnevnte finnes **ikke** som
  egen klasse på originalsiden (`[DESIGN-ANTAGELSE]`).
- Alle primære CTA-er har samme tekst og farge gjennom hele siden (`[DESIGN-ANTAGELSE]` – krav i
  mocken).

### Skjemafelt
| Egenskap | Original | Mock |
|----------|----------|------|
| Bakgrunn | `#192f28` | `#0d3d31` |
| Border | transparent | `1px solid #2c4a41` (`[DESIGN-ANTAGELSE]`) |
| Border-radius | `0` | `3px` |

### Nye elementer som ikke finnes i originaldesignet
- **MOCK-stripe** (`body.is-mockbar-on` gir 32 px `padding-top`)
- **Sticky mobil-CTA** nederst på mobil (gir 76 px `padding-bottom`)
- **A/B-hjelper** (tast B) og **forhåndsvalg i skjema** fra klikkbare kort (`data-preset-*`)
- Kort-komponenter, pakke-tabell, klikkbare plasseringskort, sammenligningstabell og FAQ-trekkspill
  er nye mønstre bygget på Serves tokens (`--radius-card`, `--shadow-card` er markert
  `[DESIGN-ANTAGELSE]`).

### Øvrige designantagelser (`[DESIGN-ANTAGELSE]` i koden)
- Lenkefarge = brand-fargen `#00b44b`
- Fokusring = brand-fargen `#00b44b`
- Hover-variant av brand: `#00a344`
- Semi-transparent hvit tekst (`rgba(255,255,255,.82–.9)`) på mørk bakgrunn for lesbarhet
- Kortradius `8px` og kortskygger

---

## 4. Alle plassholdere

Alt som ikke er verifisert fakta fra serve.no er merket `[PLASSHOLDER: ...]` og skal erstattes
med reelle tall/tekst før eventuell publisering.

### Møteromssiden (`moterom.html`)
| Plassholder | Hvor |
|-------------|------|
| `[PLASSHOLDER: fra-pris huddle room]` | Pakke 1 |
| `[PLASSHOLDER: fra-pris medium]` | Pakke 2 |
| `[PLASSHOLDER: fra-pris stort rom]` | Pakke 3 |
| `[PLASSHOLDER: antall deltakere]` | Pakke 2 og 3 |
| `[PLASSHOLDER: fra-pris]` | FAQ – «Hva koster et møterom?» |
| `[PLASSHOLDER: leveringstid]` | FAQ – leveringstid |
| `[PLASSHOLDER: månedlig betaling/leasing]` | FAQ – betaling/leasing |
| `[PLASSHOLDER-løfte] Svar innen 1 arbeidsdag` | Under skjemaet |
| `[PLASSHOLDER: org.nr]` | Footer |

### Digital signage (`signage.html`)
| Plassholder | Hvor |
|-------------|------|
| `[PLASSHOLDER: fra-pris start]` | Pakke «Start» |
| `[PLASSHOLDER: fra-pris kontor]` | Pakke «Kontor» |
| `[PLASSHOLDER – bekreft]` | «Dette er inkludert» under pakkene |
| `[PLASSHOLDER: typisk behov]` | Sammenligningstabellen (PLAYipp / DataBeat), 2 celler |
| `[PLASSHOLDER: kundecase signage]` | Bevis-seksjonen |
| `[PLASSHOLDER: kunde, bransje og resultat]` | Bevis-seksjonen |
| `[PLASSHOLDER: antall installerte skjermer]` | Bevis-seksjonen (tall) |
| `[PLASSHOLDER: antall lokasjoner eller år som leverandør]` | Bevis-seksjonen (tall) |
| `[PLASSHOLDER: fra-pris]` | FAQ – «Hva koster digital signage?» |
| `[PLASSHOLDER: kan eksisterende skjermer gjenbrukes]` | FAQ – «Kan vi bruke skjermer vi har fra før?» |
| `[PLASSHOLDER-løfte] Svar innen 1 arbeidsdag` | Under skjemaet |
| `[PLASSHOLDER: org.nr]` | Footer |

**Verifiserte fakta (brukt ordrett, begge sider):** Serve AS, Teglverksveien 59, 3057 Solbergelva,
+47 32 21 19 10, post@serve.no, support hverdager 08.00–16.00, Canon Business Center,
kundesitatet fra Modum Kabel-TV (Sindre Andersen), samt referansene Modum Bad (13.08.2026)
og Lysaker & Thorrud (20.05.2026).

**Signage-spesifikke fakta (ordrett):** infoskjermer/reklameskjermer/digital skilting for butikker,
handlesentre, skoler, hotell, kontor og produksjonslokaler; hjelp med skjerm, størrelse, plassering,
programvare, installasjon og support; kvalitetsskjermer med profesjonell bildekvalitet;
**PLAYipp** (styr innhold fra hvor som helst, tilpass budskap etter klokkeslett eller ukedag);
**DataBeat Signage** (skybasert, publiser bilder og video fra hvor som helst);
**LED-skjermer** (modulbaserte, valgfri størrelse og format, rammeløse, kan kurves eller stå fritt,
høy lysstyrke, innendørs og utendørs); slagordet «Enkelt, greit og driftssikkert!»;
Databeat Doorsign (digitalt dørskilt med kalenderintegrasjon som hindrer dobbeltbooking).

---

## 5. Filstruktur

```
serve-mock/
├─ index.html                 # NYTT: oversikt med to store kort + «Til oversikt»
├─ moterom.html               # møteromsmocken (m/ «Se også: digital signage»)
├─ signage.html               # NYTT: digital signage-mocken (12 seksjoner)
├─ README.md
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css           # designtokens (seksjon 2)
│  │  ├─ fonts.css            # lokale @font-face
│  │  └─ style.css            # layout + komponenter (BEM-lignende), del 1 + 2
│  ├─ js/
│  │  └─ main.js              # FAQ, skjemavalidering, forhåndsvalg, M/B-hjelpere (generisk)
│  ├─ fonts/                  # dico-sans (700/700i) + Public Sans (latin/latin-italic)
│  └─ img/                    # logo, favicon, hero, referansebilder, signage-bilder, ikoner
├─ compare/                   # sammenligningsskjermbilder (møterom)
└─ compare/signage/           # sammenligningsskjermbilder (signage)
```

**Krysslenker:**
- `index.html` → `moterom.html` og `signage.html` (to store kort)
- `moterom.html` → `signage.html` i booking-/Doorsign-seksjonen («Se også: digital signage»)
- `signage.html` → `moterom.html` i møterom-synergi-seksjonen
- Begge sider har «Til oversikt» → `index.html` (hero + footer)

**Skjemalogikk (begge sider):** navn/e-post/telefon er obligatoriske (klientvalidering), øvrige
felt er valgfrie, samtykke er påkrevd. Ved innsending kalles `preventDefault()`, data logges med
`console.log('[serve-mock] Skjemadata (sendes IKKE):', …)` og en takkemelding vises i
`#form-success`. **Ingen `fetch`, ingen POST, ingen nettverkskall.**

**Signage-skjemaets felt:** navn, e-post, telefon (obligatoriske) · antall skjermer (1–3, 4–10,
10+, Vet ikke) · plassering (Resepsjon, Kantine, Møterom, Butikk/gulv, Produksjon, LED-vegg) ·
«Har dere skjermer fra før?» (Ja/Nei/Vet ikke) · fri tekst · samtykke.
Klikkbare plasseringskort og LED-CTA-en forhåndsvelger `plassering` via `data-preset-*`.

---

## 6. Kjente feil/mangler

- Mobilskjermbilder av originalene er kun «above the fold» (se seksjon 2).
- `h2`/kicker-vektene avviker (se seksjon 3) – kan ikke fikses uten tilgang til flere vekter
  fra Typekit.
- Signage-originalen er teksttung og bruker andre seksjonstyper enn mocken. Mocken er en
  **omskrevet, kortere** versjon (maks 2 korte setninger per avsnitt), ikke en ordrett kopi.
