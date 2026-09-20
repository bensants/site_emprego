import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building,
  LogIn,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/api';

const STORAGE_KEY = 'obidos_connect_user_profile';

export default function Perfil() {
  const { user, isAuthenticated, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    nome: 'Mayara Albuquerque Pauxis',
    email: 'mayara.pauxis@obidos.com.br',
    telefone: '(93) 98412-3456',
    profissao: 'Engenheira de Software Full Stack',
    cidade: 'Óbidos',
    estado: 'PA',
    bio: 'Desenvolvedora apaixonada pelo desenvolvimento de soluções tecnológicas para cooperativas e negócios do Baixo Amazonas.',
    organizacao: 'Cooperativa Agroextrativista de Óbidos (COOPAO)',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        profissao: user.profissao || '',
        cidade: user.cidade || 'Óbidos',
        estado: user.estado || 'PA',
        bio: user.bio || '',
        organizacao: user.organizacao || '',
      });
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch (err) {
          console.error('Erro ao ler perfil do localStorage:', err);
        }
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isAuthenticated) {
        const response = await authApi.updateMe(profile);
        updateUser(response.user);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      }

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 4000);
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Erro ao atualizar dados do perfil. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Meu Perfil Profissional
        </h1>
        <p className="text-sm text-slate-500">
          Mantenha seus dados e contatos atualizados para facilitar conexões com oportunidades em Óbidos.
        </p>
      </div>

      {/* Alerta de conta não vinculada se não autenticado */}
      {!isAuthenticated && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <span>
              Você está editando um perfil local não salvo na nuvem.{' '}
              <strong>Faça login ou crie uma conta</strong> para salvar seus dados com segurança.
            </span>
          </div>
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 shadow-sm"
          >
            Fazer Login
          </Link>
        </div>
      )}

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Perfil atualizado com sucesso! As alterações já estão sincronizadas no banco de dados.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Mini Preview */}
        <div className="md:col-span-1 space-y-4">
          <Card className="border-slate-200/80 bg-white text-center p-6 shadow-sm">
            <div className="mx-auto h-24 w-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-blue-500/20 mb-4">
              {profile.nome ? profile.nome.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="font-bold text-slate-900 text-lg">{profile.nome || 'Seu Nome'}</h3>
            <p className="text-xs font-semibold text-blue-700 mt-0.5">
              {profile.profissao || 'Sua Profissão'}
            </p>
            <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
              {profile.cidade}, {profile.estado}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 text-left space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{profile.email || 'Não informado'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{profile.telefone || 'Não informado'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{profile.organizacao || 'Autônomo'}</span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-800 text-left flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Dados protegidos de acordo com a LGPD. Apenas contatos autorizados têm acesso completo.
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column: Formulário de Perfil */}
        <div className="md:col-span-2">
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Informações Cadastrais</CardTitle>
              <CardDescription>
                Atualize seus dados pessoais e de contato profissional.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} id="perfil-form" className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <Input
                    required
                    name="nome"
                    value={profile.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                  />
                </div>

                {/* Profissão e Organização */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Profissão / Ocupação *
                    </label>
                    <Input
                      required
                      name="profissao"
                      value={profile.profissao}
                      onChange={handleChange}
                      placeholder="Ex: Engenheiro de Software, Agrônomo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Empresa / Cooperativa
                    </label>
                    <Input
                      name="organizacao"
                      value={profile.organizacao}
                      onChange={handleChange}
                      placeholder="Nome da empresa ou 'Autônomo'"
                    />
                  </div>
                </div>

                {/* Email e Telefone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      required
                      disabled={isAuthenticated} // E-mail é a chave da conta
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="seuemail@exemplo.com"
                      className={isAuthenticated ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <Input
                      required
                      name="telefone"
                      value={profile.telefone}
                      onChange={handleChange}
                      placeholder="(93) 98400-0000"
                    />
                  </div>
                </div>

                {/* Cidade (Óbidos) e Estado (PA) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cidade *
                    </label>
                    <Input
                      required
                      name="cidade"
                      value={profile.cidade}
                      onChange={handleChange}
                      placeholder="Óbidos"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estado *
                    </label>
                    <Input
                      required
                      name="estado"
                      value={profile.estado}
                      onChange={handleChange}
                      placeholder="PA"
                    />
                  </div>
                </div>

                {/* Biografia / Sobre mim */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resumo Profissional / Biografia
                  </label>
                  <Textarea
                    rows={3}
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Fale brevemente sobre sua atuação e aspirações..."
                  />
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="submit" form="perfil-form" disabled={loading} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4" /> {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
