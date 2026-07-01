import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
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
    db.campaigns = db.campaigns || [];

    const index = db.campaigns.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Kampanya bulunamadı.' }, { status: 404 });
    }

    db.campaigns[index] = {
      ...db.campaigns[index],
      title,
      title_en: title_en !== undefined ? title_en : db.campaigns[index].title_en,
      title_ar: title_ar !== undefined ? title_ar : db.campaigns[index].title_ar,
      description: description !== undefined ? description : db.campaigns[index].description,
      description_en: description_en !== undefined ? description_en : db.campaigns[index].description_en,
      description_ar: description_ar !== undefined ? description_ar : db.campaigns[index].description_ar,
      image: image !== undefined ? image : db.campaigns[index].image,
      startDate: startDate !== undefined ? startDate : db.campaigns[index].startDate,
      endDate: endDate !== undefined ? endDate : db.campaigns[index].endDate,
      isActive: isActive !== undefined ? isActive : db.campaigns[index].isActive,
      price: price !== undefined ? (price !== null ? Number(price) : null) : db.campaigns[index].price,
      originalPrice: originalPrice !== undefined ? (originalPrice !== null ? Number(originalPrice) : null) : db.campaigns[index].originalPrice,
    };

    await writeDB(db);
    return NextResponse.json(db.campaigns[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Kampanya güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await readDB();
    db.campaigns = db.campaigns || [];

    const index = db.campaigns.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Kampanya bulunamadı.' }, { status: 404 });
    }

    const deletedCampaign = db.campaigns.splice(index, 1)[0];
    await writeDB(db);

    return NextResponse.json({ message: 'Kampanya silindi.', campaign: deletedCampaign });
  } catch (error) {
    return NextResponse.json({ error: 'Kampanya silinirken bir hata oluştu.' }, { status: 500 });
  }
}
