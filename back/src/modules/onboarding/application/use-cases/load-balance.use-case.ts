import { Injectable } from '@nestjs/common';

/**
 * Use case: step 5 of onboarding — initial balance per unit.
 * TODO: implement validation against existing units and persistence.
 */
@Injectable()
export class LoadBalanceUseCase {
  async execute(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
