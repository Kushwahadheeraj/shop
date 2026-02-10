import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication token required' },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${API_BASE_URL}/simple-bills/stats`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
        return NextResponse.json(
      { success: false, message: 'Error fetching simple bill stats', error: error.message },
      { status: 500 }
    );
  }
}


