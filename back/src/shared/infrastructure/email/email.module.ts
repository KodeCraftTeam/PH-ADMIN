import { Global, Module } from '@nestjs/common';
import { EMAIL_SENDER_PORT } from '../../domain/ports/out/email-sender.port';
import { ResendEmailAdapter } from './resend-email.adapter';

@Global()
@Module({
  providers: [{ provide: EMAIL_SENDER_PORT, useClass: ResendEmailAdapter }],
  exports: [EMAIL_SENDER_PORT],
})
export class EmailModule {}
