import express from 'express';
import * as userService from '../service/userService';
import { authenticateToken } from '../middlewares/authMiddleware';
import { Request, Response } from 'express';


const router = express.Router();

// Expressão regular para validar e-mail

router.get('/', authenticateToken, async (_req:Request, res:Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

router.get('/:id', authenticateToken, async (req:Request, res:Response) => {
  const user = await userService.getUserById(Number(req.params.id));
  user ? res.json(user) : res.status(404).json({ message: 'Usuário não encontrado' });
});

// Expressão regular no topo
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req:any, res: any) => {
    const { name, email, lastname, password, phone } = req.body;

    // Validação do e-mail
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'E-mail inválido.' });
    }

    try {
      const user = await userService.createUser(
        name,
        email,
        lastname,
        password,
        phone
      );
      res.status(201).json(user);
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error.message);
      if (error.message === 'E-mail já cadastrado.') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Erro ao cadastrar usuário' });
      }
    }
  });

router.put('/:id', authenticateToken, async (req:Request, res:Response) => {
  const { name, lastname, email, password, phone } = req.body; // Adicione phone aqui também, se quiser suportar atualização
  const updated = await userService.updateUser(Number(req.params.id), name, lastname, email, password, phone);
  updated ? res.json(updated) : res.status(404).json({ message: 'Usuário não encontrado' });
});

router.delete('/:id', authenticateToken, async (req:Request, res:Response) => {
  await userService.deleteUser(Number(req.params.id));
  res.status(204).send();
});

export default router;