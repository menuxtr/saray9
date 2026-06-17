import { NextResponse } from 'next/server';

export async function GET(request) {
  const sessionCookie = request.cookies.get('admin_session');
  
  if (sessionCookie && sessionCookie.value) {
    return NextResponse.json({ authenticated: true, username: sessionCookie.value });
  }
  
  return NextResponse.json({ authenticated: false });
}
