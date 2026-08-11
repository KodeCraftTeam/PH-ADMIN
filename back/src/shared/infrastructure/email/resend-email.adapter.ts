import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import {
  EmailSenderPort,
  SendTemplateEmailParams,
} from '../../domain/ports/out/email-sender.port';
import { EmailDeliveryError } from '../../domain/errors/email-delivery.error';

@Injectable()
export class ResendEmailAdapter implements EmailSenderPort {
  private readonly logger = new Logger(ResendEmailAdapter.name);
  private readonly resend: Resend;
  private readonly fromAddress: string;

  constructor(configService: ConfigService) {
    this.resend = new Resend(configService.get<string>('RESEND_API_KEY'));
    this.fromAddress =
      configService.get<string>('RESEND_FROM_ADDRESS') ??
      'Turnio <no-reply@turnio.com>';
  }

  async sendTemplate({
    to,
    templateId,
    variables,
  }: SendTemplateEmailParams): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.fromAddress,
      to,
      template: {
        id: templateId,
        variables,
      },
    });

    if (error) {
      this.logger.error(
        `Fallo al enviar email con template ${templateId}: ${error.message}`,
      );
      throw new EmailDeliveryError();
    }
  }
}
