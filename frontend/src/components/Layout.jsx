import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Oportunidades', path: '/oportunidades', icon: Briefcase },
  { name: 'Buscar', path: '/buscar', icon: Search },
  { name: 'Currículos', path: '/curriculos', icon: FileText },
  { name: 'Contratos', path: '/contratos', icon: FileSignature },
  { name: 'Comunidade', path: '/comunidade', icon: Users },
  { name: 'Entrevistas', path: '/entrevistas', icon: Video },
  { name: 'Regulamentações', path: '/regulamentacoes', icon: Scale },
  { name: 'Perfil', path: '/perfil', icon: User },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/oportunidades?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 text-slate-800">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Desktop (w-64 fixa, glassmorphism) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm transition-transform duration-300 lg:translate-x-0 flex flex-col',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Óbidos Connect
              </span>
              <span className="flex items-center text-[10px] font-medium text-slate-500 tracking-wider">
                <MapPin className="h-2.5 w-2.5 mr-0.5 text-blue-600" /> PARÁ · BRASIL
              </span>
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Menu Principal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-blue-700'
                )}
              >
                <Icon
                  className={cn(
                    'h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110',
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                  )}
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Badge */}
        <div className="p-4 border-t border-slate-100">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/80 p-3.5 border border-blue-100/60">
            <div className="flex items-center gap-2 text-blue-800 text-xs font-semibold">
              <span>Conexão Regional</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
              Oeste Paraense integrado: comércio, agropecuária e serviços digitais.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 md:px-8 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-48 sm:w-72 md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar vagas, talentos em Óbidos..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                aria-label="Notificações"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
              </button>

              {/* Notification Popover */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-900">Notificações Regionais</h4>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">3 novas</span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-slate-600">
                    <div className="p-2 rounded-lg bg-blue-50/50 hover:bg-blue-50">
                      <p className="font-semibold text-slate-800">Nova oportunidade cadastrada</p>
                      <p className="text-[11px] text-slate-500">Desenvolvedor(a) Web na COOPAO em Óbidos.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100/80">
                      <p className="font-semibold text-slate-800">Contrato atualizado</p>
                      <p className="text-[11px] text-slate-500">Progresso do contrato Pauxis avançou para 65%.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100/80">
                      <p className="font-semibold text-slate-800">Sala de Entrevista agendada</p>
                      <p className="text-[11px] text-slate-500">Reunião para alinhamento de escopo às 15:00.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill */}
            <NavLink
              to="/perfil"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-slate-200 bg-white/80 hover:bg-slate-50 transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                OB
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-semibold text-slate-800 leading-none">Profissional Óbidos</span>
                <span className="text-[10px] text-slate-500">Óbidos, PA</span>
              </div>
            </NavLink>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Sticky/Fixed Footer */}
        <footer className="border-t border-slate-200/80 bg-white/80 py-4 px-6 text-center text-xs text-slate-500 backdrop-blur-sm">
          <p>Óbidos Conect © 2025 · Em conformidade com a LGPD (Lei nº 13.709/2018)</p>
        </footer>
      </div>
    </div>
  );
}
