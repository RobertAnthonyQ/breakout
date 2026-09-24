# Sistema editorial para correos de Breakout

## Dirección visual

Usa como base los ejemplos editoriales de Breakout: grandes campos de azul, tipografía contundente, información escaneable, espacio negativo amplio y pocos módulos. La primera pantalla debe comunicar qué es el evento, por qué importa y cuál es la acción siguiente.

Paleta recomendada:

- Azul Breakout: `#2430FF`.
- Blanco: `#FFFFFF`.
- Fondo cálido opcional: `#F1EAE4`.
- Gris frío para módulos: `#F3F4FA` o `#E1E1E1`.
- Texto principal: `#171925` o `#292929`.
- Texto secundario: `#555B70`.

Usa fuentes seguras de sistema en el HTML: `Arial`, `Helvetica`, `sans-serif`. Poppins y Raleway pueden orientar el ritmo visual, pero no deben ser una dependencia remota para que el correo se entienda.

## Ruta editorial directa

Es la opción predeterminada para un evento, convocatoria o anuncio principal.

1. Preheader oculto de 40–100 caracteres.
2. Hero azul con firma Breakout pequeña, etiqueta del evento, fecha/lugar, titular grande y promesa breve.
3. Cuerpo blanco con una idea central y uno o dos párrafos cortos.
4. Módulo claro de datos: fecha, hora, lugar y modalidad.
5. CTA azul único, claro y descriptivo.
6. Nota logística breve y pie con identidad/contacto.

El hero no debe imitar un banner publicitario ni contener todos los detalles. Evita barras de progreso decorativas que sugieran un estado real inexistente.

## Ruta informativa modular

Úsala cuando el correo necesite explicar una agenda o varios beneficios.

1. Cabecera azul compacta con nombre del evento.
2. Resumen de dos o tres líneas.
3. Datos esenciales en un solo bloque.
4. CTA principal.
5. Un módulo de beneficios con máximo tres puntos.
6. Pie sobrio.

No acumules cajas, íconos y llamadas a la acción. Un módulo debe existir porque organiza información, no porque queda espacio.

## Copy

- Asunto: concreto, sin mayúsculas excesivas ni urgencia falsa.
- Preheader: complementa el asunto; no lo repite.
- Titular: máximo aproximado de 8 palabras.
- Promesa: específica y verificable.
- CTA: verbo + resultado, por ejemplo `Reserva tu cupo` o `Revisa la agenda`.
- Usa emojis solo si encajan con el tono y no como sustituto de iconos esenciales.
- Evita clichés como “una experiencia única”, “no te lo puedes perder” o promesas no sustentadas.

## Construcción HTML compatible

- Contenedor central de 600–680 px, con ancho fluido en móvil.
- Maquetación con tablas `role="presentation"`; CSS esencial inline.
- Fondo y texto con contraste suficiente; tamaño de cuerpo de 16 px o mayor.
- Botón mediante tabla/celda y enlace con padding; el enlace debe seguir siendo visible si fallan estilos parciales.
- Imágenes responsivas con `display:block`, dimensiones declaradas, `max-width:100%`, `height:auto` y `alt` útil.
- No uses JavaScript, formularios, iframes, video, canvas, SVG, Grid, Flexbox, `position: fixed` ni hojas de estilo externas.
- No uses una imagen de fondo para información imprescindible. Los fondos pueden no cargar.
- Incluye texto plano equivalente en `email.txt`.
- Incluye enlace de baja y datos institucionales cuando la campaña y la normativa aplicable lo requieran.

## Paquete de entrega

```text
BREAKOUT-CREACIONES/<slug>/email/
├── email.html
├── email.txt
├── assets/
│   └── hero-v1.png
└── asset-manifest.json
```

Ejemplo de manifiesto antes de publicar:

```json
{
  "baseUrl": "{{ASSET_BASE_URL}}",
  "assets": [
    {
      "file": "assets/hero-v1.png",
      "publicPath": "/email/<slug>/hero-v1.png",
      "url": null,
      "status": "local"
    }
  ]
}
```

## Revisión final

- La información coincide con el contexto fuente.
- Asunto y preheader trabajan juntos.
- Existe un solo CTA primario y todos los enlaces tienen destino real o marcador explícito.
- El correo sigue siendo comprensible con imágenes desactivadas.
- No hay texto esencial horneado dentro de la imagen.
- No existen rutas locales ni recursos protegidos por sesión.
- Se revisó al menos una vista móvil y una de escritorio.
