import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  const { email, password, recaptchaToken } = await request.json();

  // Проверка наличия всех обязательных полей
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

  try {
    // Проверка токена reCAPTCHA
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

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 403 }
      );
    }

    // Ищем пользователя
    const users = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Обновляем токен сессии и время последнего входа
    const sessionToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
    const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await query(
      'UPDATE users SET session_token = $1, session_expiry = $2, last_login = CURRENT_TIMESTAMP WHERE email = $3',
      [sessionToken, sessionExpiry, email]
    );

    return NextResponse.json({ token: sessionToken }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}