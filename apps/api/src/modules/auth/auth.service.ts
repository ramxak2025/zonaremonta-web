import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

class TooManyRequestsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
import { createHash, randomInt } from 'node:crypto';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { SmsService } from './sms/sms.service';
import { TokenService } from './token.service';
import { TotpService } from './totp.service';
import type { Role, User } from '@prisma/client';

const SMS_TTL_MIN = 5;
const SMS_MAX_REQUESTS_PER_WINDOW = 3;
const SMS_WINDOW_MIN = 15;
const SMS_MAX_VERIFY_ATTEMPTS = 3;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sms: SmsService,
    private readonly tokens: TokenService,
    private readonly totp: TotpService,
  ) {}

  // ======================= CLIENT: SMS =======================

  async requestSmsCode(phone: string, ip?: string) {
    const windowStart = new Date(Date.now() - SMS_WINDOW_MIN * 60_000);
    const recent = await this.prisma.smsCode.count({
      where: { phone, createdAt: { gte: windowStart } },
    });
    if (recent >= SMS_MAX_REQUESTS_PER_WINDOW) {
      throw new TooManyRequestsException('Слишком много запросов кода. Попробуйте через 15 минут.');
    }
    const code = String(randomInt(100000, 999999));
    const codeHash = createHash('sha256').update(code).digest('hex');
    const expiresAt = new Date(Date.now() + SMS_TTL_MIN * 60_000);
    await this.prisma.smsCode.create({
      data: { phone, codeHash, expiresAt, ip },
    });
    // В dev-режиме логгируем код в консоль
    if ((process.env.SMS_PROVIDER ?? 'mock') === 'mock') {
      this.logger.log(`[DEV] SMS code for ${phone}: ${code}`);
    }
    await this.sms.sendCode(phone, code);
    return { sent: true, ttlSec: SMS_TTL_MIN * 60 };
  }

  async verifySmsCode(phone: string, code: string, name: string | undefined, meta: { ip?: string; userAgent?: string }) {
    const codeHash = createHash('sha256').update(code).digest('hex');
    const latest = await this.prisma.smsCode.findFirst({
      where: { phone, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!latest) throw new UnauthorizedException('Код не найден или просрочен');
    if (latest.attempts >= SMS_MAX_VERIFY_ATTEMPTS) {
      throw new TooManyRequestsException('Превышено число попыток. Запросите новый код.');
    }
    if (latest.codeHash !== codeHash) {
      await this.prisma.smsCode.update({
        where: { id: latest.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException('Неверный код');
    }
    await this.prisma.smsCode.update({
      where: { id: latest.id },
      data: { consumedAt: new Date() },
    });

    let client = await this.prisma.client.findUnique({ where: { phone }, include: { user: true } });
    if (!client) {
      const user = await this.prisma.user.create({
        data: {
          role: 'CLIENT',
          client: {
            create: { phone, name: name?.trim() },
          },
        },
        include: { client: true },
      });
      client = { ...user.client!, user };
    } else if (name && !client.name) {
      await this.prisma.client.update({ where: { id: client.id }, data: { name: name.trim() } });
    }

    await this.prisma.user.update({ where: { id: client.userId }, data: { lastLoginAt: new Date() } });

    const accessToken = this.tokens.signAccess({
      sub: client.userId,
      role: 'CLIENT',
      clientId: client.id,
    });
    const refreshToken = await this.tokens.issueRefresh(client.userId, meta);
    return { accessToken, refreshToken, role: 'CLIENT' as Role, clientId: client.id };
  }

  // ======================= STAFF: email + password + TOTP =======================

  async staffLogin(email: string, password: string, totpCode: string | undefined, meta: { ip?: string; userAgent?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { master: true },
    });
    if (!user || !user.passwordHash || (user.role !== 'MASTER' && user.role !== 'DIRECTOR')) {
      throw new UnauthorizedException('Неверные email или пароль');
    }
    if (user.status === 'BLOCKED') throw new UnauthorizedException('Аккаунт заблокирован');
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Неверные email или пароль');

    // При первом входе 2FA ещё не настроена — возвращаем enrollment URL.
    if (!user.totpEnabled || !user.totpSecret) {
      const secret = user.totpSecret ?? this.totp.generateSecret();
      if (!user.totpSecret) {
        await this.prisma.user.update({ where: { id: user.id }, data: { totpSecret: secret } });
      }
      const otpauth = this.totp.getOtpauth(email, secret);
      const qr = await this.totp.getQrDataUrl(otpauth);
      return {
        requires2faEnrollment: true,
        otpauth,
        qrDataUrl: qr,
      } as const;
    }

    if (!totpCode) {
      return { requires2fa: true } as const;
    }
    if (!this.totp.verify(totpCode, user.totpSecret)) {
      throw new UnauthorizedException('Неверный код 2FA');
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const accessToken = this.tokens.signAccess({
      sub: user.id,
      role: user.role,
      masterId: user.master?.id,
    });
    const refreshToken = await this.tokens.issueRefresh(user.id, meta);
    return { accessToken, refreshToken, role: user.role } as const;
  }

  async confirm2faEnrollment(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.totpSecret) throw new BadRequestException('Сначала начните вход');
    if (!this.totp.verify(code, user.totpSecret)) {
      throw new UnauthorizedException('Неверный код 2FA');
    }
    await this.prisma.user.update({ where: { id: userId }, data: { totpEnabled: true } });
    return { enabled: true };
  }

  // ======================= CLIENT: email + password + SMS verification =======================

  async clientEmailLogin(email: string, password: string, meta: { ip?: string; userAgent?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { client: true },
    });
    if (!user || !user.passwordHash || user.role !== 'CLIENT') {
      throw new UnauthorizedException('Неверные email или пароль');
    }
    if (user.status === 'BLOCKED') throw new UnauthorizedException('Аккаунт заблокирован');
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Неверные email или пароль');

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const accessToken = this.tokens.signAccess({
      sub: user.id,
      role: 'CLIENT',
      clientId: user.client?.id,
    });
    const refreshToken = await this.tokens.issueRefresh(user.id, meta);
    return { accessToken, refreshToken, role: 'CLIENT' as Role };
  }

  async clientEmailRegister(params: {
    email: string;
    password: string;
    phone: string;
    name?: string;
  }) {
    const email = params.email.toLowerCase();
    const existsEmail = await this.prisma.user.findUnique({ where: { email } });
    if (existsEmail) throw new BadRequestException('Email уже зарегистрирован');
    const existsPhone = await this.prisma.client.findUnique({ where: { phone: params.phone } });
    if (existsPhone) throw new BadRequestException('Телефон уже зарегистрирован');

    // Создаём неактивированного клиента (status=BLOCKED до SMS-подтверждения)
    const hash = await argon2.hash(params.password, { type: argon2.argon2id });
    await this.prisma.user.create({
      data: {
        role: 'CLIENT',
        email,
        passwordHash: hash,
        status: 'BLOCKED',
        client: { create: { phone: params.phone, name: params.name?.trim() } },
      },
    });
    // Шлём SMS для верификации
    await this.requestSmsCode(params.phone);
    return { sent: true };
  }

  async clientEmailVerify(phone: string, code: string, meta: { ip?: string; userAgent?: string }) {
    // Проверяем код
    const codeHash = createHash('sha256').update(code).digest('hex');
    const latest = await this.prisma.smsCode.findFirst({
      where: { phone, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!latest) throw new UnauthorizedException('Код не найден или просрочен');
    if (latest.codeHash !== codeHash) {
      await this.prisma.smsCode.update({
        where: { id: latest.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException('Неверный код');
    }
    await this.prisma.smsCode.update({
      where: { id: latest.id },
      data: { consumedAt: new Date() },
    });

    // Активируем пользователя
    const client = await this.prisma.client.findUnique({
      where: { phone },
      include: { user: true },
    });
    if (!client) throw new UnauthorizedException('Пользователь не найден');
    await this.prisma.user.update({
      where: { id: client.userId },
      data: { status: 'ACTIVE', lastLoginAt: new Date() },
    });

    const accessToken = this.tokens.signAccess({
      sub: client.userId,
      role: 'CLIENT',
      clientId: client.id,
    });
    const refreshToken = await this.tokens.issueRefresh(client.userId, meta);
    return { accessToken, refreshToken, role: 'CLIENT' as Role };
  }

  // ======================= REFRESH =======================

  async refresh(raw: string, meta: { ip?: string; userAgent?: string }) {
    const token = await this.tokens.verifyRefresh(raw);
    if (!token) throw new UnauthorizedException('Сессия истекла');
    const user = await this.prisma.user.findUnique({
      where: { id: token.userId },
      include: { client: true, master: true },
    });
    if (!user || user.status === 'BLOCKED') throw new UnauthorizedException();
    // ротация: отзываем старый, выдаём новый refresh
    await this.tokens.revokeRefresh(raw);
    const refreshToken = await this.tokens.issueRefresh(user.id, meta);
    const accessToken = this.tokens.signAccess({
      sub: user.id,
      role: user.role,
      clientId: user.client?.id,
      masterId: user.master?.id,
    });
    return { accessToken, refreshToken, role: user.role };
  }

  async logout(raw: string | undefined) {
    if (raw) await this.tokens.revokeRefresh(raw);
    return { ok: true };
  }

  /** Справка для tests / staff seed — создать директора. Не выставляется наружу. */
  async createStaff(params: { email: string; password: string; role: 'MASTER' | 'DIRECTOR'; fullName: string }): Promise<User> {
    const hash = await argon2.hash(params.password, { type: argon2.argon2id });
    return this.prisma.user.create({
      data: {
        email: params.email.toLowerCase(),
        passwordHash: hash,
        role: params.role,
        master:
          params.role === 'MASTER'
            ? { create: { fullName: params.fullName } }
            : undefined,
      },
    });
  }
}
