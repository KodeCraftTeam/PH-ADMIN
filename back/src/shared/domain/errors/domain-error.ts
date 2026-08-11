export abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly httpStatus: number = 400,
    public readonly code?: string,
  ) {
    super(message);
    this.code = code;
    this.name = new.target.name;
  }
}
