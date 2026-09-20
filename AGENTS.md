# Instrucciones del frontend

## Alcance actual

Solo preparar y mantener el esqueleto. No implementar pantallas, componentes de negocio,
reservas ni conexion al backend hasta que el usuario solicite esa tarea.

## Flujo Git obligatorio

- main conserva el esqueleto inicial hasta la entrega final.
- dev integra el trabajo y representa preproduccion; una rama no equivale a un despliegue.
- Crear ramas cortas desde dev actualizado: feat/nombre, fix/nombre, chore/nombre o docs/nombre.
- Los PR habituales apuntan a dev y los revisa el otro integrante.
- El unico PR de entrega a main sale de dev, cuando el equipo lo acuerde y todo este probado.
- No hacer push directo a main o dev ni fusionar PR sin la revision acordada.

## Arquitectura y codigo

- React, Vite y TypeScript con modo estricto; usar npm y conservar package-lock.json.
- app compone la aplicacion; features agrupa por funcionalidad; shared contiene codigo compartido.
- Crear archivos y abstracciones cuando exista una necesidad concreta.
- Mantener llamadas HTTP fuera de componentes visuales y centralizar la URL de la API.
- Al implementar: datos reales desde API; mocks solo para desarrollo y pruebas.
- Al implementar: contemplar carga, error, vacio, exito y envio en curso.
- Al implementar: formularios accesibles y reglas Zod compatibles con el backend.
- El servidor no confia en la entrada y debe validar siempre; el frontend valida para UX.
- Acordar contrato, errores y zona horaria con backend antes de integrar.

## Seguridad

- Nunca guardar secretos en codigo o en variables VITE_ (son publicas).
- No versionar .env; mantener .env.example con valores no sensibles.
- Si se filtra una clave: avisar al responsable, revocar/rotar en el proveedor,
  actualizar el entorno y despues retirar el secreto de Git e historial con coordinacion.
  Borrar el archivo no invalida la clave expuesta.

## Comprobaciones y responsabilidad

- Antes de proponer un PR ejecutar npm run check y revisar git diff.
- Agregar pruebas relevantes cuando se implemente comportamiento; el esqueleto no tiene pruebas funcionales.
- Seguir Plan -> Work -> Review -> Compound y registrar decisiones, alternativas y dudas en el PR.
- Mantener CONTRIBUTING.md y CLAUDE.md coherentes con estas reglas.
- Informar que se comprobo y que no pudo verificarse; no afirmar que hay protecciones remotas sin comprobarlas.
