import { defineStore } from 'pinia';
import type { Role } from '@/types/common';

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    tenantCode: localStorage.getItem('tenantCode') || import.meta.env.VITE_TENANT_CODE || 'demo',
    role: 'Admin' as Role,
    user: 'Usuario Demo'
  }),
  actions: {
    setTenant(code: string) {
      this.tenantCode = code;
      localStorage.setItem('tenantCode', code);
    },
    setRole(role: Role) {
      this.role = role;
    }
  }
});
