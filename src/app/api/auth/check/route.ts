import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db'; // Import your query function

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ isAuthorized: false }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { email: string };

    // Query the database to get the userId based on the email from the token
    const users = await query('SELECT id FROM users WHERE email = $1', [decoded.email]);
    if (users.length === 0) {
      return NextResponse.json({ isAuthorized: false }, { status: 401 });
    }

    const userId = users[0].id;

    return NextResponse.json({ isAuthorized: true, userId }, { status: 200 });
  } catch (error) {
    console.error('Authorization check error:', error);
    return NextResponse.json({ isAuthorized: false }, { status: 401 });
  }
}