// src/index.ts
import express from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { setupDatabase } from './setupDatabase';

const app = express();
app.use(express.json());

// ⚡ Chama o setup do banco antes de tudo
setupDatabase();

app.use('/users', userRoutes);
app.use(authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
