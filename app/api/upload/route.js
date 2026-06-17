import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Dosya seçilmedi.' }, { status: 400 });
    }

    // Check size limit: 2MB
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Dosya boyutu 2MB\'den büyük olamaz.' }, { status: 400 });
    }

    // Read file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique name
    const fileExtension = path.extname(file.name) || '.jpg';
    const fileName = `product-${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Write file to filesystem
    fs.writeFileSync(filePath, buffer);

    const relativePath = `/uploads/${fileName}`;
    return NextResponse.json({ filePath: relativePath });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Dosya yüklenirken bir hata oluştu.' }, { status: 500 });
  }
}
