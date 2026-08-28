import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_REPOSITORY } from '../../domain/ports/out/property.repository';
import type { PropertyRepository } from '../../domain/ports/out/property.repository';
import {
  ONBOARDING_STATUS_QUERY_PORT,
  type OnboardingStatusQueryPort,
} from '../ports/out/onboarding-status-query.port';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Property } from '../../domain/entities/property.entity';
import { Unit } from '../../domain/entities/unit.entity';
import { OwnershipPercentage } from '../../domain/value-objects/ownership-percentage.vo';
import { Coefficient } from '../../domain/value-objects/coefficient.vo';
import { OnboardingStatus } from '../read-models/onboarding-status.read-model';

/**
 * Use case: orquestador del wizard — estado de los 4 pasos de carga.
 * No reimplementa reglas de completitud: reutiliza las invariantes ya
 * codeadas (Property.assertCoefficientsComplete, Unit.assertOwnershipsComplete)
 * para que "completo" signifique exactamente lo mismo acá que en los
 * endpoints de import. Saldos es el único paso no bloqueante para
 * activación (independencia ya decidida en la conversación de onboarding).
 */
@Injectable()
export class GetOnboardingStatusUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepository,
    @Inject(ONBOARDING_STATUS_QUERY_PORT)
    private readonly statusQuery: OnboardingStatusQueryPort,
  ) {}

  async execute(propertyId: string): Promise<OnboardingStatus> {
    const property = await this.propertyRepo.findById(propertyId);
    if (!property) throw new NotFoundError('Property', propertyId);

    const { units, balancesCount } =
      await this.statusQuery.loadContext(propertyId);

    const loaded = units.length;
    const declared = property.declaredTotalUnits;
    const unitsStatus = {
      complete: loaded === declared,
      loaded,
      declared,
      mismatch: loaded > declared,
    };

    let withoutOwner = 0;
    let ownersComplete = units.length > 0;
    for (const u of units) {
      if (u.ownerships.length === 0) {
        withoutOwner++;
        ownersComplete = false;
        continue;
      }
      try {
        Unit.assertOwnershipsComplete(
          u.identifier,
          u.ownerships.map((o) => ({
            percentage: OwnershipPercentage.create(o.percentage),
            isPrimary: o.isPrimary,
          })),
        );
      } catch {
        ownersComplete = false;
      }
    }
    const owners = {
      complete: ownersComplete,
      total: units.length,
      withoutOwner,
    };

    const coefficients = units.map((u) => u.coefficient);
    let coefficientsComplete = units.length > 0;
    try {
      Property.assertCoefficientsComplete(coefficients);
    } catch {
      coefficientsComplete = false;
    }
    const currentSum = Number(
      coefficients
        .filter((c): c is Coefficient => c !== null)
        .reduce((acc, c) => acc + c.percentage, 0)
        .toFixed(2),
    );
    const coefficientsStatus = { complete: coefficientsComplete, currentSum };

    const total = units.length;
    const balances = {
      complete: total > 0 && balancesCount === total,
      loaded: balancesCount,
      total,
    };

    return {
      units: unitsStatus,
      owners,
      coefficients: coefficientsStatus,
      balances,
      canActivate:
        unitsStatus.complete && owners.complete && coefficientsStatus.complete,
    };
  }
}
