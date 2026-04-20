import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VehiclesService } from './vehicles.service';
import type { AuthUser, VehicleInput } from '@05auto/shared';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicles: VehiclesService) {}

  @Public()
  @Get('brands')
  brands() {
    return this.vehicles.listBrands();
  }

  @Roles('CLIENT')
  @Get('me')
  mine(@CurrentUser() user: AuthUser) {
    if (!user.clientId) throw new ForbiddenException();
    return this.vehicles.listForClient(user.clientId);
  }

  @Roles('CLIENT')
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() body: VehicleInput) {
    if (!user.clientId) throw new ForbiddenException();
    return this.vehicles.create(user.clientId, body);
  }

  @Roles('CLIENT')
  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() body: Partial<VehicleInput>,
  ) {
    if (!user.clientId) throw new ForbiddenException();
    return this.vehicles.update(user.clientId, id, body);
  }

  @Roles('CLIENT')
  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    if (!user.clientId) throw new ForbiddenException();
    return this.vehicles.remove(user.clientId, id);
  }

  @Roles('CLIENT')
  @Post('model-request')
  missingModel(
    @CurrentUser() user: AuthUser,
    @Body() body: { brandText: string; modelText: string },
  ) {
    if (!user.clientId) throw new ForbiddenException();
    return this.vehicles.requestMissingModel(user.clientId, body.brandText, body.modelText);
  }
}
