// ============================================
// SIMULATION ENGINE — Realistic Data Simulation
// Green Supply Chain Guardian
// ============================================

const STORAGE_KEY = 'gscg_sim_state';
const SETTINGS_KEY = 'gscg_settings';

// ── Noise helpers ──────────────────────────────────────────
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.round(rand(min, max)); }
function noise(value, pct = 0.02) { return value * (1 + rand(-pct, pct)); }
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

// Seasonal multiplier (higher in winter months)
function seasonalFactor(monthIndex) {
    const seasonal = [1.12, 1.08, 1.02, 0.96, 0.92, 0.88, 0.87, 0.89, 0.94, 0.98, 1.05, 1.10];
    return seasonal[monthIndex % 12];
}

// ── Default State ──────────────────────────────────────────
function getDefaultState() {
    const now = Date.now();
    const month = new Date().getMonth();
    const sf = seasonalFactor(month);
    return {
        version: 2,
        createdAt: now,
        lastTick: now,
        tickCount: 0,

        // KPI live values
        kpis: {
            emissions: 12847,
            reduction: 67,
            score: 94.2,
            compliance: 91,
        },

        // Scope emissions (monthly running values)
        scope: { s1: 2940, s2: 5640, s3: 6720 },

        // Monthly history arrays (12 months)
        monthlyHistory: {
            scope1: [420, 390, 410, 380, 360, 340, 330, 310, 290, 280, 260, 245].map(v => Math.round(v * sf)),
            scope2: [680, 650, 630, 610, 590, 560, 540, 520, 510, 490, 470, 450].map(v => Math.round(v * sf)),
            scope3: [1200, 1150, 1120, 1080, 1050, 1020, 980, 950, 920, 890, 860, 830].map(v => Math.round(v * sf)),
            target: [1100, 1060, 1020, 980, 940, 900, 860, 820, 780, 740, 700, 660],
        },

        // IoT Sensor readings
        sensors: {
            temperature: 22.4,      // °C
            humidity: 61.3,         // %
            energyKwh: 4820,        // kWh today
            airQuality: 87,         // AQI index (higher = better)
            waterUsage: 312,        // m³/day
            co2ppm: 412,            // CO₂ ppm ambient
        },

        // Notification badge count
        notificationCount: 3,

        // Activity feed events (newest first, max 30)
        activityFeed: [
            { id: 1, type: 'alert', message: 'TerraChemicals ESG score dropped below threshold (74)', time: Date.now() - 7200000, icon: '⚠️' },
            { id: 2, type: 'success', message: 'SHP-2851 delivered with 15% lower carbon than estimated', time: Date.now() - 14400000, icon: '✅' },
            { id: 3, type: 'info', message: 'New supplier NordWood Forestry onboarded successfully', time: Date.now() - 21600000, icon: 'ℹ️' },
            { id: 4, type: 'success', message: 'Monthly emissions report generated automatically', time: Date.now() - 28800000, icon: '📊' },
            { id: 5, type: 'warning', message: 'PetroChem Legacy flagged for critical ESG concerns', time: Date.now() - 43200000, icon: '🚨' },
            { id: 6, type: 'info', message: 'Route optimization saved 2.3 tCO₂e on EU corridor', time: Date.now() - 86400000, icon: '🛤️' },
            { id: 7, type: 'success', message: 'ISO 14064 recertification confirmed', time: Date.now() - 90000000, icon: '🏅' },
            { id: 8, type: 'info', message: 'Q4 carbon offset credits verified and retired', time: Date.now() - 172800000, icon: '🌱' },
        ],

        // Cumulative emission counter (tCO₂e, ticking up slowly)
        cumulativeEmissions: 847293.4,

        // Shipment progress values (by shipment ID)
        shipmentProgress: {
            'SHP-2847': 72, 'SHP-2848': 45, 'SHP-2849': 38, 'SHP-2850': 62,
            'SHP-2851': 100, 'SHP-2852': 88, 'SHP-2853': 10, 'SHP-2854': 55,
            'SHP-2855': 100, 'SHP-2856': 68,
        },

        // Supplier ESG live scores (id → score)
        supplierESG: {},

        // User-added suppliers (from form)
        customSuppliers: [],

        // User actions audit log
        auditLog: [],

        // Scheduled reports
        scheduledReports: [],

        // Simulation control
        speedMultiplier: 1,
        isPaused: false,

        // AI Insights queue
        aiInsights: [
            { id: 1, text: 'Switching 40% of air freight to sea routes could reduce Scope 3 by 8.2%', icon: '🤖', type: 'optimization', timestamp: Date.now() - 3600000 },
            { id: 2, text: 'Supplier TerraChemicals shows 12% emission spike — audit recommended', icon: '⚠️', type: 'alert', timestamp: Date.now() - 7200000 },
            { id: 3, text: 'Q1 2026 on track to exceed 50% reduction milestone 3 weeks early', icon: '🎯', type: 'milestone', timestamp: Date.now() - 10800000 },
        ],

        // Weather affecting logistics
        weather: {
            condition: 'Clear',
            windKnots: 12,
            seaState: 'Moderate',
            delayRisk: 'Low',
        },
    };
}

// ── State Management ────────────────────────────────────────
class SimulationStore {
    constructor() {
        this._state = null;
        this._listeners = new Map();
        this._listenerIdCounter = 0;
    }

    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.version === 2) {
                    this._state = parsed;
                    return;
                }
            }
        } catch (_) { /* ignore */ }
        this._state = getDefaultState();
        this.save();
    }

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
        } catch (_) { /* ignore */ }
    }

    get() { return this._state; }

    update(fn) {
        fn(this._state);
        this.save();
        this._emit('update', this._state);
    }

    reset() {
        this._state = getDefaultState();
        this.save();
        this._emit('reset', this._state);
    }

    subscribe(event, fn) {
        const id = ++this._listenerIdCounter;
        if (!this._listeners.has(event)) this._listeners.set(event, new Map());
        this._listeners.get(event).set(id, fn);
        return () => this._listeners.get(event)?.delete(id);
    }

    _emit(event, data) {
        this._listeners.get(event)?.forEach(fn => fn(data));
    }
}

export const store = new SimulationStore();

// ── SensorSimulator class ───────────────────────────────────
export class SensorSimulator {
    constructor(intervalMs = 3000) {
        this._interval = null;
        this._intervalMs = intervalMs;
        this._callbacks = [];
    }

    start(speedMultiplier = 1) {
        this.stop();
        const ms = Math.max(500, this._intervalMs / speedMultiplier);
        this._interval = setInterval(() => this._tick(), ms);
    }

    stop() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    onData(fn) {
        this._callbacks.push(fn);
        return () => { this._callbacks = this._callbacks.filter(c => c !== fn); };
    }

    _tick() {
        const state = store.get();
        if (!state || state.isPaused) return;

        store.update(s => {
            s.tickCount++;
            s.lastTick = Date.now();

            // ── Sensor drift ──
            s.sensors.temperature = clamp(noise(s.sensors.temperature, 0.005), 18, 30);
            s.sensors.humidity = clamp(noise(s.sensors.humidity, 0.008), 40, 85);
            s.sensors.energyKwh = clamp(noise(s.sensors.energyKwh, 0.003), 3000, 8000);
            s.sensors.airQuality = clamp(noise(s.sensors.airQuality, 0.01), 50, 100);
            s.sensors.waterUsage = clamp(noise(s.sensors.waterUsage, 0.005), 200, 500);
            s.sensors.co2ppm = clamp(noise(s.sensors.co2ppm, 0.003), 380, 450);

            // ── KPI drift ──
            s.kpis.emissions = clamp(Math.round(noise(s.kpis.emissions, 0.004)), 10000, 15000);
            s.kpis.reduction = clamp(parseFloat((noise(s.kpis.reduction, 0.002)).toFixed(1)), 60, 75);
            s.kpis.score = clamp(parseFloat((noise(s.kpis.score, 0.002)).toFixed(1)), 88, 99);
            s.kpis.compliance = clamp(Math.round(noise(s.kpis.compliance, 0.003)), 85, 98);

            // ── Cumulative emissions tick up ──
            s.cumulativeEmissions += rand(0.008, 0.025);

            // ── Scope drift ──
            s.scope.s1 = clamp(Math.round(noise(s.scope.s1, 0.003)), 2500, 3500);
            s.scope.s2 = clamp(Math.round(noise(s.scope.s2, 0.003)), 5000, 6500);
            s.scope.s3 = clamp(Math.round(noise(s.scope.s3, 0.003)), 6000, 7500);
        });

        const readings = store.get().sensors;
        this._callbacks.forEach(fn => fn(readings));
    }
}

// ── Activity feed auto-generator ────────────────────────────
const activityTemplates = [
    { type: 'info', icon: '📡', messages: ['Sensor data synced from facility in {loc}', 'IoT update received from {loc} warehouse'] },
    { type: 'success', icon: '✅', messages: ['Shipment {id} delivered — {pct}% below carbon estimate', 'Supplier audit for {name} completed successfully'] },
    { type: 'warning', icon: '⚠️', messages: ['Carbon spike detected at {loc} facility', 'Supplier {name} ESG score changed to {score}'] },
    { type: 'info', icon: '🤖', messages: ['AI recommendation generated: reduce air freight by {pct}%', 'AI model updated emission forecast for Q{q} 2026'] },
    { type: 'success', icon: '🌿', messages: ['Route optimization saved {val} tCO₂e this week', 'Renewable energy target hit {pct}% — milestone reached'] },
];

const locs = ['Munich', 'Amsterdam', 'Singapore', 'Oslo', 'Toronto', 'Osaka'];
const supplierNames = ['GreenTech', 'EcoPackage', 'BioFiber', 'NordWood', 'VoltTransit'];
const shipIds = ['SHP-2857', 'SHP-2858', 'SHP-2859', 'SHP-2860'];

export function generateActivityEvent() {
    const tpl = activityTemplates[randInt(0, activityTemplates.length - 1)];
    const msg = tpl.messages[randInt(0, tpl.messages.length - 1)]
        .replace('{loc}', locs[randInt(0, locs.length - 1)])
        .replace('{id}', shipIds[randInt(0, shipIds.length - 1)])
        .replace('{name}', supplierNames[randInt(0, supplierNames.length - 1)])
        .replace('{pct}', randInt(5, 25))
        .replace('{score}', randInt(70, 96))
        .replace('{val}', rand(0.5, 4.5).toFixed(1))
        .replace('{q}', randInt(1, 4));

    return { id: Date.now(), type: tpl.type, icon: tpl.icon, message: msg, time: Date.now() };
}

// ── AI Insights generator ────────────────────────────────────
const insightTemplates = [
    { icon: '🤖', type: 'optimization', text: 'Shifting {pct}% of diesel trucks to electric could save {val} tCO₂e/month' },
    { icon: '📊', type: 'trend', text: 'Emissions trending {dir} compared to same period last year ({pct}% change)' },
    { icon: '⚡', type: 'energy', text: 'Peak energy consumption detected — consider shifting loads to off-peak hours' },
    { icon: '🌊', type: 'route', text: 'Weather system may delay {n} sea routes — switching to rail could reduce CO₂ by {val}t' },
    { icon: '🎯', type: 'milestone', text: 'Current pace projects hitting {pct}% reduction target {days} days ahead of schedule' },
    { icon: '♻️', type: 'circular', text: 'Circular economy opportunity: {name} waste stream reuse could save ${val}K annually' },
];

export function generateAIInsight() {
    const tpl = insightTemplates[randInt(0, insightTemplates.length - 1)];
    const text = tpl.text
        .replace('{pct}', randInt(10, 60))
        .replace('{val}', rand(1, 12).toFixed(1))
        .replace('{dir}', Math.random() > 0.5 ? '📉 down' : '📈 up')
        .replace('{n}', randInt(1, 4))
        .replace('{days}', randInt(3, 21))
        .replace('{name}', supplierNames[randInt(0, supplierNames.length - 1)]);
    return { id: Date.now(), icon: tpl.icon, type: tpl.type, text, timestamp: Date.now() };
}

// ── Shipment progress updater ────────────────────────────────
export function advanceShipments() {
    store.update(s => {
        Object.keys(s.shipmentProgress).forEach(id => {
            const p = s.shipmentProgress[id];
            if (p < 100) {
                s.shipmentProgress[id] = Math.min(100, p + rand(0.1, 0.4));
            }
        });
    });
}

// ── Supplier ESG drift ───────────────────────────────────────
export function driftSupplierESG(suppliersArray) {
    const drifts = {};
    suppliersArray.forEach(s => {
        const current = store.get().supplierESG[s.id] ?? s.esg;
        const next = clamp(parseFloat((noise(current, 0.005)).toFixed(1)), 50, 100);
        drifts[s.id] = next;
    });
    store.update(s => { s.supplierESG = { ...s.supplierESG, ...drifts }; });
    return drifts;
}

// ── Time formatting helper ───────────────────────────────────
export function formatRelativeTime(ms) {
    const diff = Date.now() - ms;
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return 'just now';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

// ── Settings persistence ─────────────────────────────────────
export function saveSettings(settings) {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (_) {}
}

export function loadSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (_) { return {}; }
}

// ── Main simulation runner ───────────────────────────────────
class SimulationEngine {
    constructor() {
        this._sensor = new SensorSimulator(3500);
        this._activityTimer = null;
        this._insightTimer = null;
        this._shipmentTimer = null;
        this._esgTimer = null;
        this._notificationCallbacks = [];
        this._started = false;
    }

    init() {
        store.load();
        const settings = loadSettings();
        const speed = settings.simulationSpeed ?? 1;
        store.update(s => { s.speedMultiplier = speed; });
        this._applyDarkMode(settings);
    }

    _applyDarkMode(settings) {
        if (settings.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }

    start() {
        if (this._started) return;
        this._started = true;

        const state = store.get();
        const speed = state.speedMultiplier ?? 1;

        this._sensor.start(speed);

        // Activity feed: every 20-30 seconds (sped up by multiplier)
        const activityMs = Math.max(5000, 25000 / speed);
        this._activityTimer = setInterval(() => {
            const event = generateActivityEvent();
            store.update(s => {
                s.activityFeed.unshift(event);
                if (s.activityFeed.length > 30) s.activityFeed.pop();
                s.notificationCount = Math.min(99, (s.notificationCount || 0) + 1);
            });
            this._notificationCallbacks.forEach(fn => fn(store.get().notificationCount));
            document.dispatchEvent(new CustomEvent('gscg:activity', { detail: event }));
        }, activityMs);

        // AI insights: every 45 seconds
        const insightMs = Math.max(10000, 45000 / speed);
        this._insightTimer = setInterval(() => {
            const insight = generateAIInsight();
            store.update(s => {
                s.aiInsights.unshift(insight);
                if (s.aiInsights.length > 10) s.aiInsights.pop();
            });
            document.dispatchEvent(new CustomEvent('gscg:insight', { detail: insight }));
        }, insightMs);

        // Shipment progress: every 8 seconds
        const shipMs = Math.max(2000, 8000 / speed);
        this._shipmentTimer = setInterval(() => {
            advanceShipments();
            document.dispatchEvent(new CustomEvent('gscg:shipments'));
        }, shipMs);

        // ESG drift: every 15 seconds
        this._esgTimer = setInterval(() => {
            document.dispatchEvent(new CustomEvent('gscg:esg'));
        }, Math.max(5000, 15000 / speed));

        // Broadcast KPI updates
        store.subscribe('update', () => {
            document.dispatchEvent(new CustomEvent('gscg:kpi', { detail: store.get().kpis }));
        });
    }

    stop() {
        this._sensor.stop();
        [this._activityTimer, this._insightTimer, this._shipmentTimer, this._esgTimer].forEach(t => {
            if (t) clearInterval(t);
        });
        this._activityTimer = null;
        this._insightTimer = null;
        this._shipmentTimer = null;
        this._esgTimer = null;
        this._started = false;
    }

    restart(speed) {
        this.stop();
        store.update(s => { s.speedMultiplier = speed; });
        this.start();
    }

    onNotification(fn) {
        this._notificationCallbacks.push(fn);
        return () => { this._notificationCallbacks = this._notificationCallbacks.filter(c => c !== fn); };
    }

    getState() { return store.get(); }
    getSensor() { return this._sensor; }
}

export const simulation = new SimulationEngine();
