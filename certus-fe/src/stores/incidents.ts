import { defineStore } from 'pinia';
import { incidentService } from '@/services/incidentService';
import type { Incident } from '@/types/incident';
import { useUiStore } from './ui';

interface IncidentFilters {
  estado?: string;
  severidad?: string;
  tipo?: string;
  activo?: string;
  responsable?: string;
  soloAbiertos?: boolean;
  criticos?: boolean;
  desde?: string;
  hasta?: string;
}

export const useIncidentStore = defineStore('incidents', {
  state: () => ({
    items: [] as Incident[],
    loading: false,
    filters: {} as IncidentFilters
  }),
  getters: {
    filtered(state) {
      return state.items.filter((incident) => {
        const { estado, severidad, tipo, activo, responsable, soloAbiertos, criticos, desde, hasta } =
          state.filters;
        const matchesEstado = estado ? incident.estado === estado : true;
        const matchesSeveridad = severidad ? incident.severidad === severidad : true;
        const matchesTipo = tipo ? incident.tipo === tipo : true;
        const matchesActivo = activo ? incident.activo === activo : true;
        const matchesResponsable = responsable ? incident.responsable === responsable : true;
        const matchesSoloAbiertos = soloAbiertos ? incident.estado !== 'Cerrado' : true;
        const matchesCriticos = criticos ? incident.severidad === 'Crítica' : true;
        const matchesDesde = desde ? incident.fechaDeteccion >= desde : true;
        const matchesHasta = hasta ? incident.fechaDeteccion <= hasta : true;
        return (
          matchesEstado &&
          matchesSeveridad &&
          matchesTipo &&
          matchesActivo &&
          matchesResponsable &&
          matchesSoloAbiertos &&
          matchesCriticos &&
          matchesDesde &&
          matchesHasta
        );
      });
    },
    kpis(state) {
      const abiertos = state.items.filter((item) => item.estado !== 'Cerrado');
      const criticos = abiertos.filter((item) => item.severidad === 'Crítica');
      const severidad = state.items.reduce(
        (acc, item) => {
          acc[item.severidad] = (acc[item.severidad] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
      return {
        abiertos: abiertos.length,
        criticos: criticos.length,
        severidad
      };
    }
  },
  actions: {
    async fetchAll() {
      const ui = useUiStore();
      this.loading = true;
      try {
        this.items = await incidentService.list();
      } catch (error: any) {
        ui.notify(error?.response?.data?.message || 'Error al cargar incidentes', 'error');
      } finally {
        this.loading = false;
      }
    },
    async create(incident: Incident) {
      const ui = useUiStore();
      try {
        const created = await incidentService.create(incident);
        this.items.unshift(created);
        ui.notify('Incidente creado correctamente', 'success');
      } catch (error: any) {
        ui.notify(error?.response?.data?.message || 'Error al crear incidente', 'error');
        throw error;
      }
    },
    async update(incident: Incident) {
      const ui = useUiStore();
      try {
        const updated = await incidentService.update(incident);
        this.items = this.items.map((item) => (item.id === updated.id ? updated : item));
        ui.notify('Incidente actualizado', 'success');
      } catch (error: any) {
        ui.notify(error?.response?.data?.message || 'Error al actualizar incidente', 'error');
        throw error;
      }
    },
    setFilters(filters: IncidentFilters) {
      this.filters = { ...this.filters, ...filters };
    }
  }
});
