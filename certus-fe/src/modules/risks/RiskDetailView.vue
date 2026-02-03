<template>
  <div class="d-flex align-center justify-space-between mb-6">
    <div>
      <div class="text-h5 font-weight-bold">Riesgo {{ risk?.id }}</div>
      <div class="text-body-2 text-medium-emphasis">{{ risk?.titulo }}</div>
    </div>
    <v-btn variant="text" :to="`/riesgos/${risk?.id}/editar`" prepend-icon="mdi-pencil">Editar</v-btn>
  </div>

  <v-card class="pa-6" variant="outlined">
    <v-row dense>
      <v-col cols="12" md="6">
        <div class="text-caption text-medium-emphasis">Severidad</div>
        <div class="text-body-1">{{ risk?.severidad }}</div>
      </v-col>
      <v-col cols="12" md="6">
        <div class="text-caption text-medium-emphasis">Estado</div>
        <div class="text-body-1">{{ risk?.estado }}</div>
      </v-col>
      <v-col cols="12">
        <div class="text-caption text-medium-emphasis">Descripción</div>
        <div class="text-body-1">{{ risk?.descripcion }}</div>
      </v-col>
    </v-row>
    <v-divider class="my-4" />
    <div class="text-subtitle-2">Incidentes asociados</div>
    <v-chip v-for="inc in risk?.incidentes" :key="inc" class="ma-1" size="small">
      {{ inc }}
    </v-chip>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRiskStore } from '@/stores/risks';

const route = useRoute();
const riskStore = useRiskStore();

onMounted(() => riskStore.fetchAll());

const risk = computed(() => riskStore.items.find((item) => item.id === route.params.id));
</script>
