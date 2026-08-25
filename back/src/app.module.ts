import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { AdministratorsModule } from './modules/administrators/administrators.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { LoggerModule } from './shared/infrastructure/logging/logger.module';
import { EmailModule } from './shared/infrastructure/email/email.module';
import { CatalogModule } from './shared/catalog.module';
import { MetricsModule } from './shared/infrastructure/metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    PrismaModule,
    EmailModule,
    CatalogModule,
    MetricsModule,
    AuthModule,
    OnboardingModule,
    AdministratorsModule,
  ],
})
export class AppModule {}
