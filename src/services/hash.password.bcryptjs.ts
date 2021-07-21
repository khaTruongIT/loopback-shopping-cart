import {inject} from '@loopback/core';
import {compare, genSalt, hash} from 'bcryptjs';
import {PasswordHasherBindings} from '../keys';

export type HashPassword = (
  password: string,
  rounds: number,
) => Promise<string>;

// bind function to `services.bcryptjs.HashPassword`
export async function hashPassword(
  password: string,
  rounds: number,
): Promise<string> {
  const salt = await genSalt(rounds);
  console.log(rounds);
  const hashedPassword = await hash(password, salt);
  return  hashedPassword;
}

export interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPass: T, storedPass: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
  constructor(
    @inject(PasswordHasherBindings.ROUNDS)
    private readonly rounds: number,
  ) {}


  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.rounds);
    const hashedPassword = await hash(password, salt);
    return  hashedPassword;
  }

  async comparePassword(
    providedPass: string,
    storedPass: string,
  ): Promise<boolean> {
    const passwordIsMatched = await compare(providedPass, storedPass);
    return passwordIsMatched;
  }
}
