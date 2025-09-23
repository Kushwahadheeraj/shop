import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/gst-shops${queryString ? `?${queryString}` : ''}`;
    const token = request.headers.get('authorization');
    const response = await fetch(url, { headers: { 'Authorization': token || '' } });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching GST shops' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');
    const response = await fetch(`${API_BASE_URL}/gst-shops`, {
      method: 'POST',
      headers: { 'Authorization': token || '', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error creating GST shop' }, { status: 500 });
  }
}


