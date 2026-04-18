const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Update :root
css = css.replace(
    /:root \{[\s\S]*?\/\* Sizing \*\//,
    `:root {
    /* Design Tokens — Premium Dark */
    --primary: #534AB7;
    --primary-hover: #7F77DD;
    --secondary: #185FA5;
    --accent: #ef4444;
    --bg-dark: #07070a;
    --bg-sidebar: rgba(15, 15, 20, 0.95);
    --bg-card: rgba(255, 255, 255, 0.03);
    --surface-border: rgba(255, 255, 255, 0.08);
    --surface-alt: rgba(255, 255, 255, 0.05);
    --text-main: #f1f5f9;
    --text-muted: #94a3b8;
    --text-dim: #64748b;
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-glow: rgba(83, 74, 183, 0.2);

    /* Sizing */`
);

// 2. Replacements
const replacements = [
    [/#111827/g, "var(--text-main)"],
    [/#f4f6f9/g, "var(--bg-dark)"],
    [/#ffffff/g, "var(--bg-card)"],
    [/background: #0f172a;/g, "background: var(--bg-sidebar);"],
    [/color: #6b7280;/g, "color: var(--text-muted);"],
    [/color: #9ca3af;/g, "color: var(--text-dim);"],
    [/#e5e7eb/g, "var(--surface-border)"],
    [/#f9fafb/g, "var(--surface-alt)"],
    [/#f3f4f6/g, "var(--surface-alt)"],
    [/background: var\(--text-main\);/g, "background: var(--bg-card);"]
];

replacements.forEach(([old, replaceStr]) => {
    css = css.replace(old, replaceStr);
});

// Structural fixes
css = css.replace(/background-color: var\(--text-main\);/g, "background-color: var(--bg-card);");
css = css.replace(/color: var\(--bg-card\);/g, "color: var(--text-main);");
css = css.replace(/color: white;/g, "color: var(--text-main);");

// More specific fixes: HomePage glass card
css = css.replace(/background: rgba\(255,\s?255,\s?255,\s?0\.95\)/g, "var(--bg-card)");
css = css.replace(/background: white;/g, "background: var(--bg-card);");

fs.writeFileSync(cssPath, css, 'utf8');
console.log("index.css updated to premium dark mode");
