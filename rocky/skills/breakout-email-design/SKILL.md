---
name: breakout-email-design
description: "Crea, mejora y verifica correos HTML editoriales de Breakout para invitaciones, campañas, newsletters y borradores de Gmail, incluida la preparación de imágenes públicas para el correo. Usar cuando se pida diseñar un email, su copy, plantilla HTML, hero visual, CTA o paquete de assets; no usar para posts o carruseles de redes sociales."
---

# Breakout Email Design

Crea correos reconocibles como Breakout, compatibles con Gmail y útiles incluso cuando el cliente bloquea las imágenes. El diseño debe sentirse editorial y preciso, no como una plantilla promocional genérica.

## Preparación

1. Lee la información relevante de `BREAKOUT-CONTEXTO/`. No inventes fecha, hora, lugar, enlace, aliados ni beneficios.
2. Lee [references/email-system.md](references/email-system.md) para definir estructura, dirección visual y restricciones HTML.
3. Si el correo llevará una imagen, lee además [references/image-hosting.md](references/image-hosting.md).
4. Para la identidad visual base consulta [../breakout-social-design/references/brand-system.md](../breakout-social-design/references/brand-system.md), pero adapta el sistema a correo: menos recursos decorativos, mayor claridad y compatibilidad.

## Flujo

1. Define asunto, preheader, audiencia, objetivo y una sola acción principal.
2. Elige la ruta visual según el contenido:
   - **Editorial directa**, por defecto: hero azul, gran titular, metadatos sobrios, cuerpo blanco y CTA dominante.
   - **Informativa modular**: cabecera compacta y tarjetas claras cuando hay agenda, varios beneficios o instrucciones.
3. Escribe primero la versión de texto. El mensaje debe entenderse sin estilos ni imágenes.
4. Construye HTML de email con tablas de presentación, estilos inline y ancho fluido limitado. No uses JavaScript, formularios, Grid, Flexbox ni SVG embebido.
5. Si una imagen aporta identidad, genera una pieza horizontal mediante la herramienta built-in `imagegen`. No rasterices el correo completo ni delegues texto esencial a la imagen. Usa texto HTML para título, fecha, lugar y CTA.
6. Guarda el paquete en `BREAKOUT-CREACIONES/<slug>/email/` con `email.html`, `email.txt`, `assets/` y `asset-manifest.json` cuando corresponda.
7. Ejecuta `mise exec -- node rocky/skills/breakout-email-design/scripts/validate-email.mjs <ruta-email.html>`.
8. Renderiza y revisa el resultado en ancho móvil y escritorio. Corrige desbordes, enlaces, contraste, espaciado y lectura con imágenes bloqueadas.

## Imágenes y publicación

- En local usa `{{ASSET_BASE_URL}}/<campaña>/<archivo>` hasta conocer la URL pública definitiva.
- En un borrador real, cada `src` debe ser una URL absoluta `https://` pública, estable y sin autenticación. Nunca uses rutas locales, `localhost`, `file:`, `blob:` ni URLs relativas.
- Publicar una imagen en la VM cambia estado externo: hazlo solo con autorización explícita. Antes de publicar, muestra los archivos y la ruta pública propuesta.
- Después de publicar, verifica respuesta HTTP, `Content-Type`, tamaño y que la URL abra sin sesión. Actualiza `asset-manifest.json` con la URL final.
- Usa PNG para gráficos y JPEG para fotografía. No uses SVG dentro del correo.

## Criterios de rechazo

Rehaz el correo si parece un flyer largo, si depende de una sola imagen para comunicar la información, si contiene texto diminuto, si hay más de un CTA principal, si el hero ocupa casi todo el mensaje o si una imagen no tiene alternativa textual. También recházalo si incluye datos no verificados o URLs locales.

No envíes el correo desde esta skill. La creación de borradores y cualquier envío siguen las reglas de campaña y confirmación de `AGENTS.md`.
