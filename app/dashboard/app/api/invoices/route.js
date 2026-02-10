import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import Invoice from '@/lib/models/Invoice';
import { sanitizeItems, calculateTotals, normalizePayment } from '@/lib/invoiceHelpers';

export async function GET(request) {
  try {
    const sellerId = verifyAuth(request);
    
    try {
      await connectDB();
    } catch (dbError) {
            return NextResponse.json(
        { success: false, message: 'Database connection failed. Please check MONGO_URI environment variable.', error: dbError.message },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 25, 100);
    const sort = searchParams.get('sort') === 'asc' ? 1 : -1;

    const invoices = await Invoice.find({ createdBy: sellerId })
      .sort({ createdAt: sort })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: invoices,
    });
  } catch (error) {
            
    if (error.message.includes('Authentication') || error.message.includes('token') || error.message.includes('JWT')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    if (error.message.includes('MONGO_URI') || error.message.includes('Mongo')) {
      return NextResponse.json(
        { success: false, message: 'Database configuration error. Please check MONGO_URI environment variable.', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error fetching invoices', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const sellerId = verifyAuth(request);
    await connectDB();

    const body = await request.json();

    const items = sanitizeItems(body.items);
    if (!items.length) {
      return NextResponse.json(
        { success: false, message: 'At least one item is required' },
        { status: 400 }
      );
    }

    if (!body.shopName || !body.shopAddress) {
      return NextResponse.json(
        { success: false, message: 'Shop name and address are required' },
        { status: 400 }
      );
    }

    if (!body.customerName) {
      return NextResponse.json(
        { success: false, message: 'Customer name is required' },
        { status: 400 }
      );
    }

    const totals = calculateTotals(items, body.pricing);
    const payment = normalizePayment(body.payment, totals.totalAmount);

    const invoice = new Invoice({
      invoiceNumber: body.invoiceNumber,
      templateId: body.templateId || 'default',
      shopName: body.shopName,
      shopAddress: body.shopAddress,
      shopPhone: body.shopPhone || '',
      shopEmail: body.shopEmail || '',
      customerName: body.customerName,
      customerAddress: body.customerAddress || '',
      customerPhone: body.customerPhone || '',
      customerEmail: body.customerEmail || '',
      invoiceDate: body.billDate || body.invoiceDate || new Date(),
      dueDate: body.dueDate || null,
      notes: body.notes || '',
      items,
      pricing: totals,
      payment,
      createdBy: sellerId,
    });

    await invoice.save();

    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice,
    }, { status: 201 });
  } catch (error) {
        
    if (error.message.includes('Authentication') || error.message.includes('token')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error creating invoice', error: error.message },
      { status: 500 }
    );
  }
}


