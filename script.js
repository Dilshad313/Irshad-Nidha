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

  // WhatsApp number in international format, digits only, e.g. "919876543210".
  whatsappNumber: ""
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

  yesBtn.addEventListener('click', () => {
    if (weddingData.whatsappNumber) {
      const message = `Assalamu Alaikum, I would like to confirm my attendance for the Nikah of ${weddingData.groom} & ${weddingData.bride}.`;
      const url = `https://wa.me/${weddingData.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener');
      show('JazakAllah Khair! Please send the pre-filled WhatsApp message to confirm.');
    } else {
      show('Shukran! Please let the family know directly — RSVP via WhatsApp is coming soon.');
    }
  });

  noBtn.addEventListener('click', () => {
    show('Thank you for letting us know. We will miss you — please keep us in your duas.');
  });
}

/* ---------- Background music ---------- */
function initMusic() {
  const audio = document.getElementById('bgMusic');
  const toggle = document.getElementById('musicToggle');
  if (!audio || !toggle) return;

  let fileOk = true;
  let unmuted = false;

  const showOn = () => {
    toggle.hidden = false;
    toggle.setAttribute('aria-pressed', 'true');
    toggle.setAttribute('aria-label', 'Pause background music');
  };
  const showOff = () => {
    if (!fileOk) return;
    toggle.hidden = false;
    toggle.setAttribute('aria-pressed', 'false');
    toggle.setAttribute('aria-label', 'Play background music');
  };

  // assets/music/music.mp3 missing or unplayable: hide the toggle entirely, as before.
  audio.addEventListener('error', () => { fileOk = false; toggle.hidden = true; }, { once: true });

  // Strongest supported autoplay: every major browser (desktop and mobile) allows
  // MUTED autoplay without a user gesture, even though audible autoplay is blocked
  // everywhere. So the track actually starts playing — silently — the instant the
  // page can play it, satisfying "starts automatically" as literally as a browser
  // allows. The very first tap/click/key anywhere just unmutes the already-running
  // audio (no restart, no buffering gap), so sound begins the moment it's permitted.
  audio.muted = true;
  audio.load();

  const unmute = () => {
    if (unmuted || !fileOk) return;
    unmuted = true;
    audio.muted = false;
    if (audio.paused) {
      // Muted autoplay itself was blocked too (rare) — this is a real user gesture,
      // so starting fresh here should succeed.
      audio.play().then(showOn).catch(() => showOff());
    } else {
      showOn();
    }
  };

  audio.play().catch(() => {}); // muted autoplay; failure here is handled by `unmute()` later
  showOff();

  const unmuteOnGesture = (event) => {
    document.removeEventListener('pointerdown', unmuteOnGesture);
    document.removeEventListener('touchstart', unmuteOnGesture);
    document.removeEventListener('keydown', unmuteOnGesture);
    if (!fileOk) return;
    // A tap on the toggle itself is handled by its own click listener below, so it
    // isn't double-handled here.
    if (event.target && event.target.closest && event.target.closest('#musicToggle')) return;
    unmute();
  };
  document.addEventListener('pointerdown', unmuteOnGesture, { once: true });
  document.addEventListener('touchstart', unmuteOnGesture, { once: true, passive: true });
  document.addEventListener('keydown', unmuteOnGesture, { once: true });

  toggle.addEventListener('click', () => {
    if (!fileOk) return;
    if (!unmuted) { unmute(); return; }
    if (audio.paused) {
      audio.play().then(showOn).catch(() => {});
    } else {
      audio.pause();
      showOff();
    }
  });
}
