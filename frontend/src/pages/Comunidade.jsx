import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  MessageSquare,
  Plus,
  Heart,
  Tag,
  Share2,
  Trash2,
  AlertCircle,
  Sparkles,
  Calendar,
  Lightbulb,
  FileCheck2,
  Radio,
  BookOpen,
} from 'lucide-react';
import { comunidadeApi } from '@/api/api';
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

const typeIcons = {
  discussao: MessageSquare,
  regulamentacao: FileCheck2,
  dica: Lightbulb,
  evento: Calendar,
  noticia: Radio,
};

const typeLabels = {
  todos: 'Todos os Posts',
  discussao: 'Discussão',
  regulamentacao: 'Regulamentação',
  dica: 'Dica Prática',
  evento: 'Evento',
  noticia: 'Notícia Regional',
};

export default function Comunidade() {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    titulo: '',
    conteudo: '',
    tipo: 'discussao',
    categoria: 'Empreendedorismo Regional',
    tags: '',
    autor_nome: 'Profissional de Óbidos',
    autor_cargo: 'Membro Conecta',
  };

  const [form, setForm] = useState(initialForm);

  // React Query: Feed de Posts
  const { data: posts = [], isLoading, isError, error } = useQuery({
    queryKey: ['comunidade', { tipo: selectedType }],
    queryFn: () =>
      comunidadeApi.getAll({
        tipo: selectedType !== 'todos' ? selectedType : undefined,
      }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newPost) => comunidadeApi.create(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunidade'] });
      setIsModalOpen(false);
      setForm(initialForm);
    },
  });

  const curtirMutation = useMutation({
    mutationFn: (id) => comunidadeApi.curtir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunidade'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => comunidadeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunidade'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.conteudo.trim()) return;

    const payload = {
      ...form,
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };

    createMutation.mutate(payload);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Comunidade & Fórum Regional
          </h1>
          <p className="text-sm text-slate-500">
            Troca de experiências, eventos, dicas tributárias e networking para o mercado de Óbidos.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Nova Publicação
        </Button>
      </div>

      {/* Abas / Filtros de Tipo */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {Object.keys(typeLabels).map((typeKey) => {
          const isSelected = selectedType === typeKey;
          return (
            <button
              key={typeKey}
              type="button"
              onClick={() => setSelectedType(typeKey)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {typeLabels[typeKey]}
            </button>
          );
        })}
      </div>

      {/* Feed de Posts */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-500 text-sm">Carregando publicações...</div>
      ) : isError ? (
        <div className="py-8 text-center text-red-500 text-sm flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Erro ao carregar posts: {error?.message}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-300 rounded-2xl bg-white/50">
          <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Nenhum post publicado nesta categoria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Seja o primeiro a compartilhar uma dúvida, oportunidade ou conhecimento técnico!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const Icon = typeIcons[post.tipo] || MessageSquare;

            return (
              <Card
                key={post._id}
                className="border-slate-200/80 bg-white shadow-sm hover:border-blue-300 transition-all duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {post.autor_nome?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {post.autor_nome || 'Membro da Comunidade'}
                          </span>
                          <span className="text-[11px] text-slate-400">·</span>
                          <span className="text-[11px] text-slate-500">{post.autor_cargo}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(post.createdAt)} · Óbidos, PA
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="subtle" className="capitalize text-xs gap-1">
                        <Icon className="h-3 w-3 text-blue-600" />
                        {post.tipo}
                      </Badge>
                      <button
                        onClick={() => deleteMutation.mutate(post._id)}
                        className="p-1 rounded-md text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Excluir post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <CardTitle className="text-lg font-bold text-slate-900 mt-3 leading-snug">
                    {post.titulo}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 pb-3">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {post.conteudo}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px]">
                    Categoria: <span className="font-medium text-slate-700">{post.categoria}</span>
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => curtirMutation.mutate(post._id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors font-semibold text-xs"
                    >
                      <Heart
                        className={`h-3.5 w-3.5 ${
                          post.curtidas > 0 ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span>{post.curtidas || 0}</span>
                    </button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Criação de Post */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent onClose={() => setIsModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Criar Publicação na Comunidade</DialogTitle>
            <DialogDescription>
              Compartilhe notícias, dicas práticas, dúvidas ou divulgue eventos em Óbidos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título da Publicação *
              </label>
              <Input
                required
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex: Como emitir Nota Fiscal de MEI em Óbidos..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Conteúdo
                </label>
                <Select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                >
                  <option value="discussao">Discussão Aberta</option>
                  <option value="regulamentacao">Regulamentação / Lei</option>
                  <option value="dica">Dica Profissional</option>
                  <option value="evento">Evento / Encontro</option>
                  <option value="noticia">Notícia Regional</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria</label>
                <Input
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  placeholder="Ex: Legislação, TI, Cooperativa"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Seu Nome</label>
                <Input
                  value={form.autor_nome}
                  onChange={(e) => setForm({ ...form, autor_nome: e.target.value })}
                  placeholder="Nome de exibição"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo / Profissão</label>
                <Input
                  value={form.autor_cargo}
                  onChange={(e) => setForm({ ...form, autor_cargo: e.target.value })}
                  placeholder="Ex: Contador, Designer, Autônomo"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Conteúdo da Publicação *
              </label>
              <Textarea
                required
                rows={4}
                value={form.conteudo}
                onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
                placeholder="Escreva sua mensagem com clareza para os profissionais de Óbidos..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tags (separadas por vírgula)
              </label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Ex: LGPD, MEI, Tributos, Carnapauxis, Agro"
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
                {createMutation.isPending ? 'Publicando...' : 'Publicar Agora'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
