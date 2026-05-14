/* ============================================================
   cf-tracker.js — Certificate of Fitness (CF) Status Tracker
   KKIP Water Bottling Factory — Air Receiver & Air Compressor
   Jetama Water Sdn Bhd | SHE Division
   ============================================================ */

'use strict';

// ── Seed CF data into localStorage on first load ──────────────
const CF_KEY = 'hse_cf_equipment';

const CF_SEED = [
  {
    id: 'CF-001',
    no: 1,
    equipmentType: 'Air Receiver',
    location: 'New Production Area',
    manufacturer: 'Sedar Perkasa Sdn Bhd',
    serialNo: 'SP/1209/26',
    capacity: '1,500 Litres',
    designPressure: '40 bar',
    designTemp: '95°C',
    cfExemptionStatus: 'Requires Certificate of Fitness',
    cfRegStatus: 'Not Registered',
    regProgress: 'Awaiting supporting documents for the two 300-litre air receivers supplied by Jiangsu Yueli Machinery Co. Ltd before submitting all four air receiver applications to DOSH for Form 27C (Permit to Install) via MyKKP.',
    operatingStatus: 'In Service',
    remarks: 'Newly purchased and installed in the New Production Area.',
    photoUrl: 'https://drive.google.com/file/d/1cPPoPzfMDLbOlnDKDhSlgG0PGQQD_HmS/view?usp=drive_link',
    docStatus: 'complete',
    docs: {
      manufacturerDataReport: true,
      suratKelulusanJKKP: true,
      sijilVerifikasiJKKP: true,
      safetyReliefValve: true,
      pressureGaugeCalib: true,
      nameplate: true
    },
    form27c: 'Pending Submission',
    authority: 'DOSH',
    pic: 'Roland Riset',
    lastUpdated: '2026-05-11'
  },
  {
    id: 'CF-002',
    no: 2,
    equipmentType: 'Air Receiver',
    location: 'New Production Area',
    manufacturer: 'Sedar Perkasa Sdn Bhd',
    serialNo: 'SP/1568/25',
    capacity: '1,000 Litres',
    designPressure: '10.34 bar',
    designTemp: '95°C',
    cfExemptionStatus: 'Requires Certificate of Fitness',
    cfRegStatus: 'Not Registered',
    regProgress: 'Awaiting supporting documents for the two 300-litre air receivers supplied by Jiangsu Yueli Machinery Co. Ltd before submitting all four air receiver applications to DOSH for Form 27C (Permit to Install) via MyKKP.',
    operatingStatus: 'In Service',
    remarks: 'Newly purchased and installed in the New Production Area.',
    photoUrl: 'https://drive.google.com/file/d/1Bkin-MElvOOlbHBzKT595brI1KzKuA2I/view?usp=drive_link',
    docStatus: 'complete',
    docs: {
      manufacturerDataReport: true,
      suratKelulusanJKKP: true,
      sijilVerifikasiJKKP: true,
      safetyReliefValve: true,
      pressureGaugeCalib: true,
      nameplate: true
    },
    form27c: 'Pending Submission',
    authority: 'DOSH',
    pic: 'Roland Riset',
    lastUpdated: '2026-05-11'
  },
  {
    id: 'CF-003',
    no: 3,
    equipmentType: 'Air Receiver',
    location: 'New Production Area',
    manufacturer: 'Jiangsu Yueli Machinery Co. LTD',
    serialNo: 'TS2232343-2027',
    capacity: '300 Litres',
    designPressure: '13.5 bar',
    designTemp: '150°C',
    cfExemptionStatus: 'Requires Certificate of Fitness',
    cfRegStatus: 'Not Registered',
    regProgress: 'Pending supporting documents to proceed with Form 27C submission in MyKKP (Permit to Install).',
    operatingStatus: 'In Service',
    remarks: 'Newly purchased and installed. Confirmed by Jesper William Puduk on 11/5/2026.',
    photoUrl: 'https://drive.google.com/file/d/12vPQimjnZsTuOQz8kSd7U5qbPY_CWvTf/view?usp=drive_link',
    docStatus: 'incomplete',
    docs: {
      manufacturerDataReport: false,
      suratKelulusanJKKP: false,
      sijilVerifikasiJKKP: false,
      safetyReliefValve: false,
      pressureGaugeCalib: false,
      nameplate: true
    },
    form27c: 'Not Started',
    authority: 'DOSH',
    pic: 'Jesper William Puduk',
    lastUpdated: '2026-05-11'
  },
  {
    id: 'CF-004',
    no: 4,
    equipmentType: 'Air Receiver',
    location: 'New Production Area',
    manufacturer: 'Jiangsu Yueli Machinery Co. LTD',
    serialNo: 'TS2232343-2027',
    capacity: '300 Litres',
    designPressure: '13.5 bar',
    designTemp: '150°C',
    cfExemptionStatus: 'Requires Certificate of Fitness',
    cfRegStatus: 'Not Registered',
    regProgress: 'Pending supporting documents to proceed with Form 27C submission in MyKKP (Permit to Install).',
    operatingStatus: 'In Service',
    remarks: 'Newly purchased and installed. Confirmed by Jesper William Puduk on 11/5/2026.',
    photoUrl: 'https://drive.google.com/file/d/1Ni4CjgLaIdD1EGahTlPzu9JGi7gL9F53/view?usp=drive_link',
    docStatus: 'incomplete',
    docs: {
      manufacturerDataReport: false,
      suratKelulusanJKKP: false,
      sijilVerifikasiJKKP: false,
      safetyReliefValve: false,
      pressureGaugeCalib: false,
      nameplate: true
    },
    form27c: 'Not Started',
    authority: 'DOSH',
    pic: 'Jesper William Puduk',
    lastUpdated: '2026-05-11'
  },
  {
    id: 'CF-005',
    no: 5,
    equipmentType: 'Air Receiver (High Pressure)',
    location: 'Blowing Machine Area',
    manufacturer: 'Not Available (Name Plate Missing)',
    serialNo: 'Not Available',
    capacity: 'Not Available',
    designPressure: 'Not Available',
    designTemp: 'Not Available',
    cfExemptionStatus: 'Requires Certificate of Fitness',
    cfRegStatus: 'Not Registered',
    regProgress: 'Previous owner (COMOGO Sdn Bhd) unable to provide required documents for CF registration.',
    operatingStatus: 'In Service',
    remarks: 'Took over from previous owner (COMOGO Sdn Bhd). Existing records not available.',
    photoUrl: 'https://drive.google.com/file/d/1UMtaT4fR21HzYRyzJCQxdLFngB716-Wa/view?usp=drive_link',
    docStatus: 'missing',
    docs: {
      manufacturerDataReport: false,
      suratKelulusanJKKP: false,
      sijilVerifikasiJKKP: false,
      safetyReliefValve: false,
      pressureGaugeCalib: false,
      nameplate: false
    },
    form27c: 'Not Started',
    authority: 'DOSH',
    pic: 'Roland Riset',
    lastUpdated: '2026-05-11'
  },
  {
    id: 'CF-006',
    no: 6,
    equipmentType: 'Air Receiver (Low Pressure)',
    location: 'Blowing Machine Area',
    manufacturer: 'Dancomair',
    serialNo: 'V 1150 0036',
    capacity: '500 Litres',
    designPressure: '39.99 bar (580 PSI)',
    designTemp: 'Not Available',
    cfExemptionStatus: 'Requires Certificate of Fitness',
    cfRegStatus: 'Not Registered',
    regProgress: 'Previous owner (COMOGO Sdn Bhd) unable to provide required documents for CF registration.',
    operatingStatus: 'In Service',
    remarks: 'Took over from previous owner (COMOGO Sdn Bhd). Existing records not available.',
    photoUrl: 'https://drive.google.com/file/d/1NR0xuPsPstyDOts5cNgTjMpiqvjzMvCJ/view?usp=drive_link',
    docStatus: 'missing',
    docs: {
      manufacturerDataReport: false,
      suratKelulusanJKKP: false,
      sijilVerifikasiJKKP: false,
      safetyReliefValve: false,
      pressureGaugeCalib: false,
      nameplate: true
    },
    form27c: 'Not Started',
    authority: 'DOSH',
    pic: 'Roland Riset',
    lastUpdated: '2026-05-11'
  },
  {
    id: 'CF-007',
    no: 7,
    equipmentType: 'Air Compressor',
    location: 'Blowing Machine Area',
    manufacturer: 'Zhejiang Kaisheng Compressor Co. LTD',
    serialNo: 'Not Available',
    capacity: 'Not Available',
    designPressure: 'Not Available',
    designTemp: 'Not Available',
    cfExemptionStatus: 'Requires Certificate of Fitness',
    cfRegStatus: 'Not Registered',
    regProgress: 'Previous owner (COMOGO Sdn Bhd) unable to provide required documents for CF registration.',
    operatingStatus: 'In Service',
    remarks: 'Took over from previous owner (COMOGO Sdn Bhd). Existing records not available.',
    photoUrl: 'https://drive.google.com/file/d/1YLmAfVi8n94WAZzFODp6v97kqmWgs7CX/view?usp=drive_link',
    docStatus: 'missing',
    docs: {
      manufacturerDataReport: false,
      suratKelulusanJKKP: false,
      sijilVerifikasiJKKP: false,
      safetyReliefValve: false,
      pressureGaugeCalib: false,
      nameplate: false
    },
    form27c: 'Not Started',
    authority: 'DOSH',
    pic: 'Roland Riset',
    lastUpdated: '2026-05-11'
  }
];

// Document labels for checklist
const CF_DOCS = [
  { key: 'manufacturerDataReport', label: "Manufacturer's Data Report" },
  { key: 'suratKelulusanJKKP',    label: 'Surat Kelulusan Verifikasi Bejana Tekanan (JKKP)' },
  { key: 'sijilVerifikasiJKKP',   label: 'Sijil Verifikasi Reka Bentuk (JKKP)' },
  { key: 'safetyReliefValve',     label: 'Safety Relief Valve Test Report' },
  { key: 'pressureGaugeCalib',    label: 'Pressure Gauge Calibration Report' },
  { key: 'nameplate',             label: "Manufacturer's Name Plate" }
];

// Seed on first load
function cfSeedData() {
  if (!localStorage.getItem(CF_KEY)) {
    localStorage.setItem(CF_KEY, JSON.stringify(CF_SEED));
  }
}

function getCFData() {
  cfSeedData();
  return JSON.parse(localStorage.getItem(CF_KEY) || '[]');
}

function saveCFData(data) {
  localStorage.setItem(CF_KEY, JSON.stringify(data));
}

// ── Doc status helpers ────────────────────────────────────────
function cfDocStatus(rec) {
  const total    = CF_DOCS.length;
  const have     = CF_DOCS.filter(d => rec.docs && rec.docs[d.key]).length;
  if (have === total)                    return { label: 'Complete',   cls: 'badge-valid',    color: 'var(--success)' };
  if (have === 0)                        return { label: 'No Docs',    cls: 'badge-expired',  color: 'var(--danger)'  };
  return { label: `${have}/${total} Docs`, cls: 'badge-expiring', color: 'var(--warning)' };
}

function cfRegBadge(status) {
  const map = {
    'Registered':        { cls: 'badge-valid',    label: 'Registered' },
    'Not Registered':    { cls: 'badge-expired',  label: 'Not Registered' },
    'In Progress':       { cls: 'badge-in-progress', label: 'In Progress' },
    'Pending Submission':{ cls: 'badge-expiring', label: 'Pending Submission' },
    'Exempted':          { cls: 'badge-open',     label: 'Exempted' }
  };
  const m = map[status] || { cls: 'badge-open', label: status };
  return `<span class="badge-status ${m.cls}">${m.label}</span>`;
}

function cfForm27cBadge(status) {
  const map = {
    'Submitted':          'badge-valid',
    'Approved':           'badge-valid',
    'Pending Submission': 'badge-expiring',
    'Not Started':        'badge-expired',
    'In Progress':        'badge-in-progress'
  };
  return `<span class="badge-status ${map[status]||'badge-open'}">${escHtml(status)}</span>`;
}

function cfDocProgress(rec) {
  const total = CF_DOCS.length;
  const have  = CF_DOCS.filter(d => rec.docs && rec.docs[d.key]).length;
  const pct   = Math.round(have / total * 100);
  const color = pct === 100 ? 'var(--success)' : pct === 0 ? 'var(--danger)' : 'var(--warning)';
  return `<div title="${have}/${total} documents">
    <div style="background:var(--bg-dark);border-radius:3px;height:6px;overflow:hidden;width:80px;display:inline-block;vertical-align:middle">
      <div style="width:${pct}%;background:${color};height:100%;border-radius:3px;transition:width .5s"></div>
    </div>
    <span style="font-size:10px;font-family:var(--font-mono);color:${color};margin-left:4px">${have}/${total}</span>
  </div>`;
}

// ── KPIs ─────────────────────────────────────────────────────
function calcCFKPIs() {
  const data = getCFData();
  return {
    total:          data.length,
    registered:     data.filter(r => r.cfRegStatus === 'Registered').length,
    notRegistered:  data.filter(r => r.cfRegStatus === 'Not Registered').length,
    inProgress:     data.filter(r => r.cfRegStatus === 'In Progress' || r.cfRegStatus === 'Pending Submission').length,
    docsComplete:   data.filter(r => CF_DOCS.every(d => r.docs && r.docs[d.key])).length,
    docsMissing:    data.filter(r => CF_DOCS.every(d => !r.docs || !r.docs[d.key])).length,
    docsPartial:    data.filter(r => {
      const have = CF_DOCS.filter(d => r.docs && r.docs[d.key]).length;
      return have > 0 && have < CF_DOCS.length;
    }).length,
    form27cPending: data.filter(r => r.form27c === 'Pending Submission' || r.form27c === 'Not Started').length,
    airReceivers:   data.filter(r => r.equipmentType.toLowerCase().includes('receiver')).length,
    airCompressors: data.filter(r => r.equipmentType.toLowerCase().includes('compressor')).length
  };
}

// ── Filters state ─────────────────────────────────────────────
let cfFilter = { type: '', location: '', regStatus: '', docStatus: '', search: '' };

// ── Main render ───────────────────────────────────────────────
function renderCFTracker() {
  cfSeedData();
  const kpi = calcCFKPIs();

  // KPI cards
  const el = id => document.getElementById(id);
  if (el('cf-kpi-total'))        el('cf-kpi-total').textContent        = kpi.total;
  if (el('cf-kpi-registered'))   el('cf-kpi-registered').textContent   = kpi.registered;
  if (el('cf-kpi-unreg'))        el('cf-kpi-unreg').textContent        = kpi.notRegistered;
  if (el('cf-kpi-inprog'))       el('cf-kpi-inprog').textContent       = kpi.inProgress;
  if (el('cf-kpi-docs-ok'))      el('cf-kpi-docs-ok').textContent      = kpi.docsComplete;
  if (el('cf-kpi-docs-miss'))    el('cf-kpi-docs-miss').textContent    = kpi.docsMissing;
  if (el('cf-kpi-form27c'))      el('cf-kpi-form27c').textContent      = kpi.form27cPending;
  if (el('cf-kpi-receivers'))    el('cf-kpi-receivers').textContent    = kpi.airReceivers;

  renderCFTable();
  renderCFDocMatrix();
}

// ── Equipment table ───────────────────────────────────────────
function renderCFTable() {
  const data = getCFData();
  const { type, location, regStatus, docStatus, search } = cfFilter;

  const filtered = data.filter(r => {
    if (type      && !r.equipmentType.toLowerCase().includes(type.toLowerCase())) return false;
    if (location  && r.location !== location)  return false;
    if (regStatus && r.cfRegStatus !== regStatus) return false;
    if (docStatus) {
      const have = CF_DOCS.filter(d => r.docs && r.docs[d.key]).length;
      if (docStatus === 'complete' && have !== CF_DOCS.length) return false;
      if (docStatus === 'incomplete' && (have === 0 || have === CF_DOCS.length)) return false;
      if (docStatus === 'missing' && have !== 0) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!(r.id+r.equipmentType+r.manufacturer+r.serialNo+r.location+r.pic).toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const tbody = document.getElementById('cf-tbody');
  if (!tbody) return;
  const user = getCurrentUser();

  tbody.innerHTML = filtered.map(r => {
    const ds   = cfDocStatus(r);
    const pct  = Math.round(CF_DOCS.filter(d => r.docs && r.docs[d.key]).length / CF_DOCS.length * 100);
    const pCol = pct === 100 ? 'var(--success)' : pct === 0 ? 'var(--danger)' : 'var(--warning)';
    return `<tr>
      <td class="td-id">${escHtml(r.id)}</td>
      <td>
        <div style="font-weight:600;font-size:12px">${escHtml(r.equipmentType)}</div>
        <div style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono)">${escHtml(r.serialNo)}</div>
      </td>
      <td style="font-size:12px">${escHtml(r.location)}</td>
      <td style="font-size:11px;color:var(--text-secondary)">${escHtml(r.manufacturer)}</td>
      <td style="font-size:11px;font-family:var(--font-mono)">${escHtml(r.capacity)}</td>
      <td style="font-size:11px;font-family:var(--font-mono)">${escHtml(r.designPressure)}</td>
      <td>${cfRegBadge(r.cfRegStatus)}</td>
      <td>${cfForm27cBadge(r.form27c)}</td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <div style="background:var(--bg-dark);border-radius:3px;height:6px;overflow:hidden;width:60px">
            <div style="width:${pct}%;background:${pCol};height:100%;border-radius:3px"></div>
          </div>
          <span style="font-size:10px;font-family:var(--font-mono);color:${pCol}">${pct}%</span>
        </div>
      </td>
      <td style="font-size:11px">${escHtml(r.pic)}</td>
      <td style="font-size:11px;color:var(--text-muted)">${escHtml(r.lastUpdated)}</td>
      <td class="td-action" style="white-space:nowrap">
        <button class="btn-sys btn-outline btn-xs" onclick="openCFDetail('${r.id}')" title="View Details"><i class="fa-solid fa-eye"></i></button>
        ${canEdit(user) ? `<button class="btn-sys btn-outline btn-xs" onclick="openCFEdit('${r.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>` : ''}
        <a href="${escHtml(r.photoUrl)}" target="_blank" class="btn-sys btn-outline btn-xs" title="View Photo" style="text-decoration:none"><i class="fa-solid fa-image"></i></a>
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="12" style="text-align:center;color:var(--text-muted);padding:24px">No records match your filters</td></tr>`;

  const rcnt = document.getElementById('cf-rcnt');
  if (rcnt) rcnt.textContent = filtered.length + ' equipment';
}

// ── Document Checklist Matrix ─────────────────────────────────
function renderCFDocMatrix() {
  const data = getCFData();
  const container = document.getElementById('cf-doc-matrix');
  if (!container) return;

  container.innerHTML = data.map(r => {
    const have  = CF_DOCS.filter(d => r.docs && r.docs[d.key]).length;
    const total = CF_DOCS.length;
    const pct   = Math.round(have / total * 100);
    const color = pct === 100 ? 'var(--success)' : pct === 0 ? 'var(--danger)' : 'var(--warning)';

    const docItems = CF_DOCS.map(d => {
      const ok = r.docs && r.docs[d.key];
      return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:14px">${ok ? '✅' : '❌'}</span>
        <span style="font-size:11px;color:${ok?'var(--text-secondary)':'var(--danger)'}">${escHtml(d.label)}</span>
        ${!ok && canEdit(getCurrentUser()) ? `<button class="btn-sys btn-success-outline btn-xs" style="margin-left:auto" onclick="cfMarkDocReceived('${r.id}','${d.key}')">Mark Received</button>` : ''}
      </div>`;
    }).join('');

    return `<div style="background:var(--bg-card2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;border-top:3px solid ${color}">
      <div style="padding:10px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:8px">
        <div>
          <div style="font-family:var(--font-head);font-size:13px;font-weight:700">${escHtml(r.id)} — ${escHtml(r.equipmentType)}</div>
          <div style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono)">${escHtml(r.serialNo)} · ${escHtml(r.location)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-head);font-size:18px;font-weight:800;color:${color}">${pct}%</div>
          <div style="font-size:9px;color:var(--text-muted)">${have}/${total} docs</div>
        </div>
      </div>
      <div style="padding:6px 14px">${docItems}</div>
      <div style="padding:8px 14px;background:var(--bg-dark);font-size:10px;color:var(--text-muted);border-top:1px solid var(--border)">
        <i class="fa-solid fa-person-digging"></i> Form 27C: <span style="color:${r.form27c==='Not Started'?'var(--danger)':r.form27c==='Pending Submission'?'var(--warning)':'var(--success)'};font-weight:600">${escHtml(r.form27c)}</span>
        &nbsp;·&nbsp; PIC: ${escHtml(r.pic)}
      </div>
    </div>`;
  }).join('');
}

// Mark a document as received
function cfMarkDocReceived(id, docKey) {
  const user = getCurrentUser();
  if (!canEdit(user)) { showToast('Insufficient permissions.','error'); return; }
  const data = getCFData();
  const rec  = data.find(r => r.id === id);
  if (!rec) return;
  if (!rec.docs) rec.docs = {};
  rec.docs[docKey] = true;
  rec.lastUpdated = today();
  // Auto-update docStatus
  const have = CF_DOCS.filter(d => rec.docs[d.key]).length;
  rec.docStatus = have === CF_DOCS.length ? 'complete' : have === 0 ? 'missing' : 'incomplete';
  saveCFData(data);
  showToast('Document marked as received.', 'success');
  renderCFTracker();
}

// ── Detail Modal ──────────────────────────────────────────────
function openCFDetail(id) {
  const data = getCFData();
  const r    = data.find(rec => rec.id === id);
  if (!r) return;

  const have  = CF_DOCS.filter(d => r.docs && r.docs[d.key]).length;
  const pct   = Math.round(have / CF_DOCS.length * 100);
  const color = pct === 100 ? 'var(--success)' : pct === 0 ? 'var(--danger)' : 'var(--warning)';

  const docList = CF_DOCS.map(d => {
    const ok = r.docs && r.docs[d.key];
    return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:13px">${ok ? '✅' : '❌'}</span>
      <span style="font-size:12px;color:${ok?'var(--text-primary)':'var(--danger)'}">${escHtml(d.label)}</span>
    </div>`;
  }).join('');

  const modal = document.getElementById('cf-detail-modal');
  document.getElementById('cf-detail-title').textContent = `${r.id} — ${r.equipmentType}`;
  document.getElementById('cf-detail-body').innerHTML = `
    <!-- Equipment info -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div>
        <div class="form-label">Equipment Type</div>
        <div style="font-weight:600">${escHtml(r.equipmentType)}</div>
      </div>
      <div>
        <div class="form-label">Location</div>
        <div>${escHtml(r.location)}</div>
      </div>
      <div>
        <div class="form-label">Manufacturer</div>
        <div style="font-size:12px">${escHtml(r.manufacturer)}</div>
      </div>
      <div>
        <div class="form-label">Serial No</div>
        <div style="font-family:var(--font-mono);font-size:12px">${escHtml(r.serialNo)}</div>
      </div>
      <div>
        <div class="form-label">Capacity</div>
        <div style="font-family:var(--font-mono)">${escHtml(r.capacity)}</div>
      </div>
      <div>
        <div class="form-label">Design Pressure</div>
        <div style="font-family:var(--font-mono)">${escHtml(r.designPressure)}</div>
      </div>
      <div>
        <div class="form-label">Design Temperature</div>
        <div style="font-family:var(--font-mono)">${escHtml(r.designTemp)}</div>
      </div>
      <div>
        <div class="form-label">Operating Status</div>
        <div>${escHtml(r.operatingStatus)}</div>
      </div>
    </div>
    <div class="divider"></div>

    <!-- CF Status -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div>
        <div class="form-label">CF / Exemption Status</div>
        <div style="font-size:12px;color:var(--warning)">${escHtml(r.cfExemptionStatus)}</div>
      </div>
      <div>
        <div class="form-label">CF Registration Status</div>
        ${cfRegBadge(r.cfRegStatus)}
      </div>
      <div>
        <div class="form-label">Form 27C Status</div>
        ${cfForm27cBadge(r.form27c)}
      </div>
      <div>
        <div class="form-label">Authority</div>
        <div>${escHtml(r.authority)}</div>
      </div>
    </div>

    <!-- Progress bar -->
    <div style="background:var(--bg-card2);border:1px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:12px;font-weight:600">Document Completeness</span>
        <span style="font-family:var(--font-mono);font-size:12px;color:${color}">${pct}% (${have}/${CF_DOCS.length})</span>
      </div>
      <div style="background:var(--bg-dark);border-radius:4px;height:8px;overflow:hidden">
        <div style="width:${pct}%;background:${color};height:100%;border-radius:4px;transition:width .6s"></div>
      </div>
    </div>

    <!-- Doc checklist -->
    <div style="margin-bottom:14px">
      <div class="form-label" style="margin-bottom:6px">Document Checklist (Required for Form 27C)</div>
      ${docList}
    </div>
    <div class="divider"></div>

    <!-- Progress note & remarks -->
    <div class="form-group">
      <div class="form-label">Registration Progress</div>
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;background:var(--bg-card2);padding:10px;border-radius:var(--radius);border:1px solid var(--border)">${escHtml(r.regProgress)}</div>
    </div>
    <div class="form-group">
      <div class="form-label">Remarks</div>
      <div style="font-size:12px;color:var(--text-secondary)">${escHtml(r.remarks)}</div>
    </div>
    <div style="display:flex;gap:8px;margin-top:4px">
      <div>
        <div class="form-label">PIC</div>
        <div style="font-size:12px">${escHtml(r.pic)}</div>
      </div>
      <div style="margin-left:auto">
        <div class="form-label">Last Updated</div>
        <div style="font-size:12px;font-family:var(--font-mono)">${escHtml(r.lastUpdated)}</div>
      </div>
    </div>
    <div style="margin-top:12px">
      <a href="${escHtml(r.photoUrl)}" target="_blank" class="btn-sys btn-outline btn-sm">
        <i class="fa-solid fa-image"></i> View Equipment Photo
      </a>
    </div>
  `;
  modal.classList.add('show');
}

// ── Edit modal ────────────────────────────────────────────────
function openCFEdit(id) {
  const data = getCFData();
  const r    = data.find(rec => rec.id === id) || {};
  document.getElementById('cfe-f-id').value         = r.id || '';
  document.getElementById('cfe-f-equipmentType').value = r.equipmentType || '';
  document.getElementById('cfe-f-location').value   = r.location || '';
  document.getElementById('cfe-f-serialNo').value   = r.serialNo || '';
  document.getElementById('cfe-f-cfRegStatus').value= r.cfRegStatus || 'Not Registered';
  document.getElementById('cfe-f-form27c').value    = r.form27c || 'Not Started';
  document.getElementById('cfe-f-pic').value        = r.pic || '';
  document.getElementById('cfe-f-regProgress').value= r.regProgress || '';
  document.getElementById('cfe-f-remarks').value    = r.remarks || '';
  // Docs checkboxes
  CF_DOCS.forEach(d => {
    const cb = document.getElementById('cfe-doc-'+d.key);
    if (cb) cb.checked = !!(r.docs && r.docs[d.key]);
  });
  document.getElementById('cf-edit-modal').classList.add('show');
}

function saveCFEdit() {
  const user = getCurrentUser();
  if (!canEdit(user)) { showToast('Insufficient permissions.','error'); return; }
  const data = getCFData();
  const id   = document.getElementById('cfe-f-id').value;
  const rec  = data.find(r => r.id === id);
  if (!rec) return;
  rec.cfRegStatus  = document.getElementById('cfe-f-cfRegStatus').value;
  rec.form27c      = document.getElementById('cfe-f-form27c').value;
  rec.pic          = document.getElementById('cfe-f-pic').value.trim();
  rec.regProgress  = document.getElementById('cfe-f-regProgress').value.trim();
  rec.remarks      = document.getElementById('cfe-f-remarks').value.trim();
  rec.lastUpdated  = today();
  if (!rec.docs) rec.docs = {};
  CF_DOCS.forEach(d => {
    const cb = document.getElementById('cfe-doc-'+d.key);
    if (cb) rec.docs[d.key] = cb.checked;
  });
  const have = CF_DOCS.filter(d => rec.docs[d.key]).length;
  rec.docStatus = have === CF_DOCS.length ? 'complete' : have === 0 ? 'missing' : 'incomplete';
  saveCFData(data);
  document.getElementById('cf-edit-modal').classList.remove('show');
  showToast('CF record updated.','success');
  renderCFTracker();
}

// ── Excel Export ──────────────────────────────────────────────
function exportCFExcel() {
  const XLSX = window.XLSX;
  const wb   = XLSX.utils.book_new();
  const data = getCFData();
  const now  = new Date().toISOString().split('T')[0];

  // Summary sheet
  const kpi = calcCFKPIs();
  const sumRows = [
    ['KKIP Water Bottling Factory — CF Status Summary'],
    [`Generated: ${now} | Total Equipment: ${kpi.total}`],
    [],
    ['KPI', 'Value'],
    ['Total Equipment', kpi.total],
    ['CF Registered', kpi.registered],
    ['Not Registered', kpi.notRegistered],
    ['Registration In Progress / Pending', kpi.inProgress],
    ['Documents Complete', kpi.docsComplete],
    ['Documents Missing', kpi.docsMissing],
    ['Documents Partial', kpi.docsPartial],
    ['Form 27C Pending / Not Started', kpi.form27cPending],
    ['Air Receivers', kpi.airReceivers],
    ['Air Compressors', kpi.airCompressors]
  ];
  const sumWs = XLSX.utils.aoa_to_sheet(sumRows);
  sumWs['!cols'] = [{wch:40},{wch:16}];
  XLSX.utils.book_append_sheet(wb, sumWs, 'Summary');

  // Main register
  const headers = [
    'ID','Equipment Type','Location','Manufacturer','Serial No',
    'Capacity','Design Pressure','Design Temp',
    'CF Status','CF Reg Status','Form 27C',
    "Mfr's Data Report",'Surat Kelulusan JKKP','Sijil Verifikasi JKKP',
    'Safety Relief Valve','Pressure Gauge Calib','Nameplate',
    'Doc Completeness %','PIC','Last Updated','Remarks','Photo URL'
  ];
  const rows = data.map(r => {
    const have = CF_DOCS.filter(d => r.docs && r.docs[d.key]).length;
    const pct  = Math.round(have / CF_DOCS.length * 100) + '%';
    return [
      r.id, r.equipmentType, r.location, r.manufacturer, r.serialNo,
      r.capacity, r.designPressure, r.designTemp,
      r.cfExemptionStatus, r.cfRegStatus, r.form27c,
      r.docs?.manufacturerDataReport ? 'YES':'NO',
      r.docs?.suratKelulusanJKKP     ? 'YES':'NO',
      r.docs?.sijilVerifikasiJKKP    ? 'YES':'NO',
      r.docs?.safetyReliefValve      ? 'YES':'NO',
      r.docs?.pressureGaugeCalib     ? 'YES':'NO',
      r.docs?.nameplate              ? 'YES':'NO',
      pct, r.pic, r.lastUpdated, r.remarks, r.photoUrl
    ];
  });
  const mainWs = XLSX.utils.aoa_to_sheet([
    ['KKIP Water Bottling Factory — CF Equipment Register'],
    [`Jetama Water Sdn Bhd | SHE Division | ${now}`],
    [], headers, ...rows
  ]);
  mainWs['!cols'] = [
    {wch:8},{wch:24},{wch:22},{wch:30},{wch:16},
    {wch:14},{wch:16},{wch:14},{wch:26},{wch:16},{wch:18},
    {wch:16},{wch:22},{wch:22},{wch:20},{wch:20},{wch:12},
    {wch:16},{wch:18},{wch:12},{wch:40},{wch:60}
  ];
  XLSX.utils.book_append_sheet(wb, mainWs, 'CF Equipment Register');

  // Critical action sheet (missing docs)
  const critical = data.filter(r => CF_DOCS.some(d => !r.docs || !r.docs[d.key]));
  const critRows = critical.map(r => {
    const missing = CF_DOCS.filter(d => !r.docs || !r.docs[d.key]).map(d => d.label).join('; ');
    return [r.id, r.equipmentType, r.location, r.serialNo, r.cfRegStatus, r.form27c, missing, r.pic];
  });
  const critWs = XLSX.utils.aoa_to_sheet([
    ['KKIP CF — Critical: Missing Documents'],
    [`${critical.length} equipment items require document action`],
    [],
    ['ID','Equipment','Location','Serial No','CF Status','Form 27C','Missing Documents','PIC'],
    ...critRows
  ]);
  critWs['!cols'] = [{wch:8},{wch:24},{wch:20},{wch:16},{wch:18},{wch:18},{wch:80},{wch:18}];
  XLSX.utils.book_append_sheet(wb, critWs, 'Action Required');

  XLSX.writeFile(wb, `KKIP_CF_Status_${now}.xlsx`);
  showToast('CF Status report exported!', 'success');
}

/* ============================================================
   CF EXISTING REGISTER — Plants 2026
   Source: CF_RENEWAL_FOR_2028.pdf
   Locations: MWTP (H/K/0980), KWTP (H/K/1039), Telibong 1 WTP
   ============================================================ */

const CF_EXISTING_KEY = 'hse_cf_existing';

const CF_EXISTING_SEED = [
  // ── MWTP H/K/0980 ──────────────────────────────────────────
  { id:'EX-001', location:'MWTP', locationRef:'H/K/0980', noJentera:'SB-PMT-89319', item:'Pneumatic Tank',                      dateInspected:'17/5/2018',  cfExpiry:'16/8/2019',  status:'NOT IN USED', cfStatus:'Expired',       daysToExpiry: null },
  { id:'EX-002', location:'MWTP', locationRef:'H/K/0980', noJentera:'SB-PMD-80563', item:'Autoclave',                           dateInspected:'16/5/2025',  cfExpiry:'15/8/2026',  status:'ACTIVE',      cfStatus:'Active',        daysToExpiry: null },
  { id:'EX-003', location:'MWTP', locationRef:'H/K/0980', noJentera:'SB-PMA-41283', item:'Double Girder O/H Travelling Crane',  dateInspected:'17/9/2025',  cfExpiry:'16/12/2026', status:'ACTIVE',      cfStatus:'Active',        daysToExpiry: null },
  { id:'EX-004', location:'MWTP', locationRef:'H/K/0980', noJentera:'SB-PMA-70854', item:'Double Girder O/T Crane',             dateInspected:'17/9/2025',  cfExpiry:'16/12/2026', status:'ACTIVE',      cfStatus:'Active',        daysToExpiry: null },
  { id:'EX-005', location:'MWTP', locationRef:'H/K/0980', noJentera:'SB-PMA-71144', item:'Overhead Travelling Crane',           dateInspected:'17/9/2025',  cfExpiry:'16/12/2026', status:'ACTIVE',      cfStatus:'Active',        daysToExpiry: null },
  { id:'EX-006', location:'MWTP', locationRef:'H/K/0980', noJentera:'SB-PMT-1911',  item:'Air Receiver',                       dateInspected:'17/9/2025',  cfExpiry:'16/12/2026', status:'ACTIVE',      cfStatus:'Active',        daysToExpiry: null },
  { id:'EX-007', location:'MWTP', locationRef:'H/K/0980', noJentera:'SB-PMT-90016', item:'Surge Vessel',                       dateInspected:'17/9/2025',  cfExpiry:'16/12/2026', status:'ACTIVE',      cfStatus:'Active',        daysToExpiry: null },
  { id:'EX-008', location:'MWTP', locationRef:'H/K/0980', noJentera:'SB-PMT-89318', item:'Air Receiver',                       dateInspected:'17/9/2025',  cfExpiry:'16/12/2026', status:'ACTIVE',      cfStatus:'Active',        daysToExpiry: null },
  { id:'EX-009', location:'MWTP', locationRef:'H/K/0980', noJentera:'SB-PMT-13062', item:'Air Receiver',                       dateInspected:'17/9/2025',  cfExpiry:'16/12/2026', status:'ACTIVE',      cfStatus:'Active',        daysToExpiry: null },
  { id:'EX-010', location:'MWTP', locationRef:'H/K/0980', noJentera:'SB-PMT-147940',item:'Air Receiver',                       dateInspected:'3/9/2025',   cfExpiry:'2/12/2026',  status:'ACTIVE',      cfStatus:'Active',        daysToExpiry: null },
  // ── KWTP H/K/1039 ──────────────────────────────────────────
  { id:'EX-011', location:'KWTP', locationRef:'H/K/1039', noJentera:'SB-PMA-9066',  item:'Electric Chain Hoist',               dateInspected:'2/6/2016',   cfExpiry:'1/9/2017',   status:'NOT IN USED', cfStatus:'Expired',       daysToExpiry: null },
  { id:'EX-012', location:'KWTP', locationRef:'H/K/1039', noJentera:'SB-PMT-13063', item:'Air Receiver',                       dateInspected:'17/9/2025',  cfExpiry:'16/12/2026', status:'ACTIVE',      cfStatus:'Active',        daysToExpiry: null },
  // ── TELIBONG 1 WTP SB/12/10/2007 ───────────────────────────
  { id:'EX-013', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMA-12047', item:'Electric Hoist (Generator Room)',          dateInspected:'15/12/2022', cfExpiry:'14/3/2024',  status:'NOT IN USED', cfStatus:'Expired',  daysToExpiry: null },
  { id:'EX-014', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMA-12048', item:'Mini-Duobeam E.O.T Crane (Pump House)',    dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-015', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMA-80192', item:'Monorail Crane',                           dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-016', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMA-80193', item:'Monorail Crane',                           dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-017', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMA-80602', item:'Monorail Crane',                           dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-018', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMT-13089', item:'Air Receiver',                             dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-019', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMT-81710', item:'Air/Vacuum/N2 Tank 500L (-1/10.34 bar)',   dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-020', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMT-81711', item:'MS Surge Vessel 10 bar OD915 x 1524SL',   dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-021', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMT-81712', item:'Air Receiver',                             dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-022', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMT-81713', item:'Air Receiver',                             dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-023', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMT-81714', item:'Air Receiver',                             dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-024', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMT-81715', item:'Air Receiver',                             dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-025', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMT-89628', item:'Surge Vessel',                             dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-026', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMT-89629', item:'Air Receiver',                             dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null },
  { id:'EX-027', location:'Telibong 1 WTP', locationRef:'SB/12/10/2007', noJentera:'SB-PMT-82203', item:'Air Tank',                                 dateInspected:'18/9/2025',  cfExpiry:'17/12/2026', status:'ACTIVE',      cfStatus:'Active',   daysToExpiry: null }
];

// Seed
function cfExistingSeed() {
  if (!localStorage.getItem(CF_EXISTING_KEY)) {
    localStorage.setItem(CF_EXISTING_KEY, JSON.stringify(CF_EXISTING_SEED));
  }
}

function getCFExistingData() {
  cfExistingSeed();
  return JSON.parse(localStorage.getItem(CF_EXISTING_KEY) || '[]');
}

// Parse DD/MM/YYYY expiry → days diff from today
function cfExpiryDays(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const d = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.round((d - today) / 86400000);
}

function cfExpiryStatus(dateStr, status) {
  if (status === 'NOT IN USED') return { label:'Not In Use', cls:'badge-status badge-open', color:'var(--text-muted)' };
  const diff = cfExpiryDays(dateStr);
  if (diff === null) return { label:'Unknown', cls:'badge-status badge-open', color:'var(--text-muted)' };
  if (diff < 0)   return { label:'CF Expired', cls:'badge-status badge-expired', color:'var(--danger)' };
  if (diff <= 90) return { label:'Expiring Soon', cls:'badge-status badge-expiring', color:'var(--warning)' };
  return { label:'CF Active', cls:'badge-status badge-valid', color:'var(--success)' };
}

function cfExpiryBadge(dateStr, status) {
  const s = cfExpiryStatus(dateStr, status);
  return `<span class="${s.cls}">${s.label}</span>`;
}

function cfRenewalBadge(dateStr, status) {
  if (status === 'NOT IN USED') return '<span style="font-size:10px;color:var(--text-muted)">—</span>';
  const diff = cfExpiryDays(dateStr);
  if (diff === null) return '—';
  if (diff < 0)   return `<span class="aging-badge aging-over">${Math.abs(diff)}d overdue</span>`;
  if (diff <= 30) return `<span class="aging-badge aging-warn">${diff}d left</span>`;
  if (diff <= 90) return `<span class="aging-badge aging-warn">${diff}d left</span>`;
  return `<span class="aging-badge aging-ok">${diff}d left</span>`;
}

// ── KPIs for existing CF ──────────────────────────────────────
function calcCFExistingKPIs() {
  const data = getCFExistingData();
  const active    = data.filter(r=>r.status==='ACTIVE');
  const expired   = data.filter(r=>{ const d=cfExpiryDays(r.cfExpiry); return d!==null&&d<0&&r.status==='ACTIVE'; });
  const expiring  = data.filter(r=>{ const d=cfExpiryDays(r.cfExpiry); return d!==null&&d>=0&&d<=90&&r.status==='ACTIVE'; });
  const notInUse  = data.filter(r=>r.status==='NOT IN USED');
  return {
    total:    data.length,
    active:   active.length,
    expired:  expired.length,
    expiring: expiring.length,
    notInUse: notInUse.length,
    needRenewal: expired.length + expiring.length
  };
}

// ── Render existing CF tab ────────────────────────────────────
let cfExFilter = { location:'', itemType:'', cfStatus:'', search:'' };

function renderCFExisting() {
  cfExistingSeed();
  const kpi = calcCFExistingKPIs();

  const el = id => document.getElementById(id);
  if(el('cfex-kpi-total'))    el('cfex-kpi-total').textContent    = kpi.total;
  if(el('cfex-kpi-active'))   el('cfex-kpi-active').textContent   = kpi.active;
  if(el('cfex-kpi-expired'))  el('cfex-kpi-expired').textContent  = kpi.expired;
  if(el('cfex-kpi-expiring')) el('cfex-kpi-expiring').textContent = kpi.expiring;
  if(el('cfex-kpi-notuse'))   el('cfex-kpi-notuse').textContent   = kpi.notInUse;
  if(el('cfex-kpi-renew'))    el('cfex-kpi-renew').textContent    = kpi.needRenewal;

  renderCFExistingTable();
  renderCFExistingByLocation();
}

function renderCFExistingTable() {
  const data = getCFExistingData();
  const { location, itemType, cfStatus, search } = cfExFilter;

  const filtered = data.filter(r => {
    if (location && r.location !== location) return false;
    if (itemType) {
      const t = r.item.toLowerCase();
      if (itemType==='crane'    && !t.includes('crane')&&!t.includes('hoist')) return false;
      if (itemType==='receiver' && !t.includes('receiver')&&!t.includes('tank')&&!t.includes('vessel')) return false;
      if (itemType==='other'    && (t.includes('crane')||t.includes('hoist')||t.includes('receiver')||t.includes('tank')||t.includes('vessel'))) return false;
    }
    if (cfStatus) {
      const s = cfExpiryStatus(r.cfExpiry, r.status);
      if (cfStatus==='active'   && s.label!=='CF Active')     return false;
      if (cfStatus==='expiring' && s.label!=='Expiring Soon') return false;
      if (cfStatus==='expired'  && s.label!=='CF Expired')    return false;
      if (cfStatus==='notinuse' && r.status!=='NOT IN USED')  return false;
    }
    if (search && !(r.noJentera+r.item+r.location).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Sort: expired/expiring first, then by location
  filtered.sort((a,b)=>{
    const sa = cfExpiryStatus(a.cfExpiry,a.status);
    const sb = cfExpiryStatus(b.cfExpiry,b.status);
    const order = {'CF Expired':0,'Expiring Soon':1,'CF Active':2,'Not In Use':3,'Unknown':4};
    const od = (order[sa.label]??5)-(order[sb.label]??5);
    if (od!==0) return od;
    return a.location.localeCompare(b.location);
  });

  const tbody = document.getElementById('cfex-tbody');
  if (!tbody) return;
  const rcnt = document.getElementById('cfex-rcnt');
  if (rcnt) rcnt.textContent = filtered.length + ' items';

  const user = getCurrentUser();
  tbody.innerHTML = filtered.map(r => {
    const s       = cfExpiryStatus(r.cfExpiry, r.status);
    const diff    = cfExpiryDays(r.cfExpiry);
    const isNotUse= r.status === 'NOT IN USED';
    const needsRenewal = !isNotUse && diff !== null && diff <= 90;

    // Task description for assign modal
    const taskDesc = `CF Renewal — ${r.noJentera} (${r.item}) at ${r.location}. CF Expiry: ${r.cfExpiry}. Schedule DOSH inspection for renewal.`;

    return `<tr style="${s.label==='CF Expired'?'border-left:3px solid var(--danger)':s.label==='Expiring Soon'?'border-left:3px solid var(--warning)':isNotUse?'opacity:0.6':''}">
      <td class="td-id" style="font-size:10px">${escHtml(r.id)}</td>
      <td>
        <div style="font-size:11px;font-family:var(--font-mono);color:var(--accent);font-weight:700">${escHtml(r.location)}</div>
        <div style="font-size:9px;color:var(--text-muted);font-family:var(--font-mono)">${escHtml(r.locationRef)}</div>
      </td>
      <td>
        <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--accent2)">${escHtml(r.noJentera)}</div>
      </td>
      <td>
        <div style="font-size:12px;font-weight:600">${escHtml(r.item)}</div>
      </td>
      <td style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono)">${escHtml(r.dateInspected)}</td>
      <td style="font-size:11px;font-family:var(--font-mono);font-weight:${diff!==null&&diff<=90?'700':'400'};color:${diff!==null&&diff<0?'var(--danger)':diff!==null&&diff<=90?'var(--warning)':'var(--text-primary)'}">${escHtml(r.cfExpiry)}</td>
      <td>${cfExpiryBadge(r.cfExpiry, r.status)}</td>
      <td>${cfRenewalBadge(r.cfExpiry, r.status)}</td>
      <td>
        ${isNotUse
          ? '<span style="font-size:10px;color:var(--text-muted)">Decommissioned — no action</span>'
          : needsRenewal
            ? `<span style="font-size:10px;color:var(--warning);font-weight:600"><i class="fa-solid fa-rotate"></i> Schedule renewal inspection</span>`
            : '<span style="font-size:10px;color:var(--success)">No action required</span>'}
      </td>
      <td class="td-action">
        ${canEdit(user) ? `
          <button class="btn-sys btn-outline btn-xs" onclick="editCFExisting('${r.id}')" title="Edit record"><i class="fa-solid fa-pen"></i></button>
          ${!isNotUse ? `<button class="btn-sys btn-xs" onclick="openAssignTask('cf','${r.id}',${JSON.stringify(taskDesc).replace(/'/g,"\\'")},'${escHtml(r.cfExpiry)}')"
            title="Assign renewal task to coordinator"
            style="background:rgba(0,212,170,.15);color:var(--accent2);border:1px solid var(--accent2);border-radius:var(--radius);cursor:pointer;padding:2px 8px;font-size:11px;white-space:nowrap">
            <i class="fa-solid fa-user-plus"></i>
          </button>` : ''}
        ` : '—'}
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="10" style="text-align:center;color:var(--text-muted);padding:24px">No records found</td></tr>`;
}

function renderCFExistingByLocation() {
  const data      = getCFExistingData();
  const locations = [...new Set(data.map(r=>r.location))];
  const container = document.getElementById('cfex-byloc');
  if (!container) return;

  container.innerHTML = locations.map(loc => {
    const items   = data.filter(r=>r.location===loc);
    const expired = items.filter(r=>{ const d=cfExpiryDays(r.cfExpiry); return d!==null&&d<0&&r.status==='ACTIVE'; }).length;
    const expiring= items.filter(r=>{ const d=cfExpiryDays(r.cfExpiry); return d!==null&&d>=0&&d<=90&&r.status==='ACTIVE'; }).length;
    const active  = items.filter(r=>r.status==='ACTIVE'&&!cfExpiryDays(r.cfExpiry)<0).length;
    const notUse  = items.filter(r=>r.status==='NOT IN USED').length;
    const locRef  = items[0]?.locationRef || '';
    const color   = expired>0?'var(--danger)':expiring>0?'var(--warning)':'var(--success)';
    const pct     = items.length ? Math.round((items.filter(r=>r.status==='ACTIVE').length/items.length)*100) : 0;

    return `<div style="background:var(--bg-card2);border:1px solid var(--border);border-top:3px solid ${color};border-radius:var(--radius);padding:12px 16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-family:var(--font-head);font-size:15px;font-weight:800">${escHtml(loc)}</div>
          <div style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono)">${escHtml(locRef)} · ${items.length} equipment</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-head);font-size:22px;font-weight:800;color:${color}">${pct}%</div>
          <div style="font-size:9px;color:var(--text-muted)">CF Active</div>
        </div>
      </div>
      <div style="background:var(--bg-dark);border-radius:3px;height:6px;overflow:hidden;margin-bottom:10px">
        <div style="width:${pct}%;background:${color};height:100%;border-radius:3px;transition:width .5s"></div>
      </div>
      <div style="display:flex;gap:10px;font-size:11px;font-family:var(--font-mono);flex-wrap:wrap">
        <span style="color:var(--success)">${active} Active</span>
        <span style="color:var(--warning)">${expiring} Expiring</span>
        <span style="color:var(--danger)">${expired} Expired CF</span>
        <span style="color:var(--text-muted)">${notUse} Not In Use</span>
      </div>
    </div>`;
  }).join('');
}

// ── Edit existing CF record ───────────────────────────────────
function editCFExisting(id) {
  const data = getCFExistingData();
  const r    = data.find(rec=>rec.id===id);
  if (!r) return;
  // Reuse cfex edit modal
  const modal = document.getElementById('cfex-edit-modal');
  if (!modal) { showToast('Edit modal not found.','error'); return; }
  document.getElementById('cfex-f-id').value            = r.id;
  document.getElementById('cfex-f-noJentera').value     = r.noJentera;
  document.getElementById('cfex-f-item').value          = r.item;
  document.getElementById('cfex-f-location').value      = r.location;
  document.getElementById('cfex-f-dateInspected').value = r.dateInspected;
  document.getElementById('cfex-f-cfExpiry').value      = r.cfExpiry;
  document.getElementById('cfex-f-status').value        = r.status;
  modal.classList.add('show');
}

function saveCFExisting() {
  const user = getCurrentUser();
  if (!canEdit(user)) { showToast('Insufficient permissions.','error'); return; }
  const data = getCFExistingData();
  const id   = document.getElementById('cfex-f-id').value;
  const rec  = data.find(r=>r.id===id);
  if (!rec) return;
  rec.dateInspected = document.getElementById('cfex-f-dateInspected').value.trim();
  rec.cfExpiry      = document.getElementById('cfex-f-cfExpiry').value.trim();
  rec.status        = document.getElementById('cfex-f-status').value.trim();
  localStorage.setItem(CF_EXISTING_KEY, JSON.stringify(data));
  document.getElementById('cfex-edit-modal').classList.remove('show');
  showToast('CF record updated.','success');
  renderCFExisting();
}

// ── Export existing CF to Excel ───────────────────────────────
function exportCFExistingExcel() {
  const XLSX = window.XLSX;
  const data = getCFExistingData();
  const wb   = XLSX.utils.book_new();
  const now  = new Date().toISOString().split('T')[0];

  const kpi = calcCFExistingKPIs();
  const sumWs = XLSX.utils.aoa_to_sheet([
    ['CF Renewal Register — Plants 2026'],
    [`Generated: ${now} | Total Equipment: ${kpi.total}`],[],
    ['KPI','Value'],
    ['Total Equipment', kpi.total],
    ['CF Active', kpi.active],
    ['CF Expired', kpi.expired],
    ['Expiring Soon (≤90 days)', kpi.expiring],
    ['Not In Use', kpi.notInUse],
    ['Requiring Renewal Action', kpi.needRenewal]
  ]);
  sumWs['!cols']=[{wch:32},{wch:12}];
  XLSX.utils.book_append_sheet(wb, sumWs, 'Summary');

  const h = ['ID','Location','Ref No','No. Jentera','Equipment Item','Date Inspected','CF Expiry Date','Status','Days to Expiry','CF Status','Action Required'];
  const rows = data.map(r=>{
    const diff = cfExpiryDays(r.cfExpiry);
    const s    = cfExpiryStatus(r.cfExpiry, r.status);
    const action = r.status==='NOT IN USED'?'Decommissioned':diff!==null&&diff<=90?'Schedule Renewal Inspection':'No Action Required';
    return [r.id,r.location,r.locationRef,r.noJentera,r.item,r.dateInspected,r.cfExpiry,r.status,diff!==null?diff:'N/A',s.label,action];
  });
  const ws = XLSX.utils.aoa_to_sheet([
    ['CF Renewal Register — Plants 2026'],[`Jetama Water Sdn Bhd | SHE Division | ${now}`],[],
    h,...rows
  ]);
  ws['!cols']=[{wch:8},{wch:16},{wch:14},{wch:16},{wch:48},{wch:16},{wch:16},{wch:12},{wch:14},{wch:16},{wch:28}];
  XLSX.utils.book_append_sheet(wb, ws, 'CF Register');

  // Renewal action sheet
  const renewal = data.filter(r=>{ const d=cfExpiryDays(r.cfExpiry); return d!==null&&d<=90&&r.status==='ACTIVE'; });
  if (renewal.length) {
    const rRows = renewal.map(r=>{ const d=cfExpiryDays(r.cfExpiry); return [r.id,r.location,r.noJentera,r.item,r.cfExpiry,d!==null?d:'N/A','Schedule Renewal Inspection']; });
    const rWs = XLSX.utils.aoa_to_sheet([
      ['CF Renewal Action Required'],[`${renewal.length} items due for renewal`],[],
      ['ID','Location','No. Jentera','Item','CF Expiry','Days Left','Action'],...rRows
    ]);
    rWs['!cols']=[{wch:8},{wch:16},{wch:16},{wch:48},{wch:16},{wch:12},{wch:30}];
    XLSX.utils.book_append_sheet(wb, rWs, 'Renewal Action');
  }

  XLSX.writeFile(wb, `CF_Renewal_Register_${now}.xlsx`);
  showToast('CF Existing Register exported!','success');
}
