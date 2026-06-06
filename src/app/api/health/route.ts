import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Health check endpoint
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
