import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHasherPort } from '../../../../domain/ports/out/password-hasher.port';

const SALT_ROUNDS = 10;

/**
 * Outbound (driven) adapter: password hashing via bcrypt.
 */
@Injectable()
export class BcryptPasswordHasherAdapter implements PasswordHasherPort {
  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
