import mongoose from 'mongoose';

const SalaEntrevistaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título da sala de entrevista é obrigatório'],
      trim: true,
    },
    candidato_nome: {
      type: String,
      default: 'Candidato Selecionado',
      trim: true,
    },
    empresa_nome: {
      type: String,
      default: 'Empresa Contratante',
      trim: true,
    },
    data_agendada: {
      type: Date,
      required: [true, 'A data agendada é obrigatória'],
      default: Date.now,
    },
    duracao_minutos: {
      type: Number,
      default: 45,
    },
    link_reuniao: {
      type: String,
      default: 'https://meet.jit.si/obidos-connect-entrevista',
      trim: true,
    },
    status: {
      type: String,
      enum: ['agendada', 'em_andamento', 'finalizada', 'cancelada'],
      default: 'agendada',
    },
    observacoes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('SalaEntrevista', SalaEntrevistaSchema);
