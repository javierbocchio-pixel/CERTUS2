import type { Incident } from '@/types/incident';
import type { Risk } from '@/types/risk';
import type { AuditEvent } from '@/types/common';

const STORAGE_KEY = 'certus-data';

export interface MockDatabase {
  incidents: Incident[];
  risks: Risk[];
}

const nowIso = () => new Date().toISOString();

const defaultAudit = (actor: string, action: string): AuditEvent => ({
  id: crypto.randomUUID(),
  actor,
  action,
  timestamp: nowIso()
});

const seedData: MockDatabase = {
  incidents: [
    {
      id: 'INC-001',
      titulo: 'Acceso no autorizado a servidor de archivos',
      tipo: 'Acceso indebido',
      estado: 'En análisis',
      severidad: 'Crítica',
      activo: 'Servidor de archivos',
      proceso: 'Gestión documental',
      responsable: 'María López',
      fechaDeteccion: nowIso(),
      ultimaActualizacion: nowIso(),
      descripcion: 'Se detectaron accesos fuera de horario por un usuario externo.',
      accionesInmediatas: 'Bloqueo de credenciales y rotación de claves.',
      impacto: {
        confidencialidad: 4,
        integridad: 3,
        disponibilidad: 2
      },
      riesgos: ['R-001'],
      hallazgos: [],
      acciones: ['A-001'],
      controles: ['ISO27001-A.9.1'],
      evidencias: [
        {
          id: crypto.randomUUID(),
          name: 'log-accesos.csv',
          uploadedAt: nowIso(),
          uploader: 'SOC'
        }
      ],
      auditTrail: [defaultAudit('SOC', 'Incidente creado')]
    },
    {
      id: 'INC-002',
      titulo: 'Malware detectado en endpoint de finanzas',
      tipo: 'Malware',
      estado: 'Contenido',
      severidad: 'Alta',
      activo: 'Laptop Finanzas',
      proceso: 'Pagos',
      responsable: 'Juan Perez',
      fechaDeteccion: nowIso(),
      ultimaActualizacion: nowIso(),
      descripcion: 'Alertas del EDR por actividad sospechosa.',
      accionesInmediatas: 'Aislamiento del equipo y escaneo completo.',
      impacto: {
        confidencialidad: 3,
        integridad: 2,
        disponibilidad: 2
      },
      riesgos: [],
      hallazgos: [],
      acciones: [],
      controles: ['ISO27001-A.12.2'],
      evidencias: [],
      auditTrail: [defaultAudit('EDR', 'Incidente creado')]
    }
  ],
  risks: [
    {
      id: 'R-001',
      titulo: 'Exposición de credenciales privilegiadas',
      descripcion: 'Riesgo asociado a accesos indebidos en servidores críticos.',
      severidad: 'Alta',
      activo: 'Servidor de archivos',
      propietario: 'CISO',
      estado: 'Activo',
      incidentes: ['INC-001'],
      hallazgos: [],
      acciones: ['A-001'],
      controles: ['ISO27001-A.9.2'],
      auditTrail: [defaultAudit('CISO', 'Riesgo creado')]
    }
  ]
};

export const loadDatabase = (): MockDatabase => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }
  return JSON.parse(raw) as MockDatabase;
};

export const saveDatabase = (db: MockDatabase) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};
