import { DomainError } from './domain-error';

export class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`No se ha encontrado el ${entity} con el ID ${id}`, 404);
  }
}
