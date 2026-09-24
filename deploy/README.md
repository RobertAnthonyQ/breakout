# Despliegue de Breakout y Rocky

La VM ejecuta dos contenedores con red del host:

- Landing: `127.0.0.1:3500`.
- Rocky: `127.0.0.1:3100`.
- Nginx publica ambos servicios y sirve `/srv/breakout-assets` para imágenes de correos.

Los archivos `deploy/.env.rocky`, `.runtime/codex/` y `rocky/data/` son estado privado de la VM y nunca se versionan.

## Operación

```bash
cd /opt/breakout/deploy
docker compose up -d --build
docker compose ps
docker compose logs -f rocky
```

## URLs de producción

- Landing: `https://www.breakout.lat` (Vercel).
- Rocky: `https://rocky.breakout.lat` (VM).
- Imágenes de correo: `https://assets.breakout.lat` (VM).

Antes de conectar Gmail en producción se debe registrar exactamente este retorno en Google Cloud:

```text
https://rocky.breakout.lat/api/integrations/google/callback
```
