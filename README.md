# E-commerce Web

Sistema de e-commerce completo com integração de pagamento, construído com Next.js 16, TypeScript, React 19 e Tailwind CSS 4.

## 📑 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
  - [Opção 1: Instalação Local](#opção-1-instalação-local)
- [Configuração](#configuração)
- [Uso](#uso)
- [Comandos Disponíveis](#comandos-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Troubleshooting](#troubleshooting)

## 🚀 Sobre o Projeto

E-commerce Web é uma aplicação web de e-commerce que oferece:

- ✅ **Autenticação de Usuários**: Sistema JWT com NextAuth.js
- 📦 **Catálogo de Produtos**: Navegação e visualização de produtos
- 🛒 **Carrinho de Compras**: Gerenciamento completo de itens
- 💳 **Fluxo de Pagamento**: Integração com Pagar.me
- 📋 **Gestão de Pedidos**: Histórico e detalhes de pedidos

## 🛠 Tecnologias

Este projeto foi construído com:

- **Framework**: [Next.js 16](https://nextjs.org/) com App Router
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Componentes**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Autenticação**: [NextAuth.js](https://next-auth.js.org/)
- **API Client**: [Axios](https://axios-http.com/) + [Orval](https://orval.dev/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Formulários**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Para Instalação Local:
- **Node.js** 20.x ou superior ([Download](https://nodejs.org/))
- **npm** 10.x ou superior (vem com Node.js)
- **Git** ([Download](https://git-scm.com/))

### Para Instalação com Docker:
- **Docker** 24.x ou superior ([Download](https://www.docker.com/))
- **Docker Compose** 2.x ou superior (geralmente vem com Docker Desktop)

## 🔧 Instalação

### Opção 1: Instalação Local

#### Passo 1: Clone o Repositório

```bash
# Clone o projeto
git clone <https://github.com/Fro1s/e-commerce_web.git>

# Entre no diretório
cd e-commerce_web
```

#### Passo 2: Instale as Dependências

```bash
npm install
```

#### Passo 3: Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo .env.local com suas configurações
# Use seu editor favorito (VSCode, nano, vim, etc.)
```

Exemplo de configuração do `.env.local`:

```env
# URL da API Backend
API_URL=http://localhost:3000

# Chave secreta do NextAuth (gere uma chave segura)
NEXTAUTH_SECRET=sua-chave-super-secreta-aqui

# URL da aplicação frontend
NEXTAUTH_URL=http://localhost:3001
```

> 💡 **Dica**: Para gerar uma chave segura para `NEXTAUTH_SECRET`, execute:
> ```bash
> openssl rand -base64 32
> ```

#### Passo 4: Gere os Tipos da API

```bash
# Este comando gera automaticamente os tipos TypeScript e hooks do React Query
# baseados na especificação OpenAPI do backend
npm run orval
```

> ⚠ **Importante**: Certifique-se de que o backend está rodando antes de executar este comando.

#### Passo 5: Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:3001**

---
## 🎯 Uso

### Acessando a Aplicação

1. Abra o navegador em **http://localhost:3001**
2. Faça login ou crie uma nova conta
3. Navegue pelo catálogo de produtos
4. Adicione produtos ao carrinho
5. Finalize a compra

### Fluxo de Desenvolvimento

```bash
# 1. Inicie o servidor de desenvolvimento
npm run dev

# 2. Faça suas alterações no código

# 3. Se o backend mudou, regenere os tipos
npm run orval

# 4. Execute o linter
npm run lint

# 5. Faça o build de produção para testar
npm run build

# 6. Teste o build de produção
npm start
```

## 📝 Comandos Disponíveis

### NPM Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento com Turbopack |
| `npm run build` | Cria build de produção |
| `npm start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint para verificar código |
| `npm run orval` | Gera tipos TypeScript da API backend |

## 📂 Estrutura do Projeto

```
e-commerce_web/
├── src/
│   ├── @types/              # Definições TypeScript
│   ├── app/                 # Next.js App Router
│   │   ├── _layouts/        # Layouts compartilhados
│   │   ├── api/             # API routes e configuração
│   │   ├── login/           # Página de login
│   │   ├── signup/          # Página de cadastro
│   │   └── layout.tsx       # Layout raiz
│   ├── components/          # Componentes React
│   │   ├── ui/              # Componentes shadcn/ui
│   │   └── site-header.tsx  # Header
│   ├── gen/                 # Código gerado (não editar)
│   │   ├── api.ts           # Hooks React Query
│   │   ├── api.zod.ts       # Schemas Zod
│   │   └── types/           # Tipos TypeScript
│   ├── lib/                 # Bibliotecas e utilitários
│   └── services/            # Serviços (Axios, etc.)
├── public/                  # Arquivos estáticos
├── .env.example             # Exemplo de variáveis de ambiente
├── .env.local               # Variáveis locais (não commitar)
├── docker-compose.yml       # Configuração Docker Compose
├── Dockerfile               # Dockerfile para build
├── orval.config.ts          # Configuração do Orval
├── package.json             # Dependências do projeto
├── tailwind.config.ts       # Configuração Tailwind
└── tsconfig.json            # Configuração TypeScript
```

### Diretórios Importantes

- **`src/app/`**: Rotas e páginas (Next.js App Router)
- **`src/components/`**: Componentes reutilizáveis
- **`src/gen/`**: ⚠ Código auto-gerado pelo Orval (não editar manualmente)
- **`src/services/`**: Configuração de serviços externos (API, auth)

## 🔍 Troubleshooting

### Problema: Erro ao executar `npm run orval`

**Causa**: Backend não está rodando ou URL incorreta.

**Solução**:
```bash
# Verifique se o backend está rodando
curl http://localhost:3000/api/docs-json

# Se não estiver, inicie o backend primeiro
# Depois execute novamente
npm run orval
```

### Problema: Erro de autenticação (401)

**Causa**: Token inválido ou expirado.

**Solução**:
1. Limpe o localStorage do navegador
2. Faça login novamente
3. Verifique se `NEXTAUTH_SECRET` está configurado

### Problema: Página não carrega após build

**Causa**: Variáveis de ambiente não configuradas.

**Solução**:
```bash
# Verifique se o .env.local existe e está correto
cat .env.local

# Para Docker, verifique o .env
cat .env

# Reconstrua a aplicação
npm run build
npm start
```
### Problema: Erro "Module not found"

**Causa**: Dependências não instaladas.

**Solução**:
```bash
# Limpe e reinstale dependências
rm -rf node_modules package-lock.json
npm install

# Para Docker
docker-compose down
docker-compose up --build
```

### Problema: Tipos TypeScript desatualizados

**Causa**: API backend foi alterada.

**Solução**:
```bash
# Regenere os tipos
npm run orval

```

**💡 Dica Final**: Para uma experiência completa, configure também o backend do projeto. Consulte a documentação do backend em seu repositório.
