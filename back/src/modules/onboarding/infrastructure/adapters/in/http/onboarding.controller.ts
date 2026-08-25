import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Request } from 'express';
import { AuthGuard } from '../../../../../auth/infrastructure/adapters/in/http/guards/jwt-auth.guard';
import { CreatePropertyDto } from '../../../../application/dto/create-property.dto';
import { ActivatePropertyUseCase } from '../../../../application/use-cases/activate-property.use-case';
import { LoadBalanceUseCase } from '../../../../application/use-cases/load-balance.use-case';
import { CreatePropertyUseCase } from '../../../../application/use-cases/create-property.use-case';
import { ImportUnitsUseCase } from '../../../../application/use-cases/import-units.use-case';
import { GetAdministratorPropertiesUseCase } from '../../../../application/use-cases/get-administrator-properties.use-case';

const IMPORT_FILE_INTERCEPTOR = FileInterceptor('file', {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly createProperty: CreatePropertyUseCase,
    private readonly getAdminProperties: GetAdministratorPropertiesUseCase,
    private readonly importUnits: ImportUnitsUseCase,
    private readonly loadBalance: LoadBalanceUseCase,
    private readonly activateProperty: ActivatePropertyUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Post('properties')
  create(
    @Body() dto: CreatePropertyDto,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.createProperty.execute(dto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('properties')
  listForAdmin(@Req() req: Request & { user: { sub: string } }) {
    return this.getAdminProperties.execute(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('properties/:id/units/import/preview')
  @UseInterceptors(IMPORT_FILE_INTERCEPTOR)
  previewImport(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.importUnits.execute({
      communityId: id,
      fileBuffer: file.buffer,
      originalFileName: file.originalname,
      commit: false,
    });
  }

  @UseGuards(AuthGuard)
  @Post('properties/:id/units/import')
  @UseInterceptors(IMPORT_FILE_INTERCEPTOR)
  commitImport(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.importUnits.execute({
      communityId: id,
      fileBuffer: file.buffer,
      originalFileName: file.originalname,
      commit: true,
    });
  }

  @UseGuards(AuthGuard)
  @Post('properties/:id/balance')
  balance() {
    return this.loadBalance.execute();
  }

  @UseGuards(AuthGuard)
  @Post('properties/:id/activate')
  activate(@Param('id') id: string) {
    return this.activateProperty.execute(id);
  }
}
