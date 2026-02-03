<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" permanent width="260">
      <v-list density="compact" nav>
        <v-list-item title="Certus" subtitle="Gestión integrada" />
        <v-divider class="my-2" />
        <v-list-item
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar elevation="0" color="surface" border>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-breadcrumbs :items="breadcrumbs" class="pl-2" />
      <v-spacer />
      <v-text-field
        density="compact"
        prepend-inner-icon="mdi-magnify"
        placeholder="Buscar..."
        variant="solo"
        hide-details
        class="mr-4"
        style="max-width: 220px"
      />
      <v-select
        v-model="tenantCode"
        :items="tenants"
        density="compact"
        variant="outlined"
        hide-details
        class="mr-4"
        style="max-width: 150px"
        label="Tenant"
      />
      <v-select
        v-model="role"
        :items="roles"
        density="compact"
        variant="outlined"
        hide-details
        class="mr-4"
        style="max-width: 150px"
        label="Rol"
      />
      <v-avatar color="primary" class="mr-2">
        <span class="text-white">UD</span>
      </v-avatar>
      <div class="text-body-2">{{ tenantStore.user }}</div>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>

    <v-snackbar v-model="uiStore.snackbar.show" :color="uiStore.snackbar.color" timeout="3500">
      {{ uiStore.snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="uiStore.closeSnackbar">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTenantStore } from '@/stores/tenant';
import { useUiStore } from '@/stores/ui';

const drawer = ref(true);
const tenantStore = useTenantStore();
const uiStore = useUiStore();

const tenants = ['demo', 'acme', 'grupo-iso'];
const roles = ['Admin', 'Operador', 'Auditor'];

const tenantCode = computed({
  get: () => tenantStore.tenantCode,
  set: (value: string) => tenantStore.setTenant(value)
});

const role = computed({
  get: () => tenantStore.role,
  set: (value: string) => tenantStore.setRole(value as never)
});

const menuItems = [
  { to: '/dashboard', title: 'Dashboard', icon: 'mdi-view-dashboard' },
  { to: '/incidentes', title: 'Incidentes', icon: 'mdi-alert-octagon' },
  { to: '/riesgos', title: 'Riesgos', icon: 'mdi-shield-alert' },
  { to: '/hallazgos', title: 'Hallazgos', icon: 'mdi-clipboard-alert' },
  { to: '/acciones', title: 'Acciones', icon: 'mdi-checkbox-marked-circle-outline' },
  { to: '/controles', title: 'Controles', icon: 'mdi-shield-check' },
  { to: '/procesos', title: 'Procesos', icon: 'mdi-sitemap' },
  { to: '/activos', title: 'Activos', icon: 'mdi-desktop-classic' }
];

const route = useRoute();

const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean);
  const items = [{ title: 'Inicio', disabled: false, to: '/dashboard' }];
  segments.forEach((segment, index) => {
    const to = `/${segments.slice(0, index + 1).join('/')}`;
    items.push({
      title: segment.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      disabled: index === segments.length - 1,
      to
    });
  });
  return items;
});
</script>
