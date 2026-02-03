import { apiClient } from './apiClient';
import { mockAdapter } from '@/mock/adapter';
import type { Incident } from '@/types/incident';

export const incidentService = {
  async list() {
    const response = await apiClient.request<Incident[]>({
      method: 'get',
      url: '/incidents',
      adapter: mockAdapter
    });
    return response.data;
  },
  async create(incident: Incident) {
    const response = await apiClient.request<Incident>({
      method: 'post',
      url: '/incidents',
      data: incident,
      adapter: mockAdapter
    });
    return response.data;
  },
  async update(incident: Incident) {
    const response = await apiClient.request<Incident>({
      method: 'put',
      url: '/incidents',
      data: incident,
      adapter: mockAdapter
    });
    return response.data;
  }
};
