import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    const authResponse = await fetch('http://localhost:3000/api/auth/check', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!authResponse.ok) {
      return NextResponse.json({ error: 'Authorization check failed' }, { status: 401 });
    }

    const authData = await authResponse.json();

    if (!authData.isAuthorized || !authData.userId) {
      return NextResponse.json({ error: 'Invalid token or userId missing' }, { status: 401 });
    }

    const userId = authData.userId;

    // Fetch saved images from the database
    const queryText = 'SELECT uuid FROM saved WHERE owner = $1';
    const values = [userId];
    const results = await query(queryText, values);

    const imageUrls = results.map((row) => `/media/saved/${row.uuid}.png`);

    return NextResponse.json({ images: imageUrls }, { status: 200 });
  } catch (error) {
    console.error('Error fetching saved images:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}