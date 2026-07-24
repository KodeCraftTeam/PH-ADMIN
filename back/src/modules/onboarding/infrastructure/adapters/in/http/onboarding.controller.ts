import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreatePropertyDto } from '../../../../application/dto/create-property.dto';
import { ImportUnitsDto } from '../../../../application/dto/import-units.dto';
import { ActivatePropertyUseCase } from '../../../../application/use-cases/activate-property.use-case';
import { LoadBalanceUseCase } from '../../../../application/use-cases/load-balance.use-case';
import { CreatePropertyUseCase } from '../../../../application/use-cases/create-property.use-case';
import { ImportUnitsUseCase } from '../../../../application/use-cases/import-units.use-case';

/**
 * Inbound (driving) adapter: exposes onboarding over HTTP.
 * The frontend will consume these endpoints once wired for real.
 */
@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly createProperty: CreatePropertyUseCase,
    private readonly importUnits: ImportUnitsUseCase,
    private readonly loadBalance: LoadBalanceUseCase,
    private readonly activateProperty: ActivatePropertyUseCase,
  ) {}

  @Post('properties')
  create(@Body() dto: CreatePropertyDto) {
    return this.createProperty.execute(dto);
  }

  @Post('properties/:id/units/import')
  import(@Param('id') id: string, @Body() dto: ImportUnitsDto) {
    return this.importUnits.execute({ ...dto, propertyId: id });
  }

  @Post('properties/:id/balance')
  balance() {
    return this.loadBalance.execute();
  }

  @Post('properties/:id/activate')
  activate(@Param('id') id: string) {
    return this.activateProperty.execute(id);
  }
}
