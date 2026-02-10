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
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { category, imageUrl } = body;

    if (!category || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update if exists, otherwise create
    const banner = await CategoryBanner.findOneAndUpdate(
      { category },
      { imageUrl },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(banner);
  } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
