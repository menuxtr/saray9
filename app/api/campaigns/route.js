import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = await readDB();
  return NextResponse.json(db.campaigns || []);
}

export async function POST(request) {
  try {
    const { 
      title, title_en, title_ar, 
      description, description_en, description_ar, 
      image, startDate, endDate, isActive,
      price, originalPrice
    } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Kampanya başlığı zorunludur.' }, { status: 400 });
    }

    const db = await readDB();
    const newCampaign = {
      id: 'c' + Date.now().toString(),
      title,
      title_en: title_en || '',
      title_ar: title_ar || '',
      description: description || '',
      description_en: description_en || '',
      description_ar: description_ar || '',
      image: image || '',
      startDate: startDate || '',
      endDate: endDate || '',
      isActive: isActive !== undefined ? isActive : true,
      price: price !== undefined && price !== null ? Number(price) : null,
      originalPrice: originalPrice !== undefined && originalPrice !== null ? Number(originalPrice) : null
    };

    db.campaigns = db.campaigns || [];
    db.campaigns.push(newCampaign);
    await writeDB(db);

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Kampanya oluşturulurken bir hata oluştu.' }, { status: 500 });
  }
}
