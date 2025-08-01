import express from 'express';
import { loginUser } from '../service/authService';
import { requestPasswordReset, resetPassword } from '../service/passwordResetService';
import { authenticateToken } from '../middlewares/authMiddleware'; // Corrigir import

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    await requestPasswordReset(email);
    res.json({ message: 'Código de verificação enviado por e-mail' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    await resetPassword(email, code, newPassword);
    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/verify-token', authenticateToken, (req, res) => {
  console.log('Verificação de token bem-sucedida'); // Log para depuração
  res.status(200).json({ message: 'Token válido' });
});

export default router;