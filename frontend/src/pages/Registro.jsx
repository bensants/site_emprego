import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { UserPlus, Lock, Mail, User, Building2, Phone, MapPin, AlertCircle, ArrowRight, Briefcase } from 'lucide-react';

export default function Registro() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [tipo, setTipo] = useState('candidato');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: '',
    bairro: '',
    cidade: 'Óbidos',
    estado: 'PA',
    profissao: '',
    organizacao: '',
    bio: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redireciona se já estiver autenticado
  React.useEffect(() => {
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
        tipo,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Falha ao criar conta. Tente novamente ou use outro e-mail.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 animate-in fade-in duration-300">
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Criar Conta no Óbidos Conect
          </CardTitle>
          <CardDescription>
            Conecte-se com o ecossistema profissional de Óbidos e do Baixo Amazonas.
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

            {/* Seletor de Tipo de Perfil */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tipo de Perfil</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipo('candidato')}
                  className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    tipo === 'candidato'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Profissional / Talento
                </button>

                <button
                  type="button"
                  onClick={() => setTipo('empresa')}
                  className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    tipo === 'empresa'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Empresa / Cooperativa
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {tipo === 'candidato' ? 'Nome Completo' : 'Nome da Empresa / Cooperativa'}
                </label>
                <Input
                  type="text"
                  name="nome"
                  placeholder={tipo === 'candidato' ? 'Ex: João da Silva' : 'Ex: Cooperativa Regional'}
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  E-mail de Contato
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="exemplo@obidos.com.br"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Senha (mínimo 6 dígitos)
                </label>
                <Input
                  type="password"
                  name="senha"
                  placeholder="••••••••"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Telefone / WhatsApp
                </label>
                <Input
                  type="tel"
                  name="telefone"
                  placeholder="(93) 98000-0000"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {tipo === 'candidato' ? 'Profissão / Área de Atuação' : 'Ramo de Atividade'}
                </label>
                <Input
                  type="text"
                  name={tipo === 'candidato' ? 'profissao' : 'organizacao'}
                  placeholder={tipo === 'candidato' ? 'Ex: Mecânico Náutico' : 'Ex: Transporte Fluvial'}
                  value={tipo === 'candidato' ? formData.profissao : formData.organizacao}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Cidade e Estado
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="flex-1"
                  />
                  <Input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-16 text-center uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Endereço (Rua, Número)
                </label>
                <Input
                  type="text"
                  name="endereco"
                  placeholder="Ex: Rua Dr. Picanço Diniz, 142"
                  value={formData.endereco}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Bairro
                </label>
                <Input
                  type="text"
                  name="bairro"
                  placeholder="Ex: Centro, São Francisco, Santa Terezinha"
                  value={formData.bairro}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Resumo / Apresentação
              </label>
              <Textarea
                name="bio"
                placeholder={
                  tipo === 'candidato'
                    ? 'Fale brevemente sobre sua trajetória, experiências e objetivos em Óbidos...'
                    : 'Apresente sua organização, história e áreas de atuação...'
                }
                value={formData.bio}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md hover:shadow"
            >
              {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 pt-4 text-sm text-slate-600">
          Já possui cadastro?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline ml-1">
            Fazer login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
