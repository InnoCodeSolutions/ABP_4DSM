const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Caminho do arquivo YAML original
const yamlPath = path.join(__dirname, '..', 'backend', 'src', 'config', 'config.yaml');
console.log('Caminho do arquivo YAML:', yamlPath);

// Caminhos de saída
const backendJsonPath = path.join(__dirname, '..', 'backend', 'src', 'config', 'config.json');
const frontendJsonPath = path.join(__dirname, '..', 'frontend', 'src', 'config', 'config.json');

// Verifique se o arquivo YAML existe
if (!fs.existsSync(yamlPath)) {
  console.error('❌ O arquivo YAML não foi encontrado no caminho:', yamlPath);
  process.exit(1);
} else {
  console.log('✅ Arquivo YAML encontrado');
}

try {
  // Lê e converte o YAML para objeto JS
  const fileContents = fs.readFileSync(yamlPath, 'utf8');
  const data = yaml.load(fileContents);
  console.log('Conteúdo YAML convertido para objeto:', data);

  // Gera JSON válido com formatação limpa
  const cleanJson = JSON.stringify(data, null, 2);

  // Salva no backend
  fs.writeFileSync(backendJsonPath, cleanJson);
  console.log('✅ config.json gerado no backend.');

  // Garante que a pasta do frontend exista
  const frontendDir = path.dirname(frontendJsonPath);
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
    console.log('Pasta do frontend criada.');
  }

  // Salva no frontend
  fs.writeFileSync(frontendJsonPath, cleanJson);
  console.log('✅ config.json gerado no frontend!');
} catch (e) {
  console.error('❌ Erro ao gerar config.json:', e);
  process.exit(1);
}