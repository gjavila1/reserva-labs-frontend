import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Icon } from '../../../shared/ui/Icon'
import type { ReservaErrors } from '../reservas.types'
import { validateReservaForm } from '../reservas.schema'
import { formatPreviewDate } from '../reservas.preview'
import type { SeleccionHorario } from '../disponibilidad'
import {
  crearReserva,
  type CrearReservaPayload,
} from '../../../shared/api/salas'
import { ApiError } from '../../../shared/api/http'
import type { ReservaApi } from '../../../shared/api/schemas'

type EnvioEstado = 'idle' | 'enviando' | 'conflicto' | 'error' | 'exito'

export function ReservaForm({
  selection,
  onClose,
  onBooked,
}: {
  selection: SeleccionHorario
  onClose: () => void
  onBooked: () => void
}) {
  const [fields, setFields] = useState({ responsable: '', motivo: '' })
  const [errors, setErrors] = useState<ReservaErrors>({})
  const [estado, setEstado] = useState<EnvioEstado>('idle')
  const [mensajeError, setMensajeError] = useState('')
  const [reservaConfirmada, setReservaConfirmada] = useState<ReservaApi | null>(
    null,
  )
  const formRef = useRef<HTMLFormElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const prefix = useId()
  useEffect(() => {
    if (!dialogRef.current?.open) dialogRef.current?.showModal()
  }, [])
  const close = () => dialogRef.current?.close()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (estado === 'enviando') return

    const { errors: nextErrors, data } = validateReservaForm({
      salaId: String(selection.sala.id),
      responsable: fields.responsable,
      motivo: fields.motivo,
      inicio: selection.inicio,
      fin: selection.fin,
    })
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      const input = formRef.current?.elements.namedItem(firstError)
      if (input instanceof HTMLElement) input.focus()
      return
    }
    if (!data) return

    setEstado('enviando')
    setMensajeError('')
    const payload: CrearReservaPayload = {
      responsable: data.responsable,
      motivo: data.motivo,
      inicio: data.inicio.toISOString(),
      fin: data.fin.toISOString(),
    }
    try {
      const reserva = await crearReserva(selection.sala.id, payload)
      setReservaConfirmada(reserva)
      setEstado('exito')
      onBooked()
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 409) {
        setEstado('conflicto')
        setMensajeError(cause.message)
        return
      }
      if (cause instanceof ApiError && cause.status === 400 && cause.detalles) {
        const serverErrors: ReservaErrors = {}
        for (const key of Object.keys(
          cause.detalles,
        ) as (keyof ReservaErrors)[]) {
          const messages = cause.detalles[key]
          if (messages?.length) serverErrors[key] = messages[0]
        }
        setErrors(serverErrors)
        setEstado('error')
        setMensajeError(cause.message)
        return
      }
      setEstado('error')
      setMensajeError(
        cause instanceof Error
          ? cause.message
          : 'No pudimos guardar tu reserva. Intenta de nuevo.',
      )
    }
  }

  function elegirOtroHorario() {
    onBooked()
    close()
  }

  const enviando = estado === 'enviando'

  return (
    <dialog
      ref={dialogRef}
      className="booking-dialog"
      aria-labelledby={prefix + '-title'}
      aria-describedby={prefix + '-note'}
      onClose={onClose}
    >
      <div className="dialog-top">
        <span className="eyebrow">
          {estado === 'exito' ? 'RESERVA CONFIRMADA' : 'TU PRÓXIMA SESIÓN'}
        </span>
        <button
          type="button"
          className="icon-button"
          aria-label="Cerrar solicitud"
          onClick={close}
        >
          <Icon name="close" />
        </button>
      </div>
      {estado === 'exito' && reservaConfirmada ? (
        <>
          <div className="success-mark">
            <Icon name="check" size={28} />
          </div>
          <h2
            id={prefix + '-title'}
            tabIndex={-1}
            ref={(element) => {
              element?.focus()
            }}
          >
            ¡Tu reserva quedó registrada!
          </h2>
          <p id={prefix + '-note'} className="dialog-note">
            El servidor confirmó tu reserva. Ya podés cerrar esta ventana.
          </p>
          <dl className="preview-details">
            <div>
              <dt>Laboratorio</dt>
              <dd>{selection.sala.nombre}</dd>
            </div>
            <div>
              <dt>Responsable</dt>
              <dd>{reservaConfirmada.responsable}</dd>
            </div>
            <div>
              <dt>Actividad</dt>
              <dd>{reservaConfirmada.motivo}</dd>
            </div>
            <div>
              <dt>Inicio</dt>
              <dd>
                {formatPreviewDate(reservaConfirmada.inicio.toISOString())}
              </dd>
            </div>
            <div>
              <dt>Fin</dt>
              <dd>{formatPreviewDate(reservaConfirmada.fin.toISOString())}</dd>
            </div>
          </dl>
          <button
            className="button button-primary full-width"
            type="button"
            onClick={close}
          >
            Volver a los laboratorios <Icon name="arrow" size={18} />
          </button>
        </>
      ) : estado === 'conflicto' ? (
        <>
          <h2 id={prefix + '-title'}>Ese horario ya no está disponible.</h2>
          <p id={prefix + '-note'} className="dialog-note">
            {mensajeError ||
              'Alguien más reservó este horario mientras completabas el formulario.'}
          </p>
          <button
            className="button button-primary full-width"
            type="button"
            onClick={elegirOtroHorario}
          >
            Elegir otro horario <Icon name="arrow" size={18} />
          </button>
        </>
      ) : (
        <>
          <h2 id={prefix + '-title'}>Un paso más para empezar.</h2>
          <p id={prefix + '-note'} className="dialog-note">
            Completá tus datos para confirmar la reserva con el servidor.
          </p>
          <div className="selected-space">
            <span>
              Edificio {selection.sala.edificio} · Hasta{' '}
              {selection.sala.capacidad} personas
            </span>
            <h3>{selection.sala.nombre}</h3>
            <p>
              <Icon name="calendar" size={16} />
              {formatPreviewDate(selection.inicio)}
            </p>
            <p>
              <Icon name="clock" size={16} />
              Hasta {formatPreviewDate(selection.fin)}
            </p>
          </div>
          <form ref={formRef} noValidate onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor={prefix + '-responsable'}>
                Tu nombre completo
              </label>
              <input
                id={prefix + '-responsable'}
                name="responsable"
                autoComplete="name"
                required
                minLength={3}
                placeholder="¿Quién será responsable?"
                value={fields.responsable}
                disabled={enviando}
                aria-invalid={Boolean(errors.responsable)}
                aria-describedby={
                  errors.responsable ? prefix + '-responsable-error' : undefined
                }
                onChange={(event) => {
                  setFields({ ...fields, responsable: event.target.value })
                  setErrors({ ...errors, responsable: undefined })
                }}
              />
              {errors.responsable && (
                <span
                  className="field-error"
                  id={prefix + '-responsable-error'}
                >
                  {errors.responsable}
                </span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor={prefix + '-motivo'}>
                ¿Para qué necesitás el espacio?
              </label>
              <textarea
                id={prefix + '-motivo'}
                name="motivo"
                required
                minLength={3}
                rows={3}
                placeholder="Por ejemplo: práctica del proyecto de programación"
                value={fields.motivo}
                disabled={enviando}
                aria-invalid={Boolean(errors.motivo)}
                aria-describedby={
                  errors.motivo ? prefix + '-motivo-error' : undefined
                }
                onChange={(event) => {
                  setFields({ ...fields, motivo: event.target.value })
                  setErrors({ ...errors, motivo: undefined })
                }}
              />
              {errors.motivo && (
                <span className="field-error" id={prefix + '-motivo-error'}>
                  {errors.motivo}
                </span>
              )}
            </div>
            {estado === 'error' && (
              <p className="field-error" role="alert">
                {mensajeError || 'No pudimos guardar tu reserva.'} Podés revisar
                tus datos e intentar de nuevo.
              </p>
            )}
            <button
              className="button button-primary full-width"
              type="submit"
              disabled={enviando}
              aria-busy={enviando}
            >
              {enviando ? (
                'Enviando…'
              ) : (
                <>
                  Confirmar reserva <Icon name="arrow" size={18} />
                </>
              )}
            </button>
            <p className="required-note">
              Ambos campos son obligatorios. Tu reserva se confirma solo cuando
              el servidor la registra.
            </p>
          </form>
        </>
      )}
    </dialog>
  )
}
