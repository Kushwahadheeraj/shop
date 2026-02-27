import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'https://shop-backend-qf50.onrender.com/api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/bills/stats${queryString ? `?${queryString}` : ''}`;
    
    const token = request.headers.get('authorization');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
        return NextResponse.json(
      { success: false, message: 'Error fetching bill statistics' },
      { status: 500 }
    );
  }
}
