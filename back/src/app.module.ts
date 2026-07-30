import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { LoggerModule } from './shared/infrastructure/logging/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    PrismaModule,
    AuthModule,
    OnboardingModule,
  ],
})
export class AppModule {}
