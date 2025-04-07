import { Pool } from 'pg';
import config from './config';

// Conexão com o banco de dados PostgreSQL conforme o arquivo config
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database, // Mude de 'name' para 'database'
});

export default pool;