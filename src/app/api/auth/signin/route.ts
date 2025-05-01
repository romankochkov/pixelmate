import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

interface User {
  email: string;
  password: string;
  session_token?: string;
  session_expiry?: Date;
  last_login?: Date;
}

const RECAPTCHA_THRESHOLD = parseFloat(process.env.RECAPTCHA_THRESHOLD || '0.5');

export async function POST(request: NextRequest) {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('Environment variable JWT_SECRET is missing');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error('Environment variable RECAPTCHA_SECRET_KEY is missing');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const { email, password, recaptchaToken } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    const recaptchaResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      }
    );

    if (!recaptchaResponse.ok) {
      console.error('Error requesting reCAPTCHA API:', recaptchaResponse.statusText);
      return NextResponse.json(
        { error: 'reCAPTCHA verification error' },
        { status: 503 }
      );
    }

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < RECAPTCHA_THRESHOLD) {
      console.warn('reCAPTCHA verification failed:', recaptchaData);
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 403 }
      );
    }

    const users: User[] = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Incorrect email or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Incorrect email or password' },
        { status: 401 }
      );
    }

    const sessionToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    try {
      await query(
        'UPDATE users SET session_token = $1, session_expiry = $2, last_login = CURRENT_TIMESTAMP WHERE email = $3',
        [sessionToken, sessionExpiry, email]
      );
    } catch (dbError) {
      console.error('Error updating session in database:', dbError);
      return NextResponse.json(
        { error: 'Server error while updating session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ token: sessionToken }, { status: 200 });
  } catch (error) {
    console.error('Authorization error:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}