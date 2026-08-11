import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { RegisterAdministratorDto } from '../../../../application/dto/register-administrator.dto';
import { RegisterAdministratorUseCase } from '../../../../application/use-cases/register-administrator.use-case';
import { AuthGuard } from '../../../../../auth/infrastructure/adapters/in/http/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../auth/infrastructure/adapters/in/http/guards/roles.guard';
import { Roles } from '../../../../../auth/infrastructure/adapters/in/http/decorators/roles.decorator';

@Controller('administrators')
export class AdministratorsController {
  constructor(
    private readonly registerAdministrator: RegisterAdministratorUseCase,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('register')
  register(
    @Body() dto: RegisterAdministratorDto,
    @Req() request: Request & { user: { sub: string } },
  ) {
    return this.registerAdministrator.execute(request.user.sub, dto);
  }
}
