<template>
  <div class="d-flex align-center justify-space-between mb-6">
    <div>
      <div class="text-h5 font-weight-bold">{{ isEdit ? 'Editar riesgo' : 'Nuevo riesgo' }}</div>
      <div class="text-body-2 text-medium-emphasis">Registro básico de riesgo</div>
    </div>
    <v-btn variant="text" to="/riesgos" prepend-icon="mdi-arrow-left">Volver</v-btn>
  </div>

  <v-card class="pa-6" variant="outlined">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field v-model="values.titulo" label="Título" />
      </v-col>
      <v-col cols="12" md="6">
        <v-select v-model="values.severidad" :items="severityOptions" label="Severidad" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="values.activo" label="Activo" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="values.propietario" label="Propietario" />
      </v-col>
      <v-col cols="12">
        <v-textarea v-model="values.descripcion" label="Descripción" />
      </v-col>
      <v-col cols="12">
        <v-btn color="primary" @click="submit">Guardar</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useRiskStore } from '@/stores/risks';
import type { Risk } from '@/types/risk';

const route = useRoute();
const router = useRouter();
const riskStore = useRiskStore();

const severityOptions = ['Baja', 'Media', 'Alta', 'Crítica'];

const schema = z.object({
  titulo: z.string().min(3),
  descripcion: z.string().min(5),
  severidad: z.enum(['Baja', 'Media', 'Alta', 'Crítica']),
  activo: z.string().min(1),
  propietario: z.string().min(1),
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

const { values, handleSubmit, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    id: `R-${Math.floor(Math.random() * 900 + 100)}`,
    titulo: '',
    descripcion: '',
    severidad: 'Media',
    activo: '',
    propietario: '',
    estado: 'Borrador',
    incidentes: [],
    hallazgos: [],
    acciones: [],
    controles: [],
    auditTrail: []
  }
});

const isEdit = computed(() => Boolean(route.params.id));

onMounted(async () => {
  if (!riskStore.items.length) {
    await riskStore.fetchAll();
  }
  if (isEdit.value) {
    const risk = riskStore.items.find((item) => item.id === route.params.id);
    if (risk) {
      setValues({ ...risk });
    }
  }
});

const submit = handleSubmit(async (formValues) => {
  const payload: Risk = {
    ...formValues,
    auditTrail: [
      ...(formValues.auditTrail || []),
      {
        id: crypto.randomUUID(),
        actor: 'Usuario Demo',
        action: isEdit.value ? 'Riesgo actualizado' : 'Riesgo creado',
        timestamp: new Date().toISOString()
      }
    ]
  };
  if (isEdit.value) {
    await riskStore.update(payload);
  } else {
    await riskStore.create(payload);
  }
  router.push('/riesgos');
});
</script>
