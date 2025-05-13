const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Caminho do arquivo YAML original
const yamlPath = path.resolve(__dirname, '../backend/src/config/config.yaml');
console.log('Caminho do arquivo YAML:', yamlPath);

// Caminhos de saída para config.json
const backendJsonPath = path.resolve(__dirname, '../backend/src/config/config.json');
const frontendJsonPath = path.resolve(__dirname, '../frontend/src/config/config.json');
console.log('Caminho para backend config.json:', backendJsonPath);
console.log('Caminho para frontend config.json:', frontendJsonPath);

// Verifique se o arquivo YAML existe
if (!fs.existsSync(yamlPath)) {
  console.error('❌ O arquivo YAML não foi encontrado no caminho:', yamlPath);
  process.exit(1);
} else {
  console.log('✅ Arquivo YAML encontrado');
}

try {
  // Lê e converte o YAML para objeto JS
  console.log('Lendo arquivo YAML...');
  const fileContents = fs.readFileSync(yamlPath, 'utf8');
  const data = yaml.load(fileContents);
  console.log('Conteúdo YAML convertido para objeto:', JSON.stringify(data, null, 2));

  // Gera JSON válido com formatação limpa
  const cleanJson = JSON.stringify(data, null, 2);

  // Salva no backend
  console.log('Tentando salvar config.json no backend...');
  fs.writeFileSync(backendJsonPath, cleanJson);
  console.log('✅ config.json gerado no backend:', backendJsonPath);
  if (!fs.existsSync(backendJsonPath)) {
    console.error('❌ Erro: config.json não foi criado no backend');
    process.exit(1);
  } else {
    console.log('✅ Verificado: config.json existe no backend');
  }

  // Garante que a pasta do frontend exista
  const frontendDir = path.dirname(frontendJsonPath);
  console.log('Verificando pasta do frontend:', frontendDir);
  if (!fs.existsSync(frontendDir)) {
    console.log('Pasta do frontend não existe, criando...');
    try {
      fs.mkdirSync(frontendDir, { recursive: true });
      console.log('✅ Pasta do frontend criada:', frontendDir);
    } catch (mkdirError) {
      console.error('❌ Erro ao criar pasta do frontend:', mkdirError.message);
      console.error(mkdirError.stack);
      process.exit(1);
    }
  } else {
    console.log('✅ Pasta do frontend já existe');
  }

  // Verifica permissões de escrita na pasta do frontend
  console.log('Verificando permissões de escrita na pasta do frontend...');
  try {
    const testFile = path.join(frontendDir, 'test-write.txt');
    fs.writeFileSync(testFile, 'teste');
    fs.unlinkSync(testFile);
    console.log('✅ Permissões de escrita confirmadas na pasta do frontend');
  } catch (permError) {
    console.error('❌ Erro: Sem permissão para escrever na pasta do frontend:', permError.message);
    console.error(permError.stack);
    process.exit(1);
  }

  // Copia o config.json do backend para o frontend
  console.log('Tentando copiar config.json do backend para o frontend...');
  try {
    fs.copyFileSync(backendJsonPath, frontendJsonPath);
    console.log('✅ config.json copiado para o frontend:', frontendJsonPath);
  } catch (copyError) {
    console.error('❌ Erro ao copiar config.json para o frontend:', copyError.message);
    console.error(copyError.stack);
    process.exit(1);
  }

  // Verifica se o arquivo foi realmente copiado
  if (fs.existsSync(frontendJsonPath)) {
    console.log('✅ Verificado: config.json existe no frontend');
  } else {
    console.error('❌ Erro: config.json não foi copiado para o frontend');
    process.exit(1);
  }
} catch (e) {
  console.error('❌ Erro ao gerar ou copiar config.json:', e.message);
  console.error(e.stack);
  process.exit(1);
}