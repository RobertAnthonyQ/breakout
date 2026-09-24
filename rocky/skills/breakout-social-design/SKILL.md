---
name: breakout-social-design
description: "Crea y revisa piezas editoriales de Breakout para redes sociales: posts, portadas, key visuals de eventos y carruseles. Usar cuando la solicitud combine marca, composición y texto; no usar para fotografías, ilustraciones o imágenes normales sin diseño editorial."
---

# Breakout Social Design

Diseña piezas reconocibles como Breakout, no plantillas publicitarias genéricas. Conserva la identidad entre publicaciones sin repetir una composición fija.

## Alcance

- Activa esta skill para posts estáticos, anuncios editoriales, portadas de eventos, carruseles e imágenes de portada para reels.
- No la actives cuando el usuario solo pida una imagen, fotografía, ilustración, edición visual o sticker sin texto ni estructura de marca. En esos casos usa `imagegen` normalmente.
- Toda pieza creada con esta skill debe invocar realmente la herramienta built-in `imagegen`. No resuelvas un post o carrusel únicamente con SVG, HTML, CSS, Canvas, Pillow o formas programáticas.
- Cada post o lámina debe partir de una composición visual propia de `imagegen`; no reutilices una sola imagen como wallpaper de toda una serie. Mantén continuidad usando la primera salida como referencia y pidiendo variaciones coherentes para las demás láminas.
- El resultado de `imagegen` debe seguir siendo la composición dominante en el PNG final. No lo cubras con paneles opacos o semitransparentes extensos, no lo reduzcas a una textura apenas visible y no reconstruyas el diseño encima con formas genéricas.
- Para texto exacto, logos y metadatos, puedes añadir una capa determinista mínima en SVG o HTML/CSS y exportar a PNG. Esa capa solo corrige lo que `imagegen` no debe inventar: no debe reemplazar el layout, la dirección de arte ni el gesto visual principal.

## Preparación

1. Lee la información relevante de `BREAKOUT-CONTEXTO/` y no inventes fechas, lugares, nombres, logos aliados ni llamadas a la acción. Contrasta entre sí la fecha, el día de la semana, el horario, el programa y el lugar. Si las fuentes se contradicen, pide una aclaración breve antes de generar; no escojas una versión en silencio.
2. Determina el objetivo de la pieza, el contenido imprescindible y el formato. Si no se indica formato, usa 1080 × 1350 para feed; usa 1080 × 1920 para story/reel y 1080 × 1080 solo cuando se solicite cuadrado.
3. Lee [references/brand-system.md](references/brand-system.md) para escoger una ruta visual.
4. Si es un carrusel, lee también [references/carousels.md](references/carousels.md) antes de diseñarlo.

## Ejecución

1. Define en pocas líneas la idea visual, la jerarquía y el motivo recurrente. No redactes un manifiesto largo.
2. Antes de invocar `imagegen`, escribe un microbrief por pieza o lámina: función narrativa, sujeto visual, punto focal, zona reservada para texto, densidad y relación con la lámina anterior. Evita adjetivos vacíos; describe decisiones observables.
3. Invoca `imagegen` para generar la composición completa sin texto exacto. En un carrusel genera una salida distinta por lámina y usa referencias visuales para conservar lenguaje, paleta y materiales mientras cambia la escena, el encuadre o el foco narrativo. No solicites un único “sistema reutilizable para varias láminas”.
4. El concepto visual debe expresar el contenido real. No conviertas el nombre o la metáfora del evento en una escena literal si eso desplaza el tema: startups, IA, comunidad, personas, aprendizaje u oportunidades deben seguir siendo reconocibles.
5. Añade el texto exacto respetando el espacio previsto por la imagen. Usa las tipografías de marca disponibles y modifica la salida con edición generativa o regenera la composición si no deja una zona legible; no tapes el problema con una tarjeta blanca o beige.
6. Trabaja con una ruta visual principal. Mezcla rutas únicamente cuando exista una razón narrativa clara.
7. Guarda fuente editable y finales en `BREAKOUT-CREACIONES/<slug-descriptivo>/`. Para carruseles usa nombres `01-portada.png`, `02-....png` y así sucesivamente.
8. Para exportar un SVG usa el renderizador incluido: `mise exec -- node rocky/skills/breakout-social-design/scripts/render-svg.mjs <entrada.svg> <salida.png> [ancho] [alto]`. No pierdas tiempo buscando otra herramienta salvo que este comando falle.
9. Renderiza y abre cada salida. Rechaza láminas donde el arte generado quede oculto, la tipografía parezca una plantilla, una misma base se repita o el contenido factual no esté verificado.
10. Haz una segunda pasada de refinamiento eliminando ruido y ajustando lo existente; no soluciones una pieza débil agregando más adornos.

## Criterios de calidad

- La pieza debe sentirse editorial, joven, tecnológica y humana; nunca como un anuncio corporativo de stock.
- El contenido debe poder leerse rápidamente en pantalla móvil.
- Usa asimetría intencional, espacio negativo y repetición controlada. La precisión de retícula convive con una intervención sketch humana.
- Conserva en todas las láminas la paleta, retícula, tipografía, tratamiento fotográfico y uno o dos motivos recurrentes.
- Rechaza el resultado si el recurso de `imagegen` no se percibe en la composición final o si el diseño podría haberse producido enteramente con rectángulos y texto.
- Rechaza un carrusel si dos láminas comparten exactamente la misma imagen base, aunque cambien la opacidad, el recorte o el texto.
- No uses Arial por conveniencia. Prioriza Poppins para titulares y Raleway para cuerpo; si no están disponibles, elige equivalentes cercanos y documenta la sustitución.
- Evita gradientes morado-neón, circuitos de IA genéricos, objetos 3D aleatorios, exceso de glow, fondos futuristas oscuros y saturación de texto.
- No imites la firma visual de artistas vivos ni reutilices material sin permiso.
