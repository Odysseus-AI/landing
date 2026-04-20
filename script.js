document.addEventListener("DOMContentLoaded", () => {

  // ── Stars ──────────────────────────────────────────────────
  const s = document.getElementById('stars');
  if (s) {
    for (let i = 0; i < 120; i++) {
      const el = document.createElement('div');
      el.className = 'star';
      const sz = Math.random() * 2.5 + 0.5;
      el.style.cssText = `
        width: ${sz}px; height: ${sz}px;
        top: ${Math.random() * 100}%; left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 4}s;
        animation-duration: ${2 + Math.random() * 3}s;
      `;
      s.appendChild(el);
    }
  }

  // ── Typewriter ──────────────────────────────────────────────
  const phrases = [
    "I have a Google interview in 3 weeks...",
    "I want to get into YC next cohort...",
    "I want to land at Goldman after graduation...",
    "I'm applying to med school in 2 years...",
    "I need to build a strong research portfolio...",
    "I want to start a startup while in college...",
    "I have a PM internship interview on Friday...",
    "I want to get into a top PhD program...",
    "I just started college and have no idea where to go...",
    "I want to build my personal brand this semester...",
  ];

  const textEl = document.getElementById('typing-text');
  const cursorEl = document.getElementById('typing-cursor');

  if (!textEl || !cursorEl) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  const TYPE_SPEED = 48;
  const DELETE_SPEED = 22;
  const PAUSE_AFTER_TYPE = 2200;
  const PAUSE_BEFORE_DELETE = 400;

  function tick() {
    const current = phrases[phraseIndex];

    if (isPaused) return;

    if (!isDeleting) {
      // typing
      charIndex++;
      textEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          setTimeout(tick, PAUSE_BEFORE_DELETE);
        }, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      // deleting
      charIndex--;
      textEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // start after a short delay so the page feels settled
  setTimeout(tick, 1200);

  // blink cursor independently
  setInterval(() => {
    if (cursorEl) {
      cursorEl.style.opacity = cursorEl.style.opacity === '0' ? '1' : '0';
    }
  }, 530);


  // ── Scroll Reveal ───────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => obs.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

});
