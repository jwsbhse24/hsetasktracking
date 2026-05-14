/* ============================================================
   app.js — Core Application Logic
   OI/HSE Governance & Compliance Monitoring System
   ============================================================ */

'use strict';

// ── Auth Guard ──────────────────────────────────────────────
function requireAuth() {
  const user = localStorage.getItem('hse_current_user');
  if (!user) { window.location.href = 'login.html'; return null; }
  return JSON.parse(user);
}

function getCurrentUser() {
  const u = localStorage.getItem('hse_current_user');
  return u ? JSON.parse(u) : null;
}

function doLogout() {
  localStorage.removeItem('hse_current_user');
  window.location.href = 'login.html';
}

// ── Auto-flag overdue on ALL module records ───────────────────
// Runs on every page render — updates status in localStorage if past due date
function autoFlagModuleOverdue() {
  const moduleKeys = [
    { key: KEYS.issues,     dateField: 'dueDate',    skip: ['Closed','Overdue'] },
    { key: KEYS.capa,       dateField: 'dueDate',    skip: ['Closed','Overdue'] },
    { key: KEYS.shc,        dateField: 'dueDate',    skip: ['Closed','Overdue'] },
    { key: KEYS.compliance, dateField: 'expiryDate', skip: ['Valid','Overdue'] },
    { key: KEYS.training,   dateField: 'expiryDate', skip: ['Valid','Overdue'] },
  ];
  moduleKeys.forEach(({ key, dateField, skip }) => {
    const data    = getData(key);
    let   changed = false;
    data.forEach(r => {
      if (skip.includes(r.status)) return;
      if (!r[dateField]) return;
      if (daysDiff(r[dateField]) < 0) {
        // For training/compliance, use Expired instead of Overdue
        r.status  = (key === KEYS.training || key === KEYS.compliance) ? 'Expired' : 'Overdue';
        changed   = true;
      }
    });
    if (changed) saveData(key, data);
  });
}


// Role checks
function canEdit(user) {
  return user && (user.role === 'admin' || user.role === 'osh_coordinator');
}
function isAdmin(user) {
  return user && user.role === 'admin';
}
function isAGM(user) {
  return user && user.role === 'hse_agm';
}

// ── Data Layer ───────────────────────────────────────────────
const KEYS = {
  training:   'hse_training',
  issues:     'hse_issues',
  capa:       'hse_capa',
  compliance: 'hse_compliance',
  shc:        'hse_shc',
  users:      'hse_users'
};

// Seed data from JSON if not already in localStorage
async function seedData() {
  const already = localStorage.getItem('hse_seeded');
  if (already) return;

  // Always initialise empty arrays first so saves never fail
  const initEmpty = () => {
    if (!localStorage.getItem(KEYS.training))   saveData(KEYS.training,   []);
    if (!localStorage.getItem(KEYS.issues))     saveData(KEYS.issues,     []);
    if (!localStorage.getItem(KEYS.capa))       saveData(KEYS.capa,       []);
    if (!localStorage.getItem(KEYS.compliance)) saveData(KEYS.compliance, []);
    if (!localStorage.getItem(KEYS.shc))        saveData(KEYS.shc,        []);
    if (!localStorage.getItem(KEYS.users))      saveData(KEYS.users,      []);
  };
  initEmpty();

  // Try to load sample data (works on GitHub Pages / local server)
  try {
    const resp = await fetch('sample-data.json');
    if (!resp.ok) throw new Error('fetch failed');
    const data = await resp.json();
    localStorage.setItem(KEYS.training,   JSON.stringify(data.training));
    localStorage.setItem(KEYS.issues,     JSON.stringify(data.issues));
    localStorage.setItem(KEYS.capa,       JSON.stringify(data.capa));
    localStorage.setItem(KEYS.compliance, JSON.stringify(data.compliance));
    localStorage.setItem(KEYS.shc,        JSON.stringify(data.shc));
    localStorage.setItem(KEYS.users,      JSON.stringify(data.users));
    localStorage.setItem('hse_trend',     JSON.stringify(data.trendData));
    localStorage.setItem('hse_seeded', '1');
    console.info('Sample data loaded successfully.');
  } catch(e) {
    // On file:// or if JSON fetch fails — system still works, just starts empty
    localStorage.setItem('hse_seeded', '1');
    console.info('Sample data not loaded — system starts with empty records. You can add data manually.');
  }
}


function getData(key) {
  const d = localStorage.getItem(key);
  return d ? JSON.parse(d) : [];
}
function saveData(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}
function genId(prefix, arr) {
  const maxN = arr.reduce((m, r) => {
    const n = parseInt((r.id||'').replace(/\D/g,''),10)||0;
    return n > m ? n : m;
  }, 0);
  return `${prefix}-${String(maxN+1).padStart(3,'0')}`;
}

// ── Date Utilities ───────────────────────────────────────────
function today() { return new Date().toISOString().split('T')[0]; }

function daysDiff(dateStr) {
  const d = new Date(dateStr);
  const t = new Date();
  t.setHours(0,0,0,0);
  return Math.round((d - t) / 86400000);
}

function agingDays(dateStr) {
  // Days since reported (positive = past)
  const d = new Date(dateStr);
  const t = new Date();
  t.setHours(0,0,0,0);
  return Math.round((t - d) / 86400000);
}

function formatDate(d) {
  if (!d) return '—';
  const parts = d.split('-');
  if (parts.length !== 3) return d;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parts[2]} ${months[parseInt(parts[1],10)-1]} ${parts[0]}`;
}

function agingBadge(dueDateStr) {
  if (!dueDateStr) return '';
  const diff = daysDiff(dueDateStr);
  if (diff >= 0) return `<span class="aging-badge aging-ok">On-time</span>`;
  const over = Math.abs(diff);
  if (over <= 7)  return `<span class="aging-badge aging-warn">${over}d overdue</span>`;
  if (over <= 14) return `<span class="aging-badge aging-warn">${over}d overdue</span>`;
  return `<span class="aging-badge aging-over">${over}d overdue</span>`;
}

function statusBadge(status) {
  const map = {
    'Valid':               'badge-valid',
    'Closed':              'badge-closed',
    'Completed':           'badge-completed',
    'Expiring Soon':       'badge-expiring',
    'In Progress':         'badge-in-progress',
    'Pending Verification':'badge-pending',
    'Open':                'badge-open',
    'Expired':             'badge-expired',
    'Overdue':             'badge-overdue',
    'Critical':            'badge-critical',
  };
  const cls = map[status] || 'badge-open';
  return `<span class="badge-status ${cls}">${escHtml(status)}</span>`;
}

function riskBadge(level) {
  const map = { Critical:'badge-critical', High:'badge-high', Medium:'badge-medium', Low:'badge-low' };
  const cls = map[level] || 'badge-open';
  return `<span class="badge-status ${cls}">${escHtml(level)}</span>`;
}

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── KPI Calculators ──────────────────────────────────────────
function calcKPIs() {
  const training   = getData(KEYS.training);
  const issues     = getData(KEYS.issues);
  const capa       = getData(KEYS.capa);
  const compliance = getData(KEYS.compliance);
  const shc        = getData(KEYS.shc);

  // Total open actions (issues + capa + shc not closed)
  const openIssues  = issues.filter(r => r.status !== 'Closed').length;
  const openCapa    = capa.filter(r => r.status !== 'Closed').length;
  const openShc     = shc.filter(r => r.status !== 'Closed').length;
  const totalOpen   = openIssues + openCapa + openShc;

  // Overdue
  const overdueIssues = issues.filter(r => r.status === 'Overdue').length;
  const overdueCapa   = capa.filter(r => r.status === 'Overdue').length;
  const overdueShc    = shc.filter(r => r.status === 'Overdue').length;
  const totalOverdue  = overdueIssues + overdueCapa + overdueShc;

  // CAPA closure %
  const capaClosed = capa.filter(r => r.status === 'Closed').length;
  const capaTotal  = capa.length || 1;
  const capaPct    = Math.round((capaClosed/capaTotal)*100);

  // Training compliance %
  const trValid = training.filter(r => r.status === 'Valid').length;
  const trTotal = training.length || 1;
  const trPct   = Math.round((trValid/trTotal)*100);

  // Compliance alerts (expiring + expired)
  const cmpAlerts = compliance.filter(r => r.status === 'Expiring Soon' || r.status === 'Expired').length;

  // Critical unresolved
  const critIssues = issues.filter(r => r.riskLevel === 'Critical' && r.status !== 'Closed').length;
  const critCapa   = capa.filter(r => r.status === 'Overdue').length;
  const totalCrit  = critIssues + critCapa;

  // SHC outstanding
  const shcOut = shc.filter(r => r.status !== 'Closed').length;

  // Upcoming expiry (compliance within 30d)
  const upcoming = compliance.filter(r => {
    const d = daysDiff(r.expiryDate);
    return d >= 0 && d <= 30;
  }).length;

  return { totalOpen, totalOverdue, capaPct, trPct, cmpAlerts, totalCrit, shcOut, upcoming,
           openIssues, openCapa, openShc, overdueIssues, overdueCapa, overdueShc,
           capaClosed, capaTotal, trValid, trTotal };
}

// ── Alert Generator ──────────────────────────────────────────
function generateAlerts() {
  const alerts = [];
  const compliance = getData(KEYS.compliance);
  const training   = getData(KEYS.training);
  const capa       = getData(KEYS.capa);
  const issues     = getData(KEYS.issues);
  const shc        = getData(KEYS.shc);

  compliance.filter(r => r.status === 'Expired').forEach(r =>
    alerts.push({ type:'critical', icon:'fa-triangle-exclamation', title:`Compliance Expired: ${r.item}`, desc:`Ref: ${r.referenceNo} — PIC: ${r.pic}`, time:'Compliance' }));
  
  compliance.filter(r => r.status === 'Expiring Soon').forEach(r =>
    alerts.push({ type:'warning', icon:'fa-clock', title:`Expiring Soon: ${r.item}`, desc:`Expiry: ${formatDate(r.expiryDate)} — PIC: ${r.pic}`, time:'Compliance' }));

  training.filter(r => r.status === 'Expired').forEach(r =>
    alerts.push({ type:'critical', icon:'fa-user-xmark', title:`Expired Training: ${r.employeeName}`, desc:`${r.trainingName} — Expired ${formatDate(r.expiryDate)}`, time:'Training' }));

  training.filter(r => r.status === 'Expiring Soon').forEach(r =>
    alerts.push({ type:'warning', icon:'fa-user-clock', title:`Training Expiring: ${r.employeeName}`, desc:`${r.trainingName} — Expires ${formatDate(r.expiryDate)}`, time:'Training' }));

  capa.filter(r => r.status === 'Overdue').forEach(r =>
    alerts.push({ type:'critical', icon:'fa-circle-exclamation', title:`CAPA Overdue: ${r.id}`, desc:`${r.description.substring(0,60)}… — PIC: ${r.pic}`, time:'CAPA' }));

  issues.filter(r => r.status === 'Overdue').forEach(r =>
    alerts.push({ type:'critical', icon:'fa-fire', title:`Issue Overdue: ${r.id}`, desc:`${r.description.substring(0,60)}… — ${r.location}`, time:'Issues' }));

  issues.filter(r => r.riskLevel === 'Critical' && r.status !== 'Closed').forEach(r =>
    alerts.push({ type:'critical', icon:'fa-skull-crossbones', title:`Critical Risk Unresolved: ${r.id}`, desc:`${r.description.substring(0,60)}… — ${r.location}`, time:'Issues' }));

  shc.filter(r => r.status === 'Overdue').forEach(r =>
    alerts.push({ type:'warning', icon:'fa-people-group', title:`SHC Action Overdue: ${r.id}`, desc:`${r.actionRequired.substring(0,60)}… — PIC: ${r.pic}`, time:'SHC' }));

  return alerts;
}

// ── Toast ────────────────────────────────────────────────────
function showToast(msg, type='success') {
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
  const container = document.getElementById('toast-container') || (() => {
    const d = document.createElement('div');
    d.id = 'toast-container';
    d.className = 'toast-container';
    document.body.appendChild(d);
    return d;
  })();
  const toast = document.createElement('div');
  toast.className = `toast-msg toast-${type}`;
  toast.innerHTML = `<span>${icon}</span><span>${escHtml(msg)}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ── Navigation ───────────────────────────────────────────────
let currentPage = 'dashboard';

function navigate(page) {
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) { pageEl.classList.add('active'); currentPage = page; }

  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  const titles = {
    dashboard:  'Dashboard Overview',
    training:   'HSE Training Monitoring',
    issues:     'Safety Issues & Inspection',
    capa:       'CAPA & ISO Governance',
    compliance: 'Compliance & Legal Monitoring',
    shc:        'SHC Governance',
    reports:    'Reporting Management',
    cf:         'CF Status Tracker — KKIP WBF'
  };
  const el = document.getElementById('topbar-title');
  if (el) el.textContent = titles[page] || page;

  if (page === 'dashboard')  renderDashboard();
  if (page === 'training')   renderTraining();
  if (page === 'issues')     renderIssues();
  if (page === 'capa')       renderCapa();
  if (page === 'compliance') renderCompliance();
  if (page === 'shc')        renderShc();
  if (page === 'reports')    renderReports();
  if (page === 'cf' && typeof renderCFTracker === 'function') {
    renderCFTracker();
    if (typeof switchCFTab === 'function') switchCFTab('register');
  }

  if (window.innerWidth < 992) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
  }
}

// ── Sidebar Toggle ───────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('active');
}

// ── Notification Panel ───────────────────────────────────────
function toggleNotifPanel() {
  document.getElementById('notif-panel').classList.toggle('show');
}

function renderNotifPanel() {
  const alerts = generateAlerts();
  const list   = document.getElementById('notif-list');
  if (!list) return;
  const badge  = document.getElementById('notif-count');
  if (badge) badge.textContent = alerts.length;

  list.innerHTML = alerts.slice(0,10).map(a => `
    <div class="alert-item alert-${a.type}">
      <div class="alert-icon"><i class="fa-solid ${a.icon}"></i></div>
      <div>
        <div class="alert-title">${escHtml(a.title)}</div>
        <div class="alert-desc">${escHtml(a.desc)}</div>
        <div class="alert-time">${escHtml(a.time)}</div>
      </div>
    </div>`).join('') || '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:13px;">No active alerts</div>';
}

// ── Dark Mode ────────────────────────────────────────────────
function toggleDarkMode() {
  document.body.classList.toggle('light-mode');
  localStorage.setItem('hse_lightmode', document.body.classList.contains('light-mode') ? '1' : '0');
  const btn = document.getElementById('darkmode-btn');
  if (btn) btn.innerHTML = document.body.classList.contains('light-mode')
    ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
}

// ── Global Search ────────────────────────────────────────────
function doGlobalSearch(q) {
  if (!q || q.length < 2) return;
  q = q.toLowerCase();
  const results = [];
  getData(KEYS.issues).filter(r =>
    (r.id+r.description+r.location+r.pic).toLowerCase().includes(q))
    .forEach(r => results.push({ module:'Issues', id:r.id, text:r.description, page:'issues' }));
  getData(KEYS.capa).filter(r =>
    (r.id+r.description+r.pic).toLowerCase().includes(q))
    .forEach(r => results.push({ module:'CAPA', id:r.id, text:r.description, page:'capa' }));
  getData(KEYS.training).filter(r =>
    (r.employeeName+r.trainingName+r.department).toLowerCase().includes(q))
    .forEach(r => results.push({ module:'Training', id:r.id, text:`${r.employeeName} – ${r.trainingName}`, page:'training' }));
  getData(KEYS.compliance).filter(r =>
    (r.item+r.referenceNo+r.pic).toLowerCase().includes(q))
    .forEach(r => results.push({ module:'Compliance', id:r.id, text:r.item, page:'compliance' }));
  
  if (results.length) {
    showToast(`Found ${results.length} result(s). Navigate to the relevant module.`, 'success');
    if (results[0]) navigate(results[0].page);
  } else {
    showToast('No results found.', 'warn');
  }
}
