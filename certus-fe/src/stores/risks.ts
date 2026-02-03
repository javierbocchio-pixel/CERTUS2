import { defineStore } from 'pinia';
import { riskService } from '@/services/riskService';
import type { Risk } from '@/types/risk';
import { useUiStore } from './ui';

export const useRiskStore = defineStore('risks', {
  state: () => ({
    items: [] as Risk[],
    loading: false
  }),
  actions: {
    async fetchAll() {
      const ui = useUiStore();
      this.loading = true;
      try {
        this.items = await riskService.list();
      } catch (error: any) {
        ui.notify(error?.response?.data?.message || 'Error al cargar riesgos', 'error');
      } finally {
        this.loading = false;
      }
    },
    async create(risk: Risk) {
      const ui = useUiStore();
      try {
        const created = await riskService.create(risk);
        this.items.unshift(created);
        ui.notify('Riesgo creado', 'success');
      } catch (error: any) {
        ui.notify(error?.response?.data?.message || 'Error al crear riesgo', 'error');
        throw error;
      }
    },
    async update(risk: Risk) {
      const ui = useUiStore();
      try {
        const updated = await riskService.update(risk);
        this.items = this.items.map((item) => (item.id === updated.id ? updated : item));
        ui.notify('Riesgo actualizado', 'success');
      } catch (error: any) {
        ui.notify(error?.response?.data?.message || 'Error al actualizar riesgo', 'error');
        throw error;
      }
    }
  }
});
