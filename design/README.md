# Opportunities Hub — Diseño UI (Apple Frosted Glass Edition)

> **Exportación principal (Fullpage 2x):** [`opportunities-hub-apple.png`](./opportunities-hub-apple.png) (2880 × 3140 px)  
> **Código fuente HTML/CSS:** [`opportunities-hub-apple.html`](./opportunities-hub-apple.html)  
> **Iteraciones previas vectoriales:** [`opportunities-hub.pen`](./opportunities-hub.pen)

---

## 1. Fundamentos del Lenguaje de Diseño Apple (VisionOS / iOS 18 Glassmorphism)

Inspirado en la documentación de diseño de Apple (Human Interface Guidelines) y las referencias visuales de *Frosted Glass / Liquid Glass*:

1. **Materiales Ópticos sobre Superficies Planas:**
   - En lugar de cajas opacas y planas, las tarjetas y la navegación utilizan **vidrio translúcido esmerilado (*Frosted Glass*)**.
   - Propiedades CSS nativas: `backdrop-filter: blur(36px) saturate(180%)` con un relleno base en gradiente `linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.6) 100%)`.

2. **Borde Especular y Rim Light:**
   - Un borde milimétrico de 1px (`rgba(255, 255, 255, 0.9)`) que simula la refracción de luz en el bisel del vidrio, acompañado de un reflejo interior (`inset 0 1px 2px rgba(255, 255, 255, 1)`).

3. **Iluminación Ambiental y Refracción:**
   - Una malla ambiental de fondo con gradientes radiales suaves en **Azul Cobalto (`#214FDD`)** y **Spark Cyan (`#6CE5E8`)**, combinada con una cuadrícula geométrica tenue. Esta luz ambiental se refracta y cobra vida a través de los paneles de vidrio.

4. **Navegación e Islas Flotantes (Floating Island Navigation):**
   - Barra superior e inferior en cápsulas flotantes despegadas de los bordes de la pantalla (estilo *Dynamic Island* y *Control Center* de visionOS).

5. **Tipografía y Jerarquía:**
   - Tipografía geométrica limpia (`Inter`), tracking ajustado (`-0.04em`), etiquetas cápsula esmeriladas para categorías y plazos, y botones píldora con micro-resplandores controlados.

---

## 2. Componentes de la Interfaz

- **Island Nav Bar:** Cápsula flotante superior con el logotipo `BRE▲KOUT`, pastilla de módulo, navegación principal y botón de acción con brillo interior.
- **Hero & Ticker:** Titular de alto impacto con gradiente cobalto, cápsula de estado con pulso activo y cinta de estadísticas (`+$850,000 USD`, `100% Verificadas`, `5 cierres este mes`).
- **Dock de Búsqueda Flotante:** Caja esmerilada con buscador en tiempo real, selectores integrados y botón de búsqueda azul cobalto.
- **Cuadrícula de Tarjetas de 2 Columnas:**
  - Tarjeta destacada de Y Combinator con marco especular cobalto.
  - Tarjetas de StartUp Perú 11G, Platanus Ventures y ETHGlobal con etiquetas esmeriladas y botones píldora.
- **Floating Island Footer:** Cápsula inferior de cierre con enlaces del ecosistema Breakout.
