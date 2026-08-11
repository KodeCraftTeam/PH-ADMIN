import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../domain/ports/out/user.repository';
import type { UserRepository } from '../../../domain/ports/out/user.repository';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { UpdateUserStatusDto } from '../../dto/update-user-status.dto';
import { LOGGER_PORT } from '../../../../../shared/domain/ports/out/logger.port';
import type { LoggerPort } from '../../../../../shared/domain/ports/out/logger.port';

@Injectable()
export class UpdateUserStatusUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  async execute(userId: string, dto: UpdateUserStatusDto): Promise<void> {
    const user = await this.userRepo.findById(userId);

    if (!user) throw new NotFoundError('User', userId);

    await this.userRepo.save({ ...user, status: dto.status });

    this.logger.log(
      `User ${userId} status changed to ${dto.status}`,
      'UpdateUserStatusUseCase',
    );
  }
}
