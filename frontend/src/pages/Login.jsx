import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LogIn,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  MapPin,
  ArrowLeft,
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redireciona se já estiver autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, senha);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Falha ao autenticar. Verifique seu e-mail e senha.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreencherDemo = (demoEmail) => {
    setEmail(demoEmail);
    setSenha('obidos123');
    setError('');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      {/* Imagem de Fundo em Tela Cheia (/img/login-bg.jpg) */}
      <div
        className="
        absolute inset-0 
        bg-cover bg-center 
        bg-no-repeat 
        transition-all 
        duration-700 
        scale-100
        hover:scale-105
        "
        style={{ backgroundImage: "url('/img/login-bg.jpg')" }}
      />

      {/* Overlay com Gradiente Escuro e Efeito de Desfoque Atmosférico */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/85 via-slate-900/70 to-blue-950/60 backdrop-blur-[2px]" />

      {/* Botão de Retorno ao Início no Topo Esquerdo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 text-xs font-semibold shadow-lg transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </Link>
      </div>

      {/* Selo Regional no Topo Direito */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white/90 backdrop-blur-md border border-white/20 text-xs font-medium shadow-lg">
        <MapPin className="w-3.5 h-3.5 text-blue-400" />
        <span>Óbidos · Baixo Amazonas</span>
      </div>

      {/* Card Centralizado em Glassmorphism */}
      <div className="relative z-10 w-full max-w-md my-8 animate-in fade-in zoom-in-95 duration-300">
        <Card className="bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl shadow-black/40 rounded-2xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pb-4 pt-6">
            {/* Ícone de Marca */}
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <Briefcase className="w-6 h-6" />
            </div>

            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                Óbidos Conect
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 mt-1">
                Plataforma de Conexão Profissional Regional
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  E-mail
                </label>
                <Input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 bg-slate-50/80 border-slate-200 text-sm focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Senha
                  </label>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="h-10 bg-slate-50/80 border-slate-200 text-sm focus:bg-white"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-all shadow-md shadow-blue-500/25"
              >
                {loading ? 'Entrando...' : 'Entrar na Plataforma'}
                {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
              </Button>
            </form>

            {/* Atalhos Rápidos para Demonstração */}
            <div className="mt-5 pt-4 border-t border-slate-200/70">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Contas de demonstração para teste rápido:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handlePreencherDemo('maria.pauxis@obidos.com.br')}
                  className="text-left p-2 rounded-lg border border-slate-200/80 bg-slate-50/70 hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-xs"
                >
                  <div className="font-semibold text-slate-800 text-[11px]">Candidata / Maria</div>
                  <div className="text-slate-500 text-[10px] truncate">maria.pauxis@...</div>
                </button>
                <button
                  type="button"
                  onClick={() => handlePreencherDemo('coopao@obidos.com.br')}
                  className="text-left p-2 rounded-lg border border-slate-200/80 bg-slate-50/70 hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-xs"
                >
                  <div className="font-semibold text-slate-800 text-[11px]">Empresa / COOPAO</div>
                  <div className="text-slate-500 text-[10px] truncate">coopao@...</div>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Senha de teste padrão: <span className="font-mono text-slate-600 font-bold">obidos123</span>
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-100 bg-slate-50/50 py-3.5 text-xs text-slate-600">
            Não possui uma conta?{' '}
            <Link to="/registro" className="text-blue-600 font-bold hover:underline ml-1">
              Cadastre-se gratuitamente
            </Link>
          </CardFooter>
        </Card>

        {/* Rodapé LGPD discreto */}
        <p className="text-center text-[11px] text-white/70 mt-4 drop-shadow">
          Óbidos Conect © 2026 · Protegido e em conformidade com a LGPD
        </p>
      </div>
    </div>
  );
}
