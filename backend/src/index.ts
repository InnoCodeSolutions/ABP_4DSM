import express from 'express';
import { createDatabaseIfNotExists } from './initDatabase';
import { setupDatabase } from './setupDatabase';

const start = async () => {
  await createDatabaseIfNotExists();
  await setupDatabase();

  const app = express();
  app.use(express.json());

  // rotas aqui...

  app.listen(3000, () => {
    console.log('🚀 Server online em http://localhost:3000');
  });
};

start();