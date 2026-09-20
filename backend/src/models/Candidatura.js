import mongoose from 'mongoose';

const HistoricoStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pendente', 'em_analise', 'entrevista', 'aprovado', 'reprovado'],
      required: true,
    },
    data: {
      type: Date,
      default: Date.now,
    },
    observacao: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const CandidaturaSchema = new mongoose.Schema(
  {
    oportunidade_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Oportunidade',
      required: [true, 'A oportunidade é obrigatória'],
    },
    candidato_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'O candidato é obrigatório'],
    },
    candidato_nome: {
      type: String,
      required: [true, 'O nome do candidato é obrigatório'],
      trim: true,
    },
    candidato_email: {
      type: String,
      required: [true, 'O e-mail do candidato é obrigatório'],
      trim: true,
    },
    candidato_telefone: {
      type: String,
      default: '',
      trim: true,
    },
    candidato_profissao: {
      type: String,
      default: '',
      trim: true,
    },
    curriculo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curriculo',
      default: null,
    },
    mensagem: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pendente', 'em_analise', 'entrevista', 'aprovado', 'reprovado'],
      default: 'pendente',
    },
    feedback_empresa: {
      type: String,
      default: '',
      trim: true,
    },
    sala_entrevista_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalaEntrevista',
      default: null,
    },
    historico_status: {
      type: [HistoricoStatusSchema],
      default: () => [
        {
          status: 'pendente',
          data: new Date(),
          observacao: 'Candidatura enviada pelo profissional.',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Impede que um mesmo candidato se inscreva duas vezes na mesma oportunidade
CandidaturaSchema.index({ oportunidade_id: 1, candidato_id: 1 }, { unique: true });

export default mongoose.model('Candidatura', CandidaturaSchema);
