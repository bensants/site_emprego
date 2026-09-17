import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Users,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';
import { curriculosApi } from '@/api/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function BuscarProfissionais() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurriculo, setSelectedCurriculo] = useState(null);

  // React Query: buscar currículos com visibilidade pública
  const { data: curriculos = [], isLoading, isError, error } = useQuery({
    queryKey: ['buscar-curriculos', { search: searchTerm }],
    queryFn: () =>
      curriculosApi.getAll({
        visibilidade: 'publico',
        search: searchTerm || undefined,
      }),
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Buscar Talentos da Região
        </h1>
        <p className="text-sm text-slate-500">
          Encontre profissionais, técnicos e prestadores de serviços de Óbidos e do Baixo Amazonas com perfis públicos verificados.
        </p>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <Search className="absolute left-7 top-7 h-5 w-5 text-slate-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busque por habilidade (ex: React, Logística), cargo ou nome do profissional..."
          className="pl-12 h-12 text-base rounded-xl"
        />
        <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Sugestões rápidas:</span>
          {['React', 'Logística', 'Agronegócio', 'Design', 'Finanças'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearchTerm(tag)}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors"
            >
              {tag}
            </button>
          ))}
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="ml-auto text-blue-600 hover:underline"
            >
              Limpar busca
            </button>
          )}
        </div>
      </div>

      {/* Listagem de Resultados */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-500 text-sm">Pesquisando talentos...</div>
      ) : isError ? (
        <div className="py-8 text-center text-red-500 text-sm flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Erro ao buscar currículos: {error?.message}
        </div>
      ) : curriculos.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-300 rounded-2xl bg-white/50">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Nenhum profissional público encontrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Tente buscar por termos mais genéricos ou acesse "Currículos" para cadastrar seu perfil.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {curriculos.map((curr) => (
            <Card
              key={curr._id}
              className="flex flex-col justify-between border-slate-200/80 bg-white shadow-sm hover:border-blue-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                    {curr.nome_candidato?.charAt(0) || 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-bold text-slate-900 truncate">
                      {curr.nome_candidato || 'Profissional de Óbidos'}
                    </CardTitle>
                    <p className="text-xs font-semibold text-blue-700 truncate mt-0.5">
                      {curr.titulo}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>
                        {curr.cidade || 'Óbidos'}, {curr.estado || 'PA'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3.5 text-xs text-slate-600 pb-3">
                {curr.resumo_profissional && (
                  <p className="line-clamp-3 text-slate-600 leading-relaxed italic">
                    "{curr.resumo_profissional}"
                  </p>
                )}

                {/* Habilidades em Badges */}
                <div>
                  <span className="font-semibold text-slate-700 block mb-1 text-[11px]">
                    Habilidades:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {curr.habilidades && curr.habilidades.length > 0 ? (
                      curr.habilidades.slice(0, 5).map((hab, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[11px] font-medium"
                        >
                          {hab}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[11px]">Nenhuma informada</span>
                    )}
                    {curr.habilidades?.length > 5 && (
                      <span className="text-slate-500 text-[11px] self-center">
                        +{curr.habilidades.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Última Experiência */}
                {curr.experiencias && curr.experiencias.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-800 font-medium text-[11px]">
                      <Briefcase className="h-3 w-3 text-slate-400" />
                      <span className="truncate">
                        {curr.experiencias[0].cargo} na {curr.experiencias[0].empresa}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => setSelectedCurriculo(curr)}
                >
                  Ver Perfil Completo
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Perfil Completo */}
      <Dialog
        open={Boolean(selectedCurriculo)}
        onOpenChange={(open) => !open && setSelectedCurriculo(null)}
      >
        {selectedCurriculo && (
          <DialogContent onClose={() => setSelectedCurriculo(null)}>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {selectedCurriculo.nome_candidato?.charAt(0) || 'P'}
                </div>
                <div>
                  <DialogTitle>{selectedCurriculo.nome_candidato}</DialogTitle>
                  <p className="text-xs font-semibold text-blue-700">
                    {selectedCurriculo.titulo}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 text-xs text-slate-700 mt-3">
              {/* Contatos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>
                    {selectedCurriculo.cidade}, {selectedCurriculo.estado}
                  </span>
                </div>
                {selectedCurriculo.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="truncate">{selectedCurriculo.email}</span>
                  </div>
                )}
                {selectedCurriculo.telefone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>{selectedCurriculo.telefone}</span>
                  </div>
                )}
              </div>

              {/* Resumo */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Resumo Profissional</h4>
                <p className="text-slate-600 leading-relaxed">
                  {selectedCurriculo.resumo_profissional || 'Sem resumo cadastrado.'}
                </p>
              </div>

              {/* Habilidades */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Habilidades</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCurriculo.habilidades?.map((h, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-md text-xs font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experiências */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-blue-600" /> Experiência Profissional
                </h4>
                {selectedCurriculo.experiencias && selectedCurriculo.experiencias.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedCurriculo.experiencias.map((exp, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{exp.cargo}</span>
                          <span className="text-[11px] text-slate-400">{exp.periodo}</span>
                        </div>
                        <p className="text-[11px] text-blue-700 font-medium">{exp.empresa}</p>
                        {exp.descricao && (
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {exp.descricao}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs">Nenhuma experiência informada.</p>
                )}
              </div>

              {/* Formação */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-blue-600" /> Formação Acadêmica
                </h4>
                {selectedCurriculo.formacao && selectedCurriculo.formacao.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCurriculo.formacao.map((f, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{f.curso}</span>
                          <span className="text-[11px] text-slate-400">{f.periodo}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{f.instituicao}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs">Nenhuma formação cadastrada.</p>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
