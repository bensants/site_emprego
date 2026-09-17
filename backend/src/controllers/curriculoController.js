import Curriculo from '../models/Curriculo.js';

export const getAll = async (req, res) => {
  try {
    const { search, visibilidade } = req.query;
    const filter = {};

    if (visibilidade && visibilidade !== 'todos') {
      filter.visibilidade = visibilidade;
    }

    if (search) {
      filter.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { nome_candidato: { $regex: search, $options: 'i' } },
        { resumo_profissional: { $regex: search, $options: 'i' } },
        { habilidades: { $in: [new RegExp(search, 'i')] } },
      ];
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
    const curriculo = new Curriculo(req.body);
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
