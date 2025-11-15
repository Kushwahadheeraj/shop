import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import Client from '@/lib/models/Client';

export async function GET(request) {
  try {
    const sellerId = verifyAuth(request);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');
    const search = searchParams.get('search');

    const query = { sellerId };
    if (shopId) query.shopId = shopId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { gstin: { $regex: search, $options: 'i' } }
      ];
    }

    const clients = await Client.find(query).sort({ name: 1 });

    return NextResponse.json({ success: true, data: { clients } });
  } catch (error) {
    console.error('Error listing clients:', error);
    
    if (error.message.includes('Authentication') || error.message.includes('token')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error listing clients', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const sellerId = verifyAuth(request);
    await connectDB();

    const body = await request.json();
    const client = new Client({ ...body, sellerId });
    await client.save();

    return NextResponse.json({ success: true, data: { client } }, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    
    if (error.message.includes('Authentication') || error.message.includes('token')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error creating client', error: error.message },
      { status: 500 }
    );
  }
}


