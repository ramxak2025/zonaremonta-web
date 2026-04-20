export const SMS_PROVIDER = Symbol('SMS_PROVIDER');

export interface ISmsProvider {
  name: string;
  send(phone: string, text: string): Promise<{ ok: boolean; id?: string; error?: string }>;
}
