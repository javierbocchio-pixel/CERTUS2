<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    item-key="id"
    class="elevation-0"
  >
    <template #item.actions="{ item }">
      <slot name="actions" :item="item" />
    </template>
    <template #item.status="{ item }">
      <slot name="status" :item="item" />
    </template>
    <template #item.severity="{ item }">
      <slot name="severity" :item="item" />
    </template>
    <template #no-data>
      <v-empty-state
        icon="mdi-alert-circle-outline"
        title="Sin resultados"
        text="No encontramos registros para los filtros aplicados."
      />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
interface Header {
  title: string;
  key: string;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
}

defineProps<{
  headers: Header[];
  items: unknown[];
  loading?: boolean;
}>();
</script>
