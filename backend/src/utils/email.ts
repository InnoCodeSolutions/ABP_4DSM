import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: false, // true for 465, false for 587 or 25
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationCode = async (email: string, code: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de Recuperação de Senha',
      text: `Seu código de verificação é: ${code}. Validade: 15 minutos.`,
    };

    await transporter.sendMail(mailOptions);
    return { message: 'E-mail enviado com sucesso' };
  } catch (error: any) {
    console.error(`[sendVerificationCode] Erro: ${error.message}`);
    throw new Error(`Erro ao enviar e-mail: ${error.message}`);
  }
};
