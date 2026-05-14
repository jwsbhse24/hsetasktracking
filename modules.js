/* ============================================================
   modules.js — Page Render Functions
   Dashboard, Training, Issues, CAPA, Compliance, SHC, Reports
   ============================================================ */

// ── Chart instances registry ─────────────────────────────────
const chartRegistry = {};
function destroyChart(id) {
  if (chartRegistry[id]) { chartRegistry[id].destroy(); delete chartRegistry[id]; }
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
  const kpi   = calcKPIs();
  const alerts = generateAlerts();
  const trend = JSON.parse(localStorage.getItem('hse_trend') || '{}');

  // KPI Cards
  document.getElementById('kpi-open').textContent   = kpi.totalOpen;
  document.getElementById('kpi-overdue').textContent = kpi.totalOverdue;
  document.getElementById('kpi-capa').textContent    = kpi.capaPct + '%';
  document.getElementById('kpi-training').textContent = kpi.trPct + '%';
  document.getElementById('kpi-compliance').textContent = kpi.cmpAlerts;
  document.getElementById('kpi-critical').textContent  = kpi.totalCrit;
  document.getElementById('kpi-shc').textContent       = kpi.shcOut;
  document.getElementById('kpi-upcoming').textContent  = kpi.upcoming;

  // Render Alert Feed
  const feed = document.getElementById('dash-alerts');
  if (feed) {
    feed.innerHTML = alerts.slice(0,6).map(a => `
      <div class="alert-item alert-${a.type}">
        <div class="alert-icon"><i class="fa-solid ${a.icon}"></i></div>
        <div style="flex:1">
          <div class="alert-title">${escHtml(a.title)}</div>
          <div class="alert-desc">${escHtml(a.desc)}</div>
        </div>
        <div class="alert-time">${escHtml(a.time)}</div>
      </div>`).join('') || '<div style="color:var(--text-muted);font-size:13px;padding:8px">No active alerts.</div>';
  }

  // Recent Issues Table
  const issues = getData(KEYS.issues).slice(0,5);
  const issuesTbl = document.getElementById('dash-issues-tbl');
  if (issuesTbl) {
    issuesTbl.innerHTML = issues.map(r => `<tr>
      <td class="td-id">${escHtml(r.id)}</td>
      <td>${escHtml(r.category)}</td>
      <td>${escHtml(r.description.substring(0,45))}…</td>
      <td>${riskBadge(r.riskLevel)}</td>
      <td>${statusBadge(r.status)}</td>
      <td>${agingBadge(r.dueDate)}</td>
    </tr>`).join('');
  }

  // Recent CAPA
  const capas = getData(KEYS.capa).slice(0,4);
  const capaTbl = document.getElementById('dash-capa-tbl');
  if (capaTbl) {
    capaTbl.innerHTML = capas.map(r => `<tr>
      <td class="td-id">${escHtml(r.id)}</td>
      <td><span style="font-size:11px;color:var(--accent)">${escHtml(r.isoStandard)}</span></td>
      <td>${escHtml(r.description.substring(0,45))}…</td>
      <td>${statusBadge(r.status)}</td>
      <td>${escHtml(r.pic)}</td>
    </tr>`).join('');
  }

  // CHARTS
  renderDashCharts(kpi, trend);
}

function renderDashCharts(kpi, trend) {
  const months = (trend.months || ['Nov','Dec','Jan','Feb','Mar','Apr','May']);
  const chartDefaults = {
    color: 'rgba(0,170,255,0.8)',
    gridColor: 'rgba(255,255,255,0.06)',
    textColor: 'rgba(138,172,204,0.9)'
  };

  // CAPA Trend Chart
  destroyChart('chartCapa');
  const ctxCapa = document.getElementById('chartCapa');
  if (ctxCapa) {
    chartRegistry['chartCapa'] = new Chart(ctxCapa, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          { label: 'Open', data: trend.capaOpen||[], backgroundColor: 'rgba(224,60,49,0.6)', borderRadius: 4 },
          { label: 'Closed', data: trend.capaClosed||[], backgroundColor: 'rgba(29,185,84,0.6)', borderRadius: 4 }
        ]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color:chartDefaults.textColor, font:{size:11} } } },
        scales:{ x:{ grid:{ color:chartDefaults.gridColor }, ticks:{ color:chartDefaults.textColor } },
                 y:{ grid:{ color:chartDefaults.gridColor }, ticks:{ color:chartDefaults.textColor } } } }
    });
  }

  // Issues Trend
  destroyChart('chartIssues');
  const ctxIssues = document.getElementById('chartIssues');
  if (ctxIssues) {
    chartRegistry['chartIssues'] = new Chart(ctxIssues, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          { label:'Reported', data:trend.issuesReported||[], borderColor:'#f5a623', backgroundColor:'rgba(245,166,35,0.1)', tension:0.4, fill:true, pointRadius:4 },
          { label:'Closed',   data:trend.issuesClosed||[], borderColor:'#1db954',  backgroundColor:'rgba(29,185,84,0.08)',  tension:0.4, fill:true, pointRadius:4 }
        ]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color:chartDefaults.textColor, font:{size:11} } } },
        scales:{ x:{ grid:{ color:chartDefaults.gridColor }, ticks:{ color:chartDefaults.textColor } },
                 y:{ grid:{ color:chartDefaults.gridColor }, ticks:{ color:chartDefaults.textColor } } } }
    });
  }

  // Compliance pie
  destroyChart('chartCompliance');
  const ctxComp = document.getElementById('chartCompliance');
  if (ctxComp) {
    const compliance = getData(KEYS.compliance);
    const valid    = compliance.filter(r=>r.status==='Valid').length;
    const expiring = compliance.filter(r=>r.status==='Expiring Soon').length;
    const expired  = compliance.filter(r=>r.status==='Expired').length;
    chartRegistry['chartCompliance'] = new Chart(ctxComp, {
      type: 'doughnut',
      data: {
        labels: ['Valid','Expiring Soon','Expired'],
        datasets: [{ data:[valid,expiring,expired], backgroundColor:['rgba(29,185,84,0.8)','rgba(245,166,35,0.8)','rgba(224,60,49,0.8)'], borderWidth:2, borderColor:'rgba(17,29,46,0.5)' }]
      },
      options:{ responsive:true, maintainAspectRatio:false, cutout:'70%', plugins:{ legend:{ position:'bottom', labels:{ color:chartDefaults.textColor, font:{size:11}, padding:12 } } } }
    });
  }

  // Training compliance
  destroyChart('chartTraining');
  const ctxTr = document.getElementById('chartTraining');
  if (ctxTr) {
    chartRegistry['chartTraining'] = new Chart(ctxTr, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{ label:'Compliance %', data:trend.trainingCompliance||[], borderColor:'#00aaff', backgroundColor:'rgba(0,170,255,0.1)', tension:0.4, fill:true, pointRadius:4 }]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color:chartDefaults.textColor, font:{size:11} } } },
        scales:{ x:{ grid:{ color:chartDefaults.gridColor }, ticks:{ color:chartDefaults.textColor } },
                 y:{ min:0, max:100, grid:{ color:chartDefaults.gridColor }, ticks:{ color:chartDefaults.textColor, callback:v=>v+'%' } } } }
    });
  }
}

// ============================================================
// TRAINING MODULE
// ============================================================
let trFilter = { dept:'', status:'', search:'' };

function renderTraining() {
  const data = getData(KEYS.training);
  const kpi  = {
    total:   data.length,
    valid:   data.filter(r=>r.status==='Valid').length,
    expiring:data.filter(r=>r.status==='Expiring Soon').length,
    expired: data.filter(r=>r.status==='Expired').length,
    hours:   data.reduce((s,r)=>s+(parseInt(r.hours,10)||0),0)
  };

  document.getElementById('tr-kpi-total').textContent   = kpi.total;
  document.getElementById('tr-kpi-valid').textContent   = kpi.valid;
  document.getElementById('tr-kpi-expiring').textContent= kpi.expiring;
  document.getElementById('tr-kpi-expired').textContent = kpi.expired;
  document.getElementById('tr-kpi-hours').textContent   = kpi.hours + ' hrs';
  document.getElementById('tr-kpi-pct').textContent     = Math.round((kpi.valid/Math.max(kpi.total,1))*100) + '%';

  // Activate matrix tab by default
  if (typeof switchTrainingTab === 'function') switchTrainingTab('matrix');
  else renderTrainingTable();
}

function renderTrainingTable() {
  const data = getData(KEYS.training);
  const { dept, status, search } = trFilter;
  const filtered = data.filter(r => {
    const matchDept   = !dept   || r.department === dept;
    const matchStatus = !status || r.status === status;
    const matchSearch = !search || (r.employeeName+r.trainingName+r.employeeId).toLowerCase().includes(search.toLowerCase());
    return matchDept && matchStatus && matchSearch;
  });

  const tbody = document.getElementById('tr-tbody');
  const user  = getCurrentUser();
  tbody.innerHTML = filtered.map(r => {
    const daysLeft = daysDiff(r.expiryDate);
    const expClass = daysLeft < 0 ? 'text-danger' : daysLeft < 30 ? 'text-warning' : '';
    return `<tr>
      <td class="td-id">${escHtml(r.id)}</td>
      <td><div style="font-weight:600">${escHtml(r.employeeName)}</div><div class="td-muted">${escHtml(r.employeeId)}</div></td>
      <td>${escHtml(r.department)}</td>
      <td>${escHtml(r.trainingName)}</td>
      <td class="td-muted">${formatDate(r.trainingDate)}</td>
      <td class="${expClass}">${formatDate(r.expiryDate)}</td>
      <td style="font-family:var(--font-mono);font-size:12px">${escHtml(r.hours||'—')} hrs</td>
      <td>${statusBadge(r.status)}</td>
      <td>${agingBadge(r.expiryDate)}</td>
      <td class="td-action">
        ${canEdit(user) ? `
        <button class="btn-sys btn-outline btn-xs" onclick="editTraining('${r.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-sys btn-accent btn-xs" onclick="openAssignTask('training','${r.id}','${escHtml(r.trainingName)} — ${escHtml(r.employeeName)}','${escHtml(r.expiryDate)}')" title="Assign to OSH Coordinator" style="background:rgba(0,212,170,.15);color:var(--accent2);border-color:var(--accent2)"><i class="fa-solid fa-user-plus"></i></button>
        <button class="btn-sys btn-danger-outline btn-xs" onclick="deleteRecord(KEYS.training,'${r.id}',renderTraining)" title="Delete"><i class="fa-solid fa-trash"></i></button>` : '—'}
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="10" style="text-align:center;color:var(--text-muted);padding:24px">No records found</td></tr>`;
}

function editTraining(id) {
  const data = getData(KEYS.training);
  const rec  = data.find(r => r.id === id) || {};
  openTrainingModal(rec);
}

function openTrainingModal(rec={}) {
  const isNew = !rec.id;
  document.getElementById('tr-modal-title').textContent = isNew ? 'Add Training Record' : 'Edit Training Record';
  ['id','employeeName','employeeId','department','trainingName','trainingDate','expiryDate','status','remarks','hours','evidence'].forEach(f => {
    const el = document.getElementById('tr-f-'+f);
    if (el) el.value = rec[f] || '';
  });
  if (isNew) {
    const data = getData(KEYS.training);
    document.getElementById('tr-f-id').value = genId('TR', data);
  }
  document.getElementById('tr-modal').classList.add('show');
}

function saveTrainingRecord() {
  const user = getCurrentUser();
  if (!user) { showToast('Session expired. Please log in again.','error'); return; }
  if (!canEdit(user)) { showToast('Your role cannot save records. Admin or OSH Coordinator required.','error'); return; }
  const data = getData(KEYS.training);
  const id   = document.getElementById('tr-f-id').value;
  const rec  = {};
  ['id','employeeName','employeeId','department','trainingName','trainingDate','expiryDate','status','remarks','hours','evidence'].forEach(f => {
    const el = document.getElementById('tr-f-'+f);
    if (el) rec[f] = el.value.trim();
  });

  // Auto status from expiry
  const diff = daysDiff(rec.expiryDate);
  if (diff < 0)       rec.status = 'Expired';
  else if (diff < 30) rec.status = 'Expiring Soon';
  else                rec.status = 'Valid';

  const idx = data.findIndex(r => r.id === id);
  if (idx >= 0) data[idx] = rec; else data.push(rec);
  saveData(KEYS.training, data);
  document.getElementById('tr-modal').classList.remove('show');
  showToast('Training record saved.','success');
  renderTraining();
}

// ============================================================
// ISSUES MODULE
// ============================================================
let issFilter = { category:'', status:'', risk:'' , search:'' };

function renderIssues() {
  const data = getData(KEYS.issues);
  const kpi  = {
    total:   data.length,
    open:    data.filter(r=>r.status==='Open').length,
    overdue: data.filter(r=>r.status==='Overdue').length,
    closed:  data.filter(r=>r.status==='Closed').length,
    critical:data.filter(r=>r.riskLevel==='Critical' && r.status!=='Closed').length
  };
  document.getElementById('iss-kpi-total').textContent   = kpi.total;
  document.getElementById('iss-kpi-open').textContent    = kpi.open;
  document.getElementById('iss-kpi-overdue').textContent = kpi.overdue;
  document.getElementById('iss-kpi-closed').textContent  = kpi.closed;
  document.getElementById('iss-kpi-critical').textContent= kpi.critical;
  renderIssuesTable();
}

function renderIssuesTable() {
  const data = getData(KEYS.issues);
  const { category, status, risk, search } = issFilter;
  const filtered = data.filter(r => {
    const matchCat    = !category || r.category === category;
    const matchStatus = !status   || r.status   === status;
    const matchRisk   = !risk     || r.riskLevel === risk;
    const matchSearch = !search   || (r.id+r.description+r.location+r.pic).toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchRisk && matchSearch;
  });

  const tbody = document.getElementById('iss-tbody');
  const user  = getCurrentUser();
  tbody.innerHTML = filtered.map(r => `<tr>
    <td class="td-id">${escHtml(r.id)}</td>
    <td><span style="font-size:12px;color:var(--text-secondary)">${escHtml(r.category)}</span></td>
    <td>${escHtml(r.description.substring(0,50))}…</td>
    <td>${riskBadge(r.riskLevel)}</td>
    <td class="td-muted">${escHtml(r.location)}</td>
    <td>${escHtml(r.pic)}</td>
    <td class="td-muted">${formatDate(r.dueDate)}</td>
    <td>${statusBadge(r.status)}</td>
    <td>${agingBadge(r.dueDate)}</td>
    <td class="td-action">
      ${canEdit(user) ? `
      <button class="btn-sys btn-outline btn-xs" onclick="editIssue('${r.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
      <button class="btn-sys btn-xs" onclick="openAssignTask('issues','${r.id}','${escHtml(r.category)}: ${escHtml((r.description||'').substring(0,50))}','${escHtml(r.dueDate)}')" title="Assign to OSH Coordinator" style="background:rgba(0,212,170,.15);color:var(--accent2);border:1px solid var(--accent2);border-radius:var(--radius);cursor:pointer;padding:2px 8px;font-size:11px;white-space:nowrap"><i class="fa-solid fa-user-plus"></i></button>
      <button class="btn-sys btn-danger-outline btn-xs" onclick="deleteRecord(KEYS.issues,'${r.id}',renderIssues)" title="Delete"><i class="fa-solid fa-trash"></i></button>` : '—'}
    </td>
  </tr>`).join('') || `<tr><td colspan="10" style="text-align:center;color:var(--text-muted);padding:24px">No records found</td></tr>`;
}

function editIssue(id) {
  const data = getData(KEYS.issues);
  const rec  = data.find(r => r.id === id) || {};
  openIssueModal(rec);
}

function openIssueModal(rec={}) {
  const isNew = !rec.id;
  document.getElementById('iss-modal-title').textContent = isNew ? 'Add Safety Issue' : 'Edit Safety Issue';
  ['id','category','description','riskLevel','location','pic','dateReported','dueDate','status','verification'].forEach(f => {
    const el = document.getElementById('iss-f-'+f);
    if (el) el.value = rec[f] || '';
  });
  if (isNew) {
    const data = getData(KEYS.issues);
    document.getElementById('iss-f-id').value = genId('ISS', data);
    document.getElementById('iss-f-dateReported').value = today();
  }
  document.getElementById('iss-modal').classList.add('show');
}

function saveIssueRecord() {
  const user = getCurrentUser();
  if (!user) { showToast('Session expired. Please log in again.','error'); return; }
  if (!canEdit(user)) { showToast('Your role cannot save records. Admin or OSH Coordinator required.','error'); return; }
  const data = getData(KEYS.issues);
  const id   = document.getElementById('iss-f-id').value;
  const rec  = {};
  ['id','category','description','riskLevel','location','pic','dateReported','dueDate','status','verification'].forEach(f => {
    const el = document.getElementById('iss-f-'+f);
    if (el) rec[f] = el.value.trim();
  });
  rec.evidence = '';
  const idx = data.findIndex(r => r.id === id);
  if (idx >= 0) data[idx] = rec; else data.push(rec);
  saveData(KEYS.issues, data);
  document.getElementById('iss-modal').classList.remove('show');
  showToast('Issue record saved.','success');
  renderIssues();
}

// ============================================================
// CAPA MODULE
// ============================================================
let capaFilter = { iso:'', type:'', status:'', search:'' };

function renderCapa() {
  const data = getData(KEYS.capa);
  const kpi  = {
    total:   data.length,
    open:    data.filter(r=>r.status==='Open').length,
    inProg:  data.filter(r=>r.status==='In Progress').length,
    overdue: data.filter(r=>r.status==='Overdue').length,
    closed:  data.filter(r=>r.status==='Closed').length,
    pct:     Math.round((data.filter(r=>r.status==='Closed').length/Math.max(data.length,1))*100)
  };
  document.getElementById('capa-kpi-total').textContent   = kpi.total;
  document.getElementById('capa-kpi-open').textContent    = kpi.open;
  document.getElementById('capa-kpi-inprog').textContent  = kpi.inProg;
  document.getElementById('capa-kpi-overdue').textContent = kpi.overdue;
  document.getElementById('capa-kpi-closed').textContent  = kpi.closed;
  document.getElementById('capa-kpi-pct').textContent     = kpi.pct + '%';
  renderCapaTable();
}

function renderCapaTable() {
  const data = getData(KEYS.capa);
  const { iso, type, status, search } = capaFilter;
  const filtered = data.filter(r => {
    const matchIso    = !iso    || r.isoStandard  === iso;
    const matchType   = !type   || r.findingType  === type;
    const matchStatus = !status || r.status        === status;
    const matchSearch = !search || (r.id+r.description+r.pic+r.rootCause).toLowerCase().includes(search.toLowerCase());
    return matchIso && matchType && matchStatus && matchSearch;
  });

  const tbody = document.getElementById('capa-tbody');
  const user  = getCurrentUser();
  tbody.innerHTML = filtered.map(r => `<tr>
    <td class="td-id">${escHtml(r.id)}</td>
    <td><span class="badge-status badge-open" style="font-size:10px">${escHtml(r.isoStandard)}</span></td>
    <td><span style="font-size:12px;color:var(--text-secondary)">${escHtml(r.findingType)}</span></td>
    <td>${escHtml(r.description.substring(0,50))}…</td>
    <td class="td-muted" style="max-width:140px;font-size:12px">${escHtml((r.correctiveAction||'').substring(0,50))}…</td>
    <td>${escHtml(r.pic)}</td>
    <td class="td-muted">${formatDate(r.dueDate)}</td>
    <td>${statusBadge(r.status)}</td>
    <td>${agingBadge(r.dueDate)}</td>
    <td class="td-action">
      ${canEdit(user) ? `
      <button class="btn-sys btn-outline btn-xs" onclick="editCapa('${r.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
      <button class="btn-sys btn-xs" onclick="openAssignTask('capa','${r.id}','${escHtml(r.isoStandard)} ${escHtml(r.findingType)}: ${escHtml((r.description||'').substring(0,50))}','${escHtml(r.dueDate)}')" title="Assign to OSH Coordinator" style="background:rgba(0,212,170,.15);color:var(--accent2);border:1px solid var(--accent2);border-radius:var(--radius);cursor:pointer;padding:2px 8px;font-size:11px;white-space:nowrap"><i class="fa-solid fa-user-plus"></i></button>
      <button class="btn-sys btn-danger-outline btn-xs" onclick="deleteRecord(KEYS.capa,'${r.id}',renderCapa)" title="Delete"><i class="fa-solid fa-trash"></i></button>` : '—'}
    </td>
  </tr>`).join('') || `<tr><td colspan="10" style="text-align:center;color:var(--text-muted);padding:24px">No records found</td></tr>`;
}

function editCapa(id) {
  const data = getData(KEYS.capa);
  const rec  = data.find(r => r.id === id) || {};
  openCapaModal(rec);
}

function openCapaModal(rec={}) {
  const isNew = !rec.id;
  document.getElementById('capa-modal-title').textContent = isNew ? 'Add CAPA Record' : 'Edit CAPA Record';
  ['id','isoStandard','findingType','description','rootCause','correctiveAction','pic','dueDate','status','verification'].forEach(f => {
    const el = document.getElementById('capa-f-'+f);
    if (el) el.value = rec[f] || '';
  });
  if (isNew) {
    const data = getData(KEYS.capa);
    document.getElementById('capa-f-id').value = genId('CAPA', data);
  }
  document.getElementById('capa-modal').classList.add('show');
}

function saveCapaRecord() {
  const user = getCurrentUser();
  if (!user) { showToast('Session expired. Please log in again.','error'); return; }
  if (!canEdit(user)) { showToast('Your role cannot save records. Admin or OSH Coordinator required.','error'); return; }
  const data = getData(KEYS.capa);
  const id   = document.getElementById('capa-f-id').value;
  const rec  = {};
  ['id','isoStandard','findingType','description','rootCause','correctiveAction','pic','dueDate','status','verification'].forEach(f => {
    const el = document.getElementById('capa-f-'+f);
    if (el) rec[f] = el.value.trim();
  });
  rec.evidence = '';
  const idx = data.findIndex(r => r.id === id);
  if (idx >= 0) data[idx] = rec; else data.push(rec);
  saveData(KEYS.capa, data);
  document.getElementById('capa-modal').classList.remove('show');
  showToast('CAPA record saved.','success');
  renderCapa();
}

// ============================================================
// COMPLIANCE MODULE
// ============================================================
let cmpFilter = { status:'', search:'' };

function renderCompliance() {
  const data = getData(KEYS.compliance);
  const kpi  = {
    total:   data.length,
    valid:   data.filter(r=>r.status==='Valid').length,
    expiring:data.filter(r=>r.status==='Expiring Soon').length,
    expired: data.filter(r=>r.status==='Expired').length
  };
  document.getElementById('cmp-kpi-total').textContent   = kpi.total;
  document.getElementById('cmp-kpi-valid').textContent   = kpi.valid;
  document.getElementById('cmp-kpi-expiring').textContent= kpi.expiring;
  document.getElementById('cmp-kpi-expired').textContent = kpi.expired;
  renderComplianceTable();
}

function renderComplianceTable() {
  const data = getData(KEYS.compliance);
  const { status, search } = cmpFilter;
  const filtered = data.filter(r => {
    const matchStatus = !status || r.status === status;
    const matchSearch = !search || (r.item+r.referenceNo+r.pic+r.authority).toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const tbody = document.getElementById('cmp-tbody');
  const user  = getCurrentUser();
  tbody.innerHTML = filtered.map(r => {
    const diff = daysDiff(r.expiryDate);
    const expClass = diff < 0 ? 'text-danger' : diff < 30 ? 'text-warning' : '';
    return `<tr>
      <td class="td-id">${escHtml(r.id)}</td>
      <td style="font-weight:600;font-size:13px">${escHtml(r.item)}</td>
      <td class="td-muted">${escHtml(r.authority)}</td>
      <td class="td-mono td-muted">${escHtml(r.referenceNo)}</td>
      <td class="${expClass}">${formatDate(r.expiryDate)}</td>
      <td>${escHtml(r.pic)}</td>
      <td>${statusBadge(r.status)}</td>
      <td>${agingBadge(r.expiryDate)}</td>
      <td class="td-muted">${escHtml(r.remarks)}</td>
      <td class="td-action">
        ${canEdit(user) ? `
        <button class="btn-sys btn-outline btn-xs" onclick="editCompliance('${r.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-sys btn-xs" onclick="openAssignTask('compliance','${r.id}','${escHtml(r.item)} (${escHtml(r.authority)})','${escHtml(r.expiryDate)}')" title="Assign to OSH Coordinator" style="background:rgba(0,212,170,.15);color:var(--accent2);border:1px solid var(--accent2);border-radius:var(--radius);cursor:pointer;padding:2px 8px;font-size:11px;white-space:nowrap"><i class="fa-solid fa-user-plus"></i></button>
        <button class="btn-sys btn-danger-outline btn-xs" onclick="deleteRecord(KEYS.compliance,'${r.id}',renderCompliance)" title="Delete"><i class="fa-solid fa-trash"></i></button>` : '—'}
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="10" style="text-align:center;color:var(--text-muted);padding:24px">No records found</td></tr>`;
}

function editCompliance(id) {
  const data = getData(KEYS.compliance);
  const rec  = data.find(r => r.id === id) || {};
  openCmpModal(rec);
}

function openCmpModal(rec={}) {
  const isNew = !rec.id;
  document.getElementById('cmp-modal-title').textContent = isNew ? 'Add Compliance Item' : 'Edit Compliance Item';
  ['id','item','authority','referenceNo','expiryDate','pic','status','reminderAlert','remarks','verification'].forEach(f => {
    const el = document.getElementById('cmp-f-'+f);
    if (el) el.value = rec[f] || '';
  });
  if (isNew) {
    const data = getData(KEYS.compliance);
    document.getElementById('cmp-f-id').value = genId('CMP', data);
  }
  document.getElementById('cmp-modal').classList.add('show');
}

function saveCmpRecord() {
  const user = getCurrentUser();
  if (!user) { showToast('Session expired. Please log in again.','error'); return; }
  if (!canEdit(user)) { showToast('Your role cannot save records. Admin or OSH Coordinator required.','error'); return; }
  const data = getData(KEYS.compliance);
  const id   = document.getElementById('cmp-f-id').value;
  const rec  = {};
  ['id','item','authority','referenceNo','expiryDate','pic','status','reminderAlert','remarks','verification'].forEach(f => {
    const el = document.getElementById('cmp-f-'+f);
    if (el) rec[f] = el.value.trim();
  });
  rec.evidence = '';
  // Auto-status
  const diff = daysDiff(rec.expiryDate);
  if (diff < 0)       rec.status = 'Expired';
  else if (diff < 30) rec.status = 'Expiring Soon';
  else                rec.status = 'Valid';

  const idx = data.findIndex(r => r.id === id);
  if (idx >= 0) data[idx] = rec; else data.push(rec);
  saveData(KEYS.compliance, data);
  document.getElementById('cmp-modal').classList.remove('show');
  showToast('Compliance record saved.','success');
  renderCompliance();
}

// ============================================================
// SHC MODULE
// ============================================================
let shcFilter = { status:'', search:'' };

function renderShc() {
  const data = getData(KEYS.shc);
  const kpi  = {
    total:   data.length,
    open:    data.filter(r=>r.status==='Open'||r.status==='In Progress').length,
    overdue: data.filter(r=>r.status==='Overdue').length,
    closed:  data.filter(r=>r.status==='Closed').length,
    avgAtt:  data.length ? Math.round(data.reduce((s,r)=>s+(parseInt(r.attendance,10)||0),0)/data.length) : 0
  };
  document.getElementById('shc-kpi-total').textContent   = kpi.total;
  document.getElementById('shc-kpi-open').textContent    = kpi.open;
  document.getElementById('shc-kpi-overdue').textContent = kpi.overdue;
  document.getElementById('shc-kpi-closed').textContent  = kpi.closed;
  document.getElementById('shc-kpi-att').textContent     = kpi.avgAtt + '%';
  renderShcTable();
}

function renderShcTable() {
  const data = getData(KEYS.shc);
  const { status, search } = shcFilter;
  const filtered = data.filter(r => {
    const matchStatus = !status || r.status === status;
    const matchSearch = !search || (r.id+r.issueRaised+r.actionRequired+r.pic).toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const tbody = document.getElementById('shc-tbody');
  const user  = getCurrentUser();
  tbody.innerHTML = filtered.map(r => `<tr>
    <td class="td-id">${escHtml(r.id)}</td>
    <td class="td-muted">${formatDate(r.meetingDate)}</td>
    <td style="font-size:12px">${escHtml(r.issueRaised.substring(0,50))}…</td>
    <td style="font-size:12px">${escHtml(r.actionRequired.substring(0,50))}…</td>
    <td>${escHtml(r.pic)}</td>
    <td class="td-muted">${formatDate(r.dueDate)}</td>
    <td>${statusBadge(r.status)}</td>
    <td>${agingBadge(r.dueDate)}</td>
    <td class="td-action">
      ${canEdit(user) ? `
      <button class="btn-sys btn-outline btn-xs" onclick="editShc('${r.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
      <button class="btn-sys btn-xs" onclick="openAssignTask('shc','${r.id}','SHC: ${escHtml((r.actionRequired||'').substring(0,50))}','${escHtml(r.dueDate)}')" title="Assign to OSH Coordinator" style="background:rgba(0,212,170,.15);color:var(--accent2);border:1px solid var(--accent2);border-radius:var(--radius);cursor:pointer;padding:2px 8px;font-size:11px;white-space:nowrap"><i class="fa-solid fa-user-plus"></i></button>
      <button class="btn-sys btn-danger-outline btn-xs" onclick="deleteRecord(KEYS.shc,'${r.id}',renderShc)" title="Delete"><i class="fa-solid fa-trash"></i></button>` : '—'}
    </td>
  </tr>`).join('') || `<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:24px">No records found</td></tr>`;
}

function editShc(id) {
  const data = getData(KEYS.shc);
  const rec  = data.find(r => r.id === id) || {};
  openShcModal(rec);
}

function openShcModal(rec={}) {
  const isNew = !rec.id;
  document.getElementById('shc-modal-title').textContent = isNew ? 'Add SHC Action' : 'Edit SHC Action';
  ['id','meetingDate','agenda','attendance','issueRaised','actionRequired','pic','dueDate','status','verification'].forEach(f => {
    const el = document.getElementById('shc-f-'+f);
    if (el) el.value = rec[f] || '';
  });
  if (isNew) {
    const data = getData(KEYS.shc);
    document.getElementById('shc-f-id').value = genId('SHC', data);
    document.getElementById('shc-f-meetingDate').value = today();
  }
  document.getElementById('shc-modal').classList.add('show');
}

function saveShcRecord() {
  const user = getCurrentUser();
  if (!user) { showToast('Session expired. Please log in again.','error'); return; }
  if (!canEdit(user)) { showToast('Your role cannot save records. Admin or OSH Coordinator required.','error'); return; }
  const data = getData(KEYS.shc);
  const id   = document.getElementById('shc-f-id').value;
  const rec  = {};
  ['id','meetingDate','agenda','attendance','issueRaised','actionRequired','pic','dueDate','status','verification'].forEach(f => {
    const el = document.getElementById('shc-f-'+f);
    if (el) rec[f] = el.value.trim();
  });
  const idx = data.findIndex(r => r.id === id);
  if (idx >= 0) data[idx] = rec; else data.push(rec);
  saveData(KEYS.shc, data);
  document.getElementById('shc-modal').classList.remove('show');
  showToast('SHC record saved.','success');
  renderShc();
}

// ============================================================
// SHARED: Delete Record
// ============================================================
function deleteRecord(key, id, refreshFn) {
  if (!confirm('Delete this record? This cannot be undone.')) return;
  const data = getData(key);
  const idx  = data.findIndex(r => r.id === id);
  if (idx >= 0) { data.splice(idx, 1); saveData(key, data); }
  showToast('Record deleted.', 'warn');
  if (refreshFn) refreshFn();
}

// ============================================================
// REPORTS MODULE
// ============================================================
function renderReports() {
  // populated in report.js
  if (typeof buildReportPreview === 'function') buildReportPreview('two-weekly');
}
