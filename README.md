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

## 🎨 Visão Geral das Telas do Frontend

1. **Dashboard (`/`)**:
   - Banner de boas-vindas com gradiente `from-blue-600 to-indigo-600`.
   - 4 cards de métricas (vagas ativas, talentos locais, contratos em andamento, posts).
   - 6 cards de atalho rápido com ícones e transições suaves.
   - 3 oportunidades em destaque mais recentes.

2. **Oportunidades (`/oportunidades`)**:
   - Barra de busca dinâmica com filtros de modalidade e tipo de contrato.
   - Grid com 2 colunas (`md:grid-cols-2`).
   - Modal com `Dialog` para publicação de nova vaga com requisitos e benefícios.
   - Ação de candidatura e exclusão.

3. **Buscar Profissionais (`/buscar`)**:
   - Filtro em tempo real por habilidades (ex: React, Logística, Agronegócio, Design), cargo ou nome.
   - Cards com habilidades em badges e experiências resumidas.
   - Modal de visualização detalhada do perfil completo e formação acadêmica.

4. **Currículos (`/curriculos`)**:
   - Gestão completa com CRUD e modal.
   - Habilidades informadas separadas por vírgula.
   - Alternância imediata de visibilidade entre público e privado com um clique.

5. **Contratos (`/contratos`)**:
   - Cards com badges coloridos específicos:
     - 🟡 **Proposta** (Amarelo)
     - 🔵 **Aceito** (Azul)
     - 🟣 **Em Andamento** (Roxo)
     - 🟢 **Finalizado** (Verde)
     - 🔴 **Cancelado** (Vermelho)
   - Barra de progresso do projeto em tempo real (0 a 100%).
   - Botões de avanço rápido de etapas e modal para formalização de novos contratos.

6. **Comunidade (`/comunidade`)**:
   - Feed de postagens com abas de filtro por tipo (discussão, regulamentação, dica, evento, notícia).
   - Botão de curtir com atualização reativa via TanStack Query.
   - Modal de publicação com tags e categorias regionais.

7. **Entrevistas (`/entrevistas`)**:
   - Salas virtuais com data e horário formatados em padrão brasileiro (`pt-BR`).
   - Badges de status da reunião e link com botão direto de cópia ou acesso.
   - Modal para agendar novas entrevistas e reuniões de alinhamento.

8. **Regulamentações (`/regulamentacoes`)**:
   - Cards informativos detalhados com **LGPD (Lei nº 13.709/2018)**, **CLT**, **Lei do MEI** e **Marco Civil da Internet**.
   - Links diretos para consulta das legislações federais oficiais no portal do Planalto.

9. **Perfil (`/perfil`)**:
   - Formulário cadastral com nome, email, telefone, profissão, organização, cidade (Óbidos) e estado (PA).
   - Persistência local (`localStorage`) e feedback visual de confirmação.

---

## ⚖️ Conformidade e Privacidade (LGPD)

O projeto cumpre as diretrizes da **Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018)**:
- Visibilidade seletiva de currículos (público vs. privado).
- Rodapé institucional presente em todas as telas com menção à LGPD.
- Salvaguarda de dados cadastrais e possibilidade de remoção a qualquer momento.

---

Desenvolvido para valorizar os profissionais, as tradições culturais e o potencial econômico de **Óbidos, Pará**.
