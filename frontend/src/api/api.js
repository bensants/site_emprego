import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para logs ou tratamentos em desenvolvimento
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na requisição Axios:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

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
