# Reglas de oro

Leer y aplicar AGENTS.md y CONTRIBUTING.md antes de modificar este repositorio.

- Alcance actual: fase 2 de integracion. El catalogo y las reservas usan el backend
  real via VITE_API_URL; ver docs/FASE2.md para el contrato asumido y lo pendiente
  de confirmar con el equipo de backend (zona horaria, codigo 409 por solapamiento).
- main conserva el esqueleto hasta la entrega; ramas de trabajo desde dev y PR hacia dev.
- Solo la entrega final integra dev en main, con revision del equipo.
- El servidor no confia en la entrada: valida siempre; la validacion del frontend es para UX.
- Secretos en el entorno del backend, nunca en el codigo ni en VITE_ (publico).
- .env no se versiona; .env.example si, sin secretos.
- Ante filtracion: avisar al responsable, revocar o rotar la clave en el proveedor,
  actualizar el entorno y coordinar la limpieza de Git e historial. Borrar no basta.
- Ejecutar npm run check antes de proponer PR.
- Registrar decision mas dificil, alternativas y dudas; ambos integrantes deben comprender el codigo.
