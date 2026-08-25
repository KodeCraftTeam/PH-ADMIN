import { Unit } from '../../entities/unit.entity';
import { UnitGroup } from '../../entities/unit-group.entity';
import { Person } from '../../entities/person.entity';
import { PropertyOwnership } from '../../entities/property-ownership.entity';

export interface ImportBatchContext {
  existingUnits: Unit[];
  existingGroups: UnitGroup[];
  existingOwnershipsByUnitIdentifier: Map<string, OwnershipContextRow[]>;
}

export interface OwnershipContextRow {
  percentage: number;
  isPrimary: boolean;
}

export interface ImportBatch {
  communityId: string;
  groupsToCreate: UnitGroup[];
  units: Unit[]; // groupId already resolved
  personsToCreate: Person[];
  ownerships: PropertyOwnership[];
}

export interface ImportBatchRepository {
  loadContext(communityId: string): Promise<ImportBatchContext>;
  findPersonsByDocumentNumbers(documentNumbers: string[]): Promise<Person[]>;
  persist(batch: ImportBatch): Promise<void>;
}

export const IMPORT_BATCH_REPOSITORY = Symbol('ImportBatchRepository');
