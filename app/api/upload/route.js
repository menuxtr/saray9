import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

    // If Supabase is configured, upload to Supabase Storage (Production)
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false }
      });

      // Ensure 'uploads' bucket exists and is public
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      if (listError) {
        throw new Error(`Supabase bucket listesi alınamadı: ${listError.message}`);
      }

      const bucketExists = buckets && buckets.some(b => b.id === 'uploads');
      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket('uploads', {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
          fileSizeLimit: 2097152 // 2MB
        });
        if (createError) {
          throw new Error(`Supabase bucket oluşturulamadı: ${createError.message}`);
        }
      }

      // Convert file to buffer for upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload file to 'uploads' bucket
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Supabase'e dosya yüklenemedi: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      return NextResponse.json({ filePath: publicUrlData.publicUrl });
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
    return NextResponse.json({ 
      error: `Dosya yüklenirken bir hata oluştu: ${error.message}` 
    }, { status: 500 });
  }
}

