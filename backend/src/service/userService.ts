import { hashPassword } from '../utils/hash';
import { UserDao } from '../models/UserDao';

const dao = new UserDao();

export const getAllUsers = () => dao.getAllUsers();
export const getUserById = (id: number) => dao.getUserById(id);

export const createUser = async (name: string, email: string, lastname: string, password: string, phone?: string) => {
  try {
    const hashedPassword = await hashPassword(password);
    return await dao.createUser(name, email, lastname, hashedPassword, phone); // Passe phone para o DAO
  } catch (error: any) {
    throw new Error(`Erro ao criar usuário: ${error.message}`);
  }
};

export const updateUser = async (id: number, name: string, lastname: string, email: string, password: string, phone?: string) => {
  try {
    const hashedPassword = await hashPassword(password);
    return await dao.updateUser(id, name, lastname, email, hashedPassword, phone); // Passe phone para o DAO
  } catch (error: any) {
    throw new Error(`Erro ao atualizar usuário: ${error.message}`);
  }
};

export const deleteUser = (id: number) => dao.deleteUser(id); // Ajustado para deleteUser