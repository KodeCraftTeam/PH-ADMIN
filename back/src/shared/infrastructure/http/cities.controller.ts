import { Controller, Get } from '@nestjs/common';
import { ListCitiesUseCase } from '../../application/use-cases/list-cities.use-case';

@Controller('cities')
export class CitiesController {
  constructor(private readonly listCities: ListCitiesUseCase) {}

  @Get()
  list() {
    return this.listCities.execute();
  }
}
