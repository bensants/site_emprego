import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { curriculosApi } from '@/api/api';
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

export default function Curriculos() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    titulo: '',
    nome_candidato: '',
    email: '',
    telefone: '',
    cidade: 'Óbidos',
    estado: 'PA',
    resumo_profissional: '',
    habilidades: '',
    visibilidade: 'publico',
    // Uma experiência padrão simplificada
    exp_empresa: '',
    exp_cargo: '',
    exp_periodo: '',
    exp_descricao: '',
    // Uma formação padrão
    form_instituicao: '',
    form_curso: '',
    form_periodo: '',
  };

  const [form, setForm] = useState(initialForm);

  // Queries
  const { data: curriculos = [], isLoading, isError, error } = useQuery({
    queryKey: ['curriculos-admin'],
    queryFn: () => curriculosApi.getAll(),
  });

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editingId) {
        return curriculosApi.update(editingId, data);
      }
      return curriculosApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculos-admin'] });
      queryClient.invalidateQueries({ queryKey: ['curriculos'] });
      queryClient.invalidateQueries({ queryKey: ['buscar-curriculos'] });
      setIsModalOpen(false);
      setEditingId(null);
      setForm(initialForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => curriculosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculos-admin'] });
      queryClient.invalidateQueries({ queryKey: ['curriculos'] });
      queryClient.invalidateQueries({ queryKey: ['buscar-curriculos'] });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, current }) => {
      const next = current === 'publico' ? 'privado' : 'publico';
      return curriculosApi.update(id, { visibilidade: next });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculos-admin'] });
      queryClient.invalidateQueries({ queryKey: ['curriculos'] });
      queryClient.invalidateQueries({ queryKey: ['buscar-curriculos'] });
    },
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (curr) => {
    setEditingId(curr._id);
    const exp = curr.experiencias?.[0] || {};
    const formac = curr.formacao?.[0] || {};
    setForm({
      titulo: curr.titulo || '',
      nome_candidato: curr.nome_candidato || '',
      email: curr.email || '',
      telefone: curr.telefone || '',
      cidade: curr.cidade || 'Óbidos',
      estado: curr.estado || 'PA',
      resumo_profissional: curr.resumo_profissional || '',
      habilidades: curr.habilidades?.join(', ') || '',
      visibilidade: curr.visibilidade || 'publico',
      exp_empresa: exp.empresa || '',
      exp_cargo: exp.cargo || '',
      exp_periodo: exp.periodo || '',
      exp_descricao: exp.descricao || '',
      form_instituicao: formac.instituicao || '',
      form_curso: formac.curso || '',
      form_periodo: formac.periodo || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;

    const payload = {
      titulo: form.titulo,
      nome_candidato: form.nome_candidato || 'Profissional de Óbidos',
      email: form.email,
      telefone: form.telefone,
      cidade: form.cidade,
      estado: form.estado,
      resumo_profissional: form.resumo_profissional,
      visibilidade: form.visibilidade,
      habilidades: form.habilidades
        ? form.habilidades.split(',').map((h) => h.trim()).filter(Boolean)
        : [],
      experiencias: form.exp_empresa
        ? [
            {
              empresa: form.exp_empresa,
              cargo: form.exp_cargo,
              periodo: form.exp_periodo,
              descricao: form.exp_descricao,
            },
          ]
        : [],
      formacao: form.form_curso
        ? [
            {
              instituicao: form.form_instituicao,
              curso: form.form_curso,
              periodo: form.form_periodo,
            },
          ]
        : [],
    };

    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gerenciamento de Currículos
          </h1>
          <p className="text-sm text-slate-500">
            Cadastre e atualize suas experiências e competências para ser contratado localmente.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Novo Currículo
        </Button>
      </div>

      {/* Lista / Grid de Currículos */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-500 text-sm">Carregando currículos...</div>
      ) : isError ? (
        <div className="py-8 text-center text-red-500 text-sm flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Erro ao carregar currículos: {error?.message}
        </div>
      ) : curriculos.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-300 rounded-2xl bg-white/50">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Nenhum currículo cadastrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Cadastre seu perfil profissional para ser encontrado por contratantes de Óbidos e do Pará.
          </p>
          <Button onClick={handleOpenCreate} size="sm" className="mt-4 gap-2">
            <Plus className="h-4 w-4" /> Criar Primeiro Currículo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {curriculos.map((curr) => (
            <Card
              key={curr._id}
              className="flex flex-col justify-between border-slate-200/80 bg-white shadow-sm hover:border-blue-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge
                        variant={curr.visibilidade === 'publico' ? 'default' : 'secondary'}
                        className="text-xs font-semibold"
                      >
                        {curr.visibilidade === 'publico' ? 'Visibilidade Pública' : 'Privado'}
                      </Badge>
                      <span className="text-[11px] text-slate-400">
                        {curr.cidade}, {curr.estado}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {curr.titulo}
                    </CardTitle>
                    <p className="text-xs font-semibold text-blue-700 mt-0.5">
                      {curr.nome_candidato}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        toggleVisibilityMutation.mutate({
                          id: curr._id,
                          current: curr.visibilidade,
                        })
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title={curr.visibilidade === 'publico' ? 'Tornar Privado' : 'Tornar Público'}
                    >
                      {curr.visibilidade === 'publico' ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(curr)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(curr._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-xs text-slate-600 pb-3">
                <p className="line-clamp-2 text-slate-600 leading-relaxed">
                  {curr.resumo_profissional || 'Nenhum resumo adicionado.'}
                </p>

                {/* Habilidades */}
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Habilidades:</span>
                  <div className="flex flex-wrap gap-1">
                    {curr.habilidades?.map((h, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px]"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Detalhes de contato */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-3 text-[11px] text-slate-500">
                  {curr.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-slate-400" /> {curr.email}
                    </span>
                  )}
                  {curr.telefone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" /> {curr.telefone}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {curr.experiencias?.length || 0} experiência(s) · {curr.formacao?.length || 0} formação(ões)
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEdit(curr)}
                  className="text-xs"
                >
                  Editar Dados
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal CRUD com Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent onClose={() => setIsModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar Currículo' : 'Cadastrar Novo Currículo'}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados profissionais para divulgação regional em Óbidos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título Profissional *
                </label>
                <Input
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ex: Engenheiro de Software, Agrônomo"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo
                </label>
                <Input
                  value={form.nome_candidato}
                  onChange={(e) => setForm({ ...form, nome_candidato: e.target.value })}
                  placeholder="Seu nome ou Razão Social"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="contato@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp</label>
                <Input
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  placeholder="(93) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Visibilidade</label>
                <Select
                  value={form.visibilidade}
                  onChange={(e) => setForm({ ...form, visibilidade: e.target.value })}
                >
                  <option value="publico">Público (visível em Buscar)</option>
                  <option value="privado">Privado</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resumo Profissional
              </label>
              <Textarea
                rows={2}
                value={form.resumo_profissional}
                onChange={(e) => setForm({ ...form, resumo_profissional: e.target.value })}
                placeholder="Apresente sua trajetória, principais realizações e foco de atuação..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Habilidades (separadas por vírgula) *
              </label>
              <Input
                value={form.habilidades}
                onChange={(e) => setForm({ ...form, habilidades: e.target.value })}
                placeholder="Ex: React, Node.js, Logística Fluvial, Vendas, Excel Avançado"
              />
            </div>

            {/* Seção de Experiência Recente */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-blue-600" /> Experiência Recente
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="Empresa"
                  value={form.exp_empresa}
                  onChange={(e) => setForm({ ...form, exp_empresa: e.target.value })}
                />
                <Input
                  placeholder="Cargo"
                  value={form.exp_cargo}
                  onChange={(e) => setForm({ ...form, exp_cargo: e.target.value })}
                />
                <Input
                  placeholder="Período (Ex: 2022 - Atual)"
                  value={form.exp_periodo}
                  onChange={(e) => setForm({ ...form, exp_periodo: e.target.value })}
                />
              </div>
              <Input
                placeholder="Breve descrição das atividades"
                value={form.exp_descricao}
                onChange={(e) => setForm({ ...form, exp_descricao: e.target.value })}
              />
            </div>

            {/* Seção de Formação */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <span className="text-xs font-bold text-slate-800">Formação Acadêmica</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="Instituição (Ex: UFOPA, IFPA)"
                  value={form.form_instituicao}
                  onChange={(e) => setForm({ ...form, form_instituicao: e.target.value })}
                />
                <Input
                  placeholder="Curso"
                  value={form.form_curso}
                  onChange={(e) => setForm({ ...form, form_curso: e.target.value })}
                />
                <Input
                  placeholder="Período (Ex: 2018 - 2022)"
                  value={form.form_periodo}
                  onChange={(e) => setForm({ ...form, form_periodo: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Salvando...' : editingId ? 'Atualizar' : 'Salvar Currículo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
