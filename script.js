/* =========================================================
   Irshad & Nidha — Wedding Invitation (PREMIUM EDITION)
   All editable wedding information lives in `weddingData` below.
   QR code & background music behaviour are unchanged.
   ========================================================= */

const weddingData = {
  groom: "Mohammed Irshad",
  bride: "Nidha Fathima",

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
  googleMapsUrl: ""
};

document.addEventListener('DOMContentLoaded', () => {
  populateContent();
  initGate();
  initNav();
  initReveal();
  initCountdown();
  initLocation();
  initQrCode();
  initMusic();
  initSparkles();
  initCelebration();
  initPopEffects();
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

  // Longer full names need a smaller type size so they never outgrow their
  // card/line — .name--long / .name--xlong are applied here based on length,
  // everywhere a name appears (hero, family cards, gate, section titles).
  const groomSizeClass = sizeClassForName(weddingData.groom);
  const brideSizeClass = sizeClassForName(weddingData.bride);
  const pairSizeClass = strongerSizeClass(groomSizeClass, brideSizeClass);

  // Hero names sit directly stacked with a divider between them, so both
  // use the same (larger-reduction) size for visual symmetry. Family cards
  // are separate, independent cards, so each sizes to its own name.
  applySizeClass(document.getElementById('heroGroomName'), pairSizeClass);
  applySizeClass(document.getElementById('heroBrideName'), pairSizeClass);
  applySizeClass(document.getElementById('groomName'), groomSizeClass);
  applySizeClass(document.getElementById('brideName'), brideSizeClass);

  // Intro gate: groom / "&" / bride on three stacked rows.
  const gateNameGroom = document.getElementById('gateNameGroom');
  if (gateNameGroom) {
    gateNameGroom.textContent = weddingData.groom;
    applySizeClass(gateNameGroom, pairSizeClass);
  }
  const gateNameBride = document.getElementById('gateNameBride');
  if (gateNameBride) {
    gateNameBride.textContent = weddingData.bride;
    applySizeClass(gateNameBride, pairSizeClass);
  }
  const gateDate = document.getElementById('gateDate');
  if (gateDate) gateDate.textContent = `${weddingData.day} · ${weddingData.date}`;

  // Couple / Final section titles: "Groom" over "& Bride" on two lines.
  ['coupleGroomLine', 'finalGroomLine'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = weddingData.groom;
    applySizeClass(el, pairSizeClass);
  });
  ['coupleBrideLine', 'finalBrideLine'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = `& ${weddingData.bride}`;
    applySizeClass(el, pairSizeClass);
  });

  const finalFamilies = document.getElementById('finalFamilies');
  if (finalFamilies) finalFamilies.textContent = `The Families of ${weddingData.groom} & ${weddingData.bride}`;

  document.title = `${weddingData.groom} & ${weddingData.bride} | Wedding Invitation`;
}

/* ---------- Name-length-based type sizing (see CSS .name--long/.name--xlong) ---------- */
function sizeClassForName(name) {
  if (name.length >= 15) return 'name--xlong';
  if (name.length >= 9) return 'name--long';
  return '';
}
function strongerSizeClass(a, b) {
  const order = ['', 'name--long', 'name--xlong'];
  return order[Math.max(order.indexOf(a), order.indexOf(b))];
}
function applySizeClass(el, sizeClass) {
  if (!el) return;
  el.classList.remove('name--long', 'name--xlong');
  if (sizeClass) el.classList.add(sizeClass);
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
    document.dispatchEvent(new CustomEvent('invitation:open'));
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
      document.dispatchEvent(new CustomEvent('countdown:done'));
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

/* ---------- Background music (assets/music/music.mp3, ~5MB) ----------
   The file is only ever fetched after a genuine user interaction — never
   eagerly on page load — so it can't compete with the page's own assets
   for bandwidth on mobile, and visitors who never interact never pay for
   it at all. Howler itself isn't created until that first interaction. */
function initMusic() {
  const toggle = document.getElementById('musicToggle');
  const hint = document.getElementById('musicHint');
  if (!toggle) return;
  if (typeof Howl === 'undefined') {
    toggle.hidden = true;
    return;
  }

  let sound = null;
  let fileOk = true;
  let started = false;

  const hideHint = () => { if (hint) hint.hidden = true; };

  const syncToggle = () => {
    if (!fileOk) return;
    toggle.hidden = false;
    const playing = sound ? sound.playing() : false;
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    if (playing) hideHint();
  };

  const getSound = () => {
    if (sound) return sound;
    sound = new Howl({
      src: ['assets/music/music.mp3'],
      loop: true,
      // Loading begins only when .play() is first called (see start()
      // below), not as soon as this Howl exists.
      preload: false,
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
    return sound;
  };

  // Starts (and, the first time, loads) playback. Called from the first
  // genuine interaction anywhere on the page — including the "Open
  // Invitation" button on the intro gate — so music starts exactly when
  // the invitation is opened, same as before.
  const start = () => {
    if (started || !fileOk) return;
    started = true;
    getSound().play();
  };

  const INTERACTION_EVENTS = ['click', 'touchend', 'keydown'];
  const onInteraction = (event) => {
    if (event.target && event.target.closest && event.target.closest('#musicToggle')) return;
    start();
  };
  INTERACTION_EVENTS.forEach((type) => document.addEventListener(type, onInteraction, { passive: true }));

  toggle.addEventListener('click', () => {
    if (!fileOk) return;
    if (!sound) {
      start();
      return;
    }
    if (sound.playing()) {
      sound.pause();
    } else {
      sound.play();
    }
    hideHint();
  });

  syncToggle();
}

/* ---------- Celebration: fireworks + confetti on a single canvas ----------
   Fires on the 'invitation:open' event (dispatched by initGate when the
   gate opens) and again on 'countdown:done' (dispatched by initCountdown
   when the big day arrives). Fully skipped for prefers-reduced-motion. */
function initCelebration() {
  const canvas = document.getElementById('fxCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.remove();
    return;
  }

  const ctx = canvas.getContext('2d');
  const COLORS = ['#FF6F91', '#FFD36E', '#7FE7C4', '#7EC8E3', '#FFF3E2', '#D9A86C'];

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  let sparks = [];
  let confetti = [];
  let rafId = null;

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function spawnFirework(x, y) {
    const count = 44 + Math.floor(Math.random() * 20);
    const baseColor = pick(COLORS);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + rand(-0.12, 0.12);
      const speed = rand(2.2, 5.4);
      sparks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: rand(50, 80),
        color: Math.random() < 0.3 ? pick(COLORS) : baseColor,
        size: rand(1.6, 3.2)
      });
    }
  }

  function spawnConfetti(total) {
    for (let i = 0; i < total; i++) {
      confetti.push({
        x: rand(0, width),
        y: rand(-120, -10),
        vx: rand(-1.1, 1.1),
        vy: rand(1.6, 3.6),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.14, 0.14),
        size: rand(5, 10),
        color: pick(COLORS),
        shape: Math.random() < 0.5 ? 'rect' : 'circle',
        life: 0,
        maxLife: rand(260, 420)
      });
    }
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    ctx.clearRect(0, 0, width, height);

    sparks = sparks.filter((p) => p.life < p.maxLife);
    sparks.forEach((p) => {
      p.life++;
      p.vy += 0.045;
      p.vx *= 0.985;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      const fade = Math.max(1 - p.life / p.maxLife, 0);
      ctx.globalAlpha = fade;
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.size * fade + 0.4, 0, Math.PI * 2);
      ctx.fill();
    });

    confetti = confetti.filter((c) => c.life < c.maxLife && c.y < height + 30);
    confetti.forEach((c) => {
      c.life++;
      c.x += c.vx;
      c.y += c.vy;
      c.rot += c.vr;
      const fade = c.life > c.maxLife - 60 ? Math.max((c.maxLife - c.life) / 60, 0) : 1;
      ctx.globalAlpha = fade;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.fillStyle = c.color;
      if (c.shape === 'rect') {
        ctx.fillRect(-c.size / 2, -c.size / 3, c.size, c.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, c.size / 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    ctx.globalAlpha = 1;

    if (sparks.length === 0 && confetti.length === 0) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function ensureLoop() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function celebrateOpen() {
    const bursts = [
      { x: width * 0.22, y: height * 0.3, delay: 0 },
      { x: width * 0.78, y: height * 0.24, delay: 260 },
      { x: width * 0.5, y: height * 0.18, delay: 520 },
      { x: width * 0.35, y: height * 0.4, delay: 850 }
    ];
    bursts.forEach((b) => setTimeout(() => spawnFirework(b.x, b.y), b.delay));
    spawnConfetti(90);
    setTimeout(() => spawnConfetti(60), 500);
    ensureLoop();
  }

  function celebrateMilestone() {
    spawnFirework(width * 0.3, height * 0.3);
    spawnFirework(width * 0.7, height * 0.35);
    setTimeout(() => spawnFirework(width * 0.5, height * 0.22), 300);
    spawnConfetti(70);
    ensureLoop();
  }

  document.addEventListener('invitation:open', celebrateOpen);
  document.addEventListener('countdown:done', celebrateMilestone);
}

/* ---------- Pop effect: small confetti burst on button taps ---------- */
function initPopEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const POP_COLORS = ['#FF6F91', '#FFD36E', '#7FE7C4', '#7EC8E3', '#D9A86C'];
  const POP_TARGETS = '.btn, .gate-open-btn, .music-toggle';

  const burst = (x, y) => {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      dot.className = 'pop-particle';
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const distance = 26 + Math.random() * 30;
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      dot.style.background = POP_COLORS[Math.floor(Math.random() * POP_COLORS.length)];
      dot.style.setProperty('--pop-x1', (Math.cos(angle) * distance).toFixed(1) + 'px');
      dot.style.setProperty('--pop-y1', (Math.sin(angle) * distance).toFixed(1) + 'px');
      dot.style.setProperty('--pop-duration', (0.5 + Math.random() * 0.3).toFixed(2) + 's');
      document.body.appendChild(dot);
      dot.addEventListener('animationend', () => dot.remove(), { once: true });
    }
  };

  document.addEventListener('click', (event) => {
    const target = event.target.closest(POP_TARGETS);
    if (!target || target.disabled) return;
    burst(event.clientX, event.clientY);
    target.classList.remove('is-popping');
    void target.offsetWidth;
    target.classList.add('is-popping');
  });
}