<template>
  <v-card class="pa-4" variant="tonal">
    <div class="d-flex flex-wrap ga-4 align-center">
      <slot />
      <v-spacer />
      <slot name="actions" />
    </div>
  </v-card>
</template>
