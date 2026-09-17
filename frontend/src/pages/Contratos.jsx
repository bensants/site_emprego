import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileSignature,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { contratosApi } from '@/api/api';
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

const statusDisplay = {
  proposta: { label: 'Proposta', variant: 'proposta' },
  aceito: { label: 'Aceito', variant: 'aceito' },
  em_andamento: { label: 'Em Andamento', variant: 'em_andamento' },
  finalizado: { label: 'Finalizado', variant: 'finalizado' },
  cancelado: { label: 'Cancelado', variant: 'cancelado' },
};

export default function Contratos() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    titulo: '',
    contratante_nome: '',
    contratado_nome: '',
    valor: '',
    forma_pagamento: 'Pix / Transferência',
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: '',
    escopo_trabalho: '',
    status: 'proposta',
    progresso: 0,
  };

  const [form, setForm] = useState(initialForm);

  // React Query
  const { data: contratos = [], isLoading, isError, error } = useQuery({
    queryKey: ['contratos', { status: statusFilter }],
    queryFn: () =>
      contratosApi.getAll({
        status: statusFilter !== 'todos' ? statusFilter : undefined,
      }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => contratosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      setIsModalOpen(false);
      setForm(initialForm);
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ id, progresso, status }) =>
      contratosApi.update(id, { progresso, ...(status ? { status } : {}) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => contratosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.valor) return;

    createMutation.mutate({
      ...form,
      valor: Number(form.valor),
      progresso: Number(form.progresso),
    });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Não definida';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Data inválida' : d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Contratos & Demandas Formais
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhe o ciclo de vida dos acordos de trabalho, valores, prazos e entregas em Óbidos.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Novo Contrato
        </Button>
      </div>

      {/* Filtros por Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-600 shrink-0 mr-1">Filtrar por:</span>
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'proposta', label: 'Proposta (Amarelo)' },
          { key: 'aceito', label: 'Aceito (Azul)' },
          { key: 'em_andamento', label: 'Em Andamento (Roxo)' },
          { key: 'finalizado', label: 'Finalizado (Verde)' },
          { key: 'cancelado', label: 'Cancelado (Vermelho)' },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setStatusFilter(item.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              statusFilter === item.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Grid de Cards de Contratos */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-500 text-sm">Carregando contratos...</div>
      ) : isError ? (
        <div className="py-8 text-center text-red-500 text-sm flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Erro ao carregar contratos: {error?.message}
        </div>
      ) : contratos.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-300 rounded-2xl bg-white/50">
          <FileSignature className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Nenhum contrato encontrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Formalize acordos comerciais e acompanhe o progresso de entregas clicando no botão acima.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {contratos.map((ct) => {
            const statusConfig = statusDisplay[ct.status] || {
              label: ct.status,
              variant: 'secondary',
            };

            return (
              <Card
                key={ct._id}
                className="flex flex-col justify-between border-slate-200/80 bg-white shadow-sm hover:border-blue-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {/* Badge Colorido Exato conforme especificado */}
                      <Badge variant={statusConfig.variant} className="text-xs font-bold mb-2">
                        {statusConfig.label}
                      </Badge>
                      <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                        {ct.titulo}
                      </CardTitle>
                    </div>

                    <button
                      onClick={() => deleteMutation.mutate(ct._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Excluir contrato"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3.5 text-xs text-slate-600 pb-3">
                  {/* Partes Envolvidas */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-600 block">
                        Contratante
                      </span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {ct.contratante_nome || 'Não informado'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-600 block">
                        Contratado
                      </span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {ct.contratado_nome || 'Não informado'}
                      </span>
                    </div>
                  </div>

                  {/* Escopo */}
                  {ct.escopo_trabalho && (
                    <p className="line-clamp-2 text-slate-600 leading-relaxed">
                      {ct.escopo_trabalho}
                    </p>
                  )}

                  {/* Valor e Prazos */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDate(ct.data_inicio)} até {formatDate(ct.data_fim)}</span>
                    </div>
                    <span className="text-sm font-bold text-blue-700">
                      {formatCurrency(ct.valor)}
                    </span>
                  </div>

                  {/* Barra de Progresso com Atualização Rápida */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-700">Progresso do Projeto</span>
                      <span className="font-bold text-blue-600">{ct.progresso || 0}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, ct.progresso || 0))}%` }}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {/* Atalho rápido para mudar status */}
                  <div className="flex items-center gap-1">
                    {ct.status !== 'finalizado' && (
                      <button
                        onClick={() =>
                          updateProgressMutation.mutate({
                            id: ct._id,
                            progresso: Math.min(100, (ct.progresso || 0) + 25),
                            status: (ct.progresso || 0) + 25 >= 100 ? 'finalizado' : 'em_andamento',
                          })
                        }
                        className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-medium"
                      >
                        +25% Progresso
                      </button>
                    )}
                    {ct.status === 'proposta' && (
                      <button
                        onClick={() =>
                          updateProgressMutation.mutate({
                            id: ct._id,
                            progresso: 10,
                            status: 'aceito',
                          })
                        }
                        className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-medium"
                      >
                        Aceitar Proposta
                      </button>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {ct.forma_pagamento || 'Pix'}
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Criação de Contrato com Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent onClose={() => setIsModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Novo Contrato de Prestação</DialogTitle>
            <DialogDescription>
              Formalize termos, prazos e remuneração com clareza e conformidade jurídica.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título do Contrato / Projeto *
              </label>
              <Input
                required
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex: Reforma Elétrica, Consultoria Contábil, App Mobile..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contratante (Empresa / Solicitante)
                </label>
                <Input
                  value={form.contratante_nome}
                  onChange={(e) => setForm({ ...form, contratante_nome: e.target.value })}
                  placeholder="Nome do contratante"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contratado (Profissional / Fornecedor)
                </label>
                <Input
                  value={form.contratado_nome}
                  onChange={(e) => setForm({ ...form, contratado_nome: e.target.value })}
                  placeholder="Nome do profissional"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Valor Total (R$) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: e.target.value })}
                  placeholder="Ex: 5000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Forma de Pagamento
                </label>
                <Input
                  value={form.forma_pagamento}
                  onChange={(e) => setForm({ ...form, forma_pagamento: e.target.value })}
                  placeholder="Ex: Pix, 50% entrada, Mensal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data Início</label>
                <Input
                  type="date"
                  value={form.data_inicio}
                  onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data Fim (Previsão)</label>
                <Input
                  type="date"
                  value={form.data_fim}
                  onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Inicial</label>
                <Select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="proposta">Proposta (Amarelo)</option>
                  <option value="aceito">Aceito (Azul)</option>
                  <option value="em_andamento">Em Andamento (Roxo)</option>
                  <option value="finalizado">Finalizado (Verde)</option>
                  <option value="cancelado">Cancelado (Vermelho)</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Progresso Inicial (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={form.progresso}
                  onChange={(e) => setForm({ ...form, progresso: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Escopo do Trabalho & Entregáveis
              </label>
              <Textarea
                rows={3}
                value={form.escopo_trabalho}
                onChange={(e) => setForm({ ...form, escopo_trabalho: e.target.value })}
                placeholder="Descreva as obrigações, prazos de entrega e critérios de aceitação..."
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
                {createMutation.isPending ? 'Criando...' : 'Formalizar Contrato'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
