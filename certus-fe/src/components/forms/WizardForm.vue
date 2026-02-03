<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-item
        v-for="(item, index) in steps"
        :key="item"
        :value="index + 1"
        :title="item"
      />
    </v-stepper-header>
    <v-stepper-window>
      <v-stepper-window-item v-for="(item, index) in steps" :key="item" :value="index + 1">
        <slot :name="`step-${index + 1}`" />
      </v-stepper-window-item>
    </v-stepper-window>
    <v-stepper-actions>
      <v-btn variant="text" :disabled="step === 1" @click="step--">Anterior</v-btn>
      <v-spacer />
      <v-btn color="primary" variant="flat" @click="next">{{ step === steps.length ? 'Finalizar' : 'Siguiente' }}</v-btn>
    </v-stepper-actions>
  </v-stepper>
</template>

<script setup lang="ts">
const props = defineProps<{
  steps: string[];
}>();

const step = defineModel<number>({ default: 1 });

const emit = defineEmits<{ (event: 'complete'): void }>();

const next = () => {
  if (step.value >= props.steps.length) {
    emit('complete');
  } else {
    step.value += 1;
  }
};
</script>
