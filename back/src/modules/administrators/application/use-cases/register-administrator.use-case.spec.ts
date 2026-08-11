import { RegisterAdministratorUseCase } from './register-administrator.use-case';
import { AdministratorProfileRepository } from '../../domain/ports/out/administrator-profile.repository';
import { AdministratorProfile } from '../../domain/entities/administrator-profile.entity';
import { TaxId } from '../../../../shared/domain/value-objects/tax-id.vo';
import { TaxIdAlreadyRegisteredError } from '../../domain/errors/tax-id-already-registered.error';
import { LoggerPort } from '../../../../shared/domain/ports/out/logger.port';

describe('RegisterAdministratorUseCase', () => {
  let profileRepo: jest.Mocked<AdministratorProfileRepository>;
  let logger: jest.Mocked<LoggerPort>;
  let useCase: RegisterAdministratorUseCase;

  beforeEach(() => {
    profileRepo = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      findByTaxId: jest.fn(),
    };
    logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
    useCase = new RegisterAdministratorUseCase(profileRepo, logger);
  });

  const userId = 'user-1';
  const dto = {
    personType: 'NATURAL' as const,
    nameOrBusinessName: 'Juan Perez',
    taxId: '123456789',
    cityId: 'city-1',
    phoneNumber: '3001234567',
    address: 'Cra 1 # 2-3',
    legalRepresentative: undefined,
  };

  it('saves the profile for the authenticated user', async () => {
    profileRepo.findByTaxId.mockResolvedValue(null);

    const result = await useCase.execute(userId, dto);

    expect(profileRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ userId, cityId: dto.cityId }),
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

    await expect(useCase.execute(userId, dto)).rejects.toThrow(
      TaxIdAlreadyRegisteredError,
    );
    expect(profileRepo.save).not.toHaveBeenCalled();
  });
});
