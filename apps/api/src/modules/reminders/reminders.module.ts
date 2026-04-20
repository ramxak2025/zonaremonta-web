import { Body, Controller, ForbiddenException, Get, Injectable, Logger, Module, Post } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { SmsService } from '../auth/sms/sms.service';
import { SmsModule } from '../auth/sms/sms.module';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '@05auto/shared';

@Injectable()
class RemindersCron {
  private readonly logger = new Logger('RemindersCron');
  constructor(
    private readonly prisma: PrismaService,
    private readonly sms: SmsService,
  ) {}

  /** Каждый день в 10:00 — шлём напоминания, которые наступают в ближайшие 7 дней. */
  @Cron('0 10 * * *')
  async runDaily() {
    const upper = new Date(Date.now() + 7 * 86_400_000);
    const due = await this.prisma.reminder.findMany({
      where: { notified: false, completed: false, dueAt: { lte: upper } },
      include: { client: true },
      take: 500,
    });
    for (const r of due) {
      const text = `05auto: напоминаем — ${r.title}. До: ${r.dueAt.toLocaleDateString('ru-RU')}`;
      const res = await this.sms.send(r.client.phone, text);
      if (res.ok) {
        await this.prisma.reminder.update({ where: { id: r.id }, data: { notified: true } });
      }
    }
    this.logger.log(`reminders processed: ${due.length}`);
  }
}

@ApiTags('reminders')
@Controller('reminders')
class RemindersController {
  constructor(private readonly prisma: PrismaService) {}

  @Roles('CLIENT')
  @Get('me')
  mine(@CurrentUser() user: AuthUser) {
    if (!user.clientId) throw new ForbiddenException();
    return this.prisma.reminder.findMany({
      where: { clientId: user.clientId, completed: false },
      orderBy: { dueAt: 'asc' },
    });
  }

  @Roles('CLIENT')
  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body() body: { type: any; title: string; dueAt: string; vehicleId?: string },
  ) {
    if (!user.clientId) throw new ForbiddenException();
    return this.prisma.reminder.create({
      data: {
        clientId: user.clientId,
        vehicleId: body.vehicleId,
        type: body.type,
        title: body.title,
        dueAt: new Date(body.dueAt),
      },
    });
  }
}

@Module({
  imports: [SmsModule],
  controllers: [RemindersController],
  providers: [RemindersCron],
})
export class RemindersModule {}
