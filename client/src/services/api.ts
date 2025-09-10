import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) => 
    api.post('/auth/register', userData),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  updateProfile: (userData: any) => 
    api.put('/auth/profile', userData),
  
  logout: () => 
    api.post('/auth/logout'),
};

export const hazardAPI = {
  getAll: (params?: any) => 
    api.get('/hazards', { params }),
  
  getById: (id: string) => 
    api.get(`/hazards/${id}`),
  
  create: (hazardData: any) => 
    api.post('/hazards', hazardData),
  
  getUserReports: () => 
    api.get('/hazards/user/my-reports'),
  
  updateStatus: (id: string, status: string, rejectionReason?: string) => 
    api.put(`/hazards/${id}/status`, { status, rejectionReason }),
  
  getStatistics: () => 
    api.get('/hazards/admin/statistics'),
};

export const weatherAPI = {
  getCurrent: (lat: number, lon: number) => 
    api.get('/weather/current', { params: { lat, lon } }),
  
  getForecast: (lat: number, lon: number, days?: number) => 
    api.get('/weather/forecast', { params: { lat, lon, days } }),
  
  getMarine: (lat: number, lon: number) => 
    api.get('/weather/marine', { params: { lat, lon } }),
  
  getAlerts: (location?: string) => 
    api.get('/weather/alerts', { params: { location } }),
  
  createAlert: (alertData: any) => 
    api.post('/weather/alerts', alertData),
  
  getAllAlerts: () => 
    api.get('/weather/admin/alerts'),
  
  getEmergencyNumbers: () => 
    api.get('/weather/emergency'),
};

export default api;
