import { Body, Controller, ForbiddenException, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '@05auto/shared';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clients: ClientsService) {}

  @Roles('CLIENT')
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    if (!user.clientId) throw new ForbiddenException();
    return this.clients.getMe(user.clientId);
  }

  @Roles('CLIENT')
  @Patch('me')
  update(@CurrentUser() user: AuthUser, @Body() body: { name?: string }) {
    if (!user.clientId) throw new ForbiddenException();
    return this.clients.updateMe(user.clientId, body);
  }

  @Roles('DIRECTOR')
  @Get()
  list(@Query('q') q?: string, @Query('page') page = '1', @Query('pageSize') pageSize = '50') {
    const take = Math.min(200, Number(pageSize));
    const skip = (Math.max(1, Number(page)) - 1) * take;
    return this.clients.listForAdmin({ q, skip, take });
  }
}
