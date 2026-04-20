import {
  Body,
  Controller,
  Get,
  Module,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PrismaService } from '../../prisma/prisma.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { ExternalInventoryProvider } from './external.interface';

class PartUpsertDto {
  @IsString() @Length(1, 60) sku!: string;
  @IsString() @Length(1, 200) name!: string;
  @IsUUID() categoryId!: string;
  @IsOptional() @IsString() manufacturer?: string;
  @IsNumber() @Min(0) costPrice!: number;
  @IsNumber() @Min(0) retailPrice!: number;
  @IsInt() @Min(0) stockQty!: number;
  @IsOptional() @IsInt() @Min(0) minStockQty?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

class PartPatchDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsString() manufacturer?: string;
  @IsOptional() @IsNumber() @Min(0) costPrice?: number;
  @IsOptional() @IsNumber() @Min(0) retailPrice?: number;
  @IsOptional() @IsInt() @Min(0) minStockQty?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

class ReceiptItemDto {
  @IsUUID() partId!: string;
  @IsInt() @IsPositive() qty!: number;
  @IsNumber() @Min(0) price!: number;
}

class ReceiptDto {
  @IsUUID() supplierId!: string;
  @IsString() @Length(1, 60) number!: string;
  @IsString() date!: string;
  @IsNumber() @Min(0) total!: number;
  @ValidateNested({ each: true }) @Type(() => ReceiptItemDto) items!: ReceiptItemDto[];
}

class WriteOffDto {
  @IsUUID() partId!: string;
  @IsInt() @IsPositive() qty!: number;
  @IsString() @Length(1, 500) reason!: string;
}

@ApiTags('inventory')
@Controller('inventory')
class InventoryController {
  constructor(private readonly prisma: PrismaService) {}

  @Roles('DIRECTOR')
  @Get('parts')
  list(@Query('lowStock') lowStock?: string) {
    const where: Prisma.PartWhereInput =
      lowStock === 'true'
        ? { stockQty: { lte: this.prisma.part.fields.minStockQty } }
        : {};
    return this.prisma.part.findMany({
      where,
      include: { category: true },
      orderBy: { name: 'asc' },
    });
  }

  @Roles('DIRECTOR')
  @Post('parts')
  create(@Body() body: PartUpsertDto) {
    return this.prisma.part.create({
      data: {
        sku: body.sku,
        name: body.name,
        categoryId: body.categoryId,
        manufacturer: body.manufacturer,
        costPrice: body.costPrice,
        retailPrice: body.retailPrice,
        stockQty: body.stockQty,
        minStockQty: body.minStockQty ?? 0,
        description: body.description,
        isActive: body.isActive ?? true,
      },
    });
  }

  @Roles('DIRECTOR')
  @Patch('parts/:id')
  update(@Param('id') id: string, @Body() body: PartPatchDto) {
    return this.prisma.part.update({ where: { id }, data: body });
  }

  @Roles('DIRECTOR')
  @Post('receipts')
  async receipt(@Body() body: ReceiptDto) {
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
  async writeOff(@Body() body: WriteOffDto) {
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
    // Подключается при интеграции с 1С / МойСклад (см. INTEGRATIONS.md).
    { provide: ExternalInventoryProvider, useValue: null },
  ],
})
export class InventoryModule {}
