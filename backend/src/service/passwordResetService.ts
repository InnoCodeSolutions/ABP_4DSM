import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { UserDao } from '../models/UserDao';
import { hashPassword } from '../utils/hash';

dotenv.config();

const dao = new UserDao();

// Configura o transporter usando variáveis de ambiente
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const requestPasswordReset = async (email: string) => {
  try {
    console.log(`[requestPasswordReset] Iniciando para email: ${email}`);
    const user = await dao.getUserByEmail(email);
    if (!user) {
      console.log(`[requestPasswordReset] E-mail não encontrado: ${email}`);
      throw new Error('E-mail não encontrado');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await dao.createVerificationCode(email, code, 'password_reset', expiresAt);
    console.log(`[requestPasswordReset] Código ${code} armazenado no banco para ${email}`);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de Redefinição de Senha',
      text: `Seu código de verificação é: ${code}. Ele expira em 15 minutos.`,
    });

    console.log(`[requestPasswordReset] E-mail enviado com código ${code} para ${email}`);

    return { message: 'Código de verificação enviado com sucesso' };
  } catch (error: any) {
    console.error(`[requestPasswordReset] Erro: ${error.message}`);
    throw new Error(`Erro ao solicitar redefinição: ${error.message}`);
  }
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  try {
    console.log(`[resetPassword] Iniciando para email: ${email}, código: ${code}`);
    const verification = await dao.getVerificationCode(code);

    if (!verification) throw new Error('Código inválido ou expirado');
    if (verification.email !== email) throw new Error('E-mail não corresponde ao código');

    const user = await dao.getUserByEmail(email);
    if (!user) throw new Error('Usuário não encontrado');

    if (newPassword.length < 8) throw new Error('A nova senha deve ter pelo menos 8 caracteres');

    const hashedPassword = await hashPassword(newPassword);
    await dao.updateUser(user.id, user.name, user.lastname, user.email, hashedPassword, user.phone);
    await dao.deleteVerificationCode(code);

    console.log(`[resetPassword] Senha redefinida e código removido para ${email}`);

    return { message: 'Senha redefinida com sucesso' };
  } catch (error: any) {
    console.error(`[resetPassword] Erro: ${error.message}`);
    throw new Error(`Erro ao redefinir senha: ${error.message}`);
  }
};
