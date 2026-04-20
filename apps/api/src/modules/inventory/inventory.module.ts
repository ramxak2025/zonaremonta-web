import { Body, Controller, Get, Module, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { ExternalInventoryProvider } from './external.interface';

@ApiTags('inventory')
@Controller('inventory')
class InventoryController {
  constructor(private readonly prisma: PrismaService) {}

  @Roles('DIRECTOR')
  @Get('parts')
  list(@Query('lowStock') lowStock?: string) {
    return this.prisma.part.findMany({
      where: lowStock === 'true' ? { stockQty: { lte: this.prisma.part.fields.minStockQty } as any } : {},
      include: { category: true },
      orderBy: { name: 'asc' },
    });
  }

  @Roles('DIRECTOR')
  @Post('parts')
  create(@Body() body: any) {
    return this.prisma.part.create({ data: body });
  }

  @Roles('DIRECTOR')
  @Patch('parts/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.prisma.part.update({ where: { id }, data: body });
  }

  @Roles('DIRECTOR')
  @Post('receipts')
  async receipt(
    @Body() body: {
      supplierId: string;
      number: string;
      date: string;
      total: number;
      items: Array<{ partId: string; qty: number; price: number }>;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.supplierInvoice.create({
        data: {
          supplierId: body.supplierId,
          number: body.number,
          date: new Date(body.date),
          total: body.total,
        },
      });
      for (const it of body.items) {
        await tx.part.update({
          where: { id: it.partId },
          data: { stockQty: { increment: it.qty } },
        });
        await tx.stockMovement.create({
          data: {
            partId: it.partId,
            type: 'RECEIPT',
            qty: it.qty,
            priceAtMove: it.price,
            invoiceId: invoice.id,
          },
        });
      }
      return invoice;
    });
  }

  @Roles('DIRECTOR')
  @Post('write-off')
  async writeOff(@Body() body: { partId: string; qty: number; reason: string }) {
    return this.prisma.$transaction(async (tx) => {
      await tx.part.update({
        where: { id: body.partId },
        data: { stockQty: { decrement: body.qty } },
      });
      return tx.stockMovement.create({
        data: {
          partId: body.partId,
          type: 'WRITE_OFF',
          qty: -body.qty,
          priceAtMove: 0,
          reason: body.reason,
        },
      });
    });
  }
}

@Module({
  controllers: [InventoryController],
  providers: [
    // Подключаемо при интеграции с 1С / МойСклад.
    { provide: ExternalInventoryProvider, useValue: null },
  ],
})
export class InventoryModule {}
