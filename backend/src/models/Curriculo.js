import mongoose from 'mongoose';

const ExperienciaSchema = new mongoose.Schema(
  {
    empresa: { type: String, default: '', trim: true },
    cargo: { type: String, default: '', trim: true },
    periodo: { type: String, default: '', trim: true },
    descricao: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const FormacaoSchema = new mongoose.Schema(
  {
    instituicao: { type: String, default: '', trim: true },
    curso: { type: String, default: '', trim: true },
    periodo: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const CurriculoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título do currículo é obrigatório'],
      trim: true,
    },
    nome_candidato: {
      type: String,
      default: 'Profissional de Óbidos',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
    },
    telefone: {
      type: String,
      default: '',
      trim: true,
    },
    cidade: {
      type: String,
      default: 'Óbidos',
      trim: true,
    },
    estado: {
      type: String,
      default: 'PA',
      trim: true,
    },
    resumo_profissional: {
      type: String,
      default: '',
      trim: true,
    },
    habilidades: {
      type: [String],
      default: [],
    },
    experiencias: {
      type: [ExperienciaSchema],
      default: [],
    },
    formacao: {
      type: [FormacaoSchema],
      default: [],
    },
    visibilidade: {
      type: String,
      enum: ['publico', 'privado'],
      default: 'publico',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Curriculo', CurriculoSchema);
