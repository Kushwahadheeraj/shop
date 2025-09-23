/*
  Parse gst_hsn.pdf into structured JSON.
  Output: data/hsn.json
*/

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const INPUT_PDF = path.resolve(__dirname, '..', 'gst_hsn.pdf');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'data');
const OUTPUT_JSON = path.join(OUTPUT_DIR, 'hsn.json');

async function readPdfText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer, { pagerender: undefined });
  return data.text;
}

function normalizeWhitespace(text) {
  return text.replace(/\r/g, '').replace(/\t/g, ' ').replace(/ +/g, ' ').trim();
}

// Improved parser: accumulate multi-line descriptions until next code, then extract GST rate from the accumulated block.
function parseHSNFromText(rawText) {
  const lines = rawText.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const items = [];

  const codeLineRegex = /^(\d{4,8})(?:\s*[.:\-)–—]\s*)?(.*)$/; // 4-8 digit code, optional separators, then rest
  const rateGlobalRegex = /(\b(?:0|3|5|12|18|28)\s*%\b)/g; // find all GST slabs in a block

  let current = null;

  const flush = () => {
    if (!current) return;
    const block = normalizeWhitespace(current.block.join(' '));

    // Extract GST rate: pick the highest slab mentioned in the block, else null
    let rate = null;
    const matches = Array.from(block.matchAll(rateGlobalRegex)).map(m => parseInt(m[1]));
    if (matches.length > 0) {
      rate = matches.sort((a, b) => b - a)[0];
    }

    let description = block;
    if (rate != null) description = description.replace(rateGlobalRegex, '').trim();

    items.push({
      code: current.code,
      description,
      gstRate: rate != null ? rate : null,
      category: null
    });
    current = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = normalizeWhitespace(lines[i]);

    const isCode = line.match(codeLineRegex);
    if (isCode) {
      const code = isCode[1];
      const tail = isCode[2] ? isCode[2].trim() : '';

      // Skip chapter headers like 01, 02 etc which are not 4+ digits
      if (code.length < 4) continue;

      // On new code line, flush previous block
      if (current) flush();
      current = { code, block: [] };
      if (tail) current.block.push(tail);
      continue;
    }

    if (current) {
      // Continuation of description
      current.block.push(line);
    }
  }

  // Flush last entry
  if (current) flush();

  // Deduplicate by code: prefer longer description and non-null rate
  const byCode = new Map();
  for (const item of items) {
    const prev = byCode.get(item.code);
    if (!prev) {
      byCode.set(item.code, item);
    } else {
      const prevLen = prev.description ? prev.description.length : 0;
      const nextLen = item.description ? item.description.length : 0;
      if (nextLen > prevLen) prev.description = item.description;
      if (prev.gstRate == null && item.gstRate != null) prev.gstRate = item.gstRate;
    }
  }

  // Filter out obviously bad descriptions
  const result = Array.from(byCode.values()).filter(x => x.description && x.description.length > 3);
  return result;
}

async function main() {
  if (!fs.existsSync(INPUT_PDF)) {
    console.error('Input PDF not found:', INPUT_PDF);
    process.exit(1);
  }

  console.log('Reading PDF:', INPUT_PDF);
  const text = await readPdfText(INPUT_PDF);
  console.log('Extracting HSN entries...');
  const data = parseHSNFromText(text);
  console.log(`Parsed entries: ${data.length}`);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(data, null, 2));
  console.log('Saved JSON to:', OUTPUT_JSON);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


