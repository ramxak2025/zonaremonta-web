import { Injectable, Logger } from '@nestjs/common';
import { ISmsProvider } from '../sms.tokens';

@Injectable()
export class SmscProvider implements ISmsProvider {
  readonly name = 'smsc';
  private readonly logger = new Logger('SMSC');

  async send(phone: string, text: string) {
    const login = process.env.SMSC_LOGIN;
    const password = process.env.SMSC_PASSWORD;
    if (!login || !password) {
      this.logger.warn('SMSC credentials missing — падаем на mock вывод');
      this.logger.log(`[smsc-mock] -> ${phone}: ${text}`);
      return { ok: true, id: 'smsc-fallback' };
    }
    const url = new URL('https://smsc.ru/sys/send.php');
    url.searchParams.set('login', login);
    url.searchParams.set('psw', password);
    url.searchParams.set('phones', phone);
    url.searchParams.set('mes', text);
    url.searchParams.set('fmt', '3'); // json
    url.searchParams.set('charset', 'utf-8');
    try {
      const res = await fetch(url, { method: 'GET' });
      const data = (await res.json()) as { id?: number; error?: string; error_code?: number };
      if (data.error) return { ok: false, error: data.error };
      return { ok: true, id: String(data.id ?? '') };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  }
}
