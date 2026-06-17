import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function PUT(request) {
  try {
    const { categoryId, type, direction, amount } = await request.json();

    if (!type || !direction || amount === undefined || amount === null) {
      return NextResponse.json({ error: 'Eksik parametreler (type, direction, amount gereklidir)' }, { status: 400 });
    }

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      return NextResponse.json({ error: 'Geçersiz miktar değeri' }, { status: 400 });
    }

    const db = await readDB();
    db.products = db.products || [];

    let updatedCount = 0;

    db.products = db.products.map(product => {
      // If categoryId is specified and not 'all', check match
      if (categoryId && categoryId !== 'all' && product.categoryId !== categoryId) {
        return product;
      }

      let newPrice = product.price;
      if (type === 'percent') {
        const factor = val / 100;
        if (direction === 'increase') {
          newPrice = product.price * (1 + factor);
        } else {
          newPrice = product.price * (1 - factor);
        }
      } else if (type === 'fixed') {
        if (direction === 'increase') {
          newPrice = product.price + val;
        } else {
          newPrice = product.price - val;
        }
      }

      // Ensure price is not negative and round to 2 decimal places
      newPrice = Math.max(0, parseFloat(newPrice.toFixed(2)));
      updatedCount++;

      return {
        ...product,
        price: newPrice
      };
    });

    await writeDB(db);

    return NextResponse.json({ success: true, message: `${updatedCount} ürün başarıyla güncellendi.`, products: db.products });
  } catch (error) {
    return NextResponse.json({ error: 'Toplu fiyat güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}
