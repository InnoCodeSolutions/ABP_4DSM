// src/setupDatabase.ts
import { Client } from 'pg';
import config from './models/config';


export const setupDatabase = async () => {
  const dbConfig = config.database;

  const client = new Client({
    user: dbConfig.user,
    host: dbConfig.host,
    password: dbConfig.password,
    port: dbConfig.port,
    database: dbConfig.database, // agora sim conecta no banco criado
  });

  await client.connect();

  try {
    // Cria schema
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS login;
    `);

    // Cria tabela users
    await client.query(`
      CREATE TABLE IF NOT EXISTS login.users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        lastname VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Schema e tabela criados com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao criar schema/tabela:', err);
  } finally {
    await client.end();
  }
};
