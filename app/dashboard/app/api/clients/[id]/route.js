import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import Client from '@/lib/models/Client';

// Mark as dynamic to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const sellerId = verifyAuth(request);
    await connectDB();
    const { id } = await params;

    const client = await Client.findOne({ _id: id, sellerId });
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { client } });
  } catch (error) {
        
    if (error.message.includes('Authentication') || error.message.includes('token')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error getting client', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const sellerId = verifyAuth(request);
    await connectDB();
    const { id } = await params;

    const body = await request.json();
    const updateData = { ...body };
    delete updateData.sellerId;

    const client = await Client.findOneAndUpdate(
      { _id: id, sellerId },
      updateData,
      { new: true }
    );

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { client } });
  } catch (error) {
        
    if (error.message.includes('Authentication') || error.message.includes('token')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error updating client', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const sellerId = verifyAuth(request);
    await connectDB();
    const { id } = await params;

    const client = await Client.findOneAndDelete({ _id: id, sellerId });
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
        
    if (error.message.includes('Authentication') || error.message.includes('token')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error deleting client', error: error.message },
      { status: 500 }
    );
  }
}


