# 🔐 REST API — Node.js, NestJS e PostgreSQL

API REST desenvolvida com **Node.js e NestJS**, utilizando Prisma ORM e PostgreSQL, com foco em segurança, desempenho e escalabilidade.

O projeto implementa mecanismos modernos de autenticação, proteção de dados e processamento assíncrono de tarefas.

## 🚀 Tecnologias utilizadas

- **Node.js** — Ambiente de execução JavaScript.
- **NestJS** — Framework para construção da API.
- **TypeScript** — Tipagem estática.
- **Prisma ORM** — Gerenciamento do banco de dados.
- **PostgreSQL** — Banco de dados relacional.
- **Redis** — Armazenamento temporário de informações.
- **BullMQ** — Gerenciamento e processamento de filas.
- **JWT** — Autenticação baseada em tokens.

## 🔒 Funcionalidades

- Autenticação e autorização com JWT.
- Autenticação de dois fatores (2FA).
- Criptografia segura de senhas.
- Recuperação de senha por e-mail.
- Confirmação por e-mail para operações sensíveis.
- Configuração de CORS.
- Redis para armazenamento temporário de informações.
- BullMQ para processamento de tarefas assíncronas.
- Validação e tratamento de dados.
- Integração com PostgreSQL utilizando Prisma ORM.

## ⚙️ Arquitetura e segurança

A aplicação utiliza Redis e BullMQ para gerenciar tarefas assíncronas, como envio de e-mails, reduzindo o processamento nas requisições principais.

Também implementa mecanismos de autenticação, recuperação de acesso e proteção de dados para aumentar a segurança da API.

## 📦 Instalação

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd nome-do-projeto
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente no arquivo `.env`.

Execute as migrações:

```bash
npx prisma migrate dev
```

Inicie o projeto:

```bash
npm run start:dev
```

## 👨‍💻 Autor

Desenvolvido por **Pedro Andrade**.
