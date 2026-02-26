<p align="center">
  <img src="https://img.shields.io/badge/Platform-Web-059669?style=for-the-badge&logo=googlechrome&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Prototype-14b8a6?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-0d9488?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI--Powered-Yes-10b981?style=for-the-badge&logo=openai&logoColor=white" />
</p>

<h1 align="center">🌿 Green Supply Chain Guardian</h1>
<h3 align="center">AI-Powered Sustainability Platform for Modern Supply Chains</h3>

<p align="center">
  Monitor carbon emissions · Score supplier ESG performance · Optimize logistics routes<br/>
  <em>All powered by machine learning for a greener tomorrow.</em>
</p>

---

## 🎯 Vision & Objectives

**Green Supply Chain Guardian (GSCG)** is an enterprise-grade platform designed to help organizations **measure, manage, and minimize** the environmental impact of their entire supply chain — from raw material sourcing to last-mile delivery.

### Core Objectives

| Objective | Description |
|-----------|-------------|
| **Carbon Transparency** | Real-time tracking of Scope 1, 2 & 3 emissions across the full value chain |
| **Supplier Accountability** | ESG scoring engine evaluating suppliers across 50+ environmental, social, and governance criteria |
| **Logistics Optimization** | AI-driven route selection to minimize carbon footprint while maintaining delivery efficiency |
| **Regulatory Compliance** | Automated compliance with GHG Protocol, CSRD, ISO 14064, SBTi, CDP, and TCFD |
| **Actionable Intelligence** | ML-powered hotspot analysis and decarbonization recommendations |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        GREEN SUPPLY CHAIN GUARDIAN                    │
│                       System Architecture Overview                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────────────┐  │
│  │   Landing    │    │   Dashboard  │    │    App Pages           │  │
│  │   Page       │    │   Analytics  │    │  ┌──────────────────┐  │  │
│  │  ─────────   │    │  ──────────  │    │  │ Suppliers        │  │  │
│  │  Hero + CTA  │    │  KPI Cards   │    │  │ Emissions        │  │  │
│  │  Features    │    │  Charts      │    │  │ Logistics        │  │  │
│  │  Stats       │    │  Activity    │    │  │ Reports          │  │  │
│  │  Testimonials│    │  Actions     │    │  │ Settings         │  │  │
│  └─────────────┘    └──────────────┘    │  └──────────────────┘  │  │
│         │                  │             └──────────┬─────────────┘  │
│         └──────────────────┼────────────────────────┘               │
│                            │                                         │
│  ┌─────────────────────────┴─────────────────────────────────────┐  │
│  │                    SPA Router (Hash-based)                      │  │
│  │        main.js — Page Lifecycle & Navigation Manager            │  │
│  └─────────────────────────┬─────────────────────────────────────┘  │
│                            │                                         │
│  ┌─────────────────────────┴─────────────────────────────────────┐  │
│  │                    Shared Components                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │
│  │  │  Navbar   │  │  Charts  │  │  Toast   │  │  Design      │  │  │
│  │  │  Sidebar  │  │ Chart.js │  │ Notifs   │  │  System      │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                            │                                         │
│  ┌─────────────────────────┴─────────────────────────────────────┐  │
│  │                    Mock Data Layer                               │  │
│  │  mockData.js — Hardcoded realistic enterprise data              │  │
│  │  12 Suppliers · 10 Shipments · Emissions · Compliance · KPIs   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Production Architecture (Planned)

```
┌────────────────────────────────────────────────────────────────┐
│                     PRODUCTION STACK (PLANNED)                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Frontend          API Gateway       Backend Services          │
│  ┌──────────┐     ┌──────────┐     ┌──────────────────┐      │
│  │ React /  │────▶│ REST /   │────▶│ Auth Service     │      │
│  │ Next.js  │     │ GraphQL  │     │ Emissions Engine │      │
│  │          │     │          │     │ ESG Scoring      │      │
│  └──────────┘     └──────────┘     │ Route Optimizer  │      │
│                                     │ Compliance AI    │      │
│  Data Layer                         └────────┬─────────┘      │
│  ┌──────────────────────────────────────────┐│                │
│  │ PostgreSQL · Redis · S3 · ML Pipeline    ││                │
│  └──────────────────────────────────────────┘│                │
│                                               │                │
│  Integrations: SAP · Salesforce · BigQuery · Power BI         │
│  IoT: Fleet GPS · Warehouse Sensors · Smart Meters            │
└────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 📊 Dashboard & Analytics
- Real-time KPI monitoring (emissions, reduction targets, green score, compliance)
- Interactive Chart.js visualizations with monthly breakdowns
- Activity feed with live event stream
- Quick actions for common workflows

### 👥 Supplier Management
- ESG scoring engine with visual gauges (50+ criteria)
- Risk-level classification (Low / Medium / High / Critical)
- Certification tracking (ISO 14001, FSC, B Corp, GOTS, etc.)
- Searchable and filterable supplier directory
- Supplier onboarding workflow

### 📉 Carbon Tracking
- Scope 1, 2 & 3 emissions breakdown with doughnut charts
- 12-month trend analysis with reduction targets
- Emission hotspot identification table
- Interactive carbon calculator (distance × weight × mode)
- Reduction roadmap with milestone tracking (2023 → 2030)

### 🚛 Logistics & Shipments
- Active shipment tracker with progress bars
- Transport mode distribution analysis
- Supply chain network visualization
- Carbon-per-shipment metrics with severity coloring
- Multi-modal support: Sea, Rail, Air, Electric Truck

### 📋 Reports & Compliance
- 6 regulatory framework dashboards (GHG Protocol, CSRD, ISO 14064, SBTi, CDP, TCFD)
- Report generator with format selection (PDF, XLSX, CSV)
- Compliance score tracking with progress bars
- Audit trail with full event history
- Automated report generation simulation

### ⚙️ Settings
- Profile management with company info
- Notification preferences with toggle switches
- Integration management (SAP, Salesforce, Slack, BigQuery, Power BI)
- API key management and security settings

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Build Tool** | Vite 6 | Lightning-fast HMR and bundling |
| **Language** | Vanilla JavaScript (ES Modules) | Zero-dependency core logic |
| **Styling** | CSS Custom Properties + Glassmorphism | Premium design system |
| **Charts** | Chart.js 4 | Interactive data visualizations |
| **Typography** | Google Fonts (Outfit + Inter) | Premium font pairing |
| **Images** | AI-Generated (Gemini) | Hero backgrounds and scene imagery |
| **Routing** | Hash-based SPA Router | Client-side navigation |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/sxhaakee/Green-Supply-Chain-Guardian.git

# Navigate to project directory
cd Green-Supply-Chain-Guardian

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
Green-Supply-Chain-Guardian/
├── public/
│   └── images/
│       ├── hero-bg.png              # AI-generated hero background
│       ├── dashboard-pattern.png     # Dashboard section background
│       └── supplier-scene.png        # Supplier/CTA section image
├── src/
│   ├── components/
│   │   ├── navbar.js                # Sidebar navigation component
│   │   ├── charts.js                # Chart.js wrapper functions
│   │   └── toast.js                 # Toast notification system
│   ├── data/
│   │   └── mockData.js              # Hardcoded demo data
│   ├── pages/
│   │   ├── landing.js               # Landing / marketing page
│   │   ├── dashboard.js             # Analytics dashboard
│   │   ├── suppliers.js             # Supplier management
│   │   ├── emissions.js             # Carbon tracking
│   │   ├── logistics.js             # Shipment tracking
│   │   ├── reports.js               # Reports & compliance
│   │   └── settings.js              # Account settings
│   ├── styles/
│   │   ├── variables.css            # Design tokens (colors, spacing, etc.)
│   │   ├── global.css               # Reset, utilities, components
│   │   └── pages/
│   │       ├── landing.css
│   │       ├── dashboard.css
│   │       ├── suppliers.css
│   │       ├── emissions.css
│   │       ├── logistics.css
│   │       └── reports.css
│   └── main.js                      # SPA router & entry point
├── index.html                        # HTML shell
├── package.json
├── vite.config.js
├── PROJECT_README.md                 # This file
└── readme.md                         # Original project readme
```

---

## 🗺️ Roadmap

### Phase 1 — Prototype ✅ (Current)
- [x] Interactive frontend demo with hardcoded data
- [x] 7 fully functional pages
- [x] Premium UI with glassmorphism design
- [x] Chart.js data visualizations
- [x] AI-generated imagery
- [x] Responsive design

### Phase 2 — Backend Integration
- [ ] REST API with Node.js/Express or Python/FastAPI
- [ ] PostgreSQL database with emissions schema
- [ ] User authentication (JWT + OAuth)
- [ ] Real supplier data ingestion pipeline

### Phase 3 — AI/ML Engine
- [ ] Emission prediction models (time series forecasting)
- [ ] Anomaly detection for ESG score changes
- [ ] Route optimization algorithm (carbon-aware)
- [ ] NLP-powered compliance document analysis

### Phase 4 — Enterprise Features
- [ ] Multi-tenant architecture
- [ ] Role-based access control (RBAC)
- [ ] Real-time WebSocket notifications
- [ ] ERP integration connectors (SAP, Oracle)
- [ ] IoT sensor data pipeline (fleet GPS, smart meters)
- [ ] Blockchain-verified carbon credits

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with 💚 for a sustainable future<br/>
  <strong>Green Supply Chain Guardian</strong> — Transforming Supply Chains, Protecting the Planet
</p>
