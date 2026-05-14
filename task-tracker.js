/* ================================================================
   task-tracker.js
   HSE Team Task Tracking System
   Roles: Admin (create/assign/verify) | OSH Coordinator (accept/update) | HSE AGM (view)
   ================================================================ */

'use strict';

const TT_KEY = 'hse_tasks';

// ── Task store ────────────────────────────────────────────────
function ttGetAll()       { return JSON.parse(localStorage.getItem(TT_KEY) || '[]'); }
function ttSave(tasks)    {
  localStorage.setItem(TT_KEY, JSON.stringify(tasks));
  // Push to cloud so all team members see it
  if (typeof cloudSync !== 'undefined' && cloudSync.isConfigured()) {
    cloudSync.push(TT_KEY, tasks);
  }
}
function ttGet(id)        { return ttGetAll().find(t => t.id === id); }
function ttGenId()        { const tasks = ttGetAll(); const maxN = tasks.reduce((m,t) => { const n=parseInt((t.id||'').replace(/\D/g,''),10)||0; return n>m?n:m; },0); return `TASK-${String(maxN+1).padStart(3,'0')}`; }

// ── HSE Team members (PIC options) ───────────────────────────
const HSE_TEAM = [
  { name: 'Roland Riset',        role: 'OSH Coordinator', site: 'Head Office' },
  { name: 'OSH Coordinator 1',   role: 'OSH Coordinator', site: 'TBD'         },
  { name: 'OSH Coordinator 2',   role: 'OSH Coordinator', site: 'TBD'         },
  { name: 'Hellena Lina',        role: 'Admin (SHE Executive)', site: 'Head Office' },
];

// ── Priority config ───────────────────────────────────────────
const PRIORITY_CONFIG = {
  Critical: { color: 'var(--danger)',  bg: 'rgba(224,60,49,.12)',  emoji: '🔴' },
  High:     { color: 'var(--warning)', bg: 'rgba(245,166,35,.12)', emoji: '🟠' },
  Medium:   { color: 'var(--accent)',  bg: 'rgba(0,170,255,.12)',  emoji: '🟡' },
  Low:      { color: 'var(--success)', bg: 'rgba(29,185,84,.12)',  emoji: '🟢' },
};

// ── Status config ─────────────────────────────────────────────
const STATUS_CONFIG = {
  'Open':                 { color: 'var(--accent)',     emoji: '🔵', next: ['In Progress','Cancelled'] },
  'Accepted':             { color: 'var(--accent2)',    emoji: '✋', next: ['In Progress'] },
  'In Progress':          { color: 'var(--warning)',    emoji: '🔄', next: ['Pending Verification','Completed'] },
  'Pending Verification': { color: '#f59e0b',           emoji: '⏳', next: ['Completed','In Progress'] },
  'Completed':            { color: '#10b981',           emoji: '✅', next: [] },
  'Overdue':              { color: 'var(--danger)',     emoji: '🔴', next: ['In Progress'] },
  'Cancelled':            { color: 'var(--text-muted)', emoji: '⛔', next: [] },
};

// ── Module source labels ──────────────────────────────────────
const MODULE_LABELS = {
  training:   { label: 'Training',        icon: 'fa-graduation-cap',      color: 'var(--accent)'  },
  issues:     { label: 'Safety Issue',    icon: 'fa-triangle-exclamation', color: 'var(--warning)' },
  capa:       { label: 'CAPA',            icon: 'fa-diagram-next',         color: 'var(--accent2)' },
  compliance: { label: 'Compliance',      icon: 'fa-shield-halved',        color: 'var(--success)' },
  shc:        { label: 'SHC',             icon: 'fa-people-group',         color: 'var(--purple)'  },
  cf:         { label: 'CF Renewal',      icon: 'fa-certificate',          color: '#f59e0b'        },
  general:    { label: 'General',         icon: 'fa-list-check',           color: 'var(--accent)'  },
};

// ── Auto-flag overdue ─────────────────────────────────────────
function ttAutoFlagOverdue() {
  const tasks = ttGetAll();
  let changed = false;
  tasks.forEach(t => {
    if (['Completed','Cancelled','Overdue'].includes(t.status)) return;
    if (t.dueDate && daysDiff(t.dueDate) < 0) {
      t.status = 'Overdue'; changed = true;
    }
  });
  if (changed) ttSave(tasks);
}

// ── Open the unified Add/Assign Task modal ────────────────────
// Called from every module's row or from the Task Board
window.openAssignTask = function(module, sourceId, description, dueDate) {
  const user = getCurrentUser();
  if (!isAdmin(user)) {
    showToast('Only Admin (SHE Executive) can assign tasks.', 'error');
    return;
  }
  ttAutoFlagOverdue();

  // Pre-fill the modal
  const el = id => document.getElementById(id);
  const m  = MODULE_LABELS[module] || MODULE_LABELS.general;

  if (el('tt-source-module'))  el('tt-source-module').value  = module   || 'general';
  if (el('tt-source-id'))      el('tt-source-id').value      = sourceId || '';
  if (el('tt-task-title'))     el('tt-task-title').value     = description || '';
  if (el('tt-task-note'))      el('tt-task-note').value      = '';
  if (el('tt-priority'))       el('tt-priority').value       = 'Medium';
  if (el('tt-assignto'))       el('tt-assignto').value       = 'Roland Riset';

  // Default due = supplied date or +7 days
  const def = (dueDate && dueDate.length > 4 && dueDate !== 'undefined')
    ? dueDate
    : (() => { const d = new Date(); d.setDate(d.getDate()+7); return d.toISOString().split('T')[0]; })();
  if (el('tt-duedate')) el('tt-duedate').value = def;

  // Update modal source badge
  if (el('tt-modal-badge')) {
    el('tt-modal-badge').innerHTML =
      `<i class="fa-solid ${m.icon}" style="color:${m.color}"></i> ${m.label}` +
      (sourceId ? ` · <span style="font-family:var(--font-mono)">${escHtml(sourceId)}</span>` : '');
  }

  if (el('tt-modal')) el('tt-modal').classList.add('show');
};

// Open modal for a brand-new standalone task (no source record)
window.openNewTask = function() {
  openAssignTask('general', '', '', '');
};

// ── Save new task from modal ──────────────────────────────────
window.ttSaveNewTask = function() {
  const user = getCurrentUser();
  if (!isAdmin(user)) { showToast('Only Admin can create tasks.', 'error'); return; }

  const el    = id => document.getElementById(id);
  const title = el('tt-task-title')?.value.trim();
  const pic   = el('tt-assignto')?.value;
  const due   = el('tt-duedate')?.value;
  const pri   = el('tt-priority')?.value || 'Medium';
  const note  = el('tt-task-note')?.value.trim() || '';
  const src   = el('tt-source-module')?.value || 'general';
  const srcId = el('tt-source-id')?.value || '';

  if (!title) { showToast('Please enter a task description.', 'error'); el('tt-task-title')?.focus(); return; }
  if (!pic)   { showToast('Please select who to assign this task to.', 'error'); return; }
  if (!due)   { showToast('Please set a due date.', 'error'); return; }

  const tasks = ttGetAll();
  const task  = {
    id:           ttGenId(),
    title,
    note,
    sourceModule: src,
    sourceId:     srcId,
    assignedTo:   pic,
    assignedBy:   user.name,
    priority:     pri,
    dueDate:      due,
    status:       'Open',
    createdAt:    today(),
    updatedAt:    today(),
    updates:      [],        // activity log
    verification: '',        // admin fills this on closure
  };
  tasks.push(task);
  ttSave(tasks);

  // Update PIC/coordinator on source record if linked
  const keyMap = { training:KEYS.training, issues:KEYS.issues, capa:KEYS.capa, compliance:KEYS.compliance, shc:KEYS.shc };
  const key = keyMap[src];
  if (key && srcId) {
    const data = getData(key);
    const rec  = data.find(r => r.id === srcId);
    if (rec) { rec.pic = pic; saveData(key, data); }
  }
  // CF records live in cf-tracker.js localStorage
  if (src === 'cf' && srcId) {
    try {
      const cfData = JSON.parse(localStorage.getItem('hse_cf_existing') || '[]');
      const cfRec  = cfData.find(r => r.id === srcId);
      if (cfRec) { cfRec.assignedCoordinator = pic; localStorage.setItem('hse_cf_existing', JSON.stringify(cfData)); }
    } catch(e) { /* CF data not available */ }
  }

  el('tt-modal')?.classList.remove('show');
  showToast(`Task ${task.id} assigned to ${pic.split(' ')[0]} ✓`, 'success');

  // Always refresh task board counts (nav badges)
  if (typeof renderAllTasks === 'function') renderAllTasks();
  if (typeof renderMyTasks  === 'function') renderMyTasks();

  // Also refresh the source module table if currently viewing it
  if (src==='training'   && currentPage==='training')   renderTraining();
  if (src==='issues'     && currentPage==='issues')     renderIssues();
  if (src==='capa'       && currentPage==='capa')       renderCapa();
  if (src==='compliance' && currentPage==='compliance') renderCompliance();
  if (src==='shc'        && currentPage==='shc')        renderShc();
  if (src==='cf'         && currentPage==='cf' && typeof renderCFExisting==='function') renderCFExisting();
};

// ── Accept task (OSH Coordinator) ────────────────────────────
window.ttAcceptTask = function(id) {
  const user = getCurrentUser();
  if (!user) { showToast('Please log in.', 'error'); return; }
  const tasks = ttGetAll();
  const task  = tasks.find(t => t.id === id);
  if (!task) return;
  task.status    = 'Accepted';
  task.updatedAt = today();
  task.updates.push({ by: user.name, at: today(), msg: 'Task accepted.' });
  ttSave(tasks);
  showToast('Task accepted ✓', 'success');
  if (currentPage==='alltasks') renderAllTasks();
  if (currentPage==='mytasks')  renderMyTasks();
};

// ── Open status update modal (OSH Coordinator) ───────────────
window.ttOpenUpdate = function(id) {
  const user = getCurrentUser();
  if (!user) { showToast('Please log in.', 'error'); return; }
  const task = ttGet(id);
  if (!task) return;

  const el = eid => document.getElementById(eid);
  if (el('ttu-id'))     el('ttu-id').value     = id;
  if (el('ttu-title'))  el('ttu-title').textContent = task.title;
  if (el('ttu-status')) {
    // Populate status options based on current status & role
    const sel = el('ttu-status');
    sel.innerHTML = '';
    const isCoord = !isAdmin(user); // coordinator or agm
    const opts = isAdmin(user)
      ? ['Open','Accepted','In Progress','Pending Verification','Completed','Cancelled']
      : ['Accepted','In Progress','Pending Verification','Completed'];
    opts.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o; opt.textContent = o;
      if (o === task.status) opt.selected = true;
      sel.appendChild(opt);
    });
  }
  if (el('ttu-progress')) el('ttu-progress').value = '';
  if (el('ttu-gdrive'))   el('ttu-gdrive').value   = task.gdriveLink || '';

  // Show verification field only for admin (closing the task)
  const verifySection = el('ttu-verify-section');
  if (verifySection) verifySection.style.display = isAdmin(user) ? 'block' : 'none';
  if (el('ttu-verification')) el('ttu-verification').value = task.verification || '';

  el('ttu-modal')?.classList.add('show');
};

// ── Save status update ────────────────────────────────────────
window.ttSaveUpdate = function() {
  const user = getCurrentUser();
  if (!user) { showToast('Please log in.', 'error'); return; }

  const el       = eid => document.getElementById(eid);
  const id       = el('ttu-id')?.value;
  const newStatus= el('ttu-status')?.value;
  const progress = el('ttu-progress')?.value.trim();
  const verify   = el('ttu-verification')?.value.trim();
  const gdrive   = el('ttu-gdrive')?.value.trim();

  if (!newStatus) { showToast('Please select a status.', 'error'); return; }

  // Require Google Drive link when submitting for verification or completing
  if (['Pending Verification','Completed'].includes(newStatus) && !gdrive) {
    showToast('Please paste a Google Drive link as evidence before submitting.', 'error');
    el('ttu-gdrive')?.focus();
    return;
  }

  const tasks = ttGetAll();
  const task  = tasks.find(t => t.id === id);
  if (!task) return;

  task.status    = newStatus;
  task.updatedAt = today();
  if (verify && isAdmin(user)) task.verification = verify;
  if (gdrive) task.gdriveLink = gdrive;

  const updateMsg = [
    progress,
    gdrive ? `📎 Evidence: ${gdrive}` : ''
  ].filter(Boolean).join(' | ');

  if (updateMsg) task.updates.push({ by: user.name, at: today(), msg: updateMsg });

  ttSave(tasks);
  el('ttu-modal')?.classList.remove('show');
  showToast('Task updated ✓', 'success');

  if (currentPage==='alltasks') renderAllTasks();
  if (currentPage==='mytasks')  renderMyTasks();
};

// ── Render the All Tasks page ─────────────────────────────────
let atFilter = { module:'', status:'', pic:'', search:'' };

window.renderAllTasks = function() {
  ttAutoFlagOverdue();
  const user  = getCurrentUser();
  const tasks = ttGetAll();

  // KPIs
  const el = id => document.getElementById(id);
  const overdue = tasks.filter(t => t.status==='Overdue').length;
  const open    = tasks.filter(t => ['Open','Accepted'].includes(t.status)).length;
  const inprog  = tasks.filter(t => t.status==='In Progress').length;
  const done    = tasks.filter(t => t.status==='Completed').length;
  if(el('at-kpi-overdue')) el('at-kpi-overdue').textContent = overdue;
  if(el('at-kpi-open'))    el('at-kpi-open').textContent    = open;
  if(el('at-kpi-inprog'))  el('at-kpi-inprog').textContent  = inprog;
  if(el('at-kpi-closed'))  el('at-kpi-closed').textContent  = done;
  if(el('at-kpi-total'))   el('at-kpi-total').textContent   = tasks.length;
  if(el('at-kpi-pending')) el('at-kpi-pending').textContent = tasks.filter(t=>t.status==='Pending Verification').length;
  if(el('at-kpi-critical'))el('at-kpi-critical').textContent= tasks.filter(t=>t.priority==='Critical').length;
  if(el('at-kpi-week'))    el('at-kpi-week').textContent    = tasks.filter(t=>t.dueDate&&daysDiff(t.dueDate)>=0&&daysDiff(t.dueDate)<=7).length;

  // Overdue alert
  const alertBox = el('at-overdue-alert');
  if(alertBox) alertBox.style.display = overdue>0 ? 'flex' : 'none';
  const alertN = el('at-overdue-n');
  if(alertN) alertN.textContent = overdue;

  // Nav badge
  const nb = el('nav-badge-alltasks');
  if(nb) { nb.textContent=overdue; nb.style.display=overdue>0?'':'none'; }

  // Populate PIC filter
  const picSel = el('at-f-pic');
  if(picSel && picSel.options.length <= 1) {
    const pics = [...new Set(tasks.map(t=>t.assignedTo).filter(Boolean))].sort();
    pics.forEach(p => { const o=document.createElement('option'); o.value=p; o.textContent=p; picSel.appendChild(o); });
  }

  // Filter tasks
  const { module, status, pic, search } = atFilter;
  const filtered = tasks.filter(t => {
    if (module && t.sourceModule !== module) return false;
    if (status && t.status       !== status) return false;
    if (pic    && t.assignedTo   !== pic)    return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(t.id+t.title+t.assignedTo+t.sourceId).toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Sort: Overdue first → Critical → by due date
  filtered.sort((a,b) => {
    if (a.status==='Overdue' && b.status!=='Overdue') return -1;
    if (b.status==='Overdue' && a.status!=='Overdue') return  1;
    const po = { Critical:0, High:1, Medium:2, Low:3 };
    const pd = (po[a.priority]??4) - (po[b.priority]??4);
    if (pd !== 0) return pd;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const rcnt = el('at-rcnt');
  if(rcnt) rcnt.textContent = filtered.length + (filtered.length===1?' task':' tasks');

  const list = el('at-task-list');
  if(!list) return;

  if(!filtered.length) {
    list.innerHTML = `<div style="text-align:center;padding:48px 24px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);color:var(--text-muted)">
      <div style="font-size:40px;margin-bottom:12px">✅</div>
      <div style="font-size:15px;font-weight:600;margin-bottom:6px">No tasks found</div>
      <div style="font-size:13px">${tasks.length===0?'No tasks have been created yet. Use the <strong>+ New Task</strong> button to create one.':'Try adjusting your filters.'}</div>
    </div>`;
    return;
  }

  list.innerHTML = filtered.map(t => ttTaskCard(t, user)).join('');
};

// ── My Tasks (OSH Coordinator view) ──────────────────────────
window.renderMyTasks = function() {
  ttAutoFlagOverdue();
  const user  = getCurrentUser();
  const name  = user ? user.name : '';
  const tasks = ttGetAll();

  // Match tasks: exact name OR first name match OR username match
  const firstName = name.toLowerCase().split(' ')[0];
  const mine = tasks.filter(t => {
    if (!t.assignedTo) return false;
    const at = t.assignedTo.toLowerCase();
    // Exact match
    if (at === name.toLowerCase()) return true;
    // First name match (e.g. "Roland" matches "Roland Riset")
    if (at.startsWith(firstName) || at.includes(firstName)) return true;
    // Username match for "Admin (Self)"
    if (user && t.assignedTo === 'Admin' && user.role === 'admin') return true;
    return false;
  });

  const el = id => document.getElementById(id);
  const overdue = mine.filter(t=>t.status==='Overdue').length;
  const open    = mine.filter(t=>['Open','Accepted'].includes(t.status)).length;
  const inprog  = mine.filter(t=>t.status==='In Progress'||t.status==='Pending Verification').length;
  const done    = mine.filter(t=>t.status==='Completed').length;

  if(el('mt-kpi-total'))   el('mt-kpi-total').textContent   = mine.length;
  if(el('mt-kpi-overdue')) el('mt-kpi-overdue').textContent = overdue;
  if(el('mt-kpi-open'))    el('mt-kpi-open').textContent    = open + inprog;
  if(el('mt-kpi-inprog'))  el('mt-kpi-inprog').textContent  = inprog;
  if(el('mt-kpi-closed'))  el('mt-kpi-closed').textContent  = done;
  if(el('mt-kpi-week'))    el('mt-kpi-week').textContent    = mine.filter(t=>t.dueDate&&daysDiff(t.dueDate)>=0&&daysDiff(t.dueDate)<=7).length;

  const sub = el('mytasks-subtitle');
  if(sub) sub.textContent = `Tasks assigned to: ${name}`;

  const alertBox = el('mt-overdue-alert');
  if(alertBox) alertBox.style.display = overdue>0?'flex':'none';
  const alertN = el('mt-overdue-n');
  if(alertN) alertN.textContent = overdue;

  const nb = el('nav-badge-mytasks');
  if(nb) { nb.textContent=overdue; nb.style.display=overdue>0?'':'none'; }

  const groups = el('mt-groups');
  if(!groups) return;

  if(!mine.length) {
    groups.innerHTML = `<div style="text-align:center;padding:48px 24px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg)">
      <div style="font-size:40px;margin-bottom:12px">✅</div>
      <div style="font-size:15px;font-weight:600;color:var(--text-primary);margin-bottom:6px">No tasks assigned to you</div>
      <div style="font-size:13px;color:var(--text-muted)">Matched by name: <strong>${escHtml(name)}</strong></div>
    </div>`;
    return;
  }

  // Group by status priority
  const sections = [
    { key:'overdue',  label:'⚠ Overdue — Take Action Now',   items: mine.filter(t=>t.status==='Overdue'),              color:'var(--danger)'  },
    { key:'new',      label:'🔵 New Tasks — Needs Acceptance', items: mine.filter(t=>t.status==='Open'),                color:'var(--accent)'  },
    { key:'accepted', label:'✋ Accepted — Start Working',     items: mine.filter(t=>t.status==='Accepted'),            color:'var(--accent2)' },
    { key:'progress', label:'🔄 In Progress',                 items: mine.filter(t=>t.status==='In Progress'),         color:'var(--warning)' },
    { key:'pending',  label:'⏳ Pending Admin Verification',   items: mine.filter(t=>t.status==='Pending Verification'), color:'#f59e0b'       },
    { key:'done',     label:'✅ Completed',                    items: mine.filter(t=>t.status==='Completed'),           color:'var(--success)' },
  ];

  groups.innerHTML = sections
    .filter(s => s.items.length > 0)
    .map(s => `
      <div style="margin-bottom:24px">
        <div style="font-family:var(--font-head);font-size:14px;font-weight:800;color:${s.color};margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid ${s.color}33;display:flex;align-items:center;justify-content:space-between">
          <span>${s.label}</span>
          <span style="font-size:12px;background:${s.color}22;color:${s.color};padding:2px 10px;border-radius:10px;font-family:var(--font-mono)">${s.items.length}</span>
        </div>
        ${s.items.map(t => ttTaskCard(t, user)).join('')}
      </div>`)
    .join('');
};

// ── Task Card Component ───────────────────────────────────────
function ttTaskCard(task, user) {
  const sc  = STATUS_CONFIG[task.status] || STATUS_CONFIG['Open'];
  const pc  = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['Medium'];
  const ml  = MODULE_LABELS[task.sourceModule] || MODULE_LABELS.general;
  const diff= task.dueDate ? daysDiff(task.dueDate) : null;

  const dueTxt = !task.dueDate    ? 'No due date'
               : diff === null    ? '—'
               : diff < 0        ? `${Math.abs(diff)} days overdue`
               : diff === 0      ? 'Due today!'
               : diff <= 3       ? `Due in ${diff} days`
               : diff <= 7       ? `Due in ${diff} days`
               : formatDate(task.dueDate);

  const dueColor = !task.dueDate   ? 'var(--text-muted)'
                 : diff !== null && diff < 0  ? 'var(--danger)'
                 : diff !== null && diff <= 3 ? 'var(--warning)'
                 : 'var(--text-secondary)';

  const isAdmin_  = user && isAdmin(user);
  const isCoord   = user && user.role === 'osh_coordinator';
  const userFirst = user ? user.name.toLowerCase().split(' ')[0] : '';
  const isMyTask  = user && task.assignedTo && (
    task.assignedTo.toLowerCase() === user.name.toLowerCase() ||
    task.assignedTo.toLowerCase().includes(userFirst) ||
    (task.assignedTo === 'Admin' && isAdmin_)
  );

  // Action buttons — role-based
  let actionBtns = '';
  if (task.status === 'Open' && (isMyTask || isCoord)) {
    actionBtns += `<button class="btn-sys btn-accent btn-sm" onclick="ttAcceptTask('${task.id}')" style="background:rgba(0,212,170,.15);color:var(--accent2);border:1px solid var(--accent2)"><i class="fa-solid fa-hand"></i> Accept</button>`;
  }
  if (['Accepted','In Progress','Open','Overdue'].includes(task.status) && (isMyTask || isCoord || isAdmin_)) {
    actionBtns += `<button class="btn-sys btn-outline btn-sm" onclick="ttOpenUpdate('${task.id}')"><i class="fa-solid fa-rotate"></i> Update</button>`;
  }
  if (task.status === 'Pending Verification' && isAdmin_) {
    actionBtns += `<button class="btn-sys btn-success-outline btn-sm" onclick="ttOpenUpdate('${task.id}')"><i class="fa-solid fa-circle-check"></i> Verify & Close</button>`;
  }
  if (isAdmin_) {
    actionBtns += `<button class="btn-sys btn-outline btn-xs" onclick="ttOpenUpdate('${task.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>`;
  }

  // Latest update note
  const lastUpdate = task.updates && task.updates.length > 0 ? task.updates[task.updates.length-1] : null;

  return `<div style="background:var(--bg-card);border:1px solid var(--border);border-left:4px solid ${sc.color};border-radius:var(--radius);padding:14px 16px;margin-bottom:8px;transition:box-shadow .2s" onmouseover="this.style.boxShadow='0 4px 16px rgba(0,0,0,.2)'" onmouseout="this.style.boxShadow='none'">
    <div style="display:flex;align-items:flex-start;gap:12px">

      <!-- Priority indicator -->
      <div style="font-size:20px;flex-shrink:0;margin-top:2px" title="${task.priority} priority">${pc.emoji}</div>

      <!-- Main content -->
      <div style="flex:1;min-width:0">

        <!-- Top row: ID, module, priority badge -->
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:5px">
          <span style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted)">${escHtml(task.id)}</span>
          <span style="font-size:10px;background:${ml.color}22;color:${ml.color};border-radius:3px;padding:1px 7px;white-space:nowrap">
            <i class="fa-solid ${ml.icon}" style="font-size:9px;margin-right:2px"></i>${ml.label}
            ${task.sourceId ? `· ${escHtml(task.sourceId)}` : ''}
          </span>
          <span style="font-size:10px;background:${pc.bg};color:${pc.color};border-radius:3px;padding:1px 7px;font-weight:700">${task.priority}</span>
          ${task.status==='Overdue' ? '<span style="font-size:10px;background:rgba(224,60,49,.15);color:var(--danger);border-radius:3px;padding:1px 7px;font-weight:700;animation:pulse 1.5s infinite">OVERDUE</span>' : ''}
        </div>

        <!-- Task title -->
        <div style="font-size:13px;font-weight:700;margin-bottom:5px;line-height:1.4">${escHtml(task.title)}</div>

        <!-- Meta row -->
        <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:11px;margin-bottom:${task.note||lastUpdate?'6px':'0'}">
          <span style="color:var(--text-secondary)"><i class="fa-solid fa-user" style="color:var(--text-muted);font-size:9px;margin-right:3px"></i>${escHtml(task.assignedTo||'Unassigned')}</span>
          <span style="color:${dueColor};font-weight:${diff!==null&&diff<=3?'700':'400'}"><i class="fa-solid fa-calendar" style="color:var(--text-muted);font-size:9px;margin-right:3px"></i>${dueTxt}</span>
          <span style="color:var(--text-muted)"><i class="fa-solid fa-user-tie" style="font-size:9px;margin-right:3px"></i>By: ${escHtml(task.assignedBy||'—')}</span>
        </div>

        <!-- Instruction note from admin -->
        ${task.note ? `<div style="font-size:11px;color:var(--text-secondary);background:rgba(0,170,255,.06);border-left:2px solid var(--accent);padding:4px 8px;border-radius:0 4px 4px 0;margin-bottom:4px;font-style:italic">📌 ${escHtml(task.note)}</div>` : ''}

        <!-- Latest update -->
        ${lastUpdate ? `<div style="font-size:11px;color:var(--text-muted);margin-top:4px"><i class="fa-solid fa-clock-rotate-left" style="font-size:9px;margin-right:3px"></i>${escHtml(lastUpdate.by)} on ${escHtml(lastUpdate.at)}: ${escHtml(lastUpdate.msg)}</div>` : ''}

        <!-- Google Drive evidence link -->
        ${task.gdriveLink ? `<div style="margin-top:6px"><a href="${escHtml(task.gdriveLink)}" target="_blank" style="font-size:11px;color:#4285f4;text-decoration:none;display:inline-flex;align-items:center;gap:4px;background:rgba(66,133,244,.08);padding:3px 8px;border-radius:4px;border:1px solid rgba(66,133,244,.2)"><i class="fa-brands fa-google-drive"></i> View Evidence on Google Drive</a></div>` : ''}

        <!-- Verification (admin only, after completion) -->
        ${task.verification && isAdmin_ ? `<div style="font-size:11px;color:var(--success);margin-top:4px"><i class="fa-solid fa-circle-check" style="margin-right:3px"></i>Verified: ${escHtml(task.verification)}</div>` : ''}
      </div>

      <!-- Right side: status + actions -->
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">
        <span style="font-size:11px;font-weight:700;color:${sc.color};white-space:nowrap">${sc.emoji} ${task.status}</span>
        <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end">${actionBtns}</div>
      </div>
    </div>
  </div>`;
}

// ── Daily Email Report ────────────────────────────────────────
// ── Task Sync — share tasks between devices ───────────────────
window.openTaskSync = function() {
  document.getElementById('sync-export-code').value = '';
  document.getElementById('sync-import-code').value = '';
  document.getElementById('task-sync-modal').classList.add('show');
};

window.generateSyncCode = function() {
  const tasks = ttGetAll();
  const users = JSON.parse(localStorage.getItem('hse_users') || '[]');
  const payload = {
    v:     2,
    ts:    new Date().toISOString(),
    tasks,
    users,
  };
  const code = btoa(JSON.stringify(payload));
  document.getElementById('sync-export-code').value = code;
  showToast('Export code generated — now copy and send to coordinator ✓', 'success');
};

window.copySyncCode = function() {
  const el = document.getElementById('sync-export-code');
  if (!el.value) { showToast('Generate the code first.', 'error'); return; }
  navigator.clipboard.writeText(el.value).then(() => {
    showToast('Code copied to clipboard ✓', 'success');
  }).catch(() => {
    el.select();
    document.execCommand('copy');
    showToast('Code copied ✓', 'success');
  });
};

window.importSyncCode = function() {
  const code = (document.getElementById('sync-import-code')?.value || '').trim();
  if (!code) { showToast('Please paste the code first.', 'error'); return; }
  try {
    const payload = JSON.parse(atob(code));
    if (!payload.tasks || !Array.isArray(payload.tasks)) throw new Error('Invalid code');

    // Import tasks
    ttSave(payload.tasks);

    // Import users if present (so coordinators can log in)
    if (payload.users && Array.isArray(payload.users)) {
      localStorage.setItem('hse_users', JSON.stringify(payload.users));
    }

    document.getElementById('task-sync-modal').classList.remove('show');
    showToast(`✓ ${payload.tasks.length} tasks imported successfully! Refresh My Tasks to see them.`, 'success');
    renderAllTasks();
    renderMyTasks();
  } catch(e) {
    showToast('Invalid code — please check and try again.', 'error');
  }
};


const EJ_KEY = 'hse_emailjs_config';

function ejGetConfig() {
  try { return JSON.parse(localStorage.getItem(EJ_KEY) || '{}'); } catch(e) { return {}; }
}
function ejSaveConfig(cfg) {
  localStorage.setItem(EJ_KEY, JSON.stringify(cfg));
}
function ejIsConfigured() {
  const c = ejGetConfig();
  return !!(c.serviceId && c.templateId && c.publicKey && c.toEmail);
}

// ── Open Email Settings modal ─────────────────────────────────
window.openEmailSettings = function() {
  const c  = ejGetConfig();
  const te = ejGetTeamEmails();
  const el = id => document.getElementById(id);
  if (el('ej-serviceId'))  el('ej-serviceId').value  = c.serviceId  || '';
  if (el('ej-templateId')) el('ej-templateId').value = c.templateId || '';
  if (el('ej-publicKey'))  el('ej-publicKey').value  = c.publicKey  || '';
  if (el('ej-toEmail'))    el('ej-toEmail').value    = c.toEmail    || '';
  // Load per-person emails
  HSE_TEAM.forEach(m => {
    const inp = el('ej-email-' + m.name);
    if (inp) inp.value = te[m.name] || '';
  });
  const modal = el('ej-settings-modal');
  if (modal) modal.classList.add('show');
};

window.saveEmailSettings = function() {
  const el = id => document.getElementById(id);
  const cfg = {
    serviceId:  (el('ej-serviceId')?.value  || '').trim(),
    templateId: (el('ej-templateId')?.value || '').trim(),
    publicKey:  (el('ej-publicKey')?.value  || '').trim(),
    toEmail:    (el('ej-toEmail')?.value    || '').trim(),
  };
  if (!cfg.serviceId || !cfg.templateId || !cfg.publicKey) {
    showToast('Please fill in Service ID, Template ID and Public Key.', 'error');
    return;
  }
  ejSaveConfig(cfg);

  // Save per-person team emails
  const teamEmails = {};
  HSE_TEAM.forEach(m => {
    const inp = el('ej-email-' + m.name);
    const val = (inp?.value || '').trim();
    if (val) teamEmails[m.name] = val;
  });
  ejSaveTeamEmails(teamEmails);

  document.getElementById('ej-settings-modal')?.classList.remove('show');
  const count = Object.keys(teamEmails).length;
  showToast(`Email settings saved — ${count} team member${count!==1?'s':''} configured ✓`, 'success');
  _ejUpdateButtons();
};

function _ejUpdateButtons() {
  const configured = ejIsConfigured();
  document.querySelectorAll('.ej-send-btn').forEach(b => {
    b.title = configured ? 'Send morning briefing via EmailJS' : 'Configure email settings first';
  });
  const badge = document.getElementById('ej-config-badge');
  if (badge) {
    badge.textContent   = configured ? '✓ Configured' : '⚠ Not configured';
    badge.style.color   = configured ? 'var(--success)' : 'var(--warning)';
  }
}

// ── HSE Team member email addresses (Admin configures once) ───
const EJ_TEAM_KEY = 'hse_team_emails';

function ejGetTeamEmails() {
  try { return JSON.parse(localStorage.getItem(EJ_TEAM_KEY) || '{}'); } catch(e) { return {}; }
}
function ejSaveTeamEmails(map) {
  localStorage.setItem(EJ_TEAM_KEY, JSON.stringify(map));
}

// ── Build personalised HTML email for ONE person ──────────────
function _buildPersonalEmailHTML(name, myTasks, allTasks, dateStr, todayStr) {
  const moduleLabel   = { training:'Training', issues:'Safety Issue', capa:'CAPA', compliance:'Compliance', shc:'SHC', cf:'CF Renewal', general:'General' };
  const priorityEmoji = { Critical:'🔴', High:'🟠', Medium:'🟡', Low:'🟢' };

  const myOverdue   = myTasks.filter(t => t.status === 'Overdue');
  const myDueToday  = myTasks.filter(t => t.dueDate === todayStr && !['Completed','Cancelled','Overdue'].includes(t.status));
  const myInProg    = myTasks.filter(t => t.status === 'In Progress');
  const myPending   = myTasks.filter(t => t.status === 'Pending Verification');
  const myDoneYest  = myTasks.filter(t => t.status === 'Completed' && t.updatedAt === todayStr);
  const myOpen      = myTasks.filter(t => t.status === 'Open' || t.status === 'Accepted');

  // Global team summary (all tasks, just counts)
  const teamOverdue  = allTasks.filter(t => t.status === 'Overdue').length;
  const teamDueToday = allTasks.filter(t => t.dueDate === todayStr && !['Completed','Cancelled','Overdue'].includes(t.status)).length;
  const teamActive   = allTasks.filter(t => !['Completed','Cancelled'].includes(t.status)).length;

  const taskTable = (list, showNote=false) => {
    if (!list.length) return '<p style="color:#6b7280;font-size:13px;margin:0">No tasks in this category today.</p>';
    return `<table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
      <thead><tr style="background:#f8fafc">
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600;white-space:nowrap">ID</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600">Area</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600">What needs to be done</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600">Priority</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600">Due</th>
        ${showNote ? '<th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600">Note from Admin</th>' : ''}
      </tr></thead>
      <tbody>
        ${list.map((t,i) => {
          const diff = t.dueDate ? daysDiff(t.dueDate) : null;
          const dueTxt = diff === null ? '—'
                       : diff < 0  ? `<span style="color:#dc2626;font-weight:700">${Math.abs(diff)}d overdue</span>`
                       : diff === 0 ? `<span style="color:#dc2626;font-weight:700">Due TODAY</span>`
                       : diff <= 3  ? `<span style="color:#d97706;font-weight:700">${diff}d left</span>`
                       : `<span style="color:#374151">${diff}d left</span>`;
          return `<tr style="border-top:1px solid #f1f5f9;background:${i%2===0?'white':'#fafafa'}">
            <td style="padding:10px 12px;font-family:monospace;font-size:11px;color:#94a3b8">${t.id}</td>
            <td style="padding:10px 12px;font-size:12px;color:#64748b;white-space:nowrap">${moduleLabel[t.sourceModule]||t.sourceModule||'—'}</td>
            <td style="padding:10px 12px;font-size:13px;color:#1e293b;font-weight:500;max-width:280px">${t.title}</td>
            <td style="padding:10px 12px;font-size:12px;white-space:nowrap">${priorityEmoji[t.priority]||''} ${t.priority}</td>
            <td style="padding:10px 12px;font-size:12px;white-space:nowrap">${dueTxt}</td>
            ${showNote ? `<td style="padding:10px 12px;font-size:12px;color:#475569;font-style:italic">${t.note||'—'}</td>` : ''}
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
  };

  const section = (emoji, title, color, bgColor, list, showNote=false) => list.length === 0 ? '' : `
    <div style="margin-bottom:28px">
      <div style="background:${bgColor};border-left:5px solid ${color};padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:12px;display:flex;align-items:center;gap:12px">
        <span style="font-size:20px">${emoji}</span>
        <div>
          <div style="font-size:15px;font-weight:700;color:${color}">${title}</div>
          <div style="font-size:12px;color:${color};opacity:.8">${list.length} task${list.length!==1?'s':''}</div>
        </div>
      </div>
      ${taskTable(list, showNote)}
    </div>`;

  const firstName = name.split(' ')[0];
  const greeting  = myOverdue.length > 0
    ? `⚠️ You have <strong style="color:#dc2626">${myOverdue.length} overdue task${myOverdue.length!==1?'s':''}</strong> that need immediate attention.`
    : myDueToday.length > 0
    ? `📅 You have <strong style="color:#d97706">${myDueToday.length} task${myDueToday.length!==1?'s':''}</strong> due today.`
    : `✅ No overdue or due-today tasks — good start to the day!`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:680px;margin:0 auto;padding:20px">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0f2744 0%,#1e4080 100%);border-radius:12px;padding:28px 32px;margin-bottom:16px">
    <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:3px;margin-bottom:6px">Jetama Water Sdn. Bhd. · SHE Division</div>
    <div style="font-size:24px;font-weight:800;color:#ffffff;margin-bottom:4px">🌅 Good Morning, ${firstName}!</div>
    <div style="font-size:14px;color:#cbd5e1">${dateStr} — Your HSE Task Briefing</div>
  </div>

  <!-- Personal greeting -->
  <div style="background:white;border-radius:10px;padding:16px 20px;margin-bottom:16px;border:1px solid #e2e8f0;font-size:14px;color:#374151;line-height:1.6">
    ${greeting}
    <div style="margin-top:8px;font-size:12px;color:#94a3b8">
      You have <strong>${myTasks.filter(t=>!['Completed','Cancelled'].includes(t.status)).length} active tasks</strong> in total.
      &nbsp;|&nbsp; Team-wide: <strong>${teamOverdue} overdue</strong>, <strong>${teamDueToday} due today</strong>, <strong>${teamActive} active</strong>.
    </div>
  </div>

  <!-- My task sections -->
  ${section('🔴','Overdue — Please Act Now',         '#dc2626','#fef2f2', myOverdue,  true)}
  ${section('📅','Due Today',                        '#d97706','#fffbeb', myDueToday, true)}
  ${section('🔵','Waiting for You to Start',         '#2563eb','#eff6ff', myOpen,     true)}
  ${section('🔄','In Progress',                      '#0891b2','#ecfeff', myInProg,   false)}
  ${section('⏳','Submitted — Pending Admin Check',  '#7c3aed','#f5f3ff', myPending,  false)}
  ${section('✅','Completed Today',                  '#059669','#ecfdf5', myDoneYest, false)}

  ${myTasks.filter(t=>!['Completed','Cancelled'].includes(t.status)).length===0 ? `
  <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;padding:24px;text-align:center;margin-bottom:20px">
    <div style="font-size:40px;margin-bottom:10px">🎉</div>
    <div style="font-size:17px;font-weight:700;color:#059669;margin-bottom:4px">All tasks done!</div>
    <div style="font-size:13px;color:#6b7280">You have no active tasks today. Great work, ${firstName}!</div>
  </div>` : ''}

  <!-- How to update -->
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:16px;font-size:12px;color:#64748b">
    <div style="font-weight:700;color:#374151;margin-bottom:8px">📱 How to update your tasks</div>
    <div>1. Open the HSE Governance System → <strong>My Tasks</strong></div>
    <div>2. Click <strong>✋ Accept</strong> on new tasks, then <strong>🔄 Update</strong> as you progress</div>
    <div>3. Mark as <strong>Pending Verification</strong> when done — Admin will verify and close</div>
  </div>

  <!-- Footer -->
  <div style="text-align:center;font-size:11px;color:#94a3b8;padding-top:12px;border-top:1px solid #e2e8f0">
    <div>This is your personalised morning briefing from the OI/HSE Governance System</div>
    <div style="margin-top:4px">Jetama Water Sdn. Bhd. · Safety &amp; Health Department · ${dateStr}</div>
    <div style="margin-top:4px;color:#cbd5e1">Do not reply to this email — log in to update your tasks directly</div>
  </div>
</div>
</body>
</html>`;
}

// ── Send individual emails to each team member ─────────────────
window.sendDailyEmailReport = async function() {
  ttAutoFlagOverdue();

  if (!ejIsConfigured()) {
    showToast('Please configure email settings first.', 'error');
    openEmailSettings();
    return;
  }

  const cfg       = ejGetConfig();
  const teamEmails= ejGetTeamEmails();
  const tasks     = ttGetAll();
  const todayStr  = new Date().toISOString().split('T')[0];
  const dateStr   = new Date().toLocaleDateString('en-MY', { weekday:'long', day:'2-digit', month:'long', year:'numeric' });

  // Check at least one email is configured
  const configured = HSE_TEAM.filter(m => teamEmails[m.name]);
  if (!configured.length) {
    showToast('No team email addresses configured. Please add them in Email Settings.', 'error');
    openEmailSettings();
    return;
  }

  const btn      = document.getElementById('ej-send-btn-main');
  const origText = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending to ${configured.length} people…`;

  // Init EmailJS
  try {
    if (window.emailjs) emailjs.init(cfg.publicKey);
    else throw new Error('EmailJS library not loaded.');
  } catch(e) {
    showToast('EmailJS not available — using fallback.', 'error');
    if (btn) btn.innerHTML = origText;
    _fallbackMailto(tasks);
    return;
  }

  let sent = 0, failed = 0, skipped = 0;
  const errors = [];

  for (const member of HSE_TEAM) {
    const email = teamEmails[member.name];
    if (!email) { skipped++; continue; }

    // Filter tasks assigned to this person
    const firstName = member.name.toLowerCase().split(' ')[0];
    const myTasks   = tasks.filter(t => t.assignedTo && t.assignedTo.toLowerCase().includes(firstName));

    // Skip if person has no tasks at all
    if (!myTasks.length) { skipped++; continue; }

    const html  = _buildPersonalEmailHTML(member.name, myTasks, tasks, dateStr, todayStr);
    const myOv  = myTasks.filter(t=>t.status==='Overdue').length;
    const myDt  = myTasks.filter(t=>t.dueDate===todayStr&&!['Completed','Cancelled','Overdue'].includes(t.status)).length;
    const plain = `HSE Morning Briefing — ${dateStr}\n\nHi ${member.name.split(' ')[0]},\n\nYour tasks:\n- Overdue: ${myOv}\n- Due Today: ${myDt}\n- Total Active: ${myTasks.filter(t=>!['Completed','Cancelled'].includes(t.status)).length}\n\nPlease log in to view and update your tasks.\n\n— SHE Division, Jetama Water Sdn. Bhd.`;

    try {
      await emailjs.send(cfg.serviceId, cfg.templateId, {
        to_email:     email,
        to_name:      member.name,
        subject:      `[HSE Briefing] ${dateStr} — ${myOv} Overdue, ${myDt} Due Today`,
        message_html: html,
        message_text: plain,
        summary:      `${myOv} Overdue | ${myDt} Due Today | ${myTasks.filter(t=>!['Completed','Cancelled'].includes(t.status)).length} Active`,
        date:         dateStr,
      });
      sent++;
      // Small delay between sends to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));
    } catch(err) {
      failed++;
      errors.push(`${member.name}: ${err.text || err.message || 'failed'}`);
      console.error(`Failed to send to ${member.name}:`, err);
    }
  }

  if (btn) btn.innerHTML = origText;

  if (sent > 0 && failed === 0) {
    showToast(`✓ Morning briefing sent to ${sent} team member${sent!==1?'s':''}!`, 'success');
  } else if (sent > 0 && failed > 0) {
    showToast(`Sent to ${sent}, failed for ${failed}. Check console for details.`, 'error');
  } else if (failed > 0) {
    showToast('All sends failed — falling back to mail app.', 'error');
    _fallbackMailto(tasks);
  } else {
    showToast(`No emails sent — ${skipped} skipped (no tasks or no email address).`, 'error');
  }
};

// ── Fallback: open mail app with full team summary ────────────
function _fallbackMailto(tasks) {
  const cfg      = ejGetConfig();
  const todayStr = new Date().toISOString().split('T')[0];
  const dateStr  = new Date().toLocaleDateString('en-MY', { weekday:'long', day:'2-digit', month:'long', year:'numeric' });
  const to       = cfg.toEmail || 'she@jetamawater.com.my';
  const taskLine = t => `[${t.priority}] ${t.id} — ${t.title} | ${t.assignedTo||'—'} | Due: ${t.dueDate||'—'}`;
  const moduleLabel = { training:'Training', issues:'Safety Issue', capa:'CAPA', compliance:'Compliance', shc:'SHC', cf:'CF Renewal', general:'General' };
  const od = tasks.filter(t=>t.status==='Overdue');
  const dt = tasks.filter(t=>t.dueDate===todayStr&&!['Completed','Cancelled','Overdue'].includes(t.status));
  const ip = tasks.filter(t=>t.status==='In Progress');
  let body = `HSE MORNING BRIEFING — ${dateStr}\nJetama Water Sdn. Bhd. | SHE Division\n${'─'.repeat(50)}\n\n`;
  body += `TEAM SUMMARY: ${od.length} Overdue | ${dt.length} Due Today | ${ip.length} In Progress\n\n`;
  if (od.length) body += `🔴 OVERDUE (${od.length}):\n${od.map(taskLine).join('\n')}\n\n`;
  if (dt.length) body += `📅 DUE TODAY (${dt.length}):\n${dt.map(taskLine).join('\n')}\n\n`;
  if (ip.length) body += `🔄 IN PROGRESS (${ip.length}):\n${ip.map(taskLine).join('\n')}\n\n`;
  body += `— OI/HSE Governance System`;
  const subject = encodeURIComponent(`[HSE Morning Briefing] ${dateStr} — ${od.length} Overdue`);
  window.open(`mailto:${to}?subject=${subject}&body=${encodeURIComponent(body)}`);
}

// ── Export tasks to Excel ─────────────────────────────────────
window.exportAllTasksExcel = function() {
  const XLSX  = window.XLSX;
  const tasks = ttGetAll();
  const wb    = XLSX.utils.book_new();
  const now   = new Date().toISOString().split('T')[0];
  const dateStr = new Date().toLocaleDateString('en-MY',{day:'2-digit',month:'long',year:'numeric'});

  // Summary
  const sumWs = XLSX.utils.aoa_to_sheet([
    ['HSE TEAM — DAILY TASK REPORT'],
    [`Date: ${dateStr}`],[],
    ['Status','Count'],
    ['🔴 Overdue',              tasks.filter(t=>t.status==='Overdue').length],
    ['🔵 Open / Accepted',      tasks.filter(t=>['Open','Accepted'].includes(t.status)).length],
    ['🔄 In Progress',          tasks.filter(t=>t.status==='In Progress').length],
    ['⏳ Pending Verification', tasks.filter(t=>t.status==='Pending Verification').length],
    ['✅ Completed',            tasks.filter(t=>t.status==='Completed').length],
    ['TOTAL',                   tasks.length],
  ]);
  sumWs['!cols']=[{wch:28},{wch:10}];
  XLSX.utils.book_append_sheet(wb, sumWs, 'Summary');

  // All tasks
  const h = ['Task ID','Title','Assigned To','Assigned By','Priority','Due Date','Status','Source','Source ID','Created','Last Updated','Latest Update Note'];
  const rows = tasks.map(t => {
    const last = t.updates&&t.updates.length ? t.updates[t.updates.length-1].msg : '';
    return [t.id, t.title, t.assignedTo, t.assignedBy, t.priority, t.dueDate||'—', t.status,
            MODULE_LABELS[t.sourceModule]?.label||t.sourceModule, t.sourceId||'—',
            t.createdAt, t.updatedAt, last];
  });
  const ws = XLSX.utils.aoa_to_sheet([
    [`HSE Task Register — ${dateStr}`],[],h,...rows
  ]);
  ws['!cols']=[{wch:12},{wch:50},{wch:20},{wch:20},{wch:10},{wch:14},{wch:22},{wch:16},{wch:12},{wch:12},{wch:12},{wch:40}];
  XLSX.utils.book_append_sheet(wb, ws, 'All Tasks');

  // Overdue
  const ov = tasks.filter(t=>t.status==='Overdue');
  if(ov.length) {
    const ovRows = ov.map(t=>[t.id,t.title,t.assignedTo,t.priority,t.dueDate||'—',t.status]);
    const ovWs = XLSX.utils.aoa_to_sheet([
      ['⚠ OVERDUE TASKS — Action Required Immediately'],
      [`${ov.length} tasks are past their due date`],[],
      ['Task ID','Title','Assigned To','Priority','Due Date','Status'],...ovRows
    ]);
    ovWs['!cols']=[{wch:12},{wch:50},{wch:20},{wch:10},{wch:14},{wch:22}];
    XLSX.utils.book_append_sheet(wb, ovWs, 'Overdue — Act Now');
  }

  XLSX.writeFile(wb, `HSE_Tasks_${now}.xlsx`);
  showToast('Task report exported!', 'success');
};

window.exportMyTasksExcel = function() {
  const XLSX = window.XLSX;
  const user = getCurrentUser();
  const name = user ? user.name : '';
  const fn   = name.toLowerCase().split(' ')[0];
  const mine = ttGetAll().filter(t=>t.assignedTo&&t.assignedTo.toLowerCase().includes(fn));
  const wb   = XLSX.utils.book_new();
  const now  = new Date().toISOString().split('T')[0];
  const dateStr = new Date().toLocaleDateString('en-MY',{day:'2-digit',month:'long',year:'numeric'});

  const h    = ['Task ID','Title','Priority','Due Date','Status','Source','Instruction Note','Last Update'];
  const rows = mine.map(t=>{
    const last = t.updates&&t.updates.length ? t.updates[t.updates.length-1].msg : '';
    return [t.id,t.title,t.priority,t.dueDate||'—',t.status,MODULE_LABELS[t.sourceModule]?.label||t.sourceModule,t.note||'',last];
  });
  const ws = XLSX.utils.aoa_to_sheet([
    [`MY TASKS — ${name}`],[`Date: ${dateStr} | Total: ${mine.length} tasks`],[],h,...rows
  ]);
  ws['!cols']=[{wch:12},{wch:50},{wch:10},{wch:14},{wch:22},{wch:16},{wch:40},{wch:40}];
  XLSX.utils.book_append_sheet(wb, ws, 'My Tasks');
  XLSX.writeFile(wb, `MyTasks_${name.replace(/\s/g,'_')}_${now}.xlsx`);
  showToast('My tasks exported!', 'success');
};
