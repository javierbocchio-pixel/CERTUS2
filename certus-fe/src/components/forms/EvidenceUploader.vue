<template>
  <v-card variant="outlined" class="pa-4">
    <v-file-input
      v-model="files"
      label="Adjuntar evidencias"
      multiple
      prepend-icon="mdi-paperclip"
      @update:model-value="onUpload"
    />
    <v-list density="compact" class="mt-2">
      <v-list-item v-for="file in evidence" :key="file.id">
        <v-list-item-title>{{ file.name }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ file.uploader }} · {{ new Date(file.uploadedAt).toLocaleString('es-AR') }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Evidence } from '@/types/common';

const props = defineProps<{ evidence: Evidence[] }>();
const emit = defineEmits<{ (event: 'update', value: Evidence[]): void }>();

const files = ref<File[]>([]);

const onUpload = (value: File[] | File | null) => {
  if (!value) return;
  const list = Array.isArray(value) ? value : [value];
  const newEvidence = list.map((file) => ({
    id: crypto.randomUUID(),
    name: file.name,
    uploadedAt: new Date().toISOString(),
    uploader: 'Usuario Demo'
  }));
  emit('update', [...props.evidence, ...newEvidence]);
};
</script>
