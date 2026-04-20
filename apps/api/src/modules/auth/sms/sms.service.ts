import { Inject, Injectable, Logger } from '@nestjs/common';
import { ISmsProvider, SMS_PROVIDER } from './sms.tokens';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(@Inject(SMS_PROVIDER) private readonly provider: ISmsProvider) {}

  async send(phone: string, text: string) {
    const res = await this.provider.send(phone, text);
    if (!res.ok) this.logger.warn(`SMS failed to ${phone}: ${res.error}`);
    return res;
  }

  async sendCode(phone: string, code: string) {
    return this.send(phone, `Ваш код входа в 05auto: ${code}`);
  }
}
