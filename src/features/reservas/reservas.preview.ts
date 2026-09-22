/** Formatea fechas para la vista previa y confirmación de la reserva. */
export function formatPreviewDate(value: string): string {
  return new Intl.DateTimeFormat('es-GT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
