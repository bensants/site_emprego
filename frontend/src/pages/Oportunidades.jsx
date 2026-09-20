import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  Building2,
  DollarSign,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  Send,
  MessageCircle,
  ExternalLink,
  Phone,
  Mail,
  User,
  Video,
} from 'lucide-react';
import { toast } from 'sonner';
import { oportunidadesApi, candidaturasApi } from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function Oportunidades() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [modalidadeFilter, setModalidadeFilter] = useState('todas');

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyingOp, setApplyingOp] = useState(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [viewingApplicantsOp, setViewingApplicantsOp] = useState(null);
  const [applicantFilter, setApplicantFilter] = useState('todos');

  // Form State para Nova Oportunidade
  const initialFormState = {
    titulo: '',
    descricao: '',
    tipo: 'emprego',
    categoria: 'Tecnologia da Informação',
    salario: '',
    empresa: user?.organizacao || user?.nome || '',
    localizacao: 'Óbidos, PA',
    modalidade: 'presencial',
    tipo_contrato: 'CLT',
    requisitos: '',
    beneficios: '',
    status: 'aberta',
  };
  const [formData, setFormData] = useState(initialFormState);

  // React Query: Buscar Oportunidades
  const { data: oportunidades = [], isLoading, isError, error } = useQuery({
    queryKey: ['oportunidades', { search, tipo: tipoFilter, modalidade: modalidadeFilter }],
    queryFn: () =>
      oportunidadesApi.getAll({
        search: search || undefined,
        tipo: tipoFilter !== 'todos' ? tipoFilter : undefined,
        modalidade: modalidadeFilter !== 'todas' ? modalidadeFilter : undefined,
      }),
  });

  // React Query: Minhas Candidaturas (se autenticado como candidato)
  const { data: minhasCandidaturas = [] } = useQuery({
    queryKey: ['minhas-candidaturas'],
    queryFn: () => candidaturasApi.getMinhas(),
    enabled: isAuthenticated && user?.tipo === 'candidato',
  });

  // React Query: Candidatos da Oportunidade Selecionada
  const { data: candidatosVaga = [], isLoading: loadingCandidatos } = useQuery({
    queryKey: ['candidatos-vaga', viewingApplicantsOp?._id],
    queryFn: () => candidaturasApi.getByOportunidade(viewingApplicantsOp._id),
    enabled: !!viewingApplicantsOp,
  });

  // Mutation: Criar Oportunidade
  const createMutation = useMutation({
    mutationFn: (newOportunidade) => oportunidadesApi.create(newOportunidade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oportunidades'] });
      setIsModalOpen(false);
      setFormData(initialFormState);
      toast.success('Oportunidade publicada com sucesso no Óbidos Conect!');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Erro ao publicar oportunidade');
    },
  });

  // Mutation: Deletar Oportunidade
  const deleteMutation = useMutation({
    mutationFn: (id) => oportunidadesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oportunidades'] });
      toast.success('Oportunidade removida com sucesso');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Erro ao remover oportunidade');
    },
  });

  // Mutation: Candidatar-se
  const applyMutation = useMutation({
    mutationFn: (payload) => candidaturasApi.apply(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhas-candidaturas'] });
      setApplyingOp(null);
      setApplyMessage('');
      toast.success('Candidatura enviada com sucesso! O contratante foi notificado.');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Erro ao enviar candidatura');
    },
  });

  // Mutation: Atualizar Status de Candidatura
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => candidaturasApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidatos-vaga', viewingApplicantsOp?._id] });
      toast.success('Status da candidatura atualizado!');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Erro ao alterar status');
    },
  });

  // Mutation: Agendar Entrevista Virtual Direto da Candidatura
  const scheduleInterviewMutation = useMutation({
    mutationFn: ({ id, data_agendada }) =>
      candidaturasApi.agendarEntrevista(id, {
        data_agendada: data_agendada || new Date(Date.now() + 24 * 60 * 60 * 1000),
        duracao_minutos: 45,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidatos-vaga', viewingApplicantsOp?._id] });
      queryClient.invalidateQueries({ queryKey: ['entrevistas'] });
      toast.success('Entrevista virtual agendada e sala gerada com sucesso!');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Erro ao agendar entrevista');
    },
  });

  const handleSubmitNewOp = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) return;

    const payload = {
      ...formData,
      requisitos: formData.requisitos
        ? formData.requisitos.split(',').map((r) => r.trim()).filter(Boolean)
        : [],
      beneficios: formData.beneficios
        ? formData.beneficios.split(',').map((b) => b.trim()).filter(Boolean)
        : [],
    };

    createMutation.mutate(payload);
  };

  const handleOpenApply = (op) => {
    if (!isAuthenticated) {
      toast.info('Faça login ou crie sua conta para se candidatar às oportunidades.');
      navigate('/login');
      return;
    }
    setApplyingOp(op);
    setApplyMessage('');
  };

  const handleConfirmApply = (e) => {
    e.preventDefault();
    if (!applyingOp) return;

    applyMutation.mutate({
      oportunidade_id: applyingOp._id,
      mensagem: applyMessage.trim(),
    });
  };

  const hasUserApplied = (opId) => {
    return minhasCandidaturas.some(
      (c) => c.oportunidade_id?._id === opId || c.oportunidade_id === opId
    );
  };

  const getStatusBadge = (status) => {
    const map = {
      pendente: { label: 'Pendente', bg: 'bg-amber-100 text-amber-800 border-amber-200' },
      em_analise: { label: 'Em Análise', bg: 'bg-blue-100 text-blue-800 border-blue-200' },
      entrevista: { label: 'Entrevista', bg: 'bg-purple-100 text-purple-800 border-purple-200' },
      aprovado: { label: 'Aprovado', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      reprovado: { label: 'Reprovado', bg: 'bg-rose-100 text-rose-800 border-rose-200' },
    };
    const s = map[status] || map.pendente;
    return <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${s.bg}`}>{s.label}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Mural de Oportunidades
          </h1>
          <p className="text-sm text-slate-500">
            Vagas formais, demandas de projetos e freelances em Óbidos e no Baixo Amazonas.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Publicar Oportunidade
        </Button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por cargo, empresa ou habilidade..."
            className="pl-9"
          />
        </div>

        <div>
          <Select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
            <option value="todos">Todos os Tipos</option>
            <option value="emprego">Emprego Formal</option>
            <option value="freelance">Freelance</option>
            <option value="projeto">Projeto Temporário</option>
            <option value="servico">Prestação de Serviço</option>
          </Select>
        </div>

        <div>
          <Select value={modalidadeFilter} onChange={(e) => setModalidadeFilter(e.target.value)}>
            <option value="todas">Todas Modalidades</option>
            <option value="presencial">Presencial em Óbidos</option>
            <option value="remoto">100% Remoto</option>
            <option value="hibrido">Híbrido</option>
          </Select>
        </div>
      </div>

      {/* Grid de Oportunidades */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-500 text-sm">Carregando oportunidades da região...</div>
      ) : isError ? (
        <div className="py-8 text-center text-rose-500 text-sm flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Erro ao carregar oportunidades: {error?.message}
        </div>
      ) : oportunidades.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-300 rounded-2xl bg-white/50">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Nenhuma oportunidade encontrada</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Tente ajustar os filtros de busca ou cadastre a primeira vaga da sua cooperativa ou empresa.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {oportunidades.map((op) => {
            const alreadyApplied = hasUserApplied(op._id);
            const isOwnerOrAdmin =
              user?.tipo === 'admin' ||
              user?.tipo === 'empresa' ||
              (op.usuario_id && user?._id && op.usuario_id === user._id);

            return (
              <Card
                key={op._id}
                className="flex flex-col justify-between border-slate-200/80 bg-white shadow-sm hover:border-blue-300 transition-all hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="default" className="capitalize text-xs font-semibold">
                          {op.tipo}
                        </Badge>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {op.modalidade}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-slate-200">
                          {op.tipo_contrato || 'Contrato Livre'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-900 leading-snug">
                        {op.titulo}
                      </CardTitle>
                      <p className="text-xs font-semibold text-blue-700 mt-1 flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {op.empresa || 'Empresa Local'}
                      </p>
                    </div>

                    {isOwnerOrAdmin && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Deseja remover a oportunidade "${op.titulo}"?`)) {
                            deleteMutation.mutate(op._id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Excluir oportunidade"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 text-xs text-slate-600 pb-3">
                  <p className="line-clamp-3 text-slate-600 leading-relaxed">{op.descricao}</p>

                  {/* Localização e Remuneração */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{op.localizacao || 'Óbidos, PA'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-700 justify-end">
                      <DollarSign className="h-3.5 w-3.5 shrink-0" />
                      <span>{op.salario || 'A combinar'}</span>
                    </div>
                  </div>

                  {/* Requisitos */}
                  {op.requisitos && op.requisitos.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-700 block mb-1.5">Requisitos:</span>
                      <div className="flex flex-wrap gap-1">
                        {op.requisitos.map((req, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px]"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefícios */}
                  {op.beneficios && op.beneficios.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-700 block mb-1.5">Benefícios:</span>
                      <div className="flex flex-wrap gap-1">
                        {op.beneficios.map((ben, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[11px]"
                          >
                            {ben}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Setor: <span className="font-medium text-slate-600">{op.categoria || 'Geral'}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Botão Ver Candidatos (para empresas e admin) */}
                    {(user?.tipo === 'empresa' || user?.tipo === 'admin') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingApplicantsOp(op)}
                        className="text-xs font-semibold gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Users className="h-3.5 w-3.5" />
                        Ver Inscritos
                      </Button>
                    )}

                    {/* Botão de Candidatura */}
                    {alreadyApplied ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Candidatura Enviada
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleOpenApply(op)}
                        className="text-xs font-semibold bg-blue-600 hover:bg-blue-700"
                      >
                        Candidatar-se
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal 1: Publicar Nova Oportunidade */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent onClose={() => setIsModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Publicar Nova Oportunidade</DialogTitle>
            <DialogDescription>
              Cadastre uma oportunidade para conectar talentos e prestadores da região de Óbidos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitNewOp} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título da Oportunidade *
              </label>
              <Input
                required
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Desenvolvedor Web, Eletricista Predial, Piloto Fluvial..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Empresa / Cooperativa
                </label>
                <Input
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  placeholder="Nome do negócio ou cooperativa"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Salário ou Remuneração
                </label>
                <Input
                  value={formData.salario}
                  onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                  placeholder="Ex: R$ 4.500,00 ou Por hora"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo</label>
                <Select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                >
                  <option value="emprego">Emprego</option>
                  <option value="freelance">Freelance</option>
                  <option value="projeto">Projeto</option>
                  <option value="servico">Serviço</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Modalidade</label>
                <Select
                  value={formData.modalidade}
                  onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                >
                  <option value="presencial">Presencial</option>
                  <option value="remoto">Remoto</option>
                  <option value="hibrido">Híbrido</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contrato</label>
                <Input
                  value={formData.tipo_contrato}
                  onChange={(e) => setFormData({ ...formData, tipo_contrato: e.target.value })}
                  placeholder="CLT, PJ, Temporário"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria</label>
                <Input
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  placeholder="Ex: Tecnologia, Logística, Agronomia"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Localização</label>
                <Input
                  value={formData.localizacao}
                  onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                  placeholder="Ex: Centro de Óbidos, PA"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição Completa</label>
              <Textarea
                rows={3}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Detalhes das responsabilidades e objetivos da vaga..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Requisitos (separados por vírgula)
              </label>
              <Input
                value={formData.requisitos}
                onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                placeholder="Ex: React, Node.js, Inglês básico, Residir em Óbidos"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Benefícios (separados por vírgula)
              </label>
              <Input
                value={formData.beneficios}
                onChange={(e) => setFormData({ ...formData, beneficios: e.target.value })}
                placeholder="Ex: Vale Alimentação, Auxílio Conectividade, Seguro"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
                {createMutation.isPending ? 'Publicando...' : 'Publicar Vaga'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Formulário de Envio de Candidatura */}
      <Dialog open={!!applyingOp} onOpenChange={(open) => !open && setApplyingOp(null)}>
        {applyingOp && (
          <DialogContent onClose={() => setApplyingOp(null)}>
            <DialogHeader>
              <DialogTitle>Candidatar-se à Oportunidade</DialogTitle>
              <DialogDescription>
                Você está enviando seu perfil profissional para a oportunidade selecionada.
              </DialogDescription>
            </DialogHeader>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 my-2">
              <h4 className="font-bold text-slate-900 text-sm">{applyingOp.titulo}</h4>
              <p className="text-xs text-blue-700 font-medium mt-0.5">{applyingOp.empresa}</p>
              <p className="text-xs text-slate-500 mt-1">
                {applyingOp.localizacao} · {applyingOp.modalidade} · Remuneração: {applyingOp.salario || 'A combinar'}
              </p>
            </div>

            <form onSubmit={handleConfirmApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mensagem de Apresentação (Opcional)
                </label>
                <Textarea
                  rows={4}
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  placeholder="Explique por que você tem o perfil ideal para esta vaga ou destaque suas experiências relevantes..."
                />
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                Seus dados de contato (<strong>{user?.nome}</strong>, {user?.email}) e currículo cadastrado serão disponibilizados diretamente para a empresa.
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setApplyingOp(null)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={applyMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {applyMutation.isPending ? 'Enviando...' : 'Confirmar Candidatura'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>

      {/* Modal 3: Gerenciamento de Candidatos da Vaga (Painel Empresa) */}
      <Dialog
        open={!!viewingApplicantsOp}
        onOpenChange={(open) => !open && setViewingApplicantsOp(null)}
      >
        {viewingApplicantsOp && (
          <DialogContent onClose={() => setViewingApplicantsOp(null)} className="max-w-3xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <DialogTitle>Gestão de Candidatos Inscritos</DialogTitle>
              </div>
              <DialogDescription>
                Processo seletivo para a oportunidade: <strong>{viewingApplicantsOp.titulo}</strong>
              </DialogDescription>
            </DialogHeader>

            {/* Filtros de Status dos Candidatos */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-b border-slate-100 pb-3">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'pendente', label: 'Pendentes' },
                { id: 'em_analise', label: 'Em Análise' },
                { id: 'entrevista', label: 'Entrevistas' },
                { id: 'aprovado', label: 'Aprovados' },
                { id: 'reprovado', label: 'Reprovados' },
              ].map((tab) => {
                const count =
                  tab.id === 'todos'
                    ? candidatosVaga.length
                    : candidatosVaga.filter((c) => c.status === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setApplicantFilter(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      applicantFilter === tab.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label} ({count})
                  </button>
                );
              })}
            </div>

            <div className="mt-3 space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              {loadingCandidatos ? (
                <div className="py-12 text-center text-slate-500 text-xs">Carregando candidatos da vaga...</div>
              ) : candidatosVaga.length === 0 ? (
                <div className="py-12 text-center border border-dashed rounded-xl bg-slate-50">
                  <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Ainda não há inscritos nesta oportunidade.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Novas candidaturas da comunidade de Óbidos aparecerão aqui automaticamente.
                  </p>
                </div>
              ) : (
                candidatosVaga
                  .filter((c) => applicantFilter === 'todos' || c.status === applicantFilter)
                  .map((candidatura) => {
                    const whatsappUrl = getWhatsAppLink(
                      candidatura.candidato_telefone,
                      `Olá ${candidatura.candidato_nome}, sou da equipe da vaga "${viewingApplicantsOp.titulo}" no Óbidos Conect e gostaria de conversar sobre seu perfil!`
                    );
                    const sala = candidatura.sala_entrevista_id;

                    return (
                      <div
                        key={candidatura._id}
                        className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3 hover:border-blue-200 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                {candidatura.candidato_nome}
                              </span>
                              {getStatusBadge(candidatura.status)}
                            </div>
                            <p className="text-xs text-blue-700 font-medium">
                              {candidatura.candidato_profissao || 'Profissional Regional'}
                            </p>
                          </div>

                          {/* Ações Rápidas */}
                          <div className="flex flex-wrap items-center gap-2">
                            {whatsappUrl && (
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                WhatsApp
                              </a>
                            )}

                            {!sala && candidatura.status !== 'reprovado' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  scheduleInterviewMutation.mutate({ id: candidatura._id })
                                }
                                disabled={scheduleInterviewMutation.isPending}
                                className="text-xs gap-1 text-purple-700 border-purple-200 hover:bg-purple-50"
                              >
                                <Video className="w-3.5 h-3.5 text-purple-600" />
                                Agendar Entrevista
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Contatos */}
                        <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1 border-t border-slate-100">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {candidatura.candidato_email}
                          </span>
                          {candidatura.candidato_telefone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {candidatura.candidato_telefone}
                            </span>
                          )}
                        </div>

                        {/* Sala Virtual se Agendada */}
                        {sala && (
                          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs text-purple-900">
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4 text-purple-700 shrink-0" />
                              <span>
                                Entrevista Virtual: {new Date(sala.data_agendada).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                              </span>
                            </div>
                            <a
                              href={sala.link_reuniao}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-purple-700 font-bold hover:underline"
                            >
                              Abrir Sala Jitsi <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {/* Mensagem do Candidato */}
                        {candidatura.mensagem && (
                          <div className="p-2.5 rounded-lg bg-slate-50 text-xs text-slate-700 italic border border-slate-100">
                            "{candidatura.mensagem}"
                          </div>
                        )}

                        {/* Alteração de Etapa do Processo Seletivo */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <span className="text-slate-500 font-medium">Mover etapa seletiva:</span>
                          <select
                            value={candidatura.status}
                            onChange={(e) =>
                              updateStatusMutation.mutate({
                                id: candidatura._id,
                                status: e.target.value,
                              })
                            }
                            className="text-xs font-semibold rounded-lg border border-slate-300 py-1.5 px-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="pendente">1. Pendente</option>
                            <option value="em_analise">2. Em Análise</option>
                            <option value="entrevista">3. Entrevista Agendada</option>
                            <option value="aprovado">4. Aprovado</option>
                            <option value="reprovado">5. Reprovado</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
