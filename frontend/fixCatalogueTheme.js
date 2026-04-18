const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const replacements = [
    [/#EEEDFE/g, "rgba(83, 74, 183, 0.15)"],
    [/#26215C/g, "var(--text-main)"],
    [/#7F77DD/g, "var(--primary-hover)"],
    [/#AFA9EC/g, "rgba(255, 255, 255, 0.1)"],
    [/#FCEBEB/g, "rgba(239, 68, 68, 0.1)"],
    [/#F09595/g, "rgba(239, 68, 68, 0.2)"],
    [/background: white;/g, "background: transparent;"],
    [/border: 0\.5px solid #e5e7eb/ig, "border: 1px solid var(--surface-border)"],
    [/box-shadow: 0 4px 6px -1px rgba\(0, 0, 0, 0\.2\);/g, "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);"]
];

replacements.forEach(([old, replaceStr]) => {
    css = css.replace(old, replaceStr);
});

fs.writeFileSync(cssPath, css, 'utf8');
console.log("Catalogue styles fixed.");
