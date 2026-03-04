// ============================================
// SPARKLINE — Mini inline canvas sparklines
// ============================================

export function renderSparkline(id, width = 80, height = 30) {
    return `<canvas class="sparkline-canvas" id="sparkline-${id}" width="${width}" height="${height}" style="vertical-align:middle"></canvas>`;
}

export function drawSparkline(id, data, color = '#10b981') {
    const canvas = document.getElementById(`sparkline-${id}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (!data || data.length < 2) return;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pad = 2;
    const step = (W - pad * 2) / (data.length - 1);

    // Fill gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + '44');
    grad.addColorStop(1, color + '08');

    ctx.beginPath();
    ctx.moveTo(pad, H - pad - ((data[0] - min) / range) * (H - pad * 2));
    data.forEach((v, i) => {
        const x = pad + i * step;
        const y = H - pad - ((v - min) / range) * (H - pad * 2);
        ctx.lineTo(x, y);
    });
    const lastX = pad + (data.length - 1) * step;
    ctx.lineTo(lastX, H);
    ctx.lineTo(pad, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(pad, H - pad - ((data[0] - min) / range) * (H - pad * 2));
    data.forEach((v, i) => {
        const x = pad + i * step;
        const y = H - pad - ((v - min) / range) * (H - pad * 2);
        ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // End dot
    const lastY = H - pad - ((data[data.length - 1] - min) / range) * (H - pad * 2);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}
