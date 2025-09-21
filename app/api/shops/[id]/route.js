import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';

export async function GET(request, { params }) {
  try {
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${API_BASE_URL}/shops/${params.id}`, {
      method: 'GET',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching shop:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching shop' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${API_BASE_URL}/shops/${params.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating shop' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${API_BASE_URL}/shops/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting shop' },
      { status: 500 }
    );
  }
}
