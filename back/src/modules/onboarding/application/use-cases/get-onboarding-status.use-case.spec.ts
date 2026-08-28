import { GetOnboardingStatusUseCase } from './get-onboarding-status.use-case';
import { PropertyRepository } from '../../domain/ports/out/property.repository';
import {
  OnboardingStatusContext,
  OnboardingStatusQueryPort,
  UnitStatusRow,
} from '../ports/out/onboarding-status-query.port';
import { Property } from '../../domain/entities/property.entity';
import { TaxId } from '../../../../shared/domain/value-objects/tax-id.vo';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Coefficient } from '../../domain/value-objects/coefficient.vo';

function property(declaredTotalUnits: number): Property {
  return new Property(
    'property-1',
    'Conjunto Test',
    TaxId.create('900123456-7'),
    'Calle 1',
    'city-1',
    'RESIDENCIAL',
    declaredTotalUnits,
  );
}

function unit(overrides: Partial<UnitStatusRow> = {}): UnitStatusRow {
  return {
    identifier: 'Apto 101',
    coefficient: Coefficient.create(100),
    ownerships: [{ percentage: 100, isPrimary: true }],
    ...overrides,
  };
}

function context(
  overrides: Partial<OnboardingStatusContext> = {},
): OnboardingStatusContext {
  return {
    units: [unit()],
    balancesCount: 1,
    ...overrides,
  };
}

describe('GetOnboardingStatusUseCase', () => {
  let propertyRepo: jest.Mocked<PropertyRepository>;
  let statusQuery: jest.Mocked<OnboardingStatusQueryPort>;
  let useCase: GetOnboardingStatusUseCase;

  beforeEach(() => {
    propertyRepo = { save: jest.fn(), findById: jest.fn() };
    statusQuery = { loadContext: jest.fn() };
    propertyRepo.findById.mockResolvedValue(property(1));
    statusQuery.loadContext.mockResolvedValue(context());
    useCase = new GetOnboardingStatusUseCase(propertyRepo, statusQuery);
  });

  it('throws NotFoundError when the property does not exist', async () => {
    propertyRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
  });

  it('reports owners and coefficients as incomplete (not vacuously true) when 0 units are loaded', async () => {
    propertyRepo.findById.mockResolvedValue(property(4));
    statusQuery.loadContext.mockResolvedValue(
      context({ units: [], balancesCount: 0 }),
    );

    const result = await useCase.execute('property-1');

    expect(result.units).toEqual({
      complete: false,
      loaded: 0,
      declared: 4,
      mismatch: false,
    });
    expect(result.owners.complete).toBe(false);
    expect(result.coefficients).toEqual({ complete: false, currentSum: 0 });
    expect(result.canActivate).toBe(false);
  });

  it('reports fully complete onboarding as activatable, balances complete too', async () => {
    const result = await useCase.execute('property-1');

    expect(result.units).toEqual({
      complete: true,
      loaded: 1,
      declared: 1,
      mismatch: false,
    });
    expect(result.owners).toEqual({
      complete: true,
      total: 1,
      withoutOwner: 0,
    });
    expect(result.coefficients).toEqual({ complete: true, currentSum: 100 });
    expect(result.balances).toEqual({ complete: true, loaded: 1, total: 1 });
    expect(result.canActivate).toBe(true);
  });

  it('marks units incomplete when loaded < declared, even with 1+ units', async () => {
    propertyRepo.findById.mockResolvedValue(property(120));
    statusQuery.loadContext.mockResolvedValue(
      context({ units: [unit(), unit({ identifier: 'Apto 102' })] }),
    );

    const result = await useCase.execute('property-1');

    expect(result.units.complete).toBe(false);
    expect(result.units.loaded).toBe(2);
    expect(result.units.declared).toBe(120);
    expect(result.canActivate).toBe(false);
  });

  it('flags mismatch when loaded > declared', async () => {
    propertyRepo.findById.mockResolvedValue(property(1));
    statusQuery.loadContext.mockResolvedValue(
      context({ units: [unit(), unit({ identifier: 'Apto 102' })] }),
    );

    const result = await useCase.execute('property-1');

    expect(result.units.mismatch).toBe(true);
  });

  it('counts units without any owner and blocks owners/canActivate', async () => {
    statusQuery.loadContext.mockResolvedValue(
      context({ units: [unit({ ownerships: [] })] }),
    );

    const result = await useCase.execute('property-1');

    expect(result.owners).toEqual({
      complete: false,
      total: 1,
      withoutOwner: 1,
    });
    expect(result.canActivate).toBe(false);
  });

  it('marks coefficients incomplete when a unit has no coefficient, still reports the partial sum', async () => {
    statusQuery.loadContext.mockResolvedValue(
      context({ units: [unit({ coefficient: null })] }),
    );

    const result = await useCase.execute('property-1');

    expect(result.coefficients).toEqual({ complete: false, currentSum: 0 });
    expect(result.canActivate).toBe(false);
  });

  it('reports balances as incomplete progress without affecting canActivate', async () => {
    statusQuery.loadContext.mockResolvedValue(
      context({
        units: [
          unit({ coefficient: Coefficient.create(50) }),
          unit({ identifier: 'Apto 102', coefficient: Coefficient.create(50) }),
        ],
        balancesCount: 1,
      }),
    );
    propertyRepo.findById.mockResolvedValue(property(2));

    const result = await useCase.execute('property-1');

    expect(result.balances).toEqual({ complete: false, loaded: 1, total: 2 });
    expect(result.units.complete).toBe(true);
    expect(result.canActivate).toBe(true);
  });
});
