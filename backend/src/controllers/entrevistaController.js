import SalaEntrevista from '../models/SalaEntrevista.js';

export const getAll = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'todas') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { candidato_nome: { $regex: search, $options: 'i' } },
        { empresa_nome: { $regex: search, $options: 'i' } },
        { observacoes: { $regex: search, $options: 'i' } },
      ];
    }

    const salas = await SalaEntrevista.find(filter).sort({ data_agendada: 1 });
    res.json(salas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar salas de entrevista', error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const sala = await SalaEntrevista.findById(req.params.id);
    if (!sala) {
      return res.status(404).json({ message: 'Sala de entrevista não encontrada' });
    }
    res.json(sala);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar sala de entrevista', error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const sala = new SalaEntrevista(req.body);
    const saved = await sala.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao agendar entrevista', error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await SalaEntrevista.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Sala de entrevista não encontrada' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar entrevista', error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const deleted = await SalaEntrevista.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Sala de entrevista não encontrada' });
    }
    res.json({ message: 'Sala de entrevista removida com sucesso', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover sala de entrevista', error: error.message });
  }
};
