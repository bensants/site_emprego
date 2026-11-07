// backend/src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      minlength: [6, 'A senha deve conter no mínimo 6 caracteres'],
    },
    tipo: {
      type: String,
      enum: ['candidato', 'empresa', 'prestador', 'admin'],
      default: 'prestador',
    },
    telefone: {
      type: String,
      default: '',
      trim: true,
    },
    endereco: {
      type: String,
      default: '',
      trim: true,
    },
    bairro: {
      type: String,
      default: '',
      trim: true,
    },
    cep: {
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
    coordenadas: {
      lat: { type: Number },
      lng: { type: Number },
    },
    profissao: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },

    // ==========================================
    // CAMPOS DE VITRINE MEI / AUTÔNOMO
    // ==========================================
    nomeComercial: { type: String, default: '', trim: true },
    bairro: { type: String, default: 'Centro', trim: true },
    categoria: { type: String, default: 'Obras, Reformas e Manutenção Residencial', trim: true },
    visivelNoCatalogo: { type: Boolean, default: true },
    mediaAvaliacoes: { type: Number, default: 5.0 },

    // ==========================================
    // DADOS SENSÍVEIS (LGPD - PROTEGIDOS)
    // ==========================================
    cpfParticular: { type: String, default: '', select: false },
    enderecoParticular: { type: String, default: '', select: false },
    registroMEI: { type: String, default: '', select: false },

    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash de senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para verificar senha
UserSchema.methods.compararSenha = async function (senhaInformada) {
  return bcrypt.compare(senhaInformada, this.senha);
};

// Remove campos sensíveis na serialização JSON
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.senha;
  delete userObject.cpfParticular;
  delete userObject.enderecoParticular;
  delete userObject.registroMEI;
  return userObject;
};

export default mongoose.model('User', UserSchema);
