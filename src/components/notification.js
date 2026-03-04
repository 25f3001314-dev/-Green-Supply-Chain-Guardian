// ============================================
// NOTIFICATION CENTER — Slide-in panel
// ============================================
import { store, formatRelativeTime } from '../data/simulationEngine.js';
import { showToast } from './toast.js';

function typeColor(type) {
    const map = { alert: '#ef4444', success: '#10b981', warning: '#f59e0b', info: '#3b82f6' };
    return map[type] || '#64748b';
}

export function renderNotificationPanel() {
    return `
    <div class="notif-panel" id="notifPanel" aria-label="Notification center">
      <div class="notif-panel-header">
        <h3>🔔 Notifications</h3>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn btn-ghost btn-sm" id="markAllRead">Mark all read</button>
          <button class="btn btn-ghost btn-sm" id="closeNotifPanel" aria-label="Close">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
      <div class="notif-panel-body" id="notifPanelBody">
        ${renderNotifItems()}
      </div>
    </div>
    <div class="notif-overlay" id="notifOverlay"></div>
  `;
}

function renderNotifItems() {
    const state = store.get();
    const items = state?.activityFeed?.slice(0, 15) || [];
    if (!items.length) return '<div style="text-align:center;padding:2rem;color:var(--text-tertiary)">No notifications</div>';
    return items.map(a => `
      <div class="notif-item notif-${a.type}">
        <span class="notif-icon" style="background:${typeColor(a.type)}22;color:${typeColor(a.type)}">${a.icon}</span>
        <div class="notif-content">
          <p class="notif-msg">${a.message}</p>
          <span class="notif-time">${formatRelativeTime(a.time)}</span>
        </div>
      </div>
    `).join('');
}

export function openNotificationPanel() {
    let panel = document.getElementById('notifPanel');
    if (!panel) {
        const wrap = document.createElement('div');
        wrap.id = 'notifWrap';
        wrap.innerHTML = renderNotificationPanel() + getNotifStyles();
        document.body.appendChild(wrap);
        initNotificationPanel();
        panel = document.getElementById('notifPanel');
    }
    // Refresh items
    const body = document.getElementById('notifPanelBody');
    if (body) body.innerHTML = renderNotifItems();
    requestAnimationFrame(() => panel.classList.add('open'));
    document.getElementById('notifOverlay')?.classList.add('active');
}

export function closeNotificationPanel() {
    const panel = document.getElementById('notifPanel');
    panel?.classList.remove('open');
    document.getElementById('notifOverlay')?.classList.remove('active');
}

function initNotificationPanel() {
    document.getElementById('closeNotifPanel')?.addEventListener('click', closeNotificationPanel);
    document.getElementById('notifOverlay')?.addEventListener('click', closeNotificationPanel);
    document.getElementById('markAllRead')?.addEventListener('click', () => {
        store.update(s => { s.notificationCount = 0; });
        document.querySelectorAll('.notif-badge').forEach(b => { b.style.display = 'none'; });
        showToast('All notifications marked as read', 'success');
    });
}

export function updateNotifBadge(count) {
    document.querySelectorAll('.notif-badge').forEach(b => {
        if (count > 0) {
            b.textContent = count > 99 ? '99+' : String(count);
            b.style.display = 'flex';
        } else {
            b.style.display = 'none';
        }
    });
}

function getNotifStyles() {
    return `
    <style id="notif-styles">
      .notif-panel {
        position: fixed; top: 0; right: -360px; width: 360px; height: 100vh;
        background: var(--bg-secondary); border-left: 1px solid var(--border-light);
        box-shadow: var(--shadow-xl); z-index: 1100;
        transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex; flex-direction: column;
      }
      .notif-panel.open { right: 0; }
      .notif-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.2); z-index: 1099;
        opacity: 0; pointer-events: none; transition: opacity 0.3s;
      }
      .notif-overlay.active { opacity: 1; pointer-events: all; }
      .notif-panel-header {
        padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-light);
        display: flex; justify-content: space-between; align-items: center;
        font-family: var(--font-display);
      }
      .notif-panel-header h3 { font-size: var(--fs-md); font-weight: var(--fw-semibold); }
      .notif-panel-body { flex: 1; overflow-y: auto; padding: 0.5rem 0; }
      .notif-item {
        display: flex; gap: 0.75rem; padding: 0.875rem 1.5rem;
        border-bottom: 1px solid var(--border-light); transition: background var(--transition-fast);
        cursor: default;
      }
      .notif-item:hover { background: var(--neutral-50); }
      .notif-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
      .notif-content { flex: 1; min-width: 0; }
      .notif-msg { font-size: 0.8125rem; color: var(--text-primary); line-height: 1.4; margin-bottom: 3px; }
      .notif-time { font-size: 0.6875rem; color: var(--text-tertiary); }
      .notif-badge {
        position: absolute; top: -5px; right: -5px; min-width: 18px; height: 18px;
        background: #ef4444; color: #fff; border-radius: 9999px; font-size: 10px;
        font-weight: 700; display: flex; align-items: center; justify-content: center;
        padding: 0 4px; border: 2px solid var(--bg-secondary);
      }
    </style>
  `;
}
