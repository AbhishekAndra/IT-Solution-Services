/**
 * STACKLY ENTERPRISE SYSTEMS - AUTHENTICATION & PORTAL TELEMETRY
 * Features: Route Guards, Simulated JWT Session, Corporate Domain Validation,
 * Password Entropy Meter, Accessible Modals, Dashboard Table Filtering,
 * Consultation Drawer Engine.
 */

document.addEventListener('DOMContentLoaded', () => {
  checkAuthGuards();
  initLoginForm();
  initSignupForm();
  initTermsModal();
  initDashboardPortal();
});

/* ==========================================================================
   1. Route Guards & Session Helpers
   ========================================================================== */
const AUTH_STORAGE_KEY = 'stackly_session_token';
const USER_STORAGE_KEY = 'stackly_user_profile';

function getSessionUser() {
  const token = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
  if (!token) return null;
  try {
    const rawUser = sessionStorage.getItem(USER_STORAGE_KEY) || localStorage.getItem(USER_STORAGE_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (e) {
    return null;
  }
}

function setSessionUser(user, remember = false) {
  const token = `eyJhbGciOiJNRzI2Iiwic3ViIjoiZXhwZXJ0In0.${btoa(user.email)}.${Date.now()}`;
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(AUTH_STORAGE_KEY, token);
  storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

function clearSessionUser() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

function checkAuthGuards() {
  const path = window.location.pathname.toLowerCase();
  const isDashboard = path.includes('dashboard.html');
  const isLogin = path.includes('login.html');
  const isSignup = path.includes('signup.html');
  const user = getSessionUser();

  if (isDashboard && !user) {
    window.location.href = 'login.html?redirect=dashboard.html';
    return;
  }

  if ((isLogin || isSignup) && user) {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || 'dashboard.html';
    window.location.href = redirect;
    return;
  }
}

/* ==========================================================================
   2. Login Form Handling (login.html)
   ========================================================================== */
function initLoginForm() {
  const form = document.getElementById('client-login-form');
  if (!form) return;

  const emailInput = form.querySelector('#login-email');
  const passwordInput = form.querySelector('#login-password');
  const rememberCheckbox = form.querySelector('#remember-me');
  const togglePassBtn = form.querySelector('#toggle-login-pass');
  const ssoButtons = document.querySelectorAll('button.btn-sso');

  if (togglePassBtn) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }

  ssoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-provider') || 'Enterprise SSO';
      btn.disabled = true;
      btn.innerHTML = `<span style="font-size:0.8rem">Authenticating via ${provider}...</span>`;

      setTimeout(() => {
        const mockSsoUser = {
          name: 'Elena Vance',
          email: 'e.vance@apex-global.com',
          role: 'Chief Technology Officer',
          org: 'Apex Financial Technologies',
          avatar: 'assets/real-avatar-elena.webp'
        };
        setSessionUser(mockSsoUser, true);
        window.location.href = 'dashboard.html';
      }, 900);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value;

    const emailGroup = emailInput.closest('.form-group');
    const passGroup = passwordInput.closest('.form-group');

    if (!emailVal.includes('@') || !emailVal.includes('.')) {
      emailGroup.classList.add('has-error');
      valid = false;
    } else {
      emailGroup.classList.remove('has-error');
    }

    if (passVal.length < 6) {
      passGroup.classList.add('has-error');
      valid = false;
    } else {
      passGroup.classList.remove('has-error');
    }

    if (valid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite;margin-right:8px;vertical-align:middle;"></span>
        <span>Signing In to Portal...</span>
      `;

      setTimeout(() => {
        const parts = emailVal.split('@');
        const userDomain = parts[1].split('.')[0];
        const formattedOrg = userDomain.charAt(0).toUpperCase() + userDomain.slice(1) + ' Systems';
        const formattedName = parts[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());

        const loggedUser = {
          name: formattedName || 'Enterprise Partner',
          email: emailVal,
          role: 'Principal Partner',
          org: formattedOrg,
          avatar: 'assets/avatar-2.webp'
        };

        setSessionUser(loggedUser, rememberCheckbox ? rememberCheckbox.checked : false);

        const params = new URLSearchParams(window.location.search);
        const target = params.get('redirect') || 'dashboard.html';
        window.location.href = target;
      }, 1000);
    }
  });
}

/* ==========================================================================
   3. Signup Form Handling & Domain Validation (signup.html)
   ========================================================================== */
function initSignupForm() {
  const form = document.getElementById('client-signup-form');
  if (!form) return;

  const nameInput = form.querySelector('#signup-name');
  const emailInput = form.querySelector('#signup-email');
  const passwordInput = form.querySelector('#signup-password');
  const roleSelect = form.querySelector('#signup-role');
  const termsCheckbox = form.querySelector('#signup-terms');
  const togglePassBtn = form.querySelector('#toggle-signup-pass');
  const meterBars = form.querySelector('.meter-bars');
  const meterLabel = form.querySelector('#meter-status-text');

  const PUBLIC_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];

  if (togglePassBtn) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }

  if (passwordInput && meterBars && meterLabel) {
    passwordInput.addEventListener('input', () => {
      const pass = passwordInput.value;
      let score = 0;
      if (pass.length >= 8) score++;
      if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
      if (/[0-9]/.test(pass)) score++;
      if (/[^A-Za-z0-9]/.test(pass)) score++;

      meterBars.className = 'meter-bars';
      if (pass.length > 0) meterBars.classList.add(`strength-${score || 1}`);

      const statusMap = [
        'Awaiting input',
        'Weak — add numbers/symbols',
        'Fair — add special characters',
        'Strong — good entropy',
        'Enterprise Grade — cryptographic resilience'
      ];
      meterLabel.textContent = pass.length === 0 ? 'Entropy: None' : statusMap[score];
    });
  }

  function checkWorkEmail(email) {
    if (!email.includes('@') || !email.includes('.')) return { valid: false, msg: 'Please enter a valid email address.' };
    const domain = email.split('@')[1].toLowerCase();
    if (PUBLIC_DOMAINS.includes(domain)) {
      return { 
        valid: false, 
        msg: 'Please use your corporate work domain (e.g., @company.com). Free personal email providers are restricted.' 
      };
    }
    return { valid: true, domain };
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    const nameGroup = nameInput.closest('.form-group');
    if (nameInput.value.trim().length < 2) {
      nameGroup.classList.add('has-error');
      valid = false;
    } else {
      nameGroup.classList.remove('has-error');
    }

    const emailGroup = emailInput.closest('.form-group');
    const emailResult = checkWorkEmail(emailInput.value.trim());
    const emailErrorEl = emailGroup.querySelector('.field-error-msg');
    if (!emailResult.valid) {
      emailGroup.classList.add('has-error');
      if (emailErrorEl) emailErrorEl.textContent = emailResult.msg;
      valid = false;
    } else {
      emailGroup.classList.remove('has-error');
    }

    const passGroup = passwordInput.closest('.form-group');
    if (passwordInput.value.length < 8) {
      passGroup.classList.add('has-error');
      valid = false;
    } else {
      passGroup.classList.remove('has-error');
    }

    const roleGroup = roleSelect.closest('.form-group');
    if (roleSelect.value === '') {
      roleGroup.classList.add('has-error');
      valid = false;
    } else {
      roleGroup.classList.remove('has-error');
    }

    if (!termsCheckbox.checked) {
      if (window.showToast) {
        window.showToast('Terms Required', 'Please accept the Stackly Master Services Agreement to proceed.', 'error');
      }
      valid = false;
    }

    if (valid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Provisioning Stackly Client Tenant...';

      setTimeout(() => {
        const domainName = emailResult.domain.split('.')[0];
        const orgTitle = domainName.charAt(0).toUpperCase() + domainName.slice(1) + ' Systems';

        const newUser = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          role: roleSelect.value,
          org: orgTitle,
          avatar: 'assets/real-avatar-sophia.webp'
        };

        setSessionUser(newUser, true);
        window.location.href = 'dashboard.html';
      }, 1200);
    }
  });
}

/* ==========================================================================
   4. Accessible Terms of Service Modal
   ========================================================================== */
function initTermsModal() {
  const modalBackdrop = document.getElementById('terms-modal');
  const openTriggers = document.querySelectorAll('.open-terms-trigger');
  const closeBtns = document.querySelectorAll('.close-terms-btn');
  const acceptBtn = document.getElementById('accept-terms-btn');
  const termsCheckbox = document.getElementById('signup-terms');

  if (!modalBackdrop) return;

  let previousActiveElement = null;

  const openModal = (e) => {
    if (e) e.preventDefault();
    previousActiveElement = document.activeElement;
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const focusable = modalBackdrop.querySelectorAll('button, [href], input, select, textarea');
    if (focusable.length) focusable[0].focus();
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previousActiveElement) previousActiveElement.focus();
  };

  openTriggers.forEach(t => t.addEventListener('click', openModal));
  closeBtns.forEach(b => b.addEventListener('click', closeModal));

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      if (termsCheckbox) termsCheckbox.checked = true;
      closeModal();
      if (window.showToast) {
        window.showToast('MSA Acknowledged', 'Stackly Master Services Agreement verified.', 'success');
      }
    });
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  modalBackdrop.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = modalBackdrop.querySelectorAll('button:not([disabled]), [href], input, select, textarea');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });
}

/* ==========================================================================
   5. Dashboard Portal Telemetry & Interactivity (dashboard.html)
   ========================================================================== */
const DELIVERABLES_DATA = [
  {
    code: 'DEL-9201',
    name: 'Multi-Region Kubernetes Ingress Mesh (v1.32)',
    phase: 'Phase 3: Service Fabric',
    status: 'signed-off',
    statusLabel: 'Signed Off',
    lead: 'Dr. Aris Thorne',
    date: 'Oct 28, 2026',
    artifact: 'Stackly_MultiRegion_Arch_v3.pdf'
  },
  {
    code: 'DEL-9202',
    name: 'Zero-Trust SPIFFE/SPIRE Workload Attestation',
    phase: 'Phase 2: Security Enclave',
    status: 'signed-off',
    statusLabel: 'Signed Off',
    lead: 'Marcus Brody',
    date: 'Nov 02, 2026',
    artifact: 'Stackly_ZeroTrust_Workload_Specs.pdf'
  },
  {
    code: 'DEL-9203',
    name: 'Private vLLM & Agentic MCP Vector Memory Pipeline',
    phase: 'Phase 4: Agentic Systems',
    status: 'in-progress',
    statusLabel: 'In Progress (82%)',
    lead: 'Dr. Sophia Chen',
    date: 'Est. Nov 12, 2026',
    artifact: 'Agentic_Memory_Quantization_Report.pdf'
  },
  {
    code: 'DEL-9204',
    name: 'FinOps Cloud Spend & Cost Drift Guardrails',
    phase: 'Phase 3: Optimization',
    status: 'signed-off',
    statusLabel: 'Signed Off',
    lead: 'Dr. Aris Thorne',
    date: 'Oct 22, 2026',
    artifact: 'Stackly_FinOps_Policies.tf'
  },
  {
    code: 'DEL-9205',
    name: 'Chaos Engineering & Disaster Recovery Runbooks',
    phase: 'Phase 5: Resiliency',
    status: 'pending-review',
    statusLabel: 'Pending Review',
    lead: 'Elena Vance',
    date: 'Est. Nov 18, 2026',
    artifact: 'Chaos_Testing_Audit_Matrix.pdf'
  }
];

function initDashboardPortal() {
  const dashContainer = document.querySelector('.dashboard-layout');
  if (!dashContainer) return;

  const user = getSessionUser() || {
    name: 'Marcus Brody',
    email: 'm.brody@biohealth.corp',
    role: 'VP of Platform Engineering',
    org: 'BioHealth Global',
    avatar: 'assets/avatar-2.webp'
  };

  const userNameEl = document.getElementById('dash-user-name');
  const userOrgEl = document.getElementById('dash-user-org');
  const userAvatarEl = document.getElementById('dash-user-avatar');

  if (userNameEl) userNameEl.textContent = user.name;
  if (userOrgEl) userOrgEl.textContent = user.org;
  if (userAvatarEl && user.avatar) userAvatarEl.src = user.avatar;

  const clockEl = document.getElementById('live-telemetry-clock');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      clockEl.textContent = `UTC ${now.toISOString().substring(11, 19)} | LATENCY: 8ms`;
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  const profileTrigger = document.querySelector('.profile-trigger');
  const profileDropdown = document.querySelector('.profile-dropdown');
  const logoutBtn = document.getElementById('logout-btn');

  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      profileDropdown.classList.remove('open');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearSessionUser();
      if (window.showToast) {
        window.showToast('Session Terminated', 'You have been safely signed out from Stackly Portal.', 'info');
      }
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
    });
  }

  const projectSwitcher = document.getElementById('engagement-switcher');
  const projectTitle = document.getElementById('active-project-title');
  if (projectSwitcher && projectTitle) {
    projectSwitcher.addEventListener('click', () => {
      const projects = [
        'Kubernetes Multi-Region Migration',
        'Private Agentic LLM & RAG Infrastructure',
        'FedRAMP & SOC2 Enclave Automation'
      ];
      const currentIdx = projects.indexOf(projectTitle.textContent);
      const nextIdx = (currentIdx + 1) % projects.length;
      projectTitle.textContent = projects[nextIdx];
      if (window.showToast) {
        window.showToast('Context Switched', `Active Engagement: ${projects[nextIdx]}`, 'info');
      }
    });
  }

  initDeliverablesTable();
  initConsultationDrawer();
}

function initDeliverablesTable() {
  const tbody = document.getElementById('deliverables-tbody');
  const filterChips = document.querySelectorAll('.table-filters .filter-chip');
  const searchInput = document.getElementById('table-search-input');

  if (!tbody) return;

  let currentFilter = 'all';
  let searchQuery = '';

  function renderTable() {
    tbody.innerHTML = '';
    const filtered = DELIVERABLES_DATA.filter(item => {
      const matchesFilter = (currentFilter === 'all') || (item.status === currentFilter);
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery) ||
        item.code.toLowerCase().includes(searchQuery) ||
        item.phase.toLowerCase().includes(searchQuery);
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="5" style="text-align:center;padding:2.5rem;color:var(--text-muted)">No deliverables found matching filter criteria.</td>`;
      tbody.appendChild(row);
      return;
    }

    filtered.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="deliverable-name">
            ${item.name}
            <span class="deliverable-code">${item.code} &bull; ${item.phase}</span>
          </div>
        </td>
        <td>
          <span class="status-badge ${item.status}">
            <span class="pulse-dot"></span>
            ${item.statusLabel}
          </span>
        </td>
        <td style="font-family:var(--font-mono);font-size:0.8rem">${item.lead}</td>
        <td style="font-family:var(--font-mono);font-size:0.8rem">${item.date}</td>
        <td>
          <button class="artifact-btn" data-file="${item.artifact}" aria-label="Download ${item.artifact}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Artifact (.pdf)
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.artifact-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const file = btn.getAttribute('data-file');
        if (window.showToast) {
          window.showToast('Artifact Decrypted', `Signed file ready: ${file}`, 'success');
        }
      });
    });
  }

  renderTable();

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-status') || 'all';
      renderTable();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderTable();
    });
  }
}

/* ==========================================================================
   6. Consultation Drawer Engine
   ========================================================================== */
function initConsultationDrawer() {
  const drawerBackdrop = document.getElementById('consult-drawer-backdrop');
  const triggerBtns = document.querySelectorAll('.open-consult-drawer-btn');
  const closeBtns = document.querySelectorAll('.close-consult-drawer-btn');
  const form = document.getElementById('consult-request-form');

  if (!drawerBackdrop) return;

  const openDrawer = () => {
    drawerBackdrop.classList.add('open');
    drawerBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = drawerBackdrop.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();
  };

  const closeDrawer = () => {
    drawerBackdrop.classList.remove('open');
    drawerBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  triggerBtns.forEach(b => b.addEventListener('click', openDrawer));
  closeBtns.forEach(b => b.addEventListener('click', closeDrawer));

  drawerBackdrop.addEventListener('click', (e) => {
    if (e.target === drawerBackdrop) closeDrawer();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerBackdrop.classList.contains('open')) {
      closeDrawer();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const topicInput = form.querySelector('#ticket-topic');
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!topicInput || topicInput.value.trim().length < 5) {
        if (window.showToast) {
          window.showToast('Input Required', 'Please provide consultation details.', 'error');
        }
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Connecting to Stackly Principal Architect...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Dispatch Consultation Request';
        form.reset();
        closeDrawer();
        if (window.showToast) {
          window.showToast(
            'Architect Dispatched',
            'Dr. Aris Thorne has received your priority brief. SLA calendar invitation sent.',
            'success'
          );
        }
      }, 1000);
    });
  }
}
