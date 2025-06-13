import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createDatabaseIfNotExists } from './initDatabase';
import { setupDatabase } from './setupDatabase';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import gpsRoutes from './routes/gpsRoutes';
import routeRoutes from './routes/routeRoutes';

dotenv.config();

const start = async () => {
  try {
    console.log('🔧 Iniciando criação/verificação do banco...');
    await createDatabaseIfNotExists();

    console.log('🧱 Iniciando setup do banco...');
    await setupDatabase();

    const app = express();

    app.use(cors({
      origin: '*',         // Permite qualquer origem
      credentials: false,  // ❌ Deve estar false se origin for '*'
    }));

    app.use(express.json());

    app.use('/users', userRoutes);
    app.use('/auth', authRoutes);
    app.use('/', gpsRoutes);
    app.use('/api/routes', routeRoutes);

    const PORT = parseInt(process.env.PORT || '3000', 10);
    const HOST = '0.0.0.0';

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server online em http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    // Comentado para não encerrar automaticamente
    // process.exit(1);
  }
};

start();
