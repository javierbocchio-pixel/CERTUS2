import type { AuditEvent, Severity } from './common';

export interface Risk {
  id: string;
  titulo: string;
  descripcion: string;
  severidad: Severity;
  activo: string;
  propietario: string;
  estado: 'Borrador' | 'Activo' | 'Mitigado';
  incidentes: string[];
  hallazgos: string[];
  acciones: string[];
  controles: string[];
  auditTrail: AuditEvent[];
}
