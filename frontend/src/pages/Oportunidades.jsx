// frontend/src/pages/Oportunidades.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  DollarSign,
  MessageCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Filter,
  Layers
} from 'lucide-react';
import { oportunidadesApi } from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// Categorias oficiais de serviços de Óbidos/PA
const CATEGORIAS_OFICIAIS = [
  'Todas',
  'Obras, Reformas e Manutenção Residencial',
  'Reparos Técnicos e Instalações Mecânicas',
  'Estética, Cuidados Pessoais e Beleza',
  'Fretes, Mudanças e Transporte Municipal',
  'Tecnologia da Informação e Serviços Digitais',
  'Outros Serviços e Ofícios Manuais'
];

const BAIRROS_OBIDOS = [
  'Centro',
  'Santa Terezinha',
  'São Francisco',
  'Fátima',
  'Cidade Nova',
  'Laguinho',
  'Vila União',
  'Zona Rural / Comunidades'
];

export default function Oportunidades() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [modalAberto, setModalAberto] = useState(false);
  const [sucessoMsg, setSucessoMsg] = useState('');

  // Estado do formulário de nova demanda
  const [novaDemanda, setNovaDemanda] = useState({
    titulo: '',
    descricao: '',
    categoria: CATEGORIAS_OFICIAIS[1],
    bairro: 'Centro',
    orcamentoPrevisto: '',
    contatoPreferencial: '',
  });

  // Consulta das oportunidades ativas
  const { data: oportunidades = [], isLoading, isError } = useQuery({
    queryKey: ['oportunidades', { busca, categoria: categoriaAtiva }],
    queryFn: () =>
      oportunidadesApi.getAll({
        search: busca || undefined,
        categoria: categoriaAtiva !== 'Todas' ? categoriaAtiva : undefined,
      }),
  });

  // Mutação para criação de nova solicitação de serviço
  const criarDemandaMutation = useMutation({
    mutationFn: (dados) => oportunidadesApi.create(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oportunidades'] });
      setModalAberto(false);
      setNovaDemanda({
        titulo: '',
        descricao: '',
        categoria: CATEGORIAS_OFICIAIS[1],
        bairro: 'Centro',
        orcamentoPrevisto: '',
        contatoPreferencial: '',
      });
      setSucessoMsg('Demanda publicada com sucesso no mural municipal!');
      setTimeout(() => setSucessoMsg(''), 4000);
    },
  });

  // Mutação para exclusão de demanda pelo próprio autor
  const removerDemandaMutation = useMutation({
    mutationFn: (id) => oportunidadesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oportunidades'] });
    },
  });

  const handleAbrirModal = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    // Pré-preenche o telefone comercial/contato com o do perfil autenticado
    setNovaDemanda((prev) => ({
      ...prev,
      contatoPreferencial: user?.telefone || '',
    }));
    setModalAberto(true);
  };

  const handleSubmeterDemanda = (e) => {
    e.preventDefault();
    criarDemandaMutation.mutate({
      ...novaDemanda,
      orcamentoPrevisto: novaDemanda.orcamentoPrevisto
        ? Number(novaDemanda.orcamentoPrevisto)
        : null,
      localizacao: `Bairro ${novaDemanda.bairro}, Óbidos/PA`,
      tipo: 'servico',
      status: 'aberta',
    });
  };

  const handleWhatsAppDemanda = (telefone, titulo) => {
    if (!telefone) return;
    const numLimpo = telefone.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Olá! Vi sua solicitação de serviço "${titulo}" no mural do Óbidos Conect e gostaria de passar um orçamento.`
    );
    window.open(`https://wa.me/55${numLimpo}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto px-2 sm:px-4">
      {/* Banner Superior do Mural */}
      <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Mural de Demandas e Oportunidades Locais
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-2xl">
              Consulte solicitações de serviços temporários ou publique sua necessidade para receber orçamentos de profissionais de Óbidos.
            </p>
          </div>
          <Button
            onClick={handleAbrirModal}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl gap-2 font-semibold shadow-sm h-11 px-5 whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            Publicar Nova Demanda
          </Button>
        </div>

        {/* Campo de Busca Rápida */}
        <div className="mt-6 relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar demandas por descrição (ex: ar-condicionado, pintura, frete)..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 h-11 bg-white text-slate-900 border-0 focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl"
          />
        </div>
      </div>

      {/* Alerta de Confirmação */}
      {sucessoMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{sucessoMsg}</span>
        </div>
      )}

      {/* Navegação por Categorias */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          <Filter className="w-3.5 h-3.5" />
          Filtrar por Categoria
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIAS_OFICIAIS.map((cat) => {
            const isSelected = categoriaAtiva === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Indicadores de Carregamento e Falha */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-emerald-600 mb-3" />
          <p className="text-slate-500 text-sm">Carregando solicitações de serviços...</p>
        </div>
      )}

      {isError && (
        <div className="p-6 bg-red-50 rounded-xl border border-red-200 flex items-center gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Erro ao carregar oportunidades de trabalho. Verifique sua conexão com o servidor.</span>
        </div>
      )}

      {/* Listagem em Grade dos Cartões de Demandas */}
      {!isLoading && !isError && (
        <>
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>{oportunidades.length} demanda(s) encontrada(s)</span>
          </div>

          {oportunidades.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-700">Nenhuma solicitação em aberto</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Não há demandas ativas para o filtro selecionado. Seja o primeiro a publicar sua necessidade!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {oportunidades.map((op) => {
                const ehAutor = user && (op.usuario_id === user._id || op.contratante === user._id);
                return (
                  <Card
                    key={op._id}
                    className="border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between rounded-2xl bg-white overflow-hidden"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <CardTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            {op.titulo}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {op.bairro ? `Bairro ${op.bairro}` : 'Óbidos/PA'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(op.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>

                        {ehAutor && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removerDemandaMutation.mutate(op._id)}
                            className="text-slate-400 hover:text-red-600 p-1.5 h-auto rounded-lg"
                            title="Excluir minha solicitação"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pb-4">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {op.descricao}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[11px] font-normal">
                          {op.categoria}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <DollarSign className="w-3 h-3 text-emerald-600" />
                          {op.orcamentoPrevisto
                            ? `Orçamento: R$ ${Number(op.orcamentoPrevisto).toFixed(2)}`
                            : 'Orçamento a combinar'}
                        </Badge>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2 pb-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Button
                        onClick={() =>
                          handleWhatsAppDemanda(
                            op.contatoPreferencial || op.telefone,
                            op.titulo
                          )
                        }
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 flex items-center justify-center gap-2 font-medium text-xs sm:text-sm shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Negociar Orçamento no WhatsApp
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal / Diálogo de Publicação de Demanda */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-lg rounded-2xl bg-white p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Publicar Solicitação de Serviço
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500">
              Descreva sua necessidade com clareza para que profissionais autônomos de Óbidos entrem em contato diretamente.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmeterDemanda} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título do Serviço
              </label>
              <Input
                type="text"
                required
                placeholder="Ex: Instalação de ar-condicionado split 12.000 BTUs"
                value={novaDemanda.titulo}
                onChange={(e) =>
                  setNovaDemanda({ ...novaDemanda, titulo: e.target.value })
                }
                className="rounded-xl border-slate-200 text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoria
                </label>
                <select
                  value={novaDemanda.categoria}
                  onChange={(e) =>
                    setNovaDemanda({ ...novaDemanda, categoria: e.target.value })
                  }
                  className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                >
                  {CATEGORIAS_OFICIAIS.filter((c) => c !== 'Todas').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bairro do Atendimento
                </label>
                <select
                  value={novaDemanda.bairro}
                  onChange={(e) =>
                    setNovaDemanda({ ...novaDemanda, bairro: e.target.value })
                  }
                  className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                >
                  {BAIRROS_OBIDOS.map((b) => (
                    <option key={b} value={b}>
                      Bairro {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descrição Detalhada do Serviço
              </label>
              <Textarea
                required
                rows={3}
                placeholder="Informe o que precisa ser feito, restrições de horário e detalhes práticos..."
                value={novaDemanda.descricao}
                onChange={(e) =>
                  setNovaDemanda({ ...novaDemanda, descricao: e.target.value })
                }
                className="rounded-xl border-slate-200 text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Orçamento Previsto (R$)
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 250 (ou deixe vazio)"
                  value={novaDemanda.orcamentoPrevisto}
                  onChange={(e) =>
                    setNovaDemanda({
                      ...novaDemanda,
                      orcamentoPrevisto: e.target.value,
                    })
                  }
                  className="rounded-xl border-slate-200 text-xs sm:text-sm"
                />
                <span className="text-[10px] text-slate-400">Deixe em branco para valor a combinar.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp para Contato Direto
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Ex: 93991234567"
                  value={novaDemanda.contatoPreferencial}
                  onChange={(e) =>
                    setNovaDemanda({
                      ...novaDemanda,
                      contatoPreferencial: e.target.value,
                    })
                  }
                  className="rounded-xl border-slate-200 text-xs sm:text-sm"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalAberto(false)}
                className="w-full sm:w-auto rounded-xl text-xs sm:text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={criarDemandaMutation.isPending}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm shadow-sm"
              >
                {criarDemandaMutation.isPending ? 'Publicando...' : 'Publicar Solicitação'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
