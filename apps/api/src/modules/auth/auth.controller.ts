import { Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { IsEmail, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { SmsRequestDto, SmsVerifyDto, StaffLoginDto, TotpConfirmDto } from './dto';

class ClientEmailLoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
}

class ClientRegisterDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(10) password!: string;
  @IsString() @Matches(/^\+7\d{10}$/) phone!: string;
  @IsOptional() @IsString() @Length(2, 80) name?: string;
}

class ClientVerifyDto {
  @IsString() @Matches(/^\+7\d{10}$/) phone!: string;
  @IsString() @Matches(/^\d{6}$/) code!: string;
}
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '@05auto/shared';

const REFRESH_COOKIE = 'rt';

function setRefreshCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/v1/auth',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 3, ttl: 15 * 60 * 1000 } })
  @Post('sms/request')
  @HttpCode(200)
  requestSms(@Body() dto: SmsRequestDto, @Req() req: Request) {
    return this.auth.requestSmsCode(dto.phone, req.ip);
  }

  @Public()
  @Throttle({ default: { limit: 6, ttl: 15 * 60 * 1000 } })
  @Post('sms/verify')
  @HttpCode(200)
  async verifySms(
    @Body() dto: SmsVerifyDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.verifySmsCode(dto.phone, dto.code, dto.name, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    setRefreshCookie(res, result.refreshToken);
    return {
      accessToken: result.accessToken,
      role: result.role,
      clientId: result.clientId,
    };
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 15 * 60 * 1000 } })
  @Post('staff/login')
  @HttpCode(200)
  async staffLogin(
    @Body() dto: StaffLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.auth.staffLogin(dto.email, dto.password, dto.totp, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    if ('requires2faEnrollment' in r && r.requires2faEnrollment) {
      return { requires2faEnrollment: true, otpauth: r.otpauth, qrDataUrl: r.qrDataUrl };
    }
    if ('requires2fa' in r && r.requires2fa) {
      return { requires2fa: true };
    }
    setRefreshCookie(res, r.refreshToken);
    return { accessToken: r.accessToken, role: r.role };
  }

  @Post('2fa/confirm')
  @HttpCode(200)
  confirm2fa(@CurrentUser() user: AuthUser, @Body() dto: TotpConfirmDto) {
    return this.auth.confirm2faEnrollment(user.id, dto.code);
  }

  // ===== Client: email + password =====
  @Public()
  @Throttle({ default: { limit: 10, ttl: 15 * 60 * 1000 } })
  @Post('email/login')
  @HttpCode(200)
  async clientEmailLogin(
    @Body() dto: ClientEmailLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.auth.clientEmailLogin(dto.email, dto.password, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    setRefreshCookie(res, r.refreshToken);
    return { accessToken: r.accessToken, role: r.role };
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 15 * 60 * 1000 } })
  @Post('email/register')
  @HttpCode(200)
  async clientEmailRegister(@Body() dto: ClientRegisterDto) {
    return this.auth.clientEmailRegister({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      name: dto.name,
    });
  }

  @Public()
  @Throttle({ default: { limit: 6, ttl: 15 * 60 * 1000 } })
  @Post('email/verify')
  @HttpCode(200)
  async clientEmailVerify(
    @Body() dto: ClientVerifyDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.auth.clientEmailVerify(dto.phone, dto.code, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    setRefreshCookie(res, r.refreshToken);
    return { accessToken: r.accessToken, role: r.role };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = req.cookies?.[REFRESH_COOKIE];
    if (!raw) throw new UnauthorizedException();
    const r = await this.auth.refresh(raw, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    setRefreshCookie(res, r.refreshToken);
    return { accessToken: r.accessToken, role: r.role };
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = req.cookies?.[REFRESH_COOKIE];
    await this.auth.logout(raw);
    res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
    return { ok: true };
  }

  @Post('me')
  @HttpCode(200)
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
