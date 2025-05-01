import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ isAuthorized: false }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    return NextResponse.json({ isAuthorized: true }, { status: 200 });
  } catch (error) {
    console.error('Authorization check error:', error);
    return NextResponse.json({ isAuthorized: false }, { status: 401 });
  }
}