import mongoose from 'mongoose';

const PostComunidadeSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título da publicação é obrigatório'],
      trim: true,
    },
    conteudo: {
      type: String,
      default: '',
    },
    tipo: {
      type: String,
      enum: ['discussao', 'regulamentacao', 'dica', 'evento', 'noticia'],
      default: 'discussao',
    },
    categoria: {
      type: String,
      default: 'Geral',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    curtidas: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      default: 'ativo',
      trim: true,
    },
    autor_nome: {
      type: String,
      default: 'Membro da Comunidade',
      trim: true,
    },
    autor_cargo: {
      type: String,
      default: 'Profissional em Óbidos',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('PostComunidade', PostComunidadeSchema);
