import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

// GET: List users (mask passwords)
export async function GET() {
  const db = await readDB();
  const users = db.users || [{ username: 'admin', password: 'password123' }];
  const maskedUsers = users.map(u => ({ username: u.username }));
  return NextResponse.json(maskedUsers);
}

// POST: Add new user
export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre zorunludur.' }, { status: 400 });
    }

    const db = await readDB();
    db.users = db.users || [{ username: 'admin', password: 'password123' }];

    // Check if user already exists
    if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return NextResponse.json({ error: 'Bu kullanıcı adı zaten mevcut.' }, { status: 400 });
    }

    db.users.push({ username, password });
    await writeDB(db);

    return NextResponse.json({ success: true, username });
  } catch (error) {
    return NextResponse.json({ error: 'Kullanıcı eklenirken hata oluştu.' }, { status: 500 });
  }
}

// PUT: Change password
export async function PUT(request) {
  try {
    const { username, newPassword } = await request.json();
    if (!username || !newPassword) {
      return NextResponse.json({ error: 'Kullanıcı adı ve yeni şifre zorunludur.' }, { status: 400 });
    }

    const db = await readDB();
    db.users = db.users || [{ username: 'admin', password: 'password123' }];

    const userIndex = db.users.findIndex(u => u.username === username);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    db.users[userIndex].password = newPassword;
    await writeDB(db);

    return NextResponse.json({ success: true, message: 'Şifre güncellendi.' });
  } catch (error) {
    return NextResponse.json({ error: 'Şifre güncellenirken hata oluştu.' }, { status: 500 });
  }
}

// DELETE: Remove user
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Kullanıcı adı belirtilmedi.' }, { status: 400 });
    }

    if (username.toLowerCase() === 'admin') {
      return NextResponse.json({ error: 'Birincil admin hesabı silinemez!' }, { status: 400 });
    }

    const db = await readDB();
    db.users = db.users || [{ username: 'admin', password: 'password123' }];

    const userIndex = db.users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (userIndex === -1) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    db.users.splice(userIndex, 1);
    await writeDB(db);

    return NextResponse.json({ success: true, message: 'Kullanıcı silindi.' });
  } catch (error) {
    return NextResponse.json({ error: 'Kullanıcı silinirken hata oluştu.' }, { status: 500 });
  }
}
