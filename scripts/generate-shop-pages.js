/*
  Script: generate-shop-pages.js
  Purpose: For every subfolder (recursively) under app/ShopPage, create a
  <FolderName>Page.jsx file where <FolderName> is the folder name converted to
  PascalCase with spaces and non-alphanumerics removed.
*/

const fs = require('fs');
const path = require('path');

function toPascalCase(input) {
  return String(input)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function ensureCategoryPageFiles() {
  const projectRoot = process.cwd();
  const shopPageDir = path.join(projectRoot, 'app', 'ShopPage');

  if (!fs.existsSync(shopPageDir)) {
    console.error('Directory not found:', shopPageDir);
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;

  function processDirectoryRecursively(directoryPath) {
    // Create a Page component for the current directory itself
    const folderName = path.basename(directoryPath);
    const pascal = toPascalCase(folderName);
    const targetFile = path.join(directoryPath, `${pascal}Page.jsx`);

    if (fs.existsSync(targetFile)) {
      skipped += 1;
    } else {
      const fileContents = [
        `'use client';`,
        `import React from 'react';`,
        ``,
        `export default function ${pascal}Page() {`,
        `  return (`,
        `    <div className="category-page">`,
        `      <h1>${folderName}</h1>`,
        `    </div>`,
        `  );`,
        `}`,
        ``,
      ].join('\n');

      fs.writeFileSync(targetFile, fileContents, 'utf8');
      created += 1;
      console.log('Created', path.relative(projectRoot, targetFile));
    }

    // Recurse into subdirectories
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
    const subDirs = entries.filter((e) => e.isDirectory());
    for (const subDir of subDirs) {
      processDirectoryRecursively(path.join(directoryPath, subDir.name));
    }
  }

  processDirectoryRecursively(shopPageDir);

  console.log(`Done. Created: ${created}, Skipped (already existed): ${skipped}`);
}

ensureCategoryPageFiles();


