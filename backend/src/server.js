import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import candidaturaRoutes from './routes/candidaturaRoutes.js';
import oportunidadeRoutes from './routes/oportunidadeRoutes.js';
import curriculoRoutes from './routes/curriculoRoutes.js';
import contratoRoutes from './routes/contratoRoutes.js';
import comunidadeRoutes from './routes/comunidadeRoutes.js';
import entrevistaRoutes from './routes/entrevistaRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/obidos-connect';

// Configuração flexível de CORS (suporta múltiplos domínios separados por vírgula ou '*')
const allowedOrigins = CLIENT_ORIGIN.split(',').map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// Rota de status e health check da API
app.get(['/api', '/api/health', '/health'], (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado';
  const isHealthy = mongoose.connection.readyState === 1;

  res.status(isHealthy ? 200 : 503).json({
    name: 'Óbidos Connect API',
    version: '1.0.0',
    description: 'Plataforma de Conexão Profissional Regional - Óbidos, Pará',
    status: isHealthy ? 'online' : 'degraded',
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Rotas REST
app.use('/api/auth', authRoutes);
app.use('/api/candidaturas', candidaturaRoutes);
app.use('/api/oportunidades', oportunidadeRoutes);
app.use('/api/curriculos', curriculoRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api/comunidade', comunidadeRoutes);
app.use('/api/entrevistas', entrevistaRoutes);

// Tratamento de rotas inexistentes
app.use((req, res) => {
  res.status(404).json({ message: `Rota ${req.method} ${req.url} não encontrada` });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro na requisição:', err);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Conexão com o MongoDB Atlas / Local
const connectDatabase = async () => {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conexão com MongoDB estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Falha ao conectar ao MongoDB:', error.message);
    console.warn(
      '⚠️  Verifique se a string de conexão MONGODB_URI no arquivo backend/.env está correta.'
    );
  }
};

connectDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Servidor Óbidos Connect rodando na porta ${PORT}`);
  console.log(`🌐 API disponível em: http://localhost:${PORT}/api`);
  console.log(`🔗 CORS habilitado para: ${CLIENT_ORIGIN}`);
});

export default app;
