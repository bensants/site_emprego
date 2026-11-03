# 🏛️ Óbidos Conect — Plataforma de Intermediação de Serviços para MEIs e Autônomos

> **Óbidos/PA (2026)** — Solução computacional para conectar Microempreendedores Individuais (MEIs) e prestadores autônomos à demanda local por serviços no município de Óbidos/PA. Desenvolvida com arquitetura desacoplada, abordagem *Mobile-First*, negociação direta via WhatsApp e estrita conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD – Lei nº 13.709/2018)[cite: 1, 2].
>
>

---

## 🚀 Tecnologias Utilizadas

### Frontend (`/frontend`)



* **React 18** + **Vite**[cite: 1, 2] (porta do host: `3000` / interno Docker Nginx: `80`)


* **Tailwind CSS** com design atômico e interface responsiva (*Mobile-First*)[cite: 1, 2]
* **React Router v6** (navegação SPA com rotas protegidas)


* **TanStack React Query v5** (gerenciamento assíncrono de estado e cache)


* **Axios** (cliente HTTP com interceptors para injeção automática de Bearer Token JWT)


* **Lucide React** (iconografia moderna e semântica)



### Backend (`/backend`)



* **Node.js 20** em modo ESM (`"type": "module"`) (porta do host: `8443` / interna: `5000`)


* **Express** com CORS configurado e rota de verificação de integridade `/api/health`


* **Autenticação JWT** (`jsonwebtoken`) associada a *hashing* criptográfico com **bcryptjs**[cite: 1, 2]
* **Mongoose 8** com esquemas modelados sob os princípios de *Privacy by Design* e minimização cadastral[cite: 1, 2]
* **MongoDB 7** (executado em contêiner Docker isolado na porta `27017`)



### Infraestrutura & DevOps (`/`)



* **Docker & Docker Compose** (orquestração unificada de banco de dados, API backend e frontend Nginx)


* **Nginx Alpine** (servidor web de produção com compressão Gzip, cache de ativos estáticos e fallback SPA)


* **Controle de Portas**: Configurado para operar sem conflitos (Frontend: `3000`, Backend: `8443`, Mongo: `27017`)



---

## 📁 Estrutura do Projeto (Versão 1.5)

```text
site_emprego/
├── backend/
│   ├── Dockerfile                 # Build Node.js 20 Alpine com healthcheck nativo
│   ├── .dockerignore              # Exclusão de artefatos e dependências locais
│   ├── .env.example               # Modelo de variáveis de ambiente do backend
│   ├── package.json               # Dependências da API (ES Modules)
│   └── src/
│       ├── controllers/
│       │   ├── authController.js          # Registro, login e atualização de perfil
│       │   └── oportunidadeController.js  # CRUD do mural de demandas e bicos
│       ├── middlewares/
│       │   └── authMiddleware.js          # Validação de token JWT e proteção de rotas
│       ├── models/
│       │   ├── Oportunidade.js            # Esquema de solicitações de serviços
│       │   └── User.js                    # Esquema de usuários com segregação LGPD
│       ├── routes/
│       │   ├── authRoutes.js              # Rotas /api/auth
│       │   └── oportunidadeRoutes.js      # Rotas /api/oportunidades
│       ├── seed.js                # População inicial com prestadores reais de Óbidos
│       ├── server.js              # Servidor Express, conexão Mongo e rota pública /api/prestadores
│       └── utils/
│           └── sanitize.js        # Sanitização de expressões regulares contra ReDoS
│
├── frontend/
│   ├── Dockerfile                 # Build multi-stage com Nginx Alpine
│   ├── .dockerignore              # Exclusão de dependências locais
│   ├── .env.example               # Configuração da URL base da API
│   ├── nginx.conf                 # Configuração de proxy reverso e SPA fallback
│   ├── package.json               # Dependências React, Vite e TanStack Query
│   └── src/
│       ├── api/
│       │   └── api.js             # Instância Axios centralizada e serviços da API
│       ├── components/
│       │   ├── Layout.jsx         # Header responsivo, drawer mobile e rodapé LGPD
│       │   └── ui/                # Componentes visuais base (Card, Button, Input, etc.)
│       ├── context/
│       │   └── AuthContext.jsx    # Gerenciamento de sessão global autenticada
│       ├── pages/
│       │   ├── BuscarProfissionais.jsx # Vitrine pública com filtros e botão WhatsApp
│       │   ├── Oportunidades.jsx       # Mural municipal de demandas e orçamentos
│       │   ├── Perfil.jsx              # Painel do MEI com interruptor de visibilidade LGPD
│       │   ├── Login.jsx               # Autenticação de usuários
│       │   └── Registro.jsx            # Cadastro segmentado (Prestador MEI vs. Contratante)
│       ├── App.jsx                # Roteamento central e QueryClientProvider
│       ├── main.jsx               # Ponto de entrada React
│       └── index.css              # Configurações de estilo global e Tailwind
│
├── docker-compose.yml             # Orquestração dos serviços na rede obidos-network
├── LICENSE                        # Licença de uso
└── README.md

```



---

## 🛠️ Passo a Passo para Execução

### Execução via Docker Compose (Ambiente Homologado)

Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.

1. **Configurar as variáveis de ambiente:**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

```





2. **Subir os contêineres:**
```bash
docker compose up -d --build

```


3. **Popular a base com os dados ocupacionais de Óbidos/PA:**
```bash
docker compose exec backend node src/seed.js

```



[cite: 1, 2]

4. **Acessar as aplicações:**
* **Frontend Web**: [http://localhost:3000](http://localhost:3000)


* **API Backend**: [http://localhost:8443/api](http://localhost:8443/api)


* **Healthcheck da API**: [http://localhost:8443/api/health](http://localhost:8443/api/health)


* **Catálogo Público de MEIs**: [http://localhost:8443/api/prestadores](http://localhost:8443/api/prestadores)





---

### Execução em Desenvolvimento Local (Sem Docker)

#### 1. Backend:

```bash
cd backend
npm install
npm run seed     # Alimenta o MongoDB local
npm run dev      # Inicia na porta configurada (padrão 5000 ou 8443)

```



#### 2. Frontend:

```bash
cd frontend
npm install
npm run dev      # Inicia na porta padrão 5173 do Vite

```



---

## 🔑 Contas de Demonstração (Seed)

A base inicial já vem populada com trabalhadores autônomos e contratantes representativos da dinâmica econômica do município[cite: 1, 2]:

| Usuário | E-mail | Senha | Perfil / Atuação | Bairro |
| --- | --- | --- | --- | --- |
| **João da Silva Picanço** | `joao.eletricista@email.com` | `123456` | Eletricista Predial (MEI) | Centro |
| **Maria Raimunda Santos** | `maria.refrigeracao@email.com` | `123456` | Técnica em Refrigeração (MEI) | Santa Terezinha |
| **Sebastião Freire** | `sebastiao.fretes@email.com` | `123456` | Fretes e Pequenas Mudanças | São Francisco |
| **Carlos Eduardo Mendes** | `carlos.cliente@email.com` | `123456` | Contratante / Cliente Local | Fátima |

*Nota: Todos os prestadores possuem o interruptor de visibilidade ativado por padrão.*[cite: 1, 2]

---

## 📡 Endpoints da API REST (`http://localhost:8443/api`)



| Módulo | Método | Rota | Descrição | Acesso |
| --- | --- | --- | --- | --- |
| **Status** | `GET` | `/api/health` | Diagnóstico de integridade do servidor e do MongoDB | Público |
| **Vitrine MEI** | `GET` | `/api/prestadores` | Lista prestadores ativos (suporta `?categoria=`, `?bairro=`, `?busca=`) | Público (Minimizado LGPD) |
| **Autenticação** | `POST` | `/api/auth/register` | Cadastro de novo usuário (Prestador MEI ou Contratante) | Público |
|  | `POST` | `/api/auth/login` | Login com e-mail e senha (emite token JWT) | Público |
|  | `GET` | `/api/auth/me` | Retorna o perfil completo do usuário autenticado | Autenticado (Bearer JWT) |
|  | `PUT` | `/api/auth/me` | Atualiza dados comerciais e interruptor de visibilidade | Autenticado (Bearer JWT) |
| **Demandas** | `GET` | `/api/oportunidades` | Lista solicitações de serviços abertas em Óbidos | Público |
|  | `POST` | `/api/oportunidades` | Publica nova solicitação de serviço/orçamento | Autenticado (Bearer JWT) |
|  | `PUT` | `/api/oportunidades/:id` | Edita solicitação de serviço existente | Autenticado (Autor) |
|  | `DELETE` | `/api/oportunidades/:id` | Remove solicitação do mural | Autenticado (Autor) |

[cite: 1, 2, 4]

---

## 🎨 Módulos e Telas da Aplicação

1. Vitrine de Profissionais (`/` ou `/buscar`):


* Catálogo aberto de profissionais autônomos sem exigência de login para consulta.


* Filtros instantâneos por taxonomia regional (Obras, Refrigeração, Beleza, Fretes, Informática) e por bairros de Óbidos[cite: 1, 2].
* Acionamento direto via botão comercial de WhatsApp com mensagem pré-formatada[cite: 1, 2].


2. Mural de Demandas e Bicos (`/demandas`):


* Espaço para contratantes cadastrarem solicitações de serviços temporários ou reformas com orçamento previsto ou a combinar[cite: 1, 2].
* Conexão direta entre o prestador interessado e o tomador via WhatsApp[cite: 1, 2].


3. Painel do Prestador e Governança LGPD (`/perfil`):


* **Interruptor de Visibilidade**: Implementação prática do Artigo 18 da LGPD, permitindo ao trabalhador pausar e reativar sua exibição na vitrine a qualquer momento[cite: 1, 2].
* Gestão de dados comerciais: nome fantasia, telefone comercial, ocupação e descrição das habilidades[cite: 1, 2].


4. Autenticação e Cadastro (`/login` e `/registro`):


* Formulários objetivos com separação clara de papéis entre Prestador Autônomo e Tomador de Serviços[cite: 1, 2].



---

## ⚖️ Conformidade e Privacidade (LGPD)

O artefato foi concebido nativamente sob os preceitos da abordagem *Privacy by Design* e atende à **Lei Federal nº 13.709/2018 (LGPD)**:

* **Minimização de Dados (Art. 6º, III)**: Apenas atributos comerciais públicos (nome fantasia, WhatsApp e bairro) são enviados ao cliente web nas listagens abertas[cite: 1, 2]. Dados civis privados (CPF e residência particular) são protegidos com `select: false` e nunca trafegam em consultas públicas[cite: 1, 2].
* **Autodeterminação Informativa (Art. 18)**: O profissional controla sua disponibilidade na plataforma por meio do interruptor lógico de visibilidade, sem risco de perda do histórico cadastral.


* **Desacoplamento Financeiro**: A plataforma atua estritamente na aproximação informacional, não realizando custódia nem transacionando valores bancários, mitigando vetores de ataque e riscos operacionais.



---

Desenvolvido no âmbito do Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas do **Instituto Federal de Educação, Ciência e Tecnologia do Pará (IFPA Campus Óbidos)**.
