import { Controller, Get, Module, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('catalog')
@Controller('catalog')
class CatalogController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get('categories')
  categories() {
    return this.prisma.partCategory.findMany({ orderBy: { name: 'asc' } });
  }

  @Public()
  @Get('parts')
  list(@Query('category') category?: string, @Query('q') q?: string) {
    return this.prisma.part.findMany({
      where: {
        isActive: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
      },
      include: { category: true },
      orderBy: { name: 'asc' },
      take: 200,
    });
  }

  @Public()
  @Get('parts/:sku')
  byId(@Param('sku') sku: string) {
    return this.prisma.part.findUnique({ where: { sku }, include: { category: true } });
  }

  @Public()
  @Get('services')
  services() {
    return this.prisma.service.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  }
}

@Module({ controllers: [CatalogController] })
export class CatalogModule {}
