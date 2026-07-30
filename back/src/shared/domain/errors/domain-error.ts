export abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly httpStatus: number = 400,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
