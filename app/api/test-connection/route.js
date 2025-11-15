import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        MONGO_URI_set: !!mongoUri,
        MONGO_URI_preview: mongoUri ? mongoUri.replace(/:[^:@]+@/, ':****@') : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV,
      },
      connection: {
        status: 'not_attempted',
        error: null
      }
    };

    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        message: 'MONGO_URI is not set in environment variables',
        diagnostics
      }, { status: 500 });
    }

    try {
      console.log('🔄 Test endpoint - Attempting MongoDB connection...');
      await connectDB();
      console.log('✅ Test endpoint - MongoDB connection successful');
      
      diagnostics.connection.status = 'success';
      
      return NextResponse.json({
        success: true,
        message: 'MongoDB connection successful',
        diagnostics
      });
    } catch (dbError) {
      console.error('❌ Test endpoint - MongoDB connection failed:', dbError);
      
      diagnostics.connection.status = 'failed';
      diagnostics.connection.error = {
        name: dbError.name,
        message: dbError.message,
        code: dbError.code
      };
      
      return NextResponse.json({
        success: false,
        message: 'MongoDB connection failed',
        diagnostics,
        error: dbError.message,
        errorName: dbError.name,
        errorCode: dbError.code
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error in test endpoint',
      error: error.message
    }, { status: 500 });
  }
}

