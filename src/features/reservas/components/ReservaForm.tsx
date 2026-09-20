import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Icon } from '../../../shared/ui/Icon'
import type { ReservaDraft, ReservaErrors } from '../reservas.types'
import { formatPreviewDate, validatePreview } from '../reservas.preview'
import type { SeleccionHorario } from '../disponibilidad.demo'

export function ReservaForm({
  selection,
  onClose,
}: {
  selection: SeleccionHorario
  onClose: () => void
}) {
  const [fields, setFields] = useState({ responsable: '', motivo: '' })
  const [errors, setErrors] = useState<ReservaErrors>({})
  const [preview, setPreview] = useState<ReservaDraft | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const prefix = useId()
  useEffect(() => {
    if (!dialogRef.current?.open) dialogRef.current?.showModal()
  }, [])
  const close = () => dialogRef.current?.close()
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const draft: ReservaDraft = {
      ...fields,
      responsable: fields.responsable.trim(),
      motivo: fields.motivo.trim(),
      salaId: String(selection.sala.id),
      inicio: selection.inicio,
      fin: selection.fin,
    }
    const nextErrors = validatePreview(draft, [selection.sala.id])
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      const input = formRef.current?.elements.namedItem(firstError)
      if (input instanceof HTMLElement) input.focus()
      return
    }
    setPreview(draft)
  }
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
          {preview ? 'SOLICITUD DE DEMOSTRACIÓN' : 'TU PRÓXIMA SESIÓN'}
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
      {preview ? (
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
            ¡Tu solicitud está lista!
          </h2>
          <p id={prefix + '-note'} className="dialog-note">
            Esta es una vista previa: no se ha enviado ni confirmado ninguna
            reserva.
          </p>
          <dl className="preview-details">
            <div>
              <dt>Laboratorio</dt>
              <dd>{selection.sala.nombre}</dd>
            </div>
            <div>
              <dt>Responsable</dt>
              <dd>{preview.responsable}</dd>
            </div>
            <div>
              <dt>Actividad</dt>
              <dd>{preview.motivo}</dd>
            </div>
            <div>
              <dt>Inicio</dt>
              <dd>{formatPreviewDate(preview.inicio)}</dd>
            </div>
            <div>
              <dt>Fin</dt>
              <dd>{formatPreviewDate(preview.fin)}</dd>
            </div>
          </dl>
          <button
            className="button button-primary full-width"
            type="button"
            onClick={close}
          >
            Volver a los laboratorios <Icon name="arrow" size={18} />
          </button>
          <button
            className="text-button full-width"
            type="button"
            onClick={() => setPreview(null)}
          >
            Editar mis datos
          </button>
        </>
      ) : (
        <>
          <h2 id={prefix + '-title'}>Un paso más para empezar.</h2>
          <p id={prefix + '-note'} className="dialog-note">
            Completá tus datos para revisar la solicitud. Es una demostración y
            no se enviará.
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
            <button className="button button-primary full-width" type="submit">
              Revisar mi solicitud <Icon name="arrow" size={18} />
            </button>
            <p className="required-note">
              Ambos campos son obligatorios. Podés volver a editar tus datos.
            </p>
          </form>
        </>
      )}
    </dialog>
  )
}
