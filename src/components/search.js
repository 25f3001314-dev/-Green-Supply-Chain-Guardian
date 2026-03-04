// ============================================
// GLOBAL SEARCH — Cmd+K / Ctrl+K overlay
// ============================================
import { suppliers } from '../data/mockData.js';
import { store } from '../data/simulationEngine.js';

const pages = [
    { label: 'Dashboard', page: 'dashboard', icon: '📊' },
    { label: 'Suppliers', page: 'suppliers', icon: '👥' },
    { label: 'Carbon Tracking', page: 'emissions', icon: '📉' },
    { label: 'Logistics', page: 'logistics', icon: '🚛' },
    { label: 'Reports & Compliance', page: 'reports', icon: '📋' },
    { label: 'Settings', page: 'settings', icon: '⚙️' },
];

function buildIndex() {
    const state = store.get();
    const allSuppliers = [...suppliers, ...(state?.customSuppliers || [])];
    const results = [
        ...pages.map(p => ({ ...p, type: 'page' })),
        ...allSuppliers.map(s => ({ label: s.name, desc: `${s.location} • ${s.category} • ESG ${s.esg}`, page: 'suppliers', type: 'supplier', icon: '🏢' })),
    ];
    return results;
}

export function initGlobalSearch() {
    if (document.getElementById('globalSearchOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'globalSearchOverlay';
    overlay.innerHTML = `
      <div class="gsearch-backdrop" id="gsearchBackdrop"></div>
      <div class="gsearch-box" role="dialog" aria-label="Global search">
        <div class="gsearch-input-wrap">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" id="gsearchInput" class="gsearch-input" placeholder="Search pages, suppliers, shipments..." autocomplete="off" />
          <kbd class="gsearch-kbd">ESC</kbd>
        </div>
        <div class="gsearch-results" id="gsearchResults"></div>
      </div>
      <style>
        #globalSearchOverlay { position: fixed; inset: 0; z-index: 2000; display: none; align-items: flex-start; justify-content: center; padding-top: 15vh; }
        #globalSearchOverlay.open { display: flex; }
        .gsearch-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); }
        .gsearch-box { position: relative; z-index: 1; width: 100%; max-width: 560px; background: var(--bg-secondary); border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); border: 1px solid var(--border-light); overflow: hidden; animation: gsearchIn 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes gsearchIn { from { opacity: 0; transform: scale(0.94) translateY(-10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .gsearch-input-wrap { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-light); }
        .gsearch-input { flex: 1; border: none; background: transparent; font-size: var(--fs-md); color: var(--text-primary); outline: none; }
        .gsearch-kbd { font-size: 11px; background: var(--neutral-100); border: 1px solid var(--border-light); border-radius: 5px; padding: 2px 6px; color: var(--text-tertiary); font-family: monospace; }
        .gsearch-results { max-height: 360px; overflow-y: auto; padding: 0.5rem 0; }
        .gsearch-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 1.25rem; cursor: pointer; transition: background var(--transition-fast); border-radius: 0; }
        .gsearch-item:hover, .gsearch-item.active { background: var(--primary-50); }
        .gsearch-item-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--neutral-100); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
        .gsearch-item-label { font-size: var(--fs-sm); font-weight: var(--fw-medium); color: var(--text-primary); }
        .gsearch-item-desc { font-size: var(--fs-xs); color: var(--text-tertiary); }
        .gsearch-section { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; color: var(--text-tertiary); padding: 0.5rem 1.25rem 0.25rem; text-transform: uppercase; }
        .gsearch-empty { text-align: center; padding: 2rem; color: var(--text-tertiary); font-size: var(--fs-sm); }
      </style>
    `;
    document.body.appendChild(overlay);

    const input = document.getElementById('gsearchInput');
    const results = document.getElementById('gsearchResults');
    const backdrop = document.getElementById('gsearchBackdrop');

    let activeIdx = -1;
    let currentItems = [];

    function show() {
        overlay.classList.add('open');
        input?.focus();
        renderResults('');
    }

    function hide() {
        overlay.classList.remove('open');
        if (input) input.value = '';
        activeIdx = -1;
    }

    function renderResults(query) {
        const q = query.toLowerCase().trim();
        const index = buildIndex();
        const filtered = q ? index.filter(r => r.label.toLowerCase().includes(q) || (r.desc || '').toLowerCase().includes(q)) : index.slice(0, 12);
        currentItems = filtered;

        if (!filtered.length) {
            results.innerHTML = `<div class="gsearch-empty">No results for "${query}"</div>`;
            return;
        }

        const pages = filtered.filter(r => r.type === 'page');
        const supps = filtered.filter(r => r.type === 'supplier');

        let html = '';
        if (pages.length) {
            html += `<div class="gsearch-section">Pages</div>`;
            html += pages.map((r, i) => `
              <div class="gsearch-item" data-idx="${i}" data-page="${r.page}">
                <div class="gsearch-item-icon">${r.icon}</div>
                <div><div class="gsearch-item-label">${r.label}</div></div>
              </div>
            `).join('');
        }
        if (supps.length) {
            const offset = pages.length;
            html += `<div class="gsearch-section">Suppliers</div>`;
            html += supps.map((r, i) => `
              <div class="gsearch-item" data-idx="${offset + i}" data-page="${r.page}">
                <div class="gsearch-item-icon">${r.icon}</div>
                <div>
                  <div class="gsearch-item-label">${r.label}</div>
                  <div class="gsearch-item-desc">${r.desc || ''}</div>
                </div>
              </div>
            `).join('');
        }
        results.innerHTML = html;

        results.querySelectorAll('.gsearch-item').forEach(el => {
            el.addEventListener('click', () => {
                location.hash = el.dataset.page;
                hide();
            });
        });
    }

    input?.addEventListener('input', (e) => {
        activeIdx = -1;
        renderResults(e.target.value);
    });

    input?.addEventListener('keydown', (e) => {
        const items = results.querySelectorAll('.gsearch-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIdx = Math.min(activeIdx + 1, items.length - 1);
            items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIdx = Math.max(activeIdx - 1, 0);
            items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
        } else if (e.key === 'Enter') {
            const active = results.querySelector('.gsearch-item.active');
            if (active) { location.hash = active.dataset.page; hide(); }
        } else if (e.key === 'Escape') {
            hide();
        }
    });

    backdrop?.addEventListener('click', hide);

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            overlay.classList.contains('open') ? hide() : show();
        }
    });

    // Number shortcuts for pages (1-6)
    document.addEventListener('keydown', (e) => {
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
        const pageMap = { '1': 'dashboard', '2': 'suppliers', '3': 'emissions', '4': 'logistics', '5': 'reports', '6': 'settings' };
        if (pageMap[e.key] && !e.ctrlKey && !e.metaKey && !e.altKey) {
            location.hash = pageMap[e.key];
        }
    });
}
