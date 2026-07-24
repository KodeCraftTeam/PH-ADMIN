import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, OnboardingModule],
})
export class AppModule {}
