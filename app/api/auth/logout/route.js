import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Çıkış yapıldı.' });
  
  response.cookies.set({
    name: 'admin_session',
    value: '',
    path: '/',
    expires: new Date(0),
  });

  return response;
}
