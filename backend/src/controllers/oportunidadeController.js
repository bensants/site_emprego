import Oportunidade from '../models/Oportunidade.js';

export const getAll = async (req, res) => {
  try {
    const { search, tipo, modalidade, categoria } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { descricao: { $regex: search, $options: 'i' } },
        { empresa: { $regex: search, $options: 'i' } },
        { categoria: { $regex: search, $options: 'i' } },
      ];
    }

    if (tipo && tipo !== 'todos') {
      filter.tipo = tipo;
    }

    if (modalidade && modalidade !== 'todas') {
      filter.modalidade = modalidade;
    }

    if (categoria && categoria !== 'todas') {
      filter.categoria = { $regex: categoria, $options: 'i' };
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
    const oportunidade = new Oportunidade(req.body);
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
