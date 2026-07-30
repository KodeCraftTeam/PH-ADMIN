/**
 * Outbound (driven) port: hashing/verification of passwords.
 * Implemented by infrastructure (bcrypt, argon2…).
 */
export interface PasswordHasherPort {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}

export const PASSWORD_HASHER = Symbol('PasswordHasherPort');
