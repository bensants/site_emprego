// backend/src/seed.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/obidos-connect';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🔄 Conectado ao MongoDB para execução do Seed...');

    await User.deleteMany({});
    console.log('🧹 Base antiga limpa.');

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash('123456', salt);

    await User.create([
      {
        nome: 'João da Silva Picanço',
        email: 'joao.eletricista@email.com',
        senha: senhaHash,
        tipo: 'prestador',
        nomeComercial: 'Silva Reparos e Instalações Elétricas',
        telefone: '93991234567',
        cidade: 'Óbidos',
        estado: 'PA',
        bairro: 'Centro',
        profissao: 'Eletricista Predial',
        categoria: 'Obras, Reformas e Manutenção Residencial',
        bio: 'Eletricista predial com mais de 10 anos de experiência. Troca de quadros, instalações residenciais e conserto de chuveiros.',
        visivelNoCatalogo: true,
        mediaAvaliacoes: 4.9,
      },
      {
        nome: 'Maria Raimunda Santos',
        email: 'maria.refrigeracao@email.com',
        senha: senhaHash,
        tipo: 'prestador',
        nomeComercial: 'Norte Clima - Refrigeração',
        telefone: '93998765432',
        cidade: 'Óbidos',
        estado: 'PA',
        bairro: 'Santa Terezinha',
        profissao: 'Técnica em Refrigeração',
        categoria: 'Reparos Técnicos e Instalações Mecânicas',
        bio: 'Manutenção preventiva e corretiva, higienização e instalação de ar split e refrigeradores.',
        visivelNoCatalogo: true,
        mediaAvaliacoes: 5.0,
      },
      {
        nome: 'Sebastião Freire',
        email: 'sebastiao.fretes@email.com',
        senha: senhaHash,
        tipo: 'prestador',
        nomeComercial: 'Tião Fretes e Pequenas Mudanças',
        telefone: '93984001122',
        cidade: 'Óbidos',
        estado: 'PA',
        bairro: 'São Francisco',
        profissao: 'Transportador Autônomo',
        categoria: 'Fretes, Mudanças e Transporte Municipal',
        bio: 'Fretes urbanos rápidos em Óbidos e pequenas mudanças com picape e carretinha.',
        visivelNoCatalogo: true,
        mediaAvaliacoes: 4.7,
      },
      {
        nome: 'Carlos Eduardo Mendes',
        email: 'carlos.cliente@email.com',
        senha: senhaHash,
        tipo: 'empresa',
        telefone: '93991112233',
        cidade: 'Óbidos',
        estado: 'PA',
        bairro: 'Fátima',
      },
    ]);

    console.log('✅ Base populada com prestadores de Óbidos/PA!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no Seed:', error);
    process.exit(1);
  }
}

seedDatabase();
