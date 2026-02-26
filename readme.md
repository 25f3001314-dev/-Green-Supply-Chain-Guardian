# 🌿 Green Supply Chain Guardian

**Real-Time Carbon & Compliance Intelligence for Indian MSMEs**

> *"400 million Indian MSME workers are one EU regulation away from losing export markets. We built a real-time Pathway pipeline that turns factory sensor data into CBAM-compliant carbon certificates — automatically, continuously, with zero hallucinations. Green Bharat, built on streaming AI."*

## The Problem

The EU's **Carbon Border Adjustment Mechanism (CBAM)** kicks in fully by 2026. Indian exporters — small textile makers in Surat, steel fabricators in Pune, chemical manufacturers in Gujarat — must now **prove per-product carbon footprints** or lose access to European markets entirely. None of them have the tools to do this.

## The Solution

A real-time **Pathway-powered streaming pipeline** that:
1. **Ingests live IoT sensor data** (energy meters, production counters) via MQTT/Kafka
2. **Computes per-product carbon emissions** using stateful window computations
3. **Indexes CBAM regulations** in a live Document Store for compliance Q&A
4. **Auto-generates CBAM certificates** with citations — zero hallucinations

## Quick Start

```bash
git clone https://github.com/sxhaakee/Green-Supply-Chain-Guardian.git
cd Green-Supply-Chain-Guardian
npm install
npm run dev
# Open http://localhost:3000
```

## Pages

| Page | Route | What It Shows |
|------|-------|---------------|
| Landing | `/` | Hero, features, stats, testimonials |
| Dashboard | `/#dashboard` | KPIs, emission charts, activity feed |
| Suppliers | `/#suppliers` | 12 suppliers with ESG scoring & filters |
| Emissions | `/#emissions` | Scope 1/2/3, hotspots, carbon calculator |
| Logistics | `/#logistics` | 10 shipments, transport modes, map |
| Reports | `/#reports` | 6 compliance frameworks, report generator |
| Settings | `/#settings` | Profile, integrations, API keys |

## Tech Stack

- **Pathway** — Real-time streaming, RAG, compliance intelligence
- **Vite 6** — Frontend build tool
- **Chart.js 4** — Data visualizations
- **AI-Generated Images** — Gemini-powered hero backgrounds

## Full Documentation

📖 See **[PROJECT_README.md](PROJECT_README.md)** for:
- Detailed architecture diagrams
- Pathway deep integration breakdown
- Production database schema (PostgreSQL + TimescaleDB)
- FastAPI endpoints specification
- Docker Compose deployment plan
- Week-by-week implementation roadmap
- Hackathon strategy & pitch

## License

MIT

---

<p align="center">Built with 💚 for <strong>Hack For Green Bharat</strong></p>