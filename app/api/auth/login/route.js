import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const db = await readDB();
    const users = db.users || [{ username: 'admin', password: 'password123' }];

    // Match credentials from db
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      const response = NextResponse.json({ success: true, message: 'Giriş başarılı.' });
      
      // Set session cookie
      response.cookies.set({
        name: 'admin_session',
        value: username,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
      });

      return response;
    }

    return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı!' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Giriş yapılırken bir hata oluştu.' }, { status: 500 });
  }
}
