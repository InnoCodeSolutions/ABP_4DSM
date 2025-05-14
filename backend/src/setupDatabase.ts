import { Client } from 'pg';
import config from './models/config';

export const setupDatabase = async () => {
  const dbConfig = config.database;

  const client = new Client({
    user: dbConfig.user,
    host: dbConfig.host,
    password: dbConfig.password,
    port: dbConfig.port,
    database: dbConfig.database,
  });

  await client.connect();

  try {
    // Cria schema
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS login;
    `);

    // Cria tabela users com a coluna phone
    await client.query(`
      CREATE TABLE IF NOT EXISTS login.users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        lastname VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    // Cria tabela devices
    await client.query(`
      CREATE TABLE IF NOT EXISTS login.devices (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES login.users(id),
        name VARCHAR(100) NOT NULL,
        device_id VARCHAR(50) UNIQUE NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    // Cria tabela gps_data
    await client.query(`
      CREATE TABLE IF NOT EXISTS login.gps_data (
        id SERIAL PRIMARY KEY,
        device_id VARCHAR(50) NOT NULL,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        altitude DOUBLE PRECISION,
        speed DOUBLE PRECISION,
        course DOUBLE PRECISION,
        satellites INTEGER,
        hdop DOUBLE PRECISION,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Adiciona a coluna phone em tabelas existentes (migração)
    await client.query(`
      ALTER TABLE login.users
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
    `);

    // Cria tabela verification_codes para códigos de verificação
    await client.query(`
      CREATE TABLE IF NOT EXISTS login.verification_codes (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) NOT NULL,
        code VARCHAR(6) NOT NULL,
        type VARCHAR(20) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Schema e tabelas criados com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao criar schema/tabela:', err);
  } finally {
    await client.end();
  }
};