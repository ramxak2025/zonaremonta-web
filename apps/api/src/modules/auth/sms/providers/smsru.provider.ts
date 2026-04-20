import { Injectable, Logger } from '@nestjs/common';
import { ISmsProvider } from '../sms.tokens';

@Injectable()
export class SmsRuProvider implements ISmsProvider {
  readonly name = 'smsru';
  private readonly logger = new Logger('SMS.RU');

  async send(phone: string, text: string) {
    const apiId = process.env.SMSRU_API_ID;
    if (!apiId) {
      this.logger.warn('SMSRU_API_ID missing — fallback mock');
      this.logger.log(`[smsru-mock] -> ${phone}: ${text}`);
      return { ok: true, id: 'smsru-fallback' };
    }
    const url = new URL('https://sms.ru/sms/send');
    url.searchParams.set('api_id', apiId);
    url.searchParams.set('to', phone.replace('+', ''));
    url.searchParams.set('msg', text);
    url.searchParams.set('json', '1');
    try {
      const res = await fetch(url);
      const data = (await res.json()) as { status: string; status_code: number; sms?: Record<string, { status: string; sms_id?: string }> };
      if (data.status !== 'OK') return { ok: false, error: String(data.status_code) };
      const first = data.sms ? Object.values(data.sms)[0] : undefined;
      return { ok: true, id: first?.sms_id };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  }
}
