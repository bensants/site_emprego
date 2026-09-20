import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Building2,
  DollarSign,
  Video,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  ChevronRight,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { candidaturasApi } from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function MinhasCandidaturas() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [cancelingId, setCancelingId] = useState(null);

  const { data: candidaturas = [], isLoading, isError, error } = useQuery({
    queryKey: ['minhas-candidaturas'],
    queryFn: () => candidaturasApi.getMinhas(),
    enabled: isAuthenticated,
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => candidaturasApi.cancelar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhas-candidaturas'] });
      setCancelingId(null);
      toast.success('Candidatura cancelada com sucesso.');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Erro ao cancelar candidatura.');
    },
  });

  const getStatusBadge = (status) => {
    const map = {
      pendente: { label: 'Inscrito / Pendente', bg: 'bg-amber-100 text-amber-800 border-amber-200' },
      em_analise: { label: 'Em Triagem / Análise', bg: 'bg-blue-100 text-blue-800 border-blue-200' },
      entrevista: { label: 'Entrevista Agendada', bg: 'bg-purple-100 text-purple-800 border-purple-200' },
      aprovado: { label: 'Aprovado / Selecionado', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      reprovado: { label: 'Processo Encerrado', bg: 'bg-slate-100 text-slate-700 border-slate-300' },
    };
    const s = map[status] || map.pendente;
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${s.bg}`}>{s.label}</span>;
  };

  const getStepNumber = (status) => {
    switch (status) {
      case 'pendente':
        return 1;
      case 'em_analise':
        return 2;
      case 'entrevista':
        return 3;
      case 'aprovado':
      case 'reprovado':
        return 4;
      default:
        return 1;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Briefcase className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Acesse sua Conta</h2>
        <p className="text-xs text-slate-500">
          Você precisa estar conectado para acompanhar o status das suas candidaturas.
        </p>
        <Link to="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 mt-2">Fazer Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Minhas Candidaturas
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhe o andamento dos seus processos seletivos e entrevistas em Óbidos.
          </p>
        </div>

        <Link to="/oportunidades">
          <Button variant="outline" className="gap-2 text-xs font-semibold">
            <Briefcase className="w-4 h-4 text-blue-600" />
            Explorar Mais Vagas
          </Button>
        </Link>
      </div>

      {/* Lista de Candidaturas */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-500 text-sm">Carregando suas candidaturas...</div>
      ) : isError ? (
        <div className="py-8 text-center text-rose-500 text-sm flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Erro ao carregar dados: {error?.message}
        </div>
      ) : candidaturas.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-300 rounded-2xl bg-white/60 p-8">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Você ainda não se candidatou a nenhuma vaga</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Explore as oportunidades no comércio, pecuária, cooperativas agroextrativistas e serviços digitais da nossa região.
          </p>
          <Link to="/oportunidades">
            <Button className="bg-blue-600 hover:bg-blue-700">Ver Vagas Abertas</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {candidaturas.map((cand) => {
            const op = cand.oportunidade_id || {};
            const sala = cand.sala_entrevista_id;
            const currentStep = getStepNumber(cand.status);

            return (
              <Card
                key={cand._id}
                className="border-slate-200/80 bg-white shadow-sm hover:border-blue-200 transition-all overflow-hidden"
              >
                <CardHeader className="bg-slate-50/50 pb-3 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[11px] uppercase tracking-wider font-semibold">
                          {op.tipo || 'Oportunidade'}
                        </Badge>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Enviado em {new Date(cand.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-900">
                        {op.titulo || 'Oportunidade'}
                      </CardTitle>
                      <p className="text-xs font-semibold text-blue-700 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {op.empresa || 'Empresa Local de Óbidos'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {getStatusBadge(cand.status)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  {/* Linha do Tempo / Stepper Visual */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Evolução do Processo Seletivo
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      <div className={`p-2 rounded-lg ${currentStep >= 1 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-500'}`}>
                        1. Inscrição
                      </div>
                      <div className={`p-2 rounded-lg ${currentStep >= 2 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-500'}`}>
                        2. Análise
                      </div>
                      <div className={`p-2 rounded-lg ${currentStep >= 3 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-500'}`}>
                        3. Entrevista
                      </div>
                      <div className={`p-2 rounded-lg ${cand.status === 'aprovado' ? 'bg-emerald-600 text-white font-bold' : cand.status === 'reprovado' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-200 text-slate-500'}`}>
                        4. Final
                      </div>
                    </div>
                  </div>

                  {/* Informações da Oportunidade */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{op.localizacao || 'Óbidos, PA'} ({op.modalidade || 'Presencial'})</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                      <DollarSign className="w-4 h-4" />
                      <span>{op.salario || 'A combinar'}</span>
                    </div>
                    {op.tipo_contrato && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span>Contrato: {op.tipo_contrato}</span>
                      </div>
                    )}
                  </div>

                  {/* Sala de Entrevista Virtual (se agendada) */}
                  {sala && (
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Video className="w-4 h-4 text-purple-700" />
                          <span>Sala de Entrevista Virtual Confirmada</span>
                        </div>
                        <p className="text-xs text-purple-800 mt-1">
                          Data:{' '}
                          <strong>
                            {new Date(sala.data_agendada).toLocaleString('pt-BR', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </strong>{' '}
                          · Duração prevista: {sala.duracao_minutos} min
                        </p>
                      </div>

                      <a
                        href={sala.link_reuniao}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        Acessar Sala Virtual
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    </div>
                  )}

                  {/* Mensagem enviada pelo candidato */}
                  {cand.mensagem && (
                    <div className="text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-700 block mb-0.5">Sua mensagem ao contratante:</span>
                      <p className="italic">"{cand.mensagem}"</p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-slate-50/30 p-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    ID Candidatura: <span className="font-mono">{cand._id.slice(-6)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCancelingId(cand._id)}
                      className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Cancelar Inscrição
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmação de Cancelamento */}
      <Dialog open={!!cancelingId} onOpenChange={(open) => !open && setCancelingId(null)}>
        <DialogContent onClose={() => setCancelingId(null)}>
          <DialogHeader>
            <DialogTitle>Cancelar Candidatura?</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar sua inscrição? Esta ação não pode ser desfeita e seu perfil será retirado da triagem da vaga.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setCancelingId(null)}>
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate(cancelingId)}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? 'Cancelando...' : 'Confirmar Cancelamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
