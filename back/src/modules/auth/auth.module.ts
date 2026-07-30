import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { USER_REPOSITORY } from './domain/ports/out/user.repository';
import { USER_QUERY_PORT } from './application/ports/out/user-query.port';
import { PASSWORD_HASHER } from './domain/ports/out/password-hasher.port';
import { TOKEN_PORT } from './domain/ports/out/token.port';
import { AuthController } from './infrastructure/adapters/in/http/auth.controller';
import { PrismaUserRepository } from './infrastructure/adapters/out/persistence/prisma-user.repository';
import { PrismaUserQueryRepository } from './infrastructure/adapters/out/persistence/prisma-user-query.repository';
import { BcryptPasswordHasherAdapter } from './infrastructure/adapters/out/hashing/bcrypt-password-hasher.adapter';
import { JwtTokenAdapter } from './infrastructure/adapters/out/token/jwt-token.adapter';

/**
 * Hexagonal module: use cases depend on ports (interfaces);
 * concrete adapters are wired here.
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>(
            'JWT_EXPIRES_IN',
          ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    CreateUserUseCase,
    LoginUseCase,
    ListUsersUseCase,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: USER_QUERY_PORT, useClass: PrismaUserQueryRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasherAdapter },
    { provide: TOKEN_PORT, useClass: JwtTokenAdapter },
  ],
})
export class AuthModule {}
