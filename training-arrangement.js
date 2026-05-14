/* ============================================================
   training-arrangement.js
   HSE Training Yearly Plan — Jetama Water Sdn. Bhd.
   Source: SHE-CAL-2026 Version 2.0, April 2026
   ============================================================ */

'use strict';

const TA_KEY = 'hse_training_arrangement';

const HSE_CALENDAR_2026 = [
  // APRIL
  { id:'CAL-001', month:'April',    no:'1.0', event:'Safety Committee Meeting Q2 (North)',         participants:'Safety Committee',                       type:'Meeting',           pic:'HL, RRi',    date:'06 Apr 2026',    status:'Done',             remarks:'' },
  { id:'CAL-002', month:'April',    no:'2.0', event:'Confined Space - AESP',                       participants:'Confined Space Personnel',                type:'External Training', pic:'NIOSH',      date:'07-08 Apr 2026', status:'Done',             remarks:'' },
  { id:'CAL-003', month:'April',    no:'3.0', event:'Safety Committee Meeting Q2 (South)',          participants:'Safety Committee',                       type:'Meeting',           pic:'HL, RRi',    date:'17 Apr 2026',    status:'In Progress',      remarks:'' },
  { id:'CAL-004', month:'April',    no:'4.0', event:'Scaffolding Training',                         participants:'B&G & North Maintenance Personnel',       type:'External Training', pic:'CIDB',       date:'10-19 Apr 2026', status:'In Progress',      remarks:'' },
  { id:'CAL-005', month:'April',    no:'5.0', event:'RTSMS Committee Meeting',                      participants:'RTS Committee',                          type:'Meeting',           pic:'RRI',        date:'21 Apr 2026',    status:'Planned',          remarks:'' },
  // MAY
  { id:'CAL-006', month:'May',      no:'1.0', event:'First Aider Training (HQ & JSB)',              participants:'First Aider - HQ & JSB',                 type:'External Training', pic:'Bulan Sabit',date:'05-06 May 2026', status:'Pending Approval', remarks:'' },
  { id:'CAL-007', month:'May',      no:'2.0', event:'PTW & HIRARC Trial Run Briefing (South)',      participants:'Operation & Engineering (South)',         type:'Internal Briefing', pic:'HL, RRi',    date:'07 May 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-008', month:'May',      no:'3.0', event:'PTW & HIRARC Trial Run Briefing (North)',      participants:'Operation & Engineering (North)',         type:'Internal Briefing', pic:'HL, RRi',    date:'08 May 2026',    status:'Planned',          remarks:'9:00 AM start' },
  { id:'CAL-009', month:'May',      no:'4.0', event:'First Aider Training (Ops & Engineering)',     participants:'First Aider - Operation & Engineering',  type:'External Training', pic:'Bulan Sabit',date:'12-13 May 2026', status:'Pending Approval', remarks:'' },
  { id:'CAL-010', month:'May',      no:'5.0', event:'Confined Space - AESP (Moyog)',                participants:'Confined Space Personnel - Moyog',       type:'External Training', pic:'NIOSH',      date:'14-15 May 2026', status:'In Progress',      remarks:'' },
  { id:'CAL-011', month:'May',      no:'6.0', event:'Confined Space - AGTS',                        participants:'Engineers & Safety Executive',            type:'External Training', pic:'NIOSH',      date:'19-21 May 2026', status:'Planned',          remarks:'' },
  // JUNE
  { id:'CAL-012', month:'June',     no:'1.0', event:'ERP Chlorine Leak Drill - Tuaran',             participants:'Tuaran Plant Personnel',                  type:'Emergency Drill',   pic:'HL, RRi, OW, VVA', date:'12 Jun 2026', status:'Planned',      remarks:'' },
  { id:'CAL-013', month:'June',     no:'2.0', event:'Basic Rigging and Slinging',                   participants:'Engineering Team',                        type:'External Training', pic:'NIOSH',      date:'18 Jun 2026',    status:'Pending Approval', remarks:'' },
  { id:'CAL-014', month:'June',     no:'3.0', event:'Safety Committee Meeting Q2 (South)',          participants:'Safety Committee',                       type:'Meeting',           pic:'HL, RRi',    date:'22 Jun 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-015', month:'June',     no:'4.0', event:'Safety Committee Meeting Q2 (North)',          participants:'Safety Committee',                       type:'Meeting',           pic:'HL, RRi',    date:'23 Jun 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-016', month:'June',     no:'5.0', event:'Safe Driving for Long Distance Work Travel',   participants:'Engineering & SOPMOD Team',               type:'Internal Training', pic:'HL, RRi, NRM', date:'25 Jun 2026', status:'Planned',          remarks:'Safety Obs Briefing - AM' },
  { id:'CAL-017', month:'June',     no:'6.0', event:'Sherman Chemical Management Module Briefing',  participants:'Lab, Safety & Engineering Personnel',     type:'Internal Training', pic:'HL, RRi',    date:'30 Jun 2026',    status:'Planned',          remarks:'AM session' },
  { id:'CAL-018', month:'June',     no:'7.0', event:'Sherman Safety Observation Module Briefing',   participants:'All Staff',                               type:'Internal Training', pic:'HL, RRi',    date:'30 Jun 2026',    status:'Planned',          remarks:'PM session' },
  // JULY
  { id:'CAL-019', month:'July',     no:'1.0', event:'Chemical Emergency Training with Hazmat KK',  participants:'All Plant Personnel',                     type:'External Training', pic:'HAZMAT',     date:'08-09 Jul 2026', status:'Planned',          remarks:'' },
  { id:'CAL-020', month:'July',     no:'2.0', event:'Hearing Loss Campaign',                        participants:'All WTP Staff',                           type:'Campaign',          pic:'HL, RRi',    date:'14-16 Jul 2026', status:'Planned',          remarks:'' },
  { id:'CAL-021', month:'July',     no:'3.0', event:'Safe Chemical Handling Training',              participants:'All Plant Personnel incl. Engineering',   type:'Internal Training', pic:'HL, RRi',    date:'30 Jul 2026',    status:'Planned',          remarks:'' },
  // AUGUST
  { id:'CAL-022', month:'August',   no:'1.0', event:'Sherman Training Module Briefing',             participants:'OSH Coordinator & SHE',                  type:'Internal Briefing', pic:'HL, RRi',    date:'Aug 2026',        status:'Planned',          remarks:'' },
  { id:'CAL-023', month:'August',   no:'2.0', event:'5S Training',                                  participants:'All Plant Personnel (Supervisor & above)',type:'External Training', pic:'Training Provider', date:'12-13 Aug 2026', status:'Planned',  remarks:'' },
  // SEPTEMBER
  { id:'CAL-024', month:'September',no:'1.0', event:'Ergonomic Training',                           participants:'B&G, Network & KKIP',                     type:'Internal Training', pic:'HL, RRi',    date:'15 Sep 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-025', month:'September',no:'2.0', event:'Fire Drill - Kasigui',                         participants:'Kasigui Plant Personnel',                 type:'Fire Drill',        pic:'HL, RRi',    date:'TBD - Sep 2026', status:'TBD',              remarks:'' },
  { id:'CAL-026', month:'September',no:'3.0', event:'Safety Committee Meeting Q3 (South)',          participants:'Safety Committee',                       type:'Meeting',           pic:'HL, RRi',    date:'22 Sep 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-027', month:'September',no:'4.0', event:'Safety Committee Meeting Q3 (North)',          participants:'Safety Committee',                       type:'Meeting',           pic:'HL, RRi',    date:'23 Sep 2026',    status:'Planned',          remarks:'' },
  // OCTOBER
  { id:'CAL-028', month:'October',  no:'1.0', event:'Fire Drill - Moyog',                           participants:'All Plant Personnel - Moyog',             type:'Fire Drill',        pic:'HL, RRi',    date:'TBD - Oct 2026', status:'TBD',              remarks:'' },
  { id:'CAL-029', month:'October',  no:'2.0', event:'Fire Drill - KKIP',                            participants:'All Personnel - KKIP',                   type:'Fire Drill',        pic:'HL, RRi',    date:'TBD - Oct 2026', status:'TBD',              remarks:'' },
  { id:'CAL-030', month:'October',  no:'3.0', event:'RTSMS Committee Meeting 2',                    participants:'RTS Committee',                          type:'Meeting',           pic:'RRI',        date:'27 Oct 2026',    status:'Planned',          remarks:'' },
  // NOVEMBER
  { id:'CAL-031', month:'November', no:'1.0', event:'Fire Drill - Telibong',                        participants:'All Plant Personnel - Telibong',          type:'Fire Drill',        pic:'HL, RRi',    date:'TBD - Nov 2026', status:'TBD',              remarks:'' },
  { id:'CAL-032', month:'November', no:'2.0', event:'ERP Chlorine Leak Drill - Tamparuli',          participants:'Tamparuli Plant Personnel',               type:'Emergency Drill',   pic:'HL, RRi, OW, VVA', date:'TBD - Nov 2026', status:'TBD',      remarks:'' },
  { id:'CAL-033', month:'November', no:'3.0', event:'Safe Defensive Driving - Pool Car Drivers',    participants:'Pool Car Drivers',                        type:'Internal Training', pic:'AAP, NRM',   date:'19 Nov 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-034', month:'November', no:'4.0', event:'Safety Committee Meeting Q4 (South)',          participants:'Safety Committee',                       type:'Meeting',           pic:'HL, RRi',    date:'23 Nov 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-035', month:'November', no:'5.0', event:'Safety Committee Meeting Q4 (North)',          participants:'Safety Committee',                       type:'Meeting',           pic:'HL, RRi',    date:'24 Nov 2026',    status:'Planned',          remarks:'' },
  // DECEMBER
  { id:'CAL-036', month:'December', no:'1.0', event:'RTS Drill - Moyog',                            participants:'Pool Car Drivers & Supervisor',           type:'Emergency Drill',   pic:'HL, RRi',    date:'03 Dec 2026',    status:'Planned',          remarks:'' },
  { id:'CAL-037', month:'December', no:'2.0', event:'Fire Drill - Papar',                           participants:'All Plant Personnel - Papar',             type:'Emergency Drill',   pic:'HL, RRi',    date:'TBD - Dec 2026', status:'TBD',              remarks:'' },
  { id:'CAL-038', month:'December', no:'3.0', event:'Fire Drill - Lok Kawi',                        participants:'All Personnel - Lok Kawi',                type:'Emergency Drill',   pic:'HL, RRi',    date:'TBD - Dec 2026', status:'TBD',              remarks:'' },
];

function taGetData() {
  const stored = localStorage.getItem(TA_KEY);
  if (!stored) return HSE_CALENDAR_2026.map(r => Object.assign({}, r));
  const updates = JSON.parse(stored);
  return HSE_CALENDAR_2026.map(r => {
    const u = updates.find(u => u.id === r.id);
    return u ? Object.assign({}, r, u) : Object.assign({}, r);
  });
}

function taSaveStatus(id, status, remarks, date) {
  const stored  = localStorage.getItem(TA_KEY);
  const updates = stored ? JSON.parse(stored) : [];
  const idx     = updates.findIndex(u => u.id === id);
  const upd     = { id, status };
  if (remarks !== undefined) upd.remarks = remarks;
  if (date    !== undefined && date) upd.date = date;
  if (idx >= 0) updates[idx] = Object.assign(updates[idx], upd);
  else updates.push(upd);
  localStorage.setItem(TA_KEY, JSON.stringify(updates));
}

function taStatusCfg(status) {
  const map = {
    'Done':             { emoji:'✅', color:'var(--success)', label:'Done' },
    'In Progress':      { emoji:'🔄', color:'var(--accent)',  label:'In Progress' },
    'Pending Approval': { emoji:'⏳', color:'var(--warning)', label:'Pending Approval' },
    'Planned':          { emoji:'📌', color:'var(--accent2)', label:'Planned' },
    'TBD':              { emoji:'❓', color:'var(--text-muted)', label:'TBD' },
    'Cancelled':        { emoji:'⛔', color:'var(--danger)',  label:'Cancelled' },
  };
  return map[status] || map['Planned'];
}

function taTypeBadge(type) {
  const colors = {
    'External Training':'#f97316','Internal Training':'#00aaff',
    'Internal Briefing':'#00d4aa','Meeting':'#8b5cf6',
    'Emergency Drill':'#ef4444','Fire Drill':'#ef4444','Campaign':'#eab308',
  };
  const c = colors[type] || '#64748b';
  return '<span style="font-size:10px;padding:1px 7px;border-radius:3px;background:'+c+'22;color:'+c+';white-space:nowrap">'+escHtml(type)+'</span>';
}

let taCurrentView = 'calendar';
let taFilter      = '';

window.setTaView = function(view) {
  taCurrentView = view;
  ['calendar','list','action'].forEach(function(v) {
    var panel = document.getElementById('ta-'+v+'-view');
    var btn   = document.getElementById('ta-view-'+v+'-btn');
    if (panel) panel.style.display = v === view ? 'block' : 'none';
    if (btn)   btn.className = v === view ? 'btn-sys btn-primary-sys btn-sm' : 'btn-sys btn-outline btn-sm';
  });
  renderArrangement();
};

window.renderArrangement = function() {
  var data   = taGetData();
  var search = (document.getElementById('ta-search') ? document.getElementById('ta-search').value : '').toLowerCase();
  var typeF  = document.getElementById('ta-type-filter') ? document.getElementById('ta-type-filter').value : '';
  var el     = function(id) { return document.getElementById(id); };

  if(el('ta-kpi-done'))    el('ta-kpi-done').textContent    = data.filter(function(r){return r.status==='Done';}).length;
  if(el('ta-kpi-inprog'))  el('ta-kpi-inprog').textContent  = data.filter(function(r){return r.status==='In Progress';}).length;
  if(el('ta-kpi-pending')) el('ta-kpi-pending').textContent = data.filter(function(r){return r.status==='Pending Approval';}).length;
  if(el('ta-kpi-planned')) el('ta-kpi-planned').textContent = data.filter(function(r){return r.status==='Planned';}).length;
  if(el('ta-kpi-tbd'))     el('ta-kpi-tbd').textContent     = data.filter(function(r){return r.status==='TBD';}).length;
  if(el('ta-kpi-total'))   el('ta-kpi-total').textContent   = data.length;

  var filtered = data.filter(function(r) {
    if (taFilter && r.status !== taFilter) return false;
    if (typeF    && r.type   !== typeF)    return false;
    if (search   && (r.event+r.participants+r.pic+r.month).toLowerCase().indexOf(search) < 0) return false;
    return true;
  });

  if (taCurrentView === 'calendar') renderTaCalendar(filtered);
  if (taCurrentView === 'list')     renderTaList(filtered);
  if (taCurrentView === 'action')   renderTaAction(data);
};

function renderTaCalendar(filtered) {
  var container = document.getElementById('ta-month-groups');
  if (!container) return;
  var months = ['April','May','June','July','August','September','October','November','December'];

  container.innerHTML = months.map(function(month) {
    var items  = filtered.filter(function(r) { return r.month === month; });
    if (!items.length) return '';
    var done   = items.filter(function(r){return r.status==='Done';}).length;
    var total  = items.length;
    var pct    = Math.round(done/total*100);
    var hasTBD = items.some(function(r){return r.status==='TBD'||r.status==='Pending Approval';});
    var color  = done===total ? 'var(--success)' : hasTBD ? 'var(--warning)' : 'var(--accent2)';

    return '<div style="margin-bottom:24px">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid '+color+'">'
      + '<div style="font-family:var(--font-head);font-size:17px;font-weight:800;color:'+color+'">'+escHtml(month)+' 2026</div>'
      + '<div style="display:flex;align-items:center;gap:10px">'
      + '<div style="background:var(--bg-dark);border-radius:3px;height:6px;width:80px;overflow:hidden"><div style="width:'+pct+'%;background:'+color+';height:100%;border-radius:3px"></div></div>'
      + '<span style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono)">'+done+'/'+total+' done</span>'
      + '</div></div>'
      + items.map(function(r) { return taActivityCard(r); }).join('')
      + '</div>';
  }).join('') || '<div style="text-align:center;padding:40px;color:var(--text-muted)">No activities match your filters.</div>';
}

function taActivityCard(r) {
  var sc   = taStatusCfg(r.status);
  var user = getCurrentUser();
  var canEditUser = canEdit(user);

  return '<div style="background:var(--bg-card);border:1px solid var(--border);border-left:4px solid '+sc.color+';border-radius:var(--radius);padding:12px 14px;margin-bottom:8px">'
    + '<div style="display:flex;align-items:flex-start;gap:10px">'
    + '<div style="font-size:18px;flex-shrink:0;margin-top:2px">'+sc.emoji+'</div>'
    + '<div style="flex:1;min-width:0">'
    + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">'
    + '<span style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono)">'+escHtml(r.id)+'</span>'
    + taTypeBadge(r.type)
    + '</div>'
    + '<div style="font-size:13px;font-weight:700;margin-bottom:4px">'+escHtml(r.event)+'</div>'
    + '<div style="display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:var(--text-secondary)">'
    + '<span>👥 '+escHtml(r.participants)+'</span>'
    + '<span>👤 '+escHtml(r.pic)+'</span>'
    + '<span>📅 '+escHtml(r.date)+'</span>'
    + (r.remarks ? '<span style="color:var(--text-muted);font-style:italic">'+escHtml(r.remarks)+'</span>' : '')
    + '</div></div>'
    + '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">'
    + '<span style="font-size:11px;font-weight:700;color:'+sc.color+'">'+sc.label+'</span>'
    + (canEditUser ? '<div style="display:flex;gap:4px">'
        + '<button class="btn-sys btn-outline btn-xs" onclick="openTaUpdate(\''+r.id+'\')">Update</button>'
        + '<button class="btn-sys btn-xs" onclick="openTaAssignTask(\''+r.id+'\')" title="Create task" style="background:rgba(0,212,170,.15);color:var(--accent2);border:1px solid var(--accent2);border-radius:var(--radius);cursor:pointer;padding:2px 8px;font-size:11px"><i class="fa-solid fa-user-plus"></i></button>'
        + '</div>' : '')
    + '</div></div></div>';
}

function renderTaList(filtered) {
  var tbody = document.getElementById('ta-list-tbody');
  if (!tbody) return;
  var canEditUser = canEdit(getCurrentUser());
  tbody.innerHTML = filtered.map(function(r, i) {
    var sc = taStatusCfg(r.status);
    return '<tr>'
      + '<td style="font-size:11px;color:var(--text-muted);text-align:center">'+(i+1)+'</td>'
      + '<td style="font-size:11px;font-weight:600;color:var(--accent)">'+escHtml(r.month)+'</td>'
      + '<td><div style="font-size:12px;font-weight:600">'+escHtml(r.event)+'</div></td>'
      + '<td>'+taTypeBadge(r.type)+'</td>'
      + '<td style="font-size:11px;color:var(--text-secondary);max-width:140px">'+escHtml(r.participants)+'</td>'
      + '<td style="font-size:11px">'+escHtml(r.pic)+'</td>'
      + '<td style="font-size:11px;font-family:var(--font-mono);white-space:nowrap">'+escHtml(r.date)+'</td>'
      + '<td><span style="font-size:11px;font-weight:700;color:'+sc.color+'">'+sc.emoji+' '+sc.label+'</span></td>'
      + '<td style="font-size:11px;color:var(--text-muted)">'+escHtml(r.remarks||'—')+'</td>'
      + '<td class="td-action">'
      + (canEditUser ? '<button class="btn-sys btn-outline btn-xs" onclick="openTaUpdate(\''+r.id+'\')">Update</button>'
          + '<button class="btn-sys btn-xs" onclick="openTaAssignTask(\''+r.id+'\')" style="background:rgba(0,212,170,.15);color:var(--accent2);border:1px solid var(--accent2);border-radius:var(--radius);cursor:pointer;padding:2px 6px;font-size:11px;margin-left:4px"><i class="fa-solid fa-user-plus"></i></button>'
          : '—')
      + '</td></tr>';
  }).join('') || '<tr><td colspan="10" style="text-align:center;padding:24px;color:var(--text-muted)">No activities found</td></tr>';
}

function renderTaAction(data) {
  var container = document.getElementById('ta-action-cards');
  if (!container) return;

  var needDate     = data.filter(function(r){return r.status==='TBD';});
  var needApproval = data.filter(function(r){return r.status==='Pending Approval';});
  var now          = new Date();
  var mMap         = {April:3,May:4,June:5,July:6,August:7,September:8,October:9,November:10,December:11};
  var upcoming     = data.filter(function(r) {
    if (['Done','TBD','Cancelled','Pending Approval'].includes(r.status)) return false;
    var m = mMap[r.month];
    if (m === undefined) return false;
    var monthStart = new Date(2026, m, 1);
    var near = new Date(); near.setDate(near.getDate()+45);
    return monthStart <= near && new Date(2026, m, 28) >= now;
  });

  function actionSection(emoji, title, color, items, actionText) {
    if (!items.length) return '';
    var canEditUser = canEdit(getCurrentUser());
    return '<div style="margin-bottom:20px">'
      + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid '+color+'">'
      + '<span style="font-size:16px">'+emoji+'</span>'
      + '<div style="font-family:var(--font-head);font-size:15px;font-weight:800;color:'+color+'">'+title+'</div>'
      + '<span style="font-size:11px;background:'+color+'22;color:'+color+';padding:2px 8px;border-radius:4px;font-family:var(--font-mono)">'+items.length+' items</span>'
      + '</div>'
      + items.map(function(r) {
          return '<div style="background:var(--bg-card);border:1px solid var(--border);border-left:4px solid '+color+';border-radius:var(--radius);padding:12px 16px;margin-bottom:8px;display:flex;align-items:flex-start;gap:12px">'
            + '<div style="flex:1">'
            + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">'
            + '<span style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono)">'+escHtml(r.id)+'</span>'
            + taTypeBadge(r.type)
            + '<span style="font-size:10px;color:var(--text-muted)">'+escHtml(r.month)+' 2026</span>'
            + '</div>'
            + '<div style="font-size:13px;font-weight:700;margin-bottom:4px">'+escHtml(r.event)+'</div>'
            + '<div style="font-size:11px;color:var(--text-secondary)">👥 '+escHtml(r.participants)+' &nbsp;·&nbsp; 👤 '+escHtml(r.pic)+' &nbsp;·&nbsp; 📅 '+escHtml(r.date)+'</div>'
            + '<div style="margin-top:6px;font-size:11px;font-weight:700;color:'+color+';background:'+color+'15;padding:4px 10px;border-radius:4px;display:inline-block">→ '+actionText+'</div>'
            + '</div>'
            + (canEditUser ? '<div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">'
                + '<button class="btn-sys btn-outline btn-xs" onclick="openTaUpdate(\''+r.id+'\')">Update</button>'
                + '<button class="btn-sys btn-xs" onclick="openTaAssignTask(\''+r.id+'\')" style="background:rgba(0,212,170,.15);color:var(--accent2);border:1px solid var(--accent2);border-radius:var(--radius);cursor:pointer;padding:2px 8px;font-size:11px;white-space:nowrap"><i class="fa-solid fa-user-plus"></i> Assign</button>'
                + '</div>' : '')
            + '</div>';
        }).join('')
      + '</div>';
  }

  var html = actionSection('❓','Confirm Date - TBD','var(--text-muted)',needDate,'Confirm training date and update')
           + actionSection('⏳','Awaiting Approval','var(--warning)',needApproval,'Get management / budget approval')
           + actionSection('📅','Coming Up - Finalise Now','var(--accent)',upcoming,'Confirm arrangements and assign coordinator');

  container.innerHTML = html || '<div style="text-align:center;padding:40px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg)"><div style="font-size:36px;margin-bottom:12px">✅</div><div style="font-size:15px;font-weight:600;margin-bottom:6px">No pending actions</div><div style="font-size:13px;color:var(--text-muted)">All activities are on track.</div></div>';
}

window.openTaUpdate = function(id) {
  var data = taGetData();
  var r    = data.find(function(rec){return rec.id===id;});
  if (!r) return;
  var modal = document.getElementById('ta-update-modal');
  if (!modal) { showToast('Update modal not found.','error'); return; }
  document.getElementById('ta-u-id').value     = r.id;
  document.getElementById('ta-u-event').value  = r.event;
  document.getElementById('ta-u-status').value = r.status;
  if (document.getElementById('ta-u-remarks')) document.getElementById('ta-u-remarks').value = r.remarks || '';
  if (document.getElementById('ta-u-date'))    document.getElementById('ta-u-date').value    = r.date    || '';
  modal.classList.add('show');
};

window.saveTaUpdate = function() {
  var user = getCurrentUser();
  if (!canEdit(user)) { showToast('Insufficient permissions.','error'); return; }
  var id      = document.getElementById('ta-u-id').value;
  var status  = document.getElementById('ta-u-status').value;
  var remarks = document.getElementById('ta-u-remarks') ? document.getElementById('ta-u-remarks').value.trim() : '';
  var date    = document.getElementById('ta-u-date')    ? document.getElementById('ta-u-date').value.trim()    : '';
  taSaveStatus(id, status, remarks, date);
  document.getElementById('ta-update-modal').classList.remove('show');
  showToast('Status updated','success');
  renderArrangement();
};

window.openTaAssignTask = function(id) {
  var data = taGetData();
  var r    = data.find(function(rec){return rec.id===id;});
  if (!r) return;
  var desc = 'Arrange: '+r.event+' - '+r.participants+' ('+r.month+' 2026, '+r.date+')';
  openAssignTask('training', r.id, desc, '');
};

window.taGetConducted = function() {
  return taGetData().filter(function(r){return r.status==='Done'||r.status==='In Progress';});
};

window.taGetAllCalendar = function() {
  return taGetData();
};

window.exportArrangementExcel = function() {
  var XLSX = window.XLSX;
  var data = taGetData();
  var wb   = XLSX.utils.book_new();
  var now  = new Date().toISOString().split('T')[0];

  var sumWs = XLSX.utils.aoa_to_sheet([
    ['Jetama Water Sdn. Bhd. - HSE Training Calendar 2026'],
    ['SHE-CAL-2026 v2.0 | Generated: '+now],[],
    ['Status','Count'],
    ['Done',              data.filter(function(r){return r.status==='Done';}).length],
    ['In Progress',       data.filter(function(r){return r.status==='In Progress';}).length],
    ['Pending Approval',  data.filter(function(r){return r.status==='Pending Approval';}).length],
    ['Planned',           data.filter(function(r){return r.status==='Planned';}).length],
    ['TBD',               data.filter(function(r){return r.status==='TBD';}).length],
    ['TOTAL',             data.length],
  ]);
  sumWs['!cols'] = [{wch:24},{wch:12}];
  XLSX.utils.book_append_sheet(wb, sumWs, 'Summary');

  var h = ['ID','Month','No.','Training / Event','Type','Participants','Trainer / PIC','Date','Status','Remarks'];
  var rows = data.map(function(r){return [r.id,r.month,r.no,r.event,r.type,r.participants,r.pic,r.date,r.status,r.remarks||''];});
  var calWs = XLSX.utils.aoa_to_sheet([['HSE Training Calendar 2026'],['SHE-CAL-2026 | '+now],[],h].concat(rows));
  calWs['!cols']=[{wch:10},{wch:12},{wch:5},{wch:48},{wch:20},{wch:38},{wch:18},{wch:18},{wch:20},{wch:30}];
  XLSX.utils.book_append_sheet(wb, calWs, 'Full Calendar');

  XLSX.writeFile(wb, 'HSE_Training_Calendar_'+now+'.xlsx');
  showToast('Training calendar exported!','success');
};
