import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api'
});

apiClient.interceptors.request.use((config) => {
  const tenantCode =
    localStorage.getItem('tenantCode') || import.meta.env.VITE_TENANT_CODE || 'demo';
  config.headers = {
    ...config.headers,
    'X-Tenant-Code': tenantCode
  };
  return config;
});
