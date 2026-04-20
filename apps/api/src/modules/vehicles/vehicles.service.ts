import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { VehicleInput } from '@05auto/shared';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  listBrands() {
    return this.prisma.vehicleBrand.findMany({
      orderBy: { name: 'asc' },
      include: { models: { orderBy: { name: 'asc' } } },
    });
  }

  listForClient(clientId: string) {
    return this.prisma.vehicle.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      include: { brand: true, model: true },
    });
  }

  async create(clientId: string, dto: VehicleInput) {
    return this.prisma.vehicle.create({
      data: {
        clientId,
        brandId: dto.brandId,
        modelId: dto.modelId,
        year: dto.year,
        licensePlate: dto.licensePlate,
        vin: dto.vin,
        mileageKm: dto.mileageKm,
        mileageUpdatedAt: dto.mileageKm != null ? new Date() : null,
        cylinderType: dto.cylinderType,
        cylinderLastCheckDate: dto.cylinderLastCheckDate,
        hasGbo: Boolean(dto.cylinderType),
      },
    });
  }

  async update(clientId: string, id: string, dto: Partial<VehicleInput>) {
    const owned = await this.prisma.vehicle.findFirst({ where: { id, clientId } });
    if (!owned) throw new NotFoundException();
    return this.prisma.vehicle.update({ where: { id }, data: dto });
  }

  async remove(clientId: string, id: string) {
    const owned = await this.prisma.vehicle.findFirst({ where: { id, clientId } });
    if (!owned) throw new NotFoundException();
    return this.prisma.vehicle.delete({ where: { id } });
  }

  async requestMissingModel(clientId: string, brandText: string, modelText: string) {
    return this.prisma.vehicleModelRequest.create({
      data: { clientId, brandText, modelText },
    });
  }
}
