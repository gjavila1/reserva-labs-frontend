import { useState } from 'react'
import { SalasCatalogo } from '../features/salas/components/SalasCatalogo'
import { ReservaForm } from '../features/reservas/components/ReservaForm'
import { useSalas } from '../features/salas/useSalas'
import {
  tomorrow,
  type BusquedaHorario,
  type SeleccionHorario,
} from '../features/reservas/disponibilidad'
import { Icon } from '../shared/ui/Icon'

export default function App() {
  const { salas, loading, error, reload } = useSalas()
  const [query, setQuery] = useState<BusquedaHorario>(() => ({
    fecha: tomorrow(),
    hora: 9,
    duracion: 1,
    personas: 20,
  }))
  const [selection, setSelection] = useState<SeleccionHorario | null>(null)
  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#contenido"
            aria-label="Reserva Labs, inicio"
          >
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            Reserva<span className="brand-light">Labs</span>
          </a>
          <nav aria-label="Navegación principal">
            <a href="#laboratorios" aria-current="page">
              Explorar laboratorios
            </a>
          </nav>
          <span className="campus-label">
            <Icon name="pin" size={16} /> Campus universitario
          </span>
        </div>
      </header>
      <main id="contenido" tabIndex={-1}>
        <section className="discovery-header" aria-labelledby="page-title">
          <div className="discovery-inner">
            <div className="discovery-top">
              <div className="discovery-copy">
                <p className="eyebrow">UN ESPACIO PARA TU PRÓXIMA IDEA</p>
                <h1 id="page-title">
                  Encontrá el espacio para tu próxima sesión.
                </h1>
                <p className="page-description">
                  Consultá espacios, compará horarios y prepará tu próxima
                  sesión.
                </p>
              </div>
              <aside className="steps-bubble" aria-label="Pasos para reservar">
                <p>
                  <strong>Pasos para reservar:</strong>
                </p>
                <ul>
                  <li>
                    <strong>1.</strong> Buscá un espacio por fecha, horario y
                    tamaño de tu grupo.
                  </li>
                  <li>
                    <strong>2.</strong> Elegí una hora en el laboratorio que te
                    interese.
                  </li>
                  <li>
                    <strong>3.</strong> Revisá tus datos y confirma tu reserva.
                  </li>
                </ul>
              </aside>
            </div>
            {/* Al buscar, arma una nueva consulta con lo elegido en el formulario. */}
            <form
              className="availability-search"
              onSubmit={(event) => {
                event.preventDefault()
                const data = new FormData(event.currentTarget)
                setQuery({
                  fecha: String(data.get('fecha')),
                  hora: Number(data.get('hora')),
                  duracion: Number(data.get('duracion')),
                  personas: Number(data.get('personas')),
                })
              }}
            >
              <label>
                <span>
                  <Icon name="calendar" size={16} /> Fecha
                </span>
                <input
                  type="date"
                  name="fecha"
                  required
                  min={tomorrow()}
                  defaultValue={query.fecha}
                />
              </label>
              <label>
                <span>
                  <Icon name="clock" size={16} /> A partir de
                </span>
                <select name="hora" defaultValue={query.hora}>
                  {Array.from({ length: 10 }, (_, i) => i + 8).map((h) => (
                    <option key={h} value={h}>
                      {String(h).padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Duración</span>
                <select name="duracion" defaultValue={query.duracion}>
                  <option value="1">1 hora</option>
                  <option value="2">2 horas</option>
                  <option value="3">3 horas</option>
                </select>
              </label>
              <label>
                <span>
                  <Icon name="people" size={16} /> Tu grupo
                </span>
                <select name="personas" defaultValue={query.personas}>
                  {[1, 10, 20, 25, 30, 35].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'persona' : 'personas'}
                    </option>
                  ))}
                </select>
              </label>
              <button className="button button-primary" type="submit">
                <Icon name="search" size={18} /> Buscar espacios
              </button>
            </form>
          </div>
        </section>
        <div className="content-inner">
          {/* Avisa que el catalogo no pudo cargarse y ofrece intentar otra vez. */}
          {error && (
            <div className="demo-notice" role="alert">
              <span>NO PUDIMOS CARGAR EL CATÁLOGO</span>
              <p>{error}</p>
              <button
                type="button"
                className="button button-outline"
                onClick={reload}
              >
                Reintentar
              </button>
            </div>
          )}
          <SalasCatalogo
            salas={salas}
            query={query}
            loading={loading}
            onSelect={setSelection}
          />
          <footer className="page-footer">
            <span>
              <strong>ReservaLabs</strong> · Espacios para aprender y crear.
            </span>
            <span>Proyecto de Programación Web</span>
          </footer>
        </div>
      </main>
      {/* Abre el dialogo de reserva solo cuando se eligio un horario. */}
      {selection && (
        <ReservaForm
          key={selection.sala.id + selection.inicio}
          selection={selection}
          onClose={() => setSelection(null)}
          onBooked={reload}
        />
      )}
    </div>
  )
}
