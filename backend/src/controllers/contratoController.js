import Contrato from '../models/Contrato.js';

export const getAll = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'todos') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { contratante_nome: { $regex: search, $options: 'i' } },
        { contratado_nome: { $regex: search, $options: 'i' } },
        { escopo_trabalho: { $regex: search, $options: 'i' } },
      ];
    }

    const contratos = await Contrato.find(filter).sort({ createdAt: -1 });
    res.json(contratos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar contratos', error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const contrato = await Contrato.findById(req.params.id);
    if (!contrato) {
      return res.status(404).json({ message: 'Contrato não encontrado' });
    }
    res.json(contrato);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar contrato', error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const contrato = new Contrato(req.body);
    const saved = await contrato.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar contrato', error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await Contrato.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Contrato não encontrado' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar contrato', error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const deleted = await Contrato.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contrato não encontrado' });
    }
    res.json({ message: 'Contrato removido com sucesso', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover contrato', error: error.message });
  }
};
