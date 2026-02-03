import type { AuditEvent } from './common';

export interface Control {
  id: string;
  codigo: string;
  norma: 'ISO 27001' | 'ISO 9001';
  descripcion: string;
  estado: 'Implementado' | 'En progreso' | 'No implementado';
  incidentes: string[];
  riesgos: string[];
  auditTrail: AuditEvent[];
}
