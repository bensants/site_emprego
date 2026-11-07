// frontend/src/pages/BuscarProfissionais.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  MessageCircle,
  Briefcase,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Phone
} from 'lucide-react';
import { prestadoresApi } from '@/api/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Categorias oficiais parametrizadas para Óbidos/PA
const CATEGORIAS = [
  'Todas',
  'Obras, Reformas e Manutenção Residencial',
  'Reparos Técnicos e Instalações Mecânicas',
  'Estética, Cuidados Pessoais e Beleza',
  'Fretes, Mudanças e Transporte Municipal',
  'Tecnologia da Informação e Serviços Digitais',
];

export default function BuscarProfissionais() {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [bairroFiltro, setBairroFiltro] = useState('');

  // Consulta assíncrona consumindo o endpoint /api/prestadores
  const { data: prestadores = [], isLoading, isError } = useQuery({
    queryKey: ['prestadores', { busca, categoria: categoriaAtiva, bairro: bairroFiltro }],
    queryFn: () =>
      prestadoresApi.getAll({
        busca: busca || undefined,
        categoria: categoriaAtiva !== 'Todas' ? categoriaAtiva : undefined,
        bairro: bairroFiltro || undefined,
      }),
  });

  // Função utilitária para acionamento direto via WhatsApp
  const handleChamarWhatsApp = (telefone, nomeProfissional, nomeComercial) => {
    if (!telefone) return;
    const numeroLimpo = telefone.replace(/\D/g, '');
    const destinatario = nomeComercial || nomeProfissional;
    const mensagem = encodeURIComponent(
      `Olá ${destinatario}, encontrei seu perfil no Óbidos Conect e gostaria de solicitar um orçamento.`
    );
    window.open(`https://wa.me/55${numeroLimpo}?text=${mensagem}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto px-2 sm:px-4">
      {/* Cabeçalho Operacional */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Vitrine de Profissionais e Serviços em Óbidos
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
          Contrate pedreiros, eletricistas, mecânicos, fretes e autônomos locais sem intermediários ou taxas.
        </p>

        {/* Barra de Pesquisa */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Pesquisar por nome, serviço ou palavra-chave..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 h-11 bg-white text-slate-900 border-0 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
            />
          </div>
          <div className="relative w-full sm:w-64">
            <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Filtrar por Bairro..."
              value={bairroFiltro}
              onChange={(e) => setBairroFiltro(e.target.value)}
              className="pl-10 h-11 bg-white text-slate-900 border-0 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Barra de Filtros por Categoria (Scroll horizontal otimizado para Mobile) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filtrar por Ofício
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIAS.map((cat) => {
            const isSelected = categoriaAtiva === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Indicadores de Estado da Consulta */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-emerald-600 mb-3" />
          <p className="text-slate-500 text-sm">Carregando profissionais disponíveis em Óbidos...</p>
        </div>
      )}

      {isError && (
        <div className="p-6 bg-red-50 rounded-xl border border-red-200 flex items-center gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">
            Não foi possível carregar a lista de profissionais. Verifique a conexão com o servidor.
          </p>
        </div>
      )}

      {/* Grid de Cartões dos Prestadores */}
      {!isLoading && !isError && (
        <>
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>{prestadores.length} profissional(is) cadastrado(s)</span>
          </div>

          {prestadores.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-700">Nenhum profissional localizado</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Não encontramos prestadores para o filtro selecionado. Tente buscar por outros termos ou categorias.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {prestadores.map((prestador) => (
                <Card
                  key={prestador._id}
                  className="border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between rounded-2xl overflow-hidden bg-white"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {prestador.nomeComercial || prestador.nome}
                        </CardTitle>
                        <p className="text-xs font-medium text-emerald-700 mt-0.5">
                          {prestador.profissao || 'Prestador Autônomo'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-amber-700 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{prestador.mediaAvaliacoes?.toFixed(1) || '5.0'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Bairro {prestador.bairro || 'Centro'} • Óbidos/PA
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-4">
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {prestador.bio || 'Profissional autônomo atuante no município de Óbidos. Entre em contato para consultas e orçamentos.'}
                    </p>

                    <div className="pt-1">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[11px] font-normal">
                        {prestador.categoria}
                      </Badge>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 pb-4 border-t border-slate-100">
                    <Button
                      onClick={() =>
                        handleChamarWhatsApp(
                          prestador.telefone,
                          prestador.nome,
                          prestador.nomeComercial
                        )
                      }
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 flex items-center justify-center gap-2 font-medium text-xs sm:text-sm shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Conversar no WhatsApp
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
