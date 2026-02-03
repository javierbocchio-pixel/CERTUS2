export type Severity = 'Baja' | 'Media' | 'Alta' | 'Crítica';
export type IncidentStatus =
  | 'Abierto'
  | 'Contenido'
  | 'En análisis'
  | 'Erradicado'
  | 'Recuperado'
  | 'Cerrado';

export type Role = 'Admin' | 'Operador' | 'Auditor';

export interface Evidence {
  id: string;
  name: string;
  url?: string;
  uploadedAt: string;
  uploader: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  details?: string;
}
