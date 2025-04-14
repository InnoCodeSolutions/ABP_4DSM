import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (plainText: string): Promise<string> => {
  return await bcrypt.hash(plainText, SALT_ROUNDS);
};

export const comparePassword = async (plainText: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(plainText, hash);
};
