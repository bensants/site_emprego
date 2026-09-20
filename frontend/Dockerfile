# ==============================================================================
# Dockerfile - Óbidos Conect Frontend SPA (Multi-Stage Vite + Nginx Alpine)
# ==============================================================================

# Estágio 1: Build da aplicação React Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependências
COPY package*.json ./
RUN npm ci

# Variável de build para a URL da API (padrão '/api' para proxy reverso do Nginx)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Copiar código fonte
COPY . .

# Executar build de produção do Vite
RUN npm run build

# ==============================================================================
# Estágio 2: Servidor Web Nginx Alpine ultra-leve (~25MB)
# ==============================================================================
FROM nginx:alpine AS runner

# Remover arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar configuração otimizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos estáticos compilados pelo Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta HTTP
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --spider -q http://localhost:80/ || exit 1

# Iniciar servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
