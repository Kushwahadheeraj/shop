import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), 'app', 'Dashboard', 'ProductAdd', 'Electrical', 'ELCBsRCCBs');
    let categories = [];
    
    try {
      categories = fs.readdirSync(dirPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    } catch (e) {
      // fallback: empty
    }
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

