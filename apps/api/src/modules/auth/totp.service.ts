import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

@Injectable()
export class TotpService {
  private issuer = process.env.TOTP_ISSUER ?? '05auto';

  generateSecret(): string {
    return authenticator.generateSecret();
  }

  getOtpauth(label: string, secret: string): string {
    return authenticator.keyuri(label, this.issuer, secret);
  }

  async getQrDataUrl(otpauth: string): Promise<string> {
    return QRCode.toDataURL(otpauth, { margin: 1, width: 260 });
  }

  verify(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret });
  }
}
