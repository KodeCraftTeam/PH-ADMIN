import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../../../../application/dto/create-user.dto';
import { LoginDto } from '../../../../application/dto/login.dto';
import { CreateUserUseCase } from '../../../../application/use-cases/create-user.use-case';
import { LoginUseCase } from '../../../../application/use-cases/login.use-case';
import { ListUsersUseCase } from '../../../../application/use-cases/list-users.use-case';
import { AuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly login: LoginUseCase,
    private readonly listUsers: ListUsersUseCase,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }

  @Post('login')
  async authenticate(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.login.execute(dto);

    response.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      domain: 'localhost',
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get('users')
  list() {
    return this.listUsers.execute();
  }
}
