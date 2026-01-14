# Feedback Widget

Ett lättviktigt JavaScript-bibliotek för visuell feedback direkt från webbsidor.

## Installation

### Via script-tag (rekommenderat)

```html
<script src="https://svenmagnuscarlsson.github.io/feedback/feedback-widget.min.js"></script>
<script>
  FeedbackWidget.init({
    webhookUrl: 'https://din-webhook-url.com/endpoint'
  });
</script>
```

### Via npm

```bash
npm install feedback-widget
```

```javascript
import FeedbackWidget from 'feedback-widget';

FeedbackWidget.init({
  webhookUrl: 'https://din-webhook-url.com/endpoint'
});
```

## Konfiguration

| Parameter | Standard | Beskrivning |
|-----------|----------|-------------|
| `webhookUrl` | (obligatorisk) | URL dit feedback skickas |
| `position` | `'bottom-right'` | Knappens position: `bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `theme` | `'light'` | Färgtema: `light` eller `dark` |
| `language` | `'sv'` | Språk för UI-texter |
| `zIndex` | `9999` | CSS z-index för widgeten |
| `showOnMobile` | `true` | Visa på mobila enheter |

## Användning

1. **Klicka** på feedback-knappen (nedre högra hörnet)
2. **Dra** för att markera ett område
3. **Välj** typ (Felrapport/Förslag) och prioritet
4. **Beskriv** problemet och klicka "Skicka Feedback"

## Webhook Payload

```json
{
  "id": "uuid-v4",
  "timestamp": "2025-01-14T10:30:00.000Z",
  "type": "bug | suggestion",
  "priority": "low | normal | high | critical",
  "description": "Användarens text",
  "screenshot": "data:image/png;base64,...",
  "url": "https://current-page.com",
  "viewport": { "width": 1920, "height": 1080 },
  "userAgent": "Mozilla/5.0...",
  "selection": { "x": 100, "y": 200, "width": 400, "height": 300 }
}
```

## Utveckling

```bash
# Installera dependencies
npm install

# Bygg minifierad version
npm run build

# Bygg med watch
npm run dev
```

## Licens

MIT