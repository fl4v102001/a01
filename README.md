# API de Gerenciamento de Perfis e Transações

Esta é uma API backend construída com Node.js, Express e TypeORM para gerenciar usuários, perfis, transações e suas respectivas permissões.

## Tabela de Conteúdos
1.  [Esquema do Banco de Dados](#esquema-do-banco-de-dados)
2.  [Começando](#começando)
3.  [Documentação da API](#documentação-da-api)
    -   [Usuários](#1-usuários)
    -   [Perfis](#2-perfis)
    -   [Transações](#3-transações)
    -   [Autorizações](#4-autorizações)

---

## Esquema do Banco de Dados

A API opera sobre o schema `sandbox` e gerencia as seguintes tabelas:

-   **`usuarios`**: Armazena os dados dos usuários.
    -   `id_usuario` (SERIAL, PK): Identificador único.
    -   `nome_usuario` (VARCHAR): Nome do usuário.
    -   `email_usuario` (VARCHAR, UNIQUE): E-mail do usuário.

-   **`perfil`**: Armazena os perfis de acesso.
    -   `id_perfil` (SERIAL, PK): Identificador único.
    -   `nome_perfil` (VARCHAR, UNIQUE): Nome do perfil (ex: "Administrador", "Usuário Padrão").

-   **`transacao`**: Armazena as operações/funcionalidades do sistema.
    -   `id_transacao` (SERIAL, PK): Identificador único.
    -   `nome_transacao` (VARCHAR, UNIQUE): Nome da transação (ex: "CRIAR_USUARIO", "DELETAR_PRODUTO").

-   **`usuarios_vs_perfil`**: Tabela de junção para o relacionamento N:N (Muitos para Muitos) entre `usuarios` e `perfil`.
    -   `id_usuario` (INTEGER, FK, PK)
    -   `id_perfil` (INTEGER, FK, PK)

-   **`perfil_vs_transacao`**: Tabela de junção N:N com dados extras, ligando `perfil` e `transacao`.
    -   `id` (SERIAL, PK): Identificador único da relação.
    -   `id_perfil` (INTEGER, FK)
    -   `id_transacao` (INTEGER, FK)
    -   `autorizacao` (VARCHAR): Campo extra que define o nível de permissão (ex: "leitura", "escrita", "total").

---

## Começando

Siga estas instruções para configurar e executar o projeto localmente.

### Pré-requisitos
-   Node.js (versão 16 ou superior)
-   NPM
-   Um banco de dados PostgreSQL em execução.

### Instalação

1.  Clone o repositório e instale as dependências:
    ```bash
    npm install
    ```

2.  **Configurar Variáveis de Ambiente**
    Crie um arquivo `.env` na raiz do projeto e adicione a URL de conexão do seu banco de dados PostgreSQL:
    ```dotenv
    # .env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```

3.  **Executar as Migrations**
    Para criar as tabelas no schema `sandbox` do banco de dados, execute:
    ```bash
    npm run migration:run
    ```

4.  **Iniciar o Servidor**
    Para iniciar o servidor da API (padrão na porta 3000), execute:
    ```bash
    npm start
    ```

---

## Documentação da API

Todos os endpoints estão sob o prefixo `/api`.

### 1. Usuários
Recursos para gerenciar usuários do sistema.

**Criar Novo Usuário**
-   **Endpoint:** `POST /api/usuarios`
-   **Descrição:** Adiciona um novo usuário.
-   **Contrato (Request Body):**
    ```json
    {
      "nome_usuario": "João da Silva",
      "email_usuario": "joao.silva@example.com"
    }
    ```
-   **Resposta (201 Created):**
    ```json
    {
      "id_usuario": 1,
      "nome_usuario": "João da Silva",
      "email_usuario": "joao.silva@example.com"
    }
    ```

**Buscar Usuário por ID**
-   **Endpoint:** `GET /api/usuarios/:id_usuario`
-   **Descrição:** Retorna os dados de um usuário específico pelo seu ID.

**Buscar Usuários por Nome**
-   **Endpoint:** `GET /api/usuarios/nome/:nome`
-   **Descrição:** Retorna uma lista de usuários que possuem o texto informado em seu nome (busca parcial).

**Buscar Usuário por Email**
-   **Endpoint:** `GET /api/usuarios/email/:email`
-   **Descrição:** Retorna os dados de um usuário correspondente ao email exato.

**Alterar Usuário**
-   **Endpoint:** `PATCH /api/usuarios/:id_usuario`
-   **Descrição:** Atualiza os dados de um usuário existente.
-   **Contrato (Request Body):**
    ```json
    {
      "nome_usuario": "João da Silva Sauro"
    }
    ```
-   **Resposta (200 OK):**
    ```json
    {
      "id_usuario": 1,
      "nome_usuario": "João da Silva Sauro",
      "email_usuario": "joao.silva@example.com"
    }
    ```

**Excluir Usuário**
-   **Endpoint:** `DELETE /api/usuarios/:id_usuario`
-   **Descrição:** Remove um usuário do sistema.
-   **Resposta:** `204 No Content`

**Adicionar Perfil a um Usuário**
-   **Endpoint:** `POST /api/usuarios/:id_usuario/perfis`
-   **Descrição:** Associa um perfil existente a um usuário.
-   **Contrato (Request Body):**
    ```json
    {
      "id_perfil": 1
    }
    ```
-   **Resposta (200 OK):** Retorna o objeto do usuário com a lista de perfis atualizada.

**Remover Perfil de um Usuário**
-   **Endpoint:** `DELETE /api/usuarios/:id_usuario/perfis/:id_perfil`
-   **Descrição:** Desassocia um perfil de um usuário.
-   **Resposta (200 OK):** Retorna o objeto do usuário com a lista de perfis atualizada.

---
### 2. Perfis
Recursos para gerenciar os perfis de acesso.

**Criar Novo Perfil**
-   **Endpoint:** `POST /api/perfis`
-   **Contrato (Request Body):**
    ```json
    {
      "nome_perfil": "Gerente de Vendas"
    }
    ```
-   **Resposta (201 Created):**
    ```json
    {
      "id_perfil": 1,
      "nome_perfil": "Gerente de Vendas"
    }
    ```

**Buscar Perfil por ID**
-   **Endpoint:** `GET /api/perfis/:id_perfil`
-   **Descrição:** Retorna os dados de um perfil específico.

**Buscar Perfis por Nome**
-   **Endpoint:** `GET /api/perfis/nome/:nome`
-   **Descrição:** Retorna uma lista de perfis que contenham o texto pesquisado no nome.

**Alterar Perfil**
-   **Endpoint:** `PATCH /api/perfis/:id_perfil`
-   **Contrato (Request Body):**
    ```json
    {
      "nome_perfil": "Gerente de Contas"
    }
    ```
-   **Resposta (200 OK):** Retorna o objeto do perfil atualizado.

**Excluir Perfil**
-   **Endpoint:** `DELETE /api/perfis/:id_perfil`
-   **Resposta:** `204 No Content`

---
### 3. Transações
Recursos para gerenciar as transações (funcionalidades) do sistema.

**Criar Nova Transação**
-   **Endpoint:** `POST /api/transacoes`
-   **Contrato (Request Body):**
    ```json
    {
      "nome_transacao": "EDITAR_FATURA"
    }
    ```
-   **Resposta (201 Created):**
    ```json
    {
      "id_transacao": 1,
      "nome_transacao": "EDITAR_FATURA"
    }
    ```

**Buscar Transação por ID**
-   **Endpoint:** `GET /api/transacoes/:id_transacao`
-   **Descrição:** Retorna os dados de uma transação específica.

**Buscar Transações por Nome**
-   **Endpoint:** `GET /api/transacoes/nome/:nome`
-   **Descrição:** Retorna uma lista de transações que contenham o texto pesquisado no nome.

**Alterar Transação**
-   **Endpoint:** `PATCH /api/transacoes/:id_transacao`
-   **Contrato (Request Body):**
    ```json
    {
      "nome_transacao": "EDITAR_FATURA_FISCAL"
    }
    ```
-   **Resposta (200 OK):** Retorna o objeto da transação atualizada.

**Excluir Transação**
-   **Endpoint:** `DELETE /api/transacoes/:id_transacao`
-   **Resposta:** `204 No Content`

---
### 4. Autorizações
Recursos para gerenciar as permissões que um perfil tem sobre uma transação.

**Conceder Nova Autorização**
-   **Endpoint:** `POST /api/autorizacoes`
-   **Descrição:** Concede a um perfil uma permissão sobre uma transação.
-   **Contrato (Request Body):**
    ```json
    {
      "id_perfil": 1,
      "id_transacao": 2,
      "autorizacao": "leitura_escrita"
    }
    ```
-   **Resposta (201 Created):**
    ```json
    {
      "perfil": { "id_perfil": 1 },
      "transacao": { "id_transacao": 2 },
      "autorizacao": "leitura_escrita",
      "id": 1
    }
    ```

**Alterar Autorização**
-   **Endpoint:** `PATCH /api/autorizacoes/:id` (Onde `:id` é o `id` da tabela `perfil_vs_transacao`)
-   **Descrição:** Altera o nível da permissão.
-   **Contrato (Request Body):**
    ```json
    {
      "autorizacao": "apenas_leitura"
    }
    ```
-   **Resposta (200 OK):** Retorna o objeto da autorização atualizado.

**Revogar Autorização**
-   **Endpoint:** `DELETE /api/autorizacoes/:id`
-   **Descrição:** Remove a permissão de um perfil sobre uma transação.
-   **Resposta:** `204 No Content`
