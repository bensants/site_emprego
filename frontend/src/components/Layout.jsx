import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Search, FileText, FileSignature, Users,
  Video, Scale, Bell, Menu, X, MapPin, LogOut, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
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

function Brand() {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Óbidos Conect — início">
      <img src="/img/icone.jpg" alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-white/20" />
      <div className="min-w-0">
        <span className="block text-sm font-bold text-blue-100">Óbidos Conect</span>
        <span className="flex items-center gap-1 text-[10px] tracking-wider text-blue-300"><MapPin className="h-3 w-3" /> ÓBIDOS · PARÁ</span>
      </div>
    </Link>
  );
}

export default function Layout() {
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const notificationRef = useRef(null);
  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    setNotificationOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onPointer = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setNotificationOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setNotificationOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // O dialog nativo mantém o foco no menu e bloqueia a interação com o fundo.
  useEffect(() => {
    const dialog = drawerRef.current;
    if (!mobileMenuOpen) {
      if (dialog.open) dialog.close();
      return;
    }
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      menuButtonRef.current?.focus();
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onResize = () => { if (desktop.matches) setMobileMenuOpen(false); };
    desktop.addEventListener('change', onResize);
    return () => desktop.removeEventListener('change', onResize);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/oportunidades?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };
  const getInitials = (name) => {
    const parts = (name || 'Óbidos Conect').trim().split(/\s+/);
    return (parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts.at(-1)[0]).toUpperCase();
  };
  const handleLogout = () => { logout(); navigate('/'); };

  const navigation = (mobile = false) => (
    <nav aria-label={mobile ? 'Navegação móvel' : 'Navegação principal'} className="space-y-6">
      {[['Principal', primaryNavItems], ['Recursos e serviços', secondaryNavItems]].map(([label, items]) => (
        <div key={label}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
          <div className="space-y-1">
            {items.map(({ name, path, icon: Icon }) => (
              <NavLink key={path} to={path} end={path === '/'} onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => cn('flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-300 hover:bg-white/10 hover:text-white')}>
                <Icon className="h-4 w-4 shrink-0" /><span>{name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
      {!isAuthenticated && <Link to="/registro" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white">Cadastre-se gratuitamente</Link>}
    </nav>
  );

  return (
    <div className={cn("app-shell text-slate-100 selection:bg-blue-600 selection:text-white", sidebarPinned && "sidebar-pinned")}>
      <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
      <div className="fixed inset-0 -z-20 bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('/img/login-bg.jpg')" }} />
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-slate-950/90 via-slate-900/80 to-blue-950/70 backdrop-blur-[2px] pointer-events-none" />

      <aside id="desktop-navigation" className="desktop-sidebar border-r border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="border-b border-white/10 p-5"><Brand /></div>
        <div className="sidebar-scroll p-4">{navigation()}</div>
      </aside>

      <div className="app-workspace">
        <header className="sticky top-0 z-40 border-b border-white/15 bg-slate-950/90 backdrop-blur-xl">
          <div className="app-topbar">
            <div className="flex min-w-0 items-center gap-2">
              <button type="button" onClick={() => setSidebarPinned(!sidebarPinned)}
                className="hidden shrink-0 rounded-xl p-2 hover:bg-white/10 lg:inline-flex"
                aria-label={sidebarPinned ? 'Ocultar automaticamente a sidebar' : 'Fixar sidebar aberta'}
                title={sidebarPinned ? 'Ocultar automaticamente a sidebar' : 'Fixar sidebar aberta'}
                aria-pressed={sidebarPinned} aria-controls="desktop-navigation">
                <Menu className="h-6 w-6" />
              </button>
              <button ref={menuButtonRef} type="button" onClick={() => setMobileMenuOpen(true)}
                className="rounded-xl p-2 hover:bg-white/10 lg:hidden" aria-label="Abrir menu" aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">
                <Menu className="h-6 w-6" />
              </button>
              <span className="truncate text-sm font-semibold text-blue-100 lg:hidden">Óbidos Conect</span>
              <form onSubmit={handleSearchSubmit} className="relative hidden w-full max-w-sm md:block">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input type="search" aria-label="Buscar oportunidades" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Buscar em Óbidos..." className="w-full rounded-xl border border-white/15 bg-white/10 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </form>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative rounded-xl p-2 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Notificações"
                aria-expanded={notificationOpen}
                aria-controls="notification-panel"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              </button>

              {/* Notification Popover */}
              {notificationOpen && (
                <div id="notification-panel" className="notification-panel rounded-2xl border border-white/15 bg-slate-900/95 backdrop-blur-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
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
                  className="hidden sm:inline-flex whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-600/30 transition-all hover:scale-105"
                >
                  Cadastre-se
                </Link>
              </div>
            )}


            </div>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="app-content"><Outlet /></main>
        <footer className="border-t border-white/15 bg-slate-950/70 px-4 py-6 text-center text-xs text-slate-400">
          <p>Óbidos Conect © 2026 · Baixo Amazonas, Pará · Conectando Oportunidades & Talentos</p>
          <p className="mt-2 text-[11px]">Em conformidade com a LGPD (Lei nº 13.709/2018)</p>
        </footer>
      </div>

      <dialog ref={drawerRef} id="mobile-navigation" aria-labelledby="mobile-navigation-title" className="mobile-drawer"
        onCancel={() => setMobileMenuOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) setMobileMenuOpen(false); }}>
        <div className="flex min-h-full flex-col p-4">
          <div className="mb-5 flex items-center justify-between gap-2">
            <h2 id="mobile-navigation-title" className="text-base font-bold">Menu · Óbidos Conect</h2>
            <button autoFocus type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu" className="rounded-xl p-2 hover:bg-white/10"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={handleSearchSubmit} className="mb-5">
            <input type="search" aria-label="Buscar oportunidades no menu" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar oportunidades..." className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </form>
          {navigation(true)}
        </div>
      </dialog>
    </div>
  );
}
