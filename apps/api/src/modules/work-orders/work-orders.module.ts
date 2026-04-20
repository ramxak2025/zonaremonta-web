import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Module,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma, WorkOrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '@05auto/shared';

interface WorkItemInput {
  kind: 'SERVICE' | 'PART';
  serviceId?: string;
  partId?: string;
  name: string;
  qty: number;
  unitPrice: number;
}

interface UpdateWorkOrderBody {
  status?: WorkOrderStatus;
  comment?: string;
  items?: WorkItemInput[];
}

@ApiTags('work-orders')
@Controller('work-orders')
class WorkOrdersController {
  constructor(private readonly prisma: PrismaService) {}

  @Roles('MASTER', 'DIRECTOR')
  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.prisma.workOrder.findMany({
      where: user.role === 'MASTER' ? { masterId: user.masterId } : {},
      orderBy: { openedAt: 'desc' },
      include: { client: true, vehicle: true, items: true },
      take: 100,
    });
  }

  @Roles('MASTER', 'DIRECTOR')
  @Post()
  async create(
    @CurrentUser() user: AuthUser,
    @Body() body: { clientId: string; vehicleId: string; masterId?: string; comment?: string },
  ) {
    return this.prisma.workOrder.create({
      data: {
        clientId: body.clientId,
        vehicleId: body.vehicleId,
        masterId: body.masterId ?? user.masterId,
        comment: body.comment,
        status: 'NEW',
      },
    });
  }

  @Roles('MASTER', 'DIRECTOR')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateWorkOrderBody) {
    if (body.status && !(Object.values(WorkOrderStatus) as string[]).includes(body.status)) {
      throw new BadRequestException(`Неизвестный статус: ${body.status}`);
    }
    const existing = await this.prisma.workOrder.findUnique({ where: { id } });
    if (!existing) throw new BadRequestException();
    return this.prisma.$transaction(async (tx) => {
      if (body.items) {
        await tx.workOrderItem.deleteMany({ where: { workOrderId: id } });
        for (const it of body.items) {
          const subtotal = Math.round(it.qty * it.unitPrice * 100) / 100;
          await tx.workOrderItem.create({
            data: {
              workOrderId: id,
              kind: it.kind,
              serviceId: it.serviceId,
              partId: it.partId,
              name: it.name,
              qty: it.qty,
              unitPrice: it.unitPrice,
              subtotal,
            },
          });
          // списываем со склада, если запчасть
          if (it.kind === 'PART' && it.partId) {
            await tx.part.update({
              where: { id: it.partId },
              data: { stockQty: { decrement: Math.floor(it.qty) } },
            });
            await tx.stockMovement.create({
              data: {
                partId: it.partId,
                type: 'WORK_ORDER',
                qty: -Math.floor(it.qty),
                priceAtMove: it.unitPrice,
                workOrderId: id,
              },
            });
          }
        }
        const sum = await tx.workOrderItem.aggregate({
          where: { workOrderId: id },
          _sum: { subtotal: true },
        });
        await tx.workOrder.update({
          where: { id },
          data: { totalCost: sum._sum.subtotal ?? 0 },
        });
      }
      if (body.status) {
        const data: Prisma.WorkOrderUpdateInput = { status: body.status };
        if (body.status === 'DONE') data.closedAt = new Date();
        const updated = await tx.workOrder.update({ where: { id }, data });
        // авто-транзакция в кассу при закрытии
        if (body.status === 'DONE') {
          const cat = await tx.transactionCategory.findUnique({ where: { slug: 'work_order' } });
          if (cat) {
            await tx.transaction.create({
              data: {
                direction: 'INCOME',
                categoryId: cat.id,
                amount: updated.totalCost,
                date: new Date(),
                workOrderId: updated.id,
              },
            });
          }
        }
      }
      return tx.workOrder.findUnique({
        where: { id },
        include: { items: true, client: true, vehicle: true },
      });
    });
  }
}

@Module({ controllers: [WorkOrdersController] })
export class WorkOrdersModule {}
