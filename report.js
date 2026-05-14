/* ============================================================
   report.js — Report Generation (PDF & Excel)
   Two-Weekly / Monthly / Annual Reports
   ============================================================ */

'use strict';

let currentReportType = 'two-weekly';

// ── Period start date based on report type ───────────────────
function reportPeriodStart() {
  const now = new Date();
  if (currentReportType === 'two-weekly') {
    const d = new Date(now);
    d.setDate(d.getDate() - 14);
    return d.toISOString().split('T')[0];
  }
  if (currentReportType === 'monthly') {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  }
  if (currentReportType === 'annual') {
    return new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
  }
  // default: 14 days
  const d = new Date(now); d.setDate(d.getDate()-14);
  return d.toISOString().split('T')[0];
}

// ── Build report preview HTML ────────────────────────────────
function buildReportPreview(type) {
  currentReportType = type;
  const kpi        = calcKPIs();
  const alerts     = generateAlerts();
  const training   = getData(KEYS.training);
  const issues     = getData(KEYS.issues);
  const capa       = getData(KEYS.capa);
  const compliance = getData(KEYS.compliance);
  const shc        = getData(KEYS.shc);
  const now        = new Date();
  const reportDate = now.toLocaleDateString('en-MY', { day:'2-digit', month:'long', year:'numeric' });
  const reportRef  = `RPT-${type.toUpperCase().replace('-','')}-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}`;

  const titles = {
    'two-weekly': 'Two-Weekly HSE Performance Report',
    'monthly':    'Monthly HSE & Compliance Report',
    'annual':     'Annual OI/HSE Governance Report'
  };

  const container = document.getElementById('report-preview');
  if (!container) return;

  container.innerHTML = `
    <!-- Report Header -->
    <div style="background:var(--primary-dark);border-radius:var(--radius);padding:20px;margin-bottom:16px;border:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
        <div>
          <div style="font-family:var(--font-head);font-size:22px;font-weight:700;letter-spacing:0.04em">${titles[type]}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">Water Treatment Plant — OI/HSE Governance & Compliance Division</div>
        </div>
        <div style="text-align:right;font-size:12px;color:var(--text-secondary);font-family:var(--font-mono)">
          <div>Ref: ${reportRef}</div>
          <div>Date: ${reportDate}</div>
          <div>Prepared by: HSE Division</div>
        </div>
      </div>
    </div>

    <!-- Section A: Executive Summary -->
    ${reportSection('A', 'EXECUTIVE SUMMARY', `
      <div class="grid-2" style="gap:10px;margin-bottom:12px">
        ${execSumCard('Total Open Actions', kpi.totalOpen, kpi.totalOpen > 10 ? 'danger' : 'warning')}
        ${execSumCard('Overdue Actions', kpi.totalOverdue, kpi.totalOverdue > 0 ? 'danger' : 'success')}
        ${execSumCard('CAPA Closure Rate', kpi.capaPct+'%', kpi.capaPct >= 80 ? 'success' : kpi.capaPct >= 50 ? 'warning' : 'danger')}
        ${execSumCard('Training Compliance', kpi.trPct+'%', kpi.trPct >= 85 ? 'success' : kpi.trPct >= 70 ? 'warning' : 'danger')}
        ${execSumCard('Compliance Alerts', kpi.cmpAlerts, kpi.cmpAlerts > 0 ? 'danger' : 'success')}
        ${execSumCard('Critical Unresolved', kpi.totalCrit, kpi.totalCrit > 0 ? 'danger' : 'success')}
      </div>
      ${alerts.filter(a=>a.type==='critical').length > 0 ? `
        <div style="background:rgba(224,60,49,0.1);border:1px solid rgba(224,60,49,0.3);border-radius:var(--radius);padding:12px;margin-top:8px">
          <div style="font-weight:700;color:var(--danger);font-family:var(--font-head);margin-bottom:6px">⚠ CRITICAL ITEMS REQUIRING MANAGEMENT ATTENTION</div>
          ${alerts.filter(a=>a.type==='critical').map(a=>`<div style="font-size:12px;padding:4px 0;border-bottom:1px solid rgba(224,60,49,0.15);color:var(--text-secondary)">• ${escHtml(a.title)} — ${escHtml(a.desc)}</div>`).join('')}
        </div>` : `<div style="color:var(--success);font-size:13px;padding:8px;background:rgba(29,185,84,0.08);border-radius:var(--radius)">✓ No critical alerts at this time.</div>`}
    `)}

    <!-- Section B: HSE Performance -->
    ${reportSection('B', 'HSE PERFORMANCE — SAFETY ISSUES & INSPECTIONS', `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px">
        ${miniStatCard('Total Issues', issues.length)}
        ${miniStatCard('Open', issues.filter(r=>r.status==='Open').length)}
        ${miniStatCard('Overdue', issues.filter(r=>r.status==='Overdue').length, 'danger')}
        ${miniStatCard('Closed', issues.filter(r=>r.status==='Closed').length, 'success')}
      </div>
      <table class="sys-table" style="margin-bottom:12px">
        <thead><tr>
          <th>ID</th><th>Category</th><th>Description</th><th>Risk</th><th>Location</th><th>PIC</th><th>Due Date</th><th>Status</th>
        </tr></thead>
        <tbody>
          ${issues.map(r=>`<tr>
            <td class="td-id">${escHtml(r.id)}</td>
            <td style="font-size:12px">${escHtml(r.category)}</td>
            <td style="font-size:12px">${escHtml(r.description.substring(0,55))}${r.description.length>55?'…':''}</td>
            <td>${riskBadge(r.riskLevel)}</td>
            <td style="font-size:12px">${escHtml(r.location)}</td>
            <td style="font-size:12px">${escHtml(r.pic)}</td>
            <td style="font-size:12px">${formatDate(r.dueDate)}</td>
            <td>${statusBadge(r.status)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div class="stat-row"><span class="stat-row-label">UAUC Reported</span><span class="stat-row-value">${issues.filter(r=>r.category==='Unsafe Act'||r.category==='Unsafe Condition').length}</span></div>
      <div class="stat-row"><span class="stat-row-label">Near Miss</span><span class="stat-row-value">${issues.filter(r=>r.category==='Near Miss').length}</span></div>
      <div class="stat-row"><span class="stat-row-label">Fire Extinguisher Issues</span><span class="stat-row-value">${issues.filter(r=>r.category==='Fire Extinguisher').length}</span></div>
      <div class="stat-row"><span class="stat-row-label">Housekeeping</span><span class="stat-row-value">${issues.filter(r=>r.category==='Housekeeping').length}</span></div>
    `)}

    <!-- Section C: CAPA & ISO -->
    ${reportSection('C', 'CAPA & ISO GOVERNANCE', `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px">
        ${miniStatCard('Total CAPA', capa.length)}
        ${miniStatCard('Open', capa.filter(r=>r.status==='Open').length)}
        ${miniStatCard('Overdue', capa.filter(r=>r.status==='Overdue').length, 'danger')}
        ${miniStatCard('Closed', capa.filter(r=>r.status==='Closed').length, 'success')}
      </div>
      <table class="sys-table" style="margin-bottom:12px">
        <thead><tr><th>ID</th><th>Standard</th><th>Type</th><th>Description</th><th>PIC</th><th>Due Date</th><th>Status</th></tr></thead>
        <tbody>
          ${capa.map(r=>`<tr>
            <td class="td-id">${escHtml(r.id)}</td>
            <td><span style="font-size:10px;color:var(--accent)">${escHtml(r.isoStandard)}</span></td>
            <td style="font-size:12px">${escHtml(r.findingType)}</td>
            <td style="font-size:12px">${escHtml(r.description.substring(0,50))}${r.description.length>50?'…':''}</td>
            <td style="font-size:12px">${escHtml(r.pic)}</td>
            <td style="font-size:12px">${formatDate(r.dueDate)}</td>
            <td>${statusBadge(r.status)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div class="stat-row"><span class="stat-row-label">NCR</span><span class="stat-row-value">${capa.filter(r=>r.findingType==='NCR').length}</span></div>
      <div class="stat-row"><span class="stat-row-label">OFI</span><span class="stat-row-value">${capa.filter(r=>r.findingType==='OFI').length}</span></div>
      <div class="stat-row"><span class="stat-row-label">MRM Actions</span><span class="stat-row-value">${capa.filter(r=>r.findingType==='MRM Action').length}</span></div>
      <div class="stat-row"><span class="stat-row-label">CAPA Closure %</span><span class="stat-row-value" style="color:${kpi.capaPct>=80?'var(--success)':kpi.capaPct>=50?'var(--warning)':'var(--danger)'}">${kpi.capaPct}%</span></div>
    `)}

    <!-- Section D: Compliance -->
    ${reportSection('D', 'COMPLIANCE & LEGAL STATUS', `
      <table class="sys-table" style="margin-bottom:12px">
        <thead><tr><th>ID</th><th>Item</th><th>Authority</th><th>Reference</th><th>Expiry Date</th><th>PIC</th><th>Status</th><th>Remarks</th></tr></thead>
        <tbody>
          ${compliance.map(r=>`<tr>
            <td class="td-id">${escHtml(r.id)}</td>
            <td style="font-size:12px;font-weight:600">${escHtml(r.item)}</td>
            <td style="font-size:12px">${escHtml(r.authority)}</td>
            <td style="font-size:11px;font-family:var(--font-mono)">${escHtml(r.referenceNo)}</td>
            <td style="font-size:12px">${formatDate(r.expiryDate)}</td>
            <td style="font-size:12px">${escHtml(r.pic)}</td>
            <td>${statusBadge(r.status)}</td>
            <td style="font-size:11px;color:var(--text-muted)">${escHtml(r.remarks)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div class="stat-row"><span class="stat-row-label">Valid Items</span><span class="stat-row-value" style="color:var(--success)">${compliance.filter(r=>r.status==='Valid').length}</span></div>
      <div class="stat-row"><span class="stat-row-label">Expiring Soon (≤30 days)</span><span class="stat-row-value" style="color:var(--warning)">${compliance.filter(r=>r.status==='Expiring Soon').length}</span></div>
      <div class="stat-row"><span class="stat-row-label">Expired — Action Required</span><span class="stat-row-value" style="color:var(--danger)">${compliance.filter(r=>r.status==='Expired').length}</span></div>
    `)}

    <!-- Section E: SHC -->
    ${reportSection('E', 'SHC GOVERNANCE', `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px">
        ${miniStatCard('Total Actions', shc.length)}
        ${miniStatCard('Open/In-Progress', shc.filter(r=>r.status==='Open'||r.status==='In Progress').length)}
        ${miniStatCard('Overdue', shc.filter(r=>r.status==='Overdue').length, 'danger')}
        ${miniStatCard('Closed', shc.filter(r=>r.status==='Closed').length, 'success')}
      </div>
      <table class="sys-table">
        <thead><tr><th>ID</th><th>Meeting Date</th><th>Issue Raised</th><th>Action Required</th><th>PIC</th><th>Due Date</th><th>Status</th></tr></thead>
        <tbody>
          ${shc.map(r=>`<tr>
            <td class="td-id">${escHtml(r.id)}</td>
            <td style="font-size:12px">${formatDate(r.meetingDate)}</td>
            <td style="font-size:12px">${escHtml(r.issueRaised.substring(0,45))}…</td>
            <td style="font-size:12px">${escHtml(r.actionRequired.substring(0,45))}…</td>
            <td style="font-size:12px">${escHtml(r.pic)}</td>
            <td style="font-size:12px">${formatDate(r.dueDate)}</td>
            <td>${statusBadge(r.status)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    `)}

    <!-- Section F: Training -->
    ${reportSection('F', 'TRAINING & COMPETENCY', (() => {
      const periodStart = reportPeriodStart();
      const periodEnd   = new Date().toISOString().split('T')[0];

      // ── Conducted in this period (from training records) ─────
      const conducted = training.filter(r => r.trainingDate >= periodStart && r.trainingDate <= periodEnd);
      const sessions  = {};
      conducted.forEach(r => {
        const key = (r.trainingName||'') + '||' + (r.trainingDate||'');
        if (!sessions[key]) sessions[key] = { trainingName: r.trainingName, trainingDate: r.trainingDate, staff: [], totalHours: 0 };
        sessions[key].staff.push(r.employeeName || r.pic || '—');
        sessions[key].totalHours += parseInt(r.hours,10)||0;
      });
      const sessionList    = Object.values(sessions).sort((a,b)=>(a.trainingDate||'').localeCompare(b.trainingDate||''));
      const totalStaffTrained = [...new Set(conducted.map(r=>r.employeeName||r.pic).filter(Boolean))].length || conducted.length;
      const totalHours     = conducted.reduce((s,r)=>s+(parseInt(r.hours,10)||0),0);

      // ── Yearly plan from HSE Calendar ────────────────────────
      const calData   = typeof taGetAllCalendar === 'function' ? taGetAllCalendar() : [];
      const calDone   = calData.filter(r=>r.status==='Done').length;
      const calTotal  = calData.length;
      const calPct    = calTotal ? Math.round(calDone/calTotal*100) : 0;
      const calPending= calData.filter(r=>r.status==='Pending Approval'||r.status==='TBD').length;

      // ── Competency status ─────────────────────────────────────
      const valid    = training.filter(r=>r.status==='Valid'||r.status==='Completed').length;
      const expiring = training.filter(r=>r.status==='Expiring Soon').length;
      const expired  = training.filter(r=>r.status==='Expired').length;

      return `
      <!-- KPI summary -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px">
        ${miniStatCard('Trainings This Period', sessionList.length, sessionList.length>0?'success':'warning')}
        ${miniStatCard('Staff Trained', totalStaffTrained, totalStaffTrained>0?'success':'warning')}
        ${miniStatCard('Training Hours', totalHours+' hrs', totalHours>0?'success':'warning')}
        ${miniStatCard('Yearly Plan Progress', calPct+'%  ('+calDone+'/'+calTotal+')', calPct>=50?'success':'warning')}
      </div>

      <!-- Trainings Conducted This Period -->
      <div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid var(--border)">
        📋 Trainings Conducted — ${periodStart} to ${periodEnd}
      </div>
      ${sessionList.length > 0 ? `
      <table class="sys-table" style="margin-bottom:16px">
        <thead><tr>
          <th>#</th><th>Training Name / Programme</th><th>Date</th><th>No. of Staff</th><th>Training Hours</th>
        </tr></thead>
        <tbody>
          ${sessionList.map((s,i) => `<tr>
            <td style="text-align:center">${i+1}</td>
            <td style="font-weight:600;font-size:12px">${escHtml(s.trainingName||'—')}</td>
            <td style="font-size:12px;font-family:var(--font-mono)">${formatDate(s.trainingDate)||'—'}</td>
            <td style="text-align:center;font-weight:700;color:var(--accent)">${s.staff.length||'—'}</td>
            <td style="text-align:center;font-family:var(--font-mono)">${s.totalHours||'—'} hrs</td>
          </tr>`).join('')}
          <tr style="background:var(--bg-dark);font-weight:700">
            <td colspan="2">TOTAL</td><td></td>
            <td style="text-align:center;color:var(--accent)">${totalStaffTrained}</td>
            <td style="text-align:center;font-family:var(--font-mono)">${totalHours} hrs</td>
          </tr>
        </tbody>
      </table>` : `
      <div style="background:rgba(245,166,35,.08);border:1px solid rgba(245,166,35,.2);border-radius:var(--radius);padding:12px;margin-bottom:16px;font-size:12px;color:var(--warning)">
        No training records found for this reporting period.
      </div>`}

      <!-- Yearly Plan Progress from HSE Calendar -->
      ${calData.length > 0 ? `
      <div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid var(--border)">
        📅 HSE Training Yearly Plan 2026 — Progress (SHE-CAL-2026)
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
        <div style="background:rgba(29,185,84,.08);border:1px solid rgba(29,185,84,.2);border-radius:var(--radius);padding:10px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--success)">${calDone}</div>
          <div style="font-size:11px;color:var(--text-muted)">Done</div>
        </div>
        <div style="background:rgba(0,170,255,.08);border:1px solid rgba(0,170,255,.2);border-radius:var(--radius);padding:10px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--accent)">${calData.filter(r=>r.status==='In Progress').length}</div>
          <div style="font-size:11px;color:var(--text-muted)">In Progress</div>
        </div>
        <div style="background:rgba(245,166,35,.08);border:1px solid rgba(245,166,35,.2);border-radius:var(--radius);padding:10px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--warning)">${calPending}</div>
          <div style="font-size:11px;color:var(--text-muted)">Pending / TBD</div>
        </div>
      </div>
      <table class="sys-table" style="margin-bottom:16px">
        <thead><tr><th>Month</th><th>Activity</th><th>Type</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>
          ${calData.filter(r=>r.status==='Done'||r.status==='In Progress').map(r=>`<tr>
            <td style="font-size:11px;color:var(--accent);font-weight:600">${escHtml(r.month)}</td>
            <td style="font-size:12px;font-weight:600">${escHtml(r.event)}</td>
            <td style="font-size:11px">${escHtml(r.type)}</td>
            <td style="font-size:11px;font-family:var(--font-mono)">${escHtml(r.date)}</td>
            <td>${statusBadge(r.status)}</td>
          </tr>`).join('')}
        </tbody>
      </table>` : ''}

      <!-- Competency status -->
      <div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid var(--border)">
        🎓 Staff Competency Status
      </div>
      <div style="display:flex;gap:10px;margin-bottom:8px;flex-wrap:wrap">
        <span style="font-size:12px">✅ Valid / Completed: <strong style="color:var(--success)">${valid}</strong></span>
        <span style="font-size:12px">⚠️ Expiring Soon: <strong style="color:var(--warning)">${expiring}</strong></span>
        <span style="font-size:12px">❌ Expired: <strong style="color:var(--danger)">${expired}</strong></span>
      </div>
      <div class="stat-row"><span class="stat-row-label">Yearly Plan Completion</span><span class="stat-row-value" style="color:${calPct>=50?'var(--success)':'var(--warning)'}">${calPct}%</span></div>
      <div class="stat-row"><span class="stat-row-label">Total Training Hours (Period)</span><span class="stat-row-value">${totalHours} hrs</span></div>
    `})())}



    <!-- Section G: Management Attention -->
    ${reportSection('G', 'MANAGEMENT ATTENTION ITEMS', `
      ${alerts.length === 0
        ? `<div style="color:var(--success);padding:12px;background:rgba(29,185,84,0.08);border-radius:var(--radius)">✓ No management attention items at this time. All systems within acceptable parameters.</div>`
        : alerts.map(a=>`
        <div class="alert-item alert-${a.type}" style="margin-bottom:6px">
          <div class="alert-icon"><i class="fa-solid ${a.icon}"></i></div>
          <div>
            <div class="alert-title">${escHtml(a.title)}</div>
            <div class="alert-desc">${escHtml(a.desc)}</div>
            <div class="alert-time">${escHtml(a.time)}</div>
          </div>
        </div>`).join('')
      }
    `)}

    <!-- Footer -->
    <div style="text-align:center;padding:16px;color:var(--text-muted);font-size:11px;font-family:var(--font-mono);border-top:1px solid var(--border);margin-top:16px">
      CONFIDENTIAL — OI/HSE GOVERNANCE SYSTEM | Generated: ${reportDate} | Ref: ${reportRef}
    </div>
  `;
}

function reportSection(letter, title, content) {
  return `
    <div class="report-section" style="margin-bottom:14px">
      <div class="report-section-header">
        <span style="color:var(--accent);font-family:var(--font-mono)">§${letter}</span>
        <span style="margin-left:10px">${title}</span>
      </div>
      <div class="report-section-body">${content}</div>
    </div>`;
}

function execSumCard(label, value, type='info') {
  const colors = { success:'var(--success)', danger:'var(--danger)', warning:'var(--warning)', info:'var(--accent)' };
  const bgs    = { success:'rgba(29,185,84,0.08)', danger:'rgba(224,60,49,0.08)', warning:'rgba(245,166,35,0.08)', info:'rgba(0,170,255,0.08)' };
  return `<div style="background:${bgs[type]||bgs.info};border:1px solid var(--border);border-radius:var(--radius);padding:12px;text-align:center">
    <div style="font-family:var(--font-head);font-size:26px;font-weight:700;color:${colors[type]||colors.info}">${value}</div>
    <div style="font-size:11px;color:var(--text-muted);margin-top:2px;font-family:var(--font-mono)">${label}</div>
  </div>`;
}

function miniStatCard(label, value, type='') {
  const colors = { success:'var(--success)', danger:'var(--danger)', warning:'var(--warning)' };
  const color  = colors[type] || 'var(--text-primary)';
  return `<div style="background:var(--bg-dark);border:1px solid var(--border);border-radius:var(--radius);padding:10px;text-align:center">
    <div style="font-family:var(--font-head);font-size:22px;font-weight:700;color:${color}">${value}</div>
    <div style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono)">${label}</div>
  </div>`;
}

// ── Export to PDF ────────────────────────────────────────────
function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  
  const now   = new Date();
  const kpi   = calcKPIs();
  const training   = getData(KEYS.training);
  const issues     = getData(KEYS.issues);
  const capa       = getData(KEYS.capa);
  const compliance = getData(KEYS.compliance);
  const shc        = getData(KEYS.shc);
  const alerts     = generateAlerts();

  const titles = {
    'two-weekly': 'Two-Weekly HSE Performance Report',
    'monthly':    'Monthly HSE & Compliance Report',
    'annual':     'Annual OI/HSE Governance Report'
  };

  const W = 210, margin = 14;
  let y = margin;

  // Helpers
  function addPage() { doc.addPage(); y = margin; }
  function checkY(needed=20) { if (y + needed > 280) addPage(); }

  // Header bar
  doc.setFillColor(10, 58, 104);
  doc.rect(0, 0, W, 32, 'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(16); doc.setFont('helvetica','bold');
  doc.text(titles[currentReportType], margin, 13);
  doc.setFontSize(9); doc.setFont('helvetica','normal');
  doc.text('Water Treatment Plant — OI/HSE Governance & Compliance Division', margin, 20);
  doc.text(`Date: ${now.toLocaleDateString('en-MY')}   Ref: RPT-${currentReportType.toUpperCase().replace('-','')}-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}`, margin, 27);
  y = 40;

  // Section helper
  function sectionHeader(letter, title) {
    checkY(12);
    doc.setFillColor(10, 58, 104);
    doc.rect(margin-2, y-5, W - (margin-2)*2, 9, 'F');
    doc.setTextColor(0, 170, 255);
    doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text(`§${letter}`, margin, y);
    doc.setTextColor(255,255,255);
    doc.text(title, margin+8, y);
    y += 8;
    doc.setTextColor(30,30,30);
  }

  function kpiRow(label, value, color) {
    checkY(7);
    doc.setFontSize(9); doc.setFont('helvetica','normal');
    doc.setTextColor(80,80,80); doc.text(label, margin, y);
    if (color) doc.setTextColor(...color); else doc.setTextColor(30,30,30);
    doc.setFont('helvetica','bold');
    doc.text(String(value), W-margin-2, y, { align:'right' });
    doc.setFont('helvetica','normal');
    doc.setTextColor(200,200,200);
    doc.line(margin, y+1.5, W-margin, y+1.5);
    doc.setTextColor(30,30,30);
    y += 7;
  }

  function tableStart(headers, colWidths) {
    checkY(10);
    const totalW = colWidths.reduce((a,b)=>a+b,0);
    doc.setFillColor(20,40,70);
    doc.rect(margin-2, y-5, totalW+4, 8, 'F');
    doc.setTextColor(138,172,204);
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    let x = margin;
    headers.forEach((h,i)=>{ doc.text(h, x, y); x+=colWidths[i]; });
    y += 5;
    doc.setFont('helvetica','normal');
    doc.setTextColor(40,40,40);
  }

  function tableRow(cells, colWidths, shade=false) {
    checkY(8);
    if (shade) { doc.setFillColor(245,248,252); doc.rect(margin-2, y-5, colWidths.reduce((a,b)=>a+b,0)+4, 7, 'F'); }
    doc.setFontSize(7.5);
    let x = margin;
    cells.forEach((c,i)=>{
      const str = String(c||'—').substring(0,Math.floor(colWidths[i]/1.8));
      doc.text(str, x, y);
      x+=colWidths[i];
    });
    doc.setDrawColor(220,228,238);
    doc.line(margin-2, y+2, W-margin+2, y+2);
    y += 8;
  }

  // ── Section A ──
  sectionHeader('A','EXECUTIVE SUMMARY');
  kpiRow('Total Open Actions', kpi.totalOpen, kpi.totalOpen>10?[224,60,49]:null);
  kpiRow('Overdue Actions', kpi.totalOverdue, kpi.totalOverdue>0?[224,60,49]:null);
  kpiRow('CAPA Closure Rate', kpi.capaPct+'%', kpi.capaPct>=80?[29,185,84]:kpi.capaPct>=50?[245,166,35]:[224,60,49]);
  kpiRow('Training Compliance', kpi.trPct+'%', kpi.trPct>=85?[29,185,84]:kpi.trPct>=70?[245,166,35]:[224,60,49]);
  kpiRow('Compliance Alerts', kpi.cmpAlerts, kpi.cmpAlerts>0?[224,60,49]:null);
  kpiRow('Critical Unresolved Issues', kpi.totalCrit, kpi.totalCrit>0?[224,60,49]:null);
  y += 4;

  // ── Section B ──
  sectionHeader('B','HSE PERFORMANCE — SAFETY ISSUES');
  tableStart(['ID','Category','Description','Risk','PIC','Status'], [20,28,55,20,28,24]);
  issues.forEach((r,i)=>tableRow([r.id,r.category,(r.description||'').substring(0,30),r.riskLevel,r.pic,r.status],[20,28,55,20,28,24],i%2===0));
  y += 4;

  // ── Section C ──
  sectionHeader('C','CAPA & ISO GOVERNANCE');
  kpiRow('CAPA Closure Rate', kpi.capaPct+'%');
  kpiRow('Total NCR', capa.filter(r=>r.findingType==='NCR').length);
  kpiRow('Total OFI', capa.filter(r=>r.findingType==='OFI').length);
  kpiRow('MRM Actions', capa.filter(r=>r.findingType==='MRM Action').length);
  y += 4;
  tableStart(['ID','Standard','Type','Description','PIC','Status'],[20,22,24,55,25,24]);
  capa.forEach((r,i)=>tableRow([r.id,r.isoStandard,r.findingType,(r.description||'').substring(0,30),r.pic,r.status],[20,22,24,55,25,24],i%2===0));
  y += 4;

  // ── Section D ──
  sectionHeader('D','COMPLIANCE & LEGAL STATUS');
  tableStart(['ID','Item','Authority','Expiry','PIC','Status'],[18,55,22,22,28,24]);
  compliance.forEach((r,i)=>tableRow([r.id,(r.item||'').substring(0,30),r.authority,r.expiryDate,r.pic,r.status],[18,55,22,22,28,24],i%2===0));
  y += 4;

  // ── Section E ──
  sectionHeader('E','SHC GOVERNANCE');
  tableStart(['ID','Meeting','Issue Raised','Action','PIC','Status'],[18,22,48,48,25,24]);
  shc.forEach((r,i)=>tableRow([r.id,r.meetingDate,(r.issueRaised||'').substring(0,28),(r.actionRequired||'').substring(0,28),r.pic,r.status],[18,22,48,48,25,24],i%2===0));
  y += 4;

  // ── Section F ──
  sectionHeader('F','TRAINING & COMPETENCY');

  // Conducted this period
  const periodStart = reportPeriodStart();
  const periodEnd   = new Date().toISOString().split('T')[0];
  const conducted   = training.filter(r => r.trainingDate >= periodStart && r.trainingDate <= periodEnd);
  const sessions    = {};
  conducted.forEach(r => {
    const key = `${r.trainingName}||${r.trainingDate}`;
    if (!sessions[key]) sessions[key] = { name: r.trainingName, date: r.trainingDate, staff: [], hrs: 0 };
    sessions[key].staff.push(r.employeeName);
    sessions[key].hrs += parseInt(r.hours,10)||0;
  });
  const sessionList  = Object.values(sessions).sort((a,b)=>a.date.localeCompare(b.date));
  const staffTrained = [...new Set(conducted.map(r=>r.employeeName))].length;
  const totalHrs     = conducted.reduce((s,r)=>s+(parseInt(r.hours,10)||0),0);

  kpiRow('Trainings Conducted (Period)', sessionList.length, sessionList.length>0?[29,185,84]:null);
  kpiRow('Total Staff Trained (Period)', staffTrained);
  kpiRow('Total Training Hours (Period)', totalHrs+' hrs');
  kpiRow('Competency Compliance %', kpi.trPct+'%', kpi.trPct>=85?[29,185,84]:kpi.trPct>=70?[245,166,35]:[224,60,49]);
  y += 4;

  // Training sessions conducted table
  if (sessionList.length > 0) {
    checkY(8);
    doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(0,170,255);
    doc.text('Trainings Conducted This Period:', margin, y); y += 6;
    tableStart(['#','Training Name','Date','No. of Staff','Total Hours'],[10,65,26,24,22]);
    sessionList.forEach((s,i) => {
      tableRow([String(i+1), s.name.substring(0,38), s.date, String(s.staff.length), String(s.hrs)+' hrs'],
               [10,65,26,24,22], i%2===0);
    });
    y += 4;
  }

  // Expired / expiring
  const needAction = training.filter(r=>r.status==='Expired'||r.status==='Expiring Soon')
                              .sort((a,b)=>new Date(a.expiryDate)-new Date(b.expiryDate));
  if (needAction.length > 0) {
    checkY(8);
    doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(224,60,49);
    doc.text('Competency Action Required:', margin, y); y += 6;
    tableStart(['ID','Employee','Department','Training','Expiry','Status'],[18,30,25,45,22,24]);
    needAction.forEach((r,i)=>tableRow([r.id,r.employeeName,r.department,(r.trainingName||'').substring(0,25),r.expiryDate,r.status],[18,30,25,45,22,24],i%2===0));
  }
  y += 4;

  // ── Section G ──
  sectionHeader('G','MANAGEMENT ATTENTION ITEMS');
  if (alerts.length===0) {
    doc.setFontSize(9); doc.setTextColor(29,185,84);
    doc.text('No management attention items at this time.', margin, y); y += 8;
  } else {
    alerts.forEach(a => {
      checkY(9);
      doc.setFontSize(8.5); doc.setFont('helvetica','bold');
      doc.setTextColor(a.type==='critical'?[224,60,49]:a.type==='warning'?[245,166,35]:[0,170,255]);
      doc.text(`[${a.type.toUpperCase()}] ${a.title}`, margin, y);
      doc.setFont('helvetica','normal'); doc.setTextColor(80,80,80); y += 5;
      doc.setFontSize(8);
      doc.text(a.desc.substring(0,90), margin+4, y); y += 6;
    });
  }

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i=1; i<=pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(10,58,104);
    doc.rect(0,287,W,10,'F');
    doc.setTextColor(100,140,180); doc.setFontSize(7.5);
    doc.text('CONFIDENTIAL — OI/HSE GOVERNANCE SYSTEM', margin, 293);
    doc.text(`Page ${i} of ${pageCount}`, W-margin, 293, { align:'right' });
  }

  doc.save(`HSE_Report_${currentReportType}_${now.toISOString().split('T')[0]}.pdf`);
  showToast('PDF exported successfully!','success');
}

// ── Export to Excel ──────────────────────────────────────────
function exportToExcel() {
  const XLSX   = window.XLSX;
  const wb     = XLSX.utils.book_new();
  const now    = new Date();

  // Issues sheet
  const issHeaders = ['ID','Category','Description','Risk Level','Location','PIC','Date Reported','Due Date','Status','Verification'];
  const issRows    = getData(KEYS.issues).map(r=>[r.id,r.category,r.description,r.riskLevel,r.location,r.pic,r.dateReported,r.dueDate,r.status,r.verification]);
  const issWS      = XLSX.utils.aoa_to_sheet([issHeaders,...issRows]);
  XLSX.utils.book_append_sheet(wb, issWS, 'Safety Issues');

  // CAPA sheet
  const capaHeaders = ['ID','ISO Standard','Finding Type','Description','Root Cause','Corrective Action','PIC','Due Date','Status','Verification'];
  const capaRows    = getData(KEYS.capa).map(r=>[r.id,r.isoStandard,r.findingType,r.description,r.rootCause,r.correctiveAction,r.pic,r.dueDate,r.status,r.verification]);
  const capaWS      = XLSX.utils.aoa_to_sheet([capaHeaders,...capaRows]);
  XLSX.utils.book_append_sheet(wb, capaWS, 'CAPA & ISO');

  // Compliance sheet
  const cmpHeaders = ['ID','Item','Authority','Reference No','Expiry Date','PIC','Status','Remarks'];
  const cmpRows    = getData(KEYS.compliance).map(r=>[r.id,r.item,r.authority,r.referenceNo,r.expiryDate,r.pic,r.status,r.remarks]);
  const cmpWS      = XLSX.utils.aoa_to_sheet([cmpHeaders,...cmpRows]);
  XLSX.utils.book_append_sheet(wb, cmpWS, 'Compliance');

  // Training — Conducted This Period sheet
  const trPeriodStart = reportPeriodStart();
  const trPeriodEnd   = now.toISOString().split('T')[0];
  const trAll         = getData(KEYS.training);
  const trConducted   = trAll.filter(r => r.trainingDate >= trPeriodStart && r.trainingDate <= trPeriodEnd);

  // Group into sessions
  const trSessions = {};
  trConducted.forEach(r => {
    const key = `${r.trainingName}||${r.trainingDate}`;
    if (!trSessions[key]) trSessions[key] = { name: r.trainingName, date: r.trainingDate, staff: [], hrs: 0 };
    trSessions[key].staff.push(r.employeeName);
    trSessions[key].hrs += parseInt(r.hours,10)||0;
  });
  const trSessionList  = Object.values(trSessions).sort((a,b)=>a.date.localeCompare(b.date));
  const trStaffTrained = [...new Set(trConducted.map(r=>r.employeeName))].length;
  const trTotalHrs     = trConducted.reduce((s,r)=>s+(parseInt(r.hours,10)||0),0);

  const tcHeaders = ['No.','Training Name','Date Conducted','No. of Staff Trained','Staff Names','Total Hours'];
  const tcRows    = trSessionList.map((s,i) => [i+1, s.name, s.date, s.staff.length, s.staff.join(', '), s.hrs]);
  const tcSummary = [
    [`TRAINING CONDUCTED — ${trPeriodStart} to ${trPeriodEnd}`],
    [`Jetama Water Sdn. Bhd. | SHE Division | Generated: ${now.toLocaleDateString('en-MY')}`],
    [],
    ['SUMMARY'],
    ['Total Trainings Conducted', trSessionList.length],
    ['Total Staff Trained', trStaffTrained],
    ['Total Training Hours', trTotalHrs],
    [],
    tcHeaders,
    ...tcRows,
    [],
    ['TOTAL', '', '', trStaffTrained, '', trTotalHrs],
  ];
  const tcWS = XLSX.utils.aoa_to_sheet(tcSummary);
  tcWS['!cols'] = [{wch:5},{wch:40},{wch:16},{wch:18},{wch:60},{wch:14}];
  XLSX.utils.book_append_sheet(wb, tcWS, 'Training Conducted');

  // Full Training Records sheet
  const trHeaders = ['ID','Employee Name','Employee ID','Department','Training Name','Training Date','Expiry Date','Status','Hours','Remarks'];
  const trRows    = trAll.map(r=>[r.id,r.employeeName,r.employeeId,r.department,r.trainingName,r.trainingDate,r.expiryDate,r.status,r.hours,r.remarks]);
  const trWS      = XLSX.utils.aoa_to_sheet([
    ['Full Training Records — All Staff'],
    [`Competency Compliance: ${calcKPIs().trPct}% | Total Records: ${trAll.length}`],
    [],
    trHeaders, ...trRows
  ]);
  trWS['!cols'] = [{wch:10},{wch:22},{wch:12},{wch:18},{wch:35},{wch:14},{wch:14},{wch:14},{wch:8},{wch:30}];
  XLSX.utils.book_append_sheet(wb, trWS, 'Training Records');

  // SHC sheet
  const shcHeaders = ['ID','Meeting Date','Issue Raised','Action Required','PIC','Due Date','Status','Verification'];
  const shcRows    = getData(KEYS.shc).map(r=>[r.id,r.meetingDate,r.issueRaised,r.actionRequired,r.pic,r.dueDate,r.status,r.verification]);
  const shcWS      = XLSX.utils.aoa_to_sheet([shcHeaders,...shcRows]);
  XLSX.utils.book_append_sheet(wb, shcWS, 'SHC');

  // KPI Summary
  const kpi = calcKPIs();
  const kpiHeaders = ['KPI','Value'];
  const kpiRows = [
    ['Total Open Actions', kpi.totalOpen],
    ['Overdue Actions', kpi.totalOverdue],
    ['CAPA Closure %', kpi.capaPct+'%'],
    ['Training Compliance %', kpi.trPct+'%'],
    ['Compliance Alerts', kpi.cmpAlerts],
    ['Critical Unresolved', kpi.totalCrit],
    ['SHC Outstanding', kpi.shcOut],
    ['Report Date', now.toLocaleDateString('en-MY')]
  ];
  const kpiWS = XLSX.utils.aoa_to_sheet([kpiHeaders,...kpiRows]);
  XLSX.utils.book_append_sheet(wb, kpiWS, 'KPI Summary');

  XLSX.writeFile(wb, `HSE_Report_${currentReportType}_${now.toISOString().split('T')[0]}.xlsx`);
  showToast('Excel exported successfully!','success');
}
