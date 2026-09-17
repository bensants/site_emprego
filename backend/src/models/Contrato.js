import mongoose from 'mongoose';

const ContratoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título do contrato é obrigatório'],
      trim: true,
    },
    contratante_id: {
      type: String,
      default: '',
      trim: true,
    },
    contratante_nome: {
      type: String,
      default: 'Contratante',
      trim: true,
    },
    contratado_id: {
      type: String,
      default: '',
      trim: true,
    },
    contratado_nome: {
      type: String,
      default: 'Prestador / Profissional',
      trim: true,
    },
    valor: {
      type: Number,
      required: [true, 'O valor do contrato é obrigatório'],
    },
    forma_pagamento: {
      type: String,
      default: 'Pix / Transferência',
      trim: true,
    },
    data_inicio: {
      type: Date,
      default: Date.now,
    },
    data_fim: {
      type: Date,
    },
    escopo_trabalho: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['proposta', 'aceito', 'em_andamento', 'finalizado', 'cancelado'],
      default: 'proposta',
    },
    progresso: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Contrato', ContratoSchema);
