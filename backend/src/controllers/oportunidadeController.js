import Oportunidade from '../models/Oportunidade.js';
import { escapeRegex } from '../utils/sanitize.js';

export const getAll = async (req, res) => {
  try {
    const { search, tipo, modalidade, categoria, page, limit } = req.query;
    const filter = {};

    if (search) {
      const sanitized = escapeRegex(search);
      filter.$or = [
        { titulo: { $regex: sanitized, $options: 'i' } },
        { descricao: { $regex: sanitized, $options: 'i' } },
        { empresa: { $regex: sanitized, $options: 'i' } },
        { categoria: { $regex: sanitized, $options: 'i' } },
      ];
    }

    if (tipo && tipo !== 'todos') {
      filter.tipo = tipo;
    }

    if (modalidade && modalidade !== 'todas') {
      filter.modalidade = modalidade;
    }

    if (categoria && categoria !== 'todas') {
      filter.categoria = { $regex: escapeRegex(categoria), $options: 'i' };
    }

    // Se parâmetros de paginação forem passados
    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
      const skip = (pageNum - 1) * limitNum;

      const [total, items] = await Promise.all([
        Oportunidade.countDocuments(filter),
        Oportunidade.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
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

    const oportunidades = await Oportunidade.find(filter).sort({ createdAt: -1 });
    res.json(oportunidades);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar oportunidades', error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const oportunidade = await Oportunidade.findById(req.params.id);
    if (!oportunidade) {
      return res.status(404).json({ message: 'Oportunidade não encontrada' });
    }
    res.json(oportunidade);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar oportunidade', error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const dados = { ...req.body };
    if (req.user) {
      dados.usuario_id = req.user._id;
      if (!dados.empresa && req.user.organizacao) {
        dados.empresa = req.user.organizacao;
      }
    }
    const oportunidade = new Oportunidade(dados);
    const saved = await oportunidade.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar oportunidade', error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await Oportunidade.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Oportunidade não encontrada' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar oportunidade', error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const deleted = await Oportunidade.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Oportunidade não encontrada' });
    }
    res.json({ message: 'Oportunidade removida com sucesso', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover oportunidade', error: error.message });
  }
};
