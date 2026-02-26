// ============================================
// DASHBOARD PAGE
// ============================================
import { kpis, monthlyEmissions, suppliers, activityFeed } from '../data/mockData.js';
import { createLineChart, createBarChart } from '../components/charts.js';
import { showToast } from '../components/toast.js';

export function renderDashboard() {
    const topSuppliers = [...suppliers].sort((a, b) => b.esg - a.esg).slice(0, 6);

    return `
    <div class="page-header">
      <div>
        <h1 style="font-size:var(--fs-2xl)">Dashboard</h1>
        <p style="font-size:var(--fs-sm);color:var(--text-tertiary);margin-top:2px">Welcome back, Sarah. Here's your sustainability overview.</p>
      </div>
      <div style="display:flex;gap:var(--space-3)">
        <button class="btn btn-secondary btn-sm" onclick="document.dispatchEvent(new CustomEvent('toast',{detail:{msg:'Report exported as PDF',type:'success'}}))">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Export
        </button>
        <button class="btn btn-primary btn-sm" onclick="document.dispatchEvent(new CustomEvent('toast',{detail:{msg:'Dashboard data refreshed',type:'info'}}))">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          Refresh
        </button>
      </div>
    </div>
    <div class="page-body">
      <!-- KPI Cards -->
      <div class="grid grid-4" style="margin-bottom:var(--space-6)">
        ${kpis.map((kpi, i) => `
          <div class="card stat-card animate-fade-in-up stagger-${i + 1}">
            <div class="stat-icon" style="background:${kpi.bgColor};color:${kpi.color}">${kpi.icon}</div>
            <div class="stat-value" style="color:${kpi.color}">${kpi.value}</div>
            <div class="stat-label">${kpi.label} <span style="color:var(--text-tertiary);font-size:var(--fs-xs)">${kpi.unit}</span></div>
            <div class="stat-change ${kpi.change > 0 ? 'positive' : 'negative'}">
              ${kpi.change > 0 ? '↑' : '↓'} ${Math.abs(kpi.change)}% vs last quarter
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Charts Row -->
      <div class="grid grid-2" style="margin-bottom:var(--space-6)">
        <div class="card chart-container animate-fade-in-up stagger-2">
          <h3>📊 Monthly Emissions by Scope</h3>
          <div class="chart-wrapper" style="height:300px">
            <canvas id="emissionsLineChart"></canvas>
          </div>
        </div>
        <div class="card chart-container animate-fade-in-up stagger-3">
          <h3>🏆 Top Suppliers by ESG Score</h3>
          <div class="chart-wrapper" style="height:300px">
            <canvas id="supplierBarChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-2">
        <!-- Activity Feed -->
        <div class="card animate-fade-in-up stagger-4" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">📋 Recent Activity</h3>
          <div class="activity-feed">
            ${activityFeed.map(a => `
              <div class="activity-item">
                <span class="activity-icon">${a.icon}</span>
                <div class="activity-content">
                  <span class="activity-msg">${a.message}</span>
                  <span class="activity-time">${a.time}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card animate-fade-in-up stagger-5" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">⚡ Quick Actions</h3>
          <div class="quick-actions">
            <button class="quick-action-btn" onclick="location.hash='suppliers'">
              <span class="qa-icon" style="background:var(--primary-50);color:var(--primary-600)">👥</span>
              <div>
                <span class="qa-title">Review Suppliers</span>
                <span class="qa-desc">3 suppliers need attention</span>
              </div>
            </button>
            <button class="quick-action-btn" onclick="location.hash='emissions'">
              <span class="qa-icon" style="background:#f0fdfa;color:var(--secondary-600)">📉</span>
              <div>
                <span class="qa-title">View Emissions Report</span>
                <span class="qa-desc">Q4 2025 data available</span>
              </div>
            </button>
            <button class="quick-action-btn" onclick="location.hash='logistics'">
              <span class="qa-icon" style="background:#eff6ff;color:#2563eb">🚛</span>
              <div>
                <span class="qa-title">Track Shipments</span>
                <span class="qa-desc">8 active shipments</span>
              </div>
            </button>
            <button class="quick-action-btn" onclick="location.hash='reports'">
              <span class="qa-icon" style="background:#fffbeb;color:var(--accent-600)">📋</span>
              <div>
                <span class="qa-title">Generate Report</span>
                <span class="qa-desc">CSRD deadline approaching</span>
              </div>
            </button>
            <button class="quick-action-btn" onclick="document.dispatchEvent(new CustomEvent('toast',{detail:{msg:'Carbon calculator opened',type:'info'}}))">
              <span class="qa-icon" style="background:#fef2f2;color:var(--danger-500)">🧮</span>
              <div>
                <span class="qa-title">Carbon Calculator</span>
                <span class="qa-desc">Estimate your footprint</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initDashboard() {
    const { labels, scope1, scope2, scope3 } = monthlyEmissions;

    createLineChart('emissionsLineChart', labels, [
        { label: 'Scope 1', data: scope1, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true },
        { label: 'Scope 2', data: scope2, borderColor: '#14b8a6', backgroundColor: 'rgba(20,184,166,0.08)', fill: true },
        { label: 'Scope 3', data: scope3, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.05)', fill: true },
    ]);

    const topSuppliers = [...suppliers].sort((a, b) => b.esg - a.esg).slice(0, 6);
    createBarChart('supplierBarChart',
        topSuppliers.map(s => s.name.split(' ').slice(0, 2).join(' ')),
        [{ label: 'ESG Score', data: topSuppliers.map(s => s.esg), backgroundColor: ['#059669', '#0d9488', '#10b981', '#14b8a6', '#34d399', '#2dd4bf'] }],
        { horizontal: true, plugins: { legend: { display: false } } }
    );

    document.addEventListener('toast', (e) => showToast(e.detail.msg, e.detail.type));
}
