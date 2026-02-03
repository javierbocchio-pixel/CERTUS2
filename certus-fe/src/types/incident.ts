import type { AuditEvent, Evidence, IncidentStatus, Severity } from './common';

export interface IncidentImpact {
  confidencialidad?: number;
  integridad?: number;
  disponibilidad?: number;
  evaluacionFinal?: string;
}

export interface Incident {
  id: string;
  titulo: string;
  tipo: string;
  estado: IncidentStatus;
  severidad: Severity;
  activo: string;
  proceso?: string;
  responsable: string;
  fechaDeteccion: string;
  ultimaActualizacion: string;
  descripcion: string;
  accionesInmediatas?: string;
  impacto: IncidentImpact;
  riesgos: string[];
  hallazgos: string[];
  acciones: string[];
  controles: string[];
  evidencias: Evidence[];
  auditTrail: AuditEvent[];
}
