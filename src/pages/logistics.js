// ============================================
// LOGISTICS PAGE
// ============================================
import { shipments, transportModes } from '../data/mockData.js';
import { createDoughnutChart } from '../components/charts.js';
import { showToast } from '../components/toast.js';

function getStatusClass(status) {
    const map = { 'In Transit': 'badge-info', 'Delivered': 'badge-success', 'Delayed': 'badge-danger', 'Loading': 'badge-warning' };
    return map[status] || 'badge-neutral';
}

function getModeEmoji(mode) {
    const map = { 'Sea': '🚢', 'Rail': '🚂', 'Electric Truck': '🔋', 'Air': '✈️', 'Truck': '🚛' };
    return map[mode] || '📦';
}

export function renderLogistics() {
    const activeCount = shipments.filter(s => s.status === 'In Transit' || s.status === 'Loading').length;
    const deliveredCount = shipments.filter(s => s.status === 'Delivered').length;
    const delayedCount = shipments.filter(s => s.status === 'Delayed').length;

    return `
    <div class="page-header">
      <div>
        <h1 style="font-size:var(--fs-2xl)">Logistics & Shipments</h1>
        <p style="font-size:var(--fs-sm);color:var(--text-tertiary)">Track shipments and optimize transport emissions.</p>
      </div>
    </div>
    <div class="page-body">
      <!-- Summary Cards -->
      <div class="grid grid-4" style="margin-bottom:var(--space-6)">
        <div class="card stat-card animate-fade-in-up">
          <div class="stat-icon" style="background:#eff6ff;color:#2563eb">🚛</div>
          <div class="stat-value" style="color:#2563eb">${shipments.length}</div>
          <div class="stat-label">Total Shipments</div>
        </div>
        <div class="card stat-card animate-fade-in-up stagger-1">
          <div class="stat-icon" style="background:#ecfdf5;color:#059669">🔄</div>
          <div class="stat-value" style="color:#059669">${activeCount}</div>
          <div class="stat-label">Active / Loading</div>
        </div>
        <div class="card stat-card animate-fade-in-up stagger-2">
          <div class="stat-icon" style="background:#ecfdf5;color:#059669">✅</div>
          <div class="stat-value" style="color:#059669">${deliveredCount}</div>
          <div class="stat-label">Delivered</div>
        </div>
        <div class="card stat-card animate-fade-in-up stagger-3">
          <div class="stat-icon" style="background:#fef2f2;color:#dc2626">⚠️</div>
          <div class="stat-value" style="color:#dc2626">${delayedCount}</div>
          <div class="stat-label">Delayed</div>
        </div>
      </div>

      <div class="grid grid-2" style="margin-bottom:var(--space-6)">
        <!-- Transport Mode Breakdown -->
        <div class="card chart-container animate-fade-in-up stagger-2">
          <h3>🚛 Transport Mode Distribution</h3>
          <div class="chart-wrapper" style="height:280px;display:flex;align-items:center;justify-content:center">
            <canvas id="transportDonut"></canvas>
          </div>
        </div>

        <!-- Map Placeholder -->
        <div class="card animate-fade-in-up stagger-3" style="padding:var(--space-6);position:relative;overflow:hidden">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">🗺️ Supply Chain Network</h3>
          <div class="map-placeholder">
            <div class="map-bg">
              <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;opacity:0.15">
                <path d="M100 200 Q200 100 300 180 T500 160 T700 200" stroke="#059669" stroke-width="2" fill="none"/>
                <path d="M150 250 Q250 200 400 220 T600 180" stroke="#0d9488" stroke-width="2" fill="none" stroke-dasharray="4"/>
                <path d="M200 150 Q350 100 500 140 T700 120" stroke="#14b8a6" stroke-width="1.5" fill="none"/>
                <circle cx="150" cy="200" r="6" fill="#059669"/><circle cx="300" cy="180" r="6" fill="#059669"/>
                <circle cx="500" cy="160" r="8" fill="#0d9488"/><circle cx="700" cy="200" r="6" fill="#059669"/>
                <circle cx="400" cy="220" r="5" fill="#14b8a6"/><circle cx="600" cy="180" r="7" fill="#f59e0b"/>
              </svg>
              <div class="map-dots">
                ${['left:18%;top:45%', 'left:38%;top:40%', 'left:62%;top:35%', 'left:85%;top:45%', 'left:50%;top:50%', 'left:75%;top:40%'].map((pos, i) => `
                  <div class="map-dot animate-float" style="${pos};animation-delay:${i * 0.5}s"></div>
                `).join('')}
              </div>
            </div>
            <p style="text-align:center;font-size:var(--fs-xs);color:var(--text-tertiary);margin-top:var(--space-4)">Interactive map visualization — showing ${activeCount} active routes</p>
          </div>
        </div>
      </div>

      <!-- Shipments Table -->
      <div class="card animate-fade-in-up stagger-4">
        <div style="padding:var(--space-6) var(--space-6) 0">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">📦 Active Shipments</h3>
        </div>
        <div class="table-wrapper" style="border:none;border-radius:0">
          <table>
            <thead>
              <tr>
                <th>Shipment ID</th><th>Supplier</th><th>Route</th>
                <th>Mode</th><th>Status</th><th>Progress</th>
                <th>Carbon (tCO₂e)</th><th>ETA</th>
              </tr>
            </thead>
            <tbody>
              ${shipments.map(s => `
                <tr>
                  <td style="font-weight:var(--fw-semibold);color:var(--text-primary)">${s.id}</td>
                  <td>${s.supplier.split(' ').slice(0, 2).join(' ')}</td>
                  <td style="font-size:var(--fs-xs)">${s.origin} → ${s.destination}</td>
                  <td>${getModeEmoji(s.mode)} ${s.mode}</td>
                  <td><span class="badge ${getStatusClass(s.status)}">${s.status}</span></td>
                  <td>
                    <div style="display:flex;align-items:center;gap:var(--space-2)">
                      <div class="progress-bar" style="flex:1;height:6px">
                        <div class="progress-bar-fill" style="width:${s.progress}%"></div>
                      </div>
                      <span style="font-size:11px;color:var(--text-tertiary);min-width:30px">${s.progress}%</span>
                    </div>
                  </td>
                  <td style="font-weight:var(--fw-semibold);color:${s.carbon > 20 ? 'var(--danger-500)' : s.carbon > 5 ? 'var(--accent-600)' : 'var(--primary-600)'}">${s.carbon}</td>
                  <td style="font-size:var(--fs-xs)">${new Date(s.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function initLogistics() {
    createDoughnutChart('transportDonut',
        transportModes.map(t => t.mode),
        transportModes.map(t => t.percentage),
        transportModes.map(t => t.color)
    );
}
