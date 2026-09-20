import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Oportunidades from './pages/Oportunidades';
import BuscarProfissionais from './pages/BuscarProfissionais';
import Curriculos from './pages/Curriculos';
import Contratos from './pages/Contratos';
import Comunidade from './pages/Comunidade';
import Entrevistas from './pages/Entrevistas';
import Regulamentacoes from './pages/Regulamentacoes';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import Registro from './pages/Registro';
import MinhasCandidaturas from './pages/MinhasCandidaturas';

import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" richColors closeButton />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="oportunidades" element={<Oportunidades />} />
              <Route path="candidaturas" element={<MinhasCandidaturas />} />
              <Route path="buscar" element={<BuscarProfissionais />} />
              <Route path="curriculos" element={<Curriculos />} />
              <Route path="contratos" element={<Contratos />} />
              <Route path="comunidade" element={<Comunidade />} />
              <Route path="entrevistas" element={<Entrevistas />} />
              <Route path="regulamentacoes" element={<Regulamentacoes />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="login" element={<Login />} />
              <Route path="registro" element={<Registro />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
