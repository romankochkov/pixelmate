import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'No authorization code' }, { status: 400 });
    }

    try {
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const userInfo = await client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo',
        });

        const { email, sub: googleId } = userInfo.data as { email: string; sub: string };

        // Проверяем, есть ли пользователь
        let user = await query('SELECT * FROM users WHERE email = $1 OR google_id = $2', [email, googleId]);

        const sessionToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        if (user.length === 0) {
            // Регистрируем нового пользователя
            await query(
                'INSERT INTO users (email, google_id, session_token, session_expiry) VALUES ($1, $2, $3, $4)',
                [email, googleId, sessionToken, sessionExpiry]
            );
        } else {
            // Обновляем существующего пользователя
            await query(
                'UPDATE users SET google_id = $1, session_token = $2, session_expiry = $3, last_login = CURRENT_TIMESTAMP WHERE email = $4',
                [googleId, sessionToken, sessionExpiry, email]
            );
        }

        // Редирект на главную страницу с токеном
        const response = NextResponse.redirect('http://localhost:3000');
        response.cookies.set('token', sessionToken, { httpOnly: true, expires: sessionExpiry });
        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Authorization error' }, { status: 500 });
    }
}