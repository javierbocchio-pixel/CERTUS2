<template>
  <v-timeline density="compact" align="start">
    <v-timeline-item v-for="event in events" :key="event.id" dot-color="primary">
      <div class="text-subtitle-2">{{ event.action }}</div>
      <div class="text-caption text-medium-emphasis">
        {{ event.actor }} · {{ new Date(event.timestamp).toLocaleString('es-AR') }}
      </div>
      <div v-if="event.details" class="text-body-2">{{ event.details }}</div>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup lang="ts">
import type { AuditEvent } from '@/types/common';

defineProps<{ events: AuditEvent[] }>();
</script>
