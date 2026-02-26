// ============================================
// MAIN.JS — SPA Router & App Shell
// ============================================

// Page styles
import './styles/pages/landing.css';
import './styles/pages/dashboard.css';
import './styles/pages/suppliers.css';
import './styles/pages/emissions.css';
import './styles/pages/logistics.css';
import './styles/pages/reports.css';

// Pages
import { renderLanding, initLanding } from './pages/landing.js';
import { renderDashboard, initDashboard } from './pages/dashboard.js';
import { renderSuppliers, initSuppliers } from './pages/suppliers.js';
import { renderEmissions, initEmissions } from './pages/emissions.js';
import { renderLogistics, initLogistics } from './pages/logistics.js';
import { renderReports, initReports } from './pages/reports.js';
import { renderSettings, initSettings } from './pages/settings.js';

// Components
import { renderNavbar, getNavbarStyles, initNavbar } from './components/navbar.js';

const app = document.getElementById('app');

const pages = {
    landing: { render: renderLanding, init: initLanding, hasNav: false },
    dashboard: { render: renderDashboard, init: initDashboard, hasNav: true },
    suppliers: { render: renderSuppliers, init: initSuppliers, hasNav: true },
    emissions: { render: renderEmissions, init: initEmissions, hasNav: true },
    logistics: { render: renderLogistics, init: initLogistics, hasNav: true },
    reports: { render: renderReports, init: initReports, hasNav: true },
    settings: { render: renderSettings, init: initSettings, hasNav: true },
};

function getPage() {
    const hash = window.location.hash.replace('#', '') || 'landing';
    return pages[hash] ? hash : 'landing';
}

function renderApp() {
    const pageId = getPage();
    const page = pages[pageId];

    if (page.hasNav) {
        app.innerHTML = `
      ${getNavbarStyles()}
      <div class="app-layout">
        ${renderNavbar(pageId)}
        <main class="main-content">
          ${page.render()}
        </main>
      </div>
    `;
        initNavbar();
    } else {
        app.innerHTML = page.render();
    }

    // Init page logic after render
    requestAnimationFrame(() => {
        if (page.init) page.init();
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

// Route changes
window.addEventListener('hashchange', renderApp);

// Initial render
renderApp();
