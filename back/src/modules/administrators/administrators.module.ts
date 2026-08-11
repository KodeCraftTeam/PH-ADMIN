import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RegisterAdministratorUseCase } from './application/use-cases/register-administrator.use-case';
import { ADMINISTRATOR_PROFILE_REPOSITORY } from './domain/ports/out/administrator-profile.repository';
import { AdministratorsController } from './infrastructure/adapters/in/http/administrators.controller';
import { PrismaAdministratorProfileRepository } from './infrastructure/adapters/out/persistence/prisma-administrator-profile.repository';

/**
 * Hexagonal module: use cases depend on ports (interfaces);
 * concrete adapters are wired here.
 */
@Module({
  imports: [AuthModule],
  controllers: [AdministratorsController],
  providers: [
    RegisterAdministratorUseCase,
    {
      provide: ADMINISTRATOR_PROFILE_REPOSITORY,
      useClass: PrismaAdministratorProfileRepository,
    },
  ],
  exports: [ADMINISTRATOR_PROFILE_REPOSITORY],
})
export class AdministratorsModule {}
