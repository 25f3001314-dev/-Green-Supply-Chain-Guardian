// ============================================
// DASHBOARD PAGE — Live updating
// ============================================
import { kpis, monthlyEmissions, suppliers, activityFeed } from '../data/mockData.js';
import { store, formatRelativeTime, generateAIInsight } from '../data/simulationEngine.js';
import { createLineChart, createBarChart } from '../components/charts.js';
import { showToast } from '../components/toast.js';
import { renderLiveIndicator, getLiveIndicatorStyles } from '../components/liveIndicator.js';

// Interval handles so we can clean up on navigation
let _kpiInterval = null;
let _activityInterval = null;
let _insightListener = null;
let _activityListener = null;
let _chartRef = null;

function animateNumber(el, targetVal, unit = '', decimals = 0) {
    if (!el) return;
    const current = parseFloat(el.dataset.val || el.textContent.replace(/[^0-9.]/g, '')) || 0;
    const diff = targetVal - current;
    const steps = 20;
    let step = 0;
    const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = current + diff * eased;
        el.textContent = decimals > 0 ? val.toFixed(decimals) + unit : Math.round(val).toLocaleString() + unit;
        el.dataset.val = val;
        if (step >= steps) clearInterval(timer);
    }, 16);
}

function getKPIDisplay(state) {
    return [
        { id: 'emissions', label: 'Total Emissions', value: state.kpis.emissions.toLocaleString(), raw: state.kpis.emissions, unit: 'tCO₂e', change: -12.3, icon: '🏭', color: '#059669', bgColor: '#ecfdf5' },
        { id: 'reduction', label: 'Reduction Target', value: state.kpis.reduction.toFixed(1) + '%', raw: state.kpis.reduction, unit: 'achieved', change: 8.5, icon: '🎯', color: '#0d9488', bgColor: '#f0fdfa' },
        { id: 'score', label: 'Green Score', value: state.kpis.score.toFixed(1), raw: state.kpis.score, unit: '/ 100', change: 3.1, icon: '🌿', color: '#059669', bgColor: '#ecfdf5' },
        { id: 'compliance', label: 'Supplier Compliance', value: state.kpis.compliance + '%', raw: state.kpis.compliance, unit: 'compliant', change: 5.7, icon: '✅', color: '#2563eb', bgColor: '#eff6ff' },
    ];
}

function renderKPICards(kpiData) {
    return kpiData.map((kpi, i) => `
      <div class="card stat-card kpi-card animate-fade-in-up stagger-${i + 1}" id="kpi-${kpi.id}" style="position:relative;overflow:hidden">
        <div class="kpi-pulse" id="kpi-pulse-${kpi.id}"></div>
        <div class="stat-icon" style="background:${kpi.bgColor};color:${kpi.color}">${kpi.icon}</div>
        <div class="stat-value kpi-value" style="color:${kpi.color}" id="kpi-val-${kpi.id}" data-val="${kpi.raw}">${kpi.value}</div>
        <div class="stat-label">${kpi.label} <span style="color:var(--text-tertiary);font-size:var(--fs-xs)">${kpi.unit}</span></div>
        <div class="stat-change ${kpi.change > 0 ? 'positive' : 'negative'}">
          ${kpi.change > 0 ? '↑' : '↓'} ${Math.abs(kpi.change)}% vs last quarter
        </div>
      </div>
    `).join('');
}

export function renderDashboard() {
    const state = store.get() || {};
    const topSuppliers = [...suppliers].sort((a, b) => b.esg - a.esg).slice(0, 6);
    const kpiData = getKPIDisplay(state);
    const feed = (state.activityFeed || activityFeed).slice(0, 8);
    const insights = (state.aiInsights || []).slice(0, 3);

    return `
    ${getLiveIndicatorStyles()}
    <style>
      .kpi-card { transition: box-shadow 0.3s, transform 0.3s; }
      .kpi-card.updating { box-shadow: 0 0 0 2px #10b981, var(--shadow-card-hover) !important; }
      .kpi-pulse { position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;background:radial-gradient(circle at 50% 0%,rgba(16,185,129,0.12),transparent 70%); transition:opacity 0.6s; }
      .kpi-card.updating .kpi-pulse { opacity:1; }
      .activity-new { animation: slideInLeft 0.4s cubic-bezier(0.34,1.56,0.64,1); }
      @keyframes slideInLeft { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
      .ai-insight-item { display:flex;gap:12px;padding:12px;border-radius:12px;background:var(--primary-50);border:1px solid var(--primary-100);margin-bottom:8px;animation:fadeInUp 0.4s ease; }
      .ai-insight-item:last-child { margin-bottom:0; }
      @keyframes fadeInUp { from { opacity:0;transform:translateY(8px); } to { opacity:1;transform:translateY(0); } }
      .sensor-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px; }
      .sensor-item { background:var(--neutral-50);border-radius:10px;padding:10px;text-align:center; }
      .sensor-val { font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-primary); }
      .sensor-lbl { font-size:10px;color:var(--text-tertiary);margin-top:2px; }
    </style>
    <div class="page-header">
      <div>
        <h1 style="font-size:var(--fs-2xl)">Dashboard</h1>
        <p style="font-size:var(--fs-sm);color:var(--text-tertiary);margin-top:2px">Welcome back, Sarah. Here's your live sustainability overview.</p>
      </div>
      <div style="display:flex;gap:var(--space-3);align-items:center">
        ${renderLiveIndicator('Live')}
        <button class="btn btn-secondary btn-sm" id="dashExportBtn">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Export
        </button>
      </div>
    </div>
    <div class="page-body">
      <!-- KPI Cards -->
      <div class="grid grid-4" style="margin-bottom:var(--space-6)">
        ${renderKPICards(kpiData)}
      </div>

      <!-- Charts Row -->
      <div class="grid grid-2" style="margin-bottom:var(--space-6)">
        <div class="card chart-container animate-fade-in-up stagger-2">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4)">
            <h3>📊 Monthly Emissions by Scope</h3>
            <span id="chartLiveTag">${renderLiveIndicator()}</span>
          </div>
          <div class="chart-wrapper" style="height:280px">
            <canvas id="emissionsLineChart"></canvas>
          </div>
        </div>
        <div class="card chart-container animate-fade-in-up stagger-3">
          <h3>🏆 Top Suppliers by ESG Score</h3>
          <div class="chart-wrapper" style="height:280px">
            <canvas id="supplierBarChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-2" style="margin-bottom:var(--space-6)">
        <!-- Activity Feed -->
        <div class="card animate-fade-in-up stagger-4" style="padding:var(--space-6)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4)">
            <h3 style="font-size:var(--fs-md)">📋 Live Activity Feed</h3>
            ${renderLiveIndicator()}
          </div>
          <div class="activity-feed" id="activityFeed">
            ${feed.map(a => `
              <div class="activity-item">
                <span class="activity-icon">${a.icon}</span>
                <div class="activity-content">
                  <span class="activity-msg">${a.message}</span>
                  <span class="activity-time">${formatRelativeTime(a.time)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- AI Insights -->
        <div class="card animate-fade-in-up stagger-5" style="padding:var(--space-6)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4)">
            <h3 style="font-size:var(--fs-md)">🤖 AI Insights</h3>
            ${renderLiveIndicator('Updating')}
          </div>
          <div id="aiInsightsList">
            ${insights.map(ins => `
              <div class="ai-insight-item">
                <span style="font-size:22px;flex-shrink:0">${ins.icon}</span>
                <div>
                  <p style="font-size:var(--fs-sm);color:var(--text-primary);line-height:1.4">${ins.text}</p>
                  <span style="font-size:10px;color:var(--text-tertiary)">${formatRelativeTime(ins.timestamp)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- IoT Sensors + Quick Actions -->
      <div class="grid grid-2">
        <!-- IoT Sensors -->
        <div class="card animate-fade-in-up stagger-4" style="padding:var(--space-6)">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h3 style="font-size:var(--fs-md)">📡 Live IoT Sensors</h3>
            ${renderLiveIndicator()}
          </div>
          <div class="sensor-grid" id="sensorGrid">
            ${renderSensorGrid(state.sensors || {})}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card animate-fade-in-up stagger-5" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">⚡ Quick Actions</h3>
          <div class="quick-actions">
            <button class="quick-action-btn" onclick="location.hash='suppliers'">
              <span class="qa-icon" style="background:var(--primary-50);color:var(--primary-600)">👥</span>
              <div><span class="qa-title">Review Suppliers</span><span class="qa-desc">3 suppliers need attention</span></div>
            </button>
            <button class="quick-action-btn" onclick="location.hash='emissions'">
              <span class="qa-icon" style="background:#f0fdfa;color:var(--secondary-600)">📉</span>
              <div><span class="qa-title">View Emissions Report</span><span class="qa-desc">Live data available</span></div>
            </button>
            <button class="quick-action-btn" onclick="location.hash='logistics'">
              <span class="qa-icon" style="background:#eff6ff;color:#2563eb">🚛</span>
              <div><span class="qa-title">Track Shipments</span><span class="qa-desc">8 active shipments</span></div>
            </button>
            <button class="quick-action-btn" onclick="location.hash='reports'">
              <span class="qa-icon" style="background:#fffbeb;color:var(--accent-600)">📋</span>
              <div><span class="qa-title">Generate Report</span><span class="qa-desc">CSRD deadline approaching</span></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSensorGrid(sensors) {
    const items = [
        { label: 'Temperature', value: (sensors.temperature || 22.4).toFixed(1) + '°C', icon: '🌡️' },
        { label: 'Humidity', value: (sensors.humidity || 61).toFixed(0) + '%', icon: '💧' },
        { label: 'Energy Today', value: ((sensors.energyKwh || 4820) / 1000).toFixed(2) + ' MWh', icon: '⚡' },
        { label: 'Air Quality', value: (sensors.airQuality || 87).toFixed(0), icon: '🍃' },
        { label: 'Water Usage', value: (sensors.waterUsage || 312).toFixed(0) + ' m³', icon: '🚿' },
        { label: 'CO₂ Ambient', value: (sensors.co2ppm || 412).toFixed(0) + ' ppm', icon: '🌫️' },
    ];
    return items.map((s, i) => `
      <div class="sensor-item" id="sensor-${i}">
        <div style="font-size:18px">${s.icon}</div>
        <div class="sensor-val" id="sensor-val-${i}">${s.value}</div>
        <div class="sensor-lbl">${s.label}</div>
      </div>
    `).join('');
}

function updateSensorGrid(sensors) {
    if (!sensors) return;
    const vals = [
        (sensors.temperature || 22.4).toFixed(1) + '°C',
        (sensors.humidity || 61).toFixed(0) + '%',
        ((sensors.energyKwh || 4820) / 1000).toFixed(2) + ' MWh',
        (sensors.airQuality || 87).toFixed(0),
        (sensors.waterUsage || 312).toFixed(0) + ' m³',
        (sensors.co2ppm || 412).toFixed(0) + ' ppm',
    ];
    vals.forEach((v, i) => {
        const el = document.getElementById(`sensor-val-${i}`);
        if (el && el.textContent !== v) {
            el.textContent = v;
            el.style.color = '#059669';
            setTimeout(() => { el.style.color = ''; }, 800);
        }
    });
}

export function initDashboard() {
    const { labels, scope1, scope2, scope3 } = monthlyEmissions;
    const state = store.get() || {};

    // Init charts
    _chartRef = createLineChart('emissionsLineChart', labels, [
        { label: 'Scope 1', data: [...scope1], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true },
        { label: 'Scope 2', data: [...scope2], borderColor: '#14b8a6', backgroundColor: 'rgba(20,184,166,0.08)', fill: true },
        { label: 'Scope 3', data: [...scope3], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.05)', fill: true },
    ]);

    const allSuppliers = [...suppliers, ...(state.customSuppliers || [])];
    const topSuppliers = allSuppliers.sort((a, b) => b.esg - a.esg).slice(0, 6);
    createBarChart('supplierBarChart',
        topSuppliers.map(s => s.name.split(' ').slice(0, 2).join(' ')),
        [{ label: 'ESG Score', data: topSuppliers.map(s => (state.supplierESG?.[s.id] ?? s.esg)), backgroundColor: ['#059669', '#0d9488', '#10b981', '#14b8a6', '#34d399', '#2dd4bf'] }],
        { horizontal: true, plugins: { legend: { display: false } } }
    );

    // KPI update
    _kpiInterval = setInterval(() => {
        const s = store.get();
        if (!s) return;
        const kpiData = getKPIDisplay(s);
        kpiData.forEach(kpi => {
            const el = document.getElementById(`kpi-val-${kpi.id}`);
            const card = document.getElementById(`kpi-${kpi.id}`);
            if (!el) return;
            const prevVal = parseFloat(el.dataset.val) || 0;
            if (Math.abs(kpi.raw - prevVal) > 0.5) {
                card?.classList.add('updating');
                setTimeout(() => card?.classList.remove('updating'), 1200);
                animateNumber(el, kpi.raw, kpi.id === 'emissions' ? '' : (kpi.id === 'compliance' || kpi.id === 'reduction' ? '%' : ''), kpi.id === 'score' ? 1 : 0);
            }
        });
        updateSensorGrid(s.sensors);
    }, 5000);

    // Activity feed update
    function _onActivity(e) {
        const feed = document.getElementById('activityFeed');
        if (!feed) return;
        const newItem = document.createElement('div');
        newItem.className = 'activity-item activity-new';
        newItem.innerHTML = `
          <span class="activity-icon">${e.detail.icon}</span>
          <div class="activity-content">
            <span class="activity-msg">${e.detail.message}</span>
            <span class="activity-time">just now</span>
          </div>
        `;
        feed.prepend(newItem);
        // Remove last if too many
        const items = feed.querySelectorAll('.activity-item');
        if (items.length > 8) items[items.length - 1].remove();
    }
    _activityListener = _onActivity;
    document.addEventListener('gscg:activity', _onActivity);

    // AI insight update
    function _onInsight(e) {
        const list = document.getElementById('aiInsightsList');
        if (!list) return;
        const newItem = document.createElement('div');
        newItem.className = 'ai-insight-item';
        newItem.innerHTML = `
          <span style="font-size:22px;flex-shrink:0">${e.detail.icon}</span>
          <div>
            <p style="font-size:var(--fs-sm);color:var(--text-primary);line-height:1.4">${e.detail.text}</p>
            <span style="font-size:10px;color:var(--text-tertiary)">just now</span>
          </div>
        `;
        list.prepend(newItem);
        const existing = list.querySelectorAll('.ai-insight-item');
        if (existing.length > 3) existing[existing.length - 1].remove();
    }
    _insightListener = _onInsight;
    document.addEventListener('gscg:insight', _onInsight);
    // Sliding chart updates (add new data points)
    let chartTick = 0;
    const chartUpdateInterval = setInterval(() => {
        if (!_chartRef) { clearInterval(chartUpdateInterval); return; }
        chartTick++;
        try {
            const s1Last = _chartRef.data.datasets[0].data;
            const s2Last = _chartRef.data.datasets[1].data;
            const s3Last = _chartRef.data.datasets[2].data;
            // Nudge last data point
            s1Last[s1Last.length - 1] = Math.max(200, s1Last[s1Last.length - 1] + (Math.random() - 0.5) * 8);
            s2Last[s2Last.length - 1] = Math.max(400, s2Last[s2Last.length - 1] + (Math.random() - 0.5) * 10);
            s3Last[s3Last.length - 1] = Math.max(700, s3Last[s3Last.length - 1] + (Math.random() - 0.5) * 15);
            _chartRef.update('none');
        } catch (_) { clearInterval(chartUpdateInterval); }
    }, 5000);

    // Export button
    document.getElementById('dashExportBtn')?.addEventListener('click', () => {
        showToast('Dashboard exported as PDF', 'success');
    });

    document.addEventListener('toast', (e) => showToast(e.detail.msg, e.detail.type));
}

// Clean up intervals on navigation
export function cleanupDashboard() {
    if (_kpiInterval) { clearInterval(_kpiInterval); _kpiInterval = null; }
    if (_activityListener) { document.removeEventListener('gscg:activity', _activityListener); _activityListener = null; }
    if (_insightListener) { document.removeEventListener('gscg:insight', _insightListener); _insightListener = null; }
    _chartRef = null;
}
