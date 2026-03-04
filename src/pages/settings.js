// ============================================
// SETTINGS PAGE — Full localStorage persistence
// ============================================
import { user } from '../data/mockData.js';
import { store, saveSettings, loadSettings } from '../data/simulationEngine.js';
import { showToast } from '../components/toast.js';

function applyDarkMode(enabled) {
    if (enabled) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

export function renderSettings() {
    const settings = loadSettings();
    const profileName = settings.name || user.name;
    const profileEmail = settings.email || user.email;
    const profileCompany = settings.company || user.company;
    const profileRole = settings.role || user.role;
    const isDark = !!settings.darkMode;
    const simSpeed = settings.simulationSpeed || 1;
    const avatarSrc = settings.avatarBase64 || null;
    const notifPrefs = settings.notifPrefs || { esg: true, emissions: true, compliance: true, shipments: true, weekly: false, marketing: false };

    return `
    <style>
      .settings-section { margin-bottom: var(--space-8); }
      .settings-row { display: flex; justify-content: space-between; align-items: center; padding: var(--space-3) 0; border-bottom: 1px solid var(--border-light); }
      .settings-row:last-child { border-bottom: none; }
      .speed-display { font-weight: var(--fw-bold); color: var(--primary-700); font-size: var(--fs-lg); }
      input[type=range].speed-slider { -webkit-appearance:none;width:100%;height:6px;border-radius:3px;background:var(--neutral-200);outline:none; }
      input[type=range].speed-slider::-webkit-slider-thumb { -webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--primary-500);cursor:pointer;box-shadow:0 0 0 3px rgba(16,185,129,0.2); }
      .avatar-wrap { position:relative;cursor:pointer; }
      .avatar-wrap:hover .avatar-overlay { opacity:1; }
      .avatar-overlay { position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;color:white;font-size:11px; }
    </style>
    <div class="page-header">
      <div>
        <h1 style="font-size:var(--fs-2xl)">Settings</h1>
        <p style="font-size:var(--fs-sm);color:var(--text-tertiary)">Manage your account, preferences, and integrations.</p>
      </div>
    </div>
    <div class="page-body">
      <div class="grid grid-2">
        <!-- Profile -->
        <div class="card animate-fade-in-up settings-section" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-6)">�� Profile</h3>
          <form id="profileForm" style="display:grid;gap:var(--space-4)">
            <div style="display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-2)">
              <label class="avatar-wrap" title="Click to change photo">
                <input type="file" id="avatarInput" accept="image/*" style="display:none" />
                ${avatarSrc
                    ? `<img id="avatarImg" src="${avatarSrc}" style="width:64px;height:64px;border-radius:50%;object-fit:cover" />`
                    : `<div id="avatarImg" style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--primary-400),var(--secondary-400));color:white;display:flex;align-items:center;justify-content:center;font-size:var(--fs-xl);font-weight:var(--fw-bold)">${profileName.split(' ').map(w => w[0]).join('')}</div>`
                }
                <div class="avatar-overlay">📷 Change</div>
              </label>
              <div>
                <div style="font-weight:var(--fw-semibold)">${profileName}</div>
                <div style="font-size:var(--fs-xs);color:var(--text-tertiary)">${profileRole} at ${profileCompany}</div>
              </div>
            </div>
            <div class="grid grid-2">
              <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Full Name</label>
                <input class="input" id="settingName" value="${profileName}" /></div>
              <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Email</label>
                <input class="input" id="settingEmail" type="email" value="${profileEmail}" /></div>
            </div>
            <div class="grid grid-2">
              <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Company</label>
                <input class="input" id="settingCompany" value="${profileCompany}" /></div>
              <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Role</label>
                <input class="input" id="settingRole" value="${profileRole}" /></div>
            </div>
            <div style="display:flex;gap:var(--space-3)">
              <button class="btn btn-primary" type="submit">Save Changes</button>
              <button class="btn btn-ghost btn-sm" type="button" id="exportSettingsBtn">📤 Export</button>
              <label class="btn btn-ghost btn-sm" style="cursor:pointer">
                📥 Import <input type="file" id="importSettingsInput" accept=".json" style="display:none" />
              </label>
            </div>
          </form>
        </div>

        <!-- Notifications -->
        <div class="card animate-fade-in-up stagger-1 settings-section" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-6)">🔔 Notifications</h3>
          <div>
            ${[
              { key: 'esg', label: 'ESG Score Alerts', desc: 'When supplier ESG drops below threshold' },
              { key: 'emissions', label: 'Emission Spikes', desc: 'Alert on anomalous emission increases' },
              { key: 'compliance', label: 'Compliance Deadlines', desc: 'Reminders for upcoming audit dates' },
              { key: 'shipments', label: 'Shipment Delays', desc: 'Notify on shipment status changes' },
              { key: 'weekly', label: 'Weekly Summary', desc: 'Receive weekly sustainability digest' },
              { key: 'marketing', label: 'Marketing Updates', desc: 'Product updates and feature announcements' },
            ].map((n, i) => `
              <div class="settings-row">
                <div>
                  <div style="font-size:var(--fs-sm);font-weight:var(--fw-medium)">${n.label}</div>
                  <div style="font-size:11px;color:var(--text-tertiary)">${n.desc}</div>
                </div>
                <div class="toggle ${notifPrefs[n.key] ? 'active' : ''}" data-notif="${n.key}"></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="grid grid-2" style="margin-top:var(--space-6)">
        <!-- Appearance & Simulation -->
        <div class="card animate-fade-in-up stagger-2" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-6)">🎨 Appearance & Simulation</h3>

          <!-- Dark mode -->
          <div class="settings-row">
            <div>
              <div style="font-size:var(--fs-sm);font-weight:var(--fw-medium)">🌙 Dark Mode</div>
              <div style="font-size:11px;color:var(--text-tertiary)">Switch to dark theme</div>
            </div>
            <div class="toggle ${isDark ? 'active' : ''}" id="darkModeToggle"></div>
          </div>

          <!-- Simulation Speed -->
          <div style="padding:var(--space-3) 0;border-bottom:1px solid var(--border-light)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3)">
              <div>
                <div style="font-size:var(--fs-sm);font-weight:var(--fw-medium)">⚡ Simulation Speed</div>
                <div style="font-size:11px;color:var(--text-tertiary)">Controls how fast live data updates</div>
              </div>
              <span class="speed-display" id="speedDisplay">${simSpeed}x</span>
            </div>
            <input type="range" class="speed-slider" id="speedSlider" min="1" max="10" step="1" value="${simSpeed}" />
            <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-tertiary);margin-top:4px">
              <span>1x (Real-time)</span><span>5x</span><span>10x (Fast)</span>
            </div>
          </div>

          <!-- Reset data -->
          <div style="padding:var(--space-4) 0">
            <div style="font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-2)">⚠️ Data Reset</div>
            <p style="font-size:var(--fs-xs);color:var(--text-tertiary);margin-bottom:var(--space-3)">Clear all simulation data and restart from default values. This cannot be undone.</p>
            <button class="btn btn-secondary btn-sm" id="resetDataBtn" style="border-color:var(--danger-400);color:var(--danger-500)">🗑️ Reset All Data</button>
          </div>
        </div>

        <!-- Integrations -->
        <div class="card animate-fade-in-up stagger-3" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-6)">🔗 Integrations</h3>
          <div style="display:grid;gap:var(--space-3)">
            ${[
              { name: 'SAP ERP', status: 'Connected', icon: '🟢' },
              { name: 'Salesforce', status: 'Connected', icon: '🟢' },
              { name: 'Slack Notifications', status: 'Connected', icon: '🟢' },
              { name: 'Google BigQuery', status: 'Not Connected', icon: '⚪' },
              { name: 'Power BI', status: 'Not Connected', icon: '⚪' },
            ].map(int => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-3);border:1px solid var(--border-light);border-radius:var(--radius-md)">
                <div style="display:flex;align-items:center;gap:var(--space-3)">
                  <span>${int.icon}</span>
                  <div>
                    <div style="font-size:var(--fs-sm);font-weight:var(--fw-medium)">${int.name}</div>
                    <div style="font-size:11px;color:var(--text-tertiary)">${int.status}</div>
                  </div>
                </div>
                <button class="btn btn-sm ${int.status === 'Connected' ? 'btn-ghost' : 'btn-secondary'}"
                  onclick="document.dispatchEvent(new CustomEvent('toast',{detail:{msg:'${int.status === 'Connected' ? 'Configure' : 'Connecting to'} ${int.name}...',type:'info'}}))">
                  ${int.status === 'Connected' ? 'Configure' : 'Connect'}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- API & Security -->
      <div class="grid grid-2" style="margin-top:var(--space-6)">
        <div class="card animate-fade-in-up stagger-4" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-6)">🔑 API & Security</h3>
          <div style="display:grid;gap:var(--space-4)">
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">API Key</label>
              <div style="display:flex;gap:var(--space-2)">
                <input class="input" id="apiKeyInput" value="gscg_sk_••••••••••••••••••••3f7a" readonly style="font-family:monospace;font-size:var(--fs-xs)" />
                <button class="btn btn-secondary btn-sm" id="copyApiKeyBtn">Copy</button>
              </div>
            </div>
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Webhook URL</label>
              <input class="input" value="https://api.ecoventures.com/webhooks/gscg" style="font-family:monospace;font-size:var(--fs-xs)" />
            </div>
            <div style="padding:var(--space-4);background:var(--neutral-50);border-radius:var(--radius-md)">
              <div style="font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-2)">Security</div>
              <div style="display:grid;gap:var(--space-2)">
                <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs)"><span>Two-Factor Authentication</span><span class="badge badge-success">Enabled</span></div>
                <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs)"><span>Last Password Change</span><span style="color:var(--text-tertiary)">Jan 15, 2026</span></div>
                <div style="display:flex;justify-content:space-between;font-size:var(--fs-xs)"><span>Active Sessions</span><span style="color:var(--text-tertiary)">3 devices</span></div>
              </div>
            </div>
            <button class="btn btn-secondary" style="width:fit-content" id="regenKeyBtn">Regenerate API Key</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSettings() {
    const settings = loadSettings();

    // Profile save
    document.getElementById('profileForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
            ...settings,
            name: document.getElementById('settingName')?.value || settings.name,
            email: document.getElementById('settingEmail')?.value || settings.email,
            company: document.getElementById('settingCompany')?.value || settings.company,
            role: document.getElementById('settingRole')?.value || settings.role,
        };
        saveSettings(updated);
        showToast('Profile updated successfully!', 'success');
    });

    // Avatar upload
    document.getElementById('avatarInput')?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const base64 = ev.target.result;
            const img = document.getElementById('avatarImg');
            if (img) {
                img.outerHTML = `<img id="avatarImg" src="${base64}" style="width:64px;height:64px;border-radius:50%;object-fit:cover" />`;
            }
            const s = loadSettings();
            saveSettings({ ...s, avatarBase64: base64 });
            showToast('Profile photo updated!', 'success');
        };
        reader.readAsDataURL(file);
    });

    // Toggle notifications
    document.querySelectorAll('[data-notif]').forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            const key = toggle.dataset.notif;
            const isActive = toggle.classList.contains('active');
            const s = loadSettings();
            if (!s.notifPrefs) s.notifPrefs = {};
            s.notifPrefs[key] = isActive;
            saveSettings(s);
            showToast(`${key} notifications ${isActive ? 'enabled' : 'disabled'}`, isActive ? 'success' : 'info');
        });
    });

    // Dark mode toggle
    document.getElementById('darkModeToggle')?.addEventListener('click', function () {
        this.classList.toggle('active');
        const enabled = this.classList.contains('active');
        applyDarkMode(enabled);
        const s = loadSettings();
        saveSettings({ ...s, darkMode: enabled });
        showToast(`Dark mode ${enabled ? 'enabled' : 'disabled'}`, 'info');
    });

    // Simulation speed slider
    const speedSlider = document.getElementById('speedSlider');
    const speedDisplay = document.getElementById('speedDisplay');
    speedSlider?.addEventListener('input', () => {
        const val = parseInt(speedSlider.value);
        if (speedDisplay) speedDisplay.textContent = `${val}x`;
    });
    speedSlider?.addEventListener('change', () => {
        const val = parseInt(speedSlider.value);
        const s = loadSettings();
        saveSettings({ ...s, simulationSpeed: val });
        store.update(st => { st.speedMultiplier = val; });
        showToast(`Simulation speed set to ${val}x`, 'info');
        // Restart engine at new speed - fire event
        document.dispatchEvent(new CustomEvent('gscg:speed', { detail: { speed: val } }));
    });

    // Reset data
    document.getElementById('resetDataBtn')?.addEventListener('click', () => {
        if (confirm('Reset all simulation data? This will clear all custom suppliers, shipments, and preferences.')) {
            store.reset();
            saveSettings({});
            document.documentElement.removeAttribute('data-theme');
            showToast('All data reset to defaults', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    });

    // Copy API key
    document.getElementById('copyApiKeyBtn')?.addEventListener('click', () => {
        navigator.clipboard?.writeText('gscg_sk_demo_key_3f7a').catch(() => {});
        showToast('API key copied to clipboard', 'success');
    });

    // Regenerate API key
    document.getElementById('regenKeyBtn')?.addEventListener('click', () => {
        showToast('API key regenerated (Demo mode)', 'warning');
    });

    // Export settings
    document.getElementById('exportSettingsBtn')?.addEventListener('click', () => {
        const s = loadSettings();
        const json = JSON.stringify(s, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'gscg-settings.json';
        a.click();
        showToast('Settings exported', 'success');
    });

    // Import settings
    document.getElementById('importSettingsInput')?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const imported = JSON.parse(ev.target.result);
                saveSettings(imported);
                applyDarkMode(imported.darkMode);
                showToast('Settings imported successfully!', 'success');
                setTimeout(() => location.reload(), 1000);
            } catch (_) {
                showToast('Invalid settings file', 'error');
            }
        };
        reader.readAsText(file);
    });

    document.addEventListener('toast', (e) => showToast(e.detail.msg, e.detail.type));
}
