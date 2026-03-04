// ============================================
// CONFETTI — Celebration animation
// ============================================

const COLORS = ['#10b981', '#059669', '#34d399', '#14b8a6', '#f59e0b', '#60a5fa', '#a78bfa'];

function randBetween(min, max) { return Math.random() * (max - min) + min; }

class ConfettiParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }
    reset() {
        this.x = randBetween(0, this.canvas.width);
        this.y = randBetween(-20, -this.canvas.height * 0.5);
        this.w = randBetween(6, 14);
        this.h = randBetween(3, 7);
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.rot = randBetween(0, Math.PI * 2);
        this.vx = randBetween(-2, 2);
        this.vy = randBetween(3, 8);
        this.vrot = randBetween(-0.1, 0.1);
        this.opacity = 1;
        this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rot += this.vrot;
        this.vy += 0.08;
        if (this.y > this.canvas.height + 20) this.reset();
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
        }
        ctx.restore();
    }
}

let _confettiInstance = null;

export function launchConfetti(durationMs = 3500) {
    if (_confettiInstance) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = Array.from({ length: 120 }, () => new ConfettiParticle(canvas));
    let raf;
    let startTime = performance.now();

    function frame(now) {
        const elapsed = now - startTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(ctx); });
        // Fade out in last 800ms
        if (elapsed > durationMs - 800) {
            const fadeProgress = (elapsed - (durationMs - 800)) / 800;
            canvas.style.opacity = String(1 - fadeProgress);
        }
        if (elapsed < durationMs) {
            raf = requestAnimationFrame(frame);
        } else {
            canvas.remove();
            _confettiInstance = null;
        }
    }

    raf = requestAnimationFrame(frame);
    _confettiInstance = { raf, canvas };
}
