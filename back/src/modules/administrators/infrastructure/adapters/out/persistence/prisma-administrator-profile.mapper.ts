import { AdministratorProfileModel as AdministratorProfileRecord } from '@prisma/client';
import {
  AdministratorProfile,
  PersonType,
} from '../../../../domain/entities/administrator-profile.entity';
import { TaxId } from '../../../../../../shared/domain/value-objects/tax-id.vo';

export function toDomainAdministratorProfile(
  record: AdministratorProfileRecord,
): AdministratorProfile {
  return new AdministratorProfile(
    record.id,
    record.userId,
    record.personType as PersonType,
    record.nameOrBusinessName,
    TaxId.create(record.taxId),
    record.cityId,
    record.phoneNumber ?? undefined,
    record.address ?? undefined,
    record.legalRepresentative ?? undefined,
  );
}
