// src/services/userService.ts

import { UserDao } from "../models/UserDao";


const dao = new UserDao();

export const getAllUsers = () => dao.getAllUsers();
export const getUserById = (id: number) => dao.getUserById(id);
export const createUser = (name: string, email: string, lastname: string, password: string) =>
  dao.createUser(name, email, lastname, password);
export const deleteUser = (id: number) => dao.dropUser(id);
export const updateUser = (id: number, name: string, lastname: string, email: string, password: string) =>
  dao.updateUser(id, name, lastname, email, password);
