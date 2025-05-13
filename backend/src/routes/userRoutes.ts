import express from 'express';
import * as userService from '../service/userService';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, async (_req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

router.get('/:id', authenticateToken, async (req, res) => {
  const user = await userService.getUserById(Number(req.params.id));
  user ? res.json(user) : res.status(404).json({ message: 'Usuário não encontrado' });
});

router.post('/', async (req, res) => {
  const { name, email, lastname, password, phone } = req.body;
  try {
    const user = await userService.createUser(name, email, lastname, password, phone);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Erro ao cadastrar usuário' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { name, lastname, email, password, phone } = req.body;
  const updated = await userService.updateUser(Number(req.params.id), name, lastname, email, password, phone);
  updated ? res.json(updated) : res.status(404).json({ message: 'Usuário não encontrado' });
});

router.delete('/:id', authenticateToken, async (req, res) => {
  await userService.deleteUser(Number(req.params.id));
  res.status(204).send();
});

// 🚨 NOVAS ROTAS

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userService.sendRecoveryEmail(email);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await userService.resetPassword(token, newPassword);
    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
