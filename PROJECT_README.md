<p align="center">
  <img src="https://img.shields.io/badge/Hackathon-Hack_For_Green_Bharat-059669?style=for-the-badge&logo=leaflet&logoColor=white" />
  <img src="https://img.shields.io/badge/Built_With-Pathway-14b8a6?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Prototype-f59e0b?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Impact-400M+_MSME_Workers-0d9488?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-334155?style=for-the-badge" />
</p>

<h1 align="center">🌿 Green Supply Chain Guardian</h1>
<h3 align="center">Real-Time Carbon & Compliance Intelligence for Indian MSMEs</h3>

<p align="center">
  <em>"400 million Indian MSME workers are one EU regulation away from losing export markets.<br/>
  We built a real-time Pathway pipeline that turns factory sensor data into CBAM-compliant<br/>
  carbon certificates — automatically, continuously, with zero hallucinations.<br/>
  <strong>Green Bharat, built on streaming AI.</strong>"</em>
</p>

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Key Objectives](#-key-objectives)
- [System Architecture](#-system-architecture)
- [Pathway Deep Integration](#-pathway-deep-integration)
- [Tech Stack](#-tech-stack)
- [Feature Breakdown](#-feature-breakdown)
- [Implementation Plan](#-implementation-plan--execution-roadmap)
- [Data Flow & Pipeline](#-data-flow--pipeline-design)
- [Prototype Demo](#-prototype-demo-current-build)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Roadmap](#-roadmap)
- [Why This Wins](#-why-this-wins)
- [License](#-license)

---

## 🚨 The Problem

### The CBAM Crisis Facing Indian Exporters

The European Union's **Carbon Border Adjustment Mechanism (CBAM)** is fully effective by **2026**. This regulation mandates that **any manufacturer exporting to Europe must prove their product's carbon footprint** — or lose market access **entirely**.

<table>
<tr><td>

**Who's affected?**

- 🏭 A **textile exporter** in Surat
- ⚙️ A **steel fabricator** in Pune
- 🧪 A **chemical manufacturer** in Gujarat
- 📦 **Millions of MSMEs** across India

</td><td>

**What they're facing:**

- ❌ **Zero infrastructure** to track carbon in real time
- ❌ **No tools** to calculate per-product emissions
- ❌ **No automated way** to generate compliance certificates
- ❌ **₹2+ crore contracts at risk** per exporter

</td></tr>
</table>

> **The Indian MSME export sector is worth $170B+.** The government has digitized the compliance requirement, but the small business owner has no tools to meet it. This is an existential threat disguised as a regulation.

### The Scale of Impact

| Metric | Value |
|--------|-------|
| Indian MSME workers affected | **400 million+** |
| MSME export market value | **$170 billion+** |
| CBAM steel/aluminum phase | **March 2026** |
| MSMEs with carbon tracking tools | **< 1%** |
| Average cost of manual compliance | **₹5-15 lakhs/year** |

---

## 💡 The Solution

**Green Supply Chain Guardian** is a **real-time AI pipeline** built on **Pathway** that transforms raw factory sensor data into **CBAM-compliant carbon certificates** — automatically and continuously.

### How It Works (In One Paragraph)

A factory's energy meters and production counters stream live data via **MQTT/Kafka** into a **Pathway streaming pipeline**. The pipeline calculates **carbon emissions per batch and per product unit in real time**, joins that data with order records and international carbon factor databases, and maintains a **live Document Store** indexed with the latest CBAM regulations, BIS standards, and GST e-way bill data. An **LLM layer** then answers compliance queries like *"Is this shipment ready for EU export right now?"* — with **citations, no hallucinations, closed domain only**. The output is a **dashboard showing live carbon scores** and **auto-generated compliance certificates**.

### The Human Story

> *"A small textile exporter in Surat is about to lose his ₹2 crore EU contract because he can't prove his carbon footprint. Our system tells him — in real time — exactly what his current emission per meter of fabric is, and generates the CBAM certificate automatically."*

---

## 🎯 Key Objectives

| # | Objective | Description | Priority |
|---|-----------|-------------|----------|
| 1 | **Real-Time Carbon Tracking** | Stream factory sensor data (energy meters, production counters) and calculate per-product carbon emissions in real time using Pathway's stateful window computations | 🔴 Critical |
| 2 | **CBAM Compliance Automation** | Auto-generate compliance certificates by cross-referencing live emissions with CBAM regulations, BIS standards, and GST HSN codes | 🔴 Critical |
| 3 | **RAG-Powered Compliance Q&A** | Closed-domain LLM that answers "Is shipment #X compliant?" with citations from official regulation documents — zero hallucinations | 🔴 Critical |
| 4 | **Supplier ESG Scoring** | Score suppliers across 50+ environmental, social, and governance criteria with real-time data feeds | 🟡 High |
| 5 | **Logistics Route Optimization** | AI-driven transport corridor selection to minimize carbon footprint while maintaining delivery efficiency | 🟡 High |
| 6 | **Live Alerting & Notifications** | WhatsApp/SMS alerts when emission thresholds are breached or shipments become non-compliant | 🟢 Medium |
| 7 | **Multi-Tenant MSME Onboarding** | Self-service platform where any MSME can onboard, connect sensors, and start tracking within 30 minutes | 🟢 Medium |

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    GREEN SUPPLY CHAIN GUARDIAN — ARCHITECTURE                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DATA INGESTION LAYER                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Factory IoT   │  │ Energy       │  │ Production   │  │ GST E-Way    │    │
│  │ Sensors       │  │ Meters       │  │ Counters     │  │ Bills API    │    │
│  │ (MQTT)        │  │ (MQTT)       │  │ (Kafka)      │  │ (REST)       │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │                  │            │
│         └──────────────────┴──────────────────┴──────────────────┘            │
│                                    │                                         │
│  ┌─────────────────────────────────▼─────────────────────────────────────┐   │
│  │              PATHWAY STREAMING ENGINE (Core)                           │   │
│  │                                                                        │   │
│  │  ┌─────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │   │
│  │  │ Connectors  │  │ Stream Processing │  │ Stateful Computations   │  │   │
│  │  │             │  │                    │  │                          │  │   │
│  │  │ • MQTT In   │  │ • Filter invalid  │  │ • Rolling window: energy │  │   │
│  │  │ • Kafka In  │  │ • Normalize units │  │   per unit produced      │  │   │
│  │  │ • REST In   │  │ • Schema validate │  │ • Sliding avg: emission  │  │   │
│  │  │ • CSV Watch │  │ • Deduplication   │  │   rate per SKU           │  │   │
│  │  └─────────────┘  └──────────────────┘  │ • Session windows: per   │  │   │
│  │                                          │   production batch       │  │   │
│  │  ┌───────────────────────────────────┐  └──────────────────────────┘  │   │
│  │  │ Real-Time Joins                   │                                │   │
│  │  │                                   │                                │   │
│  │  │ Sensor Data ⋈ Order Data          │                                │   │
│  │  │ Product SKU ⋈ Carbon Factor DB    │                                │   │
│  │  │ Emission    ⋈ CBAM Thresholds     │                                │   │
│  │  │ Shipment    ⋈ HSN Code Mapping    │                                │   │
│  │  └───────────────────────────────────┘                                │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│  ┌─────────────────────────────────▼─────────────────────────────────────┐   │
│  │              PATHWAY DOCUMENT STORE (Knowledge Base)                    │   │
│  │                                                                        │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐   │   │
│  │  │ CBAM Regulations │  │ BIS Emission    │  │ GST HSN Code       │   │   │
│  │  │ (Live PDFs)      │  │ Standards       │  │ Mappings           │   │   │
│  │  │ Auto-updated     │  │ (Live-indexed)  │  │ (API-synced)       │   │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────┘   │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│  ┌─────────────────────────────────▼─────────────────────────────────────┐   │
│  │              LLM xPACK — CLOSED DOMAIN RAG                             │   │
│  │                                                                        │   │
│  │  Input:  "Is shipment #4521 CBAM compliant?"                          │   │
│  │  Process: Query Document Store → Retrieve relevant regulations         │   │
│  │           → Cross-reference with live emission data                    │   │
│  │  Output:  "Yes/No + Citation from CBAM Article 6.2 + Certificate"     │   │
│  │                                                                        │   │
│  │  ✅ Citations from official docs    ❌ No hallucinations               │   │
│  │  ✅ Closed-domain only              ❌ No generic web answers          │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│  OUTPUT LAYER                      │                                         │
│  ┌──────────────┐  ┌──────────────▼──┐  ┌──────────────┐  ┌────────────┐   │
│  │ React        │  │ Auto-Generated  │  │ WhatsApp /   │  │ REST API   │   │
│  │ Dashboard    │  │ CBAM            │  │ SMS Alerts   │  │ for ERP    │   │
│  │ (Live)       │  │ Certificates    │  │              │  │ Integration│   │
│  └──────────────┘  └─────────────────┘  └──────────────┘  └────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
                          ┌─────────────────────┐
                          │   Factory Floor      │
                          │   Energy Meter: 47kW │
                          │   Units Made: 1,250  │
                          └──────────┬──────────┘
                                     │ MQTT publish
                                     ▼
                          ┌─────────────────────┐
                          │   Pathway Connector  │
                          │   (MQTT Subscriber)  │
                          └──────────┬──────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
           ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
           │ Validate &   │ │ Window       │ │ Join with    │
           │ Filter       │ │ Computation  │ │ Carbon       │
           │ Readings     │ │ kWh/unit     │ │ Factor DB    │
           └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
                  │                │                  │
                  └────────────────┼──────────────────┘
                                   ▼
                    ┌──────────────────────────┐
                    │  Emission Score per SKU   │
                    │  0.47 tCO₂e per 1000 mtrs│
                    └──────────────┬───────────┘
                                   │
                    ┌──────────┬────┴────┬──────────┐
                    ▼          ▼         ▼          ▼
              ┌──────────┐ ┌──────┐ ┌────────┐ ┌────────┐
              │Dashboard │ │Alert │ │  RAG   │ │  PDF   │
              │ Update   │ │Check │ │ Query  │ │ Cert   │
              └──────────┘ └──────┘ └────────┘ └────────┘
```

---

## ⚡ Pathway Deep Integration

This solution uses **Pathway exactly as it was designed to be used** — mirroring the architecture of **La Poste's GPS microservices** (Pathway's flagship case study), applied to carbon compliance instead of logistics ETAs.

| Pathway Feature | How We Use It | Why It Matters |
|-----------------|---------------|----------------|
| **MQTT Connector** | Live factory sensor ingestion (energy meters, production counters) | Real-time data from the factory floor — not batch processing |
| **Kafka Connector** | Production event streams, order processing events | High-throughput event ingestion for multi-factory setups |
| **Stateful Window Computations** | Rolling energy averages per production batch, sliding emission rates per SKU | Carbon calculations need temporal context — you can't compute "energy per unit" without windows |
| **Real-Time Joins** | Sensor data ⋈ Order data ⋈ Carbon factor databases ⋈ CBAM thresholds | The magic happens at the intersection of live data and reference data |
| **Document Store** | Live-updated CBAM regulation PDFs, BIS standards, GST HSN codes | Regulations change — the Document Store automatically re-indexes when PDFs are updated |
| **LLM xPack** | Closed-domain compliance Q&A with citations | "Is this shipment compliant?" answered with Article references, not hallucinations |
| **Temporal Behavior** | Stream replay, late data handling, exactly-once semantics | Factory sensors drop packets — Pathway handles this gracefully |
| **Output Connectors** | PostgreSQL sink, REST API push, webhook triggers | Powers the dashboard, alerts, and certificate generation |

### Comparison to La Poste (Pathway's Flagship)

| Aspect | La Poste (Pathway Showcase) | Green Supply Chain Guardian |
|--------|---------------------------|---------------------------|
| Input | GPS coordinates from delivery trucks | IoT readings from factory sensors |
| Computation | Real-time ETA calculation | Real-time carbon emission calculation |
| Joins | GPS ⋈ Route data ⋈ Traffic data | Sensor ⋈ Orders ⋈ Carbon factors |
| Output | Delivery time predictions | CBAM compliance certificates |
| Impact | Logistics optimization | Export market access for MSMEs |

**Same architecture. Proven template. Adapted for carbon compliance.**

---

## 🛠️ Tech Stack

### Production Architecture (Full-Fledged Model)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Streaming Engine** | **Pathway** | Core real-time data processing, joins, windows, RAG |
| **Message Broker** | Kafka / MQTT (Mosquitto) | Factory sensor data ingestion |
| **Document Store** | Pathway Document Store | Live-indexed CBAM regulations, BIS standards |
| **LLM / RAG** | Pathway LLM xPack + OpenAI/Mistral | Compliance Q&A with citations |
| **Database** | PostgreSQL + TimescaleDB | Time-series emission data, supplier records |
| **Cache** | Redis | Session management, real-time metric caching |
| **Backend API** | Python (FastAPI) | REST/GraphQL API layer |
| **Frontend** | React / Vite | Dashboard, reports, supplier management |
| **Visualization** | Chart.js / D3.js | Emission charts, supply chain maps |
| **Alerts** | Twilio (WhatsApp/SMS) | Threshold breach notifications |
| **Deployment** | Docker + Docker Compose | Containerized microservices |
| **CI/CD** | GitHub Actions | Automated testing and deployment |
| **IoT Simulation** | Python MQTT Publisher | Simulated factory sensor streams for demo |

### Prototype Stack (Current Build)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Build Tool** | Vite 6 | Lightning-fast HMR |
| **Frontend** | Vanilla JavaScript (ES Modules) | Zero-dependency prototype |
| **Styling** | CSS Custom Properties + Glassmorphism | Premium design system |
| **Charts** | Chart.js 4 | Interactive data visualizations |
| **Typography** | Google Fonts (Outfit + Inter) | Premium font pairing |
| **Images** | AI-Generated (Gemini) | Hero backgrounds and scenes |
| **Data** | Hardcoded mock data | Simulates real-time pipeline output |

---

## ✨ Feature Breakdown

### 📊 Dashboard & Analytics
- **Real-time KPI cards** — Total emissions, reduction target progress, green score, supplier compliance rate
- **Emissions by scope** — Interactive Chart.js line chart showing monthly Scope 1/2/3 breakdown
- **Top supplier ranking** — Horizontal bar chart of ESG scores
- **Live activity feed** — Event stream with ESG alerts, shipment updates, compliance events
- **Quick actions** — One-click access to carbon calculator, supplier review, report generation

### 👥 Supplier ESG Management
- **12 suppliers** with realistic profiles (names, locations, certifications, carbon intensity)
- **ESG score visualization** — Circular gauges with color-coded severity (green/amber/red)
- **Risk classification** — Low / Medium / High / Critical with badge indicators
- **Certification tracking** — ISO 14001, FSC, B Corp, GOTS, OEKO-TEX, Cradle2Cradle, etc.
- **Filter & search** — Real-time filtering by name, category, and risk level
- **Add supplier workflow** — Modal form for onboarding new suppliers

### 📉 Carbon Tracking & Emissions
- **Scope breakdown** — Doughnut chart showing Scope 1 (19%), Scope 2 (37%), Scope 3 (44%)
- **Trend vs target** — Line chart comparing actual monthly emissions against reduction targets
- **Hotspot analysis** — Sortable table identifying top emission sources with severity and reduction plans
- **Interactive carbon calculator** — Input transport mode, distance, weight → instant tCO₂e calculation
- **Reduction roadmap** — Timeline visualization from 2023 baseline to 2030 net-zero target

### 🚛 Logistics & Shipments
- **10 active shipments** with real-time progress bars and status badges
- **Transport mode distribution** — Doughnut chart (Sea 42%, Rail 28%, Electric Truck 18%, Air 8%)
- **Supply chain network map** — Animated node visualization with pulsing route indicators
- **Carbon-per-shipment scoring** — Color-coded severity (green < 5, amber 5-20, red > 20 tCO₂e)
- **Multi-modal tracking** — Sea 🚢, Rail 🚂, Electric Truck 🔋, Air ✈️

### 📋 Reports & Compliance
- **6 regulatory frameworks** — GHG Protocol, CSRD (EU), ISO 14064, SBTi, CDP, TCFD
- **Compliance score tracking** — Progress bars with next audit dates
- **Report generator** — Configurable form (type, period, format, inclusions)
- **Animated report generation** — Progress bar simulation for demo
- **Recent reports table** — 5 reports with download actions
- **Audit trail** — Full chronological event history with user attribution

### ⚙️ Settings & Configuration
- **Profile management** — User info, company, role, billing plan
- **Notification toggles** — ESG alerts, emission spikes, compliance deadlines, shipment delays
- **Integration management** — SAP ERP, Salesforce, Slack, BigQuery, Power BI
- **API key management** — Masked keys, copy action, webhook URLs
- **Security dashboard** — 2FA status, password age, active sessions

---

## 📅 Implementation Plan & Execution Roadmap

### Phase 1: Prototype & Demo ✅ (Current — Complete)

**Objective:** Build a visually stunning, interactive frontend demo that showcases all platform capabilities with hardcoded data.

| Task | Status | Details |
|------|--------|---------|
| Design system (CSS tokens, glassmorphism) | ✅ Done | `variables.css` + `global.css` — 200+ design tokens |
| Landing page with AI hero background | ✅ Done | Full marketing page with animations |
| Dashboard with Chart.js visualizations | ✅ Done | KPIs, line/bar charts, activity feed |
| Supplier management (ESG scoring) | ✅ Done | 12 suppliers, filters, modal, ESG gauges |
| Carbon tracking (scope breakdown, calculator) | ✅ Done | Doughnut, trend line, hotspot table |
| Logistics (shipments, transport modes) | ✅ Done | 10 shipments, progress bars, map |
| Reports & compliance | ✅ Done | 6 frameworks, report generator, audit trail |
| Settings | ✅ Done | Profile, notifications, integrations, API keys |
| Professional documentation | ✅ Done | This README + `readme.md` quick-start |
| Git push to GitHub | ✅ Done | `sxhaakee/Green-Supply-Chain-Guardian` |

---

### Phase 2: Pathway Pipeline Core (Week 1-2)

**Objective:** Build the real-time streaming pipeline that ingests factory sensor data and computes carbon emissions.

#### 2.1 IoT Simulator

```python
# Simulated MQTT publisher — factory energy meter
import paho.mqtt.client as mqtt
import json, time, random

client = mqtt.Client()
client.connect("localhost", 1883)

while True:
    payload = {
        "factory_id": "SURAT_TEX_001",
        "timestamp": time.time(),
        "energy_kwh": round(random.uniform(40, 55), 2),
        "units_produced": random.randint(80, 120),
        "machine_id": "LOOM_A3",
        "product_sku": "COT_FABRIC_60GSM"
    }
    client.publish("factory/sensors/energy", json.dumps(payload))
    time.sleep(5)  # Publish every 5 seconds
```

#### 2.2 Pathway Pipeline

```python
import pathway as pw

# MQTT Connector — live sensor data
sensor_data = pw.io.mqtt.read(
    host="localhost",
    port=1883,
    topic="factory/sensors/energy",
    schema=SensorSchema,
    autocommit_duration_ms=1000
)

# Carbon Factor Reference Table
carbon_factors = pw.io.csv.read("./data/carbon_factors.csv", schema=CarbonFactorSchema)

# Stateful Window: Rolling energy per unit (5-minute window)
windowed = sensor_data.windowby(
    pw.this.timestamp,
    window=pw.temporal.sliding(duration=300, hop=60),
    shard=pw.this.factory_id,
).reduce(
    factory_id=pw.reducers.any(pw.this.factory_id),
    total_energy=pw.reducers.sum(pw.this.energy_kwh),
    total_units=pw.reducers.sum(pw.this.units_produced),
    energy_per_unit=pw.reducers.sum(pw.this.energy_kwh) / pw.reducers.sum(pw.this.units_produced),
)

# Real-Time Join: Energy per unit × Carbon factor
emissions = windowed.join(
    carbon_factors,
    pw.left.product_sku == pw.right.sku
).select(
    factory_id=pw.left.factory_id,
    energy_per_unit=pw.left.energy_per_unit,
    carbon_factor=pw.right.factor_kgco2_per_kwh,
    emission_per_unit=pw.left.energy_per_unit * pw.right.factor_kgco2_per_kwh,
)

# Output to PostgreSQL
pw.io.postgres.write(emissions, connection_string, "live_emissions")
```

#### 2.3 Deliverables

| Deliverable | Description |
|-------------|-------------|
| `iot_simulator.py` | MQTT publisher simulating factory sensors |
| `pipeline.py` | Pathway streaming pipeline with windows + joins |
| `carbon_factors.csv` | Reference dataset of emission factors by industry |
| `docker-compose.yml` | Mosquitto + Pathway + PostgreSQL orchestration |

---

### Phase 3: Document Store & RAG (Week 2-3)

**Objective:** Build the knowledge base that indexes CBAM regulations and answers compliance queries with citations.

#### 3.1 Document Store Setup

```python
import pathway as pw
from pathway.xpacks.llm import embedders, splitters
from pathway.xpacks.llm.document_store import DocumentStore

# Watch a folder for regulation PDFs (auto-reindex on change)
docs = pw.io.fs.read(
    "./regulations/",
    format="binary",
    with_metadata=True
)

# Split, embed, and index
doc_store = DocumentStore(
    docs=docs,
    splitter=splitters.TokenCountSplitter(max_tokens=400),
    embedder=embedders.OpenAIEmbedder(model="text-embedding-3-small"),
)
```

#### 3.2 Compliance Q&A

```python
from pathway.xpacks.llm.llms import OpenAIChat

llm = OpenAIChat(model="gpt-4o-mini", temperature=0)

# Query: "Is shipment #4521 CBAM compliant?"
# 1. Retrieve live emission data for shipment
# 2. Query Document Store for relevant CBAM articles
# 3. LLM synthesizes answer with citations
answer = llm(
    f"""Based on the following CBAM regulation excerpts and emission data,
    determine if this shipment is compliant.

    Emission data: {emission_data}
    Relevant regulations: {doc_store.query(query)}

    Provide your answer with citation to specific CBAM articles."""
)
```

#### 3.3 Regulation Documents to Index

| Document | Source | Update Frequency |
|----------|--------|-----------------|
| CBAM Regulation (EU 2023/956) | EUR-Lex | On amendment |
| CBAM Implementing Regulation | EUR-Lex | On amendment |
| BIS Emission Standards | Bureau of Indian Standards | Annual |
| GST HSN Code Mapping | GSTN Portal | Quarterly |
| India's NDC Commitments | UNFCCC | On update |
| ISO 14064 Guidelines | ISO | On revision |

---

### Phase 4: Backend API & Integration (Week 3-4)

**Objective:** Expose the pipeline outputs via REST API and connect to the React frontend.

#### 4.1 API Layer (FastAPI)

```
POST   /api/v1/auth/login              → JWT authentication
GET    /api/v1/dashboard/kpis          → Live KPI metrics
GET    /api/v1/emissions/live          → Real-time emission stream (SSE)
GET    /api/v1/emissions/history       → Historical emission data
GET    /api/v1/suppliers               → Supplier list with ESG scores
POST   /api/v1/suppliers               → Onboard new supplier
GET    /api/v1/shipments               → Active shipment tracking
POST   /api/v1/compliance/query        → RAG query (is shipment X compliant?)
POST   /api/v1/reports/generate        → Generate compliance certificate PDF
GET    /api/v1/alerts                  → Recent alerts and notifications
WS     /api/v1/ws/live                 → WebSocket for real-time dashboard updates
```

#### 4.2 Database Schema

```sql
-- Core tables
CREATE TABLE factories (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    gstin VARCHAR(15),
    onboarded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    factory_id UUID REFERENCES factories(id),
    timestamp TIMESTAMPTZ NOT NULL,
    energy_kwh DECIMAL(10,3),
    units_produced INTEGER,
    machine_id VARCHAR(50),
    product_sku VARCHAR(50)
);

CREATE TABLE live_emissions (
    id BIGSERIAL PRIMARY KEY,
    factory_id UUID REFERENCES factories(id),
    window_start TIMESTAMPTZ,
    window_end TIMESTAMPTZ,
    energy_per_unit DECIMAL(10,6),
    emission_per_unit DECIMAL(10,6),
    emission_total DECIMAL(12,4),
    product_sku VARCHAR(50),
    is_compliant BOOLEAN
);

CREATE TABLE compliance_certificates (
    id UUID PRIMARY KEY,
    factory_id UUID REFERENCES factories(id),
    shipment_id VARCHAR(50),
    emission_per_unit DECIMAL(10,6),
    cbam_threshold DECIMAL(10,6),
    is_compliant BOOLEAN,
    generated_at TIMESTAMP DEFAULT NOW(),
    pdf_url TEXT,
    citations JSONB
);
```

---

### Phase 5: Certificate Generation & Alerts (Week 4-5)

**Objective:** Auto-generate PDF compliance certificates and trigger real-time alerts.

| Feature | Technology | Trigger |
|---------|-----------|---------|
| PDF certificate generation | ReportLab / WeasyPrint | When shipment emission data is finalized |
| WhatsApp alerts | Twilio WhatsApp API | When emission > CBAM threshold |
| SMS fallback | Twilio SMS | When WhatsApp delivery fails |
| Email digest | SendGrid | Weekly summary to factory owner |
| Dashboard push | WebSocket (SSE) | Real-time emission updates |

---

### Phase 6: Production Deployment (Week 5-6)

```yaml
# docker-compose.yml
services:
  mqtt-broker:
    image: eclipse-mosquitto:2
    ports: ["1883:1883"]

  pathway-pipeline:
    build: ./pipeline
    depends_on: [mqtt-broker, postgres]
    environment:
      - MQTT_HOST=mqtt-broker
      - PG_CONNECTION=postgres://...
      - OPENAI_API_KEY=${OPENAI_API_KEY}

  api:
    build: ./api
    ports: ["8000:8000"]
    depends_on: [postgres, pathway-pipeline]

  frontend:
    build: ./frontend
    ports: ["3000:3000"]

  postgres:
    image: timescale/timescaledb:latest-pg16
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  pgdata:
```

---

## 🔄 Data Flow & Pipeline Design

### Real-Time Data Flow

```
[MQTT: factory/sensors/energy]     [Kafka: orders/production]     [REST: gst/eway-bills]
         │                                   │                              │
         ▼                                   ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PATHWAY STREAMING ENGINE                               │
│                                                                                  │
│   ┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────────┐   │
│   │ Ingest & │───▶│ Window       │───▶│ Join with   │───▶│ Emit to         │   │
│   │ Validate │    │ Computation  │    │ Carbon DB   │    │ Outputs         │   │
│   └──────────┘    │ (5min roll)  │    │ + Orders    │    │ (PG, API, WS)   │   │
│                    └──────────────┘    └─────────────┘    └─────────────────┘   │
│                                                                                  │
│   ┌────────────────────────────────────────────────────────────────────────┐    │
│   │ DOCUMENT STORE                                                          │    │
│   │ CBAM PDFs → Splitter → Embedder → Vector Index → RAG Query Engine     │    │
│   └────────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────────┘
         │                    │                     │                    │
         ▼                    ▼                     ▼                    ▼
  ┌──────────────┐   ┌──────────────┐   ┌───────────────┐   ┌───────────────┐
  │  PostgreSQL  │   │  Dashboard   │   │  Certificate  │   │  WhatsApp     │
  │  TimescaleDB │   │  (WebSocket) │   │  Generator    │   │  Alert        │
  └──────────────┘   └──────────────┘   └───────────────┘   └───────────────┘
```

### Latency Targets

| Stage | Target Latency | Notes |
|-------|---------------|-------|
| Sensor → Pathway ingestion | < 100ms | MQTT QoS 1 |
| Window computation | < 500ms | 5-minute rolling window |
| Join with carbon DB | < 200ms | In-memory reference table |
| Dashboard update | < 1s | WebSocket push |
| RAG query response | < 3s | Document retrieval + LLM |
| Certificate generation | < 10s | PDF rendering + signing |

---

## 🖥️ Prototype Demo (Current Build)

This repository contains the **Phase 1 prototype** — a fully interactive frontend demo with hardcoded data that simulates the production platform.

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/#` or `/` | Marketing page with AI hero, features, stats, testimonials |
| Dashboard | `/#dashboard` | KPI cards, emission charts, activity feed |
| Suppliers | `/#suppliers` | Supplier directory with ESG scoring and filters |
| Emissions | `/#emissions` | Carbon tracking, calculator, roadmap |
| Logistics | `/#logistics` | Shipment tracking, transport analysis |
| Reports | `/#reports` | Compliance frameworks, report generator |
| Settings | `/#settings` | Profile, notifications, integrations |

---

## 📁 Project Structure

```
Green-Supply-Chain-Guardian/
├── public/
│   └── images/
│       ├── hero-bg.png              # AI-generated hero (green logistics aerial)
│       ├── dashboard-pattern.png     # Abstract network pattern
│       └── supplier-scene.png        # Smart factory with solar panels
├── src/
│   ├── components/
│   │   ├── navbar.js                # Sidebar navigation (SVG icons, mobile toggle)
│   │   ├── charts.js                # Chart.js wrappers (line, bar, doughnut)
│   │   └── toast.js                 # Toast notification system
│   ├── data/
│   │   └── mockData.js              # Hardcoded enterprise data (suppliers, shipments, etc.)
│   ├── pages/
│   │   ├── landing.js               # Landing / marketing page
│   │   ├── dashboard.js             # Analytics dashboard
│   │   ├── suppliers.js             # Supplier ESG management
│   │   ├── emissions.js             # Carbon tracking & calculator
│   │   ├── logistics.js             # Shipment tracking
│   │   ├── reports.js               # Reports & compliance
│   │   └── settings.js              # Account & integration settings
│   ├── styles/
│   │   ├── variables.css            # 200+ design tokens
│   │   ├── global.css               # Reset, utilities, animations, layouts
│   │   └── pages/                   # Page-specific stylesheets
│   └── main.js                      # SPA router & entry point
├── index.html                        # HTML shell with SEO meta tags
├── package.json                      # Vite + Chart.js
├── vite.config.js                    # Dev server config
├── PROJECT_README.md                 # ← You are here
└── readme.md                         # Quick-start guide
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Run the Prototype

```bash
# Clone
git clone https://github.com/sxhaakee/Green-Supply-Chain-Guardian.git
cd Green-Supply-Chain-Guardian

# Install & Run
npm install
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🗺️ Roadmap

| Phase | Timeline | Deliverable | Status |
|-------|----------|-------------|--------|
| **Phase 1** | Week 0 | Interactive frontend prototype with demo data | ✅ Complete |
| **Phase 2** | Week 1-2 | Pathway pipeline + IoT simulator + carbon computations | 🔲 Planned |
| **Phase 3** | Week 2-3 | Document Store + RAG compliance Q&A | 🔲 Planned |
| **Phase 4** | Week 3-4 | FastAPI backend + PostgreSQL + WebSocket dashboard | 🔲 Planned |
| **Phase 5** | Week 4-5 | Certificate generation + WhatsApp alerts | 🔲 Planned |
| **Phase 6** | Week 5-6 | Docker deployment + CI/CD + production hardening | 🔲 Planned |
| **Phase 7** | Week 6+ | Multi-tenant onboarding + enterprise integrations | 🔲 Future |

---

## 🏆 Why This Wins

### 1. Uses Pathway Exactly As Designed
Live MQTT connectors → Stateful window computations → Real-time streaming joins → Document Store with live-updated PDFs → LLM xPack for citation-backed RAG. This is **textbook Pathway usage**.

### 2. Mirrors Pathway's Flagship Architecture
La Poste does GPS → ETAs. We do IoT → Carbon Certificates. **Same proven architecture, new domain.**

### 3. The Problem Is Regulatory & Immediate
CBAM isn't hypothetical — it's **March 2026**. Judges can't dismiss a live regulatory deadline.

### 4. The Impact Is Massive & Emotional
400 million MSME workers. $170B export market. Real livelihoods at stake.

### 5. Thematic Alignment
The hackathon is called **"Hack For Green Bharat"** — this solution IS Green Bharat.

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  <strong>🌿 Green Supply Chain Guardian</strong><br/>
  <em>Transforming Supply Chains, Protecting the Planet, Empowering MSMEs</em><br/><br/>
  Built with 💚 for <strong>Hack For Green Bharat</strong>
</p>
