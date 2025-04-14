import express from 'express';
import cors from 'cors';
import os from 'os';
import { createDatabaseIfNotExists } from './initDatabase';
import { setupDatabase } from './setupDatabase';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import gpsRoutes from './routes/gpsRoutes'

// Função auxiliar para obter o IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const start = async () => {
  await createDatabaseIfNotExists();
  await setupDatabase();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Rotas da aplicação
  app.use('/users', userRoutes);  // ex: GET /users
  app.use('/auth', authRoutes);   // ex: POST /auth/login
  app.use('/',gpsRoutes)

  const PORT = 3000;
  const HOST = '0.0.0.0'; // escuta em todas interfaces de rede

  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server online em http://${getLocalIP()}:${PORT}`);
  });
};

start();
