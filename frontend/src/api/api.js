// frontend/src/api/api.js
import axios from 'axios';

// URL base da API (Porta 8443 configurada no Docker/host)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor de requisição: injeta o Bearer token JWT em chamadas autenticadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('obidos_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta: tratamento de expiração e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && (localStorage.getItem('obidos_token') || localStorage.getItem('token'))) {
      console.warn('Sessão expirada. Limpando credenciais...');
      localStorage.removeItem('obidos_token');
      localStorage.removeItem('obidos_user');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// ==============================================================================
// SERVIÇOS DA API (EXPORTAÇÕES NOMEADAS ESPERADAS PELOS COMPONENTES REACT)
// ==============================================================================

// Autenticação e Perfis (AuthContext e Perfil)
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials).then((res) => res.data),
  register: (data) => api.post('/auth/register', data).then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data),
  updateMe: (data) => api.put('/auth/me', data).then((res) => res.data),
  getMapa: (params) => api.get('/auth/mapa', { params }).then((res) => res.data),
};

// Endpoints de Usuários e Geolocalização
export const usuariosApi = {
  getMapa: (params) => api.get('/auth/mapa', { params }).then((res) => res.data),
};

// Prestadores de Serviços (Catálogo de MEIs / Autônomos em Óbidos)
export const prestadoresApi = {
  getAll: (params) => api.get('/prestadores', { params }).then((res) => res.data),
  getById: (id) => api.get(`/prestadores/${id}`).then((res) => res.data),
};

// Oportunidades e Demandas Locais
export const oportunidadesApi = {
  getAll: (params) => api.get('/oportunidades', { params }).then((res) => res.data),
  getById: (id) => api.get(`/oportunidades/${id}`).then((res) => res.data),
  create: (data) => api.post('/oportunidades', data).then((res) => res.data),
  update: (id, data) => api.put(`/oportunidades/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/oportunidades/${id}`).then((res) => res.data),
};

// Módulos legados mantidos para garantir a compilação do front
export const curriculosApi = {
  getAll: (params) => api.get('/prestadores', { params }).then((res) => res.data),
  getById: (id) => api.get(`/prestadores/${id}`).then((res) => res.data),
  create: (data) => api.post('/curriculos', data).then((res) => res.data),
  update: (id, data) => api.put(`/curriculos/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/curriculos/${id}`).then((res) => res.data),
};

export const candidaturasApi = {
  apply: (data) => api.post('/candidaturas', data).then((res) => res.data),
  getMinhas: () => api.get('/candidaturas/minhas').then((res) => res.data),
  getByOportunidade: (id) => api.get(`/candidaturas/oportunidade/${id}`).then((res) => res.data),
  updateStatus: (id, data) => api.patch(`/candidaturas/${id}/status`, data).then((res) => res.data),
  agendarEntrevista: (id, data) => api.post(`/candidaturas/${id}/agendar-entrevista`, data).then((res) => res.data),
  cancelar: (id) => api.delete(`/candidaturas/${id}`).then((res) => res.data),
};

export const contratosApi = {
  getAll: (params) => api.get('/contratos', { params }).then((res) => res.data),
  getById: (id) => api.get(`/contratos/${id}`).then((res) => res.data),
  create: (data) => api.post('/contratos', data).then((res) => res.data),
  update: (id, data) => api.put(`/contratos/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/contratos/${id}`).then((res) => res.data),
};

export const comunidadeApi = {
  getAll: (params) => api.get('/comunidade', { params }).then((res) => res.data),
  getById: (id) => api.get(`/comunidade/${id}`).then((res) => res.data),
  create: (data) => api.post('/comunidade', data).then((res) => res.data),
  update: (id, data) => api.put(`/comunidade/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/comunidade/${id}`).then((res) => res.data),
  curtir: (id) => api.post(`/comunidade/${id}/curtir`).then((res) => res.data),
};

export const entrevistasApi = {
  getAll: (params) => api.get('/entrevistas', { params }).then((res) => res.data),
  getById: (id) => api.get(`/entrevistas/${id}`).then((res) => res.data),
  create: (data) => api.post('/entrevistas', data).then((res) => res.data),
  update: (id, data) => api.put(`/entrevistas/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/entrevistas/${id}`).then((res) => res.data),
};

export default api;
