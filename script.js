/* =========================================================
   Irshad & Nidha — Wedding Invitation
   All editable wedding information lives in `weddingData` below.
   ========================================================= */

const weddingData = {
  groom: "Irshad",
  bride: "Nidha",

  groomFather: "Rasheed",
  groomMother: "Nadeera",
  brideFather: "[Bride Father's Name – To Be Added]",
  brideMother: "[Bride Mother's Name – To Be Added]",

  // Display text shown on the Reception Details card. Edit freely.
  date: "29th November 2026",
  day: "Sunday",
  time: "10:30", // AM/PM not specified — confirm and add it here, e.g. "10:30 AM"
  venue: "Moulana Auditorium",
  address: "Kozhikkode Road, Aryambavu, Kombam",

  // ISO datetime used ONLY to drive the live countdown. Includes the +05:30
  // (India Standard Time / Kerala) offset explicitly, so every guest sees a
  // countdown to the same real moment regardless of their own device's timezone.
  // AM/PM for "10:30" was not confirmed — this assumes 10:30 AM (matching the
  // original ceremony's 11:00 AM). Change to T22:30:00+05:30 if it's actually PM.
  weddingDateISO: "2026-11-29T10:30:00+05:30",

  // Full Google Maps link to the venue, e.g. "https://maps.google.com/?q=...".
  // Leave empty until confirmed — the QR code and Get Directions button will
  // show a graceful placeholder instead of pointing nowhere.
  googleMapsUrl: "",

  // WhatsApp number in international format, digits only (country code + number).
  whatsappNumber: "918138040466"
};

document.addEventListener('DOMContentLoaded', () => {
  populateContent();
  initNav();
  initReveal();
  initCountdown();
  initLocation();
  initQrCode();
  initRsvp();
  initMusic();
});

/* ---------- Fill the page from weddingData ---------- */
function populateContent() {
  const map = {
    groomName: weddingData.groom,
    brideName: weddingData.bride,
    heroGroomName: weddingData.groom,
    heroBrideName: weddingData.bride,
    groomFather: weddingData.groomFather,
    groomMother: weddingData.groomMother,
    brideFather: weddingData.brideFather,
    brideMother: weddingData.brideMother,
    nikahDate: weddingData.date,
    nikahDay: weddingData.day,
    nikahTime: weddingData.time,
    nikahVenue: weddingData.venue,
    nikahAddress: weddingData.address,
    venueName: weddingData.venue,
    venueAddress: weddingData.address
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });

  document.title = `${weddingData.groom} & ${weddingData.bride} | Wedding Invitation`;
}

/* ---------- Navigation ---------- */
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const closeMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    navLinks.classList.remove('open');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
}

/* ---------- Reveal-on-scroll ---------- */
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach((el) => observer.observe(el));
}

/* ---------- Countdown ---------- */
function initCountdown() {
  const grid = document.getElementById('countdownGrid');
  const message = document.getElementById('countdownMessage');
  const target = weddingData.weddingDateISO ? new Date(weddingData.weddingDateISO) : null;

  if (!target || Number.isNaN(target.getTime())) {
    grid.hidden = true;
    message.hidden = false;
    message.textContent = 'Date to be announced — Insha’Allah.';
    return;
  }

  const els = {
    days: document.getElementById('cdDays'),
    hours: document.getElementById('cdHours'),
    minutes: document.getElementById('cdMinutes'),
    seconds: document.getElementById('cdSeconds')
  };

  // Update a digit's text, and briefly pulse it, but only when the value actually changes.
  const setCell = (el, value) => {
    const formatted = String(value).padStart(2, '0');
    if (el.textContent === formatted) return;
    el.textContent = formatted;
    el.classList.remove('pulse');
    void el.offsetWidth; // restart the animation even if a pulse is already mid-flight
    el.classList.add('pulse');
  };

  // Declared before `tick` (and left null until the interval actually starts) so
  // that if the target date is already in the past on the very first call, this
  // read doesn't throw. It used to be a `const` assigned only after this first
  // call, which crashed on a past date and silently skipped every init function
  // queued after initCountdown() (RSVP, music, QR, location buttons, etc.).
  let timer = null;

  const tick = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) {
      if (timer) clearInterval(timer);
      grid.hidden = true;
      message.hidden = false;
      message.textContent = 'Alhamdulillah — The Day Has Arrived!';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const minutes = Math.floor((diff / 60000) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    setCell(els.days, days);
    setCell(els.hours, hours);
    setCell(els.minutes, minutes);
    setCell(els.seconds, seconds);
  };

  tick();
  if (!grid.hidden) {
    timer = setInterval(tick, 1000);
  }
}

/* ---------- Location buttons ---------- */
function initLocation() {
  const directionsBtn = document.getElementById('directionsBtn');
  const qrDirectionsBtn = document.getElementById('qrDirectionsBtn');
  const hasUrl = Boolean(weddingData.googleMapsUrl);

  [directionsBtn, qrDirectionsBtn].forEach((btn) => {
    if (!btn) return;
    if (!hasUrl) {
      btn.disabled = true;
      btn.textContent = 'Location to be announced';
      return;
    }
    btn.addEventListener('click', () => {
      window.open(weddingData.googleMapsUrl, '_blank', 'noopener');
    });
  });
}

/* ---------- QR code ---------- */
function initQrCode() {
  // Uses the real QR code supplied at assets/gallery/qr.png (already encodes the
  // venue's Google Maps link) rather than generating one from weddingData.
  const qrImage = document.getElementById('qrImage');
  const placeholder = document.getElementById('qrPlaceholderText');
  if (!qrImage) return;
  qrImage.addEventListener('error', () => {
    qrImage.hidden = true;
    placeholder.hidden = false;
  });
}

/* ---------- RSVP ---------- */
function initRsvp() {
  const yesBtn = document.getElementById('rsvpYes');
  const noBtn = document.getElementById('rsvpNo');
  const response = document.getElementById('rsvpResponse');
  if (!yesBtn || !noBtn || !response) return;

  const show = (text) => {
    response.hidden = false;
    response.textContent = text;
  };

  // Opens a WhatsApp chat with `weddingData.whatsappNumber`, pre-filled with the
  // given message. Falls back to an inline note if no number is configured.
  const openWhatsApp = (message, fallbackText) => {
    if (weddingData.whatsappNumber) {
      const url = `https://wa.me/${weddingData.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener');
      show('Redirecting you to WhatsApp — please send the pre-filled message to confirm.');
    } else {
      show(fallbackText);
    }
  };

  yesBtn.addEventListener('click', () => {
    openWhatsApp(
      `Hello, I'm happy to confirm that I'll attend the wedding of ${weddingData.groom} and ${weddingData.bride}.`,
      'Shukran! Please let the family know directly — RSVP via WhatsApp is coming soon.'
    );
  });

  noBtn.addEventListener('click', () => {
    openWhatsApp(
      `Hello, I'm sorry that I won't be able to attend the wedding of ${weddingData.groom} and ${weddingData.bride}.`,
      'Thank you for letting us know. We will miss you — please keep us in your duas.'
    );
  });
}

/* ---------- Background music ---------- */
function initMusic() {
  const toggle = document.getElementById('musicToggle');
  const hint = document.getElementById('musicHint');
  if (!toggle) return;
  if (typeof Howl === 'undefined') {
    // Howler failed to load (e.g. offline, CDN blocked) — fail quietly, same as
    // a missing audio file.
    toggle.hidden = true;
    return;
  }

  let fileOk = true;

  const hideHint = () => { if (hint) hint.hidden = true; };

  // Single source of truth for the icon: `sound.playing()` is Howler's own
  // ground truth, read fresh every time rather than tracked in a local variable,
  // so the icon can't drift out of sync with reality.
  const syncToggle = () => {
    if (!fileOk) return;
    toggle.hidden = false;
    const playing = sound.playing();
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    if (playing) hideHint(); // music actually started — the hint has done its job
  };

  const sound = new Howl({
    src: ['assets/music/music.mp3'],
    loop: true,
    preload: true,
    // Howler's default Web Audio API mode loads files via XMLHttpRequest, which
    // Chromium's CORS policy blocks entirely for the file:// protocol — exactly
    // how this site is opened (double-clicking index.html). html5:true makes
    // Howler use a plain <audio> element internally instead, which loads file://
    // URLs the normal way media elements always have. Confirmed by testing both.
    html5: true,
    onplay: syncToggle,
    onpause: syncToggle,
    onstop: syncToggle,
    // assets/music/music.mp3 missing or unplayable: hide the toggle (and hint)
    // entirely.
    onloaderror: () => { fileOk = false; toggle.hidden = true; hideHint(); },
    // Confirmed blocked by the browser's autoplay policy (not assumed — this
    // only fires when the browser actually rejects play()).
    //
    // Howler.autoUnlock (its own built-in retry-on-interaction mechanism) is
    // tied to resuming the shared Web Audio API AudioContext, and does not
    // apply to sounds loaded in html5:true mode — the mode this file requires
    // to load at all under file://. Verified directly: with autoUnlock alone,
    // clicking the toggle button played the track, but clicking or tapping
    // anywhere else on the page did not. So the document-level retry below is
    // written explicitly, calling the same public sound.play() from inside a
    // genuine interaction handler — not a bypass, the same sanctioned pattern,
    // just not left to a library mechanism that doesn't cover this mode.
    onplayerror: () => {
      syncToggle();
      if (hint && fileOk) {
        hint.hidden = false;
        // Restart the CSS fade-in/out animation each time this fires.
        hint.style.animation = 'none';
        void hint.offsetWidth;
        hint.style.animation = '';
      }
    },
  });

  // Attempt real (audible) playback immediately on load. Never assumed to have
  // succeeded — `sound.playing()` and the callbacks above are the only sources
  // of truth for whether it's actually audible.
  sound.play();

  // Retry at the first permitted interaction anywhere on the page. Listens for
  // 'click', 'touchend' and 'keydown' — the events browsers actually treat as
  // genuine activation for media playback — not 'pointerdown'/'touchstart'
  // (gesture *start*), which iOS Safari in particular doesn't honor for audio.
  // Stays attached (not {once:true}) until playback is actually confirmed, so a
  // failed attempt is retried on the next interaction rather than giving up.
  const INTERACTION_EVENTS = ['click', 'touchend', 'keydown'];
  const onInteraction = (event) => {
    if (sound.playing() || !fileOk) return;
    // The toggle has its own click handler below, so it isn't double-handled.
    if (event.target && event.target.closest && event.target.closest('#musicToggle')) return;
    sound.play();
  };
  INTERACTION_EVENTS.forEach((type) => document.addEventListener(type, onInteraction, { passive: true }));

  toggle.addEventListener('click', () => {
    if (!fileOk) return;
    if (sound.playing()) {
      sound.pause();
    } else {
      sound.play();
    }
    hideHint();
  });

  syncToggle(); // initial paint
}
