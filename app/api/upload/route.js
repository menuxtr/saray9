import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';

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

    // Generate unique name
    const fileExtension = path.extname(file.name) || '.jpg';
    const fileName = `product-${Date.now()}${fileExtension}`;

    // Check if Vercel Blob is configured (Production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(fileName, file, {
        access: 'public',
      });
      return NextResponse.json({ filePath: blob.url });
    }

    // Local Fallback (Development)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

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

