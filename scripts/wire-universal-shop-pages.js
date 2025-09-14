/*
  Replace contents of every *Page.jsx under app/ShopPage to render
  the UniversalShopPage component.
*/

const fs = require('fs');
const path = require('path');

function rewriteToUniversal(filePath) {
  const content = `'use client';
import React from 'react';
import UniversalShopPage from '@/components/UniversalShopPage';

export default function Page() {
  return <UniversalShopPage />;
}
`;
  fs.writeFileSync(filePath, content, 'utf8');
}

function run() {
  const root = process.cwd();
  const baseDir = path.join(root, 'app', 'ShopPage');
  const queue = [baseDir];
  let updated = 0;
  while (queue.length) {
    const dir = queue.pop();
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        queue.push(full);
      } else if (e.isFile() && /Page\.jsx$/.test(e.name)) {
        rewriteToUniversal(full);
        updated += 1;
        console.log('Updated', path.relative(root, full));
      }
    }
  }
  console.log('Done. Updated files:', updated);
}

run();



