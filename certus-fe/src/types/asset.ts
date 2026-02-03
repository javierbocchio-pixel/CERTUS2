import type { AuditEvent } from './common';

export interface Asset {
  id: string;
  nombre: string;
  categoria: string;
  criticidad: 'Baja' | 'Media' | 'Alta';
  propietario: string;
  procesos: string[];
  auditTrail: AuditEvent[];
}
