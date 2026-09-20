import Candidatura from '../models/Candidatura.js';
import Oportunidade from '../models/Oportunidade.js';
import Curriculo from '../models/Curriculo.js';
import SalaEntrevista from '../models/SalaEntrevista.js';

export const create = async (req, res) => {
  try {
    const { oportunidade_id, mensagem, curriculo_id } = req.body;

    if (!oportunidade_id) {
      return res.status(400).json({ message: 'O ID da oportunidade é obrigatório.' });
    }

    const oportunidade = await Oportunidade.findById(oportunidade_id);
    if (!oportunidade) {
      return res.status(404).json({ message: 'Oportunidade não encontrada.' });
    }

    // Verifica se já se candidatou
    const jaCandidatou = await Candidatura.findOne({
      oportunidade_id,
      candidato_id: req.user._id,
    });

    if (jaCandidatou) {
      return res.status(409).json({ message: 'Você já se candidatou a esta oportunidade.' });
    }

    // Tenta encontrar currículo do usuário se curriculo_id não foi passado
    let idCurriculoFinal = curriculo_id;
    if (!idCurriculoFinal) {
      const curriculoDoUsuario = await Curriculo.findOne({
        $or: [
          { usuario_id: req.user._id },
          { email: req.user.email },
        ],
      });
      if (curriculoDoUsuario) {
        idCurriculoFinal = curriculoDoUsuario._id;
      }
    }

    const candidatura = new Candidatura({
      oportunidade_id,
      candidato_id: req.user._id,
      candidato_nome: req.user.nome,
      candidato_email: req.user.email,
      candidato_telefone: req.user.telefone || '',
      candidato_profissao: req.user.profissao || '',
      curriculo_id: idCurriculoFinal || null,
      mensagem: mensagem || '',
      status: 'pendente',
      historico_status: [
        {
          status: 'pendente',
          data: new Date(),
          observacao: 'Candidatura registrada na plataforma.',
        },
      ],
    });

    const saved = await candidatura.save();
    res.status(201).json({
      message: 'Candidatura enviada com sucesso!',
      candidatura: saved,
    });
  } catch (error) {
    console.error('Erro ao candidatar-se:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Você já se candidatou a esta oportunidade.' });
    }
    res.status(500).json({ message: 'Erro ao enviar candidatura', error: error.message });
  }
};

export const getMinhas = async (req, res) => {
  try {
    const candidaturas = await Candidatura.find({ candidato_id: req.user._id })
      .populate('oportunidade_id')
      .populate('sala_entrevista_id')
      .sort({ createdAt: -1 });

    res.json(candidaturas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar suas candidaturas', error: error.message });
  }
};

export const getByOportunidade = async (req, res) => {
  try {
    const { oportunidadeId } = req.params;
    const candidaturas = await Candidatura.find({ oportunidade_id: oportunidadeId })
      .populate('curriculo_id')
      .populate('sala_entrevista_id')
      .sort({ createdAt: -1 });

    res.json(candidaturas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar candidaturas da vaga', error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status, observacao, feedback_empresa } = req.body;
    const validStatuses = ['pendente', 'em_analise', 'entrevista', 'aprovado', 'reprovado'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status de candidatura inválido.' });
    }

    const candidatura = await Candidatura.findById(req.params.id);
    if (!candidatura) {
      return res.status(404).json({ message: 'Candidatura não encontrada.' });
    }

    candidatura.status = status;
    if (feedback_empresa !== undefined) {
      candidatura.feedback_empresa = feedback_empresa;
    }

    candidatura.historico_status.push({
      status,
      data: new Date(),
      observacao: observacao || `Etapa do processo alterada para: ${status}`,
    });

    const updated = await candidatura.save();
    await updated.populate('oportunidade_id', 'titulo empresa');
    await updated.populate('sala_entrevista_id');

    res.json({
      message: 'Status atualizado com sucesso!',
      candidatura: updated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status da candidatura', error: error.message });
  }
};

export const agendarEntrevista = async (req, res) => {
  try {
    const { data_agendada, duracao_minutos, observacoes } = req.body;

    const candidatura = await Candidatura.findById(req.params.id).populate('oportunidade_id');
    if (!candidatura) {
      return res.status(404).json({ message: 'Candidatura não encontrada.' });
    }

    const op = candidatura.oportunidade_id;
    const meetingId = `obidos-${candidatura._id.toString().slice(-6)}-${Date.now().toString().slice(-4)}`;
    const linkReuniao = `https://meet.jit.si/${meetingId}`;

    const sala = new SalaEntrevista({
      titulo: `Entrevista: ${candidatura.candidato_nome} - ${op ? op.titulo : 'Vaga'}`,
      candidato_nome: candidatura.candidato_nome,
      empresa_nome: op ? op.empresa : 'Empresa Contratante',
      data_agendada: data_agendada ? new Date(data_agendada) : new Date(Date.now() + 24 * 60 * 60 * 1000),
      duracao_minutos: duracao_minutos || 45,
      link_reuniao: linkReuniao,
      status: 'agendada',
      observacoes: observacoes || 'Entrevista agendada via Óbidos Conect',
    });

    await sala.save();

    // Atualiza a candidatura para status entrevista e vincula a sala criada
    candidatura.status = 'entrevista';
    candidatura.sala_entrevista_id = sala._id;
    candidatura.historico_status.push({
      status: 'entrevista',
      data: new Date(),
      observacao: `Entrevista virtual agendada para ${new Date(sala.data_agendada).toLocaleString('pt-BR')}`,
    });

    await candidatura.save();

    res.status(201).json({
      message: 'Entrevista virtual agendada com sucesso!',
      sala,
      candidatura,
    });
  } catch (error) {
    console.error('Erro ao agendar entrevista:', error);
    res.status(500).json({ message: 'Erro ao agendar entrevista', error: error.message });
  }
};

export const cancelar = async (req, res) => {
  try {
    const deleted = await Candidatura.findOneAndDelete({
      _id: req.params.id,
      candidato_id: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Candidatura não encontrada ou não pertence a você.' });
    }

    res.json({ message: 'Candidatura cancelada com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cancelar candidatura', error: error.message });
  }
};
