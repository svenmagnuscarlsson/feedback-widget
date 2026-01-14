# Product Requirements Document
## Feedback Widget System

| | |
|---|---|
| **Version** | 1.0 |
| **Datum** | 2025-01-14 |
| **Status** | Draft |
| **Författare** | [Ditt namn] |

---

## 1. Översikt

Feedback Widget är ett lättviktigt JavaScript-bibliotek som gör det möjligt för testare och användare att skicka visuell feedback direkt från valfri webbsida. Systemet fungerar som ett universellt verktyg som kan integreras på vilken webbapplikation som helst under testperioder.

Tänk på det som en *digital post-it-lapp med superkrafter* – användaren kan peka på exakt vad de menar, ta en bild av det, och skicka kommentarer direkt till utvecklaren utan att behöva förklara med ord var problemet finns.

---

## 2. Problemställning

Under testperioder av webbapplikationer uppstår ofta följande utmaningar:

- Testare har svårt att kommunicera exakt var ett problem finns
- Screenshots måste tas manuellt och skickas via separata kanaler
- Feedback saknar ofta kontext som URL, viewport-storlek och webbläsare
- Ingen standardiserad process för att samla in och kategorisera feedback

---

## 3. Mål

### Primära mål

1. Förenkla feedbackprocessen till max 3 klick
2. Automatiskt fånga visuell kontext genom område-val
3. Leverera strukturerad data i JSON-format till valfri webhook
4. Stödja både felrapporter och förbättringsförslag

---

## 4. Användarflöde

Användaren går igenom följande steg för att skicka feedback:

1. **Aktivera** – Klicka på den flytande feedback-knappen
2. **Markera** – Dra en rektangel över det relevanta området
3. **Kategorisera** – Välj mellan Felrapport eller Förslag
4. **Beskriv** – Skriv en kort beskrivning och välj prioritet
5. **Skicka** – Klicka på *Skicka Feedback*

---

## 5. Funktionella Krav

### 5.1 Flytande Knapp

| | |
|---|---|
| **ID** | FR-001 |
| **Beskrivning** | En cirkulär knapp som alltid är synlig i ett hörn av skärmen |
| **Position** | Konfigurerbar (standard: nedre högra hörnet) |
| **Beteende** | Vid klick aktiveras snapshot-läget |
| **Visuellt** | Ikon som indikerar feedback/kommentar-funktion |

### 5.2 Snapshot-läge

| | |
|---|---|
| **ID** | FR-002 |
| **Aktivering** | Vid klick på flytande knapp |
| **Visuell indikator** | Instruktionstext visas (t.ex. i en banner) |
| **Muspekare** | Ändras till crosshair/korshår |
| **Interaktion** | Användaren drar en rektangel med musen |
| **Avbryt** | ESC-tangenten avbryter snapshot-läget |

### 5.3 Områdesval

| | |
|---|---|
| **ID** | FR-003 |
| **Markering** | Rektangel med synlig ram (t.ex. grön) |
| **Fyllnad** | Semitransparent för att indikera valt område |
| **Trigga dialog** | När musknappen släpps öppnas feedback-dialogen |
| **Screenshot** | Det markerade området sparas som bild (canvas/html2canvas) |

### 5.4 Feedback-dialog

| | |
|---|---|
| **ID** | FR-004 |
| **Modal** | Centrerad overlay-dialog |
| **Preview** | Miniatyrbild av det markerade området |
| **Typ-val** | Felrapport / Förslag (toggle eller radio) |
| **Prioritet** | Dropdown med val: Låg, Normal, Hög, Kritisk |
| **Beskrivning** | Fritext-fält för användaren att förklara |
| **Knappar** | Avbryt och Skicka Feedback |

### 5.5 Dataöverföring

| | |
|---|---|
| **ID** | FR-005 |
| **Format** | JSON |
| **Destination** | Konfigurerbar webhook-URL |
| **Metod** | HTTP POST |
| **Feedback vid lyckad** | Bekräftelsemeddelande till användaren |
| **Feedback vid fel** | Felmeddelande med möjlighet att försöka igen |

---

## 6. Datastruktur (JSON Schema)

Följande JSON-struktur skickas till webhook:

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `id` | string | Unikt ID för feedbacken (UUID) |
| `timestamp` | string | ISO 8601 tidsstämpel |
| `type` | string | `"bug"` eller `"suggestion"` |
| `priority` | string | `"low"`, `"normal"`, `"high"`, `"critical"` |
| `description` | string | Användarens beskrivning |
| `screenshot` | string | Base64-kodad PNG-bild |
| `url` | string | Aktuell sidans URL |
| `viewport` | object | `{ width: number, height: number }` |
| `userAgent` | string | Webbläsarens user agent |
| `selection` | object | `{ x, y, width, height }` för markerat område |

### Exempeldata

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "timestamp": "2025-01-14T10:30:00.000Z",
  "type": "bug",
  "priority": "normal",
  "description": "Knappen fungerar inte vid hover",
  "screenshot": "data:image/png;base64,iVBORw0KGgo...",
  "url": "https://app.example.com/dashboard",
  "viewport": { "width": 1920, "height": 1080 },
  "userAgent": "Mozilla/5.0...",
  "selection": { "x": 100, "y": 200, "width": 400, "height": 300 }
}
```

---

## 7. Tekniska Krav

- **Ramverksoberoende:** Ska fungera med vanilla JS, React, Vue, etc.
- **Inga beroenden:** Minimalt fotavtryck, eventuellt html2canvas för screenshot
- **Webbläsarstöd:** Moderna webbläsare (Chrome, Firefox, Safari, Edge)
- **Storlek:** < 50KB minifierad
- **Integration:** Enkel script-tag eller npm-paket

---

## 8. Konfiguration

Widgeten ska kunna konfigureras med följande alternativ:

| Parameter | Standard | Beskrivning |
|-----------|----------|-------------|
| `webhookUrl` | (obligatorisk) | URL dit feedback skickas |
| `position` | `bottom-right` | Knappens position på skärmen |
| `theme` | `light` | Färgtema: `light` eller `dark` |
| `language` | `sv` | Språk för UI-texter |
| `zIndex` | `9999` | CSS z-index för widgeten |
| `showOnMobile` | `true` | Visa på mobila enheter |

### Användningsexempel

```html
<script src="https://svenmagnuscarlsson.github.io/feedback/feedback-widget.min.js"></script>
<script>
  FeedbackWidget.init({
    webhookUrl: 'https://hooks.example.com/feedback',
    position: 'bottom-right',
    theme: 'dark',
    language: 'sv'
  });
</script>
```

---

## 9. Distribution & Deployment

### 9.1 Utvecklingsstruktur

Under utveckling används en modulär filstruktur:

```
feedback-widget/
├── src/
│   ├── index.js          # Huvudlogik + export
│   ├── styles.css        # Widget-styling
│   ├── button.js         # Flytande knapp
│   ├── overlay.js        # Snapshot-läge
│   ├── modal.js          # Feedback-dialog
│   └── screenshot.js     # html2canvas-wrapper
├── dist/
│   └── feedback-widget.min.js
├── package.json
├── rollup.config.js
└── README.md
```

### 9.2 Byggprocess

| Steg | Verktyg | Beskrivning |
|------|---------|-------------|
| Bundling | Rollup / esbuild | Slår ihop alla JS-moduler |
| CSS-injektion | Inlines | CSS bäddas in i JS-filen |
| Minifiering | Terser | Komprimerar koden |
| Output | En fil | `feedback-widget.min.js` (~30-50KB) |

**Byggkommando:**
```bash
npm run build
```

### 9.3 Leverabel

En enda minifierad JavaScript-fil som:

- Innehåller all logik (knapp, overlay, modal, screenshot)
- Injicerar sin egen CSS vid initiering
- Exponerar `FeedbackWidget.init()` globalt
- Har inga externa beroenden (html2canvas bundlas in)

### 9.4 Hosting

**Rekommenderat: GitHub Pages**

1. Skapa repo: `github.com/svenmagnuscarlsson/feedback`
2. Aktivera GitHub Pages i Settings
3. Ladda upp `feedback-widget.min.js` till repot
4. Tillgänglig på: `https://svenmagnuscarlsson.github.io/feedback/feedback-widget.min.js`

**Alternativ:** Valfri statisk hosting (Netlify, Vercel, egen server)

### 9.5 Versionering

Vid uppdateringar, använd query-parameter för cache-busting:

```html
<script src="https://svenmagnuscarlsson.github.io/feedback/feedback-widget.min.js?v=1.0.1"></script>
```

Eller semantisk versionering i filnamn:

```html
<script src="https://svenmagnuscarlsson.github.io/feedback/feedback-widget-1.0.1.min.js"></script>
```

---

## 10. Utanför Scope

Följande funktioner ingår **inte** i denna version:

- Användarautentisering
- Feedback-dashboard eller adminpanel
- Videoinspelning
- Integration med issue trackers (Jira, GitHub Issues, etc.)
- Annotationsverktyg (rita pilar, text på screenshot)

---

## 11. Framgångskriterier

- Testare kan skicka feedback inom 30 sekunder
- 100% av feedback-meddelanden når webhook
- Widgeten påverkar inte sidans laddningstid märkbart (< 100ms)
- Fungerar på desktop och tablet

---

## Appendix: Webhook-mottagare

För att ta emot feedback behövs en endpoint. Enklaste alternativen:

| Tjänst | Beskrivning |
|--------|-------------|
| **n8n / Make** | Visuell webhook → spara till databas/Google Sheets |
| **Pipedream** | Gratis webhooks med enkel bearbetning |
| **Egen server** | Express.js/FastAPI endpoint |
| **Supabase** | Edge function + databas |
