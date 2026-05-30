import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadDir, filename);

    // we ensure the directory exists, but Next.js public exists by default
    // we'll just write it
    await writeFile(filepath, buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
