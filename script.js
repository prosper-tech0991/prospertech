/* =====================================================
   PROSPER TECH — Portfolio Script
   Vanilla JavaScript — modular, commented, no frameworks
   ===================================================== */

(function () {
  'use strict';

  /* ---------- 1. PRELOADER (Counting Loader) ---------- */
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloaderBar');
  const preloaderCount = document.getElementById('preloaderCount');

  function runPreloader() {
    let count = 0;
    const interval = setInterval(() => {
      // Step varies a little for organic feel
      count += Math.random() * 4 + 1;
      if (count >= 100) {
        count = 100;
        clearInterval(interval);
        // Smooth fade out
        setTimeout(() => {
          preloader.classList.add('hide');
          document.body.style.overflow = '';
          startEntranceAnimations();
        }, 400);
      }
      preloaderBar.style.width = count + '%';
      preloaderCount.textContent = Math.floor(count);
    }, 50);
  }
  document.body.style.overflow = 'hidden';
  window.addEventListener('load', runPreloader);
  // Fallback in case load event already fired
  if (document.readyState === 'complete') runPreloader();


  /* ---------- 2. STARFIELD CANVAS ---------- */
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let mouseX = 0, mouseY = 0;
  const STAR_COUNT = 180;

  function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 0.8 + 0.2,
        r: Math.random() * 1.4 + 0.3,
        speed: Math.random() * 0.15 + 0.03,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      // Subtle parallax with mouse
      const px = s.x + (mouseX - canvas.width / 2) * 0.01 * s.z;
      const py = s.y + (mouseY - canvas.height / 2) * 0.01 * s.z;

      // Twinkle alpha
      s.twinkle += 0.02;
      const alpha = 0.5 + Math.sin(s.twinkle) * 0.4;

      // Color: cyan -> purple gradient based on z
      const color = s.z > 0.6
        ? `rgba(168, 85, 247, ${alpha})`
        : s.z > 0.4
          ? `rgba(99, 102, 241, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.arc(px, py, s.r * s.z, 0, Math.PI * 2);
      ctx.fill();

      // Slow drift down
      s.y += s.speed;
      if (s.y > canvas.height) {
        s.y = -2;
        s.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(drawStars);
  }

  sizeCanvas();
  createStars();
  drawStars();

  window.addEventListener('resize', () => { sizeCanvas(); createStars(); });
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
  });


  /* ---------- 3. TYPING ANIMATION ---------- */
  const typedEl = document.getElementById('typed');
  const roles = [
    'Full Stack Developer',
    'UI / UX Designer',
    'Founder of Prosper Tech',
    'API Architect',
    'Mobile App Engineer',
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIdx];
    if (!deleting) {
      typedEl.textContent = current.substring(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        return setTimeout(typeLoop, 1800);
      }
    } else {
      typedEl.textContent = current.substring(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 90);
  }
  typeLoop();


  /* ---------- 4. NAVBAR (scroll, mobile menu, active link) ---------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    updateActiveLink();
    toggleBackToTop();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  allNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      if (scrollPos >= top && scrollPos < bottom) {
        allNavLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }


  /* ---------- 5. THEME TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-mode')) {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  });


  /* ---------- 6. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => revealObserver.observe(el));


  /* ---------- 7. SKILL BAR ANIMATION ---------- */
  const skillBars = document.querySelectorAll('.bar > div');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const w = entry.target.dataset.width;
        entry.target.style.width = w + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach((bar) => skillObserver.observe(bar));


  /* ---------- 8. ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }


  /* ---------- 9. PROJECTS DATA + RENDERING ---------- */
  const projects = [
    {
      title: 'Nimbus SaaS Dashboard',
      category: 'fullstack',
      categoryLabel: 'Full Stack',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop',
      desc: 'Real-time analytics dashboard for B2B SaaS teams with custom reporting & multi-tenant billing.',
      tags: ['Next.js', 'PostgreSQL', 'Stripe', 'WebSockets'],
      live: '#', code: '#',
      details: {
        client: 'Nimbus Analytics, Inc.',
        role: 'Lead Full Stack Engineer · 2025',
        story: 'Designed and shipped a multi-tenant analytics platform serving 12,000 daily active users. Built an event ingestion pipeline handling 8M events/day and a real-time visualization layer.',
        features: [
          'Drag-and-drop dashboard builder',
          'Stripe-powered usage billing',
          'Custom alerting with Slack & email channels',
          'Role-based access control with audit logs'
        ]
      }
    },
    {
      title: 'Verdant Health Mobile',
      category: 'frontend',
      categoryLabel: 'Frontend',
      img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=80&auto=format&fit=crop',
      desc: 'Award-winning health & wellness app with gamified habit tracking and biometric sync.',
      tags: ['React Native', 'Expo', 'TypeScript', 'Reanimated'],
      live: '#', code: '#',
      details: {
        client: 'Verdant Health',
        role: 'Lead Mobile Engineer · 2024',
        story: 'Crafted a delightful mobile experience that became their #1 acquisition channel. Featured in App Store "New Apps We Love" twice.',
        features: [
          '60fps animated habit streaks',
          'HealthKit & Google Fit integrations',
          'Offline-first architecture',
          'Push notification engine'
        ]
      }
    },
    {
      title: 'Atlas Pay API',
      category: 'backend',
      categoryLabel: 'Backend',
      img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=80&auto=format&fit=crop',
      desc: 'PCI-compliant payment orchestration API processing $40M+ annually across 14 markets.',
      tags: ['Node.js', 'TypeScript', 'Kafka', 'AWS'],
      live: '#', code: '#',
      details: {
        client: 'Atlas Pay Ltd.',
        role: 'Backend Architect · 2024',
        story: 'Architected a multi-region payment API replacing a legacy monolith. Reduced p99 latency from 1.4s to 180ms.',
        features: [
          'Idempotent transaction handling',
          'Circuit breakers & retry policies',
          'OpenAPI-first developer portal',
          '99.99% SLA achieved over 12 months'
        ]
      }
    },
    {
      title: 'Lumen Commerce',
      category: 'fullstack',
      categoryLabel: 'Full Stack',
      img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80&auto=format&fit=crop',
      desc: 'Headless e-commerce platform with AI product recommendations and conversion-optimized checkout.',
      tags: ['Next.js', 'Shopify', 'OpenAI', 'Vercel'],
      live: '#', code: '#',
      details: {
        client: 'Lumen Labs',
        role: 'Founding Engineer · 2025',
        story: 'Rebuilt an entire commerce stack in three months. The new checkout flow lifted conversion by 38% in week one.',
        features: [
          'AI-powered upsell engine',
          'One-click checkout with Apple Pay',
          'CMS-driven landing pages',
          'Edge-rendered product pages'
        ]
      }
    },
    {
      title: 'Northwind CRM',
      category: 'frontend',
      categoryLabel: 'Frontend',
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format&fit=crop',
      desc: 'Modern, opinionated CRM rebuilt from a 12-year-old jQuery app. Faster, prettier, beloved by sales teams.',
      tags: ['React', 'TanStack', 'Tailwind', 'Storybook'],
      live: '#', code: '#',
      details: {
        client: 'Northwind Logistics',
        role: 'Frontend Lead · 2024',
        story: 'Migrated a legacy CRM serving 2,000 sales reps to a modern React stack with zero downtime.',
        features: [
          'Virtualized tables (1M+ rows)',
          'Keyboard-first navigation',
          'Granular permissions UI',
          'Component library with 80+ primitives'
        ]
      }
    },
    {
      title: 'Forge DevOps Suite',
      category: 'backend',
      categoryLabel: 'Backend',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80&auto=format&fit=crop',
      desc: 'Self-hosted CI/CD platform with intelligent caching and parallel pipeline execution.',
      tags: ['Go', 'Kubernetes', 'Docker', 'gRPC'],
      live: '#', code: '#',
      details: {
        client: 'Internal product · Prosper Tech',
        role: 'Creator & Maintainer · 2023–present',
        story: 'Built a CI runner that\'s 3x faster than the incumbent for our internal builds. Open-sourced and used by 600+ teams.',
        features: [
          'Smart layer caching across runs',
          'Native ARM & x86 builders',
          'Beautiful TUI for live logs',
          'Plugin system for custom steps'
        ]
      }
    }
  ];

  const projectsGrid = document.getElementById('projectsGrid');
  function renderProjects(filter = 'all') {
    projectsGrid.innerHTML = '';
    projects
      .filter((p) => filter === 'all' || p.category === filter)
      .forEach((p, i) => {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.style.animationDelay = (i * 0.08) + 's';
        card.dataset.idx = projects.indexOf(p);
        card.innerHTML = `
          <div class="project-img">
            <img src="${p.img}" alt="${p.title}" loading="lazy" />
            <div class="project-overlay">
              <button class="icon-btn" aria-label="View details" data-open-modal>
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          <div class="project-body">
            <span class="project-cat">${p.categoryLabel}</span>
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
            <div class="project-tags">${p.tags.map((t) => `<span>${t}</span>`).join('')}</div>
            <div class="project-actions">
              <a href="${p.live}" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>
              <a href="${p.code}" class="btn btn-outline"><i class="fab fa-github"></i> Code</a>
            </div>
          </div>
        `;
        projectsGrid.appendChild(card);

        // Modal trigger (also clickable image area)
        card.querySelector('[data-open-modal]').addEventListener('click', () => openModal(p));
      });
  }
  renderProjects();

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });


  /* ---------- 10. PROJECT MODAL ---------- */
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');

  function openModal(p) {
    modalBody.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <div class="modal-content">
        <span class="project-cat">${p.categoryLabel}</span>
        <h3>${p.title}</h3>
        <div class="project-tags">${p.tags.map((t) => `<span>${t}</span>`).join('')}</div>
        <p><strong style="color:var(--text);">${p.details.client}</strong><br/>
        <span style="color:var(--text-dim); font-size:.9rem;">${p.details.role}</span></p>
        <p>${p.details.story}</p>
        <h4 style="font-family:Poppins,sans-serif;font-weight:700;margin:18px 0 12px;">Highlights</h4>
        <ul>
          ${p.details.features.map((f) => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
        </ul>
        <div class="project-actions">
          <a href="${p.live}" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>
          <a href="${p.code}" class="btn btn-outline"><i class="fab fa-github"></i> View Code</a>
        </div>
      </div>
    `;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });


  /* ---------- 11. TESTIMONIAL SLIDER ---------- */
  const track = document.getElementById('testTrack');
  const slides = track.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');
  const dotsWrap = document.getElementById('testDots');
  let testIdx = 0;
  let testTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(i) {
    testIdx = (i + slides.length) % slides.length;
    slides.forEach((s) => (s.style.transform = `translateX(-${testIdx * 100}%)`));
    Array.from(dotsWrap.children).forEach((d, idx) => d.classList.toggle('active', idx === testIdx));
    restartTimer();
  }
  function next() { goTo(testIdx + 1); }
  function prev() { goTo(testIdx - 1); }
  function restartTimer() {
    clearInterval(testTimer);
    testTimer = setInterval(next, 6000);
  }
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  goTo(0);


  /* ---------- 12. VIDEO SHOWCASE CONTROLS ---------- */
  const videoShowcase = document.getElementById('showcaseVideo');
  const videoToggle = document.getElementById('videoToggle');
  if (videoShowcase && videoToggle) {
    videoToggle.addEventListener('click', () => {
      const icon = videoToggle.querySelector('i');
      const label = videoToggle.querySelector('span');
      if (videoShowcase.paused) {
        videoShowcase.play();
        icon.className = 'fas fa-pause';
        label.textContent = 'Pause Reel';
      } else {
        videoShowcase.pause();
        icon.className = 'fas fa-play';
        label.textContent = 'Play Reel';
      }
    });
  }


  /* ---------- 13. CONTACT FORM VALIDATION ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const data = {
      name: document.getElementById('cf-name').value.trim(),
      email: document.getElementById('cf-email').value.trim(),
      subject: document.getElementById('cf-subject').value.trim(),
      message: document.getElementById('cf-message').value.trim(),
    };

    let valid = true;
    if (data.name.length < 2) { setError('name', 'Please enter your name.'); valid = false; }
    if (!/^\S+@\S+\.\S+$/.test(data.email)) { setError('email', 'Please enter a valid email.'); valid = false; }
    if (data.subject.length < 3) { setError('subject', 'Subject is too short.'); valid = false; }
    if (data.message.length < 10) { setError('message', 'Message must be at least 10 characters.'); valid = false; }

    if (!valid) {
      formStatus.textContent = 'Please fix the errors above.';
      formStatus.className = 'form-status error';
      return;
    }

    // Simulate async send
    formStatus.textContent = 'Sending message...';
    formStatus.className = 'form-status';
    setTimeout(() => {
      formStatus.textContent = `Thanks, ${data.name}! Your message is on its way. I'll reply within 24 hours.`;
      formStatus.className = 'form-status success';
      contactForm.reset();
      setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 6000);
    }, 900);
  });

  function setError(field, msg) {
    const el = document.querySelector(`.error[data-for="${field}"]`);
    if (el) el.textContent = msg;
  }
  function clearErrors() {
    document.querySelectorAll('.error').forEach((el) => (el.textContent = ''));
  }


  /* ---------- 14. NEWSLETTER FORM ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterStatus = document.getElementById('newsletterStatus');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newsletterStatus.style.color = '#f87171';
      newsletterStatus.textContent = 'Please enter a valid email.';
      return;
    }
    newsletterStatus.style.color = '#22c55e';
    newsletterStatus.textContent = "You're subscribed! Welcome aboard.";
    newsletterForm.reset();
    setTimeout(() => { newsletterStatus.textContent = ''; }, 5000);
  });


  /* ---------- 15. BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    if (window.scrollY > 500) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  }
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  /* ---------- 16. CV DOWNLOAD (placeholder) ---------- */
  const downloadCv = document.getElementById('downloadCv');
  downloadCv.addEventListener('click', (e) => {
    e.preventDefault();
    // Generate a simple text CV on-the-fly
    const cv = `PROSPER — FULL STACK DEVELOPER
=====================================
Prosper Tech Studio
hello@prospertech.dev | prospertech.dev

EXPERIENCE
- 7+ years building production web & mobile applications
- Founder of Prosper Tech, a premium dev studio

STACK
- Frontend: React, Next.js, TypeScript, Tailwind
- Backend: Node.js, Python, PostgreSQL, GraphQL
- Cloud: AWS, GCP, Docker, Kubernetes

Available worldwide for select engagements.
`;
    const blob = new Blob([cv], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Prosper-Tech-CV.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });


  /* ---------- 17. ENTRANCE ANIMATIONS (post preloader) ---------- */
  function startEntranceAnimations() {
    document.body.classList.add('loaded');
    updateActiveLink();
  }


  /* ---------- 18. UTILITIES ---------- */
  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

})();
