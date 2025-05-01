import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    const users = await query(
      'SELECT * FROM users WHERE session_token = $1',
      [token]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await query(
      'UPDATE users SET session_token = NULL, session_expiry = NULL WHERE session_token = $1',
      [token]
    );

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}