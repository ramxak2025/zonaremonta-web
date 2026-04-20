import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: {
        vehicles: { include: { brand: true, model: true } },
      },
    });
    if (!client) throw new NotFoundException();
    return client;
  }

  async updateMe(clientId: string, data: { name?: string }) {
    return this.prisma.client.update({
      where: { id: clientId },
      data: { name: data.name?.trim() },
    });
  }

  async listForAdmin(params: { q?: string; skip?: number; take?: number }) {
    const where = params.q
      ? {
          OR: [
            { phone: { contains: params.q } },
            { name: { contains: params.q, mode: 'insensitive' as const } },
          ],
        }
      : {};
    const [items, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip: params.skip,
        take: params.take ?? 50,
        orderBy: { createdAt: 'desc' },
        include: { vehicles: true, _count: { select: { workOrders: true } } },
      }),
      this.prisma.client.count({ where }),
    ]);
    return { items, total };
  }
}
