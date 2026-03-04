// ============================================
// MODAL — Reusable modal component
// ============================================

export function renderModal(id, title, content, { size = 'md', footer = '' } = {}) {
    const widths = { sm: '420px', md: '560px', lg: '720px', xl: '900px' };
    return `
    <div class="modal-overlay" id="${id}" style="display:none" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
      <div class="modal" style="max-width:${widths[size] || widths.md}">
        <div class="modal-header">
          <h2 id="${id}-title" style="font-size:var(--fs-lg)">${title}</h2>
          <button class="modal-close" data-close-modal="${id}" aria-label="Close">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">${content}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    </div>
  `;
}

export function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = 'flex';
        el.removeAttribute('aria-hidden');
        requestAnimationFrame(() => el.querySelector('.modal')?.classList.add('modal-enter'));
    }
}

export function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

export function initModalCloseHandlers() {
    document.addEventListener('click', (e) => {
        // Close button
        const closeBtn = e.target.closest('[data-close-modal]');
        if (closeBtn) {
            closeModal(closeBtn.dataset.closeModal);
            return;
        }
        // Click on overlay backdrop
        if (e.target.classList.contains('modal-overlay')) {
            e.target.style.display = 'none';
        }
    });
    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay[style*="flex"]').forEach(el => {
                el.style.display = 'none';
            });
        }
    });
}

export function getModalStyles() {
    return `
    <style id="modal-styles">
      .modal-body { padding: var(--space-6); }
      .modal-footer { padding: var(--space-4) var(--space-6); border-top: 1px solid var(--border-light); display: flex; justify-content: flex-end; gap: var(--space-3); }
      .modal-enter { animation: modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
      @keyframes modalIn { from { opacity: 0; transform: scale(0.92) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    </style>
  `;
}
