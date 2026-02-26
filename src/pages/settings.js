// ============================================
// SETTINGS PAGE
// ============================================
import { user } from '../data/mockData.js';
import { showToast } from '../components/toast.js';

export function renderSettings() {
    return `
    <div class="page-header">
      <div>
        <h1 style="font-size:var(--fs-2xl)">Settings</h1>
        <p style="font-size:var(--fs-sm);color:var(--text-tertiary)">Manage your account, preferences, and integrations.</p>
      </div>
    </div>
    <div class="page-body">
      <div class="grid grid-2">
        <!-- Profile -->
        <div class="card animate-fade-in-up" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-6)">👤 Profile</h3>
          <form id="profileForm" style="display:grid;gap:var(--space-4)">
            <div style="display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-2)">
              <div style="width:64px;height:64px;border-radius:var(--radius-full);background:linear-gradient(135deg,var(--primary-400),var(--secondary-400));color:white;display:flex;align-items:center;justify-content:center;font-size:var(--fs-xl);font-weight:var(--fw-bold);flex-shrink:0">${user.avatar}</div>
              <div>
                <div style="font-weight:var(--fw-semibold)">${user.name}</div>
                <div style="font-size:var(--fs-xs);color:var(--text-tertiary)">${user.role} at ${user.company}</div>
                <button type="button" class="btn btn-ghost btn-sm" style="margin-top:var(--space-1);padding:2px 8px;font-size:11px">Change Photo</button>
              </div>
            </div>
            <div class="grid grid-2">
              <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Full Name</label><input class="input" value="${user.name}" /></div>
              <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Email</label><input class="input" value="${user.email}" type="email" /></div>
            </div>
            <div class="grid grid-2">
              <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Company</label><input class="input" value="${user.company}" /></div>
              <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Role</label><input class="input" value="${user.role}" /></div>
            </div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Plan</label>
              <div style="display:flex;align-items:center;gap:var(--space-3)">
                <span class="badge badge-success">${user.plan}</span>
                <span style="font-size:var(--fs-xs);color:var(--text-tertiary)">Next billing: Mar 1, 2026</span>
              </div>
            </div>
            <button class="btn btn-primary" type="submit" style="width:fit-content">Save Changes</button>
          </form>
        </div>

        <!-- Notifications -->
        <div class="card animate-fade-in-up stagger-1" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-6)">🔔 Notifications</h3>
          <div style="display:grid;gap:var(--space-4)">
            ${[
            { label: 'ESG Score Alerts', desc: 'Notify when a supplier ESG score drops below threshold', on: true },
            { label: 'Emission Spikes', desc: 'Alert on anomalous emission increases', on: true },
            { label: 'Compliance Deadlines', desc: 'Reminders for upcoming audit dates', on: true },
            { label: 'Shipment Delays', desc: 'Notify on shipment status changes', on: true },
            { label: 'Weekly Summary', desc: 'Receive weekly sustainability digest', on: false },
            { label: 'Marketing Updates', desc: 'Product updates and feature announcements', on: false },
        ].map((n, i) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:var(--space-3);border-bottom:1px solid var(--border-light)">
                <div>
                  <div style="font-size:var(--fs-sm);font-weight:var(--fw-medium)">${n.label}</div>
                  <div style="font-size:11px;color:var(--text-tertiary)">${n.desc}</div>
                </div>
                <div class="toggle ${n.on ? 'active' : ''}" data-toggle="${i}"></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="grid grid-2" style="margin-top:var(--space-6)">
        <!-- Integrations -->
        <div class="card animate-fade-in-up stagger-2" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-6)">🔗 Integrations</h3>
          <div style="display:grid;gap:var(--space-4)">
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
                <button class="btn btn-sm ${int.status === 'Connected' ? 'btn-ghost' : 'btn-secondary'}">${int.status === 'Connected' ? 'Configure' : 'Connect'}</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- API & Security -->
        <div class="card animate-fade-in-up stagger-3" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-6)">🔑 API & Security</h3>
          <div style="display:grid;gap:var(--space-4)">
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">API Key</label>
              <div style="display:flex;gap:var(--space-2)">
                <input class="input" value="gscg_sk_••••••••••••••••••••3f7a" readonly style="font-family:monospace;font-size:var(--fs-xs)" />
                <button class="btn btn-secondary btn-sm" onclick="document.dispatchEvent(new CustomEvent('toast',{detail:{msg:'API key copied to clipboard',type:'success'}}))">Copy</button>
              </div>
            </div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Webhook URL</label>
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
            <button class="btn btn-secondary" style="width:fit-content" onclick="document.dispatchEvent(new CustomEvent('toast',{detail:{msg:'API key regenerated (Demo)',type:'warning'}}))">Regenerate API Key</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSettings() {
    document.querySelectorAll('.toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            const isActive = toggle.classList.contains('active');
            showToast(`Notification ${isActive ? 'enabled' : 'disabled'}`, isActive ? 'success' : 'info');
        });
    });

    document.getElementById('profileForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Profile updated successfully!', 'success');
    });

    document.addEventListener('toast', (e) => showToast(e.detail.msg, e.detail.type));
}
