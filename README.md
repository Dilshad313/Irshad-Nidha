# Irshad & Nidha — Wedding Invitation

A standalone, premium Islamic wedding invitation site. Pure HTML, CSS and
vanilla JavaScript — no build step, no backend. Open `index.html` directly
in a browser to view it.

## How to customize

Everything that changes per-wedding lives in one place: the `weddingData`
object at the top of [script.js](script.js).

```js
const weddingData = {
  groom: "Irshad",
  bride: "Nidha",
  groomFather: "...",
  groomMother: "...",
  brideFather: "...",
  brideMother: "...",
  date: "...",          // display text, e.g. "20th December 2026"
  day: "...",           // e.g. "Sunday"
  time: "...",          // e.g. "11:00 AM"
  venue: "...",
  address: "...",
  weddingDateISO: "",   // drives the live countdown, e.g. "2026-12-20T11:00:00"
  googleMapsUrl: "",    // drives the "Get Directions" buttons
  whatsappNumber: ""    // digits only with country code, e.g. "919876543210"
};
```

Until `weddingDateISO`, `googleMapsUrl` and `whatsappNumber` are filled in,
the site shows honest placeholders ("Date to be announced", disabled
direction buttons, a WhatsApp fallback message) instead of fake data.

## Location QR code

The "Scan for Location" card displays [assets/gallery/qr.png](assets/gallery/qr.png)
directly — it is not generated from `googleMapsUrl`, so replace that image
file with a new QR code if the venue changes.

## Background music (optional)

Add a file at `assets/music/music.mp3`. It attempts to autoplay on load;
where the browser blocks that (most mobile browsers, and some desktop ones,
until the visitor interacts), the toggle button in the navigation bar
offers manual play instead. The toggle stays hidden if the file is missing.

## Colors

All colors are CSS variables at the top of [style.css](style.css)
(`:root { --primary-green, --deep-green, --gold, --cream, --text-dark, ... }`).
Change them there to retheme the whole site.
