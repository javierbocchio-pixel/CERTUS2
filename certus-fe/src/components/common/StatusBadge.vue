<template>
  <v-chip size="small" :color="color" variant="flat">
    {{ status }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { IncidentStatus } from '@/types/common';
import { statusColor } from '@/utils/formatters';

const props = defineProps<{ status: IncidentStatus }>();

const color = computed(() => statusColor(props.status));
</script>
