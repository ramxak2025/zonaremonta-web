import { Body, Controller, Get, Module, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { IsOptional, IsString, Matches, Equals, Length } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

class CallbackDto {
  @IsOptional() @IsString() @Length(2, 80)
  name?: string;

  @IsString()
  @Matches(/^\+7\d{10}$/)
  phone!: string;

  @Equals(true, { message: 'Требуется согласие на обработку номера телефона' })
  consent!: boolean;

  // honeypot: скрытое поле
  @IsOptional() @IsString() @Length(0, 0)
  company?: string;
}

@ApiTags('callback')
@Controller('callback')
class CallbackController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60 * 60 * 1000 } })
  @Post()
  async create(@Body() dto: CallbackDto, @Req() req: Request) {
    if (dto.company && dto.company.length > 0) {
      // honeypot — скорее всего бот
      return { ok: true };
    }
    await this.prisma.callbackRequest.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        ip: req.ip,
        userAgent: req.headers['user-agent']?.toString(),
        source: 'public',
      },
    });
    return { ok: true };
  }

  @Roles('DIRECTOR')
  @Get()
  list(@Query('status') status?: string) {
    return this.prisma.callbackRequest.findMany({
      where: status ? { status: status as any } : {},
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  @Roles('DIRECTOR')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { status?: string; note?: string }) {
    return this.prisma.callbackRequest.update({
      where: { id },
      data: { status: body.status as any, note: body.note },
    });
  }
}

@Module({ controllers: [CallbackController] })
export class CallbackModule {}
