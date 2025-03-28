import fs from 'fs';
import yaml from 'yaml';

interface DBConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface AppConfig {
  database: DBConfig;
}

const file = fs.readFileSync('./config/config.yaml', 'utf8'); //Caminho da váriavel de ambiente do banco, sendo necessário criar conforme a conxão com o banco de dados.
const config: AppConfig = yaml.parse(file);

export default config;
