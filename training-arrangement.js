/* ============================================================
   training-arrangement.js
   Jetama Water Sdn. Bhd. — HSE Training Arrangement 2026
   Source: SHE-CAL-2026 Version 2.0, April 2026
   Cross-checks HSE Calendar against training records
   ============================================================ */

'use strict';

// ── 2026 HSE Calendar Data ────────────────────────────────────
// Status: Done | In Progress | Pending Approval | Planned | TBD
const HSE_CALENDAR_2026 = [
  // ── APRIL ──────────────────────────────────────────────────
  { id:'CAL-001', month:'April',   no:'1.0', event:'Safety Committee Meeting Q2 (North)',          participants:'Safety Committee',                        type:'Meeting',           pic:'HL, RRi',       date:'06 Apr 2026',    status:'Done',             remarks:'' },
  { id:'CAL-002', month:'April',   no:'2.0', event:'Confined Space – AESP',                        participants:'Confined Space Personnel',                 type:'External Training', pic:'NIOSH',         date:'07–08 Apr 2026', status:'Done',             remarks:'' },
  { id:'CAL-003', month:'April',   no:'3.0', event:'Safety Committee Meeting Q2 (South)',          participants:'Safety Committee',                        type:'Meeting',           pic:'HL, RRi',       date:'17 Apr 2026',    status:'In Progress',      remarks:'' },
  { id:'CAL-004', month:'April',   no:'4.0', event:'Scaffolding Training',                         participants:'B&G & North Maintenance Personnel',        type:'External Training', pic:'CIDB',          date:'10–19 Apr 2026', status:'In Progress',      remarks:'' },
  { id:'CAL-005', month:'April',   no:'5.0', event:'RTSMS Committee Meeting',                      participants:'RTS Committee',                           type:'Meeting',           pic:'RRI',           date:'21 Apr 2026',    status:'Planned',          remarks:'' },
  // ── MAY ────────────────────────────────────────────────────
  { id:'CAL-006', month:'May',     no:'1.0', event:'First Aider Training (HQ & JSB)',              participants:'First Aider – HQ & JSB',                  type:'External Training', pic:'Bulan Sabit',   date:'05–06 May 2026', status:'Pending Approval', remarks:'' },
  { id:'CAL-007', month:'May',     no:'2.0', event:'PTW & HIRARC Trial Run Briefing (South)',      participants:'Operation & Engineering (South)',          type:'Internal Briefing', pic:'HL, RRi',       date:'07 May 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-008', month:'May',     no:'3.0', event:'PTW & HIRARC Trial Run Briefing (North)',      participants:'Operation & Engineering (North)',          type:'Internal Briefing', pic:'HL, RRi',       date:'08 May 2026',    status:'Planned',          remarks:'9:00 AM start' },
  { id:'CAL-009', month:'May',     no:'4.0', event:'First Aider Training (Ops & Engineering)',     participants:'First Aider – Operation & Engineering',   type:'External Training', pic:'Bulan Sabit',   date:'12–13 May 2026', status:'Pending Approval', remarks:'' },
  { id:'CAL-010', month:'May',     no:'5.0', event:'Confined Space – AESP (Moyog)',               participants:'Confined Space Personnel – Moyog',        type:'External Training', pic:'NIOSH',         date:'14–15 May 2026', status:'In Progress',      remarks:'' },
  { id:'CAL-011', month:'May',     no:'6.0', event:'Confined Space – AGTS',                       participants:'Engineers & Safety Executive',             type:'External Training', pic:'NIOSH',         date:'19–21 May 2026', status:'Planned',          remarks:'' },
  // ── JUNE ───────────────────────────────────────────────────
  { id:'CAL-012', month:'June',    no:'1.0', event:'HIRARC Training (South)',                      participants:'South Region',                            type:'Internal Training', pic:'FK, HL, RRI',   date:'01 Jun 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-013', month:'June',    no:'2.0', event:'HIRARC Training (North)',                      participants:'North Region',                            type:'Internal Training', pic:'FK, HL, RRI',   date:'02 Jun 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-014', month:'June',    no:'3.0', event:'ERP Chlorine Leak Drill – Tuaran',             participants:'Tuaran Plant Personnel',                  type:'Emergency Drill',   pic:'HL, RRi, OW, VVA', date:'12 Jun 2026', status:'Planned',          remarks:'' },
  { id:'CAL-015', month:'June',    no:'4.0', event:'Basic Rigging and Slinging',                   participants:'Engineering Team',                        type:'External Training', pic:'NIOSH',         date:'18 Jun 2026',    status:'Pending Approval', remarks:'' },
  { id:'CAL-016', month:'June',    no:'5.0', event:'Safety Committee Meeting Q2 (South)',          participants:'Safety Committee',                        type:'Meeting',           pic:'HL, RRi',       date:'22 Jun 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-017', month:'June',    no:'6.0', event:'Safety Committee Meeting Q2 (North)',          participants:'Safety Committee',                        type:'Meeting',           pic:'HL, RRi',       date:'23 Jun 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-018', month:'June',    no:'7.0', event:'Safe Driving for Long Distance Work Travel',   participants:'Engineering & SOPMOD Team',               type:'Internal Training', pic:'HL, RRi, NRM',  date:'25 Jun 2026',    status:'Planned',          remarks:'Safety Obs Briefing – AM' },
  { id:'CAL-019', month:'June',    no:'8.0', event:'Sherman Chemical Management Module Briefing',  participants:'Lab, Safety & Engineering Personnel',     type:'Internal Training', pic:'HL, RRi',       date:'30 Jun 2026',    status:'Planned',          remarks:'AM session' },
  { id:'CAL-020', month:'June',    no:'9.0', event:'Sherman Safety Observation Module Briefing',   participants:'All Staff',                               type:'Internal Training', pic:'HL, RRi',       date:'30 Jun 2026',    status:'Planned',          remarks:'PM session' },
  // ── JULY ───────────────────────────────────────────────────
  { id:'CAL-021', month:'July',    no:'1.0', event:'Chemical Emergency Training with Hazmat KK',  participants:'All Plant Personnel',                     type:'External Training', pic:'HAZMAT',        date:'08–09 Jul 2026', status:'Planned',          remarks:'' },
  { id:'CAL-022', month:'July',    no:'2.0', event:'Hearing Loss Campaign',                        participants:'All WTP Staff',                           type:'Campaign',          pic:'HL, RRi',       date:'14–16 Jul 2026', status:'Planned',          remarks:'' },
  { id:'CAL-023', month:'July',    no:'3.0', event:'Safe Chemical Handling Training',              participants:'All Plant Personnel incl. Engineering',   type:'Internal Training', pic:'HL, RRi',       date:'30 Jul 2026',    status:'Planned',          remarks:'' },
  // ── AUGUST ─────────────────────────────────────────────────
  { id:'CAL-024', month:'August',  no:'1.0', event:'Sherman Training Module Briefing',             participants:'OSH Coordinator & SHE',                  type:'Internal Briefing', pic:'HL, RRi',       date:'Aug 2026',       status:'Planned',          remarks:'' },
  { id:'CAL-025', month:'August',  no:'2.0', event:'5S Training',                                  participants:'All Plant Personnel (Supervisor & above)', type:'External Training', pic:'Training Provider', date:'12–13 Aug 2026', status:'Planned',       remarks:'' },
  // ── SEPTEMBER ──────────────────────────────────────────────
  { id:'CAL-026', month:'September', no:'1.0', event:'Ergonomic Training',                         participants:'B&G, Network & KKIP',                     type:'Internal Training', pic:'HL, RRi',       date:'15 Sep 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-027', month:'September', no:'2.0', event:'Fire Drill – Kasigui',                       participants:'Kasigui Plant Personnel',                 type:'Fire Drill',        pic:'HL, RRi',       date:'TBD – Sep 2026', status:'TBD',              remarks:'' },
  { id:'CAL-028', month:'September', no:'3.0', event:'Safety Committee Meeting Q3 (South)',        participants:'Safety Committee',                        type:'Meeting',           pic:'HL, RRi',       date:'22 Sep 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-029', month:'September', no:'4.0', event:'Safety Committee Meeting Q3 (North)',        participants:'Safety Committee',                        type:'Meeting',           pic:'HL, RRi',       date:'23 Sep 2026',    status:'Planned',          remarks:'' },
  // ── OCTOBER ────────────────────────────────────────────────
  { id:'CAL-030', month:'October', no:'1.0', event:'Fire Drill – Moyog',                           participants:'All Plant Personnel – Moyog',             type:'Fire Drill',        pic:'HL, RRi',       date:'TBD – Oct 2026', status:'TBD',              remarks:'' },
  { id:'CAL-031', month:'October', no:'2.0', event:'Fire Drill – KKIP',                            participants:'All Personnel – KKIP',                   type:'Fire Drill',        pic:'HL, RRi',       date:'TBD – Oct 2026', status:'TBD',              remarks:'' },
  { id:'CAL-032', month:'October', no:'3.0', event:'RTSMS Committee Meeting 2',                    participants:'RTS Committee',                           type:'Meeting',           pic:'RRI',           date:'27 Oct 2026',    status:'Planned',          remarks:'' },
  // ── NOVEMBER ───────────────────────────────────────────────
  { id:'CAL-033', month:'November', no:'1.0', event:'Fire Drill – Telibong',                       participants:'All Plant Personnel – Telibong',          type:'Fire Drill',        pic:'HL, RRi',       date:'TBD – Nov 2026', status:'TBD',              remarks:'' },
  { id:'CAL-034', month:'November', no:'2.0', event:'ERP Chlorine Leak Drill – Tamparuli',         participants:'Tamparuli Plant Personnel',               type:'Emergency Drill',   pic:'HL, RRi, OW, VVA', date:'TBD – Nov 2026', status:'TBD',          remarks:'' },
  { id:'CAL-035', month:'November', no:'3.0', event:'Safe Defensive Driving – Pool Car Drivers',   participants:'Pool Car Drivers',                        type:'Internal Training', pic:'AAP, NRM',      date:'19 Nov 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-036', month:'November', no:'4.0', event:'Safety Committee Meeting Q4 (South)',         participants:'Safety Committee',                        type:'Meeting',           pic:'HL, RRi',       date:'23 Nov 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-037', month:'November', no:'5.0', event:'Safety Committee Meeting Q4 (North)',         participants:'Safety Committee',                        type:'Meeting',           pic:'HL, RRi',       date:'24 Nov 2026',    status:'Planned',          remarks:'' },
  // ── DECEMBER ───────────────────────────────────────────────
  { id:'CAL-038', month:'December', no:'1.0', event:'RTS Drill – Moyog',                           participants:'Pool Car Drivers & Supervisor',           type:'Emergency Drill',   pic:'HL, RRi',       date:'03 Dec 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-039', month:'December', no:'2.0', event:'Fire Drill – Papar',                          participants:'All Plant Personnel – Papar',             type:'Emergency Drill',   pic:'HL, RRi',       date:'TBD – Dec 2026', status:'TBD',              remarks:'' },
  { id:'CAL-040', month:'December', no:'3.0', event:'Fire Drill – Lok Kawi',                       participants:'All Personnel – Lok Kawi',                type:'Emergency Drill',   pic:'HL, RRi',       date:'TBD – Dec 2026', status:'TBD',              remarks:'' },
];

// Persistent calendar status (allows updating from the UI)
const TA_KEY = 'hse_training_arrangement';

function taGetData() {
  const stored = localStorage.getItem(TA_KEY);
  if (stored) {
    // Merge stored status updates into base calendar
    const updates = JSON.parse(stored);
    return HSE_CALENDAR_2026.map(r => {
      const u = updates.find(u => u.id === r.id);
      return u ? Object.assign({}, r, u) : Object.assign({}, r);
    });
  }
  return HSE_CALENDAR_2026.map(r => Object.assign({}, r));
}

function taSaveStatus(id, newStatus, newRemarks) {
  const stored = localStorage.getItem(TA_KEY);
  const updates = stored ? JSON.parse(stored) : [];
  const idx = updates.findIndex(u => u.id === id);
  const upd = { id, status: newStatus, remarks: newRemarks };
  if (idx >= 0) updates[idx] = upd; else updates.push(upd);
  localStorage.setItem(TA_KEY, JSON.stringify(updates));
}

// ── Cross-check: find training records matching a calendar event ──
function findMatchingRecord(calEvent) {
  const records = getData(KEYS.training);
  const keywords = calEvent.event.toLowerCase().split(' ')
    .filter(w => w.length > 3 && !['with','from','and','for','the','all'].includes(w));
  return records.filter(r => {
    const name = (r.trainingName || '').toLowerCase();
    return keywords.some(kw => name.includes(kw));
  });
}

// ── Status config ─────────────────────────────────────────────
function taStatusConfig(status) {
  const map = {
    'Done':             { emoji:'✅', color:'var(--success)',    bg:'rgba(29,185,84,.1)',   label:'Done' },
    'In Progress':      { emoji:'🔄', color:'var(--accent)',     bg:'rgba(0,170,255,.1)',   label:'In Progress' },
    'Pending Approval': { emoji:'⏳', color:'var(--warning)',    bg:'rgba(245,166,35,.1)',  label:'Pending Approval' },
    'Planned':          { emoji:'📌', color:'var(--accent2)',    bg:'rgba(0,212,170,.08)',  label:'Planned' },
    'TBD':              { emoji:'❓', color:'var(--text-muted)', bg:'rgba(100,116,139,.1)','label':'TBD – Date Not Set' },
  };
  return map[status] || map['Planned'];
}

function taTypeBadge(type) {
  const colors = {
    'External Training': '#f97316',
    'Internal Training': '#00aaff',
    'Internal Briefing': '#00d4aa',
    'Meeting':           '#8b5cf6',
    'Emergency Drill':   '#ef4444',
    'Fire Drill':        '#ef4444',
    'Campaign':          '#eab308',
  };
  const c = colors[type] || 'var(--text-muted)';
  return `<span style="font-size:10px;padding:2px 7px;border-radius:3px;background:${c}22;color:${c};font-family:var(--font-mono);white-space:nowrap">${escHtml(type)}</span>`;
}

// ── State ─────────────────────────────────────────────────────
let taCurrentView = 'calendar';
let taFilter      = '';

window.setTaView = function(view) {
  taCurrentView = view;
  ['calendar','list','action'].forEach(v => {
    const panel = document.getElementById(`ta-${v}-view`);
    const btn   = document.getElementById(`ta-view-${v}-btn`);
    if (panel) panel.style.display = v===view ? 'block' : 'none';
    if (btn)   btn.className = v===view ? 'btn-sys btn-primary-sys btn-sm' : 'btn-sys btn-outline btn-sm';
  });
  renderArrangement();
};

// ── Main render ───────────────────────────────────────────────
window.renderArrangement = function() {
  const data    = taGetData();
  const search  = (document.getElementById('ta-search')?.value || '').toLowerCase();
  const typeF   = document.getElementById('ta-type-filter')?.value || '';

  // Update KPIs from full data
  const el = id => document.getElementById(id);
  if(el('ta-kpi-done'))    el('ta-kpi-done').textContent    = data.filter(r=>r.status==='Done').length;
  if(el('ta-kpi-inprog'))  el('ta-kpi-inprog').textContent  = data.filter(r=>r.status==='In Progress').length;
  if(el('ta-kpi-pending')) el('ta-kpi-pending').textContent = data.filter(r=>r.status==='Pending Approval').length;
  if(el('ta-kpi-planned')) el('ta-kpi-planned').textContent = data.filter(r=>r.status==='Planned').length;
  if(el('ta-kpi-tbd'))     el('ta-kpi-tbd').textContent     = data.filter(r=>r.status==='TBD').length;
  if(el('ta-kpi-total'))   el('ta-kpi-total').textContent   = data.length;

  // Filter
  const filtered = data.filter(r => {
    if (taFilter && r.status !== taFilter) return false;
    if (typeF    && r.type   !== typeF)    return false;
    if (search   && !(r.event+r.participants+r.pic+r.month).toLowerCase().includes(search)) return false;
    return true;
  });

  if (taCurrentView === 'calendar') renderTaCalendar(filtered);
  if (taCurrentView === 'list')     renderTaList(filtered);
  if (taCurrentView === 'action')   renderTaAction(data); // always show all needing action
};

// ── VIEW 1: By Month ─────────────────────────────────────────
function renderTaCalendar(filtered) {
  const container = document.getElementById('ta-month-groups');
  if (!container) return;

  const months = ['April','May','June','July','August','September','October','November','December'];

  container.innerHTML = months.map(month => {
    const items = filtered.filter(r => r.month === month);
    if (!items.length) return '';

    const done    = items.filter(r=>r.status==='Done').length;
    const total   = items.length;
    const pct     = Math.round(done/total*100);
    const hasIssue= items.some(r=>r.status==='Pending Approval'||r.status==='TBD');
    const borderColor = done===total?'var(--success)':hasIssue?'var(--warning)':'var(--accent2)';

    const cards = items.map(r => {
      const sc      = taStatusConfig(r.status);
      const matched = findMatchingRecord(r);
      const recordFound = matched.length > 0;

      return `<div style="background:var(--bg-card2);border:1px solid var(--border);border-left:4px solid ${sc.color};border-radius:var(--radius);padding:12px 14px;margin-bottom:8px">
        <div style="display:flex;align-items:flex-start;gap:10px">
          <!-- Status emoji -->
          <div style="font-size:20px;flex-shrink:0;margin-top:1px">${sc.emoji}</div>

          <!-- Main content -->
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px">
              <span style="font-size:10px;font-family:var(--font-mono);color:var(--text-muted)">${escHtml(r.id)}</span>
              ${taTypeBadge(r.type)}
              ${recordFound
                ? `<span style="font-size:10px;background:rgba(29,185,84,.15);color:var(--success);border-radius:3px;padding:1px 6px;font-family:var(--font-mono)">✓ Record Found</span>`
                : r.type.includes('Training')||r.type==='Campaign'
                  ? `<span style="font-size:10px;background:rgba(245,166,35,.15);color:var(--warning);border-radius:3px;padding:1px 6px;font-family:var(--font-mono)">⚠ No Record Yet</span>`
                  : ''}
            </div>
            <div style="font-size:13px;font-weight:700;margin-bottom:3px">${escHtml(r.event)}</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:var(--text-secondary)">
              <span><i class="fa-solid fa-users" style="color:var(--text-muted);font-size:9px;margin-right:3px"></i>${escHtml(r.participants)}</span>
              <span><i class="fa-solid fa-user-tie" style="color:var(--text-muted);font-size:9px;margin-right:3px"></i>${escHtml(r.pic)}</span>
              <span><i class="fa-solid fa-calendar" style="color:var(--text-muted);font-size:9px;margin-right:3px"></i>${escHtml(r.date)}</span>
              ${r.remarks?`<span style="color:var(--text-muted);font-style:italic">${escHtml(r.remarks)}</span>`:''}
            </div>
            ${recordFound?`<div style="margin-top:6px;font-size:10px;color:var(--success);font-family:var(--font-mono)">
              Linked records: ${matched.map(m=>`${escHtml(m.id)} — ${escHtml(m.employeeName)}`).join(' · ')}
            </div>`:''}
          </div>

          <!-- Right: status + update button -->
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">
            <span style="font-size:11px;font-weight:700;color:${sc.color}">${sc.label}</span>
            ${canEdit(getCurrentUser()) ? `<button class="btn-sys btn-outline btn-xs" onclick="openTaUpdate('${r.id}')">Update</button>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');

    return `<div style="margin-bottom:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid ${borderColor}">
        <div style="font-family:var(--font-head);font-size:17px;font-weight:800;color:${borderColor}">
          ${escHtml(month)} 2026
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="background:var(--bg-dark);border-radius:3px;height:6px;overflow:hidden;width:80px">
            <div style="width:${pct}%;background:${borderColor};height:100%;border-radius:3px;transition:width .5s"></div>
          </div>
          <span style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono)">${done}/${total} done</span>
        </div>
      </div>
      ${cards}
    </div>`;
  }).join('') || `<div style="text-align:center;padding:40px;color:var(--text-muted)">No activities match your filters.</div>`;
}

// ── VIEW 2: Full List Table ───────────────────────────────────
function renderTaList(filtered) {
  const tbody = document.getElementById('ta-list-tbody');
  if (!tbody) return;

  tbody.innerHTML = filtered.map((r,i) => {
    const sc      = taStatusConfig(r.status);
    const matched = findMatchingRecord(r);
    const recordFound = matched.length > 0;
    return `<tr>
      <td style="font-size:11px;color:var(--text-muted)">${i+1}</td>
      <td style="font-size:11px;font-weight:600;color:var(--accent)">${escHtml(r.month)}</td>
      <td>
        <div style="font-size:12px;font-weight:600">${escHtml(r.event)}</div>
      </td>
      <td>${taTypeBadge(r.type)}</td>
      <td style="font-size:11px;color:var(--text-secondary);max-width:150px">${escHtml(r.participants)}</td>
      <td style="font-size:11px">${escHtml(r.pic)}</td>
      <td style="font-size:11px;font-family:var(--font-mono);white-space:nowrap">${escHtml(r.date)}</td>
      <td><span style="font-size:11px;font-weight:700;color:${sc.color}">${sc.emoji} ${sc.label}</span></td>
      <td style="text-align:center">
        ${recordFound
          ? `<span style="font-size:10px;color:var(--success);font-weight:700">✓ ${matched.length} record${matched.length>1?'s':''}</span>`
          : r.type.includes('Training')||r.type==='Campaign'
            ? '<span style="font-size:10px;color:var(--warning)">⚠ None</span>'
            : '<span style="font-size:10px;color:var(--text-muted)">—</span>'}
      </td>
      <td style="font-size:11px;color:var(--text-muted)">${escHtml(r.remarks||'—')}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="10" style="text-align:center;padding:24px;color:var(--text-muted)">No activities found</td></tr>`;
}

// ── VIEW 3: Action Required ───────────────────────────────────
function renderTaAction(data) {
  const container = document.getElementById('ta-action-cards');
  if (!container) return;

  // Group into: Needs date confirmation, Needs approval, Needs to be arranged
  const needDate     = data.filter(r => r.status==='TBD');
  const needApproval = data.filter(r => r.status==='Pending Approval');
  const noRecord     = data.filter(r => {
    const isTraining = r.type.includes('Training') || r.type==='Campaign';
    return isTraining && r.status!=='Done' && findMatchingRecord(r).length===0;
  });
  const upcoming     = data.filter(r => {
    if (r.status==='Done' || r.status==='TBD') return false;
    // Check if date is within next 30 days (basic check on date string)
    const now = new Date();
    const months = {April:3,May:4,June:5,July:6,August:7,September:8,October:9,November:10,December:11};
    const m = months[r.month];
    if (m === undefined) return false;
    const start = new Date(2026, m, 1);
    const end   = new Date(2026, m, 30);
    const near  = new Date(); near.setDate(near.getDate()+30);
    return start <= near && end >= now;
  }).filter(r => !needDate.includes(r) && !needApproval.includes(r));

  function actionSection(title, icon, color, items, actionText) {
    if (!items.length) return '';
    return `<div style="margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid ${color}">
        <span style="font-size:16px">${icon}</span>
        <div style="font-family:var(--font-head);font-size:15px;font-weight:800;color:${color}">${title}</div>
        <span style="font-size:11px;background:${color}22;color:${color};padding:2px 8px;border-radius:4px;font-family:var(--font-mono)">${items.length} items</span>
      </div>
      ${items.map(r => {
        const sc = taStatusConfig(r.status);
        return `<div style="background:var(--bg-card);border:1px solid var(--border);border-left:4px solid ${color};border-radius:var(--radius);padding:12px 16px;margin-bottom:8px;display:flex;align-items:flex-start;gap:12px">
          <div style="flex:1">
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">
              <span style="font-size:10px;font-family:var(--font-mono);color:var(--text-muted)">${escHtml(r.id)}</span>
              ${taTypeBadge(r.type)}
              <span style="font-size:10px;color:var(--text-muted)">${escHtml(r.month)} 2026</span>
            </div>
            <div style="font-size:13px;font-weight:700;margin-bottom:3px">${escHtml(r.event)}</div>
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px">
              <i class="fa-solid fa-users" style="font-size:9px;margin-right:3px"></i>${escHtml(r.participants)}
              &nbsp;·&nbsp; <i class="fa-solid fa-user-tie" style="font-size:9px;margin-right:3px"></i>${escHtml(r.pic)}
              &nbsp;·&nbsp; <i class="fa-solid fa-calendar" style="font-size:9px;margin-right:3px"></i>${escHtml(r.date)}
            </div>
            <div style="font-size:11px;font-weight:700;color:${color};background:${color}15;padding:4px 10px;border-radius:4px;display:inline-block">
              → ${actionText}
            </div>
          </div>
          ${canEdit(getCurrentUser()) ? `<button class="btn-sys btn-outline btn-xs" onclick="openTaUpdate('${r.id}')" style="flex-shrink:0;margin-top:2px">Update</button>` : ''}
        </div>`;
      }).join('')}
    </div>`;
  }

  container.innerHTML =
    actionSection('Confirm Date',    '❓', 'var(--text-muted)', needDate,     'Confirm training date and update calendar') +
    actionSection('Awaiting Approval','⏳', 'var(--warning)',    needApproval, 'Get management / budget approval') +
    actionSection('No Training Record','⚠', 'var(--danger)',    noRecord,     'Conduct training and add record to Training Matrix') +
    actionSection('Coming Up This Month','📅','var(--accent)',   upcoming,     'Ensure all arrangements are finalised') ||
    `<div style="text-align:center;padding:40px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg)">
      <div style="font-size:36px;margin-bottom:12px">✅</div>
      <div style="font-size:15px;font-weight:600;margin-bottom:6px">All good!</div>
      <div style="font-size:13px;color:var(--text-muted)">No pending actions at this time.</div>
    </div>`;
}

// ── Update Status Modal ───────────────────────────────────────
window.openTaUpdate = function(id) {
  const data = taGetData();
  const r    = data.find(rec => rec.id===id);
  if (!r) return;

  const modal = document.getElementById('ta-update-modal');
  if (!modal) { showToast('Update modal not found.','error'); return; }

  document.getElementById('ta-u-id').value     = r.id;
  document.getElementById('ta-u-event').value  = r.event;
  document.getElementById('ta-u-status').value = r.status;
  document.getElementById('ta-u-remarks').value= r.remarks||'';
  modal.classList.add('show');
};

window.saveTaUpdate = function() {
  const user = getCurrentUser();
  if (!canEdit(user)) { showToast('Insufficient permissions.','error'); return; }
  const id      = document.getElementById('ta-u-id').value;
  const status  = document.getElementById('ta-u-status').value;
  const remarks = document.getElementById('ta-u-remarks').value.trim();
  taSaveStatus(id, status, remarks);
  document.getElementById('ta-update-modal').classList.remove('show');
  showToast('Status updated.','success');
  renderArrangement();
};

// ── Excel Export ──────────────────────────────────────────────
window.exportArrangementExcel = function() {
  const XLSX = window.XLSX;
  const data = taGetData();
  const wb   = XLSX.utils.book_new();
  const now  = new Date().toISOString().split('T')[0];

  // Summary sheet
  const done    = data.filter(r=>r.status==='Done').length;
  const pending = data.filter(r=>r.status==='Pending Approval').length;
  const tbd     = data.filter(r=>r.status==='TBD').length;
  const planned = data.filter(r=>r.status==='Planned').length;
  const inprog  = data.filter(r=>r.status==='In Progress').length;
  const noRec   = data.filter(r=>(r.type.includes('Training')||r.type==='Campaign')&&r.status!=='Done'&&findMatchingRecord(r).length===0).length;

  const sumWs = XLSX.utils.aoa_to_sheet([
    ['Jetama Water Sdn. Bhd. — HSE Training Arrangement 2026'],
    [`Generated: ${now} | Total Activities: ${data.length}`],[],
    ['Status','Count'],
    ['✅ Done',             done],
    ['🔄 In Progress',      inprog],
    ['⏳ Pending Approval', pending],
    ['📌 Planned',          planned],
    ['❓ TBD',              tbd],
    ['TOTAL',               data.length],[],
    ['⚠ Trainings with no record yet', noRec],
  ]);
  sumWs['!cols']=[{wch:30},{wch:10}];
  XLSX.utils.book_append_sheet(wb, sumWs, 'Summary');

  // Full calendar sheet
  const h = ['ID','Month','No.','Training / Event','Type','Participants','Trainer / PIC','Scheduled Date','Status','Record Found','Remarks'];
  const rows = data.map(r => {
    const matched = findMatchingRecord(r);
    return [r.id,r.month,r.no,r.event,r.type,r.participants,r.pic,r.date,r.status,
            matched.length>0?`Yes — ${matched.map(m=>m.id).join(', ')}`:'No',r.remarks||''];
  });
  const calWs = XLSX.utils.aoa_to_sheet([
    ['HSE Training Calendar 2026 — Full Register'],[`SHE-CAL-2026 v2.0 | ${now}`],[],h,...rows
  ]);
  calWs['!cols']=[{wch:10},{wch:12},{wch:5},{wch:45},{wch:20},{wch:35},{wch:18},{wch:18},{wch:20},{wch:20},{wch:30}];
  XLSX.utils.book_append_sheet(wb, calWs, 'Full Calendar');

  // Action required sheet
  const actions = data.filter(r=>r.status!=='Done');
  const actRows = actions.map(r=>{
    const matched = findMatchingRecord(r);
    const action = r.status==='TBD'?'Confirm date'
                 : r.status==='Pending Approval'?'Get approval'
                 : (r.type.includes('Training')||r.type==='Campaign')&&matched.length===0?'Conduct & add record'
                 : 'Finalise arrangements';
    return [r.id,r.month,r.event,r.type,r.participants,r.pic,r.date,r.status,action];
  });
  const actWs = XLSX.utils.aoa_to_sheet([
    ['Action Required — HSE Training Arrangement 2026'],[`${actions.length} activities pending`],[],
    ['ID','Month','Training / Event','Type','Participants','PIC','Date','Current Status','Action Required'],
    ...actRows
  ]);
  actWs['!cols']=[{wch:10},{wch:12},{wch:45},{wch:20},{wch:35},{wch:18},{wch:18},{wch:20},{wch:30}];
  XLSX.utils.book_append_sheet(wb, actWs, 'Action Required');

  XLSX.writeFile(wb, `HSE_Training_Arrangement_${now}.xlsx`);
  showToast('Training arrangement report exported!','success');
};
