// ============================================
// LANDING PAGE — Hero, Features, Stats, CTA
// ============================================
import { features, landingStats, testimonials } from '../data/mockData.js';

export function renderLanding() {
    return `
    <div class="landing-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg">
          <img src="/images/hero-bg.png" alt="" class="hero-bg-img" />
          <div class="hero-overlay"></div>
        </div>
        <nav class="hero-nav container">
          <div class="hero-nav-brand">
            <span class="logo-icon-hero">🌿</span>
            <span class="hero-brand-text">Green Supply Chain Guardian</span>
          </div>
          <div class="hero-nav-links">
            <a href="#features-section" class="hero-link">Features</a>
            <a href="#stats-section" class="hero-link">Impact</a>
            <a href="#testimonials-section" class="hero-link">Testimonials</a>
            <a href="#dashboard" class="btn btn-primary btn-lg hero-cta-btn">Launch Dashboard →</a>
          </div>
          <button class="hero-mobile-toggle" id="heroMobileToggle">☰</button>
        </nav>
        <div class="hero-content container">
          <div class="hero-badge animate-fade-in-up">
            <span class="hero-badge-dot"></span>
            AI-Powered Sustainability Platform
          </div>
          <h1 class="hero-title animate-fade-in-up stagger-1">
            Transform Your<br />
            <span class="hero-title-accent">Supply Chain</span><br />
            Sustainability
          </h1>
          <p class="hero-subtitle animate-fade-in-up stagger-2">
            Monitor carbon emissions, score supplier ESG performance, and optimize your logistics — all powered by machine learning for a greener tomorrow.
          </p>
          <div class="hero-actions animate-fade-in-up stagger-3">
            <a href="#dashboard" class="btn btn-primary btn-lg">
              <span>Explore Dashboard</span>
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#features-section" class="btn btn-secondary btn-lg hero-btn-secondary">
              <span>View Features</span>
            </a>
          </div>
          <div class="hero-metrics animate-fade-in-up stagger-4">
            <div class="hero-metric">
              <span class="hero-metric-value">34%</span>
              <span class="hero-metric-label">Avg. Carbon Reduction</span>
            </div>
            <div class="hero-metric-divider"></div>
            <div class="hero-metric">
              <span class="hero-metric-value">500+</span>
              <span class="hero-metric-label">Enterprise Clients</span>
            </div>
            <div class="hero-metric-divider"></div>
            <div class="hero-metric">
              <span class="hero-metric-value">A+</span>
              <span class="hero-metric-label">CDP Rating</span>
            </div>
          </div>
        </div>
        <div class="hero-scroll-indicator animate-float">
          <svg width="24" height="24" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section" id="stats-section">
        <div class="container">
          <div class="stats-grid">
            ${landingStats.map((stat, i) => `
              <div class="stat-item animate-fade-in-up stagger-${i + 1}">
                <span class="stat-number" data-target="${stat.value}">${stat.value}${stat.suffix}</span>
                <span class="stat-text">${stat.label}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section" id="features-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Features</span>
            <h2 class="section-heading">Everything You Need for a <br /><span class="text-accent">Sustainable Supply Chain</span></h2>
            <p class="section-desc">Comprehensive tools to measure, manage, and minimize your environmental impact across the entire value chain.</p>
          </div>
          <div class="features-grid">
            ${features.map((f, i) => `
              <div class="feature-card card animate-fade-in-up stagger-${i + 1}">
                <div class="feature-icon">${f.icon}</div>
                <h3 class="feature-title">${f.title}</h3>
                <p class="feature-desc">${f.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">How It Works</span>
            <h2 class="section-heading">From Data to <span class="text-accent">Decarbonization</span></h2>
          </div>
          <div class="how-steps">
            <div class="how-step card">
              <div class="how-step-num">01</div>
              <h3>Connect</h3>
              <p>Integrate your supply chain data sources — ERP, logistics, procurement — in minutes via our API.</p>
            </div>
            <div class="how-connector">→</div>
            <div class="how-step card">
              <div class="how-step-num">02</div>
              <h3>Analyze</h3>
              <p>Our AI engine maps emissions across Scope 1, 2 & 3, identifies hotspots and scores suppliers.</p>
            </div>
            <div class="how-connector">→</div>
            <div class="how-step card">
              <div class="how-step-num">03</div>
              <h3>Optimize</h3>
              <p>Act on AI recommendations to reduce emissions, switch to greener routes, and improve compliance.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="testimonials-section" id="testimonials-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Trusted By Leaders</span>
            <h2 class="section-heading">What Our <span class="text-accent">Clients</span> Say</h2>
          </div>
          <div class="testimonials-grid">
            ${testimonials.map((t, i) => `
              <div class="testimonial-card glass-card animate-fade-in-up stagger-${i + 1}">
                <div class="testimonial-quote">"${t.quote}"</div>
                <div class="testimonial-author">
                  <div class="testimonial-avatar">${t.avatar}</div>
                  <div>
                    <div class="testimonial-name">${t.author}</div>
                    <div class="testimonial-role">${t.role}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-card">
            <img src="/images/supplier-scene.png" alt="" class="cta-bg-img" />
            <div class="cta-overlay"></div>
            <div class="cta-content">
              <h2>Ready to Green Your Supply Chain?</h2>
              <p>Join 500+ enterprises already reducing their carbon footprint with AI-powered insights.</p>
              <div class="cta-actions">
                <a href="#dashboard" class="btn btn-primary btn-lg">Start Free Trial</a>
                <a href="#features-section" class="btn btn-secondary btn-lg cta-btn-outline">Schedule Demo</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-logo">🌿 <span>GSCG</span></div>
              <p>AI-powered sustainability platform for modern supply chains.</p>
            </div>
            <div class="footer-links">
              <h4>Product</h4>
              <a href="#features-section">Features</a>
              <a href="#dashboard">Dashboard</a>
              <a href="#">Integrations</a>
              <a href="#">Pricing</a>
            </div>
            <div class="footer-links">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
            <div class="footer-links">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">API Reference</a>
              <a href="#">Case Studies</a>
              <a href="#">Support</a>
            </div>
          </div>
          <div class="footer-bottom">
            <p>© 2026 Green Supply Chain Guardian. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `;
}

export function initLanding() {
    const toggle = document.getElementById('heroMobileToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const links = document.querySelector('.hero-nav-links');
            if (links) links.classList.toggle('open');
        });
    }
}
