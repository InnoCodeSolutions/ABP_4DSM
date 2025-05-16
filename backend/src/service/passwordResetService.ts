import nodemailer from 'nodemailer';
import { UserDao } from '../models/UserDao';
import { hashPassword } from '../utils/hash';
import config from '../config/config.json';

const dao = new UserDao();

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
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
    console.log(`[requestPasswordReset] Usuário encontrado: ${user.email}`);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    console.log(`[requestPasswordReset] Código gerado: ${code}, expira em: ${expiresAt.toISOString()}`);

    await dao.createVerificationCode(email, code, 'password_reset', expiresAt);
    console.log(`[requestPasswordReset] Código ${code} armazenado no banco para ${email}`);

    await transporter.sendMail({
      from: config.email.user,
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
    console.log(`[resetPassword] Resultado da verificação: ${JSON.stringify(verification)}`);
    if (!verification) throw new Error('Código inválido ou expirado');

    if (verification.email !== email) {
      console.log(`[resetPassword] E-mail não corresponde: esperado ${verification.email}, recebido ${email}`);
      throw new Error('E-mail não corresponde ao código');
    }

    const user = await dao.getUserByEmail(email);
    if (!user) {
      console.log(`[resetPassword] Usuário não encontrado: ${email}`);
      throw new Error('Usuário não encontrado');
    }
    console.log(`[resetPassword] Usuário encontrado: ${user.email}`);

    if (newPassword.length < 8) {
      console.log(`[resetPassword] Nova senha inválida: ${newPassword.length} caracteres`);
      throw new Error('A nova senha deve ter pelo menos 8 caracteres');
    }

    const hashedPassword = await hashPassword(newPassword);
    await dao.updateUser(user.id, user.name, user.lastname, user.email, hashedPassword, user.phone);
    console.log(`[resetPassword] Senha atualizada para o usuário ${email}`);

    await dao.deleteVerificationCode(code);
    console.log(`[resetPassword] Código ${code} removido do banco`);

    return { message: 'Senha redefinida com sucesso' };
  } catch (error: any) {
    console.error(`[resetPassword] Erro: ${error.message}`);
    throw new Error(`Erro ao redefinir senha: ${error.message}`);
  }
};