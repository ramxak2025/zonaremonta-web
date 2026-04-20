import { Body, Controller, Get, Module, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('finance')
@Controller('finance')
class FinanceController {
  constructor(private readonly prisma: PrismaService) {}

  @Roles('DIRECTOR')
  @Get('transactions')
  list(@Query('from') from?: string, @Query('to') to?: string) {
    return this.prisma.transaction.findMany({
      where: {
        date: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
      include: { category: true },
      orderBy: { date: 'desc' },
      take: 500,
    });
  }

  @Roles('DIRECTOR')
  @Post('transactions')
  create(@Body() body: { direction: 'INCOME' | 'EXPENSE'; categoryId: string; amount: number; date: string; comment?: string }) {
    return this.prisma.transaction.create({
      data: {
        direction: body.direction,
        categoryId: body.categoryId,
        amount: body.amount,
        date: new Date(body.date),
        comment: body.comment,
      },
    });
  }

  @Roles('DIRECTOR')
  @Get('report')
  async report(@Query('from') from: string, @Query('to') to: string) {
    const fromD = new Date(from);
    const toD = new Date(to);
    const grouped = await this.prisma.transaction.groupBy({
      by: ['direction'],
      where: { date: { gte: fromD, lte: toD } },
      _sum: { amount: true },
    });
    const income = grouped.find((g) => g.direction === 'INCOME')?._sum.amount ?? 0;
    const expense = grouped.find((g) => g.direction === 'EXPENSE')?._sum.amount ?? 0;
    return {
      from,
      to,
      income,
      expense,
      profit: Number(income) - Number(expense),
    };
  }
}

@Module({ controllers: [FinanceController] })
export class FinanceModule {}
