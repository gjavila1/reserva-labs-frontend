# Instrucciones del frontend

## Alcance actual

Fase 2 autorizada: integracion real con el backend documentado en la guia del curso
(ver docs/FASE2.md). Catalogo y disponibilidad vienen de GET /api/salas; las reservas
se crean contra POST /api/salas/:id/reservas con validacion Zod compatible con el
servidor. El contrato de fechas/zona horaria y el codigo 409 por solapamiento estan
pendientes de confirmar con el equipo de backend real; ver docs/FASE2.md.

## Flujo Git obligatorio

- main conserva el esqueleto inicial hasta la entrega final.
- dev integra el trabajo y representa preproduccion; una rama no equivale a un despliegue.
- Crear ramas desde dev actualizado. Fases acordadas: feature/fase1-interfaz,
  feature/fase2-integracion y feature/fase3-pruebas-documentacion.
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
- Agregar pruebas relevantes cuando se implemente comportamiento; npm test verifica filtros y vista previa.
- Seguir Plan -> Work -> Review -> Compound y registrar decisiones, alternativas y dudas en el PR.
- Mantener CONTRIBUTING.md y CLAUDE.md coherentes con estas reglas.
- Informar que se comprobo y que no pudo verificarse; no afirmar que hay protecciones remotas sin comprobarlas.

## Criterio visual acordado

- Priorizar busqueda por horario y tarjetas de laboratorio con acciones visibles.
- Referencia visual: OpenTable. Abrir el formulario despues de elegir un horario.
- Las tarjetas representan espacios reales del catalogo; las imagenes y la agenda
  actuales son ilustrativas y no deben presentarse como datos reales.
- Usar jerarquia tipografica, alineacion y separadores; evitar tarjetas anidadas,
  decoracion innecesaria, radios excesivos y apariencia de dashboard generico.
- Mantener contraste, foco visible, objetivos tactiles y reorganizacion responsive.
- No reescribir logica funcional ni agregar dependencias por cambios de apariencia.
