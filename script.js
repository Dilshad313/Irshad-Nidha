/* =========================================================
   Irshad & Nidha — Wedding Invitation (PREMIUM EDITION)
   All editable wedding information lives in `weddingData` below.
   QR code & background music behaviour are unchanged.
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

  // ISO datetime used ONLY to drive the live countdown (+05:30 IST).
  weddingDateISO: "2026-11-29T10:30:00+05:30",

  // Full Google Maps link to the venue. Leave empty until confirmed.
  googleMapsUrl: "",

  // WhatsApp number in international format, digits only.
  whatsappNumber: "918138040466"
};

document.addEventListener('DOMContentLoaded', () => {
  populateContent();
  initGate();
  initNav();
  initReveal();
  initCountdown();
  initLocation();
  initQrCode();
  initRsvp();
  initMusic();
  initSparkles();
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

  // Intro gate content
  const gateNames = document.getElementById('gateNames');
  if (gateNames) gateNames.innerHTML =
    `${weddingData.groom} <span class="gate-amp">&amp;</span> ${weddingData.bride}`;
  const gateDate = document.getElementById('gateDate');
  if (gateDate) gateDate.textContent = `${weddingData.day} · ${weddingData.date}`;

  document.title = `${weddingData.groom} & ${weddingData.bride} | Wedding Invitation`;
}

/* ---------- Intro gate (opening experience) ---------- */
function initGate() {
  const gate = document.getElementById('introGate');
  const btn = document.getElementById('gateOpenBtn');
  if (!gate) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const open = () => {
    document.body.classList.remove('gate-active');
    document.body.classList.add('gate-open');
    gate.classList.add('opened');
    // The first genuine interaction also unlocks background music via the
    // document-level listener in initMusic() — nothing extra needed here.
    setTimeout(() => gate.remove(), 1700);
  };

  if (reduceMotion) {
    // No ceremony for reduced-motion users — land straight on the page.
    gate.remove();
    document.body.classList.add('gate-open');
    return;
  }

  document.body.classList.add('gate-active');
  if (btn) btn.addEventListener('click', open, { once: true });
}

/* ---------- Gold sparkles ---------- */
function initSparkles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.sparkles').forEach((wrap) => {
    const count = Number(wrap.dataset.count) || 18;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      const size = 2 + Math.random() * 3;
      s.style.width = s.style.height = size.toFixed(1) + 'px';
      s.style.left = (Math.random() * 100).toFixed(2) + '%';
      s.style.top = (20 + Math.random() * 80).toFixed(2) + '%';
      s.style.animationDelay = (Math.random() * 8).toFixed(2) + 's';
      s.style.animationDuration = (5 + Math.random() * 6).toFixed(2) + 's';
      wrap.appendChild(s);
    }
  });
}

/* ---------- Navigation ---------- */
function initNav() {
  const nav = document.getElementById('siteNav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Transparent over the hero, solid after scrolling.
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

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

  const setCell = (el, value) => {
    const formatted = String(value).padStart(2, '0');
    if (el.textContent === formatted) return;
    el.textContent = formatted;
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
  };

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

/* ---------- QR code (unchanged: uses assets/gallery/qr.png) ---------- */
function initQrCode() {
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

/* ---------- Background music (unchanged: assets/music/music.mp3) ---------- */
function initMusic() {
  const toggle = document.getElementById('musicToggle');
  const hint = document.getElementById('musicHint');
  if (!toggle) return;
  if (typeof Howl === 'undefined') {
    toggle.hidden = true;
    return;
  }

  let fileOk = true;

  const hideHint = () => { if (hint) hint.hidden = true; };

  const syncToggle = () => {
    if (!fileOk) return;
    toggle.hidden = false;
    const playing = sound.playing();
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    if (playing) hideHint();
  };

  const sound = new Howl({
    src: ['assets/music/music.mp3'],
    loop: true,
    preload: true,
    // html5:true is required so the file loads when the page is opened
    // directly from disk (file://) — XHR-based Web Audio loading is
    // blocked there by Chromium's CORS policy.
    html5: true,
    onplay: syncToggle,
    onpause: syncToggle,
    onstop: syncToggle,
    onloaderror: () => { fileOk = false; toggle.hidden = true; hideHint(); },
    onplayerror: () => {
      syncToggle();
      if (hint && fileOk) {
        hint.hidden = false;
        hint.style.animation = 'none';
        void hint.offsetWidth;
        hint.style.animation = '';
      }
    },
  });

  // Attempt real (audible) playback on load; the browser may reject it.
  sound.play();

  // Retry at the first genuine interaction anywhere on the page — this
  // includes the "Open Invitation" button on the intro gate, so music
  // starts exactly when the invitation is opened.
  const INTERACTION_EVENTS = ['click', 'touchend', 'keydown'];
  const onInteraction = (event) => {
    if (sound.playing() || !fileOk) return;
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

  syncToggle();
}