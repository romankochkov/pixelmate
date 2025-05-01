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

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Проверяем, существует ли пользователь
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Создаем пользователя
    const sessionToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
    const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await query(
      'INSERT INTO users (email, password, session_token, session_expiry) VALUES ($1, $2, $3, $4)',
      [email, hashedPassword, sessionToken, sessionExpiry]
    );

    return NextResponse.json({ token: sessionToken }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}