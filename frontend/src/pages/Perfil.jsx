// frontend/src/pages/Perfil.jsx
import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Briefcase,
  MapPin,
  Save,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  Store,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/api';

// Taxonomia de Categorias oficiais de Óbidos/PA
const CATEGORIAS_OFICIAIS = [
  'Obras, Reformas e Manutenção Residencial',
  'Reparos Técnicos e Instalações Mecânicas',
  'Estética, Cuidados Pessoais e Beleza',
  'Fretes, Mudanças e Transporte Municipal',
  'Tecnologia da Informação e Serviços Digitais',
  'Outros Serviços e Ofícios Manuais'
];

// Principais Bairros de Óbidos para indexação regional
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

export default function Perfil() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    nomeComercial: '',
    profissao: '',
    categoria: CATEGORIAS_OFICIAIS[0],
    bairro: 'Centro',
    bio: '',
    visivelNoCatalogo: true,
  });

  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [erro, setErro] = useState('');

  // Sincroniza os dados do usuário autenticado no formulário
  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        telefone: user.telefone || '',
        nomeComercial: user.nomeComercial || '',
        profissao: user.profissao || '',
        categoria: user.categoria || CATEGORIAS_OFICIAIS[0],
        bairro: user.bairro || 'Centro',
        bio: user.bio || '',
        visivelNoCatalogo: user.visivelNoCatalogo !== undefined ? user.visivelNoCatalogo : true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMensagemSucesso(false);
    setErro('');
  };

  const handleToggleVisibilidade = () => {
    setFormData((prev) => ({ ...prev, visivelNoCatalogo: !prev.visivelNoCatalogo }));
    setMensagemSucesso(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    setMensagemSucesso(false);

    try {
      const response = await authApi.updateMe(formData);
      if (response?.user) {
        updateUser(response.user);
      }
      setMensagemSucesso(true);
      setTimeout(() => setMensagemSucesso(false), 4000);
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
      setErro(err?.response?.data?.message || 'Falha ao salvar as alterações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Cabeçalho do Painel */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Painel do Prestador (MEI / Autônomo)
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">
          Gerencie sua vitrine de serviços, canais de contato e sua visibilidade no município de Óbidos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BLOCO 1: INTERRUPTOR DE VISIBILIDADE LGPD (RF-05) */}
        <Card className="border-emerald-200 bg-emerald-50/40 rounded-2xl overflow-hidden shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base sm:text-lg text-slate-900 font-bold flex items-center gap-2">
                    {formData.visivelNoCatalogo ? (
                      <Eye className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-amber-600" />
                    )}
                    Disponibilidade no Catálogo de Óbidos
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      formData.visivelNoCatalogo
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                        : 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                    }
                  >
                    {formData.visivelNoCatalogo ? 'Perfil Ativo na Busca' : 'Perfil Oculto'}
                  </Badge>
                </div>
                <CardDescription className="text-xs sm:text-sm text-slate-600">
                  Exercício da autodeterminação informativa (Art. 18 da LGPD). Desative caso sua agenda esteja lotada ou durante viagens.
                </CardDescription>
              </div>

              <Button
                type="button"
                onClick={handleToggleVisibilidade}
                variant={formData.visivelNoCatalogo ? 'default' : 'outline'}
                className={
                  formData.visivelNoCatalogo
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm text-xs sm:text-sm'
                    : 'border-amber-500 text-amber-800 hover:bg-amber-50 rounded-xl text-xs sm:text-sm'
                }
              >
                {formData.visivelNoCatalogo ? 'Pausar Exibição Pública' : 'Ativar Exibição Pública'}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* BLOCO 2: DADOS DA VITRINE COMERCIAL (RF-02) */}
        <Card className="border-slate-200 rounded-2xl bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              Informações Comerciais da Vitrine
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-500">
              Esses dados serão apresentados aos contratantes nos resultados de busca.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Nome Civil do Responsável
                </label>
                <Input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Seu nome completo"
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-slate-400" />
                  Nome Comercial / Nome Fantasia (MEI)
                </label>
                <Input
                  type="text"
                  name="nomeComercial"
                  value={formData.nomeComercial}
                  onChange={handleChange}
                  placeholder="Ex: Silva Instalações Elétricas"
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  WhatsApp Comercial (com DDD)
                </label>
                <Input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="Ex: 93991234567"
                  required
                  className="rounded-xl border-slate-200"
                />
                <span className="text-[11px] text-slate-400">Utilizado no acionamento direto do botão da vitrine.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  Ofício Principal / Ocupação
                </label>
                <Input
                  type="text"
                  name="profissao"
                  value={formData.profissao}
                  onChange={handleChange}
                  placeholder="Ex: Eletricista Predial, Marceneiro, Técnica de Ar Split"
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  Categoria de Enquadramento no Sistema
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full h-10 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                >
                  {CATEGORIAS_OFICIAIS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Bairro Base de Atendimento (Óbidos/PA)
                </label>
                <select
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  className="w-full h-10 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Descrição dos Serviços e Habilidades Comerciais (Vitrine)
              </label>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva sua experiência, tipos de reparos realizados, ferramentas que possui e facilidades de atendimento..."
                className="rounded-xl border-slate-200 text-xs sm:text-sm"
              />
            </div>
          </CardContent>

          {/* BLOCO 3: SALVAGUARDA DE MINIMIZAÇÃO LGPD (RNF-01) */}
          <div className="mx-6 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Garantia de Privacidade e Minimização de Dados (LGPD)</p>
              <p>
                Seus registros civis particulares (CPF, endereço domiciliar e credenciais bancárias) estão segregados com segurança no banco de dados e nunca são expostos em nenhuma tela pública de consulta.
              </p>
            </div>
          </div>

          <CardFooter className="border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
            <div className="flex items-center gap-2 text-xs">
              {mensagemSucesso && (
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Perfil atualizado com sucesso!
                </span>
              )}
              {erro && (
                <span className="flex items-center gap-1.5 text-red-600 font-semibold animate-in fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {erro}
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={salvando}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-medium px-6 shadow-sm"
            >
              <Save className="w-4 h-4" />
              {salvando ? 'Gravando Alterações...' : 'Salvar Alterações'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
