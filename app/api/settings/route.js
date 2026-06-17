import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = await readDB();
  const settings = db.settings || { 
    welcomeLogo: '', 
    welcomeDesc: 'Eşsiz baharatlar ve taze malzemelerle hazırlanan saray lezzetlerine hoş geldiniz.',
    welcomeDesc_en: '',
    welcomeDesc_ar: ''
  };
  return NextResponse.json(settings);
}

export async function POST(request) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie || sessionCookie.value !== 'admin') {
      return NextResponse.json({ error: 'Yalnızca birincil admin kullanıcısı bu ayarları değiştirebilir.' }, { status: 403 });
    }

    const { welcomeLogo, welcomeDesc, welcomeDesc_en, welcomeDesc_ar } = await request.json();
    const db = await readDB();
    
    db.settings = db.settings || {};
    db.settings.welcomeLogo = welcomeLogo !== undefined ? welcomeLogo : db.settings.welcomeLogo;
    db.settings.welcomeDesc = welcomeDesc !== undefined ? welcomeDesc : db.settings.welcomeDesc;
    db.settings.welcomeDesc_en = welcomeDesc_en !== undefined ? welcomeDesc_en : db.settings.welcomeDesc_en;
    db.settings.welcomeDesc_ar = welcomeDesc_ar !== undefined ? welcomeDesc_ar : db.settings.welcomeDesc_ar;
    
    await writeDB(db);
    return NextResponse.json(db.settings);
  } catch (error) {
    return NextResponse.json({ error: 'Ayarlar güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}

