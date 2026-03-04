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
import { renderDashboard, initDashboard, cleanupDashboard } from './pages/dashboard.js';
import { renderSuppliers, initSuppliers, cleanupSuppliers } from './pages/suppliers.js';
import { renderEmissions, initEmissions, cleanupEmissions } from './pages/emissions.js';
import { renderLogistics, initLogistics, cleanupLogistics } from './pages/logistics.js';
import { renderReports, initReports } from './pages/reports.js';
import { renderSettings, initSettings } from './pages/settings.js';

// Components
import { renderNavbar, getNavbarStyles, initNavbar } from './components/navbar.js';
import { initGlobalSearch } from './components/search.js';

// Simulation engine
import { simulation, store, loadSettings, saveSettings } from './data/simulationEngine.js';

// Expose settings helpers globally for navbar dark mode toggle
window._gscg = { saveSettings, loadSettings };

const app = document.getElementById('app');

const pages = {
    landing: { render: renderLanding, init: initLanding, hasNav: false, cleanup: null },
    dashboard: { render: renderDashboard, init: initDashboard, hasNav: true, cleanup: cleanupDashboard },
    suppliers: { render: renderSuppliers, init: initSuppliers, hasNav: true, cleanup: cleanupSuppliers },
    emissions: { render: renderEmissions, init: initEmissions, hasNav: true, cleanup: cleanupEmissions },
    logistics: { render: renderLogistics, init: initLogistics, hasNav: true, cleanup: cleanupLogistics },
    reports: { render: renderReports, init: initReports, hasNav: true, cleanup: null },
    settings: { render: renderSettings, init: initSettings, hasNav: true, cleanup: null },
};

let currentPageId = null;

function getPage() {
    const hash = window.location.hash.replace('#', '') || 'landing';
    return pages[hash] ? hash : 'landing';
}

function renderApp() {
    // Clean up previous page
    if (currentPageId && pages[currentPageId]?.cleanup) {
        try { pages[currentPageId].cleanup(); } catch (_) {}
    }

    const pageId = getPage();
    const page = pages[pageId];
    currentPageId = pageId;

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

// Apply dark mode from settings before first render
const _initSettings = loadSettings();
if (_initSettings.darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// Init simulation engine
simulation.init();
simulation.start();

// Handle simulation speed changes from settings
document.addEventListener('gscg:speed', (e) => {
    simulation.restart(e.detail.speed);
});

// Route changes
window.addEventListener('hashchange', renderApp);

// Initial render
renderApp();

// Init global search (after initial render)
requestAnimationFrame(() => {
    initGlobalSearch();
});
