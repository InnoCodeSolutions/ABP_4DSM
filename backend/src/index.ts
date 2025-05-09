/*import fs from 'fs';
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
  try {
    execSync('node ../../scripts/generateConfig.js', { stdio: 'inherit' });
  } catch (e) {
    console.error('❌ Erro ao executar generateConfig.js:', e);
    process.exit(1);
  }
}

// Agora que o JSON existe, podemos importar
let config;
try {
  config = require('./config/config.json');
  console.log('Config carregada:', config); // Log para depuração
} catch (e) {
  console.error('❌ Erro ao carregar config.json:', e);
  process.exit(1);
}

const start = async () => {
  await createDatabaseIfNotExists();
  await setupDatabase();

  const app = express();
  app.use(cors({
    origin: 'http://localhost:8081',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
  app.use(express.json());

  app.use('/users', userRoutes);
  app.use('/auth', authRoutes);
  app.use('/', gpsRoutes);

  // Usar config.database em vez de config.backend
  if (!config.database) {
    console.error('❌ Seção "database" não encontrada em config.json');
    process.exit(1);
  }

  const PORT = process.env.PORT || config.backend?.port || 3000;
  const HOST = '0.0.0.0';
  
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server online em http://${HOST}:${PORT}`);
  });
  
};

start().catch((e) => {
  console.error('❌ Erro ao iniciar o servidor:', e);
  process.exit(1);
});
*/

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
  try {
    execSync('node ../../scripts/generateConfig.js', { stdio: 'inherit' });
  } catch (e) {
    console.error('❌ Erro ao executar generateConfig.js:', e);
    process.exit(1);
  }
}

// Agora que o JSON existe, podemos importar
let config;
try {
  config = require('./config/config.json');
  console.log('Config carregada:', config); // Log para depuração
} catch (e) {
  console.error('❌ Erro ao carregar config.json:', e);
  process.exit(1);
}

const start = async () => {
  await createDatabaseIfNotExists();
  await setupDatabase();

  const app = express();
  app.use(cors({
    origin: 'http://localhost:8081',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
  app.use(express.json());

  app.use('/users', userRoutes);
  app.use('/auth', authRoutes);
  app.use('/', gpsRoutes);
  

  // Usar config.database em vez de config.backend
  if (!config.database) {
    console.error('❌ Seção "database" não encontrada em config.json');
    process.exit(1);
  }

  const PORT = process.env.PORT || config.backend?.port || 3000;
  const HOST = '0.0.0.0';
  
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server online em http://${HOST}:${PORT}`);
  });
  
};

start().catch((e) => {
  console.error('❌ Erro ao iniciar o servidor:', e);
  process.exit(1);
});