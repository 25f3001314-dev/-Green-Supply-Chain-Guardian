// ============================================
// LOGISTICS PAGE — Live shipment tracking
// ============================================
import { shipments as baseShipments, transportModes, weatherData } from '../data/mockData.js';
import { store } from '../data/simulationEngine.js';
import { createDoughnutChart } from '../components/charts.js';
import { showToast } from '../components/toast.js';
import { renderLiveIndicator, getLiveIndicatorStyles } from '../components/liveIndicator.js';

let _etaInterval = null;
let _progressInterval = null;

function getStatusClass(status) {
    const map = { 'In Transit': 'badge-info', 'Delivered': 'badge-success', 'Delayed': 'badge-danger', 'Loading': 'badge-warning' };
    return map[status] || 'badge-neutral';
}

function getModeEmoji(mode) {
    const map = { 'Sea': '🚢', 'Rail': '🚂', 'Electric Truck': '🔋', 'Air': '✈️', 'Truck': '🚛', 'Hydrogen Truck': '💚' };
    return map[mode] || '📦';
}

function getProgress(shipmentId, fallback) {
    const state = store.get();
    const p = state?.shipmentProgress?.[shipmentId] ?? fallback;
    return Math.min(100, parseFloat(p.toFixed(1)));
}

function getShipmentStatus(shipmentId, fallback) {
    const p = getProgress(shipmentId, 0);
    if (p >= 100) return 'Delivered';
    return fallback;
}

function calcETA(etaStr, shipmentId) {
    const progress = getProgress(shipmentId, 0);
    if (progress >= 100) return 'Delivered ✓';
    const eta = new Date(etaStr);
    const now = new Date();
    const diff = eta - now;
    if (diff <= 0) return 'Arriving...';
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hrs > 24) {
        const days = Math.floor(hrs / 24);
        return `In ${days}d ${hrs % 24}h`;
    }
    return `In ${hrs}h ${mins}m`;
}

function renderShipmentRows(shipmentList) {
    return shipmentList.map(s => {
        const progress = getProgress(s.id, s.progress);
        const status = getShipmentStatus(s.id, s.status);
        const eta = calcETA(s.eta, s.id);
        return `
        <tr data-shipment="${s.id}">
          <td style="font-weight:var(--fw-semibold);color:var(--text-primary)">${s.id}</td>
          <td style="font-size:var(--fs-xs)">${s.supplier.split(' ').slice(0, 2).join(' ')}</td>
          <td style="font-size:var(--fs-xs)">${s.origin} → ${s.destination}</td>
          <td>${getModeEmoji(s.mode)} ${s.mode}</td>
          <td><span class="badge ${getStatusClass(status)}">${status}</span></td>
          <td style="min-width:140px">
            <div style="display:flex;align-items:center;gap:var(--space-2)">
              <div class="progress-bar" style="flex:1;height:6px">
                <div class="progress-bar-fill" id="prog-${s.id}" style="width:${progress}%;transition:width 1s ease"></div>
              </div>
              <span style="font-size:11px;color:var(--text-tertiary);min-width:35px" id="prog-pct-${s.id}">${progress.toFixed(0)}%</span>
            </div>
          </td>
          <td style="font-weight:var(--fw-semibold);color:${s.carbon > 20 ? 'var(--danger-500)' : s.carbon > 5 ? 'var(--accent-600)' : 'var(--primary-600)'}">${s.carbon}</td>
          <td style="font-size:var(--fs-xs);font-weight:var(--fw-medium);color:${progress >= 100 ? '#059669' : 'var(--text-secondary)'}" id="eta-${s.id}">${eta}</td>
        </tr>`;
    }).join('');
}

function renderWeatherAlerts() {
    const alerts = Object.entries(weatherData)
        .filter(([, w]) => w.delayRisk !== 'Low')
        .map(([region, w]) => `
          <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:${w.delayRisk === 'High' ? '#fef2f2' : '#fffbeb'};border-radius:8px;font-size:var(--fs-xs)">
            <span>${w.delayRisk === 'High' ? '🌊' : '⚠️'}</span>
            <div><strong>${region.replace(/([A-Z])/g, ' $1').trim()}</strong>: ${w.condition} — ${w.windKnots} knots — <span style="color:${w.delayRisk === 'High' ? 'var(--danger-500)' : 'var(--accent-600)'}">${w.delayRisk} delay risk</span></div>
          </div>
        `);
    return alerts.length ? alerts.join('') : '<div style="font-size:var(--fs-sm);color:var(--text-tertiary)">No weather alerts</div>';
}

export function renderLogistics() {
    const state = store.get() || {};
    const allShipments = [...baseShipments, ...(state.customShipments || [])];
    const activeCount = allShipments.filter(s => getShipmentStatus(s.id, s.status) === 'In Transit' || s.status === 'Loading').length;
    const deliveredCount = allShipments.filter(s => getProgress(s.id, s.progress) >= 100).length;
    const delayedCount = allShipments.filter(s => s.status === 'Delayed').length;
    const totalCarbon = allShipments.reduce((acc, s) => acc + s.carbon, 0).toFixed(1);

    return `
    ${getLiveIndicatorStyles()}
    <style>
      .route-track { position:relative;height:60px;background:var(--neutral-50);border-radius:12px;overflow:hidden;margin-top:8px; }
      .route-line { position:absolute;top:50%;left:5%;right:5%;height:2px;background:linear-gradient(90deg,var(--primary-400),var(--primary-600));transform:translateY(-50%); }
      .route-dot { position:absolute;top:50%;width:12px;height:12px;border-radius:50%;background:var(--primary-500);transform:translate(-50%,-50%);box-shadow:0 0 0 3px rgba(16,185,129,0.3);transition:left 2s ease; }
      .eta-badge { font-variant-numeric:tabular-nums; }
    </style>
    <div class="page-header">
      <div>
        <h1 style="font-size:var(--fs-2xl)">Logistics & Shipments</h1>
        <p style="font-size:var(--fs-sm);color:var(--text-tertiary)">Track shipments and optimize transport emissions in real-time.</p>
      </div>
      <div style="display:flex;gap:var(--space-2);align-items:center">
        ${renderLiveIndicator('Tracking')}
        <button class="btn btn-primary btn-sm" id="addShipmentBtn">+ New Shipment</button>
      </div>
    </div>
    <div class="page-body">
      <div class="grid grid-4" style="margin-bottom:var(--space-6)">
        <div class="card stat-card animate-fade-in-up">
          <div class="stat-icon" style="background:#eff6ff;color:#2563eb">🚛</div>
          <div class="stat-value" style="color:#2563eb">${allShipments.length}</div>
          <div class="stat-label">Total Shipments</div>
        </div>
        <div class="card stat-card animate-fade-in-up stagger-1">
          <div class="stat-icon" style="background:#ecfdf5;color:#059669">��</div>
          <div class="stat-value" style="color:#059669" id="activeCount">${activeCount}</div>
          <div class="stat-label">Active / Loading</div>
        </div>
        <div class="card stat-card animate-fade-in-up stagger-2">
          <div class="stat-icon" style="background:#ecfdf5;color:#059669">✅</div>
          <div class="stat-value" style="color:#059669" id="deliveredCount">${deliveredCount}</div>
          <div class="stat-label">Delivered</div>
        </div>
        <div class="card stat-card animate-fade-in-up stagger-3">
          <div class="stat-icon" style="background:#fef2f2;color:#dc2626">🌍</div>
          <div class="stat-value" style="color:#dc2626">${totalCarbon}</div>
          <div class="stat-label">Total tCO₂e</div>
        </div>
      </div>

      <div class="grid grid-2" style="margin-bottom:var(--space-6)">
        <div class="card chart-container animate-fade-in-up stagger-2">
          <h3>🚛 Transport Mode Distribution</h3>
          <div class="chart-wrapper" style="height:260px;display:flex;align-items:center;justify-content:center">
            <canvas id="transportDonut"></canvas>
          </div>
        </div>

        <div class="card animate-fade-in-up stagger-3" style="padding:var(--space-6)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4)">
            <h3 style="font-size:var(--fs-md)">🗺️ Supply Chain Network</h3>
            <button class="btn btn-secondary btn-sm" id="optimizeRoutesBtn">🔀 Optimize Routes</button>
          </div>
          <div class="map-placeholder" style="height:160px;position:relative;border-radius:12px;overflow:hidden;background:var(--neutral-50)">
            <svg viewBox="0 0 600 200" style="width:100%;height:100%;opacity:0.2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 100 Q150 40 250 80 T450 70 T570 100" stroke="#059669" stroke-width="2" fill="none"/>
              <path d="M80 130 Q200 100 350 110 T550 90" stroke="#0d9488" stroke-width="2" fill="none" stroke-dasharray="4"/>
              <circle cx="60" cy="100" r="5" fill="#059669"/><circle cx="250" cy="80" r="6" fill="#059669"/>
              <circle cx="450" cy="70" r="8" fill="#0d9488"/><circle cx="570" cy="100" r="5" fill="#059669"/>
              <circle cx="350" cy="110" r="5" fill="#14b8a6"/>
            </svg>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
              <div style="text-align:center">
                <div style="font-size:28px;margin-bottom:4px">🗺️</div>
                <p style="font-size:var(--fs-xs);color:var(--text-tertiary)">${activeCount} active routes — animated tracking</p>
              </div>
            </div>
            <!-- Moving dots for active shipments -->
            <div id="routeDots" style="position:absolute;inset:0;pointer-events:none">
              ${baseShipments.filter(s => s.status === 'In Transit').slice(0, 4).map((s, i) => `
                <div style="position:absolute;width:10px;height:10px;border-radius:50%;background:var(--primary-500);box-shadow:0 0 0 3px rgba(16,185,129,0.3);
                  top:${25 + i * 15}%;left:${5 + getProgress(s.id, s.progress) * 0.9}%;transform:translate(-50%,-50%);transition:left 2s ease"
                  id="route-dot-${s.id}"></div>
              `).join('')}
            </div>
          </div>

          <!-- Weather Alerts -->
          <div style="margin-top:var(--space-4)">
            <h4 style="font-size:var(--fs-sm);font-weight:var(--fw-semibold);margin-bottom:var(--space-2)">🌤️ Weather Conditions</h4>
            <div style="display:grid;gap:6px">
              ${renderWeatherAlerts()}
            </div>
          </div>
        </div>
      </div>

      <div class="card animate-fade-in-up stagger-4">
        <div style="padding:var(--space-6) var(--space-6) 0;display:flex;justify-content:space-between;align-items:center">
          <h3 style="font-size:var(--fs-md)">📦 Live Shipment Tracker</h3>
          ${renderLiveIndicator()}
        </div>
        <div class="table-wrapper" style="border:none;border-radius:0">
          <table>
            <thead>
              <tr>
                <th>Shipment ID</th><th>Supplier</th><th>Route</th>
                <th>Mode</th><th>Status</th><th>Progress</th>
                <th>Carbon (tCO₂e)</th><th class="eta-badge">ETA / Status</th>
              </tr>
            </thead>
            <tbody id="shipmentTableBody">
              ${renderShipmentRows(allShipments)}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Shipment Modal -->
    <div class="modal-overlay" id="addShipmentModal" style="display:none">
      <div class="modal" style="max-width:500px">
        <div class="modal-header">
          <h2>New Shipment</h2>
          <button class="modal-close" id="closeShipmentModal">✕</button>
        </div>
        <div style="padding:var(--space-6)">
          <form id="addShipmentForm" style="display:grid;gap:var(--space-4)">
            <div class="grid grid-2">
              <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:4px">Origin *</label>
                <input class="input" id="shipOrigin" placeholder="e.g. Hamburg, DE" required /></div>
              <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:4px">Destination *</label>
                <input class="input" id="shipDest" placeholder="e.g. Rotterdam, NL" required /></div>
            </div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:4px">Transport Mode</label>
              <select class="select" id="shipMode" style="width:100%">
                <option>Electric Truck</option><option>Rail</option><option>Sea</option><option>Air</option><option>Hydrogen Truck</option>
              </select>
            </div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:4px">Supplier</label>
              <input class="input" id="shipSupplier" placeholder="Supplier name" /></div>
            <button class="btn btn-primary" type="submit">Create Shipment</button>
          </form>
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

    // Live progress updates
    _progressInterval = setInterval(() => {
        const s = store.get();
        if (!s?.shipmentProgress) return;
        const allShipments = [...baseShipments, ...(s.customShipments || [])];
        allShipments.forEach(sh => {
            const p = getProgress(sh.id, sh.progress);
            const bar = document.getElementById(`prog-${sh.id}`);
            const pct = document.getElementById(`prog-pct-${sh.id}`);
            const etaEl = document.getElementById(`eta-${sh.id}`);
            if (bar) bar.style.width = `${p}%`;
            if (pct) pct.textContent = `${p.toFixed(0)}%`;
            if (etaEl) etaEl.textContent = calcETA(sh.eta, sh.id);
            // Update route dot
            const dot = document.getElementById(`route-dot-${sh.id}`);
            if (dot) dot.style.left = `${5 + p * 0.9}%`;
        });
    }, 5000);

    // ETA countdown
    _etaInterval = setInterval(() => {
        const allShipments = [...baseShipments, ...(store.get()?.customShipments || [])];
        allShipments.forEach(sh => {
            const etaEl = document.getElementById(`eta-${sh.id}`);
            if (etaEl) etaEl.textContent = calcETA(sh.eta, sh.id);
        });
    }, 60000);

    // Route optimization
    document.getElementById('optimizeRoutesBtn')?.addEventListener('click', () => {
        const btn = document.getElementById('optimizeRoutesBtn');
        if (btn) { btn.textContent = '⏳ Optimizing...'; btn.disabled = true; }
        setTimeout(() => {
            const savings = (Math.random() * 3 + 1.5).toFixed(1);
            if (btn) { btn.textContent = '🔀 Optimize Routes'; btn.disabled = false; }
            showToast(`Routes optimized! Saved ${savings} tCO₂e on this run`, 'success');
        }, 2000);
    });

    // Add shipment modal
    const addBtn = document.getElementById('addShipmentBtn');
    const modal = document.getElementById('addShipmentModal');
    const closeBtn = document.getElementById('closeShipmentModal');
    const form = document.getElementById('addShipmentForm');

    addBtn?.addEventListener('click', () => { if (modal) modal.style.display = 'flex'; });
    closeBtn?.addEventListener('click', () => { if (modal) modal.style.display = 'none'; });
    modal?.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    const carbonFactors = { 'Electric Truck': 0.05, 'Rail': 0.028, 'Sea': 0.008, 'Air': 0.602, 'Hydrogen Truck': 0.035 };
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const origin = document.getElementById('shipOrigin')?.value?.trim();
        const dest = document.getElementById('shipDest')?.value?.trim();
        const mode = document.getElementById('shipMode')?.value || 'Rail';
        const supplier = document.getElementById('shipSupplier')?.value?.trim() || 'Unknown';
        if (!origin || !dest) { showToast('Origin and destination required', 'error'); return; }

        const newShipment = {
            id: `SHP-${2857 + Math.floor(Math.random() * 100)}`,
            origin, destination: dest, mode, supplier,
            status: 'Loading', progress: 0,
            carbon: parseFloat((carbonFactors[mode] * 800 * 10 / 1000).toFixed(1)),
            eta: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        };

        store.update(s => {
            if (!s.customShipments) s.customShipments = [];
            s.customShipments.push(newShipment);
            s.shipmentProgress[newShipment.id] = 0;
        });

        if (modal) modal.style.display = 'none';
        form.reset();
        // Refresh table
        const tbody = document.getElementById('shipmentTableBody');
        if (tbody) {
            const allShipments = [...baseShipments, ...(store.get()?.customShipments || [])];
            tbody.innerHTML = renderShipmentRows(allShipments);
        }
        showToast(`Shipment ${newShipment.id} created!`, 'success');
    });
}

export function cleanupLogistics() {
    if (_etaInterval) { clearInterval(_etaInterval); _etaInterval = null; }
    if (_progressInterval) { clearInterval(_progressInterval); _progressInterval = null; }
}
