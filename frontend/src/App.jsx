// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Páginas homologadas conforme o TCC
import BuscarProfissionais from './pages/BuscarProfissionais';
import Oportunidades from './pages/Oportunidades';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Componente para rotas que exigem login prévio (Painel de edição / Visibilidade)
function RotaProtegida({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Todas as rotas centralizadas no Layout Geral com o background unificado da SPA */}
            <Route path="/" element={<Layout />}>
              {/* Vitrine Pública de MEIs (RF-03) - Rota Padrão Aberta */}
              <Route index element={<BuscarProfissionais />} />
              <Route path="buscar" element={<BuscarProfissionais />} />

              {/* Mural de Demandas / Bicos Locais (RF-04) */}
              <Route path="demandas" element={<Oportunidades />} />

              {/* Autenticação (RF-01) */}
              <Route path="login" element={<Login />} />
              <Route path="registro" element={<Registro />} />

              {/* Gestão de Perfil e Visibilidade LGPD (RF-02 e RF-05) */}
              <Route
                path="perfil"
                element={
                  <RotaProtegida>
                    <Perfil />
                  </RotaProtegida>
                }
              />

              {/* Redirecionamento de rotas legadas ou inexistentes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
