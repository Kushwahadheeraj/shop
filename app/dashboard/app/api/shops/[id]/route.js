import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import Shop from '@/lib/models/Shop';
import Bill from '@/lib/models/Bill';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const shop = await Shop.findById(id);
    if (!shop) {
      return NextResponse.json(
        { success: false, message: 'Shop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: shop
    });
  } catch (error) {
        return NextResponse.json(
      { success: false, message: 'Error fetching shop', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();
    const {
      name,
      address,
      contact,
      location,
      business,
      financial,
      status,
      notes
    } = body;

    const shop = await Shop.findById(id);
    if (!shop) {
      return NextResponse.json(
        { success: false, message: 'Shop not found' },
        { status: 404 }
      );
    }

    if (name) shop.name = name;
    if (address) shop.address = address;
    if (contact) shop.contact = { ...shop.contact, ...contact };
    if (location) shop.location = { ...shop.location, ...location };
    if (business) shop.business = { ...shop.business, ...business };
    if (financial) shop.financial = { ...shop.financial, ...financial };
    if (status) shop.status = status;
    if (notes !== undefined) shop.notes = notes;

    await shop.save();

    return NextResponse.json({
      success: true,
      message: 'Shop updated successfully',
      data: shop
    });
  } catch (error) {
        return NextResponse.json(
      { success: false, message: 'Error updating shop', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const shop = await Shop.findById(id);
    if (!shop) {
      return NextResponse.json(
        { success: false, message: 'Shop not found' },
        { status: 404 }
      );
    }

    // Check if shop has any bills
    const billCount = await Bill.countDocuments({ shopId: id });
    
    if (billCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete shop with existing bills. Please delete all bills first.' },
        { status: 400 }
      );
    }

    await Shop.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Shop deleted successfully'
    });
  } catch (error) {
        return NextResponse.json(
      { success: false, message: 'Error deleting shop', error: error.message },
      { status: 500 }
    );
  }
}
