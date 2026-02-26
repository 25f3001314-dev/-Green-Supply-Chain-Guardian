// ============================================
// EMISSIONS / CARBON TRACKING PAGE
// ============================================
import { emissionsScopeBreakdown, hotspots, monthlyEmissions, reductionMilestones } from '../data/mockData.js';
import { createDoughnutChart, createLineChart } from '../components/charts.js';
import { showToast } from '../components/toast.js';

export function renderEmissions() {
    const totalEmissions = emissionsScopeBreakdown.scope1.value + emissionsScopeBreakdown.scope2.value + emissionsScopeBreakdown.scope3.value;

    return `
    <div class="page-header">
      <div>
        <h1 style="font-size:var(--fs-2xl)">Carbon Tracking</h1>
        <p style="font-size:var(--fs-sm);color:var(--text-tertiary)">Track and analyze your carbon emissions across all scopes.</p>
      </div>
      <div style="display:flex;gap:var(--space-3)">
        <select class="select"><option>2025</option><option selected>2026</option></select>
        <button class="btn btn-primary btn-sm" onclick="document.dispatchEvent(new CustomEvent('toast',{detail:{msg:'Emissions report exported',type:'success'}}))">Export Data</button>
      </div>
    </div>
    <div class="page-body">
      <!-- Summary Cards -->
      <div class="grid grid-3" style="margin-bottom:var(--space-6)">
        <div class="card stat-card animate-fade-in-up">
          <div class="stat-icon" style="background:#ecfdf5;color:#059669">🏭</div>
          <div class="stat-value" style="color:#059669">${emissionsScopeBreakdown.scope1.value.toLocaleString()}</div>
          <div class="stat-label">Scope 1 — ${emissionsScopeBreakdown.scope1.label}</div>
          <div class="stat-change positive">↓ ${emissionsScopeBreakdown.scope1.percentage}% of total</div>
        </div>
        <div class="card stat-card animate-fade-in-up stagger-1">
          <div class="stat-icon" style="background:#f0fdfa;color:#0d9488">⚡</div>
          <div class="stat-value" style="color:#0d9488">${emissionsScopeBreakdown.scope2.value.toLocaleString()}</div>
          <div class="stat-label">Scope 2 — ${emissionsScopeBreakdown.scope2.label}</div>
          <div class="stat-change positive">↓ ${emissionsScopeBreakdown.scope2.percentage}% of total</div>
        </div>
        <div class="card stat-card animate-fade-in-up stagger-2">
          <div class="stat-icon" style="background:#fffbeb;color:#d97706">🌐</div>
          <div class="stat-value" style="color:#d97706">${emissionsScopeBreakdown.scope3.value.toLocaleString()}</div>
          <div class="stat-label">Scope 3 — ${emissionsScopeBreakdown.scope3.label}</div>
          <div class="stat-change negative">↑ ${emissionsScopeBreakdown.scope3.percentage}% of total</div>
        </div>
      </div>

      <div class="grid grid-2" style="margin-bottom:var(--space-6)">
        <!-- Scope Breakdown Doughnut -->
        <div class="card chart-container animate-fade-in-up stagger-2">
          <h3>📊 Emissions by Scope</h3>
          <div class="chart-wrapper" style="height:280px;display:flex;align-items:center;justify-content:center">
            <canvas id="scopeDonut"></canvas>
          </div>
          <div style="text-align:center;margin-top:var(--space-4)">
            <span style="font-family:var(--font-display);font-size:var(--fs-3xl);font-weight:var(--fw-extrabold);color:var(--text-primary)">${totalEmissions.toLocaleString()}</span>
            <span style="font-size:var(--fs-sm);color:var(--text-tertiary);margin-left:var(--space-1)">tCO₂e total</span>
          </div>
        </div>

        <!-- Trend Line -->
        <div class="card chart-container animate-fade-in-up stagger-3">
          <h3>📈 Emissions Trend vs Target</h3>
          <div class="chart-wrapper" style="height:320px">
            <canvas id="emissionsTrend"></canvas>
          </div>
        </div>
      </div>

      <!-- Hotspot Analysis -->
      <div class="card animate-fade-in-up stagger-3" style="margin-bottom:var(--space-6)">
        <div style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">🔥 Emission Hotspots</h3>
        </div>
        <div class="table-wrapper" style="border:none;border-radius:0">
          <table>
            <thead>
              <tr><th>Source</th><th>Emissions (tCO₂e)</th><th>Severity</th><th>Trend</th><th>Reduction Plan</th></tr>
            </thead>
            <tbody>
              ${hotspots.map(h => `
                <tr>
                  <td style="font-weight:var(--fw-semibold);color:var(--text-primary)">${h.source}</td>
                  <td>${h.emissions.toLocaleString()}</td>
                  <td><span class="badge ${h.severity === 'High' ? 'badge-danger' : h.severity === 'Medium' ? 'badge-warning' : 'badge-success'}">${h.severity}</span></td>
                  <td>${h.trend === 'decreasing' ? '📉' : h.trend === 'increasing' ? '📈' : '➡️'} ${h.trend}</td>
                  <td style="font-size:var(--fs-xs)">${h.reduction}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Carbon Calculator & Reduction Roadmap -->
      <div class="grid grid-2">
        <div class="card animate-fade-in-up stagger-4" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">🧮 Carbon Calculator</h3>
          <div class="calc-form" style="display:grid;gap:var(--space-4)">
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Transport Mode</label>
              <select class="select" style="width:100%" id="calcMode"><option>Sea Freight</option><option>Air Freight</option><option>Rail</option><option>Electric Truck</option><option>Diesel Truck</option></select>
            </div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Distance (km)</label>
              <input class="input" type="number" id="calcDistance" value="1000" min="1" />
            </div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Weight (tonnes)</label>
              <input class="input" type="number" id="calcWeight" value="10" min="0.1" step="0.1" />
            </div>
            <button class="btn btn-primary" id="calcBtn">Calculate Emissions</button>
            <div id="calcResult" class="card" style="padding:var(--space-4);text-align:center;display:none;background:var(--primary-50);border-color:var(--primary-200)">
              <span style="font-size:var(--fs-xs);color:var(--text-tertiary)">Estimated Carbon Emissions</span>
              <div style="font-family:var(--font-display);font-size:var(--fs-3xl);font-weight:var(--fw-extrabold);color:var(--primary-700)" id="calcValue">—</div>
              <span style="font-size:var(--fs-sm);color:var(--text-secondary)">tCO₂e</span>
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
                    <span class="badge ${m.status === 'completed' ? 'badge-success' : m.status === 'in-progress' ? 'badge-info' : 'badge-neutral'}">${m.target} Target</span>
                    ${m.achieved !== '—' ? `<span class="badge badge-success">${m.achieved} Achieved</span>` : ''}
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
    createDoughnutChart('scopeDonut',
        ['Scope 1', 'Scope 2', 'Scope 3'],
        [emissionsScopeBreakdown.scope1.value, emissionsScopeBreakdown.scope2.value, emissionsScopeBreakdown.scope3.value],
        ['#059669', '#0d9488', '#f59e0b']
    );

    const { labels, scope1, scope2, scope3, target } = monthlyEmissions;
    const totalMonthly = labels.map((_, i) => scope1[i] + scope2[i] + scope3[i]);
    createLineChart('emissionsTrend', labels, [
        { label: 'Total Emissions', data: totalMonthly, borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', fill: true },
        { label: 'Target', data: target, borderColor: '#ef4444', borderDash: [6, 4], pointRadius: 0 },
    ]);

    const emFactors = { 'Sea Freight': 0.008, 'Air Freight': 0.602, 'Rail': 0.028, 'Electric Truck': 0.05, 'Diesel Truck': 0.15 };
    document.getElementById('calcBtn')?.addEventListener('click', () => {
        const mode = document.getElementById('calcMode')?.value || 'Sea Freight';
        const dist = parseFloat(document.getElementById('calcDistance')?.value) || 1000;
        const weight = parseFloat(document.getElementById('calcWeight')?.value) || 10;
        const result = (emFactors[mode] * dist * weight / 1000).toFixed(2);
        const resultDiv = document.getElementById('calcResult');
        const valueDiv = document.getElementById('calcValue');
        if (resultDiv) resultDiv.style.display = 'block';
        if (valueDiv) valueDiv.textContent = result;
    });

    document.addEventListener('toast', (e) => showToast(e.detail.msg, e.detail.type));
}
