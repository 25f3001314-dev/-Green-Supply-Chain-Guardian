// ============================================
// CHARTS — Reusable Chart.js Wrappers
// ============================================
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const chartTheme = {
    fontFamily: "'Inter', sans-serif",
    colors: {
        primary: '#10b981',
        primaryLight: '#34d399',
        secondary: '#14b8a6',
        accent: '#f59e0b',
        danger: '#ef4444',
        grid: 'rgba(226, 232, 240, 0.5)',
        text: '#64748b',
        textDark: '#334155',
    }
};

const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                font: { family: chartTheme.fontFamily, size: 12, weight: '500' },
                color: chartTheme.colors.text,
                usePointStyle: true,
                pointStyleWidth: 8,
                padding: 16,
            },
        },
        tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: chartTheme.fontFamily, size: 13, weight: '600' },
            bodyFont: { family: chartTheme.fontFamily, size: 12 },
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
            boxPadding: 4,
        },
    },
};

export function createLineChart(canvasId, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: datasets.map(ds => ({
                ...ds,
                borderWidth: 2.5,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
                tension: 0.4,
                fill: ds.fill !== undefined ? ds.fill : false,
                ...ds,
            })),
        },
        options: {
            ...baseOptions,
            ...options,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { family: chartTheme.fontFamily, size: 11 }, color: chartTheme.colors.text },
                },
                y: {
                    grid: { color: chartTheme.colors.grid },
                    ticks: { font: { family: chartTheme.fontFamily, size: 11 }, color: chartTheme.colors.text },
                    border: { display: false },
                },
                ...(options.scales || {}),
            },
        },
    });
}

export function createBarChart(canvasId, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: datasets.map(ds => ({
                borderRadius: 6,
                borderSkipped: false,
                barThickness: options.horizontal ? 16 : undefined,
                maxBarThickness: 40,
                ...ds,
            })),
        },
        options: {
            ...baseOptions,
            ...options,
            indexAxis: options.horizontal ? 'y' : 'x',
            scales: {
                x: {
                    grid: { display: options.horizontal ? true : false, color: chartTheme.colors.grid },
                    ticks: { font: { family: chartTheme.fontFamily, size: 11 }, color: chartTheme.colors.text },
                    border: { display: false },
                },
                y: {
                    grid: { display: options.horizontal ? false : true, color: chartTheme.colors.grid },
                    ticks: { font: { family: chartTheme.fontFamily, size: 11 }, color: chartTheme.colors.text },
                    border: { display: false },
                },
                ...(options.scales || {}),
            },
        },
    });
}

export function createDoughnutChart(canvasId, labels, data, colors, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                borderWidth: 0,
                hoverBorderWidth: 2,
                hoverBorderColor: '#fff',
                spacing: 2,
            }],
        },
        options: {
            ...baseOptions,
            ...options,
            cutout: '68%',
            plugins: {
                ...baseOptions.plugins,
                legend: {
                    ...baseOptions.plugins.legend,
                    position: 'bottom',
                },
                ...(options.plugins || {}),
            },
        },
    });
}

export { Chart, chartTheme };
