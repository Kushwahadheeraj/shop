import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/simple-bills${queryString ? `?${queryString}` : ''}`;
    
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication token required' },
        { status: 401 }
      );
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
        return NextResponse.json(
      { success: false, message: 'Error fetching simple bills', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication token required' },
        { status: 401 }
      );
    }
    
            
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/simple-bills`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (fetchError) {
            return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to connect to backend server', 
          error: fetchError.message,
          backendUrl: API_BASE_URL
        },
        { status: 503 }
      );
    }

    let data;
    try {
      const responseText = await response.text();
                  
      if (responseText) {
        data = JSON.parse(responseText);
      } else {
        data = { success: false, message: 'Empty response from server' };
      }
    } catch (parseError) {
            return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid response from server', 
          error: parseError.message,
          status: response.status 
        },
        { status: response.status || 500 }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
                    return NextResponse.json(
      { 
        success: false, 
        message: 'Error creating simple bill', 
        error: error?.message || String(error) 
      },
      { status: 500 }
    );
  }
}


