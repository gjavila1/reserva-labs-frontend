export interface ReservaDraft {
  salaId: string
  responsable: string
  motivo: string
  inicio: string
  fin: string
}

export type ReservaErrors = Partial<Record<keyof ReservaDraft, string>>
