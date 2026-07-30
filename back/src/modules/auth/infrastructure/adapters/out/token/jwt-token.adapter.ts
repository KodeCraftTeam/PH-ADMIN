import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPort } from '../../../../domain/ports/out/token.port';
import { UserRole } from '../../../../domain/entities/user.entity';

@Injectable()
export class JwtTokenAdapter implements TokenPort {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: { sub: string; email: string; role: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  verify(
    token: string,
  ): Promise<{ sub: string; email: string; role: UserRole }> {
    return this.jwtService.verifyAsync(token);
  }
}
