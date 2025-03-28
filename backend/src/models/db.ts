import { Pool } from 'pg';
import config from './config';
// conexão com o banco de dados postgres conforme o arquivo config
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
});

export default pool;
