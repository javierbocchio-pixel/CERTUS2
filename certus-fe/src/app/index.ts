import type { App as VueApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '@/router';
import { vuetify } from './vuetify';

export function registerPlugins(app: VueApp) {
  app.use(createPinia());
  app.use(router);
  app.use(vuetify);
}
