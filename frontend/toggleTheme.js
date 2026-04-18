const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace the current dark :root with a correct Light Theme :root and a [data-theme='dark'] theme
css = css.replace(/:root \{[\s\S]*?\/\* Sizing \*\//, `:root {
    /* Design Tokens — Light Theme (Default) */
    --primary: #534AB7;
    --primary-hover: #3C3489;
    --secondary: #185FA5;
    --accent: #A32D2D;
    
    --bg-dark: #f4f6f9;
    --bg-sidebar: #ffffff;
    --bg-card: rgba(255, 255, 255, 0.95);
    --bg-surface: #ffffff;
    --surface-alt: #f8fafc;
    --surface-border: #e2e8f0;

    --text-main: #0f172a;
    --text-muted: #475569;
    --text-dim: #94a3b8;
    
    --glass-border: rgba(0, 0, 0, 0.08);
    --glass-glow: rgba(83, 74, 183, 0.08);

    --header-bg: linear-gradient(135deg, var(--primary) 0%, #3C3489 100%);
    --card-hover-bg: rgba(255, 255, 255, 1);
    
    /* Sizing */`);

// Add [data-theme='dark'] right after the :root block (before * { margin: 0 })
css = css.replace(/\* \{/, `[data-theme="dark"] {
    /* Design Tokens — Premium Dark Theme */
    --primary: #534AB7;
    --primary-hover: #7F77DD;
    --secondary: #185FA5;
    --accent: #ef4444;

    --bg-dark: #07070a;
    --bg-sidebar: rgba(15, 15, 20, 0.95);
    --bg-card: rgba(255, 255, 255, 0.03);
    --bg-surface: #111111;
    --surface-alt: rgba(255, 255, 255, 0.05);
    --surface-border: rgba(255, 255, 255, 0.08);

    --text-main: #f1f5f9;
    --text-muted: #94a3b8;
    --text-dim: #64748b;

    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-glow: rgba(83, 74, 183, 0.2);

    --header-bg: rgba(10, 10, 10, 0.8);
    --card-hover-bg: rgba(255, 255, 255, 0.05);
}

* {`);

// Now replace hardcoded dark variables introduced previously in utility classes
css = css.replace(/\.glass-card \{[\s\S]*?\}/, `.glass-card {
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
}`);

css = css.replace(/\.glass-card:hover \{[\s\S]*?\}/, `.glass-card:hover {
    border-color: var(--primary);
    background: var(--card-hover-bg);
}`);

css = css.replace(/\.auth-card \{[\s\S]*?\}/, `.auth-card {
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
}`);

css = css.replace(/\.content-wrapper \{[\s\S]*?background: #000000;[\s\S]*?\}/, `.content-wrapper { background: var(--bg-dark); }`);
css = css.replace(/\.sidebar \{[\s\S]*?background: rgba\(15, 15, 20, 0\.95\);[\s\S]*?\}/, `.sidebar {
    background: var(--bg-sidebar);
    border-right: 1px solid var(--surface-border);
}`);
css = css.replace(/\.app-header \{[\s\S]*?background: rgba\(10, 10, 10, 0\.8\) !important;[\s\S]*?\}/, `.app-header {
    background: var(--header-bg) !important;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--surface-border);
}`);

// Also fix existing .app-header which had linear-gradient
css = css.replace(/background: linear-gradient\(135deg, var\(--primary\) 0%, #3C3489 100%\);/g, "background: var(--header-bg);");

fs.writeFileSync(cssPath, css, 'utf8');
console.log("index.css updated for Light/Dark variables.");
