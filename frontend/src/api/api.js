import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor de requisição: injeta token de autenticação se disponível
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('obidos_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para logs ou tratamento de expiração
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && localStorage.getItem('obidos_token')) {
      // Token expirou ou é inválido
      console.warn('Sessão expirada. Limpando token...');
      localStorage.removeItem('obidos_token');
      localStorage.removeItem('obidos_user');
      // Não redireciona forçadamente para não quebrar leitura de páginas públicas
    }
    console.error('Erro na requisição Axios:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Endpoints de Autenticação
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials).then((res) => res.data),
  register: (data) => api.post('/auth/register', data).then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data),
  updateMe: (data) => api.put('/auth/me', data).then((res) => res.data),
};

// Endpoints de Candidaturas
export const candidaturasApi = {
  apply: (data) => api.post('/candidaturas', data).then((res) => res.data),
  getMinhas: () => api.get('/candidaturas/minhas').then((res) => res.data),
  getByOportunidade: (oportunidadeId) => api.get(`/candidaturas/oportunidade/${oportunidadeId}`).then((res) => res.data),
  updateStatus: (id, data) => api.patch(`/candidaturas/${id}/status`, typeof data === 'string' ? { status: data } : data).then((res) => res.data),
  agendarEntrevista: (id, data) => api.post(`/candidaturas/${id}/agendar-entrevista`, data).then((res) => res.data),
  cancelar: (id) => api.delete(`/candidaturas/${id}`).then((res) => res.data),
};

// Endpoints de Oportunidades
export const oportunidadesApi = {
  getAll: (params) => api.get('/oportunidades', { params }).then((res) => res.data),
  getById: (id) => api.get(`/oportunidades/${id}`).then((res) => res.data),
  create: (data) => api.post('/oportunidades', data).then((res) => res.data),
  update: (id, data) => api.put(`/oportunidades/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/oportunidades/${id}`).then((res) => res.data),
};

// Endpoints de Currículos
export const curriculosApi = {
  getAll: (params) => api.get('/curriculos', { params }).then((res) => res.data),
  getById: (id) => api.get(`/curriculos/${id}`).then((res) => res.data),
  create: (data) => api.post('/curriculos', data).then((res) => res.data),
  update: (id, data) => api.put(`/curriculos/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/curriculos/${id}`).then((res) => res.data),
};

// Endpoints de Contratos
export const contratosApi = {
  getAll: (params) => api.get('/contratos', { params }).then((res) => res.data),
  getById: (id) => api.get(`/contratos/${id}`).then((res) => res.data),
  create: (data) => api.post('/contratos', data).then((res) => res.data),
  update: (id, data) => api.put(`/contratos/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/contratos/${id}`).then((res) => res.data),
};

// Endpoints de Comunidade
export const comunidadeApi = {
  getAll: (params) => api.get('/comunidade', { params }).then((res) => res.data),
  getById: (id) => api.get(`/comunidade/${id}`).then((res) => res.data),
  create: (data) => api.post('/comunidade', data).then((res) => res.data),
  update: (id, data) => api.put(`/comunidade/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/comunidade/${id}`).then((res) => res.data),
  curtir: (id) => api.post(`/comunidade/${id}/curtir`).then((res) => res.data),
};

// Endpoints de Entrevistas
export const entrevistasApi = {
  getAll: (params) => api.get('/entrevistas', { params }).then((res) => res.data),
  getById: (id) => api.get(`/entrevistas/${id}`).then((res) => res.data),
  create: (data) => api.post('/entrevistas', data).then((res) => res.data),
  update: (id, data) => api.put(`/entrevistas/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/entrevistas/${id}`).then((res) => res.data),
};

export default api;
