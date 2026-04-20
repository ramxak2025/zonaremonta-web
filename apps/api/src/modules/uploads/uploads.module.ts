import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import {
  BadRequestException,
  Controller,
  Module,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import sharp from 'sharp';
import { Roles } from '../../common/decorators/roles.decorator';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const MAX_MB = Number(process.env.MAX_UPLOAD_MB ?? 10);

interface UploadedImage {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

@ApiTags('uploads')
@Controller('uploads')
class UploadsController {
  @Roles('CLIENT', 'MASTER', 'DIRECTOR')
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_MB * 1024 * 1024 },
    }),
  )
  async uploadImage(@UploadedFile() file: UploadedImage) {
    if (!file) throw new BadRequestException('Файл не передан');
    if (!ALLOWED.has(file.mimetype)) throw new BadRequestException('Недопустимый формат');
    // magic bytes
    const head = file.buffer.subarray(0, 12);
    const isJpeg = head[0] === 0xff && head[1] === 0xd8;
    const isPng = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
    const isWebp =
      head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46 &&
      head[8] === 0x57 && head[9] === 0x45 && head[10] === 0x42 && head[11] === 0x50;
    if (!isJpeg && !isPng && !isWebp) throw new BadRequestException('Недопустимое содержимое');

    const base = process.env.UPLOADS_DIR ?? '/var/lib/05auto/uploads';
    const today = new Date().toISOString().slice(0, 10);
    const dir = join(base, today);
    await mkdir(dir, { recursive: true });

    const id = randomUUID();
    const webp = await sharp(file.buffer).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    const thumb = await sharp(file.buffer).rotate().resize({ width: 480 }).webp({ quality: 78 }).toBuffer();
    const webpPath = join(dir, `${id}.webp`);
    const thumbPath = join(dir, `${id}.thumb.webp`);
    await writeFile(webpPath, webp);
    await writeFile(thumbPath, thumb);

    return {
      url: `/uploads/${today}/${id}.webp`,
      thumbUrl: `/uploads/${today}/${id}.thumb.webp`,
      originalName: file.originalname,
      ext: extname(file.originalname),
    };
  }
}

@Module({ controllers: [UploadsController] })
export class UploadsModule {}
