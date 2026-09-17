import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Video,
  Plus,
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  AlertCircle,
  Building2,
  User,
} from 'lucide-react';
import { entrevistasApi } from '@/api/api';
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

const statusVariants = {
  agendada: { label: 'Agendada', variant: 'warning' },
  em_andamento: { label: 'Em Andamento', variant: 'purple' },
  finalizada: { label: 'Finalizada', variant: 'success' },
  cancelada: { label: 'Cancelada', variant: 'danger' },
};

export default function Entrevistas() {
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    titulo: '',
    candidato_nome: '',
    empresa_nome: '',
    data_agendada: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    duracao_minutos: 45,
    link_reuniao: 'https://meet.jit.si/obidos-connect-' + Math.floor(Math.random() * 10000),
    status: 'agendada',
    observacoes: '',
  };

  const [form, setForm] = useState(initialForm);

  // React Query
  const { data: entrevistas = [], isLoading, isError, error } = useQuery({
    queryKey: ['entrevistas'],
    queryFn: () => entrevistasApi.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => entrevistasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entrevistas'] });
      setIsModalOpen(false);
      setForm(initialForm);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => entrevistasApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entrevistas'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => entrevistasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entrevistas'] });
    },
  });

  const handleCopyLink = (id, link) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;

    createMutation.mutate({
      ...form,
      duracao_minutos: Number(form.duracao_minutos),
    });
  };

  const formatDatePtBR = (dateStr) => {
    if (!dateStr) return 'Não definida';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Data inválida';

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Salas de Entrevista & Alinhamentos
          </h1>
          <p className="text-sm text-slate-500">
            Agende reuniões virtuais de seleção ou alinhamento de projetos com candidatos e clientes.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Agendar Entrevista
        </Button>
      </div>

      {/* Lista de Entrevistas */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-500 text-sm">Carregando salas agendadas...</div>
      ) : isError ? (
        <div className="py-8 text-center text-red-500 text-sm flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Erro ao carregar entrevistas: {error?.message}
        </div>
      ) : entrevistas.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-300 rounded-2xl bg-white/50">
          <Video className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Nenhuma entrevista agendada</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Clique no botão acima para agendar um alinhamento virtual com link direto.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {entrevistas.map((sala) => {
            const statusConfig = statusVariants[sala.status] || {
              label: sala.status,
              variant: 'secondary',
            };

            return (
              <Card
                key={sala._id}
                className="flex flex-col justify-between border-slate-200/80 bg-white shadow-sm hover:border-blue-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {/* Badge de status */}
                      <Badge variant={statusConfig.variant} className="capitalize text-xs font-semibold mb-2">
                        {statusConfig.label}
                      </Badge>
                      <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                        {sala.titulo}
                      </CardTitle>
                    </div>

                    <button
                      onClick={() => deleteMutation.mutate(sala._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Excluir entrevista"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-xs text-slate-600 pb-3">
                  {/* Participantes */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <User className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{sala.candidato_nome || 'Candidato'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700 justify-end">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{sala.empresa_nome || 'Contratante'}</span>
                    </div>
                  </div>

                  {/* Data Formatada pt-BR */}
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-blue-50/50 border border-blue-100/60 text-blue-900">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
                      <span className="font-semibold">{formatDatePtBR(sala.data_agendada)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{sala.duracao_minutos} min</span>
                    </div>
                  </div>

                  {/* Observações */}
                  {sala.observacoes && (
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                      <span className="font-semibold text-slate-700">Pauta:</span> {sala.observacoes}
                    </p>
                  )}

                  {/* Link da Reunião */}
                  {sala.link_reuniao && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        readOnly
                        value={sala.link_reuniao}
                        className="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 truncate focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyLink(sala._id, sala.link_reuniao)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                        title="Copiar link"
                      >
                        {copiedId === sala._id ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {/* Status update rápido */}
                  <div className="flex items-center gap-1">
                    {sala.status === 'agendada' && (
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({ id: sala._id, status: 'em_andamento' })
                        }
                        className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 text-[11px] font-medium"
                      >
                        Iniciar Reunião
                      </button>
                    )}
                    {sala.status === 'em_andamento' && (
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({ id: sala._id, status: 'finalizada' })
                        }
                        className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-medium"
                      >
                        Finalizar
                      </button>
                    )}
                  </div>

                  {sala.link_reuniao && (
                    <a
                      href={sala.link_reuniao}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      Acessar Sala <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Agendamento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent onClose={() => setIsModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Agendar Nova Entrevista</DialogTitle>
            <DialogDescription>
              Crie uma sala virtual com data e horário para entrevista profissional ou alinhamento.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título do Alinhamento *
              </label>
              <Input
                required
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex: Entrevista Técnica - Desenvolvedor Web"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Candidato / Profissional
                </label>
                <Input
                  value={form.candidato_nome}
                  onChange={(e) => setForm({ ...form, candidato_nome: e.target.value })}
                  placeholder="Nome do entrevistado"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Empresa / Solicitante
                </label>
                <Input
                  value={form.empresa_nome}
                  onChange={(e) => setForm({ ...form, empresa_nome: e.target.value })}
                  placeholder="Nome da empresa contratante"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Data e Horário *
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={form.data_agendada}
                  onChange={(e) => setForm({ ...form, data_agendada: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duração Estimada (minutos)
                </label>
                <Input
                  type="number"
                  value={form.duracao_minutos}
                  onChange={(e) => setForm({ ...form, duracao_minutos: e.target.value })}
                  placeholder="45"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Link da Reunião (Jitsi Meet, Google Meet, Zoom)
              </label>
              <Input
                value={form.link_reuniao}
                onChange={(e) => setForm({ ...form, link_reuniao: e.target.value })}
                placeholder="https://meet.jit.si/sua-sala"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pauta & Observações
              </label>
              <Textarea
                rows={3}
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                placeholder="Tópicos que serão abordados na entrevista..."
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Agendando...' : 'Confirmar Agendamento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
