import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateUserDto } from '../../../../application/dto/create-user.dto';
import { LoginDto } from '../../../../application/dto/login.dto';
import { CreateUserUseCase } from '../../../../application/use-cases/create-user/create-user.use-case';
import { LoginUseCase } from '../../../../application/use-cases/login/login.use-case';
import { ListUsersUseCase } from '../../../../application/use-cases/list-users/list-users.use-case';
import { AuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import type { CookieOptions, Response } from 'express';
import { SendEmailDto } from '../../../../application/dto/send-email.dto';
import { StartRegistrationUseCase } from '../../../../application/use-cases/start-registration/start-registration.use-case';
import { ResendCodeUseCase } from '../../../../application/use-cases/resend-code/resend-code.use-case';
import { SendCodeDto } from '../../../../application/dto/send-code.dto';
import { VerifyCodeUseCase } from '../../../../application/use-cases/verify-code/verify-code.use-case';
import { CompleteRegisterDto } from '../../../../application/dto/complete-register';
import { CompleteRegisterUseCase } from '../../../../application/use-cases/complete-register/complete-register.use-case';
import { LoginResponse } from '../../../../application/dto/login-response.dto';
import { LoginGoogleUseCase } from '../../../../application/use-cases/login-google/login-google.use-case';
import { GetCurrentUserUseCase } from '../../../../application/use-cases/get-current-user/get-current-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly login: LoginUseCase,
    private readonly listUsers: ListUsersUseCase,
    private readonly startRegistration: StartRegistrationUseCase,
    private readonly resendCode: ResendCodeUseCase,
    private readonly verifyCode: VerifyCodeUseCase,
    private readonly completeRegistration: CompleteRegisterUseCase,
    private readonly loginGoogleUseCase: LoginGoogleUseCase,
    private readonly getCurrentUser: GetCurrentUserUseCase,
  ) {}

  @Post('register/start')
  async startRegisterCode(@Body() dto: SendEmailDto) {
    return this.startRegistration.execute(dto);
  }

  @Post('register/resend')
  async resendRegisterCode(@Body() dto: SendEmailDto) {
    return this.resendCode.execute(dto);
  }

  @Post('register/verify')
  async verifyRegistration(@Body() dto: SendCodeDto) {
    return this.verifyCode.execute(dto);
  }

  @Post('register/complete')
  async completeRegister(@Body() dto: CompleteRegisterDto) {
    return this.completeRegistration.execute(dto);
  }

  @Post('login')
  async authenticate(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse | void> {
    const data = await this.login.execute(dto);

    response.cookie('token', data.accessToken, {
      ...this.cookieOptions(),
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    response.send({
      name: data.name,
      role: data.role,
    });
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token', this.cookieOptions());
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() request: Request & { user: { sub: string } }) {
    return this.getCurrentUser.execute(request.user.sub);
  }

  private cookieOptions(): CookieOptions {
    const isProd = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      ...(process.env.COOKIE_DOMAIN
        ? { domain: process.env.COOKIE_DOMAIN }
        : {}),
    };
  }

  @Get('google')
  loginGoogle(@Res() res: Response) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      throw new BadRequestException('Google OAuth not configured');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'openid email profile',
      response_type: 'code',
    });

    return res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    );
  }

  @Get('google/callback')
  async callback(
    @Query('code') code: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const data = await this.loginGoogleUseCase.execute(code);

    response.cookie('token', data.accessToken, {
      ...this.cookieOptions(),
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    const frontendUrl = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
    response.redirect(`${frontendUrl}/admin`);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get('users')
  list() {
    return this.listUsers.execute();
  }
}
