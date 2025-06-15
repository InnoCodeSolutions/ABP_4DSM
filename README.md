<span id="topo"></span>
<h1 align="center"> floatData </h1>
<h2 align="center"> FATEC Professor Francisco de Moura, Jacareí - 4º Semestre DSM 2025 </h2>

<p align="center">
  <a href="#sobre">Sobre</a> |
  <a href="#acesso">Acesso ao Projeto</a> |
  <a href="#status">Status do Projeto</a> |
  <a href="#sprints">Sprints</a> |
  <a href="#tecnologias">Tecnologias</a> |
  <a href="#equipe">Equipe</a>
</p>

<span id="sobre"></span>
<h1 align="center">Sobre</h1>
<p>
Este projeto foi desenvolvido pelos alunos do 4º semestre de Desenvolvimento de Software Multiplataforma (DSM) da Fatec de Jacareí, como parte da matéria de Engenharia de Software. O floatData é uma solução completa para o monitoramento de derivadores (dispositivos de rastreamento) em tempo real.
</p>
<p>
A solução consiste em um dispositivo IoT (Hardware), que coleta e envia dados de geolocalização, e um aplicativo mobile/web (Software), que permite aos usuários visualizar a localização, velocidade e trajetória de seus dispositivos em um mapa interativo, além de acessar relatórios detalhados.
</p>

<span id="acesso"></span>
<h1 align="center">Acesso ao Projeto</h1>
<p align="center">
  Experimente a aplicação ou faça o download do instalador para Android.
<br><br>
  <a href="https://#SUA_URL_DA_VERSAO_WEB" target="_blank">
    <img src="https://img.shields.io/badge/Acessar-Versão_Web-blue?style=for-the-badge&logo=webapp" alt="Acessar Versão Web">
  </a>
  <a href="https://#SEU_LINK_PARA_O_APK" target="_blank">
    <img src="https://img.shields.io/badge/Download-APK-green?style=for-the-badge&logo=android" alt="Download APK">
  </a>
</p>

<span id="status"></span>
<h1 align="center">Status do Product Backlog</h1>

- [x] Desenvolver dispositivo IoT para monitoramento de derivadores
- [x] Criar sistema de comunicação entre dispositivo e servidor
- [x] Desenvolver API para gerenciamento de dados
- [x] Criar aplicativo mobile para visualização em tempo real
- [ ] Implementar sistema de notificações e alertas
- [x] Desenvolver dashboard para análise de dados
- [x] Implementar autenticação e controle de acesso
- [x] Criar documentação completa do sistema

<span id="sprints"></span>
<h1 align="center">Sprints</h1>

<details>
<summary><h3>Sprint 1 - Estruturação e Protótipo Inicial</h3></summary>

**Período:** 24/03/2025 a 15/04/2025

**Objetivo:** Desenvolver o protótipo inicial do dispositivo IoT e estruturar a base do projeto.

**Resultados Alcançados:**
- Sistema de autenticação com JWT implementado.
- Endpoint para recepção de dados de localização criado e testado.
- Protótipo funcional do dispositivo IoT montado com capacidade de transmissão.
- Dashboard básico com visualização no mapa.
- Estrutura inicial do banco de dados implementada.

<div align="center">
  <p><i>Gráfico de Burndown do Sprint 1</i></p>
  <img src="BURNDOWN - SPRINT 1 - 4DSM.png" alt="Gráfico de Burndown do Sprint 1">
</div>

</details>

<details>
<summary><h3>Sprint 2 - Migração para Nuvem e Telas Principais</h3></summary>

**Período:** 16/04/2025 a 13/05/2025

**Objetivo:** Migrar a infraestrutura para a nuvem, desenvolver as telas principais da aplicação com dados reais e implementar funcionalidades essenciais de usuário.

**Resultados Alcançados:**
- Banco de dados migrado e hospedado em ambiente de nuvem.
- Dashboard implementado e funcional, exibindo dados em tempo real.
- Criação das telas "Meus Dispositivos" e "Mapa".
- Implementação da função de redefinição de senha.
- Protótipo do dispositivo IoT remodelado.

<div align="center">
  <p><i>Gráfico de Burndown do Sprint 2</i></p>
  <img src="burndown_sprint2.png" alt="Gráfico de Burndown do Sprint 2">
</div>
</details>

<details open>
<summary><h3>Sprint 3 (Final) - Funcionalidades Avançadas e Finalização</h3></summary>

**Período:** 14/05/2025 a 11/06/2025

**Objetivo:** Finalizar as funcionalidades centrais do projeto, como cálculo de trajetória e relatórios, refinar a experiência do usuário e gerar a versão final do aplicativo para distribuição.

**Resultados Alcançados:**
- Cálculo de velocidade e funcionalidade de trajetória totalmente implementados.
- Tela de relatórios com função de exportação de dados finalizada.
- Pins no mapa exibindo as localizações reais e precisas dos dispositivos.
- Melhorias significativas de usabilidade (login persistente, feedbacks visuais, etc.).
- Versão final do aplicativo Android (.APK) gerada com sucesso.

<div align="center">
  <p><i>Gráfico de Burndown do Sprint 3</i></p>
  <img src="burndown_sprint3.png" alt="Gráfico de Burndown do Sprint 3">
</div>
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

| Função          | Nome                     | GitHub                                               | LinkedIn |
|-----------------|--------------------------|------------------------------------------------------|----------|
| Product Owner   | Jonatas Filipe Carvalho  | [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/filipejonatas) | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/jonatas-filipe-aa4534165/) |
| Scrum Master    | Mauro do Prado Santos    | [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/omaurosantos) | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/mauro-do-prado-santos-350b2720a/) |
| Dev Team        | André Flávio de Oliveira  | [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/andreflavio) | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/andr%C3%A9fl%C3%A1vio/) |
| Dev Team        | Igor Fonseca              | [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/Igor-Fons) | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/igor-fonseca-84277226a/) |
| Dev Team        | Samuel Lucas Vieira de Melo | [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/SamuelLucasVieira) | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/samuel-lucas-7a3256144/) |
| Dev Team        | Vitor Cezar de Souza     | [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/vooshybee) | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/vitor-souza-29077228b/) |

</div>

<p align="center">
  <a href="#topo">Voltar ao topo</a>
</p>