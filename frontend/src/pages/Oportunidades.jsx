import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  Building2,
  DollarSign,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
} from 'lucide-react';
import { oportunidadesApi } from '@/api/api';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [modalidadeFilter, setModalidadeFilter] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(null);

  // Form State
  const initialFormState = {
    titulo: '',
    descricao: '',
    tipo: 'emprego',
    categoria: 'Tecnologia da Informação',
    salario: '',
    empresa: '',
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

  // Mutation: Criar Oportunidade
  const createMutation = useMutation({
    mutationFn: (newOportunidade) => oportunidadesApi.create(newOportunidade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oportunidades'] });
      setIsModalOpen(false);
      setFormData(initialFormState);
    },
  });

  // Mutation: Deletar Oportunidade
  const deleteMutation = useMutation({
    mutationFn: (id) => oportunidadesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oportunidades'] });
    },
  });

  const handleSubmit = (e) => {
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

  const handleApply = (oportunidade) => {
    setApplicationSuccess(oportunidade._id);
    setTimeout(() => {
      setApplicationSuccess(null);
    }, 4000);
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
            Vagas formais, freelances e demandas de projetos no município de Óbidos e região.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
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
            placeholder="Pesquisar por título, empresa ou palavra-chave..."
            className="pl-9"
          />
        </div>

        <div>
          <Select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
          >
            <option value="todos">Todos os Tipos</option>
            <option value="emprego">Emprego Formal</option>
            <option value="freelance">Freelance</option>
            <option value="projeto">Projeto Temporário</option>
            <option value="servico">Prestação de Serviço</option>
          </Select>
        </div>

        <div>
          <Select
            value={modalidadeFilter}
            onChange={(e) => setModalidadeFilter(e.target.value)}
          >
            <option value="todas">Todas Modalidades</option>
            <option value="presencial">Presencial em Óbidos</option>
            <option value="remoto">100% Remoto</option>
            <option value="hibrido">Híbrido</option>
          </Select>
        </div>
      </div>

      {/* Feedback de Candidatura */}
      {applicationSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Interesse registrado com sucesso! O contratante receberá sua notificação.</span>
        </div>
      )}

      {/* Grid de Cards (md:grid-cols-2) */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-500 text-sm">Carregando oportunidades...</div>
      ) : isError ? (
        <div className="py-8 text-center text-red-500 text-sm flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Erro ao carregar oportunidades: {error?.message}
        </div>
      ) : oportunidades.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-300 rounded-2xl bg-white/50">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Nenhuma oportunidade encontrada</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Tente ajustar os filtros de busca ou clique no botão acima para cadastrar a primeira demanda da sua empresa.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {oportunidades.map((op) => (
            <Card
              key={op._id}
              className="flex flex-col justify-between border-slate-200/80 bg-white shadow-sm hover:border-blue-300"
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
                      {op.empresa || 'Empresa Confidencial'}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteMutation.mutate(op._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Excluir oportunidade"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-xs text-slate-600 pb-3">
                <p className="line-clamp-3 text-slate-600 leading-relaxed">
                  {op.descricao}
                </p>

                {/* Localização e Salário */}
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

              <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Categoria: <span className="font-medium text-slate-600">{op.categoria || 'Geral'}</span>
                </span>
                <Button
                  size="sm"
                  onClick={() => handleApply(op)}
                  className="text-xs font-semibold"
                >
                  Candidatar-se
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Criação com Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent onClose={() => setIsModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Publicar Nova Oportunidade</DialogTitle>
            <DialogDescription>
              Cadastre uma oportunidade para conectar talentos e prestadores da região de Óbidos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título da Oportunidade *
              </label>
              <Input
                required
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Desenvolvedor Web, Eletricista Predial, Contador..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Empresa / Contratante</label>
                <Input
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  placeholder="Nome do negócio ou cooperativa"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Salário ou Remuneração</label>
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
                  placeholder="Ex: Tecnologia, Logística, Saúde"
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Publicando...' : 'Publicar Vaga'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
