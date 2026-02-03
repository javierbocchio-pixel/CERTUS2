import type { AuditEvent } from './common';

export interface Process {
  id: string;
  nombre: string;
  duenio: string;
  activos: string[];
  auditTrail: AuditEvent[];
}
