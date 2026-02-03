import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { loadDatabase, saveDatabase } from './storage';
import type { Incident } from '@/types/incident';
import type { Risk } from '@/types/risk';

const withLatency = async () => {
  const delay = 300 + Math.random() * 600;
  await new Promise((resolve) => setTimeout(resolve, delay));
};

const maybeError = () => {
  const roll = Math.random();
  if (roll < 0.05) {
    return { status: 500, message: 'Error interno del servidor' };
  }
  if (roll < 0.1) {
    return { status: 403, message: 'Acceso denegado para el rol actual' };
  }
  return null;
};

const ok = <T>(data: T, status = 200): AxiosResponse<T> => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {}
});

const parseBody = <T>(config: AxiosRequestConfig): T => {
  if (!config.data) return {} as T;
  if (typeof config.data === 'string') return JSON.parse(config.data) as T;
  return config.data as T;
};

export const mockAdapter = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  await withLatency();
  const error = maybeError();
  if (error) {
    return Promise.reject({ response: { status: error.status, data: { message: error.message } } });
  }

  const db = loadDatabase();
  const { url = '', method = 'get' } = config;

  if (url.startsWith('/incidents')) {
    if (method === 'get') {
      return ok(db.incidents);
    }
    if (method === 'post') {
      const payload = parseBody<Incident>(config);
      db.incidents.unshift(payload);
      saveDatabase(db);
      return ok(payload, 201);
    }
    if (method === 'put') {
      const payload = parseBody<Incident>(config);
      db.incidents = db.incidents.map((item) => (item.id === payload.id ? payload : item));
      saveDatabase(db);
      return ok(payload);
    }
  }

  if (url.startsWith('/risks')) {
    if (method === 'get') {
      return ok(db.risks);
    }
    if (method === 'post') {
      const payload = parseBody<Risk>(config);
      db.risks.unshift(payload);
      saveDatabase(db);
      return ok(payload, 201);
    }
    if (method === 'put') {
      const payload = parseBody<Risk>(config);
      db.risks = db.risks.map((item) => (item.id === payload.id ? payload : item));
      saveDatabase(db);
      return ok(payload);
    }
  }

  return ok({ message: 'Ruta mock no implementada' }, 404);
};
