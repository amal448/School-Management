import bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../application/ports/services/password-hasher.service.interface';

export class BcryptPasswordService implements IPasswordHasher {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
  }
}