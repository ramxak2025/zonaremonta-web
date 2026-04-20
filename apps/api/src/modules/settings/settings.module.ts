import { Body, Controller, Get, Module, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

/** Ключи публичных настроек — доступны анонимно для фронта. */
const PUBLIC_KEYS = new Set([
  'hero.title',
  'hero.subtitle',
  'hero.imageUrl',
  'hero.badge',
  'hero.primaryCta',
  'hero.stats.payback',
  'hero.stats.savings',
  'fuel.ai92.price',
  'fuel.ai95.price',
  'fuel.ai98.price',
  'fuel.ai100.price',
  'fuel.lpg.price',
  'calc.gasOverheadPct',
  'calc.defaultInstallPrice',
  'reviews.yandex.url',
  'reviews.yandex.rating',
  'reviews.yandex.count',
  'site.phone',
  'site.whatsapp',
  'site.max',
  'site.yandexMapsLink',
  'site.address',
  'site.workingHours',
]);

@ApiTags('settings')
@Controller('settings')
class SettingsController {
  constructor(private readonly prisma: PrismaService) {}

  /** Публичные настройки — для фронта (SSR + ISR). */
  @Public()
  @Get('public')
  async public() {
    const keys = [...PUBLIC_KEYS];
    const rows = await this.prisma.setting.findMany({ where: { key: { in: keys } } });
    const result: Record<string, unknown> = {};
    for (const r of rows) result[r.key] = r.value;
    return result;
  }

  /** Все настройки — только директор. */
  @Roles('DIRECTOR')
  @Get()
  async all() {
    const rows = await this.prisma.setting.findMany({ orderBy: { key: 'asc' } });
    return rows;
  }

  /** Обновить одну настройку — только директор. */
  @Roles('DIRECTOR')
  @Put(':key')
  async update(@Param('key') key: string, @Body() body: { value: unknown }) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value: body.value as object },
      create: { key, value: body.value as object },
    });
  }

  /** Массовое обновление. */
  @Roles('DIRECTOR')
  @Put()
  async bulk(@Body() body: Record<string, unknown>) {
    const entries = Object.entries(body);
    await this.prisma.$transaction(
      entries.map(([key, value]) =>
        this.prisma.setting.upsert({
          where: { key },
          update: { value: value as object },
          create: { key, value: value as object },
        }),
      ),
    );
    return { ok: true, updated: entries.length };
  }
}

@Module({ controllers: [SettingsController] })
export class SettingsModule {}
