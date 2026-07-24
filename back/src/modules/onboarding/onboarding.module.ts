import { Module } from '@nestjs/common';
import { ActivatePropertyUseCase } from './application/use-cases/activate-property.use-case';
import { LoadBalanceUseCase } from './application/use-cases/load-balance.use-case';
import { CreatePropertyUseCase } from './application/use-cases/create-property.use-case';
import { ImportUnitsUseCase } from './application/use-cases/import-units.use-case';
import { PROPERTY_REPOSITORY } from './domain/ports/out/property.repository';
import { NOTIFICATION_PORT } from './domain/ports/out/notification.port';
import { OnboardingController } from './infrastructure/adapters/in/http/onboarding.controller';
import { ConsoleNotificationAdapter } from './infrastructure/adapters/out/notification/console-notification.adapter';
import { InMemoryPropertyRepository } from './infrastructure/adapters/out/persistence/prisma/repositories/in-memory-property.repository';

/**
 * Hexagonal module: use cases depend on ports (interfaces);
 * concrete adapters are wired here.
 */
@Module({
  controllers: [OnboardingController],
  providers: [
    CreatePropertyUseCase,
    ImportUnitsUseCase,
    LoadBalanceUseCase,
    ActivatePropertyUseCase,
    { provide: PROPERTY_REPOSITORY, useClass: InMemoryPropertyRepository },
    { provide: NOTIFICATION_PORT, useClass: ConsoleNotificationAdapter },
  ],
})
export class OnboardingModule {}
