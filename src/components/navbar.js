// ============================================
// NAVBAR — Sidebar Navigation Component
// ============================================
import { user } from '../data/mockData.js';
import { store, loadSettings } from '../data/simulationEngine.js';
import { openNotificationPanel, updateNotifBadge } from './notification.js';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>` },
    { id: 'suppliers', label: 'Suppliers', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
    { id: 'emissions', label: 'Carbon Tracking', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>` },
    { id: 'logistics', label: 'Logistics', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>` },
    { id: 'reports', label: 'Reports & Compliance', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>` },
    { id: 'settings', label: 'Settings', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>` },
];

export function renderNavbar(currentPage) {
    const state = store.get();
    const notifCount = state?.notificationCount ?? 0;
    const settings = loadSettings();
    const profileName = settings.name || user.name;
    const profileRole = settings.role || user.role;
    const initials = profileName.split(' ').map(w => w[0]).join('');

    return `
    <nav class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <div class="sidebar-logo">
          <span class="logo-icon">🌿</span>
          <div class="logo-text">
            <span class="logo-title">GSCG</span>
            <span class="logo-subtitle">Supply Chain Guardian</span>
          </div>
        </div>
        <div style="display:flex;gap:4px;margin-left:auto">
          <!-- Notification Bell -->
          <button id="notifBellBtn" title="Notifications" style="position:relative;background:none;border:none;cursor:pointer;padding:6px;border-radius:8px;color:var(--text-secondary);transition:background 0.15s" aria-label="Notifications">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="notif-badge" style="display:${notifCount > 0 ? 'flex' : 'none'}">${notifCount > 99 ? '99+' : notifCount}</span>
          </button>
          <!-- Dark mode quick toggle -->
          <button id="darkModeQuickBtn" title="Toggle Dark Mode" style="background:none;border:none;cursor:pointer;padding:6px;border-radius:8px;color:var(--text-secondary);transition:background 0.15s" aria-label="Toggle dark mode">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
        </div>
      </div>

      <div class="sidebar-nav">
        ${navItems.map(item => `
          <a href="#${item.id}" class="nav-item ${currentPage === item.id ? 'active' : ''}" data-page="${item.id}">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-label">${item.label}</span>
            ${currentPage === item.id ? '<span class="nav-indicator"></span>' : ''}
          </a>
        `).join('')}
      </div>

      <div class="sidebar-footer">
        <div style="font-size:9px;color:var(--text-tertiary);padding:0 var(--space-4) 4px;letter-spacing:0.04em">KEYBOARD: 1-6 for pages • Ctrl+K search</div>
        <div class="sidebar-user" onclick="location.hash='settings'">
          <div class="user-avatar">${initials}</div>
          <div class="user-info">
            <span class="user-name">${profileName}</span>
            <span class="user-role">${profileRole}</span>
          </div>
        </div>
      </div>
    </nav>

    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open menu">☰</button>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
  `;
}

export function getNavbarStyles() {
    return `
    <style>
      .sidebar-brand {
        padding: var(--space-4) var(--space-4) var(--space-4) var(--space-6);
        border-bottom: 1px solid var(--border-light);
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }
      .sidebar-logo {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        flex: 1;
        min-width: 0;
      }
      .logo-icon {
        font-size: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        background: linear-gradient(135deg, var(--primary-50), var(--secondary-50));
        border-radius: var(--radius-lg);
      }
      .logo-text {
        display: flex;
        flex-direction: column;
      }
      .logo-title {
        font-family: var(--font-display);
        font-weight: var(--fw-extrabold);
        font-size: var(--fs-lg);
        color: var(--primary-700);
        letter-spacing: var(--ls-tight);
        line-height: 1.1;
      }
      .logo-subtitle {
        font-size: 10px;
        color: var(--text-tertiary);
        font-weight: var(--fw-medium);
        letter-spacing: var(--ls-wide);
      }
      .sidebar-nav {
        flex: 1;
        padding: var(--space-4) var(--space-3);
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow-y: auto;
      }
      .nav-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        font-size: var(--fs-sm);
        font-weight: var(--fw-medium);
        transition: all var(--transition-fast);
        position: relative;
      }
      .nav-item:hover {
        background: var(--neutral-100);
        color: var(--text-primary);
      }
      .nav-item.active {
        background: var(--primary-50);
        color: var(--primary-700);
        font-weight: var(--fw-semibold);
      }
      .nav-item.active .nav-icon { color: var(--primary-600); }
      .nav-indicator {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background: var(--primary-500);
        border-radius: var(--radius-full);
      }
      .nav-icon {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        color: var(--text-tertiary);
        transition: color var(--transition-fast);
      }
      .sidebar-footer {
        padding: var(--space-4) var(--space-4);
        border-top: 1px solid var(--border-light);
      }
      .sidebar-user {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: background var(--transition-fast);
      }
      .sidebar-user:hover { background: var(--neutral-100); }
      .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: var(--radius-full);
        background: linear-gradient(135deg, var(--primary-400), var(--secondary-400));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--fs-xs);
        font-weight: var(--fw-bold);
        flex-shrink: 0;
      }
      .user-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .user-name {
        font-size: var(--fs-sm);
        font-weight: var(--fw-semibold);
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .user-role {
        font-size: 11px;
        color: var(--text-tertiary);
      }
    </style>
  `;
}

export function initNavbar() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });
    }
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    // Notification bell
    document.getElementById('notifBellBtn')?.addEventListener('click', () => {
        openNotificationPanel();
    });

    // Dark mode quick toggle
    document.getElementById('darkModeQuickBtn')?.addEventListener('click', () => {
        const isDark = document.documentElement.hasAttribute('data-theme');
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        const { saveSettings, loadSettings } = window._gscg || {};
        if (saveSettings && loadSettings) {
            const s = loadSettings();
            saveSettings({ ...s, darkMode: !isDark });
        }
    });

    // Update notification badge from simulation events
    document.addEventListener('gscg:activity', () => {
        const state = store.get();
        if (state) updateNotifBadge(state.notificationCount);
    });
}
