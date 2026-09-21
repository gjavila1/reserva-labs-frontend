import { env } from '../config/env'

// Guarda el mensaje, el codigo de estado y los detalles que manda el servidor
// cuando una peticion falla, para mostrarlos donde haga falta.
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

// Punto unico por el que la aplicacion habla con el servidor. Ningun otro
// archivo debe conectarse directo con el servidor, siempre pasa por aqui.
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  let response: Response
  // Envia la peticion al servidor y avisa si no se pudo conectar.
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

  // Lee el cuerpo de la respuesta sin romper la aplicacion si viene vacio
  // o si no tiene un formato valido.
  let payload: unknown = null
  try {
    payload = await response.json()
  } catch {
    // sin cuerpo o no es JSON valido; payload se queda en null
  }

  // Si el servidor respondio con un error, arma un mensaje claro para mostrar.
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
