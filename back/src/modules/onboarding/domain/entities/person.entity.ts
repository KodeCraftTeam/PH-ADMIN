export type PersonType = 'NATURAL' | 'JURIDICA';
export type DocumentType = 'CC' | 'CE' | 'NIT' | 'PASAPORTE';

export class Person {
  constructor(
    public readonly id: string,
    public readonly personType: PersonType,
    public readonly documentType: DocumentType,
    public readonly documentNumber: string,
    public readonly fullNameOrBusinessName: string,
    public readonly email: string | null = null,
    public readonly phone: string | null = null,
    public readonly notificationAddress: string | null = null,
  ) {}
}
