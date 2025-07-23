import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dirPath = path.join(process.cwd(), 'app', 'Dashboard', 'ProductAdd', 'Electrical', 'ELCBsRCCBs');
  let categories = [];
  try {
    categories = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (e) {
    // fallback: empty
  }
  res.status(200).json({ categories });
} 