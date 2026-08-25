export abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly httpStatus: number = 400,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.code = code;
    this.name = new.target.name;
  }
}
