import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LogIn, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-md mx-auto py-6 animate-in fade-in duration-300">
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Acessar Óbidos Conect
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais para gerenciar vagas, currículos e contratos.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                E-mail
              </label>
              <Input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-400" />
                  Senha
                </label>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md hover:shadow"
            >
              {loading ? 'Entrando...' : 'Entrar na Plataforma'}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          {/* Atalhos Rápidos para Demonstração */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Contas de demonstração para teste:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handlePreencherDemo('mayara.pauxis@obidos.com.br')}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-xs"
              >
                <div className="font-medium text-slate-800">Candidato / Mayara</div>
                <div className="text-slate-500 text-[11px]">mayara.pauxis@...</div>
              </button>
              <button
                type="button"
                onClick={() => handlePreencherDemo('coopao@obidos.com.br')}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-xs"
              >
                <div className="font-medium text-slate-800">Empresa / COOPAO</div>
                <div className="text-slate-500 text-[11px]">coopao@...</div>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 text-center">
              Senha padrão do seed: <span className="font-mono text-slate-600">obidos123</span>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 pt-4 text-sm text-slate-600">
          Não possui uma conta?{' '}
          <Link to="/registro" className="text-blue-600 font-semibold hover:underline ml-1">
            Cadastre-se gratuitamente
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
