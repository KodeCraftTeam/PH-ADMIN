import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
  id_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
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
    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      this.logger.error(
        'Google OAuth credentials missing in env',
        'LoginGoogleUseCase',
      );
      throw new UnauthorizedException(
        'Configuración de Google OAuth incompleta en el servidor.',
      );
    }

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

    if (!response.ok || !responseGoogle.id_token) {
      const errorMsg =
        responseGoogle.error_description ||
        responseGoogle.error ||
        'id_token no recibido de Google';
      this.logger.error(
        `Error en intercambio de token con Google: ${errorMsg}`,
        'LoginGoogleUseCase',
      );
      throw new UnauthorizedException(
        `Error al autenticar con Google: ${errorMsg}`,
      );
    }

    const tokenParts = responseGoogle.id_token.split('.');
    if (tokenParts.length < 2) {
      throw new UnauthorizedException('Formato de id_token de Google inválido.');
    }

    const payloadToken = JSON.parse(
      Buffer.from(tokenParts[1], 'base64url').toString(),
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
