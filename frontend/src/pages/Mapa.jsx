import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Search,
  Building2,
  User,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
  Navigation,
  Compass,
  Layers,
  Sparkles,
  Map as MapIcon,
  Filter,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { usuariosApi } from '@/api/api';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Lista de pontos de referência populares em Óbidos para filtro rápido
const BAIRROS_OBIDOS = [
  'Todos',
  'Centro',
  'Centro Histórico',
  'São Francisco',
  'Santa Terezinha',
  'Bairro de Fátima',
  'Cidade Nova',
  'Porto de Óbidos',
];

export default function Mapa() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [bairroFilter, setBairroFilter] = useState('Todos');
  const [selectedUser, setSelectedUser] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [mapType, setMapType] = useState('m'); // 'm' = padrão, 'k' = satélite, 'p' = relevo

  // Consulta usuários no backend
  const {
    data: usuarios = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['usuarios-mapa', { tipo: tipoFilter, search: searchTerm }],
    queryFn: () =>
      usuariosApi.getMapa({
        tipo: tipoFilter !== 'todos' ? tipoFilter : undefined,
        search: searchTerm || undefined,
      }),
  });

  // Filtragem local complementar por bairro
  const filteredUsers = useMemo(() => {
    return usuarios.filter((user) => {
      if (bairroFilter !== 'Todos') {
        const userBairro = (user.bairro || '').toLowerCase();
        const userEnd = (user.endereco || '').toLowerCase();
        const target = bairroFilter.toLowerCase();
        if (!userBairro.includes(target) && !userEnd.includes(target)) {
          return false;
        }
      }
      return true;
    });
  }, [usuarios, bairroFilter]);

  // Se nenhum usuário estiver explicitamente selecionado, usa o primeiro com endereço ou a cidade de Óbidos
  const activeUser = selectedUser || filteredUsers.find((u) => u.endereco) || filteredUsers[0] || null;

  // Monta a query para o iframe do Google Maps sem necessidade de chave
  const mapQuery = useMemo(() => {
    if (activeUser && (activeUser.endereco || activeUser.cidade)) {
      const parts = [
        activeUser.endereco,
        activeUser.bairro,
        activeUser.cidade || 'Óbidos',
        activeUser.estado || 'PA',
        'Brasil',
      ].filter(Boolean);
      return parts.join(', ');
    }
    return 'Óbidos, Pará, Brasil';
  }, [activeUser]);

  // URL do Google Maps Embed pública sem chave de API
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    mapQuery
  )}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

  // URL externa para navegação no aplicativo do Google Maps
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery
  )}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-200/50">
              <MapIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Mapa Regional de Usuários & Empresas
              </h1>
              <p className="text-sm text-slate-500">
                Localização geográfica e endereços de candidatos, cooperativas e prestadores em Óbidos e região.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs h-9"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Atualizar
          </Button>
          <a
            href={externalGoogleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-xs font-semibold px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Abrir no Google Maps
          </a>
        </div>
      </div>

      {/* Barra de Filtros e Pesquisa */}
      <Card className="border-slate-200 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Campo de Busca Textual */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome, profissão, endereço ou bairro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 bg-slate-50 border-slate-200"
              />
            </div>

            {/* Filtro por Tipo de Perfil */}
            <div className="md:col-span-3">
              <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setTipoFilter('todos')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                    tipoFilter === 'todos'
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos ({usuarios.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTipoFilter('empresa')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                    tipoFilter === 'empresa'
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Empresas
                </button>
                <button
                  type="button"
                  onClick={() => setTipoFilter('candidato')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                    tipoFilter === 'candidato'
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Profissionais
                </button>
              </div>
            </div>

            {/* Controle de Modo do Mapa (Satélite / Padrão) */}
            <div className="md:col-span-3 flex items-center justify-end gap-2">
              <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs w-full">
                <button
                  type="button"
                  onClick={() => setMapType('m')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                    mapType === 'm'
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-slate-600'
                  }`}
                >
                  Mapa Padrão
                </button>
                <button
                  type="button"
                  onClick={() => setMapType('k')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                    mapType === 'k'
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-slate-600'
                  }`}
                >
                  Satélite
                </button>
              </div>
            </div>
          </div>

          {/* Filtros Rápidos por Bairro */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1 shrink-0">
              <Filter className="h-3 w-3" /> Bairros:
            </span>
            {BAIRROS_OBIDOS.map((bairro) => (
              <button
                key={bairro}
                type="button"
                onClick={() => setBairroFilter(bairro)}
                className={`text-xs px-2.5 py-1 rounded-full shrink-0 transition-colors ${
                  bairroFilter === bairro
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {bairro}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grid Principal: Lista à Esquerda + Visualizador Google Maps à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Painel do Iframe do Google Maps (Direto sem chave) */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
          <Card className="overflow-hidden border-slate-200 shadow-md bg-white">
            <CardHeader className="p-4 bg-gradient-to-r from-slate-900 to-blue-950 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/20 rounded-lg">
                    <Navigation className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-white">
                      {activeUser ? activeUser.nome : 'Visualizador Geográfico'}
                    </CardTitle>
                    <p className="text-xs text-blue-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-red-400 shrink-0" />
                      <span className="truncate max-w-sm">{mapQuery}</span>
                    </p>
                  </div>
                </div>

                {/* Controles de Zoom */}
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    title="Diminuir Zoom"
                    onClick={() => setZoomLevel((z) => Math.max(10, z - 1))}
                    className="h-7 w-7 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="px-1 text-[11px] text-blue-200">{zoomLevel}x</span>
                  <button
                    type="button"
                    title="Aumentar Zoom"
                    onClick={() => setZoomLevel((z) => Math.min(20, z + 1))}
                    className="h-7 w-7 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </CardHeader>

            {/* Container do Iframe do Google Maps (Sem chave) */}
            <div className="relative w-full h-[450px] lg:h-[580px] bg-slate-100">
              <iframe
                title="Google Maps Óbidos Conect"
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Selo informativo Flutuante */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 text-[11px] text-slate-700 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Google Maps Embed Direto (sem autenticação de chave)</span>
              </div>
            </div>

            {/* Detalhes do Usuário Ativo sob o Mapa */}
            {activeUser && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{activeUser.nome}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-bold ${
                        activeUser.tipo === 'empresa'
                          ? 'border-indigo-300 text-indigo-700 bg-indigo-50'
                          : activeUser.tipo === 'admin'
                          ? 'border-purple-300 text-purple-700 bg-purple-50'
                          : 'border-blue-300 text-blue-700 bg-blue-50'
                      }`}
                    >
                      {activeUser.tipo === 'empresa' ? 'Empresa / Cooperativa' : activeUser.tipo === 'admin' ? 'Administrador' : 'Candidato'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">
                    {activeUser.profissao || activeUser.organizacao || 'Profissional de Óbidos'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                    <span>
                      {activeUser.endereco
                        ? `${activeUser.endereco}${activeUser.bairro ? ` - ${activeUser.bairro}` : ''}, ${activeUser.cidade || 'Óbidos'} - ${activeUser.estado || 'PA'}`
                        : `${activeUser.cidade || 'Óbidos'} - ${activeUser.estado || 'PA'}`}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeUser.telefone && (
                    <a
                      href={getWhatsAppLink(
                        activeUser.telefone,
                        `Olá ${activeUser.nome}, vi seu endereço no mapa da plataforma Óbidos Conect e gostaria de conversar!`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 mr-1" /> WhatsApp
                    </a>
                  )}
                  <a
                    href={externalGoogleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Rotas <Navigation className="h-3 w-3 ml-1 text-blue-600" />
                  </a>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Lista Lateral de Usuários Cadastrados */}
        <div className="lg:col-span-5 order-2 lg:order-1 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Usuários no Mapa ({filteredUsers.length})
            </h2>
            <span className="text-xs text-slate-500">Clique para localizar no mapa</span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center bg-white rounded-xl border border-slate-200">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
              <p className="text-xs text-slate-500">Carregando usuários cadastrados...</p>
            </div>
          ) : isError ? (
            <div className="p-4 text-center bg-red-50 rounded-xl border border-red-200 text-xs text-red-700">
              Erro ao carregar dados do mapa. Tente recarregar.
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <MapPin className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Nenhum usuário encontrado</p>
              <p className="text-xs text-slate-500 mt-1">
                Tente ajustar os termos de pesquisa ou selecionar outro bairro.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredUsers.map((user) => {
                const isSelected = activeUser?._id === user._id;
                const formattedAddress = user.endereco
                  ? `${user.endereco}${user.bairro ? `, ${user.bairro}` : ''}, ${user.cidade || 'Óbidos'}`
                  : `${user.cidade || 'Óbidos'} - ${user.estado || 'PA'}`;

                return (
                  <div
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                            user.tipo === 'empresa'
                              ? 'bg-indigo-100 text-indigo-700'
                              : user.tipo === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {user.tipo === 'empresa' ? (
                            <Building2 className="h-5 w-5" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-sm text-slate-900 truncate">
                              {user.nome}
                            </h3>
                            {isSelected && (
                              <Badge className="bg-blue-600 text-[10px] h-4 py-0 px-1 text-white">
                                Selecionado
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                            {user.profissao || user.organizacao || 'Membro Cadastrado'}
                          </p>

                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                            <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                            <span className="truncate">{formattedAddress}</span>
                          </div>

                          {user.bairro && (
                            <div className="mt-1.5">
                              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                Bairro: {user.bairro}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={isSelected ? 'default' : 'outline'}
                        className={`text-xs h-8 shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'text-slate-700'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                      >
                        <Compass className="h-3.5 w-3.5 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
