import { CreatePropertyUseCase } from './create-property.use-case';
import { PropertyRepository } from '../../domain/ports/out/property.repository';
import { AdministratorProfileRepository } from '../../../administrators/domain/ports/out/administrator-profile.repository';
import { AdministratorProfile } from '../../../administrators/domain/entities/administrator-profile.entity';
import { TaxId } from '../../../../shared/domain/value-objects/tax-id.vo';
import { LoggerPort } from '../../../../shared/domain/ports/out/logger.port';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { InvalidTaxIdError } from '../../../../shared/domain/errors/invalid-tax-id.error';
import { CreatePropertyDto } from '../dto/create-property.dto';

describe('CreatePropertyUseCase', () => {
  let propertyRepo: jest.Mocked<PropertyRepository>;
  let profileRepo: jest.Mocked<AdministratorProfileRepository>;
  let logger: jest.Mocked<LoggerPort>;
  let useCase: CreatePropertyUseCase;

  beforeEach(() => {
    propertyRepo = {
      save: jest.fn(),
      findById: jest.fn(),
    };
    profileRepo = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      findByTaxId: jest.fn(),
    };
    logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
    useCase = new CreatePropertyUseCase(propertyRepo, profileRepo, logger);
  });

  const userId = 'user-1';
  const dto: CreatePropertyDto = {
    name: 'Edificio Central',
    taxId: '123456789',
    address: 'Cra 1 # 2-3',
    cityId: 'city-1',
    type: 'RESIDENCIAL',
    totalUnits: 20,
    totalTowers: 1,
    adminName: 'Juan Perez',
    adminEmail: 'juan@example.com',
  };

  const existingProfile = new AdministratorProfile(
    'profile-1',
    userId,
    'NATURAL',
    'Juan Perez',
    TaxId.create('123456789'),
    'city-1',
  );

  it('creates the property for an administrator with an existing profile', async () => {
    profileRepo.findByUserId.mockResolvedValue(existingProfile);

    const result = await useCase.execute(dto, userId);

    expect(propertyRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: dto.name,
        address: dto.address,
        cityId: dto.cityId,
        type: dto.type,
        declaredTotalUnits: dto.totalUnits,
      }),
      userId,
    );
    expect(result.id).toEqual(expect.any(String));
  });

  it('defaults declaredTotalUnits to 1 when totalUnits is falsy', async () => {
    profileRepo.findByUserId.mockResolvedValue(existingProfile);

    await useCase.execute({ ...dto, totalUnits: 0 }, userId);

    expect(propertyRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ declaredTotalUnits: 1 }),
      userId,
    );
  });

  it('logs after creating the property', async () => {
    profileRepo.findByUserId.mockResolvedValue(existingProfile);

    await useCase.execute(dto, userId);

    expect(logger.log).toHaveBeenCalledWith(
      expect.stringContaining('created for user user-1'),
      'CreatePropertyUseCase',
    );
  });

  it('throws NotFoundError when the caller has no administrator profile', async () => {
    profileRepo.findByUserId.mockResolvedValue(null);

    await expect(useCase.execute(dto, userId)).rejects.toThrow(NotFoundError);
    expect(propertyRepo.save).not.toHaveBeenCalled();
  });

  it('throws InvalidTaxIdError when the tax ID is malformed', async () => {
    profileRepo.findByUserId.mockResolvedValue(existingProfile);

    await expect(
      useCase.execute({ ...dto, taxId: 'not-a-tax-id' }, userId),
    ).rejects.toThrow(InvalidTaxIdError);
    expect(propertyRepo.save).not.toHaveBeenCalled();
  });
});
