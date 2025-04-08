/* CÓDIGO ANTIGO QUE NÃO DEIXA USAR O EXPO GO
import express from 'express';
import { createDatabaseIfNotExists } from './initDatabase';
import { setupDatabase } from './setupDatabase';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const start = async () => {
  await createDatabaseIfNotExists();
  await setupDatabase();

  const app = express();
  app.use(express.json());

  // rotas aqui...
  app.use('/users', userRoutes);
  app.use(authRoutes);

  app.listen(3000, () => {
    console.log('🚀 Server online em http://localhost:3000');
  });
};

start();

*/

import express from 'express';
import cors from 'cors'; 
import { createDatabaseIfNotExists } from './initDatabase';
import { setupDatabase } from './setupDatabase';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const start = async () => {
  await createDatabaseIfNotExists();
  await setupDatabase();

  const app = express();
  app.use(cors()); 
  app.use(express.json());

  // Definição das rotas com prefixo correto
  app.use('/users', userRoutes);  // Mantém as rotas de usuários
  app.use('/auth', authRoutes);   // Agora as rotas de autenticação ficam dentro de /auth

  app.listen(3000, () => {
    console.log('🚀 Server online em http://localhost:3000');
  });
};

start();
