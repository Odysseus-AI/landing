document.addEventListener("DOMContentLoaded", () => {

  // ── Mobile Menu ────────────────────────────────────────
  const hamBtn   = document.getElementById('ham-btn');
  const mobMenu  = document.getElementById('mob-menu');
  const mobClose = document.getElementById('mob-close');
  if (hamBtn && mobMenu && mobClose) {
    hamBtn.addEventListener('click',  () => { mobMenu.classList.add('open');    document.body.style.overflow = 'hidden'; });
    mobClose.addEventListener('click',() => { mobMenu.classList.remove('open'); document.body.style.overflow = ''; });
    mobMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => { mobMenu.classList.remove('open'); document.body.style.overflow = ''; }));
  }

  // ── Typewriter ─────────────────────────────────────────
  const textEl = document.getElementById('typing-text');
  const cursorEl = document.getElementById('typing-cursor');
  if (textEl && cursorEl) {
    const phrases = [
      "I have a Google interview in 3 weeks...",
      "Help me find time to study in my packed schedule...",
      "I want to start a study group for finals...",
      "I'm applying to med school — where do I even start?",
      "Find me the best resources for machine learning...",
      "Check in with me every day on my MCAT prep...",
      "I want to land at Goldman after graduation...",
      "I need a roadmap from freshman year to YC...",
      "Help me balance my internship apps and coursework...",
      "I want to build my portfolio this semester...",
    ];
    let pi = 0, ci = 0, del = false, paused = false;
    function tick() {
      if (paused) return;
      const cur = phrases[pi];
      if (!del) {
        textEl.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { paused = true; setTimeout(() => { paused = false; del = true; setTimeout(tick, 400); }, 2200); return; }
        setTimeout(tick, 48);
      } else {
        textEl.textContent = cur.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
        setTimeout(tick, 22);
      }
    }
    setTimeout(tick, 1200);
    setInterval(() => { cursorEl.style.opacity = cursorEl.style.opacity === '0' ? '1' : '0'; }, 530);
  }

  // ── Scroll Reveal ──────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); o.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    reveals.forEach(el => obs.observe(el));
  } else { reveals.forEach(el => el.classList.add('active')); }

  // ── Hero Ocean Scene ───────────────────────────────────
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, raf, shipX = null;
  let t = 0;

  const hour  = new Date().getHours();
  const isDay = hour >= 6 && hour < 20;
  if (!isDay) { const wr = canvas.closest('.hero-wrapper'); if (wr) wr.setAttribute('data-night', ''); }

  // ── Pre-generate stars (night only) ───────────────────
  const stars = !isDay ? Array.from({ length: 120 }, () => ({
    x: Math.random(), y: Math.random() * 0.60,
    r: Math.random() * 0.85 + 0.2, a: Math.random() * 0.5 + 0.5,
    ph: Math.random() * Math.PI * 2
  })) : [];

  // ── Dragons — 3 of different sizes ────────────────────
  const dragonDefs = [
    { xFrac: 0.18, yFrac: 0.13, sf: 0.042, dx:  0.32, ph: 0.0, phSpd: 2.2 },
    { xFrac: 0.58, yFrac: 0.24, sf: 0.028, dx: -0.22, ph: 1.8, phSpd: 2.6 },
    { xFrac: 0.82, yFrac: 0.09, sf: 0.018, dx:  0.16, ph: 0.9, phSpd: 3.1 },
  ];

  // ── Fish — 9 random fish underwater ───────────────────
  const fishDefs = Array.from({ length: 9 }, () => ({
    xFrac: Math.random() * 1.2,
    yFrac: 0.76 + Math.random() * 0.13,
    sf: 0.011 + Math.random() * 0.009,
    dx: (Math.random() > 0.5 ? 1 : -1) * (0.12 + Math.random() * 0.20),
    wob: Math.random() * Math.PI * 2,
    wobAmt: 2 + Math.random() * 4,
  }));

  // ── Responsive scale helpers ───────────────────────────
  function getShipScale() {
    if (w < 480) return 0.85;
    if (w < 768) return 1.20;
    return 1.65;
  }

  function getDragonMult() {
    if (w < 480) return 0.52;
    if (w < 768) return 0.72;
    return 1.0;
  }

  // ── Size / resize ──────────────────────────────────────
  function setSize() {
    const dpr = window.devicePixelRatio || 1;
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (shipX === null) shipX = w * 0.55;
    dragonDefs.forEach((d, i) => { if (!d._init) { d.x = [0.18, 0.58, 0.82][i] * w; d._init = true; } });
    fishDefs.forEach(f => { if (!f._init) { f.x = f.xFrac * w; f._init = true; } });
  }

  // ── Sky ────────────────────────────────────────────────
  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, h * 0.66);
    if (isDay) {
      g.addColorStop(0,    'rgba(45, 125, 195, 0.80)');
      g.addColorStop(0.30, 'rgba(80, 155, 210, 0.72)');
      g.addColorStop(0.62, 'rgba(145, 198, 232, 0.58)');
      g.addColorStop(1,    'rgba(192, 225, 245, 0.28)');
    } else {
      g.addColorStop(0,    'rgba(3,  7,  24, 0.97)');
      g.addColorStop(0.38, 'rgba(5, 12,  38, 0.95)');
      g.addColorStop(0.70, 'rgba(9, 20,  52, 0.90)');
      g.addColorStop(1,    'rgba(14, 30, 65, 0.60)');
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h * 0.66);
    if (!isDay) {
      stars.forEach(s => {
        const tw = 0.55 + Math.sin(t * 1.9 + s.ph) * 0.45;
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = '#c5d8ff';
        ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
  }

  // ── Sun ────────────────────────────────────────────────
  function drawSun() {
    const sx = w * 0.88, sy = h * 0.13, r = Math.min(30, h * 0.040);
    const haze = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 5.5);
    haze.addColorStop(0,   'rgba(255, 242, 155, 0.35)');
    haze.addColorStop(0.38,'rgba(255, 225, 80,  0.14)');
    haze.addColorStop(1,   'rgba(255, 210, 50,  0)');
    ctx.fillStyle = haze; ctx.beginPath(); ctx.arc(sx, sy, r * 5.5, 0, Math.PI * 2); ctx.fill();
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 2.5);
    glow.addColorStop(0,   'rgba(255, 250, 210, 0.75)');
    glow.addColorStop(0.5, 'rgba(255, 232, 95,  0.38)');
    glow.addColorStop(1,   'rgba(255, 215, 55,  0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(sx, sy, r * 2.5, 0, Math.PI * 2); ctx.fill();
    const disc = ctx.createRadialGradient(sx - r * 0.25, sy - r * 0.25, 0, sx, sy, r);
    disc.addColorStop(0, '#fffef2'); disc.addColorStop(0.45, '#ffe655'); disc.addColorStop(1, '#ffcc00');
    ctx.fillStyle = disc; ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
    // water shimmer below sun
    const rayG = ctx.createLinearGradient(sx, h * 0.63, sx, h * 0.90);
    rayG.addColorStop(0, 'rgba(255, 238, 110, 0.22)'); rayG.addColorStop(1, 'rgba(255, 238, 110, 0)');
    for (let i = -1; i <= 1; i++) {
      const ox = Math.sin(t * 1.3 + i) * 7;
      ctx.fillStyle = rayG; ctx.beginPath();
      ctx.ellipse(sx + ox + i * 11, h * 0.77, 5, 20, 0, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ── Moon ───────────────────────────────────────────────
  function drawMoon() {
    const mx = w * 0.86, my = h * 0.11, r = Math.min(20, h * 0.028);
    const glow = ctx.createRadialGradient(mx, my, 0, mx, my, r * 3.5);
    glow.addColorStop(0, 'rgba(180, 205, 255, 0.28)'); glow.addColorStop(1, 'rgba(180, 205, 255, 0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(mx, my, r * 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#dce8f8'; ctx.beginPath(); ctx.arc(mx, my, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(3, 7, 24, 0.98)';
    ctx.beginPath(); ctx.arc(mx + r * 0.52, my - r * 0.05, r * 0.84, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 4; i++) {
      const ox = Math.sin(t * 0.9 + i * 1.1) * (5 + i * 5);
      ctx.globalAlpha = 0.13 - i * 0.028; ctx.fillStyle = '#dce8f8';
      ctx.beginPath(); ctx.ellipse(mx + ox, h * 0.67 + i * 13, 15 - i * 2, 2.0, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ── Dragon ─────────────────────────────────────────────
  function drawDragon(cx, cy, size, wPhase, dx) {
    ctx.save();
    ctx.translate(cx, cy);
    if (dx < 0) ctx.scale(-1, 1);
    const col = isDay ? 'rgba(26, 16, 44, 0.65)' : 'rgba(58, 25, 78, 0.88)';
    ctx.fillStyle = col; ctx.strokeStyle = col;
    const wa = Math.sin(wPhase) * 0.38;

    // Left wing
    ctx.save(); ctx.rotate(wa - 0.14);
    ctx.beginPath();
    ctx.moveTo(-size * 0.08, -size * 0.05);
    ctx.bezierCurveTo(-size * 0.42, -size * 0.74, -size * 0.86, -size * 0.64, -size * 1.06, -size * 0.22);
    ctx.bezierCurveTo(-size * 0.84, -size * 0.04, -size * 0.50,  size * 0.05, -size * 0.08,  size * 0.06);
    ctx.closePath(); ctx.fill(); ctx.restore();

    // Right wing
    ctx.save(); ctx.rotate(-wa * 0.88 - 0.08);
    ctx.beginPath();
    ctx.moveTo( size * 0.08, -size * 0.05);
    ctx.bezierCurveTo( size * 0.42, -size * 0.74,  size * 0.86, -size * 0.64,  size * 1.06, -size * 0.22);
    ctx.bezierCurveTo( size * 0.84, -size * 0.04,  size * 0.50,  size * 0.05,  size * 0.08,  size * 0.06);
    ctx.closePath(); ctx.fill(); ctx.restore();

    // Body
    ctx.beginPath(); ctx.ellipse(size * 0.06, size * 0.03, size * 0.26, size * 0.10, 0.18, 0, Math.PI * 2); ctx.fill();
    // Neck + head
    ctx.beginPath(); ctx.ellipse(size * 0.44, -size * 0.12, size * 0.18, size * 0.07, -0.30, 0, Math.PI * 2); ctx.fill();
    // Snout
    ctx.beginPath(); ctx.moveTo(size * 0.58, -size * 0.16); ctx.lineTo(size * 0.72, -size * 0.12); ctx.lineTo(size * 0.67, -size * 0.04); ctx.closePath(); ctx.fill();
    // Tail
    ctx.lineWidth = Math.max(1.5, size * 0.07); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-size * 0.26, size * 0.06);
    ctx.bezierCurveTo(-size * 0.52, size * 0.18, -size * 0.75, size * 0.06, -size * 0.88, -size * 0.08);
    ctx.stroke();
    // Tail diamond tip
    const tx = -size * 0.88, ty = -size * 0.08;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(tx, ty - size * 0.08); ctx.lineTo(tx + size * 0.07, ty);
    ctx.lineTo(tx, ty + size * 0.08); ctx.lineTo(tx - size * 0.07, ty); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  // ── Fish ───────────────────────────────────────────────
  function drawFish(cx, cy, size, facing) {
    ctx.save();
    ctx.translate(cx, cy);
    if (facing < 0) ctx.scale(-1, 1);
    const a = isDay ? 0.30 : 0.42;
    ctx.fillStyle = isDay ? `rgba(38, 65, 108, ${a})` : `rgba(16, 30, 60, ${a})`;
    ctx.beginPath(); ctx.ellipse(0, 0, size, size * 0.40, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-size * 0.80, 0); ctx.lineTo(-size * 1.35, -size * 0.42); ctx.lineTo(-size * 1.35, size * 0.42); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-size * 0.10, -size * 0.36); ctx.lineTo(size * 0.22, -size * 0.60); ctx.lineTo(size * 0.44, -size * 0.36); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  // ── Water ──────────────────────────────────────────────
  function drawWater() {
    const g = ctx.createLinearGradient(0, h * 0.61, 0, h);
    if (isDay) {
      g.addColorStop(0,    'rgba(172, 210, 232, 0)');
      g.addColorStop(0.22, 'rgba(150, 195, 224, 0.42)');
      g.addColorStop(0.60, 'rgba(122, 174, 212, 0.62)');
      g.addColorStop(1,    'rgba(100, 155, 204, 0.74)');
    } else {
      g.addColorStop(0,    'rgba(6,  16, 46, 0)');
      g.addColorStop(0.22, 'rgba(8,  20, 54, 0.55)');
      g.addColorStop(0.60, 'rgba(10, 26, 62, 0.76)');
      g.addColorStop(1,    'rgba(6,  14, 44, 0.94)');
    }
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }

  function wc(r, g, b, a) {
    return isDay
      ? `rgba(${r},${g},${b},${a})`
      : `rgba(${Math.round(r*0.11)},${Math.round(g*0.17)},${Math.round(b*0.29)},${Math.min(1, a + 0.11)})`;
  }

  function drawWave(yBase, amp, len, spd, r, g, b, a) {
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const y = yBase + Math.sin((x/len) + t*spd)*amp*0.65 + Math.sin((x/(len*0.55)) + t*spd*1.6)*amp*0.35;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    ctx.fillStyle = wc(r, g, b, a); ctx.fill();
  }

  // ── Ship ──────────────────────────────────────────────
  function drawShip(cx, cy) {
    const s = getShipScale();
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(s, s);

    const dark  = '#243856', mid = '#1b2e46';
    const sails = isDay ? '#ece4d4' : '#cad4e8';
    const flag  = '#c9873a';

    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.moveTo(-62, -9); ctx.lineTo(-80, 1); ctx.lineTo(-62, 7);
    ctx.bezierCurveTo(-35, 17, 18, 20, 58, 9);
    ctx.lineTo(66, 0); ctx.lineTo(58, -13); ctx.lineTo(-52, -12);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = mid; ctx.fillRect(40, -24, 22, 12);
    ctx.fillStyle = dark; ctx.fillRect(-2.5, -90, 5, 78); ctx.fillRect(-33, -86, 64, 4);

    ctx.fillStyle = sails; ctx.globalAlpha = 0.93;
    ctx.beginPath(); ctx.moveTo(-31, -83); ctx.bezierCurveTo(-8, -67, 8, -48, 28, -14);
    ctx.lineTo(0, -14); ctx.bezierCurveTo(-4, -48, -8, -67, -31, -83); ctx.closePath(); ctx.fill();

    ctx.globalAlpha = 0.78;
    ctx.beginPath(); ctx.moveTo(1, -80); ctx.bezierCurveTo(22, -63, 33, -44, 30, -14);
    ctx.lineTo(1, -14); ctx.bezierCurveTo(1, -44, 1, -63, 1, -80); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = flag;
    ctx.beginPath(); ctx.moveTo(-1, -90); ctx.lineTo(16, -82); ctx.lineTo(-1, -74); ctx.closePath(); ctx.fill();

    ctx.strokeStyle = dark; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-61, -10); ctx.lineTo(-96, -23); ctx.stroke();

    const wg = ctx.createLinearGradient(62, 0, 175, 0);
    wg.addColorStop(0, isDay ? 'rgba(255,255,255,0.42)' : 'rgba(155,180,228,0.30)');
    wg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = wg; ctx.beginPath(); ctx.ellipse(118, 5, 60, 5.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // ── Frame ──────────────────────────────────────────────
  function frame() {
    t += 0.011;
    ctx.clearRect(0, 0, w, h);

    // 1. Sky + celestial
    drawSky();
    if (isDay) drawSun(); else drawMoon();

    // 2. Dragons in sky
    const dm = getDragonMult();
    dragonDefs.forEach(d => {
      d.x += d.dx;
      if (d.x > w + 160) d.x = -160;
      if (d.x < -160)    d.x = w + 160;
      drawDragon(d.x, h * d.yFrac, h * d.sf * dm, d.ph + t * d.phSpd, d.dx);
    });

    // 3. Water base
    drawWater();

    // Horizon blend
    const hg = ctx.createLinearGradient(0, h * 0.60, 0, h * 0.66);
    hg.addColorStop(0, isDay ? 'rgba(210,232,248,0)' : 'rgba(10,26,58,0)');
    hg.addColorStop(1, isDay ? 'rgba(192,222,242,0.28)' : 'rgba(6,18,50,0.35)');
    ctx.fillStyle = hg; ctx.fillRect(0, h * 0.60, w, h * 0.06);

    drawWave(h * 0.620, 12, 325, 0.33, 162, 203, 228, 0.38);

    // 4. Fish (draw before front waves — visible as underwater shadows)
    fishDefs.forEach(f => {
      f.x += f.dx;
      if (f.x > w + 90)  f.x = -90;
      if (f.x < -90)     f.x = w + 90;
      const wobY = Math.sin(t * 1.4 + f.wob) * f.wobAmt;
      drawFish(f.x, h * f.yFrac + wobY, h * f.sf, f.dx > 0 ? 1 : -1);
    });

    // 5. Ship
    shipX -= 0.22;
    if (shipX < -180) shipX = w + 180;
    drawShip(shipX, h * 0.650 + Math.sin(t * 0.85) * 2.8);

    // 6. Mid + front waves (cover ship hull + fish)
    drawWave(h * 0.670, 10, 248, 0.52, 145, 190, 220, 0.46);
    drawWave(h * 0.728,  8, 186, 0.73, 130, 178, 214, 0.42);
    drawWave(h * 0.800,  6, 130, 0.96, 115, 165, 208, 0.38);

    // 7. Bottom edge fade
    const bf = ctx.createLinearGradient(0, h * 0.88, 0, h);
    bf.addColorStop(0, 'rgba(248,246,243,0)'); bf.addColorStop(1, 'rgba(248,246,243,0.55)');
    ctx.fillStyle = bf; ctx.fillRect(0, h * 0.88, w, h * 0.12);

    raf = requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => { cancelAnimationFrame(raf); setSize(); frame(); });
  setSize();
  frame();
});
