import Curriculo from '../models/Curriculo.js';
import { escapeRegex } from '../utils/sanitize.js';

export const getAll = async (req, res) => {
  try {
    const { search, visibilidade, page, limit } = req.query;
    const filter = {};

    if (visibilidade && visibilidade !== 'todos') {
      filter.visibilidade = visibilidade;
    }

    if (search) {
      const sanitized = escapeRegex(search);
      const searchRegex = new RegExp(sanitized, 'i');
      filter.$or = [
        { titulo: { $regex: sanitized, $options: 'i' } },
        { nome_candidato: { $regex: sanitized, $options: 'i' } },
        { resumo_profissional: { $regex: sanitized, $options: 'i' } },
        { habilidades: { $in: [searchRegex] } },
      ];
    }

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
      const skip = (pageNum - 1) * limitNum;

      const [total, items] = await Promise.all([
        Curriculo.countDocuments(filter),
        Curriculo.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      ]);

      return res.json({
        data: items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }

    const curriculos = await Curriculo.find(filter).sort({ createdAt: -1 });
    res.json(curriculos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar currículos', error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const curriculo = await Curriculo.findById(req.params.id);
    if (!curriculo) {
      return res.status(404).json({ message: 'Currículo não encontrado' });
    }
    res.json(curriculo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar currículo', error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const dados = { ...req.body };
    if (req.user) {
      dados.usuario_id = req.user._id;
      if (!dados.nome_candidato) dados.nome_candidato = req.user.nome;
      if (!dados.email) dados.email = req.user.email;
      if (!dados.telefone) dados.telefone = req.user.telefone;
    }
    const curriculo = new Curriculo(dados);
    const saved = await curriculo.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar currículo', error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await Curriculo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Currículo não encontrado' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar currículo', error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const deleted = await Curriculo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Currículo não encontrado' });
    }
    res.json({ message: 'Currículo removido com sucesso', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover currículo', error: error.message });
  }
};
