import PostComunidade from '../models/PostComunidade.js';
import { escapeRegex } from '../utils/sanitize.js';

export const getAll = async (req, res) => {
  try {
    const { tipo, search, tag } = req.query;
    const filter = {};

    if (tipo && tipo !== 'todos') {
      filter.tipo = tipo;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (search) {
      const sanitized = escapeRegex(search);
      filter.$or = [
        { titulo: { $regex: sanitized, $options: 'i' } },
        { conteudo: { $regex: sanitized, $options: 'i' } },
        { categoria: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const posts = await PostComunidade.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar posts da comunidade', error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const post = await PostComunidade.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar post', error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const dados = { ...req.body };
    if (req.user) {
      dados.autor_nome = req.user.nome;
      dados.autor_cargo = req.user.profissao || req.user.organizacao || 'Membro da Comunidade';
    }
    const post = new PostComunidade(dados);
    const saved = await post.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar post', error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await PostComunidade.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar post', error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const deleted = await PostComunidade.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    res.json({ message: 'Post removido com sucesso', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover post', error: error.message });
  }
};

export const curtir = async (req, res) => {
  try {
    const post = await PostComunidade.findByIdAndUpdate(
      req.params.id,
      { $inc: { curtidas: 1 } },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao curtir post', error: error.message });
  }
};
