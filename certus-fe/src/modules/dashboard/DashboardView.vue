<template>
  <div class="d-flex align-center justify-space-between mb-6">
    <div>
      <div class="text-h5 font-weight-bold">Dashboard</div>
      <div class="text-body-2 text-medium-emphasis">Resumen ejecutivo de la seguridad</div>
    </div>
    <v-btn color="primary" prepend-icon="mdi-plus" to="/incidentes/nuevo">Nuevo incidente</v-btn>
  </div>

  <KpiCards :kpis="kpis" class="mb-6" />

  <v-row dense>
    <v-col cols="12" md="6">
      <v-card class="pa-4" variant="outlined">
        <div class="text-subtitle-1 font-weight-medium">Tendencia mensual</div>
        <div class="text-body-2 text-medium-emphasis">
          Placeholder para gráfico de línea (datos mock)
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card class="pa-4" variant="outlined">
        <div class="text-subtitle-1 font-weight-medium">Incidentes por severidad</div>
        <div class="text-body-2 text-medium-emphasis">
          Placeholder para gráfico de barras
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useIncidentStore } from '@/stores/incidents';
import KpiCards from '@/components/common/KpiCards.vue';

const incidentStore = useIncidentStore();

onMounted(() => {
  if (!incidentStore.items.length) {
    incidentStore.fetchAll();
  }
});

const kpis = computed(() => [
  { label: 'Incidentes abiertos', value: incidentStore.kpis.abiertos },
  { label: 'Críticos abiertos', value: incidentStore.kpis.criticos },
  { label: 'Total incidentes', value: incidentStore.items.length },
  { label: 'Severidad alta + crítica', value: (incidentStore.kpis.severidad?.Alta || 0) + (incidentStore.kpis.severidad?.Crítica || 0) }
]);
</script>
