import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  
  const db = await readDB();
  let products = db.products || [];
  
  if (categoryId) {
    products = products.filter(p => p.categoryId === categoryId);
  }
  
  return NextResponse.json(products);
}

export async function POST(request) {
  try {
    const { name, name_en, name_ar, description, description_en, description_ar, price, originalPrice, categoryId, image } = await request.json();
    
    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: 'Ad, fiyat ve kategori zorunludur.' }, { status: 400 });
    }

    const db = await readDB();
    const newProduct = {
      id: 'p' + Date.now().toString(),
      name,
      name_en: name_en || '',
      name_ar: name_ar || '',
      description: description || '',
      description_en: description_en || '',
      description_ar: description_ar || '',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      categoryId,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
    };

    db.products = db.products || [];
    db.products.push(newProduct);
    await writeDB(db);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Ürün oluşturulurken bir hata oluştu.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { orderedIds } = await request.json();
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds dizisi zorunludur.' }, { status: 400 });
    }

    const db = await readDB();
    const products = db.products || [];

    const reorderedProducts = [];
    orderedIds.forEach(id => {
      const prod = products.find(p => p.id === id);
      if (prod) {
        reorderedProducts.push(prod);
      }
    });

    // Keep any products not present in orderedIds
    products.forEach(prod => {
      if (!reorderedProducts.some(p => p.id === prod.id)) {
        reorderedProducts.push(prod);
      }
    });

    db.products = reorderedProducts;
    await writeDB(db);

    return NextResponse.json(db.products);
  } catch (error) {
    return NextResponse.json({ error: 'Ürün sıralaması güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}
