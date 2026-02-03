<template>
  <div class="d-flex align-center justify-space-between mb-6">
    <div>
      <div class="text-h5 font-weight-bold">Incidente {{ incident?.id || '' }}</div>
      <div class="text-body-2 text-medium-emphasis">{{ incident?.titulo }}</div>
    </div>
    <div class="d-flex ga-2">
      <v-btn variant="text" :to="`/incidentes/${incident?.id}/editar`" prepend-icon="mdi-pencil">
        Editar
      </v-btn>
      <v-btn
        color="primary"
        prepend-icon="mdi-shield-alert"
        :disabled="!canEdit"
        @click="suggestFinding"
      >
        Crear hallazgo
      </v-btn>
    </div>
  </div>

  <v-card class="pa-6" variant="outlined">
    <v-tabs v-model="tab" color="primary">
      <v-tab value="resumen">Resumen</v-tab>
      <v-tab value="impacto">Impacto</v-tab>
      <v-tab value="acciones">Contención / Acciones</v-tab>
      <v-tab value="vinculos">Vinculaciones</v-tab>
      <v-tab value="evidencias">Evidencias</v-tab>
      <v-tab value="historial">Historial</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="mt-4">
      <v-window-item value="resumen">
        <v-row dense>
          <v-col cols="12" md="4">
            <v-card class="pa-4" variant="tonal">
              <div class="text-caption text-medium-emphasis">Estado</div>
              <StatusBadge v-if="incident" :status="incident.estado" />
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-4" variant="tonal">
              <div class="text-caption text-medium-emphasis">Severidad</div>
              <SeverityBadge v-if="incident" :severity="incident.severidad" />
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-4" variant="tonal">
              <div class="text-caption text-medium-emphasis">Responsable</div>
              <div class="text-body-1">{{ incident?.responsable }}</div>
            </v-card>
          </v-col>
        </v-row>
        <v-alert
          v-if="isRecurrent"
          type="warning"
          class="mt-4"
          density="compact"
        >
          Incidente repetido en los últimos 90 días. Sugerimos elevar el riesgo asociado.
        </v-alert>
      </v-window-item>

      <v-window-item value="impacto">
        <v-list density="compact">
          <v-list-item>
            <v-list-item-title>Confidencialidad</v-list-item-title>
            <v-list-item-subtitle>{{ incident?.impacto.confidencialidad || '-' }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Integridad</v-list-item-title>
            <v-list-item-subtitle>{{ incident?.impacto.integridad || '-' }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Disponibilidad</v-list-item-title>
            <v-list-item-subtitle>{{ incident?.impacto.disponibilidad || '-' }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Evaluación final</v-list-item-title>
            <v-list-item-subtitle>{{ incident?.impacto.evaluacionFinal || 'Pendiente' }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-window-item>

      <v-window-item value="acciones">
        <v-alert type="info" density="compact" class="mb-4">
          Acciones inmediatas: {{ incident?.accionesInmediatas || 'Sin registrar' }}
        </v-alert>
        <v-list density="compact">
          <v-list-item v-for="accion in incident?.acciones" :key="accion">
            <v-list-item-title>{{ accion }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-window-item>

      <v-window-item value="vinculos">
        <v-row dense>
          <v-col cols="12" md="6">
            <v-card class="pa-4" variant="outlined">
              <div class="text-subtitle-2">Riesgos</div>
              <v-chip v-for="risk in incident?.riesgos" :key="risk" class="ma-1" size="small">
                {{ risk }}
              </v-chip>
              <v-btn variant="text" prepend-icon="mdi-plus">Asociar riesgo</v-btn>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-4" variant="outlined">
              <div class="text-subtitle-2">Hallazgos</div>
              <v-chip v-for="finding in incident?.hallazgos" :key="finding" class="ma-1" size="small">
                {{ finding }}
              </v-chip>
              <v-btn variant="text" prepend-icon="mdi-plus">Crear hallazgo</v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item value="evidencias">
        <EvidenceUploader
          v-if="incident && canEdit"
          :evidence="incident.evidencias"
          @update="updateEvidence"
        />
        <v-list v-else density="compact">
          <v-list-item v-for="evidence in incident?.evidencias" :key="evidence.id">
            <v-list-item-title>{{ evidence.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-window-item>

      <v-window-item value="historial">
        <AuditTimeline v-if="incident" :events="incident.auditTrail" />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useIncidentStore } from '@/stores/incidents';
import { useUiStore } from '@/stores/ui';
import { useTenantStore } from '@/stores/tenant';
import StatusBadge from '@/components/common/StatusBadge.vue';
import SeverityBadge from '@/components/common/SeverityBadge.vue';
import EvidenceUploader from '@/components/forms/EvidenceUploader.vue';
import AuditTimeline from '@/components/common/AuditTimeline.vue';
import type { Incident } from '@/types/incident';

const route = useRoute();
const incidentStore = useIncidentStore();
const uiStore = useUiStore();
const tenantStore = useTenantStore();

const tab = ref('resumen');

onMounted(async () => {
  if (!incidentStore.items.length) {
    await incidentStore.fetchAll();
  }
});

const incident = computed(() =>
  incidentStore.items.find((item) => item.id === route.params.id)
);

const canEdit = computed(() => tenantStore.role !== 'Auditor');

const isRecurrent = computed(() => {
  if (!incident.value) return false;
  const ninetyDays = 90 * 24 * 60 * 60 * 1000;
  const targetDate = new Date(incident.value.fechaDeteccion).getTime();
  return incidentStore.items.some(
    (item) =>
      item.id !== incident.value?.id &&
      item.activo === incident.value?.activo &&
      item.tipo === incident.value?.tipo &&
      Math.abs(new Date(item.fechaDeteccion).getTime() - targetDate) <= ninetyDays
  );
});

const suggestFinding = () => {
  if (incident.value?.severidad === 'Crítica') {
    uiStore.notify('Sugerencia: crear hallazgo por severidad crítica.', 'info');
  } else {
    uiStore.notify('Hallazgo sugerido para seguimiento.', 'info');
  }
};

const updateEvidence = async (evidencias: Incident['evidencias']) => {
  if (!incident.value || !canEdit.value) return;
  await incidentStore.update({
    ...incident.value,
    evidencias,
    ultimaActualizacion: new Date().toISOString()
  });
};
</script>
