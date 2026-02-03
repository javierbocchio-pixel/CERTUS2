<template>
  <v-row dense>
    <v-col v-for="kpi in kpis" :key="kpi.label" cols="12" md="3">
      <v-card class="pa-4" variant="tonal">
        <div class="text-caption text-medium-emphasis">{{ kpi.label }}</div>
        <div class="text-h5 font-weight-bold">{{ kpi.value }}</div>
        <div v-if="kpi.helper" class="text-caption text-medium-emphasis">
          {{ kpi.helper }}
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  kpis: Array<{ label: string; value: string | number; helper?: string }>;
}>();
</script>
