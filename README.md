# 🏭 Integrated OI/HSE Governance & Compliance Monitoring System

A professional, web-based industrial safety and governance platform built for Water Treatment Plants and industrial operations. Fully deployable on **GitHub Pages** with no backend required — all data stored in `localStorage`.

---

## 🎯 System Purpose

Designed for:
- **Occupational Safety & Health (OSH)** monitoring
- **ISO Governance** (ISO 9001 / 39001 / 37001 / 45001)
- **CAPA Monitoring** (Corrective & Preventive Actions)
- **Compliance & Legal Monitoring** (DOSH / JKKP)
- **SHC Governance** (Safety & Health Committee)
- **Operational Improvement (OI)** tracking
- **Water Treatment Plant** operations management
- **Executive Reporting** (Two-Weekly / Monthly / Annual)

---

## 👥 User Roles

| Role | Credentials | Access |
|------|-------------|--------|
| **Admin** | `admin` / `admin123` | Full access — all modules, add/edit/delete, export |
| **OSH Coordinator** | `oshcoord` / `osh123` | Operational access — add/edit records, generate reports |
| **HSE AGM** | `hseagm` / `agm123` | Read-only — view dashboards, KPIs, reports (no edit) |

---

## 📦 Features

### Dashboard
- 8 real-time KPI cards (Open Actions, Overdue, CAPA %, Training %, Compliance Alerts, Critical Issues, SHC Outstanding, Upcoming Expiry)
- 4 Chart.js analytics (CAPA trend, Issues trend, Compliance pie, Training trend)
- Live alert feed with severity classification
- Recent issues and CAPA tables
- Global search

### HSE Training Monitoring
- Full training matrix with expiry tracking
- Auto-status: Valid / Expiring Soon / Expired (based on expiry date)
- KPIs: Total, Valid, Expiring, Expired, Training Hours, Compliance %
- Filter by Department, Status, Search
- Export to Excel

### Safety Issues & Inspection
- Categories: Unsafe Act, Unsafe Condition, Near Miss, Incident, PTW, Fire Extinguisher, LEV Inspection, Housekeeping, Contractor Safety
- Risk levels: Low / Medium / High / Critical
- Status flow: Open → In Progress → Pending Verification → Closed / Overdue
- Aging indicator (on-time / 1–7d / 8–14d / >14d overdue)
- Filter by Category, Risk, Status, Search

### CAPA & ISO Governance
- Supports: ISO 9001, ISO 39001, ISO 37001, ISO 45001
- Finding types: NCR, OFI, MRM Action, Audit Finding, Risk Register, Objective
- Root cause + corrective action tracking
- Closure rate KPI

### Compliance & Legal Monitoring
- JKKP 6, 8, 12 tracking
- Competent Fitter (CF) — Renewal / New / Transfer
- CHRA, Noise Risk Assessment (NRA), CIMAH NRA
- Site Registration
- Auto-alert for expiring items (≤30 days)

### SHC Governance
- Meeting scheduling and minutes recording
- Attendance tracking (%)
- Outstanding action tracker with aging

### Reporting Management
- **Two-Weekly Report** — Sections A–G (Executive Summary, HSE, CAPA, Compliance, SHC, Training, Management Attention)
- **Monthly Report**
- **Annual Report**
- Export to **PDF** (jsPDF, multi-page A4)
- Export to **Excel** (SheetJS, multi-sheet workbook)
- Print-ready layout

### Smart Alert System
- Auto-generates alerts for:
  - Expired / expiring compliance items
  - Expired / expiring training
  - Overdue CAPA actions
  - Overdue safety issues
  - Critical unresolved issues
  - Overdue SHC actions
- Notification panel in top bar

---

## 🗂️ File Structure

```
hse-system/
├── index.html          # Main application shell (all modules)
├── login.html          # Login page with role quick-select
├── style.css           # Full design system & layout
├── app.js              # Core: auth, data layer, utilities, navigation
├── modules.js          # Page renderers: Dashboard, Training, Issues, CAPA, Compliance, SHC
├── report.js           # Report builder, PDF export, Excel export
├── sample-data.json    # Seed data (auto-loaded on first run)
└── README.md           # This file
```

---

## 🚀 Installation & GitHub Pages Deployment

### Local (No server needed)
1. Download / clone all files into one folder
2. Open `login.html` in any modern browser
3. Log in with any of the credentials above

> **Note:** For `sample-data.json` to load correctly locally, serve from a local server:
> ```bash
> # Python 3
> python -m http.server 8080
> # Then open: http://localhost:8080/login.html
> ```

### GitHub Pages Deployment
1. Create a new GitHub repository (e.g. `hse-governance`)
2. Upload all files to the **root** of the `main` branch
3. Go to **Settings → Pages → Source → Branch: main / (root)**
4. Click **Save** — your site will be live at:
   `https://yourusername.github.io/hse-governance/login.html`

---

## 🔧 Technologies Used

| Technology | Purpose |
|-----------|---------|
| HTML5 | Structure & semantic markup |
| CSS3 | Custom design system, animations, responsive layout |
| JavaScript (ES6+) | Application logic, data management |
| Chart.js 4.4 | Dashboard analytics charts |
| jsPDF 2.5 | PDF report generation |
| SheetJS (xlsx) 0.18 | Excel export (multi-sheet) |
| Font Awesome 6.5 | Icons |
| Google Fonts | Rajdhani + Source Sans 3 + IBM Plex Mono |
| localStorage | Client-side data persistence |

---

## 🎨 Design System

- **Dark mode default** with light mode toggle
- **Color coding:** Green = Valid/Closed · Yellow = Pending/Expiring · Red = Overdue/Expired/Critical · Blue = Open
- **Aging indicators:** On-time · 1–7d · 8–14d · >14d overdue
- Responsive sidebar navigation
- Mobile-friendly layout

---

## 📋 Sample Data Included

The system seeds with realistic WTP data:
- 6 Training records (mix of Valid, Expiring, Expired)
- 6 Safety Issues (Open, Overdue, Critical, Closed)
- 6 CAPA records across ISO 9001 / 39001 / 37001 / 45001
- 8 Compliance items (JKKP6/8/12, CF, CHRA, NRA, CIMAH)
- 4 SHC actions (Closed, Overdue, In Progress, Open)
- 7-month trend data for charts

---

## 🔒 Notes

- All data is stored in **browser localStorage** — no backend, no database
- Data persists between sessions on the same browser
- To reset all data: open browser DevTools → Application → localStorage → Clear
- For production use, replace localStorage with a backend API (Node.js / Firebase / Supabase)

---

*OI/HSE Governance System — Built for industrial operational excellence*
