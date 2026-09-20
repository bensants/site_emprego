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
      match: [/^\S+@\S+\.\S+$/, 'Por favor, informe um e-mail válido'],
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      minlength: [6, 'A senha deve conter no mínimo 6 caracteres'],
    },
    tipo: {
      type: String,
      enum: ['candidato', 'empresa', 'admin'],
      default: 'candidato',
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
    profissao: {
      type: String,
      default: '',
      trim: true,
    },
    organizacao: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
      trim: true,
    },
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

// Remover campo senha na serialização JSON
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.senha;
  return userObject;
};

export default mongoose.model('User', UserSchema);
