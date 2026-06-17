import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, name_en, name_ar, icon } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Kategori adı zorunludur.' }, { status: 400 });
    }

    const db = await readDB();
    db.categories = db.categories || [];
    
    const index = db.categories.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Kategori bulunamadı.' }, { status: 404 });
    }

    db.categories[index] = {
      ...db.categories[index],
      name,
      name_en: name_en !== undefined ? name_en : db.categories[index].name_en,
      name_ar: name_ar !== undefined ? name_ar : db.categories[index].name_ar,
      icon: icon || db.categories[index].icon,
    };

    await writeDB(db);
    return NextResponse.json(db.categories[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Kategori güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await readDB();
    db.categories = db.categories || [];
    
    const index = db.categories.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Kategori bulunamadı.' }, { status: 404 });
    }

    // Remove the category
    const deletedCategory = db.categories.splice(index, 1)[0];

    // Also remove or update products in this category to prevent orphans
    db.products = db.products || [];
    db.products = db.products.filter(p => p.categoryId !== id);

    await writeDB(db);
    return NextResponse.json({ message: 'Kategori ve bağlı tüm ürünler silindi.', category: deletedCategory });
  } catch (error) {
    return NextResponse.json({ error: 'Kategori silinirken bir hata oluştu.' }, { status: 500 });
  }
}
