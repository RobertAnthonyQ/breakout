# Imágenes públicas para correos

## Principio

Gmail no puede cargar un archivo que solo existe en el disco de Rocky. Una imagen del correo debe estar publicada en una URL HTTPS que cualquier cliente pueda consultar sin cookies, inicio de sesión, VPN ni encabezados especiales.

## Flujo local y de producción

1. Genera u optimiza la imagen en `BREAKOUT-CREACIONES/<slug>/email/assets/`.
2. Durante la preparación usa `{{ASSET_BASE_URL}}/<slug>/<archivo>` en HTML y registra el archivo en `asset-manifest.json`.
3. Propón una ruta permanente, por ejemplo `https://assets.breakout.lat/email/<slug>/<archivo>`, solo si ese dominio y directorio están realmente configurados.
4. Solicita confirmación explícita antes de subir el archivo a la VM o hacerlo público.
5. Publica sin sobrescribir una versión usada por una campaña anterior. Usa nombres versionados como `hero-v2.png` o con hash de contenido.
6. Sustituye el marcador por la URL final y vuelve a validar el HTML.

## Requisitos del hosting

- HTTPS válido y URL estable.
- Acceso público mediante `GET` y `HEAD`, sin autenticación ni redirección a login.
- `Content-Type` correcto: `image/png` o `image/jpeg`.
- Caché pública prolongada para archivos versionados, por ejemplo `Cache-Control: public, max-age=31536000, immutable`.
- No bloquear proxies de imágenes de Gmail ni hotlinking legítimo.
- Mantener los archivos mientras la campaña o sus archivos históricos puedan consultarse.

## Preparación del asset

- Diseña normalmente a 1200–1360 px de ancho para mostrarlo a 600–680 px en pantallas de alta densidad.
- Prefiere un peso inferior a 300 KB cuando la calidad lo permita.
- Usa JPEG para fotografías y PNG para gráficos o transparencia.
- Evita SVG, GIF pesado y texto pequeño dentro de la imagen.
- Declara ancho, alto y texto alternativo en el HTML para reducir saltos visuales.

## Verificación después de publicar

Comprueba:

1. La URL responde `200` sin sesión.
2. El `Content-Type` corresponde al archivo.
3. La imagen abre desde una red o sesión ajena.
4. El HTML ya no contiene `{{ASSET_BASE_URL}}`, rutas locales ni URLs relativas.
5. Si la imagen falla, asunto, titular, datos y CTA todavía se entienden.

No uses la landing de Vercel como depósito improvisado si el activo pertenece al servicio de Rocky. En producción, sirve estos archivos desde la VM o desde un almacenamiento/CDN deliberadamente configurado para assets públicos.
