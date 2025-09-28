const fs = require('fs');
const path = require('path');

// Resolve project root regardless of where the script is called from
const root = path.join(__dirname, '..');
const baseDir = path.join(root, 'app', 'Dashboard', 'ProductAdd');

function listForms(dir) {
  let out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(listForms(p));
    else if (entry.isFile() && entry.name === 'ProductForm.jsx') out.push(p);
  }
  return out;
}

function updateForm(filePath) {
  if (!fs.existsSync(filePath)) return { filePath, status: 'missing' };
  let src = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1) Add minPrice/maxPrice to initial form state if not present
  if (!/minPrice\s*:/.test(src) || !/maxPrice\s*:/.test(src)) {
    src = src.replace(
      /(useState\(product\s*\|\|\s*\{[\s\S]*?)(\n\s*totalProduct:|\n\s*sku:|\n\s*category:)/,
      (m, a, b) => `${a}\n    minPrice: '',\n    maxPrice: '',${b}`
    );
    changed = true;
  }

  // 2) Add inputs (Min/Max Price) if not present
  if (!/name="minPrice"/.test(src) || !/name="maxPrice"/.test(src)) {
    src = src.replace(
      /(<label className=\"block text-sm font-medium mb-1\">(?:Fix Price|Discounted Price)[^]*?<\/div>)/,
      (m) =>
        m +
        `\n        <div>\n          <label className=\"block text-sm font-medium mb-1\">Min Price (optional)<\/label>\n          <Input name=\"minPrice\" type=\"number\" value={form.minPrice} onChange={handleChange} placeholder=\"Min Price\" />\n        <\/div>\n        <div>\n          <label className=\"block text-sm font-medium mb-1\">Max Price (optional)<\/label>\n          <Input name=\"maxPrice\" type=\"number\" value={form.maxPrice} onChange={handleChange} placeholder=\"Max Price\" />\n        <\/div>\n`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, src, 'utf8');
    return { filePath, status: 'updated' };
  }
  return { filePath, status: 'skipped' };
}

const forms = listForms(baseDir);
const results = forms.map(updateForm);

console.log('Results:');
results.forEach(r => console.log(`[${r.status}] ${r.filePath}`));