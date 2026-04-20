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
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '@05auto/shared';

interface UpdateAppointmentBody {
  status?: AppointmentStatus;
  masterId?: string;
}

@ApiTags('appointments')
@Controller('appointments')
class AppointmentsController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get('slots')
  async slots(@Query('from') from?: string, @Query('to') to?: string) {
    const now = new Date();
    const start = from ? new Date(from) : now;
    const end = to ? new Date(to) : new Date(Date.now() + 14 * 86_400_000);
    const slots = await this.prisma.appointmentSlot.findMany({
      where: {
        startAt: { gte: start, lte: end },
        isActive: true,
      },
      include: { _count: { select: { appointments: true } } },
      orderBy: { startAt: 'asc' },
    });
    return slots.map((s) => ({
      id: s.id,
      startAt: s.startAt,
      endAt: s.endAt,
      capacity: s.capacity,
      booked: s._count.appointments,
      available: s.capacity - s._count.appointments,
    }));
  }

  @Roles('CLIENT')
  @Post()
  async create(
    @CurrentUser() user: AuthUser,
    @Body() body: { vehicleId: string; slotId: string; serviceSlugs: string[]; comment?: string },
  ) {
    if (!user.clientId) throw new ForbiddenException();
    const services = await this.prisma.service.findMany({
      where: { slug: { in: body.serviceSlugs } },
    });
    return this.prisma.appointment.create({
      data: {
        clientId: user.clientId,
        vehicleId: body.vehicleId,
        slotId: body.slotId,
        comment: body.comment,
        services: { create: services.map((s) => ({ serviceId: s.id })) },
      },
      include: { services: { include: { service: true } } },
    });
  }

  @Roles('CLIENT')
  @Get('me')
  mine(@CurrentUser() user: AuthUser) {
    if (!user.clientId) throw new ForbiddenException();
    return this.prisma.appointment.findMany({
      where: { clientId: user.clientId },
      orderBy: { createdAt: 'desc' },
      include: { vehicle: true, slot: true, services: { include: { service: true } } },
    });
  }

  @Roles('DIRECTOR', 'MASTER')
  @Get()
  list() {
    return this.prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { client: true, vehicle: true, slot: true },
    });
  }

  @Roles('DIRECTOR', 'MASTER')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateAppointmentBody) {
    if (body.status && !(Object.values(AppointmentStatus) as string[]).includes(body.status)) {
      throw new BadRequestException(`Неизвестный статус: ${body.status}`);
    }
    return this.prisma.appointment.update({
      where: { id },
      data: { status: body.status, masterId: body.masterId },
    });
  }
}

@Module({ controllers: [AppointmentsController] })
export class AppointmentsModule {}
