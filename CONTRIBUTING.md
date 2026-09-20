# Acuerdo de trabajo de Gerardo y Sebastian

## Ramas

main conserva el esqueleto inicial durante el proyecto. dev es integracion y preproduccion.
Todas las ramas de componentes o tareas nacen de dev y vuelven a dev mediante PR.
No crear ramas permanentes por persona.

Ejemplo para comenzar una tarea (sustituir el nombre):

```sh
git switch dev
git pull --ff-only origin dev
git switch -c feat/nombre-del-componente
```

Fases acordadas: feature/fase1-interfaz (Gerardo), feature/fase2-integracion
(Sebastian) y feature/fase3-pruebas-documentacion (Gerardo). Crear cada rama desde
dev actualizado al iniciar la fase. El otro integrante revisa su PR.

Prefijos para tareas adicionales: feat/ funcionalidad, fix/ correccion, chore/ configuracion, docs/ documentacion.
Commits: feat: descripcion, fix: descripcion, chore: descripcion, docs: descripcion.

## Revision

1. Acordar tarea y responsable antes de editar componentes compartidos.
2. Mantener el cambio pequeno y ejecutar npm run check.
3. Abrir PR hacia dev y completar la plantilla.
4. El otro integrante revisa codigo, resultado y verificaciones.
5. Resolver comentarios, integrar con squash y borrar la rama terminada.
6. Actualizar dev local antes de crear otra rama.

La CI verifica formato, lint, pruebas de filtros/vista previa, tipos y build.
Al agregar comportamiento, ampliar las pruebas relevantes; no considerar el build una prueba funcional.

## Entrega final

Cuando las funciones requeridas e integracion real esten probadas, ambos acuerdan un
PR de dev hacia main. No abrirlo durante el desarrollo. La CI verifica que ese PR
venga de dev del mismo repositorio, pero el equipo verifica que sea la entrega final.

## Protecciones en GitHub (pendientes hasta crear el remoto)

- Establecer dev como rama predeterminada para que los PR apunten alli.
- Proteger main y dev: exigir PR, una aprobacion del companero y comentarios resueltos.
- Exigir los checks frontend-quality y branch-policy cuando aparezcan tras la primera CI.
- Invalidar aprobaciones al agregar cambios y aplicar reglas tambien a administradores.
- Deshabilitar force push y borrado de ambas ramas.
- Durante el desarrollo, bloquear main para conservar el esqueleto; desbloquear solo
  para el PR final acordado, conservando los demas requisitos.
- Disponibilidad de protecciones segun plan y visibilidad del repositorio.

Los archivos locales no activan estas protecciones por si solos. La CI requiere GitHub
Actions habilitado y las reglas deben configurarse en GitHub.
