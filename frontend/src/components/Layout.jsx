// frontend/src/components/Layout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Briefcase,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Button } from './ui/button';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuAberto(false);
  };

  const navLinks = [
    { label: 'Vitrine de Profissionais', path: '/', icon: Users },
    { label: 'Mural de Demandas', path: '/demandas', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Barra de Navegação Superior */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo Regional */}
          <Link to="/" className="flex items-center gap-2 text-emerald-700 font-extrabold text-lg sm:text-xl tracking-tight">
            <span className="bg-emerald-600 text-white p-1.5 rounded-lg">
              <Users className="w-5 h-5" />
            </span>
            Óbidos Conect
          </Link>

          {/* Links de Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const ativo = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    ativo
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Ações de Usuário Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/perfil">
                  <Button variant="outline" size="sm" className="gap-2 border-slate-200 text-slate-700">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>{user?.nome?.split(' ')[0] || 'Meu Painel'}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-700 gap-1.5">
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </Button>
                </Link>
                <Link to="/registro">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm">
                    <UserPlus className="w-4 h-4" />
                    Cadastrar MEI
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Botão de Menu Mobile */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Abrir menu"
          >
            {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Retrátil Mobile */}
        {menuAberto && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const ativo = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuAberto(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      ativo
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/perfil"
                    onClick={() => setMenuAberto(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    Gerenciar Perfil / Visibilidade
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Desconectar
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMenuAberto(false)}>
                    <Button variant="outline" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/registro" onClick={() => setMenuAberto(false)}>
                    <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                      Cadastrar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Conteúdo Principal Renderizado */}
      <main className="flex-1 py-6">
        <Outlet />
      </main>

      {/* Rodapé Alinhado à Conformidade da LGPD */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 Óbidos Conect – Instituto Federal do Pará (IFPA Campus Óbidos).</p>
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacidade garantida conforme Lei nº 13.709/2018 (LGPD)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
