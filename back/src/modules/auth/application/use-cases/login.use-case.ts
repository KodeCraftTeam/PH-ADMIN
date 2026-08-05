import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/ports/out/user.repository';
import type { UserRepository } from '../../domain/ports/out/user.repository';
import { PASSWORD_HASHER } from '../../domain/ports/out/password-hasher.port';
import type { PasswordHasherPort } from '../../domain/ports/out/password-hasher.port';
import { TOKEN_PORT } from '../../domain/ports/out/token.port';
import type { TokenPort } from '../../domain/ports/out/token.port';
import { LoginDto } from '../dto/login.dto';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { LOGGER_PORT } from '../../../../shared/domain/ports/out/logger.port';
import type { LoggerPort } from '../../../../shared/domain/ports/out/logger.port';
import { LoginResponse } from '../dto/login-response.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_PORT) private readonly tokenPort: TokenPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (
      !user ||
      !(await this.passwordHasher.compare(dto.password, user.passwordHash))
    ) {
      this.logger.warn(`Failed login attempt for ${dto.email}`, 'LoginUseCase');
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.tokenPort.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    this.logger.log(`User ${user.id} logged in`, 'LoginUseCase');

    return {
      accessToken: accessToken,
      name: user.name,
      role: user.role,
    };
  }
}
