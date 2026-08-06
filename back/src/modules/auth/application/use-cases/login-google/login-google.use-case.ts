import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { LoginResponse } from '../../dto/login-response.dto';
import { USER_REPOSITORY } from '../../../domain/ports/out/user.repository';
import { TOKEN_PORT } from '../../../domain/ports/out/token.port';
import { LOGGER_PORT } from '../../../../../shared/domain/ports/out/logger.port';
import type { TokenPort } from '../../../domain/ports/out/token.port';
import type { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';
import type { UserRepository } from '../../../domain/ports/out/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { ConfigService } from '@nestjs/config';

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
};

type GoogleIdTokenPayload = {
  email: string;
  name: string;
};

@Injectable()
export class LoginGoogleUseCase {
  private readonly redirectUri: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    @Inject(TOKEN_PORT) private readonly tokenPort: TokenPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    configService: ConfigService,
  ) {
    this.redirectUri = configService.get<string>('GOOGLE_REDIRECT_URI') ?? '';
    this.clientId = configService.get<string>('GOOGLE_CLIENT_ID') ?? '';
    this.clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '';
  }

  async execute(code: string): Promise<LoginResponse> {
    const params = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const responseGoogle = (await response.json()) as GoogleTokenResponse;

    const payloadToken = JSON.parse(
      Buffer.from(
        responseGoogle.id_token.split('.')[1],
        'base64url',
      ).toString(),
    ) as GoogleIdTokenPayload;

    let user = await this.userRepo.findByEmail(payloadToken.email);

    if (!user) {
      user = new User(
        randomUUID(),
        payloadToken.email,
        payloadToken.name,
        null,
        'ADMIN',
        'ONBOARDING',
      );

      await this.userRepo.save(user);
    }

    const accessToken = await this.tokenPort.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    this.logger.log(`User logged successfully with id: ${user.id}`);

    return {
      accessToken,
      name: user.name,
      role: user.role,
    };
  }
}
