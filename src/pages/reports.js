// ============================================
// REPORTS & COMPLIANCE PAGE — Full functionality
// ============================================
import { complianceFrameworks, recentReports } from '../data/mockData.js';
import { store, formatRelativeTime } from '../data/simulationEngine.js';
import { showToast } from '../components/toast.js';

function daysUntil(dateStr) {
    const diff = new Date(dateStr) - new Date();
    return Math.max(0, Math.ceil(diff / 86400000));
}

function auditWarningClass(dateStr) {
    const days = daysUntil(dateStr);
    if (days < 30) return 'badge-danger';
    if (days < 90) return 'badge-warning';
    return 'badge-success';
}

function renderAuditLog() {
    const state = store.get();
    const storeEvents = (state?.auditLog || []).slice(0, 5);
    const staticEvents = [
        { date: 'Feb 25, 2026', event: 'CSRD Q4 report submitted to EU portal', user: 'Sarah Chen' },
        { date: 'Feb 20, 2026', event: 'ISO 14064 recertification audit passed', user: 'System' },
        { date: 'Feb 15, 2026', event: 'CDP annual disclosure submitted (Score: A-)', user: 'Sarah Chen' },
        { date: 'Feb 10, 2026', event: 'GHG Protocol Scope 3 verification completed', user: 'Auditor: KPM Global' },
        { date: 'Feb 1, 2026', event: 'SBTi target progress review — on track (67%)', user: 'System' },
        { date: 'Jan 30, 2026', event: 'Annual carbon disclosure report published', user: 'Sarah Chen' },
    ];
    const events = [...storeEvents.map(e => ({ date: new Date(e.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), event: e.event, user: e.user || 'System' })), ...staticEvents];
    return events.slice(0, 8).map(a => `
      <div class="audit-item">
        <span class="audit-date">${a.date}</span>
        <span class="audit-event">${a.event}</span>
        <span class="audit-user">${a.user}</span>
      </div>
    `).join('');
}

export function renderReports() {
    const state = store.get() || {};
    const scheduled = state.scheduledReports || [];

    return `
    <div class="page-header">
      <div>
        <h1 style="font-size:var(--fs-2xl)">Reports & Compliance</h1>
        <p style="font-size:var(--fs-sm);color:var(--text-tertiary)">Manage compliance frameworks and generate sustainability reports.</p>
      </div>
      <button class="btn btn-primary btn-sm" id="genReportBtn">+ Generate Report</button>
    </div>
    <div class="page-body">
      <!-- Compliance Frameworks -->
      <div class="section-title">Compliance Frameworks</div>
      <div class="grid grid-3" style="margin-bottom:var(--space-8)">
        ${complianceFrameworks.map((f, i) => {
            const days = daysUntil(f.nextAudit);
            return `
          <div class="card animate-fade-in-up stagger-${i + 1}" style="padding:var(--space-6)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-4)">
              <div>
                <span style="font-size:28px;display:block;margin-bottom:var(--space-2)">${f.icon}</span>
                <h3 style="font-size:var(--fs-md)">${f.name}</h3>
              </div>
              <span class="badge ${f.status === 'Compliant' ? 'badge-success' : f.status === 'On Track' ? 'badge-info' : 'badge-warning'}">${f.status}</span>
            </div>
            <div style="margin-bottom:var(--space-3)">
              <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1)">
                <span style="font-size:var(--fs-xs);color:var(--text-tertiary)">Compliance Score</span>
                <span style="font-size:var(--fs-xs);font-weight:var(--fw-semibold)">${f.score}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-fill" style="width:${f.score}%"></div>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:var(--fs-xs)">
              <span style="color:var(--text-tertiary)">Next Audit: ${new Date(f.nextAudit).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span class="badge ${auditWarningClass(f.nextAudit)}">${days < 30 ? '⚠️ ' : ''}${days}d</span>
            </div>
          </div>`;
        }).join('')}
      </div>

      <!-- Recent Reports -->
      <div class="section-title">Recent Reports</div>
      <div class="card animate-fade-in-up" style="margin-bottom:var(--space-8)">
        <div class="table-wrapper" style="border:none;border-radius:var(--radius-lg)">
          <table>
            <thead>
              <tr><th>Report Name</th><th>Date</th><th>Type</th><th>Size</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              ${recentReports.map(r => `
                <tr>
                  <td style="font-weight:var(--fw-semibold);color:var(--text-primary)">${r.name}</td>
                  <td>${new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td><span class="badge badge-neutral">${r.type}</span></td>
                  <td>${r.size}</td>
                  <td><span class="badge ${r.status === 'Published' ? 'badge-success' : r.status === 'Under Review' ? 'badge-warning' : 'badge-info'}">${r.status}</span></td>
                  <td>
                    <button class="btn btn-ghost btn-sm download-report-btn" data-name="${r.name}" data-type="${r.type}">📥 Download</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid grid-2" style="margin-bottom:var(--space-6)">
        <!-- Report Generator -->
        <div class="card animate-fade-in-up" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">📊 Report Generator</h3>
          <form id="reportForm" style="display:grid;gap:var(--space-4)">
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Report Type</label>
              <select class="select" id="reportType" style="width:100%">
                <option>Sustainability Report</option><option>Carbon Disclosure</option>
                <option>Supplier ESG Assessment</option><option>Compliance Audit</option><option>Custom Report</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Period</label>
              <select class="select" id="reportPeriod" style="width:100%">
                <option>Q1 2026</option><option>Q4 2025</option><option>Annual 2025</option><option>Custom Range</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Format</label>
              <select class="select" id="reportFormat" style="width:100%">
                <option value="html">HTML (Print as PDF)</option><option value="csv">CSV Data</option><option value="json">JSON</option>
              </select>
            </div>
            <div style="display:flex;gap:var(--space-4)">
              <label style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--fs-sm);cursor:pointer">
                <input type="checkbox" id="inclCharts" checked style="accent-color:var(--primary-500)" /> Include Charts
              </label>
              <label style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--fs-sm);cursor:pointer">
                <input type="checkbox" id="inclRaw" checked style="accent-color:var(--primary-500)" /> Include Raw Data
              </label>
            </div>
            <button class="btn btn-primary" type="submit">Generate & Download</button>
          </form>
        </div>

        <!-- Report Scheduler -->
        <div class="card animate-fade-in-up stagger-1" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">📅 Schedule Report</h3>
          <form id="scheduleForm" style="display:grid;gap:var(--space-4)">
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Report Name</label>
              <input class="input" id="schedName" placeholder="e.g. Monthly Sustainability Report" />
            </div>
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Schedule Date</label>
              <input class="input" id="schedDate" type="date" value="${new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]}" />
            </div>
            <div>
              <label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Frequency</label>
              <select class="select" id="schedFreq" style="width:100%">
                <option>Once</option><option>Weekly</option><option>Monthly</option><option>Quarterly</option>
              </select>
            </div>
            <button class="btn btn-secondary" type="submit">Schedule Report</button>
          </form>
          ${scheduled.length > 0 ? `
            <div style="margin-top:var(--space-4);border-top:1px solid var(--border-light);padding-top:var(--space-4)">
              <div style="font-size:var(--fs-xs);font-weight:var(--fw-semibold);color:var(--text-tertiary);margin-bottom:8px">SCHEDULED</div>
              ${scheduled.map(s => `
                <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:var(--fs-xs);border-bottom:1px solid var(--border-light)">
                  <span>${s.name}</span>
                  <span style="color:var(--text-tertiary)">${s.date} • ${s.freq}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Audit Trail -->
      <div class="card animate-fade-in-up stagger-2" style="padding:var(--space-6)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4)">
          <h3 style="font-size:var(--fs-md)">📝 Audit Trail</h3>
          <span style="font-size:var(--fs-xs);color:var(--text-tertiary)">Live feed of compliance actions</span>
        </div>
        <div class="audit-trail" id="auditTrail">
          ${renderAuditLog()}
        </div>
      </div>
    </div>

    <!-- Generate Report Modal -->
    <div class="modal-overlay" id="genReportModal" style="display:none">
      <div class="modal" style="text-align:center;padding:var(--space-12);max-width:400px">
        <div style="font-size:48px;margin-bottom:var(--space-4)">📊</div>
        <h2 style="margin-bottom:var(--space-2)">Generating Report...</h2>
        <p style="color:var(--text-tertiary);margin-bottom:var(--space-6);font-size:var(--fs-sm)">Compiling data and building your sustainability report.</p>
        <div class="progress-bar" style="margin-bottom:var(--space-4)">
          <div class="progress-bar-fill" id="genProgress" style="width:0%;transition:width 2.5s linear"></div>
        </div>
        <p id="genStatus" style="font-size:var(--fs-xs);color:var(--text-tertiary)">Gathering emissions data...</p>
        <button class="btn btn-secondary" style="margin-top:var(--space-4)" onclick="document.getElementById('genReportModal').style.display='none'">Cancel</button>
      </div>
    </div>
  `;
}

function generateHTMLReport(type, period) {
    const state = store.get() || {};
    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${type} — ${period}</title>
<style>
  body{font-family:Arial,sans-serif;color:#1e293b;max-width:800px;margin:0 auto;padding:2rem}
  h1{color:#059669;border-bottom:3px solid #059669;padding-bottom:1rem}
  h2{color:#0f172a;margin-top:2rem}
  table{width:100%;border-collapse:collapse;margin:1rem 0}
  th,td{border:1px solid #e2e8f0;padding:8px 12px;text-align:left}
  th{background:#f8fafc;font-weight:600}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px}
  .green{background:#ecfdf5;color:#059669} .red{background:#fef2f2;color:#dc2626}
  @media print{body{padding:1rem}}
</style></head>
<body>
<h1>🌿 Green Supply Chain Guardian</h1>
<h2>${type} — ${period}</h2>
<p>Generated: ${new Date().toLocaleString()} | Company: EcoVentures Global</p>
<h2>Emissions Summary</h2>
<table>
  <tr><th>Scope</th><th>Emissions (tCO₂e)</th><th>% of Total</th></tr>
  <tr><td>Scope 1 — Direct</td><td>${state.scope?.s1 ?? 2940}</td><td>19%</td></tr>
  <tr><td>Scope 2 — Energy</td><td>${state.scope?.s2 ?? 5640}</td><td>37%</td></tr>
  <tr><td>Scope 3 — Value Chain</td><td>${state.scope?.s3 ?? 6720}</td><td>44%</td></tr>
</table>
<h2>Key Performance Indicators</h2>
<table>
  <tr><th>KPI</th><th>Value</th><th>Change</th></tr>
  <tr><td>Total Emissions</td><td>${state.kpis?.emissions?.toLocaleString() ?? '12,847'} tCO₂e</td><td><span class="badge green">↓ 12.3%</span></td></tr>
  <tr><td>Green Score</td><td>${state.kpis?.score ?? 94.2} / 100</td><td><span class="badge green">↑ 3.1%</span></td></tr>
  <tr><td>Supplier Compliance</td><td>${state.kpis?.compliance ?? 91}%</td><td><span class="badge green">↑ 5.7%</span></td></tr>
</table>
<p style="margin-top:3rem;font-size:12px;color:#94a3b8">This report was generated by Green Supply Chain Guardian. All data is simulated for demonstration purposes.</p>
</body></html>`;
    return html;
}

export function initReports() {
    // Download buttons
    document.querySelectorAll('.download-report-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const type = btn.dataset.type || 'Sustainability Report';
            const html = generateHTMLReport(type, 'Q4 2025');
            const blob = new Blob([html], { type: 'text/html' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = name.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.html';
            a.click();
            URL.revokeObjectURL(a.href);
            showToast(`Downloaded: ${name}`, 'success');
        });
    });

    // Generate report button & modal
    const genBtn = document.getElementById('genReportBtn');
    const modal = document.getElementById('genReportModal');
    const form = document.getElementById('reportForm');

    genBtn?.addEventListener('click', () => {
        if (modal) {
            modal.style.display = 'flex';
            const bar = document.getElementById('genProgress');
            const status = document.getElementById('genStatus');
            const steps = ['Gathering emissions data...', 'Calculating scope breakdowns...', 'Compiling supplier data...', 'Formatting report...', 'Done!'];
            let i = 0;
            if (bar) bar.style.width = '0%';
            setTimeout(() => { if (bar) bar.style.width = '100%'; }, 50);
            const stepTimer = setInterval(() => {
                if (status && steps[i]) status.textContent = steps[i];
                i++;
                if (i >= steps.length) clearInterval(stepTimer);
            }, 600);
            setTimeout(() => {
                clearInterval(stepTimer);
                const type = document.getElementById('reportType')?.value || 'Sustainability Report';
                const period = document.getElementById('reportPeriod')?.value || 'Q4 2025';
                const format = document.getElementById('reportFormat')?.value || 'html';
                modal.style.display = 'none';
                if (bar) bar.style.width = '0%';

                if (format === 'html') {
                    const html = generateHTMLReport(type, period);
                    const blob = new Blob([html], { type: 'text/html' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `gscg-${type.replace(/\s+/g, '-').toLowerCase()}-${period.replace(/\s+/g, '-').toLowerCase()}.html`;
                    a.click();
                } else if (format === 'csv') {
                    const s = store.get() || {};
                    const csv = 'Metric,Value,Unit\nScope 1,' + (s.scope?.s1 ?? 2940) + ',tCO2e\nScope 2,' + (s.scope?.s2 ?? 5640) + ',tCO2e\nScope 3,' + (s.scope?.s3 ?? 6720) + ',tCO2e';
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'emissions-report.csv';
                    a.click();
                } else {
                    const s = store.get() || {};
                    const json = JSON.stringify({ type, period, kpis: s.kpis, scope: s.scope, generated: new Date().toISOString() }, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'emissions-report.json';
                    a.click();
                }
                showToast('Report generated and downloaded!', 'success');
                // Log to audit trail
                store.update(st => {
                    if (!st.auditLog) st.auditLog = [];
                    st.auditLog.unshift({ time: Date.now(), event: `${type} generated for ${period}`, user: 'Sarah Chen' });
                });
                const auditDiv = document.getElementById('auditTrail');
                if (auditDiv) auditDiv.innerHTML = renderAuditLog();
            }, 2800);
        }
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        // Trigger generate flow
        genBtn?.click();
    });

    // Schedule form
    document.getElementById('scheduleForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('schedName')?.value?.trim() || 'Scheduled Report';
        const date = document.getElementById('schedDate')?.value || '';
        const freq = document.getElementById('schedFreq')?.value || 'Once';
        store.update(s => {
            if (!s.scheduledReports) s.scheduledReports = [];
            s.scheduledReports.push({ name, date, freq, created: Date.now() });
        });
        showToast(`Report scheduled: ${name} on ${date}`, 'success');
        e.target.reset();
    });

    document.addEventListener('toast', (e) => showToast(e.detail.msg, e.detail.type));
}
