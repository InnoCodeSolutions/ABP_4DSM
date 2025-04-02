import { hashPassword } from '../utils/hash';
import { UserDao } from '../models/UserDao';

const dao = new UserDao();

export const getAllUsers = () => dao.getAllUsers();
export const getUserById = (id: number) => dao.getUserById(id);

export const createUser = async (name: string, email: string, lastname: string, password: string) => {
  const hashedPassword = await hashPassword(password);
  return dao.createUser(name, email, lastname, hashedPassword);
};

export const updateUser = async (id: number, name: string, lastname: string, email: string, password: string) => {
  const hashedPassword = await hashPassword(password);
  return dao.updateUser(id, name, lastname, email, hashedPassword);
};

export const deleteUser = (id: number) => dao.dropUser(id);
