import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    const dataPath = path.resolve(process.cwd(), 'data', 'hsn.json');
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ success: false, error: 'HSN data not generated yet. Run: npm run parse:hsn' }, { status: 404 });
    }
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
