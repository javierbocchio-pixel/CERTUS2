<template>
  <div class="d-flex align-center justify-space-between mb-6">
    <div>
      <div class="text-h5 font-weight-bold">
        {{ isEdit ? 'Editar incidente' : 'Nuevo incidente' }}
      </div>
      <div class="text-body-2 text-medium-emphasis">
        Completá los pasos para registrar el incidente
      </div>
    </div>
    <v-btn variant="text" to="/incidentes" prepend-icon="mdi-arrow-left">Volver</v-btn>
  </div>

  <v-card class="pa-6" variant="outlined">
    <WizardForm v-model="currentStep" :steps="steps" @complete="handleSubmit">
      <template #step-1>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field v-model="values.titulo" label="Título" :error-messages="errors.titulo" />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="values.tipo"
              :items="tipoOptions"
              label="Tipo"
              :error-messages="errors.tipo"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="values.fechaDeteccion"
              label="Fecha detección"
              type="datetime-local"
              :error-messages="errors.fechaDeteccion"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="values.severidad"
              :items="severityOptions"
              label="Severidad"
              :error-messages="errors.severidad"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="values.estado"
              :items="statusOptions"
              label="Estado"
              :error-messages="errors.estado"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="values.activo"
              :items="assetOptions"
              label="Activo"
              :error-messages="errors.activo"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="values.responsable"
              label="Responsable"
              :error-messages="errors.responsable"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="values.descripcion"
              label="Descripción"
              :error-messages="errors.descripcion"
            />
          </v-col>
        </v-row>
      </template>

      <template #step-2>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="values.impacto.confidencialidad"
              label="Confidencialidad (1-5)"
              type="number"
              min="1"
              max="5"
              :error-messages="errors['impacto.confidencialidad']"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="values.impacto.integridad"
              label="Integridad (1-5)"
              type="number"
              min="1"
              max="5"
              :error-messages="errors['impacto.integridad']"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="values.impacto.disponibilidad"
              label="Disponibilidad (1-5)"
              type="number"
              min="1"
              max="5"
              :error-messages="errors['impacto.disponibilidad']"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="values.impacto.evaluacionFinal"
              label="Evaluación de impacto final"
              :error-messages="errors['impacto.evaluacionFinal']"
            />
          </v-col>
        </v-row>
      </template>

      <template #step-3>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-combobox
              v-model="values.riesgos"
              :items="riskOptions"
              label="Riesgos asociados"
              multiple
              chips
            />
            <v-btn variant="text" prepend-icon="mdi-plus" to="/riesgos/nuevo">
              Crear riesgo borrador
            </v-btn>
            <v-alert
              v-if="values.severidad === 'Crítica' && !values.riesgos.length"
              type="warning"
              class="mt-3"
              density="compact"
            >
              Severidad crítica requiere riesgo asociado o creación de riesgo borrador.
            </v-alert>
          </v-col>
          <v-col cols="12" md="6">
            <v-combobox
              v-model="values.controles"
              :items="controlOptions"
              label="Controles ISO"
              multiple
              chips
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-combobox
              v-model="values.acciones"
              :items="actionOptions"
              label="Acciones correctivas / preventivas"
              multiple
              chips
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-combobox
              v-model="values.hallazgos"
              :items="findingOptions"
              label="Hallazgos"
              multiple
              chips
            />
          </v-col>
        </v-row>
      </template>

      <template #step-4>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-textarea v-model="values.accionesInmediatas" label="Acciones inmediatas" />
          </v-col>
          <v-col cols="12" md="6">
            <EvidenceUploader :evidence="values.evidencias" @update="onEvidence" />
          </v-col>
          <v-col cols="12">
            <v-alert type="info" density="compact">
              Checklist para cierre: completar impacto, adjuntar evidencia y definir estado.
            </v-alert>
          </v-col>
        </v-row>
      </template>
    </WizardForm>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useIncidentStore } from '@/stores/incidents';
import { useRiskStore } from '@/stores/risks';
import { useUiStore } from '@/stores/ui';
import { useTenantStore } from '@/stores/tenant';
import type { Incident } from '@/types/incident';
import WizardForm from '@/components/forms/WizardForm.vue';
import EvidenceUploader from '@/components/forms/EvidenceUploader.vue';

const route = useRoute();
const router = useRouter();
const incidentStore = useIncidentStore();
const riskStore = useRiskStore();
const uiStore = useUiStore();
const tenantStore = useTenantStore();

const currentStep = ref(1);
const steps = ['Datos básicos', 'Impacto', 'Vinculaciones', 'Evidencias y cierre'];

const statusOptions = ['Abierto', 'Contenido', 'En análisis', 'Erradicado', 'Recuperado', 'Cerrado'];
const severityOptions = ['Baja', 'Media', 'Alta', 'Crítica'];
const tipoOptions = ['Acceso indebido', 'Malware', 'Fuga de información', 'Phishing', 'Otro'];
const assetOptions = ['Servidor de archivos', 'ERP', 'Laptop Finanzas', 'Correo Corporativo'];
const controlOptions = ['ISO27001-A.9.1', 'ISO27001-A.12.2', 'ISO9001-8.5.1'];
const actionOptions = ['A-001', 'A-002', 'A-003'];
const findingOptions = ['H-001', 'H-002'];

const riskOptions = computed(() => riskStore.items.map((risk) => risk.id));

const schema = z.object({
  titulo: z.string().min(3, 'Título requerido'),
  tipo: z.string().min(1, 'Tipo requerido'),
  fechaDeteccion: z.string().min(1, 'Fecha requerida'),
  severidad: z.enum(['Baja', 'Media', 'Alta', 'Crítica']),
  estado: z.enum(['Abierto', 'Contenido', 'En análisis', 'Erradicado', 'Recuperado', 'Cerrado']),
  activo: z.string().min(1, 'Activo requerido'),
  responsable: z.string().min(1, 'Responsable requerido'),
  descripcion: z.string().min(10, 'Descripción requerida'),
  impacto: z.object({
    confidencialidad: z.number().min(1).max(5).optional(),
    integridad: z.number().min(1).max(5).optional(),
    disponibilidad: z.number().min(1).max(5).optional(),
    evaluacionFinal: z.string().optional()
  }),
  riesgos: z.array(z.string()),
  hallazgos: z.array(z.string()),
  acciones: z.array(z.string()),
  controles: z.array(z.string()),
  accionesInmediatas: z.string().optional(),
  evidencias: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      uploadedAt: z.string(),
      uploader: z.string()
    })
  ),
  auditTrail: z.array(
    z.object({
      id: z.string(),
      actor: z.string(),
      action: z.string(),
      timestamp: z.string(),
      details: z.string().optional()
    })
  )
});

const { handleSubmit, values, errors, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    id: `INC-${Math.floor(Math.random() * 900 + 100)}`,
    titulo: '',
    tipo: '',
    estado: 'Abierto',
    severidad: 'Media',
    activo: '',
    proceso: '',
    responsable: '',
    fechaDeteccion: new Date().toISOString().slice(0, 16),
    ultimaActualizacion: new Date().toISOString(),
    descripcion: '',
    accionesInmediatas: '',
    impacto: {},
    riesgos: [],
    hallazgos: [],
    acciones: [],
    controles: [],
    evidencias: [],
    auditTrail: []
  }
});

const isEdit = computed(() => Boolean(route.params.id));
const canEdit = computed(() => tenantStore.role !== 'Auditor');

onMounted(async () => {
  if (!incidentStore.items.length) {
    await incidentStore.fetchAll();
  }
  await riskStore.fetchAll();
  if (isEdit.value) {
    const incident = incidentStore.items.find((item) => item.id === route.params.id);
    if (incident) {
      setValues({ ...incident });
    }
  }
});

const onEvidence = (evidence: Incident['evidencias']) => {
  values.evidencias = evidence;
};

const requireImpactForClose = () => {
  if (values.estado !== 'Cerrado') return true;
  return (
    !!values.impacto.confidencialidad &&
    !!values.impacto.integridad &&
    !!values.impacto.disponibilidad &&
    !!values.impacto.evaluacionFinal
  );
};

const requireRiskForCritical = () => {
  if (values.severidad !== 'Crítica') return true;
  return values.riesgos.length > 0;
};

const handleSubmit = handleSubmit(async (formValues) => {
  if (!canEdit.value) {
    uiStore.notify('El rol Auditor no puede editar incidentes.', 'warning');
    return;
  }
  if (!requireImpactForClose()) {
    uiStore.notify('Para cerrar, completá impacto y evaluación final.', 'warning');
    return;
  }
  if (!requireRiskForCritical()) {
    uiStore.notify('Incidente crítico requiere riesgo asociado.', 'warning');
    currentStep.value = 3;
    return;
  }

  const payload: Incident = {
    ...formValues,
    ultimaActualizacion: new Date().toISOString(),
    auditTrail: [
      ...(formValues.auditTrail || []),
      {
        id: crypto.randomUUID(),
        actor: 'Usuario Demo',
        action: isEdit.value ? 'Incidente actualizado' : 'Incidente creado',
        timestamp: new Date().toISOString()
      }
    ]
  };

  if (isEdit.value) {
    await incidentStore.update(payload);
  } else {
    await incidentStore.create(payload);
  }

  router.push('/incidentes');
});
</script>
