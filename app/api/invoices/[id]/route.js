import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import Invoice from '@/lib/models/Invoice';
import { sanitizeItems, calculateTotals, normalizePayment } from '@/lib/invoiceHelpers';

export async function GET(request, { params }) {
  try {
    const sellerId = verifyAuth(request);
    await connectDB();
    const { id } = await params;

    const invoice = await Invoice.findOne({
      _id: id,
      createdBy: sellerId,
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    
    if (error.message.includes('Authentication') || error.message.includes('token')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error fetching invoice', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const sellerId = verifyAuth(request);
    await connectDB();
    const { id } = await params;

    const invoice = await Invoice.findOne({
      _id: id,
      createdBy: sellerId,
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    const items = sanitizeItems(body.items);
    if (!items.length) {
      return NextResponse.json(
        { success: false, message: 'At least one item is required' },
        { status: 400 }
      );
    }

    const totals = calculateTotals(items, body.pricing);
    const payment = normalizePayment(body.payment, totals.totalAmount);

    invoice.templateId = body.templateId || invoice.templateId;
    invoice.shopName = body.shopName || invoice.shopName;
    invoice.shopAddress = body.shopAddress || invoice.shopAddress;
    invoice.shopPhone = body.shopPhone || invoice.shopPhone;
    invoice.shopEmail = body.shopEmail || invoice.shopEmail;
    invoice.customerName = body.customerName || invoice.customerName;
    invoice.customerAddress = body.customerAddress || invoice.customerAddress;
    invoice.customerPhone = body.customerPhone || invoice.customerPhone;
    invoice.customerEmail = body.customerEmail || invoice.customerEmail;
    invoice.invoiceDate = body.billDate || body.invoiceDate || invoice.invoiceDate;
    invoice.dueDate = body.dueDate || invoice.dueDate;
    invoice.notes = body.notes !== undefined ? body.notes : invoice.notes;
    invoice.items = items;
    invoice.pricing = totals;
    invoice.payment = payment;

    await invoice.save();

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice,
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    
    if (error.message.includes('Authentication') || error.message.includes('token')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error updating invoice', error: error.message },
      { status: 500 }
    );
  }
}


