// ============================================
// SUPPLIERS PAGE
// ============================================
import { suppliers } from '../data/mockData.js';
import { showToast } from '../components/toast.js';

function getRiskClass(risk) {
    const map = { Low: 'badge-success', Medium: 'badge-warning', High: 'badge-danger', Critical: 'badge-danger' };
    return map[risk] || 'badge-neutral';
}

function getESGColor(score) {
    if (score >= 90) return '#059669';
    if (score >= 80) return '#0d9488';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
}

function renderSupplierCards(filtered) {
    return filtered.map((s, i) => `
    <div class="supplier-card card animate-fade-in-up" style="animation-delay:${i * 0.05}s">
      <div class="supplier-card-header">
        <div>
          <h3 class="supplier-name">${s.name}</h3>
          <span class="supplier-location">📍 ${s.location}</span>
        </div>
        <span class="badge ${getRiskClass(s.risk)}">${s.risk} Risk</span>
      </div>
      <div class="supplier-esg">
        <div class="esg-ring" style="--esg-pct:${s.esg * 3.6}deg;--esg-color:${getESGColor(s.esg)}">
          <span class="esg-value">${s.esg}</span>
        </div>
        <div class="esg-details">
          <span class="esg-label">ESG Score</span>
          <div class="esg-bar-track">
            <div class="esg-bar-fill" style="width:${s.esg}%;background:${getESGColor(s.esg)}"></div>
          </div>
        </div>
      </div>
      <div class="supplier-meta">
        <div class="supplier-meta-item">
          <span class="meta-label">Category</span>
          <span class="meta-value">${s.category}</span>
        </div>
        <div class="supplier-meta-item">
          <span class="meta-label">Carbon Intensity</span>
          <span class="meta-value">${s.carbonIntensity} tCO₂e/unit</span>
        </div>
        <div class="supplier-meta-item">
          <span class="meta-label">Last Audit</span>
          <span class="meta-value">${new Date(s.lastAudit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      <div class="supplier-certs">
        ${s.certifications.map(c => `<span class="badge badge-success">${c}</span>`).join('')}
      </div>
      <div class="supplier-actions">
        <button class="btn btn-secondary btn-sm" onclick="document.dispatchEvent(new CustomEvent('toast',{detail:{msg:'Opening ${s.name} profile...', type:'info'}}))">View Details</button>
        <button class="btn btn-ghost btn-sm" onclick="document.dispatchEvent(new CustomEvent('toast',{detail:{msg:'Audit scheduled for ${s.name}', type:'success'}}))">Schedule Audit</button>
      </div>
    </div>
  `).join('');
}

export function renderSuppliers() {
    const categories = [...new Set(suppliers.map(s => s.category))];

    return `
    <div class="page-header">
      <div>
        <h1 style="font-size:var(--fs-2xl)">Supplier Management</h1>
        <p style="font-size:var(--fs-sm);color:var(--text-tertiary)">Monitor and manage ${suppliers.length} suppliers across your supply chain.</p>
      </div>
      <button class="btn btn-primary btn-sm" id="addSupplierBtn">+ Add Supplier</button>
    </div>
    <div class="page-body">
      <div class="filter-bar card" style="padding:var(--space-4);margin-bottom:var(--space-6);display:flex;gap:var(--space-3);flex-wrap:wrap;align-items:center">
        <input type="text" class="input" id="supplierSearch" placeholder="Search suppliers..." style="max-width:280px" />
        <select class="select" id="categoryFilter">
          <option value="">All Categories</option>
          ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <select class="select" id="riskFilter">
          <option value="">All Risk Levels</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <div style="margin-left:auto;display:flex;gap:var(--space-2);align-items:center">
          <span class="badge badge-success" id="supplierCount">${suppliers.length} suppliers</span>
        </div>
      </div>
      <div class="grid grid-auto" id="supplierGrid">
        ${renderSupplierCards(suppliers)}
      </div>
    </div>

    <!-- Add Supplier Modal -->
    <div class="modal-overlay" id="addSupplierModal" style="display:none">
      <div class="modal">
        <div class="modal-header">
          <h2>Add New Supplier</h2>
          <button class="modal-close" id="closeSupplierModal">✕</button>
        </div>
        <form class="add-supplier-form" id="addSupplierForm">
          <div style="display:grid;gap:var(--space-4)">
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Company Name</label><input class="input" placeholder="e.g. EcoTech Manufacturing" required /></div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Location</label><input class="input" placeholder="e.g. Berlin, Germany" required /></div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Category</label>
              <select class="select" style="width:100%">
                ${categories.map(c => `<option>${c}</option>`).join('')}
              </select>
            </div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Contact Email</label><input class="input" type="email" placeholder="contact@company.com" /></div>
            <button class="btn btn-primary" type="submit" style="width:100%;margin-top:var(--space-2)">Add Supplier</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function initSuppliers() {
    const searchInput = document.getElementById('supplierSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const riskFilter = document.getElementById('riskFilter');
    const grid = document.getElementById('supplierGrid');
    const countBadge = document.getElementById('supplierCount');
    const addBtn = document.getElementById('addSupplierBtn');
    const modal = document.getElementById('addSupplierModal');
    const closeBtn = document.getElementById('closeSupplierModal');
    const form = document.getElementById('addSupplierForm');

    function filterSuppliers() {
        const search = searchInput?.value?.toLowerCase() || '';
        const cat = categoryFilter?.value || '';
        const risk = riskFilter?.value || '';

        const filtered = suppliers.filter(s => {
            const matchSearch = s.name.toLowerCase().includes(search) || s.location.toLowerCase().includes(search);
            const matchCat = !cat || s.category === cat;
            const matchRisk = !risk || s.risk === risk;
            return matchSearch && matchCat && matchRisk;
        });

        if (grid) grid.innerHTML = renderSupplierCards(filtered);
        if (countBadge) countBadge.textContent = `${filtered.length} supplier${filtered.length !== 1 ? 's' : ''}`;
    }

    searchInput?.addEventListener('input', filterSuppliers);
    categoryFilter?.addEventListener('change', filterSuppliers);
    riskFilter?.addEventListener('change', filterSuppliers);

    addBtn?.addEventListener('click', () => { if (modal) modal.style.display = 'flex'; });
    closeBtn?.addEventListener('click', () => { if (modal) modal.style.display = 'none'; });
    modal?.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Supplier added successfully! (Demo)', 'success');
        if (modal) modal.style.display = 'none';
    });

    document.addEventListener('toast', (e) => showToast(e.detail.msg, e.detail.type));
}
