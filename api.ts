import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/auth/login/access-token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  signup: async (email: string, password: string, fullName: string) => {
    const response = await api.post('/auth/signup', {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },
};

export const routes = {
  submitRoute: async (startLocation: string, endLocation: string, coordinates?: {
    start_lat?: number;
    start_lng?: number;
    end_lat?: number;
    end_lng?: number;
  }) => {
    const response = await api.post('/routes/submit', {
      start_location: startLocation,
      end_location: endLocation,
      ...coordinates,
    });
    return response.data;
  },

  getRouteHistory: async () => {
    const response = await api.get('/routes/history');
    return response.data;
  },

  getMapUrl: async (routeId: number) => {
    const response = await api.get(`/routes/${routeId}/map-url`);
    return response.data;
  },
};

export default api; 