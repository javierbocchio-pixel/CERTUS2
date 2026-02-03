import type { AuditEvent } from './common';

export interface Finding {
  id: string;
  titulo: string;
  descripcion: string;
  estado: 'Abierto' | 'En seguimiento' | 'Cerrado';
  incidentes: string[];
  acciones: string[];
  auditTrail: AuditEvent[];
}
