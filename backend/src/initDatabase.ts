import { Client } from 'pg';
import config from './models/config';

export const createDatabaseIfNotExists = async () => {
  const { host, port, user, password, database: dbName } = config.database;

  const client = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres' // conectar em postgres pra poder criar o novo
  });

  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Banco '${dbName}' criado.`);
    } else {
      console.log(`📦 Banco '${dbName}' já existe.`);
    }
  } catch (err) {
        console.error('❌ Erro ao criar banco de dados:', err);
  } finally {
    await client.end();
  }
};
