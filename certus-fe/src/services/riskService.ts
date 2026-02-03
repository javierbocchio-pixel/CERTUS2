import { apiClient } from './apiClient';
import { mockAdapter } from '@/mock/adapter';
import type { Risk } from '@/types/risk';

export const riskService = {
  async list() {
    const response = await apiClient.request<Risk[]>({
      method: 'get',
      url: '/risks',
      adapter: mockAdapter
    });
    return response.data;
  },
  async create(risk: Risk) {
    const response = await apiClient.request<Risk>({
      method: 'post',
      url: '/risks',
      data: risk,
      adapter: mockAdapter
    });
    return response.data;
  },
  async update(risk: Risk) {
    const response = await apiClient.request<Risk>({
      method: 'put',
      url: '/risks',
      data: risk,
      adapter: mockAdapter
    });
    return response.data;
  }
};
