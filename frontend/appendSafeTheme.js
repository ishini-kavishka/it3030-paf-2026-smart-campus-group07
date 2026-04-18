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
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
}

.glass-card:hover {
    border-color: var(--primary);
    background: var(--card-hover-bg);
}

.auth-card {
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
}

.content-wrapper { background: var(--bg-dark); }
.sidebar {
    background: var(--bg-sidebar);
    border-right: 1px solid var(--surface-border);
}
.app-header {
    background: var(--header-bg) !important;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--surface-border);
}

/* ── Semantic Colors ── */
.text-success { color: #10b981; }
.text-warning { color: #f59e0b; }
.text-danger { color: #ef4444; }
.bg-success\\/10 { background-color: rgba(16, 185, 129, 0.1); }
.bg-warning\\/10 { background-color: rgba(245, 158, 11, 0.1); }
.bg-danger\\/10 { background-color: rgba(239, 68, 68, 0.1); }
`;

fs.appendFileSync(cssPath, appendCss, 'utf8');
console.log("Safe Utilities appended.");
