import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../domain/ports/out/user.repository';
import type { UserRepository } from '../../../domain/ports/out/user.repository';
import { InvalidCredentialsError } from '../../../domain/errors/invalid-credentials.error';
import { CurrentUserResponse } from '../../dto/current-user-response.dto';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string): Promise<CurrentUserResponse> {
    const user = await this.userRepo.findById(userId);

    if (!user) throw new InvalidCredentialsError();

    return {
      name: user.name,
      role: user.role,
      needsOnBoarding: user.status === 'ONBOARDING',
    };
  }
}
