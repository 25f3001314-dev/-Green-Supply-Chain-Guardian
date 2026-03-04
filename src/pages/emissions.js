// ============================================
// EMISSIONS / CARBON TRACKING PAGE — Full functionality
// ============================================
import { emissionsScopeBreakdown, hotspots, monthlyEmissions, reductionMilestones, historicalEmissions, aiForecasts, emissionFactors } from '../data/mockData.js';
import { store, formatRelativeTime } from '../data/simulationEngine.js';
import { createDoughnutChart, createLineChart } from '../components/charts.js';
import { showToast } from '../components/toast.js';
import { renderLiveIndicator, getLiveIndicatorStyles } from '../components/liveIndicator.js';
import { launchConfetti } from '../components/confetti.js';

let _counterInterval = null;
let _expandedHotspots = new Set();

export function renderEmissions() {
    const state = store.get() || {};
    const scope = state.scope || emissionsScopeBreakdown;
    const s1 = scope.s1 ?? emissionsScopeBreakdown.scope1.value;
    const s2 = scope.s2 ?? emissionsScopeBreakdown.scope2.value;
    const s3 = scope.s3 ?? emissionsScopeBreakdown.scope3.value;
    const totalEmissions = s1 + s2 + s3;
    const cumulative = (state.cumulativeEmissions || 847293.4).toFixed(1);

    return `
    ${getLiveIndicatorStyles()}
    <style>
      .emission-counter { font-family:var(--font-display);font-size:2.5rem;font-weight:800;color:var(--primary-700);letter-spacing:-0.02em;font-variant-numeric:tabular-nums; }
      .hotspot-row { cursor:pointer; }
      .hotspot-row:hover td { background:var(--primary-50) !important; }
      .hotspot-detail { background:var(--neutral-50);padding:var(--space-4) var(--space-6);border-bottom:1px solid var(--border-light); display:none; }
      .hotspot-detail.open { display:table-row; }
      .whatif-slider { -webkit-appearance:none;width:100%;height:6px;border-radius:3px;background:var(--neutral-200);outline:none; }
      .whatif-slider::-webkit-slider-thumb { -webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:var(--primary-500);cursor:pointer;box-shadow:0 0 0 3px rgba(16,185,129,0.2); }
      .scope-card { transition: box-shadow 0.4s, transform 0.2s; }
      .scope-card.updated { box-shadow: 0 0 0 2px #10b981, var(--shadow-card-hover) !important; transform: scale(1.01); }
    </style>
    <div class="page-header">
      <div>
        <h1 style="font-size:var(--fs-2xl)">Carbon Tracking</h1>
        <p style="font-size:var(--fs-sm);color:var(--text-tertiary)">Track and analyze your carbon emissions across all scopes.</p>
      </div>
      <div style="display:flex;gap:var(--space-3);align-items:center">
        ${renderLiveIndicator('Live')}
        <select class="select" id="yearSelect"><option>2024</option><option selected>2025</option><option>2026</option></select>
        <button class="btn btn-primary btn-sm" id="exportEmissionsBtn">📥 Export Data</button>
      </div>
    </div>
    <div class="page-body">
      <!-- Live Cumulative Counter -->
      <div class="card animate-fade-in-up" style="margin-bottom:var(--space-6);padding:var(--space-6);background:linear-gradient(135deg,var(--primary-50),var(--secondary-50));border-color:var(--primary-200)">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-4)">
          <div>
            <div style="font-size:var(--fs-sm);color:var(--text-tertiary);margin-bottom:var(--space-1)">🌍 Cumulative Emissions This Year (tCO₂e)</div>
            <div class="emission-counter" id="cumulativeCounter">${parseFloat(cumulative).toLocaleString('en-US', {minimumFractionDigits:1,maximumFractionDigits:1})}</div>
            <div style="font-size:var(--fs-xs);color:var(--text-tertiary);margin-top:4px">Ticking up in real-time based on sensor data</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:var(--fs-sm);color:var(--text-tertiary)">vs. Same Period Last Year</div>
            <div style="font-size:var(--fs-2xl);font-weight:var(--fw-bold);color:#059669">↓ 12.3%</div>
            <div style="font-size:var(--fs-xs);color:var(--text-tertiary)">On track for 2026 targets</div>
          </div>
        </div>
      </div>

      <!-- Summary Scope Cards -->
      <div class="grid grid-3" style="margin-bottom:var(--space-6)">
        <div class="card stat-card scope-card animate-fade-in-up" id="scope1-card">
          <div class="stat-icon" style="background:#ecfdf5;color:#059669">🏭</div>
          <div class="stat-value" style="color:#059669" id="scope1-val">${s1.toLocaleString()}</div>
          <div class="stat-label">Scope 1 — Direct Emissions</div>
          <div class="stat-change positive">↓ ${emissionsScopeBreakdown.scope1.percentage}% of total</div>
          <div style="font-size:var(--fs-xs);color:var(--text-tertiary);margin-top:4px">${emissionsScopeBreakdown.scope1.description}</div>
        </div>
        <div class="card stat-card scope-card animate-fade-in-up stagger-1" id="scope2-card">
          <div class="stat-icon" style="background:#f0fdfa;color:#0d9488">⚡</div>
          <div class="stat-value" style="color:#0d9488" id="scope2-val">${s2.toLocaleString()}</div>
          <div class="stat-label">Scope 2 — Energy Indirect</div>
          <div class="stat-change positive">↓ ${emissionsScopeBreakdown.scope2.percentage}% of total</div>
          <div style="font-size:var(--fs-xs);color:var(--text-tertiary);margin-top:4px">${emissionsScopeBreakdown.scope2.description}</div>
        </div>
        <div class="card stat-card scope-card animate-fade-in-up stagger-2" id="scope3-card">
          <div class="stat-icon" style="background:#fffbeb;color:#d97706">🌐</div>
          <div class="stat-value" style="color:#d97706" id="scope3-val">${s3.toLocaleString()}</div>
          <div class="stat-label">Scope 3 — Value Chain</div>
          <div class="stat-change negative">↑ ${emissionsScopeBreakdown.scope3.percentage}% of total</div>
          <div style="font-size:var(--fs-xs);color:var(--text-tertiary);margin-top:4px">${emissionsScopeBreakdown.scope3.description}</div>
        </div>
      </div>

      <div class="grid grid-2" style="margin-bottom:var(--space-6)">
        <div class="card chart-container animate-fade-in-up stagger-2">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4)">
            <h3>📊 Emissions by Scope</h3>
            <div style="text-align:right">
              <div style="font-family:var(--font-display);font-size:var(--fs-2xl);font-weight:var(--fw-extrabold);color:var(--text-primary)">${totalEmissions.toLocaleString()}</div>
              <div style="font-size:var(--fs-xs);color:var(--text-tertiary)">tCO₂e total</div>
            </div>
          </div>
          <div class="chart-wrapper" style="height:260px;display:flex;align-items:center;justify-content:center">
            <canvas id="scopeDonut"></canvas>
          </div>
        </div>
        <div class="card chart-container animate-fade-in-up stagger-3">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4)">
            <h3>📈 Trend vs Target</h3>
            <label style="display:flex;align-items:center;gap:6px;font-size:var(--fs-xs);cursor:pointer">
              <input type="checkbox" id="prevYearToggle" style="accent-color:var(--primary-500)"> Compare YoY
            </label>
          </div>
          <div class="chart-wrapper" style="height:260px">
            <canvas id="emissionsTrend"></canvas>
          </div>
        </div>
      </div>

      <!-- Hotspot Analysis -->
      <div class="card animate-fade-in-up stagger-3" style="margin-bottom:var(--space-6)">
        <div style="padding:var(--space-6) var(--space-6) var(--space-4)">
          <h3 style="font-size:var(--fs-md)">🔥 Emission Hotspots <span style="font-size:var(--fs-xs);font-weight:400;color:var(--text-tertiary)">(click to expand)</span></h3>
        </div>
        <div class="table-wrapper" style="border:none;border-radius:0">
          <table id="hotspotTable">
            <thead>
              <tr><th>Source</th><th>Emissions (tCO₂e)</th><th>Severity</th><th>Trend</th><th>Reduction Plan</th><th></th></tr>
            </thead>
            <tbody>
              ${hotspots.map((h, i) => `
                <tr class="hotspot-row" data-idx="${i}">
                  <td style="font-weight:var(--fw-semibold)">${h.source}</td>
                  <td>${h.emissions.toLocaleString()}</td>
                  <td><span class="badge ${h.severity === 'High' ? 'badge-danger' : h.severity === 'Medium' ? 'badge-warning' : 'badge-success'}">${h.severity}</span></td>
                  <td>${h.trend === 'decreasing' ? '📉' : h.trend === 'increasing' ? '📈' : '➡️'} ${h.trend}</td>
                  <td style="font-size:var(--fs-xs)">${h.reduction}</td>
                  <td style="font-size:var(--fs-xs);color:var(--primary-600)" id="hotspot-toggle-${i}">▶ Details</td>
                </tr>
                <tr id="hotspot-detail-${i}" style="display:none">
                  <td colspan="6" style="padding:0">
                    <div style="padding:var(--space-4) var(--space-6);background:var(--neutral-50);border-bottom:1px solid var(--border-light)">
                      <div class="grid grid-3">
                        <div><span style="font-size:var(--fs-xs);color:var(--text-tertiary)">Contribution</span><br><strong>${((h.emissions / totalEmissions) * 100).toFixed(1)}%</strong> of total</div>
                        <div><span style="font-size:var(--fs-xs);color:var(--text-tertiary)">2025 Target</span><br><strong>${Math.round(h.emissions * 0.85).toLocaleString()} tCO₂e</strong></div>
                        <div><span style="font-size:var(--fs-xs);color:var(--text-tertiary)">Action Status</span><br><span class="badge badge-info">In Progress</span></div>
                      </div>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Calculator + What-If + Roadmap -->
      <div class="grid grid-3">
        <div class="card animate-fade-in-up stagger-4" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">🧮 Carbon Calculator</h3>
          <div style="display:grid;gap:var(--space-4)">
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Transport Mode</label>
              <select class="select" style="width:100%" id="calcMode">
                ${Object.keys(emissionFactors).map(m => `<option>${m}</option>`).join('')}
              </select>
            </div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Distance (km)</label>
              <input class="input" type="number" id="calcDistance" value="1000" min="1" />
            </div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Weight (tonnes)</label>
              <input class="input" type="number" id="calcWeight" value="10" min="0.1" step="0.1" />
            </div>
            <button class="btn btn-primary" id="calcBtn">Calculate Emissions</button>
            <div id="calcResult" style="display:none;padding:var(--space-4);background:var(--primary-50);border:1px solid var(--primary-200);border-radius:var(--radius-md);text-align:center">
              <div style="font-size:var(--fs-xs);color:var(--text-tertiary)">Estimated Carbon Emissions</div>
              <div style="font-family:var(--font-display);font-size:var(--fs-3xl);font-weight:var(--fw-extrabold);color:var(--primary-700)" id="calcValue">—</div>
              <div style="font-size:var(--fs-sm);color:var(--text-secondary)">tCO₂e</div>
              <div style="font-size:var(--fs-xs);color:var(--text-tertiary);margin-top:4px" id="calcBreakdown"></div>
            </div>
          </div>
        </div>

        <div class="card animate-fade-in-up stagger-5" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">🔮 What-If Simulator</h3>
          <div style="display:grid;gap:var(--space-5)">
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-2)">
                Switch <span id="truckPct">30</span>% trucks to electric
              </label>
              <input type="range" class="whatif-slider" min="0" max="100" value="30" id="truckElecSlider" />
            </div>
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-2)">
                Reduce air freight by <span id="airPct">20</span>%
              </label>
              <input type="range" class="whatif-slider" min="0" max="100" value="20" id="airReduceSlider" />
            </div>
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-2)">
                Renewable energy adoption <span id="renewPct">60</span>%
              </label>
              <input type="range" class="whatif-slider" min="0" max="100" value="60" id="renewSlider" />
            </div>
            <div style="padding:var(--space-4);background:var(--primary-50);border:1px solid var(--primary-200);border-radius:var(--radius-md)">
              <div style="font-size:var(--fs-xs);color:var(--text-tertiary);margin-bottom:4px">Projected Annual Savings</div>
              <div style="font-size:var(--fs-2xl);font-weight:var(--fw-bold);color:var(--primary-700)" id="whatifResult">— tCO₂e</div>
              <div style="font-size:var(--fs-xs);color:var(--text-tertiary)" id="whatifPct">—% reduction</div>
            </div>
          </div>
        </div>

        <div class="card animate-fade-in-up stagger-5" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">🛤️ Reduction Roadmap</h3>
          <div class="roadmap">
            ${reductionMilestones.map(m => `
              <div class="roadmap-item ${m.status}">
                <div class="roadmap-dot"></div>
                <div class="roadmap-content">
                  <div class="roadmap-header">
                    <span class="roadmap-year">${m.year}</span>
                    <span class="badge ${m.status === 'completed' ? 'badge-success' : m.status === 'in-progress' ? 'badge-info' : 'badge-neutral'}">${m.target}</span>
                    ${m.achieved !== '—' ? `<span class="badge badge-success">${m.achieved} ✓</span>` : ''}
                  </div>
                  <p class="roadmap-desc">${m.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initEmissions() {
    const state = store.get() || {};
    const s1 = state.scope?.s1 ?? emissionsScopeBreakdown.scope1.value;
    const s2 = state.scope?.s2 ?? emissionsScopeBreakdown.scope2.value;
    const s3 = state.scope?.s3 ?? emissionsScopeBreakdown.scope3.value;

    createDoughnutChart('scopeDonut', ['Scope 1', 'Scope 2', 'Scope 3'], [s1, s2, s3], ['#059669', '#0d9488', '#f59e0b']);

    const { labels, scope1, scope2, scope3, target } = monthlyEmissions;
    const totalMonthly = labels.map((_, i) => scope1[i] + scope2[i] + scope3[i]);
    let trendChart = createLineChart('emissionsTrend', labels, [
        { label: 'Total Emissions', data: totalMonthly, borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.08)', fill: true },
        { label: 'Target', data: target, borderColor: '#ef4444', borderDash: [6, 4], pointRadius: 0, borderWidth: 2 },
    ]);

    // Year-over-year toggle
    document.getElementById('prevYearToggle')?.addEventListener('change', (e) => {
        if (!trendChart) return;
        if (e.target.checked) {
            const prevYearTotal = historicalEmissions.scope1.slice(0, 12).map((v, i) =>
                v + historicalEmissions.scope2[i] + historicalEmissions.scope3[i]);
            trendChart.data.datasets.push({
                label: '2024 (prev year)', data: prevYearTotal.slice(0, 12),
                borderColor: '#94a3b8', borderDash: [4, 3], pointRadius: 0, fill: false,
            });
        } else {
            trendChart.data.datasets = trendChart.data.datasets.filter(d => d.label !== '2024 (prev year)');
        }
        trendChart.update();
    });

    // Cumulative counter
    let cumVal = state.cumulativeEmissions || 847293.4;
    const counterEl = document.getElementById('cumulativeCounter');
    _counterInterval = setInterval(() => {
        const s = store.get();
        if (s?.cumulativeEmissions) {
            cumVal = s.cumulativeEmissions;
            if (counterEl) counterEl.textContent = cumVal.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        }
    }, 1000);

    // Live scope card updates
    setInterval(() => {
        const s = store.get();
        if (!s?.scope) return;
        const vals = { s1: s.scope.s1, s2: s.scope.s2, s3: s.scope.s3 };
        [['scope1-val', vals.s1, 'scope1-card'], ['scope2-val', vals.s2, 'scope2-card'], ['scope3-val', vals.s3, 'scope3-card']].forEach(([id, v, cardId]) => {
            const el = document.getElementById(id);
            if (!el) return;
            const prev = parseInt(el.textContent.replace(/,/g, '')) || 0;
            if (Math.abs(v - prev) > 5) {
                el.textContent = Math.round(v).toLocaleString();
                const card = document.getElementById(cardId);
                card?.classList.add('updated');
                setTimeout(() => card?.classList.remove('updated'), 800);
            }
        });
    }, 6000);

    // Hotspot row expand/collapse
    document.getElementById('hotspotTable')?.addEventListener('click', (e) => {
        const row = e.target.closest('.hotspot-row');
        if (!row) return;
        const idx = parseInt(row.dataset.idx);
        const detail = document.getElementById(`hotspot-detail-${idx}`);
        const toggle = document.getElementById(`hotspot-toggle-${idx}`);
        if (detail) {
            const isOpen = detail.style.display !== 'none';
            detail.style.display = isOpen ? 'none' : 'table-row';
            if (toggle) toggle.textContent = isOpen ? '▶ Details' : '▼ Close';
        }
    });

    // Carbon calculator
    document.getElementById('calcBtn')?.addEventListener('click', () => {
        const mode = document.getElementById('calcMode')?.value || 'Sea Freight';
        const dist = parseFloat(document.getElementById('calcDistance')?.value) || 1000;
        const weight = parseFloat(document.getElementById('calcWeight')?.value) || 10;
        const factor = emissionFactors[mode] || 0.008;
        const result = (factor * dist * weight / 1000).toFixed(3);
        const resultDiv = document.getElementById('calcResult');
        const valueDiv = document.getElementById('calcValue');
        const breakdownDiv = document.getElementById('calcBreakdown');
        if (resultDiv) resultDiv.style.display = 'block';
        if (valueDiv) valueDiv.textContent = result;
        if (breakdownDiv) breakdownDiv.textContent = `Factor: ${factor} kg CO₂e/tonne-km × ${dist}km × ${weight}t`;
        showToast(`Calculated: ${result} tCO₂e`, 'success');
    });

    // What-if simulator
    function recalcWhatIf() {
        const truck = parseInt(document.getElementById('truckElecSlider')?.value || 30);
        const air = parseInt(document.getElementById('airReduceSlider')?.value || 20);
        const renew = parseInt(document.getElementById('renewSlider')?.value || 60);
        document.getElementById('truckPct').textContent = truck;
        document.getElementById('airPct').textContent = air;
        document.getElementById('renewPct').textContent = renew;

        const truckSavings = 1120 * (truck / 100) * 0.67;
        const airSavings = 3240 * (air / 100) * 0.85;
        const renewSavings = 5640 * (renew / 100) * 0.45;
        const total = truckSavings + airSavings + renewSavings;
        const pct = ((total / (s1 + s2 + s3)) * 100).toFixed(1);
        const el = document.getElementById('whatifResult');
        const pctEl = document.getElementById('whatifPct');
        if (el) el.textContent = Math.round(total).toLocaleString() + ' tCO₂e';
        if (pctEl) pctEl.textContent = `${pct}% reduction`;
    }
    ['truckElecSlider', 'airReduceSlider', 'renewSlider'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', recalcWhatIf);
    });
    recalcWhatIf();

    // Export
    document.getElementById('exportEmissionsBtn')?.addEventListener('click', () => {
        const s = store.get() || {};
        const rows = [
            ['Metric', 'Value', 'Unit'],
            ['Scope 1 Emissions', s.scope?.s1 ?? emissionsScopeBreakdown.scope1.value, 'tCO₂e'],
            ['Scope 2 Emissions', s.scope?.s2 ?? emissionsScopeBreakdown.scope2.value, 'tCO₂e'],
            ['Scope 3 Emissions', s.scope?.s3 ?? emissionsScopeBreakdown.scope3.value, 'tCO₂e'],
            ['Cumulative YTD', (s.cumulativeEmissions || 847293).toFixed(1), 'tCO₂e'],
            ...hotspots.map(h => [h.source, h.emissions, 'tCO₂e']),
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'emissions-export.csv';
        a.click();
        showToast('Emissions data exported as CSV', 'success');
    });

    // Year select (re-render charts)
    document.getElementById('yearSelect')?.addEventListener('change', (e) => {
        showToast(`Showing data for ${e.target.value}`, 'info');
    });

    document.addEventListener('toast', (e) => showToast(e.detail.msg, e.detail.type));
}

export function cleanupEmissions() {
    if (_counterInterval) { clearInterval(_counterInterval); _counterInterval = null; }
}
