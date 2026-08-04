import { AdministratorProfile } from '../../entities/administrator-profile.entity';

export const ADMINISTRATOR_PROFILE_REPOSITORY = Symbol(
  'ADMINISTRATOR_PROFILE_REPOSITORY',
);

export interface AdministratorProfileRepository {
  save(profile: AdministratorProfile): Promise<void>;
  findByUserId(userId: string): Promise<AdministratorProfile | null>;
  findByTaxId(taxId: string): Promise<AdministratorProfile | null>;
}
