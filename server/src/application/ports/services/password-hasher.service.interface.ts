/**
 * Port for password hashing operations.
 * This interface allows the application layer to remain independent 
 * of specific security libraries like bcrypt or argon2.
 */
export interface IPasswordHasher {
  /**
   * Hashes a plain text password.
   * @param password - The raw password string.
   * @returns A promise that resolves to the hashed password string.
   */
  hash(password: string): Promise<string>;

  /**
   * Compares a plain text password with a stored hash.
   * @param plain - The raw password provided by the user.
   * @param hashed - The hashed password stored in the database.
   * @returns A promise that resolves to true if they match, false otherwise.
   */
  compare(plain: string, hashed: string): Promise<boolean>;
}