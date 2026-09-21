import { useCallback, useEffect, useState } from 'react'
import { listarSalas } from '../../shared/api/salas'
import { ApiError } from '../../shared/api/http'
import type { SalaConReservas } from '../../shared/api/schemas'

interface UseSalasResult {
  salas: SalaConReservas[]
  loading: boolean
  error: string | null
  reload: () => void
}

/** Carga el catalogo real de salas. Contempla carga, error y reintento manual. */
export function useSalas(): UseSalasResult {
  const [salas, setSalas] = useState<SalaConReservas[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function cargar() {
      setLoading(true)
      setError(null)
      try {
        const data = await listarSalas(controller.signal)
        setSalas(data)
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === 'AbortError') return
        setError(
          cause instanceof ApiError || cause instanceof Error
            ? cause.message
            : 'No pudimos cargar los laboratorios.',
        )
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    cargar()
    return () => controller.abort()
  }, [reloadToken])

  const reload = useCallback(() => setReloadToken((token) => token + 1), [])

  return { salas, loading, error, reload }
}
