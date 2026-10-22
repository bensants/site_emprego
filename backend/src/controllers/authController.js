import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { escapeRegex } from '../utils/sanitize.js';

const JWT_SECRET = process.env.JWT_SECRET || 'obidos_connect_secret_key_2026_jwt_token_auth';
const JWT_EXPIRES_IN = '7d';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const register = async (req, res) => {
  try {
    const { nome, email, senha, tipo, telefone, endereco, bairro, cep, cidade, estado, profissao, organizacao, bio, coordenadas } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const emailNormalizado = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: emailNormalizado });
    if (existingUser) {
      return res.status(409).json({ message: 'Já existe uma conta cadastrada com este e-mail.' });
    }

    const user = new User({
      nome,
      email: emailNormalizado,
      senha,
      tipo: tipo || 'candidato',
      telefone: telefone || '',
      endereco: endereco || '',
      bairro: bairro || '',
      cep: cep || '',
      cidade: cidade || 'Óbidos',
      estado: estado || 'PA',
      profissao: profissao || '',
      organizacao: organizacao || '',
      bio: bio || '',
      coordenadas: coordenadas || undefined,
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Cadastro realizado com sucesso!',
      token,
      user,
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Informe o e-mail e a senha.' });
    }

    const emailNormalizado = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailNormalizado });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas. Verifique seu e-mail e senha.' });
    }

    const isMatch = await user.compararSenha(senha);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas. Verifique seu e-mail e senha.' });
    }

    if (!user.ativo) {
      return res.status(403).json({ message: 'Sua conta está desativada. Entre em contato com o suporte.' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login realizado com sucesso!',
      token,
      user,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro ao autenticar usuário', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter dados do usuário', error: error.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const allowedFields = [
      'nome',
      'telefone',
      'endereco',
      'bairro',
      'cep',
      'cidade',
      'estado',
      'profissao',
      'organizacao',
      'bio',
      'avatar',
      'coordenadas',
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Perfil atualizado com sucesso!',
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar perfil', error: error.message });
  }
};

/**
 * Lista usuários cadastrados com localização para o Mapa Regional
 */
export const getUsuariosMapa = async (req, res) => {
  try {
    const { search, tipo, bairro, cidade } = req.query;
    const filter = { ativo: true };

    if (tipo && tipo !== 'todos') {
      filter.tipo = tipo;
    }

    if (bairro && bairro !== 'todos') {
      filter.bairro = { $regex: escapeRegex(bairro), $options: 'i' };
    }

    if (cidade && cidade !== 'todas') {
      filter.cidade = { $regex: escapeRegex(cidade), $options: 'i' };
    }

    if (search) {
      const sanitized = escapeRegex(search);
      filter.$or = [
        { nome: { $regex: sanitized, $options: 'i' } },
        { profissao: { $regex: sanitized, $options: 'i' } },
        { organizacao: { $regex: sanitized, $options: 'i' } },
        { endereco: { $regex: sanitized, $options: 'i' } },
        { bairro: { $regex: sanitized, $options: 'i' } },
        { cidade: { $regex: sanitized, $options: 'i' } },
      ];
    }

    // Retorna os dados públicos dos usuários cadastrados para o mapa
    const usuarios = await User.find(filter)
      .select('-senha')
      .sort({ createdAt: -1 });

    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários no mapa:', error);
    res.status(500).json({ message: 'Erro ao listar usuários para o mapa', error: error.message });
  }
};
