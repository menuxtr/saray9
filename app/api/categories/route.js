import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = await readDB();
  return NextResponse.json(db.categories || []);
}

export async function POST(request) {
  try {
    const { name, name_en, name_ar, icon } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Kategori adı gereklidir.' }, { status: 400 });
    }

    const db = await readDB();
    const newCategory = {
      id: Date.now().toString(),
      name,
      name_en: name_en || '',
      name_ar: name_ar || '',
      icon: icon || 'Utensils',
    };

    db.categories = db.categories || [];
    db.categories.push(newCategory);
    await writeDB(db);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Kategori oluşturulurken bir hata oluştu.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { orderedIds } = await request.json();
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds dizisi zorunludur.' }, { status: 400 });
    }

    const db = await readDB();
    const categories = db.categories || [];

    const reorderedCategories = [];
    orderedIds.forEach(id => {
      const cat = categories.find(c => c.id === id);
      if (cat) {
        reorderedCategories.push(cat);
      }
    });

    // Keep any categories not present in orderedIds
    categories.forEach(cat => {
      if (!reorderedCategories.some(c => c.id === cat.id)) {
        reorderedCategories.push(cat);
      }
    });

    db.categories = reorderedCategories;
    await writeDB(db);

    return NextResponse.json(db.categories);
  } catch (error) {
    return NextResponse.json({ error: 'Kategori sıralaması güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}
