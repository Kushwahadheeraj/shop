import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CategoryBanner from '@/lib/models/CategoryBanner';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (category) {
      // Case-insensitive search
      const banner = await CategoryBanner.findOne({ 
        category: { $regex: new RegExp(`^${category}$`, 'i') } 
      });
      return NextResponse.json(banner || null);
    }

    const banners = await CategoryBanner.find({});
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching category banners:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
