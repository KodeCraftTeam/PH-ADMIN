import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateUserUseCase } from '../../../auth/application/use-cases/create-user.use-case';
import { AdministratorProfile } from '../../domain/entities/administrator-profile.entity';
import { ADMINISTRATOR_PROFILE_REPOSITORY } from '../../domain/ports/out/administrator-profile.repository';
import type { AdministratorProfileRepository } from '../../domain/ports/out/administrator-profile.repository';
import { TaxIdAlreadyRegisteredError } from '../../domain/errors/tax-id-already-registered.error';
import { TaxId } from '../../../../shared/domain/value-objects/tax-id.vo';
import { RegisterAdministratorDto } from '../dto/register-administrator.dto';
import { LOGGER_PORT } from '../../../../shared/domain/ports/out/logger.port';
import type { LoggerPort } from '../../../../shared/domain/ports/out/logger.port';

@Injectable()
export class RegisterAdministratorUseCase {
  constructor(
    private readonly createUser: CreateUserUseCase,
    @Inject(ADMINISTRATOR_PROFILE_REPOSITORY)
    private readonly profileRepo: AdministratorProfileRepository,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  async execute(dto: RegisterAdministratorDto): Promise<{ id: string }> {
    const existing = await this.profileRepo.findByTaxId(dto.taxId);
    if (existing) {
      throw new TaxIdAlreadyRegisteredError(dto.taxId);
    }

    const taxId = TaxId.create(dto.taxId);

    const { id: userId } = await this.createUser.execute({
      email: dto.email,
      password: dto.password,
      name: dto.nameOrBusinessName,
      role: 'ADMIN',
    });

    const profile = new AdministratorProfile(
      randomUUID(),
      userId,
      dto.personType,
      dto.nameOrBusinessName,
      taxId,
      dto.cityId,
      dto.phoneNumber,
      dto.address,
      dto.legalRepresentative,
    );
    await this.profileRepo.save(profile);

    this.logger.log(
      `Administrator profile ${profile.id} registered for user ${userId}`,
      'RegisterAdministratorUseCase',
    );
    return { id: profile.id };
  }
}
