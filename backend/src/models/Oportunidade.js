import mongoose from 'mongoose';

const OportunidadeSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título da oportunidade é obrigatório'],
      trim: true,
    },
    descricao: {
      type: String,
      default: '',
    },
    tipo: {
      type: String,
      enum: ['emprego', 'freelance', 'projeto', 'servico'],
      default: 'emprego',
    },
    categoria: {
      type: String,
      default: 'Geral',
      trim: true,
    },
    salario: {
      type: String,
      default: '',
      trim: true,
    },
    empresa: {
      type: String,
      default: 'Empresa Regional de Óbidos',
      trim: true,
    },
    localizacao: {
      type: String,
      default: 'Óbidos, PA',
      trim: true,
    },
    modalidade: {
      type: String,
      enum: ['presencial', 'remoto', 'hibrido'],
      default: 'presencial',
    },
    tipo_contrato: {
      type: String,
      default: 'CLT',
      trim: true,
    },
    requisitos: {
      type: [String],
      default: [],
    },
    beneficios: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      default: 'aberta',
      trim: true,
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

