/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TOKEN_PORT } from '../../../../../domain/ports/out/token.port';
import type { TokenPort } from '../../../../../domain/ports/out/token.port';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(TOKEN_PORT) private readonly tokenService: TokenPort) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.cookies.token) {
      throw new UnauthorizedException({
        code: 'TOKEN_MISSING',
        message: 'No autenticado',
      });
    }

    try {
      request.user = await this.tokenService.verify(
        request.cookies.token as string,
      );
      return true;
    } catch (error) {
      const code =
        error instanceof Error && error.name === 'TokenExpiredError'
          ? 'TOKEN_EXPIRED'
          : 'TOKEN_INVALID';

      throw new UnauthorizedException({
        code,
        message: 'Sesión inválida o expirada',
      });
    }
  }
}
