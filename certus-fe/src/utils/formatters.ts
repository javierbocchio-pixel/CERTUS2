import type { IncidentStatus, Severity } from '@/types/common';

export const severityColor = (severity: Severity) => {
  switch (severity) {
    case 'Crítica':
      return 'error';
    case 'Alta':
      return 'warning';
    case 'Media':
      return 'info';
    case 'Baja':
      return 'success';
    default:
      return 'primary';
  }
};

export const statusColor = (status: IncidentStatus) => {
  switch (status) {
    case 'Abierto':
      return 'error';
    case 'Contenido':
      return 'warning';
    case 'En análisis':
      return 'info';
    case 'Erradicado':
      return 'secondary';
    case 'Recuperado':
      return 'primary';
    case 'Cerrado':
      return 'success';
    default:
      return 'primary';
  }
};
