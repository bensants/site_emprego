# 🏛️ Óbidos Conect — Plataforma de Conexão Profissional Regional

> **Óbidos, Pará** — Conectando profissionais, cooperativas ribeirinhas, empresas e prestadores de serviços no coração do Baixo Amazonas com transparência, agilidade e total conformidade com a LGPD (Lei nº 13.709/2018).

---

## 🚀 Tecnologias Utilizadas

### Frontend (`/frontend`)
- **React 18** + **Vite** (porta 5173 / Docker Nginx porta 80)
- **Tailwind CSS** com sistema de design e tokens semânticos HSL no estilo **shadcn/ui**
- **React Router v6** (navegação SPA completa com proteção de rotas)
- **TanStack React Query v5** (`useQuery` para leitura, `useMutation` + `invalidateQueries` para escrita)
- **Sonner** (sistema moderno de notificações toast reativas)
- **Axios** (instância com interceptor automático de token JWT `Bearer`)
- **Lucide React** (iconografia)

### Backend (`/backend`)
- **Node.js 20** em modo ESM (`"type": "module"`) (porta 5000)
- **Express** com **CORS** dinâmico e healthcheck `/api/health`
- **Autenticação JWT** (`jsonwebtoken`) + Criptografia **bcryptjs**
- **Mongoose 8** com sanitização contra ReDoS e índices compostos
- **MongoDB Atlas** (ou container Docker local)

### DevOps & Produção (`/`)
- **Docker & Docker Compose** (orquestração completa com backend, frontend Nginx e MongoDB)
- **Nginx Alpine** (compressão Gzip, cache de assets estáticos e SPA fallback)
- **GitHub Actions CI** (validação sintática de backend e build do frontend)
- **Guia de Deploy em Produção** ([DEPLOY.md](file:///home/brener_santos/Projects/Projetos/site_emprego/DEPLOY.md))

---

## 📁 Estrutura do Projeto

```text
Work/
├── backend/
│   ├── .env                    # Variáveis de ambiente locais
│   ├── .env.example            # Exemplo de configuração com Atlas
│   ├── package.json            # Dependências e scripts
│   └── src/
│       ├── controllers/        # Controladores REST com CRUD completo
│       │   ├── comunidadeController.js
│       │   ├── contratoController.js
│       │   ├── curriculoController.js
│       │   ├── entrevistaController.js
│       │   └── oportunidadeController.js
│       ├── models/             # Esquemas do Mongoose
│       │   ├── Comunidade.js (PostComunidade)
│       │   ├── Contrato.js
│       │   ├── Curriculo.js
│       │   ├── Oportunidade.js
│       │   └── SalaEntrevista.js
│       ├── routes/             # Rotas da API REST
│       │   ├── comunidadeRoutes.js
│       │   ├── contratoRoutes.js
│       │   ├── curriculoRoutes.js
│       │   ├── entrevistaRoutes.js
│       │   └── oportunidadeRoutes.js
│       ├── seed.js             # Script de população de dados regionais
│       └── server.js           # Inicialização Express, Mongoose e CORS
│
├── frontend/
│   ├── index.html              # HTML base com fontes Inter & Plus Jakarta
│   ├── package.json            # Dependências React, Vite, TanStack Query
│   ├── postcss.config.js       # Configuração PostCSS
│   ├── tailwind.config.js      # Paleta semântica shadcn (Primary Azul, etc.)
│   ├── vite.config.js          # Configuração Vite na porta 5173
│   └── src/
│       ├── api/
│       │   └── api.js          # Instância Axios + métodos de serviço REST
│       ├── components/
│       │   ├── Layout.jsx      # Sidebar fixa com glassmorphism, drawer mobile, header e rodapé
│       │   └── ui/             # Componentes UI reutilizáveis (Button, Card, Dialog, Badge, Input, Select, Textarea)
│       ├── lib/
│       │   └── utils.js        # Utilitário cn (clsx + tailwind-merge)
│       ├── pages/              # 9 Páginas com React Query
│       │   ├── Dashboard.jsx
│       │   ├── Oportunidades.jsx
│       │   ├── BuscarProfissionais.jsx
│       │   ├── Curriculos.jsx
│       │   ├── Contratos.jsx
│       │   ├── Comunidade.jsx
│       │   ├── Entrevistas.jsx
│       │   ├── Regulamentacoes.jsx
│       │   └── Perfil.jsx
│       ├── App.jsx             # Rotas e QueryClientProvider
│       ├── index.css           # Tokens CSS HSL e gradientes
│       └── main.jsx            # Ponto de entrada React
│
└── README.md
```

---

## 🛠️ Passo a Passo para Execução

### Opção A: Execução com Docker & Docker Compose (Recomendado)

Suba toda a infraestrutura (Backend, Frontend Nginx e MongoDB) com um único comando:

```bash
# 1. Copiar variáveis de ambiente do Docker
cp .env.docker.example .env
# ==============================================================================
# Variáveis de Ambiente para Docker Compose - Óbidos Conect
# Copie este arquivo para .env na raiz antes de executar: docker compose up -d
# ==============================================================================

# Portas dos Serviços
FRONTEND_PORT=80
BACKEND_PORT=5000

# Backend: String de Conexão com o MongoDB
# Para usar o MongoDB do container Docker:
MONGODB_URI=mongodb://mongo:27017/obidos-connect

# Para usar o MongoDB Atlas na nuvem:
# MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/obidos-connect?retryWrites=true&w=majority

# Backend: Chave secreta de assinatura dos tokens JWT (gere uma chave forte para produção)
JWT_SECRET=gere_uma_chave_secreta_aleatoria_com_openssl_rand_hex_32

# Backend: Origens permitidas no CORS (separadas por vírgula)
CLIENT_ORIGIN=http://localhost,http://localhost:80,http://localhost:5173

# Frontend: URL base da API (no Docker Compose com Nginx, use /api para proxy reverso automático)
VITE_API_URL=/api

# 2. Subir todos os containers
docker compose up -d --build

# 3. (Opcional) Popular dados de teste e contas de demonstração
docker compose exec backend npm run seed
```

- **Frontend Web**: [http://localhost](http://localhost) (porta 80)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Opção B: Execução em Desenvolvimento Local (Node.js)

#### 1. Backend:
```bash
cd backend
cp .env.example .env     # configure sua MONGODB_URI e JWT_SECRET
npm install
npm run seed             # popula vagas e contas de teste
npm run dev              # inicia na porta 5000
```

#### 2. Frontend:
```bash
cd frontend
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev              # inicia na porta 5173
```

Acesse: [http://localhost:5173](http://localhost:5173)

---

### 🔑 Contas de Teste Pré-Cadastradas (Seed)

| Papel | E-mail | Senha |
|---|---|---|
| 💼 **Candidata** | `maria.pauxis@obidos.com.br` | `obidos123` |
| 🏢 **Empresa** | `coopao@obidos.com.br` | `obidos123` |
| 🛡️ **Administrador** | `admin@obidos.com.br` | `obidos123` |

---

## 📡 Recursos e Rotas da API REST (`http://localhost:5000/api`)

Cada recurso possui integração Mongoose (`timestamps: true`) e identificador `_id`:

| Recurso | Método | Rota | Descrição |
|---|---|---|---|
| **Autenticação** | `POST` | `/api/auth/register` | Registro de novo usuário (Candidato ou Empresa) |
| | `POST` | `/api/auth/login` | Login com e-mail e senha (retorna JWT) |
| | `GET` | `/api/auth/me` | Retorna dados do usuário autenticado |
| | `PUT` | `/api/auth/me` | Atualiza perfil cadastral do usuário |
| **Candidaturas** | `POST` | `/api/candidaturas` | Candidatar-se a uma vaga (com mensagem e currículo) |
| | `GET` | `/api/candidaturas/minhas` | Lista as candidaturas enviadas pelo profissional logado |
| | `GET` | `/api/candidaturas/oportunidade/:id` | Lista candidatos de uma oportunidade (visão empresa) |
| | `PATCH` | `/api/candidaturas/:id/status` | Atualiza status da candidatura (triagem seletiva) |
| | `DELETE` | `/api/candidaturas/:id` | Cancelar inscrição em uma oportunidade |
| **Oportunidades** | `GET` | `/api/oportunidades` | Lista oportunidades (suporta `?search=`, `?tipo=`, `?modalidade=`, `?page=`, `?limit=`) |
| | `GET` | `/api/oportunidades/:id` | Detalhes de uma oportunidade |
| | `POST` | `/api/oportunidades` | Cadastro de nova vaga/demanda |
| | `PUT` | `/api/oportunidades/:id` | Atualização cadastral |
| | `DELETE` | `/api/oportunidades/:id` | Exclusão de oportunidade |
| **Currículos** | `GET` | `/api/curriculos` | Lista currículos (suporta `?search=`, `?visibilidade=publico`) |
| | `GET` | `/api/curriculos/:id` | Detalhes do currículo |
| | `POST` | `/api/curriculos` | Cadastro de currículo |
| | `PUT` | `/api/curriculos/:id` | Atualização de currículo |
| | `DELETE` | `/api/curriculos/:id` | Exclusão de currículo |
| **Contratos** | `GET` | `/api/contratos` | Lista contratos (suporta `?status=`, `?search=`) |
| | `GET` | `/api/contratos/:id` | Detalhes do contrato |
| | `POST` | `/api/contratos` | Criação de novo contrato |
| | `PUT` | `/api/contratos/:id` | Atualização de progresso/status |
| | `DELETE` | `/api/contratos/:id` | Cancelamento/exclusão de contrato |
| **Comunidade** | `GET` | `/api/comunidade` | Feed de publicações (suporta `?tipo=`, `?search=`) |
| | `GET` | `/api/comunidade/:id` | Detalhes da publicação |
| | `POST` | `/api/comunidade` | Criação de nova publicação |
| | `PUT` | `/api/comunidade/:id` | Atualização da publicação |
| | `DELETE` | `/api/comunidade/:id` | Exclusão da publicação |
| | `POST` | `/api/comunidade/:id/curtir` | Incremento atômico de curtidas |
| **Entrevistas** | `GET` | `/api/entrevistas` | Lista salas agendadas (ordem cronológica) |
| | `GET` | `/api/entrevistas/:id` | Detalhes da entrevista |
| | `POST` | `/api/entrevistas` | Agendamento de entrevista |
| | `PUT` | `/api/entrevistas/:id` | Atualização de status e sala |
| | `DELETE` | `/api/entrevistas/:id` | Cancelamento da entrevista |

---

## ⚖️ Conformidade e Privacidade (LGPD)

O projeto cumpre as diretrizes da **Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018)**:
- Visibilidade seletiva de currículos (público vs. privado).
- Rodapé institucional presente em todas as telas com menção à LGPD.
- Salvaguarda de dados cadastrais e possibilidade de remoção a qualquer momento.

---

Desenvolvido para valorizar os profissionais, as tradições culturais e o potencial econômico de **Óbidos, Pará**.
