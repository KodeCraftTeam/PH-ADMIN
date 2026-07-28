import { UserRole } from '../../entities/user.entity';

export interface TokenPort {
  sign(payload: { sub: string; email: string; role: string }): Promise<string>;
  verify(
    token: string,
  ): Promise<{ sub: string; email: string; role: UserRole }>;
}

export const TOKEN_PORT = Symbol('TokenPort');
