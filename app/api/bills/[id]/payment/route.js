import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication token required' },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${API_BASE_URL}/bills/${id}/payment`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error adding payment:', error);
    return NextResponse.json(
      { success: false, message: 'Error adding payment', error: error.message },
      { status: 500 }
    );
  }
}
