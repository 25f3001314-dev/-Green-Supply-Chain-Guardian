// ============================================
// SKELETON — Loading shimmer skeletons
// ============================================

export function renderSkeleton(type = 'card', count = 1) {
    const templates = {
        card: `<div class="skeleton-card"><div class="skeleton-line skeleton-lg"></div><div class="skeleton-line skeleton-md"></div><div class="skeleton-line skeleton-sm"></div></div>`,
        stat: `<div class="skeleton-stat"><div class="skeleton-circle"></div><div style="flex:1"><div class="skeleton-line skeleton-lg"></div><div class="skeleton-line skeleton-sm"></div></div></div>`,
        row: `<div class="skeleton-row"><div class="skeleton-line" style="width:30%"></div><div class="skeleton-line" style="width:20%"></div><div class="skeleton-line" style="width:15%"></div><div class="skeleton-line" style="width:25%"></div></div>`,
        text: `<div class="skeleton-line"></div>`,
    };
    const tpl = templates[type] || templates.card;
    return Array(count).fill(tpl).join('');
}

export function getSkeletonStyles() {
    return `
    <style id="skeleton-style">
      .skeleton-card { padding: 1.5rem; border-radius: 16px; background: #fff; border: 1px solid rgba(226,232,240,0.8); margin-bottom: 1rem; }
      .skeleton-stat { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; border-radius: 16px; background: #fff; border: 1px solid rgba(226,232,240,0.8); }
      .skeleton-row { display: flex; gap: 1rem; padding: 0.75rem 1.5rem; align-items: center; border-bottom: 1px solid rgba(226,232,240,0.8); }
      .skeleton-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; width: 100%; margin-bottom: 8px; }
      .skeleton-line:last-child { margin-bottom: 0; }
      .skeleton-lg { width: 60%; height: 18px; }
      .skeleton-md { width: 80%; }
      .skeleton-sm { width: 40%; }
      .skeleton-circle { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; flex-shrink: 0; }
      @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    </style>
  `;
}
