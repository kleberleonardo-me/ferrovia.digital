/* =========================================================
   ELETRICISTA LOBO 24h — script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  setupYear();
  setupMobileNav();
  setupScrollReveal();
  setupHeaderShrink();
  setupContentProtection();

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion) {
    setupSparksCanvas();
  }
});

/* ---------- Ano no rodapé ---------- */
function setupYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Menu mobile ---------- */
function setupMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}

/* ---------- Header muda ao rolar ---------- */
function setupHeaderShrink() {
  const header = document.getElementById("header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = "0 4px 24px rgba(0,0,0,0.5)";
    } else {
      header.style.boxShadow = "none";
    }
  });
}

/* ---------- Reveal on scroll (Intersection Observer) ---------- */
function setupScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${(index % 3) * 90}ms`;
    observer.observe(item);
  });
}

/* ---------- Proteção básica: sem clique direito e sem seleção de fundo ---------- */
function setupContentProtection() {
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  document.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG" || e.target.tagName === "CANVAS") {
      e.preventDefault();
    }
  });
}

/* ---------- Faíscas elétricas no canvas de fundo ---------- */
function setupSparksCanvas() {
  const canvas = document.getElementById("sparks-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height, particles;
  let animationId;

  const PARTICLE_COUNT = window.innerWidth < 700 ? 45 : 90;
  const MAX_DIST = 140;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.6 + 0.6,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    // Atualiza e desenha partículas
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.03;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const flicker = 0.5 + Math.sin(p.pulse) * 0.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${flicker * 0.7})`;
      ctx.shadowColor = "rgba(255,255,255,0.8)";
      ctx.shadowBlur = 6;
      ctx.fill();
    });

    // Conecta partículas próximas com "raios" finos
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(drawFrame);
  }

  resize();
  createParticles();
  drawFrame();

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cancelAnimationFrame(animationId);
      resize();
      createParticles();
      drawFrame();
    }, 200);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      drawFrame();
    }
  });
}
