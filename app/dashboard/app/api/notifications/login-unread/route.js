import { NextResponse } from 'next/server';
import API_BASE_URL from '@/lib/apiConfig';

export async function GET(request) {
  try {
    // Get auth token from headers
    const auth = request.headers.get('authorization');
    
    if (!auth) {
      return NextResponse.json(
        { unread: 0 },
        { status: 200 }
      );
    }

    // For now, return 0 as there's no notification system implemented
    // This endpoint exists to prevent 404 errors
    // The Sidebar will fall back to localStorage if needed
    return NextResponse.json(
      { unread: 0 },
      { status: 200 }
    );
  } catch (error) {
        // Return 0 on error to prevent breaking the UI
    return NextResponse.json(
      { unread: 0 },
      { status: 200 }
    );
  }
}

