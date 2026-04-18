const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');

const appendCss = `
/* ── Dark Mode Overrides & Missing Utilities ── */
.bg-surface { background-color: var(--bg-surface); }
.bg-surface-alt { background-color: var(--surface-alt); }
.border-surface-border { border-color: var(--surface-border); }
.text-white { color: var(--text-main); }
.text-muted { color: var(--text-muted); }

.glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-card:hover {
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
}

.auth-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.content-wrapper {
    background: #000000;
}
.sidebar {
    background: rgba(15, 15, 20, 0.95);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
}
.app-header {
    background: rgba(10, 10, 10, 0.8) !important;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
`;

fs.appendFileSync(cssPath, appendCss, 'utf8');
console.log("Utilities appended.");
