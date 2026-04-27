import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { STORAGE_PATHS } from '@/lib/content';
import { isAdmin } from '@/lib/admin-auth';

/**
 * POST /api/admin/upload
 * multipart/form-data:
 *   - file: <File>      обязательно
 *   - kind: 'work-cover' | 'work-process'  опционально (для группировки)
 *
 * Конвертирует в три формата (avif + webp + jpg) с тремя размерами:
 *   - thumb: 600px (для превью)
 *   - regular: 1200px (для отдачи в браузер по умолчанию)
 *   - large: 2000px (Retina, original quality)
 *
 * Возвращает:
 *   {
 *     ok: true,
 *     id: '<uuid>',
 *     urls: {
 *       thumb:   '/uploads/works/<id>/thumb.avif',
 *       regular: '/uploads/works/<id>/regular.avif',
 *       large:   '/uploads/works/<id>/large.avif'
 *     },
 *     // основной URL для использования в content (Next.js Image сам выберет формат):
 *     primary: '/uploads/works/<id>/regular.jpg'
 *   }
 */

const MAX_BYTES = 12 * 1024 * 1024; // 12 МБ
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/avif']);

interface SizeSpec {
  name: 'thumb' | 'regular' | 'large';
  width: number;
}

const SIZES: SizeSpec[] = [
  { name: 'thumb',   width: 600 },
  { name: 'regular', width: 1200 },
  { name: 'large',   width: 2000 },
];

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: 'multipart/form-data required' }, { status: 400 });

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file required' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: `file too large (max ${MAX_BYTES / 1024 / 1024} MB)` }, { status: 400 });
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: `unsupported type: ${file.type}` }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const id = randomUUID().slice(0, 8);
  const dir = path.join(STORAGE_PATHS.uploadsDir, 'works', id);
  await fs.mkdir(dir, { recursive: true });

  // sharp ставит autorotate с EXIF; ужимает до целевой ширины (никогда не увеличивает)
  const base = sharp(buffer).rotate();

  await Promise.all(
    SIZES.flatMap((sz) => [
      base.clone().resize({ width: sz.width, withoutEnlargement: true, fit: 'inside' })
        .avif({ quality: 60 }).toFile(path.join(dir, `${sz.name}.avif`)),
      base.clone().resize({ width: sz.width, withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: 82 }).toFile(path.join(dir, `${sz.name}.webp`)),
      base.clone().resize({ width: sz.width, withoutEnlargement: true, fit: 'inside' })
        .jpeg({ quality: 85, mozjpeg: true, progressive: true }).toFile(path.join(dir, `${sz.name}.jpg`)),
    ]),
  );

  const baseUrl = `/uploads/works/${id}`;
  return NextResponse.json({
    ok: true,
    id,
    primary: `${baseUrl}/regular.jpg`,
    urls: {
      thumb:   `${baseUrl}/regular.avif`,
      regular: `${baseUrl}/regular.avif`,
      large:   `${baseUrl}/large.avif`,
    },
  });
}
