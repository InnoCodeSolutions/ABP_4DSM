// src/routes/userRoutes.ts
import express from 'express';
import * as userService from '../service/userService';

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await userService.getUserById(Number(req.params.id));
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
});

router.post('/', async (req, res) => {
  const { name, email, lastname, password } = req.body;
  const newUser = await userService.createUser(name, email, lastname, password);
  res.status(201).json(newUser);
});

router.delete('/:id', async (req, res) => {
  await userService.deleteUser(Number(req.params.id));
  res.status(204).send();
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, lastname, email, password } = req.body;

  const updated = await userService.updateUser(id, name, lastname, email, password);
  
  if (updated) res.json(updated);
  else res.status(404).json({ message: 'User not found' });
});


export default router;
