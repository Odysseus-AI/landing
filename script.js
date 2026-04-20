document.addEventListener("DOMContentLoaded", () => {

  // ── Stars ──────────────────────────────────────────────
  const starsContainer = document.getElementById('stars');
  if (starsContainer) {
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
      starsContainer.appendChild(el);
    }
  }

  // ── Mobile Menu ────────────────────────────────────────
  const hamBtn  = document.getElementById('ham-btn');
  const mobMenu = document.getElementById('mob-menu');
  const mobClose = document.getElementById('mob-close');

  if (hamBtn && mobMenu && mobClose) {
    hamBtn.addEventListener('click', () => {
      mobMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    mobClose.addEventListener('click', () => {
      mobMenu.classList.remove('open');
      document.body.style.overflow = '';
    });

    mobMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Typewriter ─────────────────────────────────────────
  const textEl   = document.getElementById('typing-text');
  const cursorEl = document.getElementById('typing-cursor');

  if (textEl && cursorEl) {
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

    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;
    let isPaused    = false;

    const TYPE_SPEED        = 48;
    const DELETE_SPEED      = 22;
    const PAUSE_AFTER_TYPE  = 2200;
    const PAUSE_BEFORE_DEL  = 400;

    function tick() {
      if (isPaused) return;
      const current = phrases[phraseIndex];

      if (!isDeleting) {
        charIndex++;
        textEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
            isDeleting = true;
            setTimeout(tick, PAUSE_BEFORE_DEL);
          }, PAUSE_AFTER_TYPE);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
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

    setTimeout(tick, 1200);

    setInterval(() => {
      cursorEl.style.opacity = cursorEl.style.opacity === '0' ? '1' : '0';
    }, 530);
  }

  // ── Scroll Reveal ──────────────────────────────────────
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
