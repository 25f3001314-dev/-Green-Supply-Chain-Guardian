// ============================================
// REPORTS & COMPLIANCE PAGE
// ============================================
import { complianceFrameworks, recentReports } from '../data/mockData.js';
import { showToast } from '../components/toast.js';

export function renderReports() {
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
        ${complianceFrameworks.map((f, i) => `
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
            <div style="font-size:var(--fs-xs);color:var(--text-tertiary)">
              Next Audit: ${new Date(f.nextAudit).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        `).join('')}
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
                  <td><button class="btn btn-ghost btn-sm" onclick="document.dispatchEvent(new CustomEvent('toast',{detail:{msg:'Downloading ${r.name}...',type:'info'}}))">📥 Download</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Report Generator -->
      <div class="grid grid-2">
        <div class="card animate-fade-in-up" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">📊 Report Generator</h3>
          <form id="reportForm" style="display:grid;gap:var(--space-4)">
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Report Type</label>
              <select class="select" style="width:100%"><option>Sustainability Report</option><option>Carbon Disclosure</option><option>Supplier ESG Assessment</option><option>Compliance Audit</option><option>Custom Report</option></select>
            </div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Period</label>
              <select class="select" style="width:100%"><option>Q1 2026</option><option>Q4 2025</option><option>Annual 2025</option><option>Custom Range</option></select>
            </div>
            <div><label style="display:block;font-size:var(--fs-sm);font-weight:var(--fw-medium);margin-bottom:var(--space-1)">Format</label>
              <select class="select" style="width:100%"><option>PDF</option><option>Excel (XLSX)</option><option>CSV</option></select>
            </div>
            <div style="display:flex;gap:var(--space-2)">
              <label style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--fs-sm);cursor:pointer">
                <input type="checkbox" checked style="accent-color:var(--primary-500)" /> Include Charts
              </label>
              <label style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--fs-sm);cursor:pointer">
                <input type="checkbox" checked style="accent-color:var(--primary-500)" /> Include Raw Data
              </label>
            </div>
            <button class="btn btn-primary" type="submit">Generate Report</button>
          </form>
        </div>

        <div class="card animate-fade-in-up stagger-1" style="padding:var(--space-6)">
          <h3 style="font-size:var(--fs-md);margin-bottom:var(--space-4)">📝 Audit Trail</h3>
          <div class="audit-trail">
            ${[
            { date: 'Feb 25, 2026', event: 'CSRD Q4 report submitted to EU portal', user: 'Sarah Chen' },
            { date: 'Feb 20, 2026', event: 'ISO 14064 recertification audit passed', user: 'System' },
            { date: 'Feb 15, 2026', event: 'CDP annual disclosure submitted (Score: A-)', user: 'Sarah Chen' },
            { date: 'Feb 10, 2026', event: 'GHG Protocol Scope 3 verification completed', user: 'Auditor: KPM Global' },
            { date: 'Feb 1, 2026', event: 'SBTi target progress review - on track (67%)', user: 'System' },
            { date: 'Jan 30, 2026', event: 'Annual carbon disclosure report published', user: 'Sarah Chen' },
            { date: 'Jan 15, 2026', event: 'TCFD risk assessment updated for FY2025', user: 'James Wilson' },
        ].map(a => `
              <div class="audit-item">
                <span class="audit-date">${a.date}</span>
                <span class="audit-event">${a.event}</span>
                <span class="audit-user">${a.user}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Report Generator Modal -->
    <div class="modal-overlay" id="genReportModal" style="display:none">
      <div class="modal" style="text-align:center;padding:var(--space-12)">
        <div style="font-size:48px;margin-bottom:var(--space-4)">📊</div>
        <h2 style="margin-bottom:var(--space-2)">Generating Report...</h2>
        <p style="color:var(--text-tertiary);margin-bottom:var(--space-6)">Your sustainability report is being compiled. This usually takes 2-3 minutes.</p>
        <div class="progress-bar" style="margin-bottom:var(--space-4)">
          <div class="progress-bar-fill" id="genProgress" style="width:0%;transition:width 3s linear"></div>
        </div>
        <button class="btn btn-secondary" onclick="document.getElementById('genReportModal').style.display='none'">Close</button>
      </div>
    </div>
  `;
}

export function initReports() {
    const genBtn = document.getElementById('genReportBtn');
    const modal = document.getElementById('genReportModal');
    const form = document.getElementById('reportForm');

    genBtn?.addEventListener('click', () => {
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                const bar = document.getElementById('genProgress');
                if (bar) bar.style.width = '100%';
            }, 100);
            setTimeout(() => {
                showToast('Report generated successfully!', 'success');
                if (modal) modal.style.display = 'none';
                const bar = document.getElementById('genProgress');
                if (bar) bar.style.width = '0%';
            }, 3200);
        }
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Custom report generation started...', 'info');
    });

    document.addEventListener('toast', (e) => showToast(e.detail.msg, e.detail.type));
}
