# Protocolo de acciones de Rocky

Coloca como máximo un bloque al final de la respuesta. Debe contener JSON válido, sin cerca Markdown. El bridge oculta el bloque antes de responder en WhatsApp.

```text
[[ROCKY_ACTIONS]]
{"actions":[...]}
[[/ROCKY_ACTIONS]]
```

La respuesta visible debe ser breve y no debe asegurar que la acción tuvo éxito. El bridge añadirá el resultado real.

## Rutinas

Crear una ejecución única. `at` debe ser ISO 8601 con zona horaria explícita y estar en el futuro:

```json
{"type":"routine.create","name":"Resumen del evento","prompt":"Busca las noticias relevantes para el evento y publica un resumen con fuentes.","schedule":{"kind":"once","at":"2026-09-17T09:00:00-05:00"}}
```

Crear una recurrencia con una expresión cron de cinco campos y una zona IANA:

```json
{"type":"routine.create","name":"Noticias de IA","prompt":"Busca las noticias recientes de IA y comparte las cinco más importantes con enlaces.","schedule":{"kind":"cron","expression":"0 9 * * 1-5","timezone":"America/Lima"}}
```

Administrar una rutina usando el ID mostrado por `--routines` o su nombre exacto:

```json
{"type":"routine.pause","routine":"a1b2c3d4"}
{"type":"routine.resume","routine":"Noticias de IA"}
{"type":"routine.delete","routine":"a1b2c3d4"}
```

No crees otra rutina cuando el mensaje diga que está ejecutando una rutina programada.

## Encuestas y cuestionarios

Usa entre 2 y 12 opciones. `selectableCount` indica cuántas puede marcar cada persona:

```json
{"type":"whatsapp.poll","question":"¿Qué horario prefieren?","options":["9:00","11:00","15:00"],"selectableCount":1}
```

Para un cuestionario usa `selectableCount: 1` y explica en el texto visible que es una pregunta de práctica si resulta necesario. El formato de encuesta no marca una respuesta correcta ni calcula puntuación.

## Ubicación

Solo usa coordenadas confirmadas o verificadas. Incluye nombre y dirección si están disponibles:

```json
{"type":"whatsapp.location","latitude":-12.0696,"longitude":-77.0800,"name":"PUCP","address":"Av. Universitaria 1801, San Miguel"}
```

## Contacto

Usa el número completo con código de país:

```json
{"type":"whatsapp.contact","displayName":"Equipo Breakout","fullName":"Equipo Breakout","phone":"+51999999999","organization":"Breakout"}
```

## Stickers, archivos y reacciones

Las rutas deben estar dentro de `BREAKOUT-CREACIONES/`. Para stickers, el bridge convierte la imagen a WebP de 512 × 512:

```json
{"type":"whatsapp.sticker","path":"BREAKOUT-CREACIONES/stickers/rocky.png"}
{"type":"whatsapp.file","path":"BREAKOUT-CREACIONES/evento/programa.pdf","caption":"Programa del evento"}
```

Una reacción se aplica al mensaje que invocó a Rocky:

```json
{"type":"whatsapp.reaction","emoji":"🤖"}
```

## Varias acciones

Agrupa acciones independientes en el arreglo y conserva su orden:

```text
[[ROCKY_ACTIONS]]
{"actions":[{"type":"whatsapp.reaction","emoji":"🙄"},{"type":"whatsapp.poll","question":"¿Confirmas asistencia?","options":["Sí","No"],"selectableCount":1}]}
[[/ROCKY_ACTIONS]]
```
