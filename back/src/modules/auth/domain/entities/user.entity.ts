export type UserRole = 'SUPER_ADMIN' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'ONBOARDING';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly name: string,
    public readonly role: UserRole,
    public readonly status: UserStatus = 'ACTIVE',
    public readonly code?: string,
  ) {}
}
