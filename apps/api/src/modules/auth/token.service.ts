import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHash } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import type { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  role: Role;
  clientId?: string;
  masterId?: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private get accessSecret() {
    return process.env.JWT_ACCESS_SECRET ?? 'dev-access';
  }
  private get refreshSecret() {
    return process.env.JWT_REFRESH_SECRET ?? 'dev-refresh';
  }

  signAccess(payload: JwtPayload): string {
    return this.jwt.sign(payload, {
      secret: this.accessSecret,
      expiresIn: parseTtlSeconds(process.env.JWT_ACCESS_TTL ?? '15m'),
    });
  }

  /** Refresh токен — random 64 байта, хэш в БД, opaque на клиенте. */
  async issueRefresh(userId: string, meta: { ip?: string; userAgent?: string }): Promise<string> {
    const raw = randomBytes(48).toString('base64url');
    const hash = createHash('sha256').update(raw).digest('hex');
    const ttlSec = parseTtlSeconds(process.env.JWT_REFRESH_TTL ?? '30d');
    const expiresAt = new Date(Date.now() + ttlSec * 1000);
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hash,
        expiresAt,
        ip: meta.ip,
        userAgent: meta.userAgent,
      },
    });
    return raw;
  }

  async verifyRefresh(raw: string) {
    const hash = createHash('sha256').update(raw).digest('hex');
    const token = await this.prisma.refreshToken.findUnique({ where: { tokenHash: hash } });
    if (!token || token.revokedAt || token.expiresAt < new Date()) return null;
    return token;
  }

  async revokeRefresh(raw: string) {
    const hash = createHash('sha256').update(raw).digest('hex');
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: hash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}

/**
 * Парсит TTL-строку вида "15m" / "24h" / "30d" в секунды.
 * Используем число секунд — это стандартный формат JWT `expiresIn` с гарантированным типом.
 */
function parseTtlSeconds(ttl: string): number {
  const m = /^(\d+)([smhd])$/.exec(ttl);
  if (!m) return 900; // 15 минут по умолчанию
  const n = Number(m[1]);
  const unit = m[2];
  switch (unit) {
    case 's': return n;
    case 'm': return n * 60;
    case 'h': return n * 3600;
    case 'd': return n * 86400;
    default: return 900;
  }
}
