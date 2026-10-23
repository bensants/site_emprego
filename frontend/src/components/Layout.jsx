import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Search,
  FileText,
  FileSignature,
  Users,
  Video,
  Scale,
  User,
  Bell,
  Menu,
  X,
  MapPin,
  LogOut,
  LogIn,
  UserPlus,
  UserCheck,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

const primaryNavItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Oportunidades', path: '/oportunidades', icon: Briefcase },
  { name: 'Candidaturas', path: '/candidaturas', icon: UserCheck },
  { name: 'Buscar Talentos', path: '/buscar', icon: Search },
  { name: 'Mapa Regional', path: '/mapa', icon: MapPin },
];

const secondaryNavItems = [
  { name: 'Currículos', path: '/curriculos', icon: FileText, desc: 'Perfis e talentos cadastrados' },
  { name: 'Contratos', path: '/contratos', icon: FileSignature, desc: 'Demandas e acordos formais' },
  { name: 'Comunidade', path: '/comunidade', icon: Users, desc: 'Fórum regional e discussões' },
  { name: 'Salas de Entrevista', path: '/entrevistas', icon: Video, desc: 'Reuniões e conferências' },
  { name: 'Regulamentações', path: '/regulamentacoes', icon: Scale, desc: 'Normas legais e LGPD' },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const moreMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Fecha menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fecha dropdowns na troca de rota
  useEffect(() => {
    setMoreMenuOpen(false);
    setNotificationOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/oportunidades?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'OB';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isSecondaryActive = secondaryNavItems.some((item) => location.pathname === item.path);

  return (
    <div className="relative min-h-screen flex flex-col text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* 1. Fundo Fotográfico Imersivo Fixo (o mesmo da tela de login) */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-20 pointer-events-none transition-transform duration-1000"
        style={{ backgroundImage: "url('/img/login-bg.jpg')" }}
      />

      {/* 2. Overlay Atmosférico com Gradiente Escuro e Desfoque */}
      <div className="fixed inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/80 to-blue-950/70 backdrop-blur-[2px] -z-10 pointer-events-none" />

      {/* 3. Topbar Glassmorphic Superior Centralizada */}
      <header className="sticky top-0 z-40 w-full border-b border-white/15 bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-black/30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Logo e Selo Regional (Esquerda) */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/img/icone.jpg"
                alt="Óbidos Conect"
                className="h-10 w-10 rounded-xl object-cover shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform ring-1 ring-white/20"
              />
              <div className="hidden sm:block text-left">
                <span className="text-base font-bold tracking-tight bg-gradient-to-r from-blue-300 via-indigo-200 to-white bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-white transition-all">
                  Óbidos Conect
                </span>
                <span className="flex items-center text-[10px] font-medium text-blue-300 tracking-wider">
                  <MapPin className="h-2.5 w-2.5 mr-0.5 text-blue-400" /> ÓBIDOS · PARÁ
                </span>
              </div>
            </Link>
          </div>

          {/* Navegação Principal Centralizada (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold scale-[1.02]'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            {/* Dropdown "Recursos / Serviços" */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200',
                  isSecondaryActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                )}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Mais Recursos</span>
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', moreMenuOpen && 'rotate-180')} />
              </button>

              {/* Menu Dropdown Translúcido */}
              {moreMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/15 bg-slate-900/95 backdrop-blur-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10">
                    Serviços Regionais
                  </div>
                  <div className="mt-1 space-y-1">
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMoreMenuOpen(false)}
                          className={cn(
                            'flex items-start gap-3 p-2.5 rounded-xl text-xs transition-colors',
                            isActive
                              ? 'bg-blue-600/80 text-white font-semibold'
                              : 'text-slate-200 hover:bg-white/10 hover:text-white'
                          )}
                        >
                          <Icon className="h-4 w-4 mt-0.5 text-blue-400 shrink-0" />
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-[10px] text-slate-400">{item.desc}</p>
                          </div>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Busca, Notificações e Perfil do Usuário (Direita) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-44 xl:w-60">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar em Óbidos..."
                className="w-full rounded-xl border border-white/15 bg-white/10 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-slate-400 backdrop-blur-md focus:border-blue-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </form>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative rounded-xl p-2 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Notificações"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              </button>

              {/* Notification Popover */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/15 bg-slate-900/95 backdrop-blur-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h4 className="text-sm font-semibold text-white">Notificações Regionais</h4>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-medium border border-blue-500/30">
                      3 novas
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-slate-300">
                    <div className="p-2.5 rounded-xl bg-blue-900/20 border border-blue-500/20 hover:bg-blue-900/30 transition-colors">
                      <p className="font-semibold text-white">Nova oportunidade cadastrada</p>
                      <p className="text-[11px] text-slate-300">Desenvolvedor(a) Web na COOPAO em Óbidos.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <p className="font-semibold text-white">Contrato atualizado</p>
                      <p className="text-[11px] text-slate-300">Progresso do contrato Pauxis avançou para 65%.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <p className="font-semibold text-white">Sala de Entrevista agendada</p>
                      <p className="text-[11px] text-slate-300">Reunião para alinhamento de escopo às 15:00.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Área de Autenticação */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/perfil"
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors shadow-sm backdrop-blur-md"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {getInitials(user.nome)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="block text-xs font-semibold text-white leading-none truncate max-w-[110px]">
                      {user.nome}
                    </span>
                    <span className="text-[9px] text-blue-300 font-medium capitalize">
                      {user.tipo === 'empresa' ? 'Empresa' : user.tipo === 'admin' ? 'Admin' : 'Candidato'}
                    </span>
                  </div>
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sair da conta"
                  className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                >
                  Entrar
                </Link>
                <Link
                  to="/registro"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-600/30 transition-all hover:scale-105"
                >
                  Cadastre-se
                </Link>
              </div>
            )}

            {/* Botão de Toggle Mobile */}
            <button
              type="button"
              className="rounded-xl p-2 text-slate-300 hover:text-white hover:bg-white/10 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 z-50 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 overflow-y-auto p-4 animate-in fade-in duration-200">
            {/* Quick Search Mobile */}
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar vagas e serviços em Óbidos..."
                className="w-full rounded-xl border border-white/15 bg-white/10 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
              />
            </form>

            <div className="space-y-4">
              <div>
                <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Navegação Principal
                </p>
                <div className="space-y-1">
                  {primaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                          isActive
                            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                            : 'text-slate-200 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Recursos & Serviços
                </p>
                <div className="space-y-1">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                          isActive
                            ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                            : 'text-slate-200 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* Botões Mobile se não autenticado */}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 px-4 text-sm font-semibold rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  >
                    Entrar na Conta
                  </Link>
                  <Link
                    to="/registro"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 px-4 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/30"
                  >
                    Cadastre-se Gratuitamente
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 4. Corpo Centralizado da Aplicação SPA */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Outlet />
      </main>

      {/* 5. Rodapé Centralizado com Glassmorphism */}
      <footer className="mt-auto border-t border-white/15 bg-slate-950/70 backdrop-blur-xl py-6 px-4 text-center text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>Óbidos Conect © 2026 · Baixo Amazonas, Pará · Conectando Oportunidades & Talentos</p>
          <p className="text-[11px] text-slate-500">
            Em conformidade com a LGPD (Lei nº 13.709/2018)
          </p>
        </div>
      </footer>
    </div>
  );
}
