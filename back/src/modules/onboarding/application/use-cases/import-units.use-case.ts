import { Injectable } from '@nestjs/common';
import { ImportUnitsDto, ValidationResultDto } from '../dto/import-units.dto';

/**
 * Use case: steps 3 and 4 of onboarding.
 * Validates the imported batch (coefficients, duplicates, emails) and,
 * if everything passes, persists the units.
 * TODO: implement validation rules and persistence.
 */
@Injectable()
export class ImportUnitsUseCase {
  async execute(dto: ImportUnitsDto): Promise<ValidationResultDto> {
    void dto;
    throw new Error('Not implemented — frontend-only demo');
  }
}
