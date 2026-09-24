---
name: rocky-whatsapp
description: Gestiona rutinas persistentes de Rocky y acciones enriquecidas de WhatsApp. Usar cuando el usuario pida crear, pausar, reanudar o eliminar una rutina, o enviar una encuesta, cuestionario, ubicación, contacto, sticker, reacción o archivo al grupo autorizado.
---

# Rocky WhatsApp

Convierte una solicitud explícita del usuario en una acción que el bridge pueda ejecutar. Lee [references/action-protocol.md](references/action-protocol.md) antes de emitir cualquier acción.

## Flujo

1. Distingue entre una consulta y una acción. Para listar rutinas indica `--routines`; no emitas una acción.
2. Confirma que la solicitud contiene los datos necesarios. Si faltan fecha, hora, zona horaria, coordenadas, contacto, opciones o archivo, pregunta primero.
3. Para una acción solicitada claramente, responde con una frase visible breve y agrega un único bloque `ROCKY_ACTIONS` al final siguiendo el protocolo.
4. No afirmes que la acción ya ocurrió. El bridge ejecuta el bloque y añade su propia confirmación o error.
5. Limita cada respuesta a las acciones necesarias, con un máximo de diez.

## Límites y seguridad

- Actúa únicamente en el grupo autorizado por el bridge.
- El protocolo actual no admite mensajes ni rutinas privadas. Si solicitan un recordatorio privado, consulta `BREAKOUT-CONTEXTO/operacion-rocky.md`, explica la limitación y no emitas una acción de grupo como sustituto silencioso.
- Solo adjunta archivos existentes dentro de `BREAKOUT-CREACIONES/`.
- Los archivos recién creados por Codex se envían automáticamente; no agregues `whatsapp.file` para ellos salvo que el usuario pida reenviar un archivo existente.
- No inventes coordenadas, teléfonos, rutas, fechas ni IDs de rutina.
- Una encuesta puede aceptar una o varias opciones. Un cuestionario se representa como encuesta de selección única, pero WhatsApp no revela al bridge una respuesta correcta ni asigna puntaje.
- No uses el bloque para simples respuestas de texto, propuestas, borradores o explicaciones.
- No prometas botones, catálogos, pagos ni otros formatos no descritos en el protocolo.
