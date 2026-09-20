# ==============================================================================
# Dockerfile - Óbidos Conect Backend API (Node.js 20 Alpine)
# ==============================================================================

FROM node:20-alpine AS base

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências necessárias para o sistema e wget para healthcheck
RUN apk add --no-cache curl wget dumb-init

# Definir ambiente de produção
ENV NODE_ENV=production
ENV PORT=5000

# Copiar manifestos de dependências primeiro (cache eficiente de camadas Docker)
COPY package*.json ./

# Instalar dependências de produção de forma determinística
RUN npm ci --omit=dev && npm cache clean --force

# Copiar o restante do código da aplicação com as permissões do usuário node
COPY --chown=node:node . .

# Usar usuário não-root por segurança
USER node

# Expor a porta da API
EXPOSE 5000

# Health check nativo para Docker / Kubernetes / Render / AWS
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# dumb-init lida com sinais de finalização Unix (SIGINT/SIGTERM) de forma limpa
ENTRYPOINT ["dumb-init", "--"]

# Iniciar servidor Node.js
CMD ["node", "src/server.js"]
