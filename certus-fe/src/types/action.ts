import type { AuditEvent } from './common';

export interface ActionItem {
  id: string;
  titulo: string;
  tipo: 'Correctiva' | 'Preventiva';
  responsable: string;
  fechaObjetivo: string;
  estado: 'Pendiente' | 'En progreso' | 'Completada';
  incidentes: string[];
  hallazgos: string[];
  riesgos: string[];
  auditTrail: AuditEvent[];
}
