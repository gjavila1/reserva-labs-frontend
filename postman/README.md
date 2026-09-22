# Pruebas del contrato frontend / backend

Importar ReservaLabs.postman_collection.json en Postman (formato v2.1).
La coleccion esta preparada, pero no se ha ejecutado contra un backend real.

## Configuracion

- baseUrl: origen del backend, sin barra final, por defecto http://localhost:3010.
- salaId: ID positivo de una sala existente en una BASE DE PRUEBAS.
- salaInexistenteId: ID positivo que el equipo confirme que no existe.
- confirmarBasePruebas: cambiar NO por SI solo despues de confirmar el entorno.

Los POST crean datos reales: usar una base de pruebas. El caso valido crea una
reserva y no la borra automaticamente. El equipo de backend debe acordar la limpieza.
La coleccion genera fechas UTC futuras al iniciar el caso de creacion; no tiene
fechas de vencimiento. Ajustar horario permitido antes de usarla si el backend
agrega restricciones distintas del contrato base (usa 15:00-16:00 UTC a siete dias).

Ejecutar en orden con Collection Runner; ante un fallo no dar la integracion por
aprobada. Exportar resultados sin secretos e indicar commits front/back y fecha.
La verificacion de persistencia compara el ID y los campos de la reserva creada
con GET /api/salas. Los casos 400 prueban un error por vez.

El conflicto 409, las carreras concurrentes y CORS se verifican por separado
segun docs/FASE3.md. Postman no comprueba restricciones CORS del navegador.
Esta coleccion verifica los endpoints consumidos por frontend; la coleccion
completa de CRUD de salas (incluido DELETE) sigue siendo responsabilidad del backend.
