import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  FileSignature,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  ShieldCheck,
  Video,
  FileText,
  Search,
} from 'lucide-react';
import { oportunidadesApi, curriculosApi, contratosApi, comunidadeApi } from '@/api/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  // Queries do React Query
  const { data: oportunidades = [], isLoading: loadingOportunidades } = useQuery({
    queryKey: ['oportunidades'],
    queryFn: () => oportunidadesApi.getAll(),
  });

  const { data: curriculos = [], isLoading: loadingCurriculos } = useQuery({
    queryKey: ['curriculos'],
    queryFn: () => curriculosApi.getAll({ visibilidade: 'publico' }),
  });

  const { data: contratos = [], isLoading: loadingContratos } = useQuery({
    queryKey: ['contratos'],
    queryFn: () => contratosApi.getAll(),
  });

  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['comunidade'],
    queryFn: () => comunidadeApi.getAll(),
  });

  // Estatísticas calculadas
  const totalOportunidades = oportunidades.length;
  const totalTalentos = curriculos.length;
  const totalContratosAtivos = contratos.filter(
    (c) => c.status === 'em_andamento' || c.status === 'aceito'
  ).length;
  const totalPosts = posts.length;

  const quickAccessItems = [
    {
      title: 'Ver Oportunidades',
      desc: 'Encontre vagas e demandas de serviços em Óbidos',
      icon: Briefcase,
      link: '/oportunidades',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Buscar Talentos',
      desc: 'Pesquise currículos públicos da região',
      icon: Search,
      link: '/buscar',
      gradient: 'from-sky-500 to-blue-600',
    },
    {
      title: 'Cadastrar Currículo',
      desc: 'Divulgue suas habilidades profissionais',
      icon: FileText,
      link: '/curriculos',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      title: 'Gerenciar Contratos',
      desc: 'Acompanhe propostas e prazos de entrega',
      icon: FileSignature,
      link: '/contratos',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Fórum da Comunidade',
      desc: 'Participe das discussões e dicas da região',
      icon: MessageSquare,
      link: '/comunidade',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Salas de Entrevista',
      desc: 'Agende e acerte reuniões virtuais em tempo real',
      icon: Video,
      link: '/entrevistas',
      gradient: 'from-rose-500 to-pink-600',
    },
  ];

  const recentOportunidades = oportunidades.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner Gradiente de Boas-Vindas */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 md:p-10 text-white shadow-xl shadow-blue-500/15">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            👋 Bem-vindo de volta!
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Bem-vindo ao Óbidos Conect
          </h1>
          <p className="text-sm md:text-base text-blue-100/95 leading-relaxed">
            Conectando empresas, trabalhadores autônomos, cooperativas e prestadores de serviços de Óbidos e municípios vizinhos com transparência, agilidade e segurança.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/oportunidades">
              <Button variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                Explorar Oportunidades
              </Button>
            </Link>
            <Link to="/curriculos">
              <Button variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                Cadastrar Perfil
              </Button>
            </Link>
          </div>
        </div>

        {/* Efeito decorativo de fundo */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-24 bottom-0 h-40 w-40 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />
      </div>

      {/* 4 Cards de Estatísticas */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Indicadores da Região
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100/80 hover:border-blue-300">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Oportunidades Ativas</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {loadingOportunidades ? '...' : totalOportunidades}
                </h3>
                <span className="text-[11px] text-emerald-600 font-medium">Vagas e demandas abertas</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-indigo-100/80 hover:border-indigo-300">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Talentos Locais</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {loadingCurriculos ? '...' : totalTalentos}
                </h3>
                <span className="text-[11px] text-indigo-600 font-medium">Currículos disponíveis</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-purple-100/80 hover:border-purple-300">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Contratos em Curso</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {loadingContratos ? '...' : totalContratosAtivos}
                </h3>
                <span className="text-[11px] text-purple-600 font-medium">Projetos em andamento</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileSignature className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-amber-100/80 hover:border-amber-300">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Comunidade & Dicas</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {loadingPosts ? '...' : totalPosts}
                </h3>
                <span className="text-[11px] text-amber-600 font-medium">Discussões e legislações</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grid de Acesso Rápido (6 cards com ícones em gradiente) */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Acesso Rápido aos Serviços</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickAccessItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={index} to={item.link} className="group">
                <Card className="h-full border-slate-200/80 bg-white transition-all duration-200 group-hover:border-blue-300 group-hover:-translate-y-0.5">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div
                      className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white shadow-md transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3 Oportunidades Recentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Oportunidades em Destaque</h2>
            <p className="text-xs text-slate-500">Recrutamentos e demandas abertas recentemente em Óbidos</p>
          </div>
          <Link to="/oportunidades" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            Ver todas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loadingOportunidades ? (
          <div className="p-8 text-center text-sm text-slate-500">Carregando oportunidades...</div>
        ) : recentOportunidades.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 text-sm">
            Nenhuma oportunidade cadastrada ainda. Clique em "Oportunidades" para criar a primeira!
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentOportunidades.map((op) => (
              <Card key={op._id} className="flex flex-col justify-between border-slate-200/80 bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="secondary" className="capitalize text-[11px]">
                      {op.tipo}
                    </Badge>
                    <Badge variant="outline" className="capitalize text-[11px] border-blue-200 text-blue-700 bg-blue-50/50">
                      {op.modalidade}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 line-clamp-1">
                    {op.titulo}
                  </CardTitle>
                  <p className="text-xs font-medium text-slate-600">{op.empresa}</p>
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {op.descricao}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {op.localizacao}
                    </span>
                    <span className="font-semibold text-emerald-700">
                      {op.salario || 'A combinar'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
