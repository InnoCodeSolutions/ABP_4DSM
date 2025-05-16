import nodemailer from 'nodemailer';
import config from '../config/config.json';

const transporter = nodemailer.createTransport({
  host: config.email?.host || 'smtp.gmail.com', // Substitua pelo seu host SMTP (ex.: smtp.gmail.com)
  port: config.email?.port || 587, // Porta padrão (587 para TLS, 465 para SSL)
  secure: false, // true para 465, false para outras portas
  auth: {
    user: config.email?.user || 'your-email@gmail.com', // Substitua pelo seu e-mail
    pass: config.email?.pass || 'your-password', // Substitua pela sua senha ou app password
  },
  
});

export const sendVerificationCode = async (email: string, code: string) => {
  try {
    const mailOptions = {
      from: config.email?.user || 'your-email@gmail.com',
      to: email,
      subject: 'Código de Recuperação de Senha',
      text: `Seu código de verificação é: ${code}. Validade: 15 minutos.`,
    };

    await transporter.sendMail(mailOptions);
    return { message: 'E-mail enviado com sucesso' };
  } catch (error: any) {
    throw new Error(`Erro ao enviar e-mail: ${error.message}`);
  }
};