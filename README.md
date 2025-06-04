<span id="topo"></span>
<h1 align="center"> floatData </h1>
<h2 align="center"> FATEC Professor Francisco de Moura, Jacareí - 4º Semestre DSM 2025 </h2>

<p align="center">
    <a href="#sobre">Sobre</a> |
    <a href="#backlogs">Backlogs</a> |
    <a href="#sprints">Sprints</a> |
    <a href="#tecnologias">Tecnologias</a> |
    <a href="#equipe">Equipe</a>
</p>

<span id="sobre"></span>
<h1 align="center">Sobre</h1>
<p>
Esse projeto foi desenvolvido pelos alunos do 4º semestre da Fatec Professor Francisco de Moura, Jacareí com a proposta de empreendedorismo.
</p>
<p>
Este aplicativo tem como objetivo monitorar derivadores. Para isso, antes da aplicação, criamos o dispositivo IoT para realizar a comunicação.
</p>

<span id="backlogs"></span>
<h1 align="center">Backlogs</h1>

### Product Backlog
- Desenvolver dispositivo IoT para monitoramento de derivadores
- Criar sistema de comunicação entre dispositivo e servidor
- Desenvolver API para gerenciamento de dados
- Criar aplicativo mobile para visualização em tempo real
- Implementar sistema de notificações e alertas
- Desenvolver dashboard para análise de dados
- Implementar autenticação e controle de acesso
- Criar documentação completa do sistema

<span id="sprints"></span>
<h1 align="center">Sprints</h1>

<details open>
<summary><h2>Sprint 1</h2></summary>

**Período:** 24/03/2025 a 15/04/2025

**Objetivo:** Desenvolver o protótipo inicial do dispositivo IoT e estruturar a base do projeto

### User Stories e Tarefas

| User Story | Tarefa | Prioridade | Pontos |
|------------|--------|------------|--------|
| US 01 | Criar página de login com campos de e-mail e senha | Alta | 3 |
| US 01 | Implementar autenticação com JWT no backend | Alta | 3 |
| US 01 | Validar credenciais e armazenar token no frontend | Alta | 2 |
| US 01 | Proteger rotas do frontend com token | Alta | 2 |
| US 01 | Exibir mensagens de erro para login inválido | Alta | 1 |
| US 01 | Persistência dos dados do Login no Banco de dados | Alta | 3 |
| US 02 | Criar endpoint para receber localização do derivador | Alta | 5 |
| US 02 | Salvar localização no banco de dados com timestamp | Alta | 2 |
| US 03 | Montagem do circuito para transmissão de dado para o Servidor | Alta | 5 |
| US 07 | Criação da tela de Dashboard | Alta | 3 |
| US 08 | Ajustar o mapa para o mobile | Alta | 2 |
| US 08 | Testar o app para desktop | Alta | 1 |
| US 09 | Criar página com sobre (descrição) do projeto | Alta | 2 |

### Descrição das User Stories
- **US 01**: Como usuário, quero poder fazer login no sistema para acessar as funcionalidades do aplicativo de forma segura.
- **US 02**: Como administrador, quero receber dados de localização dos derivadores para monitorá-los em tempo real.
- **US 03**: Como equipe técnica, quero montar um circuito funcional que transmita dados para o servidor.
- **US 07**: Como usuário, quero visualizar um dashboard com informações dos derivadores para análise.
- **US 08**: Como usuário mobile e desktop, quero poder visualizar o mapa em diferentes dispositivos.
- **US 09**: Como usuário, quero conhecer detalhes sobre o projeto para entender sua finalidade.

### Burndown
<div align="center">
  <p><i>Gráfico de Burndown do Sprint 1</i></p>
  <!-- Aqui você deve adicionar sua imagem de gráfico de burndown -->
  <img src="BURNDOWN - SPRINT 1 - 4DSM.png" alt="Gráfico de Burndown do Sprint 1">
</div>

### Resultados Alcançados
- Sistema de autenticação implementado com JWT
- Endpoint para recepção de dados de localização criado e testado
- Protótipo funcional do dispositivo IoT montado com capacidade de transmissão
- Dashboard básico implementado com visualização no mapa
- Interface responsiva testada em dispositivos móveis e desktop
- Estrutura do banco de dados  implementada para armazenamento dos dados
- Página "Sobre" criada com descrição completa do projeto

</details>

<span id="tecnologias"></span>
<h1 align="center">Tecnologias</h1>
<p align="center">
  <img src="https://img.shields.io/badge/node.js-%23339933?style=for-the-badge&logo=nodedotjs&logoColor=black">
  <img src="https://img.shields.io/badge/ts--node.js-%23339933?style=for-the-badge&logo=ts-node&logoColor=black">
  <img src="https://img.shields.io/badge/mongodb-%23339933?style=for-the-badge&logo=mongodb&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-%233178C6?style=for-the-badge&logo=typescript&logoColor=black">
  <img src="https://img.shields.io/badge/react-%2361DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/react%20native-%2361DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/android-%2334C759?style=for-the-badge&logo=android&logoColor=white">
  <img src="https://img.shields.io/badge/ios-%23000000?style=for-the-badge&logo=apple&logoColor=white">
  <img src="https://img.shields.io/badge/c++-%230059A5?style=for-the-badge&logo=c%2B%2B&logoColor=white">
  <img src="https://img.shields.io/badge/trello-%234169E1?style=for-the-badge&logo=trello&logoColor=black">
  <img src="https://img.shields.io/badge/Kanban-%234169E1?style=for-the-badge&logo=kanban&logoColor=white">
</p>

<span id="equipe"></span>
<h1 align="center">Equipe</h1>

<div align="center">

| Função          | Nome                     | GitHub                                               | LinkedIn |
|-----------------|--------------------------|------------------------------------------------------|----------|
| Product Owner   | Jonatas Filipe Carvalho  | [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/filipejonatas) | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/jonatas-filipe-aa4534165/) |
| Scrum Master    | Mauro do Prado Santos    | [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/omaurosantos) | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/mauro-do-prado-santos-350b2720a/) |
| Dev Team        | André Flávio de Oliveira  | [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/andreflavio) | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/andr%C3%A9fl%C3%A1vio/) |
| Dev Team        | Igor Fonseca              | [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/) | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/igor-fonseca-84277226a/) |
| Dev Team        | Samuel Lucas Vieira de Melo | [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/SamuelLucasVieira) | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/samuel-lucas-7a3256144/) |
| Dev Team        | Vitor Cezar de Souza     | [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/vooshybee) | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/vitor-souza-29077228b/) |

</div>

<p align="center">
  <a href="#topo">Voltar ao topo</a>
</p>
