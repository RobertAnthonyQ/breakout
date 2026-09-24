# Rocky Bridge

Servicio independiente que conectará un grupo de WhatsApp con Codex para trabajar sobre este repositorio. La primera fase incluye la sesión de Baileys y una consola web privada.

## Probar localmente

Desde la raíz del repositorio:

```bash
cd rocky
npm install
npm run dev
```

Luego abre `http://127.0.0.1:3100`. Escanea el QR desde **WhatsApp → Dispositivos vinculados → Vincular dispositivo**.

La sesión se guarda en `rocky/data/whatsapp-auth/` y se reutiliza después de reiniciar el proceso. Este directorio está ignorado por Git y debe persistirse como volumen cuando Rocky se despliegue en una VM.

## Variables disponibles

| Variable | Valor inicial | Uso |
|---|---|---|
| `ROCKY_HOST` | `127.0.0.1` | Interfaz donde escucha el panel. |
| `ROCKY_PORT` | `3100` | Puerto del panel. |
| `ROCKY_ADMIN_TOKEN` | vacío | Token para proteger el panel. Es obligatorio si se expone fuera de localhost. |
| `ROCKY_AUTH_DIR` | `data/whatsapp-auth` | Directorio persistente de la sesión. |
| `ROCKY_ROUTINES_PATH` | `data/routines.json` | Base local persistente de rutinas. |
| `ROCKY_AGENT_TIMEOUT_MS` | `900000` | Tiempo máximo por tarea de Codex; 15 minutos por defecto. |
| `ROCKY_ALLOWED_GROUP_ID` | vacío | Único grupo donde Rocky puede leer y responder. |
| `ROCKY_PROJECT_ROOT` | `..` | Repositorio disponible para Codex. |
| `GOOGLE_CLIENT_ID` | vacío | ID del cliente OAuth web de Google. |
| `GOOGLE_CLIENT_SECRET` | vacío | Secreto del cliente OAuth; nunca se versiona. |
| `GOOGLE_REDIRECT_URI` | `http://localhost:3100/api/integrations/google/callback` | Retorno autorizado de OAuth. |
| `GOOGLE_TOKEN_PATH` | `data/google-oauth.json` | Token antiguo de Gmail; se migra automáticamente a SQLite. |
| `ROCKY_DATABASE_PATH` | `data/rocky.sqlite` | Miembros, conexiones cifradas y campañas. |
| `ROCKY_TOKEN_ENCRYPTION_KEY` | secreto OAuth como respaldo | Clave para cifrar tokens; en producción usa un secreto independiente. |
| `ROCKY_GOOGLE_ALLOWED_EMAILS` | vacío | Lista inicial de correos autorizados, separada por comas. |
| `ROCKY_GOOGLE_ONLY_PAGE` | `false` | Muestra únicamente la conexión con Google. En `NODE_ENV=production` se activa automáticamente. |

## Probar borradores de Gmail

1. Habilita Gmail API y crea un cliente OAuth web en Google Cloud.
2. Registra `http://localhost:3100` como origen y `http://localhost:3100/api/integrations/google/callback` como URI de redirección.
3. Añade `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` a `rocky/.env.local`.
4. Abre el panel, agrega el correo en **Equipo autorizado** y pulsa **Continuar con Google**.
5. Usa **Crear borrador de prueba**. Rocky deja el mensaje en Borradores; no lo envía.

## Agregar integrantes

Hay dos permisos distintos:

1. Mientras la app OAuth de Google esté en modo **Testing**, agrega cada correo en Google Cloud → Google Auth Platform → Audience → Test users.
2. En el panel de Rocky, agrega el mismo correo en **Equipo autorizado**. El integrante abre el panel desde su Mac, pulsa **Continuar con Google** y elige su cuenta.

En una VM privada, cada integrante puede abrir el panel con un túnel SSH:

```bash
ssh -L 3100:127.0.0.1:3100 usuario@IP_DE_LA_VM
```

Luego abre `http://localhost:3100`. Rocky nunca solicita contraseñas; conserva refresh tokens cifrados en `rocky/data/rocky.sqlite`. Define `ROCKY_TOKEN_ENCRYPTION_KEY` como un secreto largo y estable en la VM. Si cambias esa clave, las conexiones existentes dejarán de poder descifrarse.

## Campañas y trazabilidad

La API privada permite crear campañas, asignar integrantes y registrar el borrador de cada cuenta. El envío por API exige `confirm: true`; nunca debe ejecutarse sin confirmación explícita.

- `--campaigns` / `--campañas`: lista campañas.
- `--campaign open-world` / `--campaña open-world`: muestra pendientes, borradores listos y envíos registrados.

Un estado `sent` significa que Gmail aceptó el envío. No garantiza entrega en bandeja principal ni evita rebotes.

## Estructura

- `src/admin/`: consola web, API de estado y eventos SSE.
- `src/whatsapp/`: conexión, QR, persistencia y reconexión de Baileys.
- `src/agent/`: integración con Codex SDK y detección de archivos generados.
- `src/actions/`: protocolo de acciones estructuradas de Rocky.
- `src/commands/`: comandos internos de consulta y control.
- `src/routines/`: almacenamiento y programación persistente de rutinas.
- `skills/`: instrucciones versionadas para rutinas y mensajes enriquecidos.
- `src/memory/`: futura memoria compartida.
- `src/permissions/`: futura autorización por miembros y grupos.
- `src/workers/`: futura cola de tareas largas.
- `data/`: estado persistente local; su contenido no se versiona.

## Alcance actual

El bridge conecta una cuenta de WhatsApp, conserva la sesión, enumera grupos y envía las menciones del grupo autorizado a un thread compartido de Codex. Rocky puede programar rutinas y enviar encuestas, ubicaciones, contactos, stickers, reacciones y archivos mediante acciones estructuradas.

## Comandos de WhatsApp

- `--help` / `--ayuda`
- `--status` / `--estado`
- `--clear` / `--limpiar`
- `--cancel` / `--cancelar`
- `--memory` / `--memoria`
- `--files` / `--archivos`
- `--groups` / `--grupos`
- `--routines` / `--rutinas`
- `--campaigns` / `--campañas`
- `--campaign <slug>` / `--campaña <slug>`
- `--approve` / `--aprobar`
- `--reject` / `--rechazar`

También se aceptan las variantes con raya larga que WhatsApp puede introducir automáticamente.

`--routines` es de solo lectura y muestra rutinas activas, pausadas, en ejecución y completadas. Para crear, pausar, reanudar o eliminar una rutina, se le pide a Rocky en lenguaje natural.
