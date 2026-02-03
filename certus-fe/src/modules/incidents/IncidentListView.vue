<template>
  <div class="d-flex align-center justify-space-between mb-6">
    <div>
      <div class="text-h5 font-weight-bold">Incidentes</div>
      <div class="text-body-2 text-medium-emphasis">Gestión de incidentes de seguridad</div>
    </div>
    <v-btn color="primary" prepend-icon="mdi-plus" to="/incidentes/nuevo">Nuevo incidente</v-btn>
  </div>

  <KpiCards :kpis="kpiCards" class="mb-6" />

  <FilterBar class="mb-4">
    <v-select
      v-model="filters.estado"
      :items="statusOptions"
      label="Estado"
      density="compact"
      clearable
      style="max-width: 180px"
    />
    <v-select
      v-model="filters.severidad"
      :items="severityOptions"
      label="Severidad"
      density="compact"
      clearable
      style="max-width: 180px"
    />
    <v-text-field
      v-model="filters.tipo"
      label="Tipo"
      density="compact"
      clearable
      style="max-width: 180px"
    />
    <v-text-field
      v-model="filters.activo"
      label="Activo"
      density="compact"
      clearable
      style="max-width: 180px"
    />
    <v-text-field
      v-model="filters.responsable"
      label="Responsable"
      density="compact"
      clearable
      style="max-width: 180px"
    />
    <v-checkbox v-model="filters.soloAbiertos" label="Solo abiertos" density="compact" />
    <v-checkbox v-model="filters.criticos" label="Críticos" density="compact" />
    <template #actions>
      <v-btn variant="text" @click="clearFilters">Limpiar</v-btn>
    </template>
  </FilterBar>

  <DataTable :headers="headers" :items="incidentStore.filtered" :loading="incidentStore.loading">
    <template #severity="{ item }">
      <SeverityBadge :severity="item.severidad" />
    </template>
    <template #status="{ item }">
      <StatusBadge :status="item.estado" />
    </template>
    <template #actions="{ item }">
      <v-btn icon="mdi-eye" variant="text" :to="`/incidentes/${item.id}`" />
      <v-btn
        icon="mdi-pencil"
        variant="text"
        :disabled="!canEdit"
        :to="`/incidentes/${item.id}/editar`"
      />
      <v-btn icon="mdi-check-circle" variant="text" :disabled="!canEdit" @click="openClose(item)" />
    </template>
  </DataTable>

  <ConfirmDialog
    v-model="closeDialog"
    title="Cerrar incidente"
    message="Para cerrar el incidente se requiere evaluación de impacto completa. ¿Deseas continuar?"
    @confirm="confirmClose"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useIncidentStore } from '@/stores/incidents';
import { useUiStore } from '@/stores/ui';
import { useTenantStore } from '@/stores/tenant';
import DataTable from '@/components/common/DataTable.vue';
import FilterBar from '@/components/common/FilterBar.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import SeverityBadge from '@/components/common/SeverityBadge.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import KpiCards from '@/components/common/KpiCards.vue';
import type { Incident } from '@/types/incident';

const incidentStore = useIncidentStore();
const uiStore = useUiStore();
const tenantStore = useTenantStore();

const canEdit = computed(() => tenantStore.role !== 'Auditor');

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Título', key: 'titulo' },
  { title: 'Estado', key: 'status' },
  { title: 'Severidad', key: 'severity' },
  { title: 'Tipo', key: 'tipo' },
  { title: 'Activo', key: 'activo' },
  { title: 'Fecha detección', key: 'fechaDeteccion' },
  { title: 'Responsable', key: 'responsable' },
  { title: 'Última actualización', key: 'ultimaActualizacion' },
  { title: 'Acciones', key: 'actions', sortable: false }
];

const statusOptions = ['Abierto', 'Contenido', 'En análisis', 'Erradicado', 'Recuperado', 'Cerrado'];
const severityOptions = ['Baja', 'Media', 'Alta', 'Crítica'];

const filters = reactive({
  estado: '',
  severidad: '',
  tipo: '',
  activo: '',
  responsable: '',
  soloAbiertos: false,
  criticos: false
});

watch(filters, () => incidentStore.setFilters(filters), { deep: true });

const clearFilters = () => {
  Object.assign(filters, {
    estado: '',
    severidad: '',
    tipo: '',
    activo: '',
    responsable: '',
    soloAbiertos: false,
    criticos: false
  });
};

const kpiCards = computed(() => [
  { label: 'Incidentes abiertos', value: incidentStore.kpis.abiertos },
  { label: 'Críticos abiertos', value: incidentStore.kpis.criticos },
  { label: 'Severidad Alta', value: incidentStore.kpis.severidad?.Alta || 0 },
  { label: 'Severidad Media', value: incidentStore.kpis.severidad?.Media || 0 }
]);

const closeDialog = ref(false);
const selectedIncident = ref<Incident | null>(null);

const openClose = (incident: Incident) => {
  selectedIncident.value = incident;
  closeDialog.value = true;
};

const confirmClose = async () => {
  if (!selectedIncident.value) return;
  const incident = selectedIncident.value;
  const hasImpact =
    incident.impacto?.confidencialidad &&
    incident.impacto?.integridad &&
    incident.impacto?.disponibilidad;
  if (!hasImpact) {
    uiStore.notify('No podés cerrar sin evaluación de impacto completa.', 'warning');
    return;
  }
  await incidentStore.update({
    ...incident,
    estado: 'Cerrado',
    ultimaActualizacion: new Date().toISOString(),
    auditTrail: [
      ...(incident.auditTrail || []),
      {
        id: crypto.randomUUID(),
        actor: 'Usuario Demo',
        action: 'Incidente cerrado',
        timestamp: new Date().toISOString()
      }
    ]
  });
};

onMounted(() => {
  incidentStore.fetchAll();
});
</script>
