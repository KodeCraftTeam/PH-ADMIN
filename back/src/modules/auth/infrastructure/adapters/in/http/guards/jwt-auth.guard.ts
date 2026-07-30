/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { TOKEN_PORT } from '../../../../../domain/ports/out/token.port';
import type { TokenPort } from '../../../../../domain/ports/out/token.port';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(TOKEN_PORT) private readonly tokenService: TokenPort) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      if (!request.cookies.token) {
        return false;
      }

      const token = request.cookies.token as string;

      const payload = await this.tokenService.verify(token);

      request.user = payload;

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
