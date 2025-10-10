# Breakout Landing Page

Landing page profesional para Breakout, desarrollada con Next.js 15, React 19 y Tailwind CSS.

## 🚀 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build de producción
npm run build

# Ejecutar producción localmente
npm start
```

Abre [http://localhost:3000](http://localhost:3000) para ver el resultado.

## 📦 Deploy en Vercel

### Opción 1: Deploy Automático (Recomendado)

1. **Push tu código a GitHub**

   ```bash
   git add .
   git commit -m "Preparado para producción"
   git push origin main
   ```

2. **Conecta con Vercel**

   - Ve a [vercel.com/new](https://vercel.com/new)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente Next.js
   - Click en "Deploy"

3. **Configura tu dominio personalizado**
   - En el Dashboard de Vercel, ve a Settings → Domains
   - Agrega tu dominio
   - Sigue las instrucciones para configurar los DNS:
     - **Si tu dominio está en otro proveedor:** Apunta un registro `A` a `76.76.21.21` o usa `CNAME` apuntando a `cname.vercel-dns.com`
     - **O transfiere los nameservers** a Vercel (más fácil)

### Opción 2: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Variables de Entorno (Opcional)

Si necesitas variables de entorno, créalas en Vercel:

- Settings → Environment Variables
- Ejemplo: `NEXT_PUBLIC_SITE_URL=https://tu-dominio.com`

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15 con App Router
- **React:** 19.1.0
- **Estilos:** Tailwind CSS 4
- **Animaciones:** Framer Motion, GSAP
- **UI Components:** Radix UI
- **Efectos:** TSParticles, Atropos

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo con Turbopack
- `npm run build` - Build de producción
- `npm start` - Ejecutar build de producción
- `npm run lint` - Ejecutar ESLint

## 🌐 Configuración de Dominio

### DNS Records necesarios:

**Opción A - Registro A (IP):**

```
Type: A
Name: @
Value: 76.76.21.21
```

**Opción B - CNAME (Recomendado):**

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**Subdominio www:**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 📱 Optimizaciones de Producción

✅ Compresión automática activada
✅ Optimización de imágenes (AVIF, WebP)
✅ React Strict Mode
✅ Header de seguridad configurados
✅ Build optimizado con Turbopack

## 🔒 Seguridad

El proyecto incluye:

- CSP headers configurados
- Protección contra clickjacking
- Headers de seguridad optimizados
