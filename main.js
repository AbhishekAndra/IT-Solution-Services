/**
 * STACKLY ENTERPRISE SYSTEMS - MAIN APPLICATION ENGINE
 * Features: Design System Theme Engine, Swiper Carousel Controller,
 * Video Walkthrough Modal, Ambient Video Player, Interactive Tools Matrix,
 * ROI Calculator, Contact RFP Validation, Scroll Animations, Global Toaster.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initStickyHeader();
  initMobileNavigation();
  initShowcaseFilter();
  initSwiperCarousels();
  initVideoPlayerModal();
  initAmbientVideoController();
  initCapabilitiesFilter();
  initRoiCalculator();
  initContactForm();
  initScrollAnimations();
  initServicesHeroSlider();
  initTechMatrixCanvas();
  initCaseSpotlightTabs();
});

/* ==========================================================================
   1. Theme Engine (Light / Dark Mode with Persistence)
   ========================================================================== */
function initThemeEngine() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('stackly_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('stackly_theme', newTheme);
      updateThemeIcons(newTheme);
      showToast('Theme Mode', `Switched interface mode to ${newTheme.toUpperCase()}`, 'info');
    });
  });
}

function updateThemeIcons(theme) {
  const sunIcons = document.querySelectorAll('.sun-icon');
  const moonIcons = document.querySelectorAll('.moon-icon');

  if (theme === 'light') {
    sunIcons.forEach(icon => icon.style.display = 'none');
    moonIcons.forEach(icon => icon.style.display = 'block');
  } else {
    sunIcons.forEach(icon => icon.style.display = 'block');
    moonIcons.forEach(icon => icon.style.display = 'none');
  }
}

/* ==========================================================================
   2. Sticky Header Behavior
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const closeDrawerBtn = document.querySelector('.close-drawer');
  const drawerLinks = document.querySelectorAll('.mobile-nav-drawer a');

  if (!mobileToggle || !navDrawer) return;

  const openDrawer = () => {
    navDrawer.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    navDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeDrawerBtn) closeDrawerBtn.focus();
  };

  const closeDrawer = () => {
    navDrawer.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    navDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    mobileToggle.focus();
  };

  mobileToggle.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);

  navDrawer.addEventListener('click', (e) => {
    if (e.target === navDrawer) closeDrawer();
  });

  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   4. Swiper Carousel Controller
   Touch swipe, keyboard arrows, navigation buttons, and pagination bullets.
   ========================================================================== */
function initSwiperCarousels() {
  const containers = document.querySelectorAll('.swiper-container-custom');

  containers.forEach(container => {
    const wrapper = container.querySelector('.swiper-wrapper');
    const slides = container.querySelectorAll('.swiper-slide');
    const prevBtn = container.querySelector('.swiper-btn-prev');
    const nextBtn = container.querySelector('.swiper-btn-next');
    const pagination = container.querySelector('.swiper-pagination-dots');

    if (!wrapper || slides.length === 0) return;

    const isCardSwiper = container.classList.contains('cards-carousel');
    let currentIndex = 0;
    let autoplayInterval = null;

    function getVisibleCount() {
      if (!isCardSwiper) return 1;
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      const visible = getVisibleCount();
      return Math.max(0, slides.length - visible);
    }

    function buildPagination() {
      if (!pagination) return;
      pagination.innerHTML = '';
      const totalDots = isCardSwiper ? getMaxIndex() + 1 : slides.length;
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = `swiper-dot ${i === currentIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        pagination.appendChild(dot);
      }
    }

    function updateSlidePosition() {
      if (isCardSwiper) {
        const firstSlide = slides[0];
        if (firstSlide) {
          const slideWidth = firstSlide.offsetWidth;
          const style = window.getComputedStyle(firstSlide);
          const marginRight = parseFloat(style.marginRight) || 0;
          const shift = currentIndex * (slideWidth + marginRight);
          wrapper.style.transform = `translateX(-${shift}px)`;
        }
      } else {
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
      wrapper.style.transition = 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)';

      if (pagination) {
        const dots = pagination.querySelectorAll('.swiper-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }
    }

    function goToSlide(index) {
      const max = isCardSwiper ? getMaxIndex() : slides.length - 1;
      if (index < 0) {
        currentIndex = max;
      } else if (index > max) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      updateSlidePosition();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); resetAutoplay(); });

    // Touch and swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    }, { passive: true });

    function handleGesture() {
      if (touchEndX < touchStartX - 40) {
        goToSlide(currentIndex + 1);
        resetAutoplay();
      }
      if (touchEndX > touchStartX + 40) {
        goToSlide(currentIndex - 1);
        resetAutoplay();
      }
    }

    // Autoplay feature
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 5500);
    }

    function resetAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        startAutoplay();
      }
    }

    buildPagination();
    updateSlidePosition();
    startAutoplay();
    container.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    container.addEventListener('mouseleave', () => startAutoplay());

    window.addEventListener('resize', () => {
      buildPagination();
      updateSlidePosition();
    });
  });
}

/* ==========================================================================
   5. Video Player Modal Controller
   ========================================================================== */
function initVideoPlayerModal() {
  const modal = document.getElementById('video-walkthrough-modal');
  const triggers = document.querySelectorAll('.open-video-modal-btn, .btn-video-highlight');
  const closeBtn = document.querySelector('.btn-close-video');
  const videoEl = document.getElementById('demo-video-player');
  const titleEl = document.getElementById('video-title');

  if (!modal || !videoEl) return;

  const openModal = (e) => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const targetTitle = e?.currentTarget?.getAttribute('data-video-title');
    if (targetTitle && titleEl) {
      titleEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;color:var(--brand-cyan);"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> ${targetTitle}`;
    }
    videoEl.currentTime = 0;
    videoEl.play().catch(() => {});
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    videoEl.pause();
  };

  triggers.forEach(t => t.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. Ambient Video Player Controller
   ========================================================================== */
function initAmbientVideoController() {
  const heroVideo = document.querySelector('.hero-video-bg');
  const toggleBtn = document.getElementById('toggle-hero-video');

  if (!heroVideo || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (heroVideo.paused) {
      heroVideo.play();
      toggleBtn.innerHTML = 'Pause Video Stream';
    } else {
      heroVideo.pause();
      toggleBtn.innerHTML = 'Resume Video Stream';
    }
  });
}

/* ==========================================================================
   7. Tech Stack & Latest Tools Matrix
   ========================================================================== */
const LATEST_TOOLS_DATA = [
  {
    name: 'Kubernetes v1.32',
    category: 'cloud',
    badge: 'v1.32 Distributed',
    desc: 'Dynamic Resource Allocation (DRA), dual-stack networking, and multi-cluster ingress orchestration.',
    benchmark: 'P99 Pod Startup: 1.2s'
  },
  {
    name: 'Cilium eBPF Mesh',
    category: 'cloud',
    badge: 'Wire-Speed Security',
    desc: 'Kernel-level service mesh eliminating sidecar proxy overhead with line-rate BPF encryption.',
    benchmark: 'Throughput: 40 Gbps/node'
  },
  {
    name: 'LangGraph & Agentic MCP',
    category: 'ai',
    badge: 'Agent Orchestration',
    desc: 'Cyclic graph agent state machines integrated with Model Context Protocol (MCP) tool security gates.',
    benchmark: 'State Convergence: 99.4%'
  },
  {
    name: 'vLLM & DeepSeek-R1',
    category: 'ai',
    badge: 'Quantized Inference',
    desc: 'PagedAttention high-throughput private LLM serving with zero data egress on private enterprise clusters.',
    benchmark: 'QPS: 480 tokens/s'
  },
  {
    name: 'ArgoCD & Declarative GitOps',
    category: 'devops',
    badge: 'Automated Canary',
    desc: 'Automated drift remediation, ephemeral PR preview staging, and Prometheus-backed canary analysis.',
    benchmark: 'Deploy Time: < 3.2m'
  },
  {
    name: 'OpenTofu & Crossplane',
    category: 'devops',
    badge: 'Universal IaC',
    desc: 'Open-source infrastructure as code with Kubernetes control plane custom resource definitions (CRDs).',
    benchmark: 'Drift Detect: < 45s'
  },
  {
    name: 'Falco eBPF Runtime Security',
    category: 'security',
    badge: 'Kernel Threat Detection',
    desc: 'Real-time Linux system call inspection detecting privilege escalation and container escape anomalies.',
    benchmark: 'Detection SLA: < 1.8ms'
  },
  {
    name: 'SPIFFE/SPIRE Enclave',
    category: 'security',
    badge: 'Zero-Trust mTLS',
    desc: 'Cryptographic workload attestation issuing short-lived X.509 SVIDs across multi-cloud environments.',
    benchmark: 'Workload SLA: FIPS 140-3'
  },
  {
    name: 'Apache Iceberg & ClickHouse',
    category: 'cloud',
    badge: 'Real-Time Lakehouse',
    desc: 'High-concurrency analytics over petabyte Parquet tables with ACID transactional snapshot isolation.',
    benchmark: 'Scan Speed: 12GB/s'
  }
];

function initCapabilitiesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const techGrid = document.querySelector('.latest-tools-grid');

  if (!techGrid) return;

  function renderTools(filter = 'all') {
    techGrid.innerHTML = '';
    const filtered = filter === 'all' 
      ? LATEST_TOOLS_DATA 
      : LATEST_TOOLS_DATA.filter(t => t.category === filter);

    filtered.forEach(tool => {
      const card = document.createElement('div');
      card.className = 'tool-card';
      card.innerHTML = `
        <div class="tool-header">
          <div class="tool-logo-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 22 7.5 22 16.5 12 22 2 16.5 2 7.5 12 2"/>
              <path d="M15.5 8.5h-5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5h-5"/>
            </svg>
          </div>
          <span class="tool-version-tag">${tool.badge}</span>
        </div>
        <div class="tool-body">
          <h4>${tool.name}</h4>
          <p>${tool.desc}</p>
        </div>
        <div class="tool-footer">
          <span>Benchmark Telemetry</span>
          <span class="benchmark-val">${tool.benchmark}</span>
        </div>
      `;
      techGrid.appendChild(card);
    });
  }

  renderTools('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter') || 'all';
      renderTools(cat);
    });
  });
}

/* ==========================================================================
   8. Interactive ROI Calculator
   ========================================================================== */
function initRoiCalculator() {
  const spendInput = document.getElementById('calc-spend');
  const teamInput = document.getElementById('calc-team');
  const debtBtns = document.querySelectorAll('.debt-btn');

  const spendValDisplay = document.getElementById('calc-spend-val');
  const teamValDisplay = document.getElementById('calc-team-val');

  const outputSavings = document.getElementById('out-savings');
  const outputTime = document.getElementById('out-time');
  const outputVelocity = document.getElementById('out-velocity');
  const outputRoi = document.getElementById('out-roi');

  if (!spendInput || !teamInput) return;

  let debtMultiplier = 1.6;

  function calculateResults() {
    const monthlySpend = parseInt(spendInput.value, 10);
    const teamSize = parseInt(teamInput.value, 10);

    spendValDisplay.textContent = `$${monthlySpend.toLocaleString()}/mo`;
    teamValDisplay.textContent = `${teamSize} engineers`;

    const annualSpend = monthlySpend * 12;
    const savingsRatio = 0.28 + (debtMultiplier * 0.05);
    const estSavings = Math.round(annualSpend * savingsRatio);
    const weeksSaved = Math.round(6 + (teamSize * 0.08) * (debtMultiplier * 0.7));
    const velocityGain = Math.min(94, Math.round(65 + (debtMultiplier * 10)));
    const roiMultiplier = (2.8 + (estSavings / 180000) * 0.6).toFixed(1);

    outputSavings.textContent = `$${estSavings.toLocaleString()}`;
    outputTime.textContent = `-${weeksSaved} Weeks`;
    outputVelocity.textContent = `+${velocityGain}%`;
    outputRoi.textContent = `${roiMultiplier}x Net`;
  }

  spendInput.addEventListener('input', calculateResults);
  teamInput.addEventListener('input', calculateResults);

  debtBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      debtBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      debtMultiplier = parseFloat(btn.getAttribute('data-debt') || '1.6');
      calculateResults();
    });
  });

  calculateResults();
}

/* ==========================================================================
   9. Lead Capture & RFP Form Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('lead-contact-form');
  if (!form) return;

  const nameInput = form.querySelector('#contact-name');
  const emailInput = form.querySelector('#contact-email');
  const orgInput = form.querySelector('#contact-org');
  const serviceSelect = form.querySelector('#contact-service');
  const messageInput = form.querySelector('#contact-message');
  const submitBtn = form.querySelector('button[type="submit"]');

  function validateField(input, condition, errorMsg) {
    const formGroup = input.closest('.form-group');
    const errorEl = formGroup.querySelector('.field-error-msg');
    if (!condition) {
      formGroup.classList.add('has-error');
      if (errorEl) errorEl.textContent = errorMsg;
      return false;
    } else {
      formGroup.classList.remove('has-error');
      return true;
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    if (!validateField(nameInput, nameInput.value.trim().length >= 2, 'Please enter your full name')) isValid = false;
    if (!validateField(emailInput, validateEmail(emailInput.value.trim()), 'Please enter a valid work email address')) isValid = false;
    if (!validateField(orgInput, orgInput.value.trim().length >= 2, 'Please enter your enterprise organization')) isValid = false;
    if (!validateField(serviceSelect, serviceSelect.value !== '', 'Please select an architectural domain')) isValid = false;
    if (!validateField(messageInput, messageInput.value.trim().length >= 10, 'Please describe your initiative (min 10 characters)')) isValid = false;

    if (isValid) {
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Transmitting RFP Brief to Stackly Architects...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        showToast('Brief Received', 'Your consultation request has been assigned to a Principal Architect. SLA response: < 4 hours.', 'success');
      }, 1200);
    }
  });
}

/* ==========================================================================
   10. Scroll Reveal Observer
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.bento-card, .case-card, .tool-card, .calculator-card, .metric-item');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 500ms ease, transform 500ms ease';
    observer.observe(el);
  });
}

/* ==========================================================================
   11. Global Toast Engine
   ========================================================================== */
function showToast(title, message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg = type === 'success' 
    ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`
    : type === 'error'
    ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   12. Showcase Categories Filter (Mockup Interactive Showcase)
   ========================================================================== */
function initShowcaseFilter() {
  const filterBtns = document.querySelectorAll('.cat-pill');
  const cards = document.querySelectorAll('.showcase-card');
  const swiperContainer = document.querySelector('.showcase-swiper');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = (btn.getAttribute('data-filter') || 'all').toLowerCase();

      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      let firstMatchIndex = -1;

      // Filter cards with smooth highlight
      cards.forEach((card, idx) => {
        const categories = (card.getAttribute('data-category') || '').toLowerCase();
        const matches = filter === 'all' || categories.includes(filter);

        if (matches) {
          if (firstMatchIndex === -1) firstMatchIndex = idx;
          card.classList.remove('is-hidden');
          card.style.opacity = '1';
          card.style.borderColor = filter === 'all' ? 'rgba(139, 92, 246, 0.22)' : 'rgba(56, 189, 248, 0.6)';
          card.style.boxShadow = filter === 'all' ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : '0 0 25px rgba(56, 189, 248, 0.35)';
        } else {
          card.style.opacity = '0.35';
          card.style.borderColor = 'rgba(255, 255, 255, 0.05)';
          card.style.boxShadow = 'none';
        }
      });

      // If swiper and matching slide found, jump to it
      if (swiperContainer && firstMatchIndex !== -1) {
        const dots = swiperContainer.querySelectorAll('.swiper-dot');
        if (dots && dots[firstMatchIndex]) {
          dots[firstMatchIndex].click();
        }
      }
    });
  });
}

/* ==========================================================================
   13. Services Hero Slider Carousel
   ========================================================================== */
function initServicesHeroSlider() {
  const slider = document.querySelector('.services-hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.services-slide');
  const dots = slider.querySelectorAll('.slider-dot-btn');
  const prevBtn = document.getElementById('services-slide-prev');
  const nextBtn = document.getElementById('services-slide-next');

  if (!slides.length) return;

  let currentIdx = 0;
  let autoTimer = null;

  function showSlide(idx) {
    if (idx < 0) idx = slides.length - 1;
    if (idx >= slides.length) idx = 0;
    currentIdx = idx;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIdx);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIdx);
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      showSlide(currentIdx + 1);
    }, 5500);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(currentIdx - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(currentIdx + 1); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-go-slide') || '0', 10);
      showSlide(targetIdx);
      startAuto();
    });
  });

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  startAuto();
}

/* ==========================================================================
   14. Tech Stack Matrix Canvas Network Animation
   ========================================================================== */
function initTechMatrixCanvas() {
  const canvas = document.getElementById('tech-matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
  let height = canvas.height = canvas.parentElement.offsetHeight || 500;

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  // Generate particle nodes
  const nodeCount = Math.min(Math.floor(width / 18), 50);
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      radius: Math.random() * 2 + 1.2,
      color: Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(129, 140, 248, '
    });
  }

  let mouse = { x: -1000, y: -1000 };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      // Mouse attraction
      const dxMouse = mouse.x - node.x;
      const dyMouse = mouse.y - node.y;
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      if (distMouse < 140) {
        node.x += (dxMouse / distMouse) * 0.45;
        node.y += (dyMouse / distMouse) * 0.45;
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color + '0.75)';
      ctx.fill();

      // Connect near nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeB = nodes[j];
        const dx = node.x - nodeB.x;
        const dy = node.y - nodeB.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.35;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   15. Case Studies Spotlight Interactive Tabs
   ========================================================================== */
function initCaseSpotlightTabs() {
  const tabBtns = document.querySelectorAll('.case-tab-btn');
  const card = document.getElementById('spotlight-card');
  if (!tabBtns.length || !card) return;

  const data = {
    fintech: {
      badge: 'Tier-1 Investment Banking',
      title: 'Global Core Ledger Modernization & Latency Reduction',
      desc: 'Migrated transactional core processing $60B daily to active-active Kafka & CockroachDB mesh across AWS regions with zero cutover downtime.',
      img: 'assets/portfolio-executive-presentation.webp',
      alt: 'FinTech Core Banking Cloud Migration Architecture',
      m1: '< 8ms',
      m1lbl: 'P99 Settlement',
      m2: '$14.2M',
      m2lbl: 'Cloud Saved / Yr',
      m3: '0 Sec',
      m3lbl: 'Cutover Downtime'
    },
    health: {
      badge: 'Healthcare • HIPAA & FHIR Compliant',
      title: 'Agentic Clinical Diagnosis Engine Across 18 Hospitals',
      desc: 'Engineered private DeepSeek-R1 inference clusters with LangGraph & Model Context Protocol. Delivered real-time clinical trial matching across 18 centers without patient data egress.',
      img: 'assets/real-ai-lab.webp',
      alt: 'MedTech HIPAA Agentic Diagnostic Platform',
      m1: '100%',
      m1lbl: 'HIPAA Isolation',
      m2: '7.4x',
      m2lbl: 'Trial Matching',
      m3: 'Zero',
      m3lbl: 'Patient Data Egress'
    },
    fleet: {
      badge: 'Automotive • Edge Stream Analytics',
      title: 'Autonomous Fleet: 4.8M Events/Sec Real-Time Lakehouse',
      desc: 'Deployed edge Kubernetes micro-nodes with ClickHouse lakehouse stream pipelines processing global autonomous vehicle sensor telemetry and braking data in sub-12 milliseconds.',
      img: 'assets/real-devops-team.webp',
      alt: 'Autonomous Fleet Edge Telemetry Platform',
      m1: '4.8M',
      m1lbl: 'Events / Sec',
      m2: '99.999%',
      m2lbl: 'Edge Ingress SLA',
      m3: '11.4 ms',
      m3lbl: 'Edge to Cloud P99'
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const caseKey = btn.getAttribute('data-case');
      if (!data[caseKey]) return;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const d = data[caseKey];
      const img = document.getElementById('spotlight-img');
      const badge = document.getElementById('spotlight-badge');
      const title = document.getElementById('spotlight-title');
      const desc = document.getElementById('spotlight-desc');
      const m1 = document.getElementById('spotlight-m1');
      const m1lbl = m1?.parentElement?.querySelector('.m-lbl');
      const m2 = document.getElementById('spotlight-m2');
      const m2lbl = m2?.parentElement?.querySelector('.m-lbl');
      const m3 = document.getElementById('spotlight-m3');
      const m3lbl = m3?.parentElement?.querySelector('.m-lbl');

      if (img) { img.src = d.img; img.alt = d.alt; }
      if (badge) { badge.textContent = d.badge; }
      if (title) { title.textContent = d.title; }
      if (desc) { desc.textContent = d.desc; }
      if (m1) { m1.textContent = d.m1; }
      if (m1lbl) { m1lbl.textContent = d.m1lbl; }
      if (m2) { m2.textContent = d.m2; }
      if (m2lbl) { m2lbl.textContent = d.m2lbl; }
      if (m3) { m3.textContent = d.m3; }
      if (m3lbl) { m3lbl.textContent = d.m3lbl; }

      // Smooth highlight pulse
      card.style.transform = 'scale(0.98)';
      setTimeout(() => { card.style.transform = 'scale(1)'; }, 150);
    });
  });
}

window.showToast = showToast;
