import { BadRequestException, Body, Controller, Get, Module, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Prisma } from '@prisma/client';
import { publicSettingsSchema, type PublicSettings } from '@05auto/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

const PUBLIC_KEYS = Object.keys(publicSettingsSchema.shape) as Array<keyof PublicSettings>;

@ApiTags('settings')
@Controller('settings')
class SettingsController {
  constructor(private readonly prisma: PrismaService) {}

  /** Публичные настройки — нестрогий парс + отсечка невалидных ключей. */
  @Public()
  @Get('public')
  async publicSettings(): Promise<PublicSettings> {
    const rows = await this.prisma.setting.findMany({
      where: { key: { in: PUBLIC_KEYS } },
    });
    const raw: Record<string, unknown> = {};
    for (const r of rows) raw[r.key] = r.value;
    return publicSettingsSchema.parse(raw);
  }

  /** Все настройки — только директор. */
  @Roles('DIRECTOR')
  @Get()
  all() {
    return this.prisma.setting.findMany({ orderBy: { key: 'asc' } });
  }

  /** Одна настройка (upsert). */
  @Roles('DIRECTOR')
  @Put(':key')
  async update(
    @Param('key') key: string,
    @Body() body: { value: Prisma.InputJsonValue },
  ) {
    this.validatePublicKey(key, body.value);
    return this.prisma.setting.upsert({
      where: { key },
      update: { value: body.value },
      create: { key, value: body.value },
    });
  }

  /** Массовое обновление. */
  @Roles('DIRECTOR')
  @Put()
  async bulk(@Body() body: Record<string, Prisma.InputJsonValue>) {
    const entries = Object.entries(body);
    for (const [key, value] of entries) this.validatePublicKey(key, value);
    await this.prisma.$transaction(
      entries.map(([key, value]) =>
        this.prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );
    return { ok: true, updated: entries.length };
  }

  /**
   * Публичные ключи валидируем через zod — все остальные (служебные, напр. site.coordinates)
   * пропускаем без структурной проверки, но директор не сможет их сюда передать случайно.
   */
  private validatePublicKey(key: string, value: unknown): void {
    if (!(PUBLIC_KEYS as string[]).includes(key)) return;
    const fieldSchema = (publicSettingsSchema.shape as Record<string, { safeParse: (v: unknown) => { success: boolean } }>)[key];
    const result = fieldSchema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(`Невалидное значение для "${key}"`);
    }
  }
}

@Module({ controllers: [SettingsController] })
export class SettingsModule {}
