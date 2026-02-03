<template>
  <v-dialog v-model="model" max-width="420">
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="cancel">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="confirm">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ required: true });

const props = defineProps<{
  title: string;
  message: string;
}>();

const emit = defineEmits<{ (event: 'confirm'): void }>();

const cancel = () => {
  model.value = false;
};

const confirm = () => {
  emit('confirm');
  model.value = false;
};
</script>
