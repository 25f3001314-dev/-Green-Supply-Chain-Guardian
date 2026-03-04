// ============================================
// SUPPLIERS PAGE — Full interactivity
// ============================================
import { suppliers as baseSuppliers, supplierESGHistory } from '../data/mockData.js';
import { store, driftSupplierESG, formatRelativeTime } from '../data/simulationEngine.js';
import { showToast } from '../components/toast.js';
import { renderSparkline, drawSparkline } from '../components/sparkline.js';
import { launchConfetti } from '../components/confetti.js';

let _esgDriftInterval = null;
let _esgRefreshFn = null;
let _sortKey = 'esg';
let _sortDir = -1;
let _selectedIds = new Set();
let _compareMode = false;

function getAllSuppliers() {
    const state = store.get();
    return [...baseSuppliers, ...(state?.customSuppliers || [])];
}

function getLiveESG(supplierId, baseEsg) {
    const state = store.get();
    return state?.supplierESG?.[supplierId] ?? baseEsg;
}

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

function sortSuppliers(list) {
    return [...list].sort((a, b) => {
        let aVal = a[_sortKey] ?? 0;
        let bVal = b[_sortKey] ?? 0;
        if (_sortKey === 'esg') {
            aVal = getLiveESG(a.id, a.esg);
            bVal = getLiveESG(b.id, b.esg);
        }
        if (_sortKey === 'lastAudit') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
        }
        if (typeof aVal === 'string') return aVal.localeCompare(bVal) * _sortDir;
        return (aVal - bVal) * _sortDir;
    });
}

function renderSupplierRow(s, i) {
    const esg = getLiveESG(s.id, s.esg);
    const history = supplierESGHistory[s.id] || [esg, esg, esg, esg, esg, esg];
    const isSelected = _selectedIds.has(s.id);
    return `
    <tr class="supplier-row ${isSelected ? 'row-selected' : ''}" data-id="${s.id}">
      <td><input type="checkbox" class="supplier-checkbox" data-id="${s.id}" ${isSelected ? 'checked' : ''} style="accent-color:var(--primary-500)"></td>
      <td>
        <div style="font-weight:var(--fw-semibold);color:var(--text-primary)">${s.name}</div>
        <div style="font-size:var(--fs-xs);color:var(--text-tertiary)">📍 ${s.location}</div>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-weight:var(--fw-bold);color:${getESGColor(esg)};font-size:var(--fs-md)">${esg.toFixed(1)}</span>
          ${renderSparkline(`esg-${s.id}`, 70, 24)}
        </div>
        <div style="height:4px;background:var(--neutral-100);border-radius:2px;margin-top:4px;width:100px">
          <div style="height:100%;border-radius:2px;background:${getESGColor(esg)};width:${esg}%;transition:width 0.5s"></div>
        </div>
      </td>
      <td><span class="badge ${getRiskClass(s.risk)}">${s.risk}</span></td>
      <td style="font-size:var(--fs-sm)">${s.category}</td>
      <td style="font-size:var(--fs-sm)">${s.carbonIntensity} tCO₂e/unit</td>
      <td style="font-size:var(--fs-sm)">${new Date(s.lastAudit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
      <td><span class="badge ${s.status === 'Active' ? 'badge-success' : s.status === 'Flagged' ? 'badge-danger' : 'badge-warning'}">${s.status}</span></td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-ghost btn-sm audit-btn" data-id="${s.id}" data-name="${s.name}" title="Request Audit">🔍 Audit</button>
          <button class="btn btn-ghost btn-sm delete-btn" data-id="${s.id}" data-name="${s.name}" title="Archive" style="color:var(--danger-500)">🗑</button>
        </div>
      </td>
    </tr>`;
}

function renderComparePanel() {
    if (!_compareMode || _selectedIds.size < 2) return '';
    const all = getAllSuppliers();
    const selected = all.filter(s => _selectedIds.has(s.id)).slice(0, 3);
    return `
    <div class="card animate-fade-in-up" style="margin-bottom:var(--space-6);padding:var(--space-6)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4)">
        <h3 style="font-size:var(--fs-md)">⚖️ Supplier Comparison</h3>
        <button class="btn btn-ghost btn-sm" id="closeCompare">Close</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(${selected.length},1fr);gap:var(--space-4)">
        ${selected.map(s => {
            const esg = getLiveESG(s.id, s.esg);
            return `
          <div style="border:1px solid var(--border-light);border-radius:var(--radius-md);padding:var(--space-4)">
            <div style="font-weight:var(--fw-semibold);font-size:var(--fs-md);margin-bottom:var(--space-3)">${s.name}</div>
            <div style="display:grid;gap:8px;font-size:var(--fs-sm)">
              <div style="display:flex;justify-content:space-between"><span style="color:var(--text-tertiary)">ESG Score</span><span style="font-weight:600;color:${getESGColor(esg)}">${esg.toFixed(1)}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:var(--text-tertiary)">Risk</span><span class="badge ${getRiskClass(s.risk)}">${s.risk}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:var(--text-tertiary)">Carbon Intensity</span><span>${s.carbonIntensity}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:var(--text-tertiary)">Status</span><span>${s.status}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:var(--text-tertiary)">Location</span><span style="font-size:var(--fs-xs)">${s.location}</span></div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

function renderSuppliersTable(filtered) {
    const sorted = sortSuppliers(filtered);
    const thStyle = 'cursor:pointer;user-select:none;white-space:nowrap';
    function sortIcon(key) {
        if (_sortKey !== key) return '<span style="opacity:0.3">↕</span>';
        return _sortDir === 1 ? '↑' : '↓';
    }
    return `
    <div class="table-wrapper" style="border:none">
      <table id="supplierTable">
        <thead>
          <tr>
            <th style="width:36px"><input type="checkbox" id="selectAllCb" style="accent-color:var(--primary-500)"></th>
            <th class="sort-th" data-sort="name" style="${thStyle}">Supplier ${sortIcon('name')}</th>
            <th class="sort-th" data-sort="esg" style="${thStyle}">ESG Score ${sortIcon('esg')}</th>
            <th class="sort-th" data-sort="risk" style="${thStyle}">Risk ${sortIcon('risk')}</th>
            <th class="sort-th" data-sort="category" style="${thStyle}">Category ${sortIcon('category')}</th>
            <th class="sort-th" data-sort="carbonIntensity" style="${thStyle}">Carbon Intensity ${sortIcon('carbonIntensity')}</th>
            <th class="sort-th" data-sort="lastAudit" style="${thStyle}">Last Audit ${sortIcon('lastAudit')}</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map((s, i) => renderSupplierRow(s, i)).join('')}
        </tbody>
      </table>
    </div>`;
}

export function renderSuppliers() {
    const allSuppliers = getAllSuppliers();
    const categories = [...new Set(allSuppliers.map(s => s.category))].sort();

    return `
    <style>
      .row-selected { background: var(--primary-50) !important; }
      .sort-th:hover { background: var(--neutral-50); }
      .audit-spinner { animation: spin 0.8s linear infinite; display:inline-block; }
      @keyframes spin { to { transform:rotate(360deg); } }
    </style>
    <div class="page-header">
      <div>
        <h1 style="font-size:var(--fs-2xl)">Supplier Management</h1>
        <p style="font-size:var(--fs-sm);color:var(--text-tertiary)">Monitor and manage <span id="totalCount">${allSuppliers.length}</span> suppliers across your supply chain.</p>
      </div>
      <div style="display:flex;gap:var(--space-2)">
        <button class="btn btn-secondary btn-sm" id="compareBtn">⚖️ Compare</button>
        <button class="btn btn-secondary btn-sm" id="bulkExportBtn">📥 Export</button>
        <button class="btn btn-primary btn-sm" id="addSupplierBtn">+ Add Supplier</button>
      </div>
    </div>
    <div class="page-body">
      ${renderComparePanel()}

      <!-- Bulk action bar -->
      <div id="bulkBar" style="display:none;margin-bottom:var(--space-4)">
        <div class="card" style="padding:var(--space-3) var(--space-4);display:flex;gap:var(--space-3);align-items:center;background:var(--primary-50);border-color:var(--primary-200)">
          <span style="font-size:var(--fs-sm);font-weight:var(--fw-semibold)" id="bulkCount">0 selected</span>
          <button class="btn btn-secondary btn-sm" id="bulkActive">Set Active</button>
          <button class="btn btn-secondary btn-sm" id="bulkReview">Set Under Review</button>
          <button class="btn btn-ghost btn-sm" style="color:var(--danger-500)" id="bulkDelete">Archive Selected</button>
          <button class="btn btn-ghost btn-sm" style="margin-left:auto" id="clearSelection">Clear</button>
        </div>
      </div>

      <div class="filter-bar card" style="padding:var(--space-4);margin-bottom:var(--space-4);display:flex;gap:var(--space-3);flex-wrap:wrap;align-items:center">
        <input type="text" class="input" id="supplierSearch" placeholder="🔍 Search suppliers..." style="max-width:240px" />
        <select class="select" id="categoryFilter">
          <option value="">All Categories</option>
          ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <select class="select" id="riskFilter">
          <option value="">All Risk Levels</option>
          <option value="Low">Low</option><option value="Medium">Medium</option>
          <option value="High">High</option><option value="Critical">Critical</option>
        </select>
        <select class="select" id="statusFilter">
          <option value="">All Statuses</option>
          <option value="Active">Active</option><option value="Under Review">Under Review</option>
          <option value="Flagged">Flagged</option>
        </select>
        <div style="margin-left:auto;display:flex;gap:var(--space-2);align-items:center">
          <span class="badge badge-success" id="supplierCount">${allSuppliers.length} suppliers</span>
        </div>
      </div>

      <div class="card animate-fade-in-up">
        <div id="supplierTableWrap">
          ${renderSuppliersTable(allSuppliers)}
        </div>
      </div>
    </div>

    <!-- Add Supplier Modal -->
    <div class="modal-overlay" id="addSupplierModal" style="display:none">
      <div class="modal" style="max-width:500px">
        <div class="modal-header">
          <h2>Add New Supplier</h2>
          <button class="modal-close" id="closeSupplierModal">✕</button>
        </div>
        <div style="padding:var(--space-6)">
          <form id="addSupplierForm" style="display:grid;gap:var(--space-4)">
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Company Name *</label>
              <input class="input" id="newSupplierName" placeholder="e.g. EcoTech Manufacturing" required />
            </div>
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Location *</label>
              <input class="input" id="newSupplierLocation" placeholder="e.g. Berlin, Germany" required />
            </div>
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Category</label>
              <select class="select" id="newSupplierCategory" style="width:100%">
                ${categories.map(c => `<option>${c}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Contact Email</label>
              <input class="input" id="newSupplierEmail" type="email" placeholder="contact@company.com" />
            </div>
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Initial ESG Estimate</label>
              <input class="input" id="newSupplierESG" type="number" min="40" max="100" value="75" />
            </div>
            <button class="btn btn-primary" type="submit" id="addSupplierSubmit" style="width:100%">Add Supplier</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div class="modal-overlay" id="deleteModal" style="display:none">
      <div class="modal" style="max-width:400px;text-align:center">
        <div style="padding:var(--space-8)">
          <div style="font-size:48px;margin-bottom:var(--space-4)">🗑️</div>
          <h2 style="margin-bottom:var(--space-2)">Archive Supplier?</h2>
          <p style="color:var(--text-tertiary);font-size:var(--fs-sm);margin-bottom:var(--space-6)" id="deleteModalName">This supplier will be archived.</p>
          <div style="display:flex;gap:var(--space-3);justify-content:center">
            <button class="btn btn-secondary" id="cancelDelete">Cancel</button>
            <button class="btn btn-primary" style="background:var(--danger-500);box-shadow:none" id="confirmDelete">Archive</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSuppliers() {
    const searchInput = document.getElementById('supplierSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const riskFilter = document.getElementById('riskFilter');
    const statusFilter = document.getElementById('statusFilter');
    const tableWrap = document.getElementById('supplierTableWrap');
    const countBadge = document.getElementById('supplierCount');
    const bulkBar = document.getElementById('bulkBar');
    const bulkCount = document.getElementById('bulkCount');

    function getFiltered() {
        const search = (searchInput?.value || '').toLowerCase();
        const cat = categoryFilter?.value || '';
        const risk = riskFilter?.value || '';
        const status = statusFilter?.value || '';
        return getAllSuppliers().filter(s => {
            const matchSearch = !search || s.name.toLowerCase().includes(search) || s.location.toLowerCase().includes(search) || s.category.toLowerCase().includes(search);
            const matchCat = !cat || s.category === cat;
            const matchRisk = !risk || s.risk === risk;
            const matchStatus = !status || s.status === status;
            return matchSearch && matchCat && matchRisk && matchStatus;
        });
    }

    function refresh() {
        const filtered = getFiltered();
        if (tableWrap) tableWrap.innerHTML = renderSuppliersTable(filtered);
        if (countBadge) countBadge.textContent = `${filtered.length} supplier${filtered.length !== 1 ? 's' : ''}`;
        // Draw sparklines
        filtered.forEach(s => {
            const hist = supplierESGHistory[s.id] || [];
            if (hist.length > 1) drawSparkline(`esg-${s.id}`, hist, getESGColor(getLiveESG(s.id, s.esg)));
        });
        bindTableHandlers();
        bindCheckboxes();
        updateTotalCount();
    }

    function updateTotalCount() {
        const el = document.getElementById('totalCount');
        if (el) el.textContent = getAllSuppliers().length;
    }

    function bindTableHandlers() {
        // Sort headers
        document.querySelectorAll('.sort-th').forEach(th => {
            th.addEventListener('click', () => {
                const key = th.dataset.sort;
                if (_sortKey === key) _sortDir *= -1;
                else { _sortKey = key; _sortDir = -1; }
                refresh();
            });
        });

        // Audit buttons
        document.querySelectorAll('.audit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                btn.innerHTML = '<span class="audit-spinner">⏳</span>';
                btn.disabled = true;
                setTimeout(() => {
                    btn.innerHTML = '🔍 Audit';
                    btn.disabled = false;
                    showToast(`Audit request sent to ${name}`, 'success');
                }, 1800);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const name = btn.dataset.name;
                const modal = document.getElementById('deleteModal');
                const modalName = document.getElementById('deleteModalName');
                if (modalName) modalName.textContent = `"${name}" will be archived and removed from active monitoring.`;
                if (modal) modal.style.display = 'flex';
                document.getElementById('confirmDelete')?.addEventListener('click', () => {
                    store.update(s => {
                        s.customSuppliers = (s.customSuppliers || []).filter(cs => cs.id !== id);
                    });
                    if (modal) modal.style.display = 'none';
                    showToast(`${name} archived`, 'info');
                    refresh();
                }, { once: true });
                document.getElementById('cancelDelete')?.addEventListener('click', () => {
                    if (modal) modal.style.display = 'none';
                }, { once: true });
            });
        });
    }

    function bindCheckboxes() {
        const selectAll = document.getElementById('selectAllCb');
        selectAll?.addEventListener('change', () => {
            const filtered = getFiltered();
            if (selectAll.checked) filtered.forEach(s => _selectedIds.add(s.id));
            else _selectedIds.clear();
            updateBulkBar();
            refresh();
        });

        document.querySelectorAll('.supplier-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                const id = parseInt(cb.dataset.id);
                if (cb.checked) _selectedIds.add(id);
                else _selectedIds.delete(id);
                updateBulkBar();
                const row = cb.closest('tr');
                row?.classList.toggle('row-selected', cb.checked);
            });
        });
    }

    function updateBulkBar() {
        if (!bulkBar || !bulkCount) return;
        if (_selectedIds.size > 0) {
            bulkBar.style.display = 'block';
            bulkCount.textContent = `${_selectedIds.size} selected`;
        } else {
            bulkBar.style.display = 'none';
        }
    }

    // Bulk actions
    document.getElementById('bulkActive')?.addEventListener('click', () => {
        showToast(`${_selectedIds.size} suppliers set to Active`, 'success');
        _selectedIds.clear();
        updateBulkBar();
        refresh();
    });
    document.getElementById('bulkReview')?.addEventListener('click', () => {
        showToast(`${_selectedIds.size} suppliers set to Under Review`, 'warning');
        _selectedIds.clear();
        updateBulkBar();
        refresh();
    });
    document.getElementById('bulkDelete')?.addEventListener('click', () => {
        const n = _selectedIds.size;
        store.update(s => {
            s.customSuppliers = (s.customSuppliers || []).filter(cs => !_selectedIds.has(cs.id));
        });
        _selectedIds.clear();
        updateBulkBar();
        refresh();
        showToast(`${n} supplier${n !== 1 ? 's' : ''} archived`, 'info');
    });
    document.getElementById('clearSelection')?.addEventListener('click', () => {
        _selectedIds.clear();
        updateBulkBar();
        refresh();
    });
    document.getElementById('bulkExportBtn')?.addEventListener('click', () => {
        const all = getAllSuppliers();
        const csvRows = [
            ['Name', 'Location', 'Category', 'ESG Score', 'Risk', 'Status', 'Carbon Intensity', 'Last Audit'],
            ...all.map(s => [s.name, s.location, s.category, getLiveESG(s.id, s.esg).toFixed(1), s.risk, s.status, s.carbonIntensity, s.lastAudit]),
        ];
        const csv = csvRows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'suppliers-export.csv'; a.click();
        URL.revokeObjectURL(url);
        showToast('Suppliers exported as CSV', 'success');
    });

    // Compare mode
    document.getElementById('compareBtn')?.addEventListener('click', () => {
        if (_selectedIds.size < 2) {
            showToast('Select 2-3 suppliers to compare', 'warning');
            return;
        }
        _compareMode = !_compareMode;
        const body = document.querySelector('.page-body');
        if (body) {
            // Re-render compare panel
            let compareDiv = document.getElementById('compareWrap');
            if (!compareDiv) {
                compareDiv = document.createElement('div');
                compareDiv.id = 'compareWrap';
                body.prepend(compareDiv);
            }
            compareDiv.innerHTML = _compareMode ? renderComparePanel() : '';
            document.getElementById('closeCompare')?.addEventListener('click', () => {
                _compareMode = false;
                compareDiv.innerHTML = '';
            });
        }
    });

    // Modal
    const addBtn = document.getElementById('addSupplierBtn');
    const modal = document.getElementById('addSupplierModal');
    const closeBtn = document.getElementById('closeSupplierModal');
    const form = document.getElementById('addSupplierForm');

    addBtn?.addEventListener('click', () => { if (modal) modal.style.display = 'flex'; });
    closeBtn?.addEventListener('click', () => { if (modal) modal.style.display = 'none'; });
    modal?.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
    document.getElementById('deleteModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'deleteModal') e.target.style.display = 'none';
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameEl = document.getElementById('newSupplierName');
        const locEl = document.getElementById('newSupplierLocation');
        const catEl = document.getElementById('newSupplierCategory');
        const emailEl = document.getElementById('newSupplierEmail');
        const esgEl = document.getElementById('newSupplierESG');

        const name = nameEl?.value?.trim();
        const location = locEl?.value?.trim();
        if (!name || !location) {
            showToast('Name and location are required', 'error');
            return;
        }

        const submitBtn = document.getElementById('addSupplierSubmit');
        if (submitBtn) { submitBtn.textContent = 'Adding...'; submitBtn.disabled = true; }

        setTimeout(() => {
            const newSupplier = {
                id: Date.now(),
                name,
                location,
                category: catEl?.value || 'Raw Materials',
                email: emailEl?.value || '',
                esg: parseInt(esgEl?.value || '75'),
                risk: 'Medium',
                certifications: [],
                status: 'Active',
                carbonIntensity: parseFloat((Math.random() * 50 + 10).toFixed(1)),
                lastAudit: new Date().toISOString().split('T')[0],
            };

            store.update(s => {
                if (!s.customSuppliers) s.customSuppliers = [];
                s.customSuppliers.push(newSupplier);
            });

            if (submitBtn) { submitBtn.textContent = 'Add Supplier'; submitBtn.disabled = false; }
            if (modal) modal.style.display = 'none';
            form.reset();
            document.getElementById('newSupplierESG').value = '75';

            refresh();
            showToast(`${name} added successfully!`, 'success');

            // Confetti if ESG > 85
            if (newSupplier.esg >= 85) {
                setTimeout(() => launchConfetti(3000), 200);
                setTimeout(() => showToast('🌿 High ESG supplier — sustainability milestone!', 'success'), 600);
            }
        }, 1000);
    });

    // ESG drift interval
    _esgDriftInterval = setInterval(() => {
        driftSupplierESG(getAllSuppliers());
        // Update ESG values in table without full re-render
        getAllSuppliers().forEach(s => {
            const esg = getLiveESG(s.id, s.esg);
            const row = document.querySelector(`tr[data-id="${s.id}"]`);
            if (row) {
                const scoreEl = row.querySelector('.esg-live-val');
                if (scoreEl) scoreEl.textContent = esg.toFixed(1);
            }
        });
    }, 8000);

    // Listen for global ESG events
    _esgRefreshFn = refresh;
    document.addEventListener('gscg:esg', refresh);
    document.addEventListener('toast', (e) => showToast(e.detail.msg, e.detail.type));

    // Initial render
    refresh();
}

export function cleanupSuppliers() {
    if (_esgDriftInterval) { clearInterval(_esgDriftInterval); _esgDriftInterval = null; }
    if (_esgRefreshFn) { document.removeEventListener('gscg:esg', _esgRefreshFn); _esgRefreshFn = null; }
}
