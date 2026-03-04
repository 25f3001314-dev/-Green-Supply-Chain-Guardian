// ============================================
// LIVE INDICATOR — Blinking green dot "● Live"
// ============================================

export function renderLiveIndicator(label = 'Live') {
    return `<span class="live-indicator"><span class="live-dot"></span>${label}</span>`;
}

export function getLiveIndicatorStyles() {
    return `
    <style id="live-indicator-style">
      .live-indicator {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        color: #059669;
        background: #ecfdf5;
        border: 1px solid #a7f3d0;
        border-radius: 9999px;
        padding: 4px 10px;
        letter-spacing: 0.04em;
        user-select: none;
      }
      .live-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        animation: livePulse 1.5s ease-in-out infinite;
        flex-shrink: 0;
      }
      @keyframes livePulse {
        0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
        50% { opacity: 0.6; box-shadow: 0 0 0 5px rgba(16,185,129,0); }
      }
    </style>
  `;
}
