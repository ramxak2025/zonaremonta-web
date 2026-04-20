import { Injectable, Logger } from '@nestjs/common';
import { ISmsProvider } from '../sms.tokens';

@Injectable()
export class MockSmsProvider implements ISmsProvider {
  readonly name = 'mock';
  private readonly logger = new Logger('MockSms');

  async send(phone: string, text: string) {
    this.logger.log(`[mock-sms] -> ${phone}: ${text}`);
    return { ok: true, id: `mock-${Date.now()}` };
  }
}
