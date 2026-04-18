const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');

const appendCss = `
/* ── Semantic Colors ── */
.text-success { color: #10b981; }
.text-warning { color: #f59e0b; }
.text-danger { color: #ef4444; }
.bg-success\\/10 { background-color: rgba(16, 185, 129, 0.1); }
.bg-warning\\/10 { background-color: rgba(245, 158, 11, 0.1); }
.bg-danger\\/10 { background-color: rgba(239, 68, 68, 0.1); }
`;

fs.appendFileSync(cssPath, appendCss, 'utf8');
console.log("Colors appended.");
