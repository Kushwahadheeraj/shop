import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import Shop from '@/lib/models/Shop';

export async function GET(request) {
  try {
    const sellerId = verifyAuth(request);
    await connectDB();

    const totalShops = await Shop.countDocuments({ createdBy: sellerId });
    const activeShops = await Shop.countDocuments({ 
      createdBy: sellerId, 
      status: 'active' 
    });
    const inactiveShops = await Shop.countDocuments({ 
      createdBy: sellerId, 
      status: 'inactive' 
    });

    const recentShops = await Shop.find({ 
      createdBy: sellerId,
      lastTransactionDate: { $exists: true }
    })
    .sort({ lastTransactionDate: -1 })
    .limit(5)
    .select('name lastTransactionDate');

    return NextResponse.json({
      success: true,
      data: {
        totalShops,
        activeShops,
        inactiveShops,
        recentShops
      }
    });
  } catch (error) {
        
    if (error.message.includes('Authentication') || error.message.includes('token')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error fetching shop statistics', error: error.message },
      { status: 500 }
    );
  }
}
