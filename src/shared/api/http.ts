import { env } from '../config/env'

/** Forma de error acordada con el backend: { error, detalles? }. */
export class ApiError extends Error {
  readonly status: number
  readonly detalles?: Record<string, string[] | undefined>

  constructor(
    message: string,
    status: number,
    detalles?: Record<string, string[] | undefined>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detalles = detalles
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT'
  body?: unknown
  signal?: AbortSignal
}

/** Cliente HTTP minimo y compartido. No usar fetch directo desde componentes. */
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  let response: Response
  try {
    response = await fetch(env.VITE_API_URL + path, {
      method: options.method ?? 'GET',
      headers: options.body
        ? { 'Content-Type': 'application/json' }
        : undefined,
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError')
      throw cause
    throw new ApiError(
      'No pudimos conectar con el servidor. Revisa tu conexion e intenta de nuevo.',
      0,
    )
  }

  if (response.status === 204) return undefined as T

  let payload: unknown = null
  try {
    payload = await response.json()
  } catch {
    // sin cuerpo o no es JSON valido; payload se queda en null
  }

  if (!response.ok) {
    const body = payload as {
      error?: string
      detalles?: Record<string, string[] | undefined>
    } | null
    throw new ApiError(
      body?.error ?? 'Ocurrio un error inesperado en el servidor.',
      response.status,
      body?.detalles,
    )
  }

  return payload as T
}
