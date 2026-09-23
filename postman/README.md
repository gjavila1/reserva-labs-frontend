# Pruebas del contrato frontend / backend

Importar `ReservaLabs.postman_collection.json` como archivo en Postman. No pegar
su ruta en el campo para importar una URL.

## Configuracion

Definir las variables de la coleccion:

- `baseUrl`: backend sin barra final; por defecto `http://localhost:3010`.
- `salaId`: ID positivo de una sala existente; con la semilla actual puede usarse `8`.
- `salaInexistenteId`: ID confirmado como inexistente, por ejemplo `999999`.
- `confirmarBasePruebas`: mantener `NO` para ejecutar solo el GET; cambiar a `SI`
  cuando se autorice crear reservas en la base conectada.

Los POST escriben datos reales. La reserva valida no se borra automaticamente. La
coleccion genera un intervalo UTC de una hora, siete dias en el futuro.

## Ejecucion

1. Levantar el backend en el puerto configurado.
2. Ejecutar `01 - Catalogo con reservas` y comprobar el estado 200, el contrato,
   las seis URLs unicas y que cada imagen publica responda correctamente.
3. Confirmar la base, cambiar `confirmarBasePruebas` a `SI` y abrir Collection Runner.
4. Ejecutar las nueve solicitudes en el orden guardado.
5. Guardar los resultados indicando fecha y commits de frontend y backend.

La secuencia crea una reserva, intenta repetir el mismo intervalo para comprobar
el `409`, verifica persistencia y prueba errores 400 y 404. Ante un fallo no marcar
la integracion como aprobada.

Postman no comprueba CORS, accesibilidad ni responsive. Esos casos se ejecutan con
el frontend en un navegador siguiendo `docs/FASE3.md`.
