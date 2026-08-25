import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdministratorsModule } from '../administrators/administrators.module';
import { ActivatePropertyUseCase } from './application/use-cases/activate-property.use-case';
import { LoadBalanceUseCase } from './application/use-cases/load-balance.use-case';
import { CreatePropertyUseCase } from './application/use-cases/create-property.use-case';
import { ImportUnitsUseCase } from './application/use-cases/import-units.use-case';
import { GetAdministratorPropertiesUseCase } from './application/use-cases/get-administrator-properties.use-case';
import { PROPERTY_REPOSITORY } from './domain/ports/out/property.repository';
import { PROPERTY_QUERY_PORT } from './application/ports/out/property-query.port';
import { NOTIFICATION_PORT } from './domain/ports/out/notification.port';
import { IMPORT_BATCH_REPOSITORY } from './domain/ports/out/import-batch.repository';
import { SPREADSHEET_READER_PORT } from './application/ports/out/spreadsheet-reader.port';
import { OnboardingController } from './infrastructure/adapters/in/http/onboarding.controller';
import { ConsoleNotificationAdapter } from './infrastructure/adapters/out/notification/console-notification.adapter';
import { PrismaCommunityRepository } from './infrastructure/adapters/out/persistence/repositories/prisma-community.repository';
import { PrismaPropertyQueryRepository } from './infrastructure/adapters/out/persistence/repositories/prisma-property-query.repository';
import { PrismaImportBatchRepository } from './infrastructure/adapters/out/persistence/repositories/prisma-import-batch.repository';
import { ExceljsSpreadsheetReaderAdapter } from './infrastructure/adapters/out/spreadsheet/exceljs-spreadsheet-reader.adapter';

@Module({
  imports: [AuthModule, AdministratorsModule],
  controllers: [OnboardingController],
  providers: [
    CreatePropertyUseCase,
    GetAdministratorPropertiesUseCase,
    ImportUnitsUseCase,
    LoadBalanceUseCase,
    ActivatePropertyUseCase,
    { provide: PROPERTY_REPOSITORY, useClass: PrismaCommunityRepository },
    { provide: PROPERTY_QUERY_PORT, useClass: PrismaPropertyQueryRepository },
    { provide: NOTIFICATION_PORT, useClass: ConsoleNotificationAdapter },
    { provide: IMPORT_BATCH_REPOSITORY, useClass: PrismaImportBatchRepository },
    {
      provide: SPREADSHEET_READER_PORT,
      useClass: ExceljsSpreadsheetReaderAdapter,
    },
  ],
})
export class OnboardingModule {}
