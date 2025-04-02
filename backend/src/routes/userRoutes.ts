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
  const { name, email, lastname, password } = req.body;
  const user = await userService.createUser(name, email, lastname, password);
  res.status(201).json(user);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { name, lastname, email, password } = req.body;
  const updated = await userService.updateUser(Number(req.params.id), name, lastname, email, password);
  updated ? res.json(updated) : res.status(404).json({ message: 'Usuário não encontrado' });
});

router.delete('/:id', authenticateToken, async (req, res) => {
  await userService.deleteUser(Number(req.params.id));
  res.status(204).send();
});

export default router;
