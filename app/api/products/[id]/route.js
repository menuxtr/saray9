import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, name_en, name_ar, description, description_en, description_ar, price, originalPrice, categoryId, image } = await request.json();
    
    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: 'Ad, fiyat ve kategori zorunludur.' }, { status: 400 });
    }

    const db = await readDB();
    db.products = db.products || [];
    
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Ürün bulunamadı.' }, { status: 404 });
    }

    db.products[index] = {
      ...db.products[index],
      name,
      name_en: name_en !== undefined ? name_en : db.products[index].name_en,
      name_ar: name_ar !== undefined ? name_ar : db.products[index].name_ar,
      description: description || '',
      description_en: description_en !== undefined ? description_en : db.products[index].description_en,
      description_ar: description_ar !== undefined ? description_ar : db.products[index].description_ar,
      price: parseFloat(price),
      originalPrice: originalPrice !== undefined ? (originalPrice ? parseFloat(originalPrice) : null) : db.products[index].originalPrice,
      categoryId,
      image: image || db.products[index].image,
    };

    await writeDB(db);
    return NextResponse.json(db.products[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Ürün güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await readDB();
    db.products = db.products || [];
    
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Ürün bulunamadı.' }, { status: 404 });
    }

    const deletedProduct = db.products.splice(index, 1)[0];
    await writeDB(db);
    
    return NextResponse.json({ message: 'Ürün silindi.', product: deletedProduct });
  } catch (error) {
    return NextResponse.json({ error: 'Ürün silinirken bir hata oluştu.' }, { status: 500 });
  }
}
