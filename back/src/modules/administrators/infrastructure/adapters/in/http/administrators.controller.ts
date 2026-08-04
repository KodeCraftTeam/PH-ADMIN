import { Body, Controller, Post } from '@nestjs/common';
import { RegisterAdministratorDto } from '../../../../application/dto/register-administrator.dto';
import { RegisterAdministratorUseCase } from '../../../../application/use-cases/register-administrator.use-case';

/**
 * Inbound (driving) adapter: public self-registration for PH administrators.
 */
@Controller('administrators')
export class AdministratorsController {
  constructor(
    private readonly registerAdministrator: RegisterAdministratorUseCase,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterAdministratorDto) {
    return this.registerAdministrator.execute(dto);
  }
}
