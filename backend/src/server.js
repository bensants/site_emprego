// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import oportunidadeRoutes from './routes/oportunidadeRoutes.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/obidos-connect';

// Configuração de CORS
const allowedOrigins = CLIENT_ORIGIN.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// ==========================================
// HEALTHCHECK NATIVO (DOCKER / KUBERNETES)
// ==========================================
app.get(['/api/health', '/health'], (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: isDbConnected ? 'conectado' : 'conectando'
  });
});

// ==========================================
// ROTAS DA APLICAÇÃO
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/oportunidades', oportunidadeRoutes);

// Rota de Vitrine Pública de Prestadores (MEIs de Óbidos)
app.get('/api/prestadores', async (req, res) => {
  try {
    const { categoria, bairro, busca } = req.query;

    const filtro = {
      ativo: true,
      visivelNoCatalogo: true,
    };

    if (bairro) {
      filtro.bairro = new RegExp(bairro, 'i');
    }

    if (categoria && categoria !== 'todas' && categoria !== 'Todas') {
      filtro.categoria = new RegExp(categoria, 'i');
    }

    if (busca) {
      filtro.$or = [
        { nome: new RegExp(busca, 'i') },
        { nomeComercial: new RegExp(busca, 'i') },
        { bio: new RegExp(busca, 'i') },
        { profissao: new RegExp(busca, 'i') },
      ];
    }

    // LGPD: Seleção segura sem dados civis sensíveis
    const prestadores = await User.find(filtro)
      .select('nome nomeComercial telefone cidade estado bairro categoria bio profissao mediaAvaliacoes')
      .lean();

    return res.status(200).json(prestadores);
  } catch (error) {
    console.error('Erro ao listar prestadores:', error);
    return res.status(500).json({ error: 'Erro interno ao consultar catálogo.' });
  }
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR E BANCO
// ==========================================
// 1. Inicia o servidor HTTP imediatamente para atender ao healthcheck do Docker
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Óbidos Connect rodando na porta ${PORT}`);
  console.log(`🌐 Healthcheck ativo em: http://localhost:${PORT}/api/health`);
});

// 2. Conecta ao MongoDB de forma assíncrona
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conexão com MongoDB estabelecida com sucesso!');
  })
  .catch((err) => {
    console.error('❌ Aviso: Falha ao conectar ao MongoDB:', err.message);
  });

export default app;
