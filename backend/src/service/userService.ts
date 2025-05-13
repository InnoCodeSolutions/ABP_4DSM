import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { hashPassword } from '../utils/hash';
import { UserDao } from '../models/UserDao';

const dao = new UserDao();
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta';

export const getAllUsers = () => dao.getAllUsers();
export const getUserById = (id: number) => dao.getUserById(id);

export const createUser = async (name: string, email: string, lastname: string, password: string, phone?: string) => {
  try {
    const hashedPassword = await hashPassword(password);
    return await dao.createUser(name, email, lastname, hashedPassword, phone);
  } catch (error: any) {
    throw new Error(`Erro ao criar usuário: ${error.message}`);
  }
};

export const updateUser = async (id: number, name: string, lastname: string, email: string, password: string, phone?: string) => {
  try {
    const hashedPassword = await hashPassword(password);
    return await dao.updateUser(id, name, lastname, email, hashedPassword, phone);
  } catch (error: any) {
    throw new Error(`Erro ao atualizar usuário: ${error.message}`);
  }
};

export const deleteUser = (id: number) => dao.deleteUser(id);

export const sendRecoveryEmail = async (email: string) => {
  const user = await dao.getUserByEmail(email);
  if (!user) throw new Error('Usuário não encontrado');

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  const resetLink = `http://localhost:4000/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperação de Senha',
    html: `<p>Clique no link para redefinir sua senha:</p><a href="${resetLink}">${resetLink}</a>`
  });

  return { message: 'E-mail enviado com sucesso' };
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const hashed = await hashPassword(newPassword);
    await dao.updateUserPasswordByEmail(decoded.email, hashed);
  } catch (error: any) {
    throw new Error('Token inválido ou expirado');
  }
};
