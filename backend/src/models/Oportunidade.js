// backend/src/models/Oportunidade.js
import mongoose from 'mongoose';

const OportunidadeSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título da oportunidade/demanda é obrigatório'],
      trim: true,
    },
    descricao: {
      type: String,
      default: '',
    },
    tipo: {
      type: String,
      enum: ['freelance', 'servico', 'emprego', 'projeto'],
      default: 'servico',
    },
    categoria: {
      type: String,
      default: 'Obras, Reformas e Manutenção Residencial',
      trim: true,
    },
    orcamentoPrevisto: {
      type: Number,
      default: null,
    },
    salario: {
      type: String,
      default: 'A combinar',
      trim: true,
    },
    bairro: {
      type: String,
      default: 'Centro',
      trim: true,
    },
    localizacao: {
      type: String,
      default: 'Óbidos, PA',
      trim: true,
    },
    status: {
      type: String,
      enum: ['aberta', 'em_andamento', 'concluida', 'cancelada'],
      default: 'aberta',
      trim: true,
    },
    contatoPreferencial: {
      type: String,
      default: '',
    },
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Oportunidade', OportunidadeSchema);
