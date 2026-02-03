<template>
  <v-chip size="small" :color="color" variant="flat">
    {{ severity }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Severity } from '@/types/common';
import { severityColor } from '@/utils/formatters';

const props = defineProps<{ severity: Severity }>();

const color = computed(() => severityColor(props.severity));
</script>
