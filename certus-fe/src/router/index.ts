import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/modules/dashboard/DashboardView.vue')
  },
  {
    path: '/incidentes',
    name: 'incidents',
    component: () => import('@/modules/incidents/IncidentListView.vue')
  },
  {
    path: '/incidentes/nuevo',
    name: 'incident-create',
    component: () => import('@/modules/incidents/IncidentFormView.vue')
  },
  {
    path: '/incidentes/:id',
    name: 'incident-detail',
    component: () => import('@/modules/incidents/IncidentDetailView.vue'),
    props: true
  },
  {
    path: '/incidentes/:id/editar',
    name: 'incident-edit',
    component: () => import('@/modules/incidents/IncidentFormView.vue'),
    props: true
  },
  {
    path: '/riesgos',
    name: 'risks',
    component: () => import('@/modules/risks/RiskListView.vue')
  },
  {
    path: '/riesgos/nuevo',
    name: 'risk-create',
    component: () => import('@/modules/risks/RiskFormView.vue')
  },
  {
    path: '/riesgos/:id',
    name: 'risk-detail',
    component: () => import('@/modules/risks/RiskDetailView.vue'),
    props: true
  },
  {
    path: '/riesgos/:id/editar',
    name: 'risk-edit',
    component: () => import('@/modules/risks/RiskFormView.vue'),
    props: true
  },
  {
    path: '/hallazgos',
    name: 'findings',
    component: () => import('@/modules/findings/FindingListView.vue')
  },
  {
    path: '/acciones',
    name: 'actions',
    component: () => import('@/modules/actions/ActionListView.vue')
  },
  {
    path: '/controles',
    name: 'controls',
    component: () => import('@/modules/controls/ControlListView.vue')
  },
  {
    path: '/procesos',
    name: 'processes',
    component: () => import('@/modules/processes/ProcessListView.vue')
  },
  {
    path: '/activos',
    name: 'assets',
    component: () => import('@/modules/assets/AssetListView.vue')
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
