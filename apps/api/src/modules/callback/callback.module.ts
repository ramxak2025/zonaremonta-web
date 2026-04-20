import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Module,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import {
  Equals,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { CallbackStatus, Prisma } from '@prisma/client';
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

  /** honeypot-поле для ботов */
  @IsOptional() @IsString() @Length(0, 0)
  company?: string;
}

class CallbackUpdateDto {
  @IsOptional() @IsEnum(CallbackStatus)
  status?: CallbackStatus;

  @IsOptional() @IsString() @MaxLength(1000)
  note?: string;
}

@ApiTags('callback')
@Controller('callback')
class CallbackController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60 * 60 * 1000 } })
  @Post()
  async create(@Body() dto: CallbackDto, @Req() req: Request): Promise<{ ok: true }> {
    if (dto.company && dto.company.length > 0) {
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
    const where: Prisma.CallbackRequestWhereInput = {};
    if (status !== undefined) {
      if (!(Object.values(CallbackStatus) as string[]).includes(status)) {
        throw new BadRequestException(`Неизвестный статус: ${status}`);
      }
      where.status = status as CallbackStatus;
    }
    return this.prisma.callbackRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  @Roles('DIRECTOR')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: CallbackUpdateDto) {
    return this.prisma.callbackRequest.update({
      where: { id },
      data: { status: body.status, note: body.note },
    });
  }
}

@Module({ controllers: [CallbackController] })
export class CallbackModule {}
