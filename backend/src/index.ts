import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import express from 'express';
import cors from 'cors';
import { createDatabaseIfNotExists } from './initDatabase';
import { setupDatabase } from './setupDatabase';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import gpsRoutes from './routes/gpsRoutes';

// Caminho absoluto do config.json
const configPath = path.resolve(__dirname, 'config', 'config.json');

// Verifica se o config.json existe; se não, executa o script para gerar
if (!fs.existsSync(configPath)) {
  console.log('⚙️  Gerando config.json via generateConfig.js...');
  execSync('node ../../scripts/generateConfig.js', { stdio: 'inherit' });
}

// Agora que o JSON existe, podemos importar
const config = require('./config/config.json'); // Usar require pois import não aceita arquivos gerados dinamicamente

const start = async () => {
  await createDatabaseIfNotExists();
  await setupDatabase();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/users', userRoutes);
  app.use('/auth', authRoutes);
  app.use('/', gpsRoutes);

  const PORT = config.backend.port || 3000;
  const HOST = config.backend.host || '0.0.0.0';

  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server online em http://${HOST}:${PORT}`);
  });
};

start();
