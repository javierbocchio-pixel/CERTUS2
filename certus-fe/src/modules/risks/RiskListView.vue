<template>
  <div class="d-flex align-center justify-space-between mb-6">
    <div>
      <div class="text-h5 font-weight-bold">Riesgos</div>
      <div class="text-body-2 text-medium-emphasis">Gestión de riesgos vinculados</div>
    </div>
    <v-btn color="primary" prepend-icon="mdi-plus" to="/riesgos/nuevo">Nuevo riesgo</v-btn>
  </div>

  <DataTable :headers="headers" :items="riskStore.items" :loading="riskStore.loading">
    <template #actions="{ item }">
      <v-btn icon="mdi-eye" variant="text" :to="`/riesgos/${item.id}`" />
      <v-btn icon="mdi-pencil" variant="text" :to="`/riesgos/${item.id}/editar`" />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import DataTable from '@/components/common/DataTable.vue';
import { useRiskStore } from '@/stores/risks';

const riskStore = useRiskStore();

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Título', key: 'titulo' },
  { title: 'Severidad', key: 'severidad' },
  { title: 'Activo', key: 'activo' },
  { title: 'Propietario', key: 'propietario' },
  { title: 'Estado', key: 'estado' },
  { title: 'Acciones', key: 'actions', sortable: false }
];

onMounted(() => riskStore.fetchAll());
</script>
