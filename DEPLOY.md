# 🚀 Guia Oficial de Publicação e Deploy em Produção — Óbidos Conect

Este documento é o guia definitivo para publicar a plataforma **Óbidos Conect** em ambiente de produção com alta disponibilidade, segurança, performance e custo otimizado (incluindo opções 100% gratuitas para início de operação).

---

## 🏗️ 1. Arquitetura da Solução

```
                    +-----------------------------+
                    |        Usuários Web         |
                    | (Candidatos / Empregadores) |
                    +--------------+--------------+
                                   | HTTPS
                                   v
             +-------------------------------------------+
             |        Frontend: React 18 + Vite          |
             |       (Vercel / Netlify / Nginx)          |
             +---------------------+---------------------+
                                   | REST API (JSON + JWT)
                                   v
             +-------------------------------------------+
             |        Backend: Node.js 20 + Express      |
             |       (Render / Railway / Docker)         |
             +-------------+---------------+-------------+
                           |               |
             +-------------+               +-------------+
             |                                           |
             v                                           v
+------------------------+                 +---------------------------+
|     MongoDB Atlas      |                 |    Serviços Integrados    |
| (M0 Free / M10 Cluster)|                 | - WhatsApp Web (wa.me)    |
|   Persistência Real    |                 | - Jitsi Meet (Entrevistas)|
+------------------------+                 +---------------------------+
```

---

## 🌐 2. Opção 1: Deploy em Nuvem Serverless / PaaS (Mais Rápido & Zero Custo)

Ideal para início imediato sem custo de infraestrutura fixa.

### 2.1. Banco de Dados: MongoDB Atlas (Free M0)
1. Acesse [mongodb.com/atlas](https://www.mongodb.com/atlas) e crie uma conta gratuita.
2. Crie um cluster gratuito (**M0 Free Tier**) na região mais próxima (ex: `AWS - sa-east-1 (São Paulo)`).
3. Em **Security > Database Access**:
   - Crie um usuário (ex: `obidos_admin`) com senha forte.
   - Atribua o papel `Read and write to any database`.
4. Em **Security > Network Access**:
   - Clique em **Add IP Address** e selecione **Allow Access from Anywhere** (`0.0.0.0/0`) para permitir conexões vindas do Render/Railway.
5. Em **Databases > Connect > Drivers (Node.js)**:
   - Copie a string de conexão URI:
   ```bash
   mongodb+srv://obidos_admin:<SUA_SENHA>@cluster0.abcde.mongodb.net/obidos-connect?retryWrites=true&w=majority
   ```

---

### 2.2. Backend API: Render.com (ou Railway)
1. Crie uma conta em [render.com](https://render.com).
2. Clique em **New + > Web Service**.
3. Conecte seu repositório GitHub do `site_emprego`.
4. Defina as configurações:
   - **Name**: `obidos-connect-api`
   - **Region**: `Ohio (US East)` ou `Frankfurt`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci --omit=dev`
   - **Start Command**: `node src/server.js`
   - **Plan**: `Free`
5. Em **Environment Variables**, adicione:
   | Chave | Valor Exemplo |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGODB_URI` | `mongodb+srv://obidos_admin:sua_senha@cluster0.mongodb.net/obidos-connect?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `chave_aleatoria_longa_com_mais_de_32_caracteres_obidos_2026` |
   | `CLIENT_ORIGIN` | `https://obidos-conect.vercel.app` *(ou `*` durante os primeiros testes)* |
6. Em **Health Check Path**, configure: `/api/health`.
7. Clique em **Create Web Service**. Guarde a URL pública gerada (ex: `https://obidos-connect-api.onrender.com`).

---

### 2.3. Frontend: Vercel (ou Netlify)
1. Crie uma conta em [vercel.com](https://vercel.com).
2. Clique em **Add New > Project** e importe o repositório.
3. Configure o projeto:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Em **Environment Variables**, configure:
   | Chave | Valor |
   |---|---|
   | `VITE_API_URL` | `https://obidos-connect-api.onrender.com/api` |
5. Clique em **Deploy**.
6. *(O repositório já inclui `frontend/vercel.json` e `frontend/public/_redirects` pré-configurados para que rotas diretas do React Router não retornem 404).*

---

## 🐳 3. Opção 2: Deploy com Docker & Docker Compose em VPS

Ideal para hospedar em uma VPS própria (DigitalOcean, Hetzner, AWS EC2, Linode, Oracle Cloud Free Tier).

### 3.1. Requisitos da VPS
- Linux (Ubuntu 22.04 / 24.04 LTS ou Debian 12)
- Docker instalado (`curl -fsSL https://get.docker.com | sh`)
- Docker Compose v2 (`apt install docker-compose-plugin`)
- Mínimo: 1 vCPU, 1 GB de RAM e 15 GB de disco.

### 3.2. Passo a Passo de Execução

1. **Conectar na VPS e clonar o repositório:**
```bash
git clone https://github.com/seu-usuario/site_emprego.git
cd site_emprego
```

2. **Configurar as Variáveis de Ambiente:**
```bash
cp .env.docker.example .env
nano .env
```
*Edite o arquivo definindo seu `JWT_SECRET` e, se desejar usar MongoDB Atlas externo ou o container local `mongo`.*

3. **Subir os containers em background:**
```bash
docker compose up -d --build
```

4. **Verificar se todos os serviços estão saudáveis:**
```bash
docker compose ps
```
Você verá:
- `obidos-mongo`: (healthy) na porta 27017
- `obidos-backend`: (healthy) na porta 5000
- `obidos-frontend`: (healthy) na porta 80

5. **Popular o banco de dados inicial (Seed com vagas e contas de teste):**
```bash
docker compose exec backend npm run seed
```

6. **Ver logs em tempo real:**
```bash
docker compose logs -f backend
```

---

## 🔒 4. Configurando Domínio Próprio e SSL (HTTPS) na VPS

Para rodar com domínio próprio (ex: `obidosconect.com.br`) com certificado SSL gratuito da Let's Encrypt:

### 4.1. Instalar Nginx e Certbot no Host
```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 4.2. Criar configuração de Proxy Reverso
Crie `/etc/nginx/sites-available/obidosconect`:
```nginx
server {
    server_name obidosconect.com.br www.obidosconect.com.br;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative o site:
```bash
sudo ln -s /etc/nginx/sites-available/obidosconect /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4.3. Emitir Certificado SSL Automático
```bash
sudo certbot --nginx -d obidosconect.com.br -d www.obidosconect.com.br
```
*O Certbot configurará renovação automática e redirecionamento de HTTP para HTTPS.*

---

## 🔄 5. CI/CD Automatizado via GitHub Actions

O projeto já conta com fluxo de Integração Contínua em `.github/workflows/ci.yml`.

A cada `git push` na branch `master` ou `main`:
1. Valida a sintaxe de todos os arquivos do backend Node.js (`node --check`).
2. Instala dependências de forma reproduzível com `npm ci`.
3. Compila e valida o build de produção do frontend Vite (`npm run build`).

---

## 📋 6. Checklist de Segurança para Produção

- [ ] **JWT_SECRET Seguro**: Gerado via terminal com `openssl rand -hex 32` (nunca use senhas padrão).
- [ ] **CORS Restrito**: No backend (`CLIENT_ORIGIN`), configure explicitamente o domínio do seu frontend ao invés de `*`.
- [ ] **Credenciais Protegidas**: Arquivos `.env` nunca devem ser commitados no Git (já estão no `.gitignore`).
- [ ] **Health Checks Ativos**: O endpoint `/api/health` retorna `200 OK` quando o banco está conectado e `503 Service Unavailable` se desconectado.
- [ ] **Backups do MongoDB**: No MongoDB Atlas, ative snapshots diários em *Backup Policy*. Em VPS, configure cron job com `mongodump`.
- [ ] **Taxa de Limitação**: O Nginx e a API contam com limites de buffer e sanitização de regex para proteção contra ataques ReDoS e abusos.

---

## 👥 7. Contas Padrão de Demonstração (Seed)

Ao rodar `npm run seed`, as seguintes contas estarão prontas para uso:

| Perfil | E-mail | Senha |
|---|---|---|
| 💼 **Candidata** | `mayara.pauxis@obidos.com.br` | `obidos123` |
| 🏢 **Empresa** | `coopao@obidos.com.br` | `obidos123` |
| 🛡️ **Administrador** | `admin@obidos.com.br` | `obidos123` |
