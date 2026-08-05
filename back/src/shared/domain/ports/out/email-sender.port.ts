export const EMAIL_SENDER_PORT = Symbol('EMAIL_SENDER_PORT');

export interface SendTemplateEmailParams {
  to: string;
  templateId: string;
  variables: Record<string, string | number>;
}

export interface EmailSenderPort {
  sendTemplate(params: SendTemplateEmailParams): Promise<void>;
}
