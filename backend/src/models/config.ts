import dotenv from 'dotenv';
dotenv.config();

// Validação segura para evitar falhas silenciosas
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Variável de ambiente '${key}' não está definida`);
  }
  return value;
}

export const dbConfig = {
  host: requireEnv('DB_HOST'),
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: requireEnv('DB_USER'),
  password: requireEnv('DB_PASSWORD'),
  database: requireEnv('DB_NAME'),
};

export const emailConfig = {
  host: requireEnv('EMAIL_HOST'),
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  user: requireEnv('EMAIL_USER'),
  pass: requireEnv('EMAIL_PASS'),
};
