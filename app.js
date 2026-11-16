document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initMobileMenu();
  initParticleCanvas();
  initScrollAnimations();
  initStatsCounter();
  initProjectsFilter();
  initProjectAccordions();
  
  // Immersive developer-grade micro-interactions
  initCustomCursor();
  initTiltEffect();
  initTextScramble();
  initMagneticButtons();
  initVisitCounter();
  initVideoModal();
  initContactForm();
});

/* ==========================================================================
   SCROLL EFFECTS & PROGRESS BAR
   ========================================================================== */
function initScrollEffects() {
  const header = document.querySelector('.header');
  const scrollBar = document.getElementById('scrollBar');
  const navItems = document.querySelectorAll('.nav-desktop .nav-item:not(.btn-nav)');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Header background change on scroll
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll progress indicator
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    scrollBar.style.width = scrolled + '%';

    // Active Navigation Highlight on Scroll
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // Offset for sticky header
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSectionId}`) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item, .mobile-resume-btn');

  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking on a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && 
        !mobileMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   INTERACTIVE CONSTELLATION CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 25000)); // Cap counts for performance
  const maxDistance = 120;
  
  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  // Cyber HUD Grid Configuration (Features actual skills)
  const gridSpacing = 100;
  const gridTags = [];
  const maxGridTags = 7;
  const tagWords = ['React', 'Laravel', 'Next.js', 'Vue.js', 'PHP', 'TypeScript', 'MySQL', 'Node.js', 'Stripe', 'Python', 'AWS S3', 'Git', 'Redux', 'Vuex', 'Postgres', 'REST APIs'];
  let scanY = -150; // Y coordinate of scanner sweep

  // Resize listener
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mouse move tracking (ambient effect)
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.color = 'rgba(99, 102, 241, 0.45)';
    }

    update() {
      // Move particle
      this.x += this.vx;
      this.y += this.vy;

      // Wall bounce
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push away
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      let alpha = 0.15; // Ambient default state
      
      // Calculate searchlight distance
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          // Glow intensity scales up as cursor gets closer
          alpha = 0.15 + (1 - (dist / mouse.radius)) * 0.65;
        }
      }
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
      ctx.fill();
      
      // Render outer glow halo when illuminated by cursor
      if (alpha > 0.45) {
        ctx.strokeStyle = `rgba(6, 182, 212, ${(alpha - 0.15) * 0.25})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 3.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Draw connecting lines between close particles & cursor
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          let alpha = (1 - (dist / maxDistance)) * 0.05; // Faint default mesh lines
          
          // Boost visibility of line when within searchlight scope
          if (mouse.x !== null) {
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const dxMouse = midX - mouse.x;
            const dyMouse = midY - mouse.y;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            
            if (distMouse < mouse.radius) {
              // Smoothly blend brighter highlight line
              alpha += (1 - (distMouse / mouse.radius)) * 0.25;
            }
          }
          
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      
      // Connect particles to mouse
      if (mouse.x !== null) {
        const dxMouse = p1.x - mouse.x;
        const dyMouse = p1.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < mouse.radius) {
          const alphaMouse = (1 - (distMouse / mouse.radius)) * 0.22;
          ctx.strokeStyle = `rgba(99, 102, 241, ${alphaMouse})`; // Violet link to cursor
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  // Cyber HUD background calculations
  function updateGridTags() {
    // Generate new tags
    if (gridTags.length < maxGridTags && Math.random() < 0.015) {
      const col = Math.floor(Math.random() * (width / gridSpacing));
      const row = Math.floor(Math.random() * (height / gridSpacing));
      const text = tagWords[Math.floor(Math.random() * tagWords.length)];
      
      const exists = gridTags.some(t => t.col === col && t.row === row);
      if (!exists && col > 0 && row > 0) {
        gridTags.push({
          col,
          row,
          text,
          alpha: 0,
          fadeIn: true,
          life: 0,
          maxLife: 150 + Math.random() * 120
        });
      }
    }

    // Update tags lifecycle
    for (let i = gridTags.length - 1; i >= 0; i--) {
      const tag = gridTags[i];
      tag.life++;
      
      if (tag.fadeIn) {
        tag.alpha += 0.015;
        if (tag.alpha >= 0.35) {
          tag.alpha = 0.35;
          tag.fadeIn = false;
        }
      } else if (tag.life > tag.maxLife - 40) {
        tag.alpha -= 0.015;
      }

      if (tag.life >= tag.maxLife || tag.alpha <= 0) {
        gridTags.splice(i, 1);
      }
    }
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.025)'; // Faint grid lines
    ctx.lineWidth = 0.5;

    // Draw vertical mesh lines
    for (let x = 0; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal mesh lines
    for (let y = 0; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw crossing points
    for (let x = gridSpacing; x < width; x += gridSpacing) {
      for (let y = gridSpacing; y < height; y += gridSpacing) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }

    // Mouse coordinates tracker
    if (mouse.x !== null) {
      // Draw glowing radial spotlight background layer under mouse
      const spotlight = ctx.createRadialGradient(mouse.x, mouse.y, 5, mouse.x, mouse.y, 160);
      spotlight.addColorStop(0, 'rgba(6, 182, 212, 0.08)'); // Electric cyan center
      spotlight.addColorStop(0.5, 'rgba(99, 102, 241, 0.03)'); // Violet halo ring
      spotlight.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Dissolves
      
      ctx.fillStyle = spotlight;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 160, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
      ctx.lineWidth = 1;
      
      const nearX = Math.round(mouse.x / gridSpacing) * gridSpacing;
      ctx.beginPath();
      ctx.moveTo(nearX, Math.max(0, mouse.y - 180));
      ctx.lineTo(nearX, Math.min(height, mouse.y + 180));
      ctx.stroke();
      
      const nearY = Math.round(mouse.y / gridSpacing) * gridSpacing;
      ctx.beginPath();
      ctx.moveTo(Math.max(0, mouse.x - 180), nearY);
      ctx.lineTo(Math.min(width, mouse.x + 180), nearY);
      ctx.stroke();
      
      // Coordinate indicator dot
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.beginPath();
      ctx.arc(nearX, nearY, 3, 0, Math.PI * 2);
      ctx.stroke();
      
      // Floating text readout
      ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.font = '8px Fira Code, monospace';
      ctx.fillText(`X:${Math.floor(mouse.x)} Y:${Math.floor(mouse.y)}`, mouse.x + 12, mouse.y + 12);
    }

    // Draw system tags
    gridTags.forEach(tag => {
      const x = tag.col * gridSpacing;
      const y = tag.row * gridSpacing;
      
      ctx.fillStyle = `rgba(6, 182, 212, ${tag.alpha})`;
      ctx.font = '8px Fira Code, monospace';
      ctx.fillText(`[${tag.text}]`, x + 6, y - 6);
      
      ctx.fillStyle = `rgba(6, 182, 212, ${tag.alpha * 1.5})`;
      ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
    });
  }

  function drawScannerLine() {
    scanY += 1.5; // Scanning sweep speed
    if (scanY > height + 200) {
      scanY = -150; // Loop scanning line
    }
    
    if (scanY > 0 && scanY < height) {
      const scanGrad = ctx.createLinearGradient(0, scanY, 0, scanY + 120);
      scanGrad.addColorStop(0, 'rgba(6, 182, 212, 0.08)'); // Leading sweep wave
      scanGrad.addColorStop(0.05, 'rgba(6, 182, 212, 0.03)'); // Faint body
      scanGrad.addColorStop(1, 'rgba(6, 182, 212, 0)'); // Dissipating tail
      
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY, width, 120);
      
      // Solid leading laser sweep line
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.16)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw grid HUD first (background layer)
    updateGridTags();
    drawGrid();

    // Draw scanning laser wave
    drawScannerLine();

    // Update and draw particles and connection lines (foreground layer)
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawLines();
    requestAnimationFrame(animate);
  }

  // Don't render animations if prefers-reduced-motion is active
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animate();
  }
}


/* ==========================================================================
   SCROLL-TRIGGERED REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.scroll-anim');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   NUMERICAL COUNTER EFFECT
   ========================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.metric-numCounter');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.8
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const frameRate = 60;
        const totalFrames = (duration / 1000) * frameRate;
        const increment = target / totalFrames;
        
        let currentVal = 0;
        let frame = 0;

        const updateCounter = () => {
          frame++;
          currentVal += increment;
          
          if (frame < totalFrames) {
            if (target % 1 === 0) {
              counter.textContent = Math.floor(currentVal).toLocaleString() + suffix;
            } else {
              counter.textContent = currentVal.toFixed(1) + suffix;
            }
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString() + suffix;
          }
        };
        
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   PROJECTS FILTER SYSTEM
   ========================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const company = card.getAttribute('data-company');
        const type = card.getAttribute('data-type');

        if (filterVal === 'all' || company === filterVal || type === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   PROJECT ACCORDIONS
   ========================================================================== */
function initProjectAccordions() {
  const detailsBtns = document.querySelectorAll('.details-btn');

  detailsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('aria-controls');
      const targetEl = document.getElementById(targetId);
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', !isExpanded);
      targetEl.hidden = isExpanded;
      
      const btnTextSpan = btn.querySelector('span');
      btnTextSpan.textContent = isExpanded ? "View Details" : "Hide Details";
    });
  });
}

/* ==========================================================================
   FLUID CUSTOM CURSOR ENGINE (LERP)
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  
  if (!dot || !ring) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;
  
  // Track currently hovered item dimensions
  let hoveredEl = null;
  let hoverRect = null;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function render() {
    // Smooth lerping for trailing inner core dot
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    dot.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`; // Center 6px dot
    
    if (hoveredEl && hoverRect) {
      // 1. Magnetic Snapping state: Morph ring into a box enclosing the element
      const targetX = hoverRect.left;
      const targetY = hoverRect.top;
      const targetW = hoverRect.width;
      const targetH = hoverRect.height;
      
      // Interpolate coordinates smoothly to element bounds
      ringX += (targetX - ringX) * 0.28;
      ringY += (targetY - ringY) * 0.28;
      
      // Interpolate dimensions of the snapping box
      let currentW = parseFloat(ring.style.width) || 24;
      let currentH = parseFloat(ring.style.height) || 24;
      
      currentW += (targetW - currentW) * 0.28;
      currentH += (targetH - currentH) * 0.28;
      
      ring.style.width = `${currentW}px`;
      ring.style.height = `${currentH}px`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      
      // Inherit the target's border radius for perfect encapsulation
      ring.style.borderRadius = window.getComputedStyle(hoveredEl).borderRadius;
    } else {
      // 2. Default state: Circular ring following cursor at 24px
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      let currentW = parseFloat(ring.style.width) || 24;
      let currentH = parseFloat(ring.style.height) || 24;
      
      currentW += (24 - currentW) * 0.25;
      currentH += (24 - currentH) * 0.25;
      
      ring.style.width = `${currentW}px`;
      ring.style.height = `${currentH}px`;
      ring.style.transform = `translate3d(${ringX - currentW / 2}px, ${ringY - currentH / 2}px, 0)`;
      ring.style.borderRadius = '50%';
    }
    
    requestAnimationFrame(render);
  }
  
  // Custom cursor listeners
  const interactives = document.querySelectorAll('a, button, .filter-btn, .details-btn, .chip, .tag');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      hoveredEl = el;
      hoverRect = el.getBoundingClientRect();
      ring.classList.add('hover');
      dot.classList.add('hover');
    });
    
    el.addEventListener('mousemove', () => {
      // Re-evaluate coordinates on mousemove to maintain sync
      if (hoveredEl) {
        hoverRect = hoveredEl.getBoundingClientRect();
      }
    });
    
    el.addEventListener('mouseleave', () => {
      hoveredEl = null;
      hoverRect = null;
      ring.classList.remove('hover');
      dot.classList.remove('hover');
    });
  });
  
  render();
}

/* ==========================================================================
   3D PARALLAX TILT EFFECT & REFLECTION SHINE
   ========================================================================== */
function initTiltEffect() {
  // Select cards that should receive tilt mechanics
  const elements = document.querySelectorAll('.project-card, .skill-group, .edu-card, .cert-card, .metric-card');
  
  elements.forEach(card => {
    // Dynamic injection of sheen layer (keeps HTML 100% untouched)
    let shine = card.querySelector('.card-shine');
    if (!shine) {
      shine = document.createElement('div');
      shine.className = 'card-shine';
      card.style.position = 'relative';
      card.style.overflow = 'hidden';
      card.appendChild(shine);
    }
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Compute tilt angles (max 6deg for premium feel)
      const rotateX = ((centerY - y) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      
      // Direct spotlight shine to coordinate
      const shineX = (x / rect.width) * 100;
      const shineY = (y / rect.height) * 100;
      shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(99, 102, 241, 0.12) 0%, transparent 65%)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      shine.style.background = 'transparent';
    });
  });
}

/* ==========================================================================
   DECRYPT TEXT SCRAMBLE DECODER
   ========================================================================== */
function initTextScramble() {
  const chars = '010101XYZ_<>{}[]+-$#@!*';
  
  class Scrambler {
    constructor(el) {
      this.el = el;
      this.originalText = el.textContent.trim();
      this.frame = 0;
      this.queue = [];
    }
    
    resolve() {
      this.queue = [];
      for (let i = 0; i < this.originalText.length; i++) {
        const char = this.originalText[i];
        if (char === ' ') {
          this.queue.push({ from: ' ', to: ' ', start: 0, end: 0 });
        } else {
          const start = Math.floor(Math.random() * 10);
          const end = start + Math.floor(Math.random() * 12) + 4;
          this.queue.push({ from: char, to: char, start, end, char: '' });
        }
      }
      this.frame = 0;
      this.update();
    }
    
    update() {
      let output = '';
      let complete = 0;
      
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)];
            this.queue[i].char = char;
          }
          output += `<span class="scramble-char">${char}</span>`;
        } else {
          output += from;
        }
      }
      
      this.el.innerHTML = output;
      
      if (complete < this.queue.length) {
        this.frame++;
        requestAnimationFrame(() => this.update());
      } else {
        this.el.textContent = this.originalText;
      }
    }
  }
  
  // Attach Scrambler to all major headers and section titles
  const targetElements = document.querySelectorAll('.section-title, .gradient-text');
  
  targetElements.forEach(el => {
    const scrambler = new Scrambler(el);
    // Scramble on hover
    el.addEventListener('mouseenter', () => {
      // Don't restart if already running
      if (scrambler.frame === 0 || scrambler.frame >= scrambler.queue.reduce((acc, q) => Math.max(acc, q.end), 0)) {
        scrambler.resolve();
      }
    });
    // Trigger once on page load
    setTimeout(() => scrambler.resolve(), 800 + Math.random() * 500);
  });
}

/* ==========================================================================
   MAGNETIC ACTION BUTTONS ATTRACTION
   ========================================================================== */
function initMagneticButtons() {
  const elements = document.querySelectorAll('.cta-primary, .cta-secondary, .mobile-resume-btn, .logo-link, .nav-desktop .nav-item');
  
  elements.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull element 30% of cursor position (fluid magnetic drag)
      btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
      btn.style.transition = 'none'; // Clear transitions for real-time physics tracking
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0, 0, 0)';
      btn.style.transition = 'transform var(--transition-normal) cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // bounce back
    });
  });
}

/* ==========================================================================
   PERSISTENT HIT & VISITOR COUNTER
   ========================================================================== */
function initVisitCounter() {
  const counterEl = document.getElementById('visitCounterVal');
  if (!counterEl) return;
  
  const localStorageKey = 'rupak_portfolio_local_visits_unique';
  const hasVisitedKey = 'rupak_portfolio_has_visited_device';
  const baseline = 100; // Starting baseline views
  
  // Get stored local unique count
  let localVisits = parseInt(localStorage.getItem(localStorageKey)) || 0;
  
  // Check if this device has already recorded a visit
  const hasVisited = localStorage.getItem(hasVisitedKey);
  
  if (!hasVisited) {
    // First time visit on this device: Increment and flag the browser
    localVisits++;
    localStorage.setItem(localStorageKey, localVisits);
    localStorage.setItem(hasVisitedKey, 'true');
  }
  
  // Calculate rendering count
  let totalVisits = baseline + localVisits;
  counterEl.textContent = totalVisits.toLocaleString();
  
  // Sync with global tracking endpoint asynchronously
  const namespace = 'rupakgupta_portfolio';
  const key = 'unique_visits';
  
  // If repeating visit: retrieve count only (/get). If new device: increment count (/hit)
  const apiAction = !hasVisited ? 'hit' : 'get';
  
  fetch(`https://api.countapi.xyz/${apiAction}/${namespace}/${key}`)
    .then(res => {
      if (!res.ok) throw new Error('API down/blocked');
      return res.json();
    })
    .then(data => {
      if (data && data.value) {
        const finalCount = baseline + data.value;
        counterEl.textContent = finalCount.toLocaleString();
      }
    })
    .catch(() => {
      // Fallback prints silently, maintaining the device-unique count locally
      console.log('CountAPI is offline. Using local device-unique views.');
    });
}

/* ==========================================================================
   TALKING AVATAR & VIDEO INTRO MODAL
   ========================================================================== */
function initVideoModal() {
  const modal = document.getElementById('introModal');
  const heroBtn = document.getElementById('heroPlayIntroBtn');
  const closeBtn = document.getElementById('closeIntroModal');
  const playBtn = document.getElementById('playIntroBtn');
  const playIcon = document.getElementById('playIcon');
  const playBtnText = document.getElementById('playBtnText');
  const muteBtn = document.getElementById('muteIntroBtn');
  const muteIcon = document.getElementById('muteIcon');

  const video = document.getElementById('introVideo');
  const canvasAvatar = document.getElementById('canvasAvatarWrapper');
  const avatarCard = document.querySelector('.talking-avatar-card');

  if (!modal || !heroBtn) return;

  let isSpeaking = false;
  let isMuted = false;
  let synthUtterance = null;

  const introScript = "Hello and welcome! I'm Rupak Gupta, an Enterprise Full Stack Developer with over 7 years of experience engineering production software across construction, HVAC, e-commerce, and HR tech. I specialize in Laravel, React, Next.js, and Vue.js, reducing API latency by 30 to 40 percent, and integrating payment gateways like Stripe, Razorpay, and Authorize.Net. I am available on a 15-day notice period. Feel free to explore my key projects and technical skills!";

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Test if custom MP4 video file exists and can play
    if (video && video.querySelector('source').src) {
      video.load();
      video.play().then(() => {
        video.style.display = 'block';
        if (canvasAvatar) canvasAvatar.style.display = 'none';
        if (playIcon) playIcon.className = 'fa-solid fa-pause';
        if (playBtnText) playBtnText.textContent = 'Pause Video';
      }).catch(() => {
        // Fall back to Web Speech AI Avatar mode
        video.style.display = 'none';
        if (canvasAvatar) canvasAvatar.style.display = 'flex';
        if (playIcon) playIcon.className = 'fa-solid fa-play';
        if (playBtnText) playBtnText.textContent = 'Start AI Speech';
      });
    } else {
      video.style.display = 'none';
      if (canvasAvatar) canvasAvatar.style.display = 'flex';
      if (playIcon) playIcon.className = 'fa-solid fa-play';
      if (playBtnText) playBtnText.textContent = 'Start AI Speech';
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    if (avatarCard) avatarCard.classList.remove('speaking');
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    if (playBtnText) playBtnText.textContent = 'Start AI Speech';
  }

  heroBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (video.style.display !== 'none' && video.src) {
        if (video.paused) {
          video.play();
          if (playIcon) playIcon.className = 'fa-solid fa-pause';
          if (playBtnText) playBtnText.textContent = 'Pause Video';
        } else {
          video.pause();
          if (playIcon) playIcon.className = 'fa-solid fa-play';
          if (playBtnText) playBtnText.textContent = 'Play Video';
        }
      } else {
        if ('speechSynthesis' in window) {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            if (avatarCard) avatarCard.classList.remove('speaking');
            if (playIcon) playIcon.className = 'fa-solid fa-play';
            if (playBtnText) playBtnText.textContent = 'Start AI Speech';
          } else {
            synthUtterance = new SpeechSynthesisUtterance(introScript);
            synthUtterance.rate = 0.95;
            synthUtterance.pitch = 1.0;
            synthUtterance.volume = isMuted ? 0 : 1;

            synthUtterance.onstart = () => {
              isSpeaking = true;
              if (avatarCard) avatarCard.classList.add('speaking');
              if (playIcon) playIcon.className = 'fa-solid fa-stop';
              if (playBtnText) playBtnText.textContent = 'Stop Speech';
            };

            synthUtterance.onend = () => {
              isSpeaking = false;
              if (avatarCard) avatarCard.classList.remove('speaking');
              if (playIcon) playIcon.className = 'fa-solid fa-play';
              if (playBtnText) playBtnText.textContent = 'Replay AI Speech';
            };

            synthUtterance.onerror = () => {
              isSpeaking = false;
              if (avatarCard) avatarCard.classList.remove('speaking');
              if (playIcon) playIcon.className = 'fa-solid fa-play';
              if (playBtnText) playBtnText.textContent = 'Start AI Speech';
            };

            window.speechSynthesis.speak(synthUtterance);
          }
        }
      }
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      video.muted = isMuted;
      if (muteIcon) muteIcon.className = isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';

      if (window.speechSynthesis && window.speechSynthesis.speaking && synthUtterance) {
        window.speechSynthesis.cancel();
        if (!isMuted) {
          window.speechSynthesis.speak(synthUtterance);
        }
      }
    });
  }
}

/* ==========================================================================
   CONTACT US INQUIRY FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactInquiryForm');
  const alertBox = document.getElementById('formFeedbackAlert');
  const submitBtn = document.getElementById('submitInquiryBtn');

  if (!form) return;

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const phoneInput = document.getElementById('senderPhone');
    const typeInput = document.getElementById('inquiryType');
    const messageInput = document.getElementById('senderMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const type = typeInput ? typeInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Required fields check (Name, Email, Inquiry Type, Message)
    if (!name || !email || !type || !message) {
      if (alertBox) {
        alertBox.className = 'form-feedback-alert error';
        alertBox.textContent = 'Please fill out all required fields: Name, Email, Inquiry Type, and Message.';
        alertBox.style.display = 'block';
      }
      return;
    }

    // Strict Email Format Validation
    const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      if (alertBox) {
        alertBox.className = 'form-feedback-alert error';
        alertBox.textContent = 'Please enter a valid email address (e.g. name@company.com).';
        alertBox.style.display = 'block';
      }
      if (emailInput) emailInput.focus();
      return;
    }

    // Phone format validation if provided
    if (phone && !/^[\d\s\+\-\(\)\.]{7,25}$/.test(phone)) {
      if (alertBox) {
        alertBox.className = 'form-feedback-alert error';
        alertBox.textContent = 'Please enter a valid phone number (or leave it blank).';
        alertBox.style.display = 'block';
      }
      if (phoneInput) phoneInput.focus();
      return;
    }

    // Disable button & show sending state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Directly...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    }

    if (alertBox) {
      alertBox.className = 'form-feedback-alert info';
      alertBox.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending your inquiry directly to Rupak Gupta...';
      alertBox.style.display = 'block';
    }

    // Direct background transmission payload
    const directPayload = {
      name: name,
      email: email,
      phone: phone ? phone : 'Not provided',
      inquiry_type: type,
      message: message,
      _subject: `[Portfolio Inquiry] ${type} - ${name}`,
      _template: 'table',
      _captcha: 'false'
    };

    // Attempt direct background transmission
    fetch('https://formsubmit.co/ajax/rupakgupta265@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(directPayload)
    })
    .then(res => {
      if (!res.ok) throw new Error('Direct service response was not ok');
      return res.json();
    })
    .then(data => {
      if (data.success === 'true' || data.success === true) {
        if (alertBox) {
          alertBox.className = 'form-feedback-alert success';
          alertBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Message sent successfully!</strong> Your inquiry has been delivered directly to Rupak Gupta. He will review your message and reply to <code>${escapeHtml(email)}</code> soon.`;
        }
        if (submitBtn) {
          submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-circle-check"></i>';
        }
        form.reset();
      } else {
        throw new Error(data.message || 'Direct delivery incomplete');
      }
    })
    .catch(err => {
      // Fallback: If running on file:/// protocol or offline, open mailto directly
      console.warn('Direct delivery fell back to mail client:', err);
      
      const emailSubject = encodeURIComponent(`[Portfolio Inquiry] ${type} - ${name}`);
      const emailBody = encodeURIComponent(
        `Hello Rupak,\n\nI am contacting you from your portfolio website.\n\n` +
        `--- Inquiry Details ---\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone ? phone : 'Not provided'}\n` +
        `Inquiry Type: ${type}\n\n` +
        `--- Message / Project Scope ---\n` +
        `${message}\n\n` +
        `Best regards,\n${name}`
      );

      const mailtoUrl = `mailto:rupakgupta265@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      if (alertBox) {
        alertBox.className = 'form-feedback-alert success';
        alertBox.innerHTML = `<strong>Inquiry drafted!</strong> Opening your email client to send directly to <code>rupakgupta265@gmail.com</code>...`;
      }

      window.location.href = mailtoUrl;

      if (submitBtn) {
        submitBtn.innerHTML = '<span>Inquiry Prepared!</span> <i class="fa-solid fa-circle-check"></i>';
      }
      form.reset();
    })
    .finally(() => {
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Send Inquiry</span> <i class="fa-solid fa-paper-plane"></i>';
        }
      }, 4500);
    });
  });
}




