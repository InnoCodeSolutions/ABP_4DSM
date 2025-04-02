import { UserDao } from '../models/UserDao';
import { comparePassword } from '../utils/hash';
import jwt from 'jsonwebtoken';

const dao = new UserDao();
const SECRET = 'minha_chave_supersecreta';

export const loginUser = async (email: string, password: string) => {
  const user = await dao.getUserByEmail(email);
  if (!user) throw new Error('Usuário não encontrado');

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error('Senha incorreta');

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
  return token;
};
