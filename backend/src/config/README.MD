# Configuração de Conexão – Projeto BD e Backend

Este projeto utiliza dois arquivos de configuração: `config.yaml` e `config.json`. Ambos armazenam informações de conexão para o banco de dados (Railway) e para o backend local.

---

## 📁 Estrutura Esperada dos Arquivos

### 🔧 `config.yaml`

Formato YAML (indentação com espaços, não usa aspas para valores simples):

```yaml
database:
  host: shuttle.proxy.rlwy.net  # Host fornecido pela Railway
  port: <porta_do_projeto>      # Substitua pela porta do Railway
  user: postgres
  password: <senha_do_projeto>  # Substitua pela senha real
  database: bdAbp

backend:
  host: 127.0.0.1               # IP do localhost
  port: 3000
```
❗ Substitua os valores entre < > pelas credenciais reais do seu projeto no Railway.

🔧 config.json
Mesmo conteúdo, mas no formato JSON (sem comentários permitidos):

```json
{
  "database": {
    "host": "shuttle.proxy.rlwy.net",
    "port": "<porta_do_projeto>",
    "user": "postgres",
    "password": "<senha_do_projeto>",
    "database": "bdAbp"
  },
  "backend": {
    "host": "127.0.0.1",
    "port": 3000
  }
}
```
✅ Passos para Criar os Arquivos
Crie o arquivo config.yaml na raiz do projeto.

Use um editor como VS Code ou Notepad++.

Copie a estrutura acima e preencha as informações reais.

Crie o arquivo config.json da mesma forma, com a estrutura JSON correspondente.

Garanta que esses arquivos não sejam versionados se contiverem informações sensíveis:

Adicione ao .gitignore:

arduino
Copy
Edit
config.yaml
config.json
📌 Dicas
YAML é mais legível para humanos, ideal para configurações editadas manualmente.

JSON é amplamente utilizado por sistemas e APIs.