// frontend/src/pages/Registro.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Briefcase, Building2, AlertCircle, ArrowRight } from 'lucide-react';

export default function Registro() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [tipo, setTipo] = useState('prestador');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    cidade: 'Óbidos',
    estado: 'PA',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.senha.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await register({
        ...formData,
        tipo, // 'prestador' ou 'contratante' (alinhado com o backend)
      });
      // Após o cadastro, se for prestador, redireciona para o perfil para ele preencher a vitrine
      navigate(tipo === 'prestador' ? '/perfil' : '/', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Falha ao criar conta. Tente novamente ou use outro e-mail.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 animate-in fade-in duration-300">
      <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="space-y-2 text-center bg-slate-50 border-b border-slate-100 pb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 shadow-sm">
            <UserPlus className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
            Cadastro no Óbidos Conect
          </CardTitle>
          <CardDescription className="text-slate-500">
            Junte-se à rede de serviços e oportunidades do Baixo Amazonas.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Seletor de Tipo de Usuário (Alinhado à Monografia) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Como você deseja usar a plataforma?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipo('prestador')}
                  className={`p-4 rounded-xl border-2 text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                    tipo === 'prestador'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                      : 'border-slate-200 hover:border-emerald-200 text-slate-500 bg-white'
                  }`}
                >
                  <Briefcase className={`w-6 h-6 ${tipo === 'prestador' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  Prestador Autônomo / MEI
                </button>

                <button
                  type="button"
                  onClick={() => setTipo('contratante')}
                  className={`p-4 rounded-xl border-2 text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                    tipo === 'contratante'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                      : 'border-slate-200 hover:border-emerald-200 text-slate-500 bg-white'
                  }`}
                >
                  <Building2 className={`w-6 h-6 ${tipo === 'contratante' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  Tomador de Serviços
                </button>
              </div>
            </div>

            {/* Campos de Dados Básicos */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nome Completo
                </label>
                <Input
                  name="nome"
                  required
                  placeholder="Digite seu nome ou razão social..."
                  value={formData.nome}
                  onChange={handleChange}
                  className="rounded-xl h-11"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    E-mail de Acesso
                  </label>
                  <Input
                    type="email"
                    name="email"
                    required
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <Input
                    name="telefone"
                    required
                    placeholder="(93) 90000-0000"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Crie uma Senha
                </label>
                <Input
                  type="password"
                  name="senha"
                  required
                  placeholder="Mínimo de 6 caracteres"
                  value={formData.senha}
                  onChange={handleChange}
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm text-sm font-bold gap-2 mt-2"
            >
              {loading ? 'Processando Cadastro...' : 'Criar minha Conta'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Já possui cadastro na plataforma?{' '}
            <Link to="/login" className="text-emerald-700 font-bold hover:underline">
              Fazer Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
