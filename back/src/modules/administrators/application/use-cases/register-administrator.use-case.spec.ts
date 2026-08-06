import { RegisterAdministratorUseCase } from './register-administrator.use-case';
import { CreateUserUseCase } from '../../../auth/application/use-cases/create-user/create-user.use-case';
import { AdministratorProfileRepository } from '../../domain/ports/out/administrator-profile.repository';
import { AdministratorProfile } from '../../domain/entities/administrator-profile.entity';
import { TaxId } from '../../../../shared/domain/value-objects/tax-id.vo';
import { TaxIdAlreadyRegisteredError } from '../../domain/errors/tax-id-already-registered.error';
import { LoggerPort } from '../../../../shared/domain/ports/out/logger.port';

describe('RegisterAdministratorUseCase', () => {
  let createUser: jest.Mocked<Pick<CreateUserUseCase, 'execute'>>;
  let profileRepo: jest.Mocked<AdministratorProfileRepository>;
  let logger: jest.Mocked<LoggerPort>;
  let useCase: RegisterAdministratorUseCase;

  beforeEach(() => {
    createUser = { execute: jest.fn() };
    profileRepo = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      findByTaxId: jest.fn(),
    };
    logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
    useCase = new RegisterAdministratorUseCase(
      createUser as unknown as CreateUserUseCase,
      profileRepo,
      logger,
    );
  });

  const dto = {
    email: 'admin@ph.com',
    password: 'secret123',
    personType: 'NATURAL' as const,
    nameOrBusinessName: 'Juan Perez',
    taxId: '123456789',
    cityId: 'city-1',
    phoneNumber: '3001234567',
    address: 'Cra 1 # 2-3',
    legalRepresentative: undefined,
  };

  it('creates the user and saves the profile', async () => {
    profileRepo.findByTaxId.mockResolvedValue(null);
    createUser.execute.mockResolvedValue({ id: 'user-1' });

    const result = await useCase.execute(dto);

    expect(createUser.execute).toHaveBeenCalledWith({
      email: dto.email,
      password: dto.password,
      name: dto.nameOrBusinessName,
      role: 'ADMIN',
    });
    expect(profileRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1', cityId: dto.cityId }),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(result).toEqual({ id: expect.any(String) });
  });

  it('throws TaxIdAlreadyRegisteredError when the tax ID is taken', async () => {
    profileRepo.findByTaxId.mockResolvedValue(
      new AdministratorProfile(
        'existing-id',
        'user-existing',
        'NATURAL',
        'Existing Admin',
        TaxId.create('123456789'),
        'city-1',
      ),
    );

    await expect(useCase.execute(dto)).rejects.toThrow(
      TaxIdAlreadyRegisteredError,
    );
    expect(createUser.execute).not.toHaveBeenCalled();
    expect(profileRepo.save).not.toHaveBeenCalled();
  });
});
