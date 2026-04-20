import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmscProvider } from './providers/smsc.provider';
import { SmsRuProvider } from './providers/smsru.provider';
import { MockSmsProvider } from './providers/mock.provider';
import { SMS_PROVIDER } from './sms.tokens';

@Module({
  providers: [
    SmsService,
    SmscProvider,
    SmsRuProvider,
    MockSmsProvider,
    {
      provide: SMS_PROVIDER,
      useFactory: (smsc: SmscProvider, smsru: SmsRuProvider, mock: MockSmsProvider) => {
        const choice = (process.env.SMS_PROVIDER ?? 'mock').toLowerCase();
        if (choice === 'smsc') return smsc;
        if (choice === 'smsru') return smsru;
        return mock;
      },
      inject: [SmscProvider, SmsRuProvider, MockSmsProvider],
    },
  ],
  exports: [SmsService, SMS_PROVIDER],
})
export class SmsModule {}
