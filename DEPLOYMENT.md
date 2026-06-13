# 🚀 Guía de Deployment en Vercel

## Pasos para Deployment con Dominio Personalizado

### 1. Preparación del Proyecto

```bash
# Asegúrate de que todo funciona localmente
npm run build
npm start

# Si todo está bien, procede con el deployment
```

### 2. Subir a GitHub (si aún no lo has hecho)

```bash
git init
git add .
git commit -m "Preparado para producción"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

### 3. Deploy en Vercel

#### Opción A: Interfaz Web (Más Fácil)

1. **Ir a Vercel**

   - Visita [vercel.com/new](https://vercel.com/new)
   - Inicia sesión con GitHub

2. **Importar Proyecto**

   - Click en "Import Project"
   - Selecciona tu repositorio
   - Vercel detecta automáticamente Next.js

3. **Configuración**

   - **Framework Preset:** Next.js (auto-detectado)
   - **Root Directory:** ./
   - **Build Command:** `npm run build` (auto)
   - **Output Directory:** `.next` (auto)
   - Click en "Deploy"

4. **Esperar**
   - El primer deploy toma 1-2 minutos
   - Recibirás un dominio temporal: `tu-proyecto.vercel.app`

#### Opción B: CLI (Más Rápido)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Sigue las instrucciones en terminal
```

### 4. Configurar tu Dominio Personalizado

#### 4.1 En Vercel Dashboard

1. Ve a tu proyecto en Vercel
2. Click en **"Settings"** → **"Domains"**
3. Click en **"Add"**
4. Ingresa tu dominio: `tudominio.com`
5. Click en **"Add"**

#### 4.2 Configurar DNS

Vercel te dará 2 opciones:

**OPCIÓN 1: Usar Nameservers de Vercel (MÁS FÁCIL)**

Cambia los nameservers en tu proveedor de dominio a:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Ventajas:

- ✅ Configuración automática
- ✅ SSL automático
- ✅ Mejor rendimiento
- ✅ No necesitas configurar registros DNS

**OPCIÓN 2: Configurar Registros DNS Manualmente**

En tu proveedor de dominio (GoDaddy, Namecheap, etc.), agrega:

**Para el dominio raíz (`tudominio.com`):**

```
Tipo: A
Nombre: @
Valor: 76.76.21.21
TTL: 3600
```

**Para el subdominio www:**

```
Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
TTL: 3600
```

#### 4.3 Verificación

1. Los cambios DNS pueden tardar 1-48 horas (usualmente 30min - 2h)
2. Vercel verificará automáticamente
3. El SSL se configurará automáticamente

### 5. Variables de Entorno (Opcional)

Si necesitas agregar variables de entorno:

1. En Vercel Dashboard → Settings → Environment Variables
2. Agrega las variables necesarias:
   ```
   NEXT_PUBLIC_SITE_URL = https://tudominio.com
   ```
3. Re-deploy para aplicar cambios:
   ```bash
   vercel --prod
   ```

### 6. Configuración de Múltiples Dominios

Si tienes varios dominios:

1. Settings → Domains
2. Agrega cada dominio
3. Marca uno como "Primary Domain"
4. Los demás harán redirect automático al principal

### 7. Configurar HTTPS Redirect

Vercel hace esto automáticamente:

- ✅ HTTP → HTTPS redirect
- ✅ www → non-www (o viceversa)
- ✅ SSL/TLS automático

### 8. Optimizaciones Post-Deploy

#### Analytics (Opcional)

```bash
# Si quieres analytics de Vercel
vercel analytics enable
```

#### Speed Insights (Opcional)

```bash
# Para métricas de rendimiento
vercel speed-insights enable
```

### 9. Comandos Útiles

```bash
# Ver status del proyecto
vercel inspect

# Ver logs en tiempo real
vercel logs

# Listar deployments
vercel ls

# Rollback a deployment anterior
vercel rollback

# Remover dominio
vercel domains rm tudominio.com
```

### 10. Troubleshooting

**❌ El dominio no funciona después de 24h**

- Verifica que los DNS estén correctos en tu proveedor
- Usa [whatsmydns.net](https://www.whatsmydns.net/) para verificar propagación
- Asegúrate de que el dominio esté activo (no vencido)

**❌ Error 404 en producción**

- Verifica que el build sea exitoso en Vercel
- Revisa los logs: `vercel logs`
- Asegúrate que `npm run build` funcione localmente

**❌ Errores de variables de entorno**

- Verifica que todas las variables estén en Vercel
- Las variables `NEXT_PUBLIC_*` son las únicas expuestas al cliente
- Re-deploy después de agregar variables

**❌ SSL no se configura**

- Espera 1-2 horas
- Verifica que el DNS apunte correctamente a Vercel
- Contacta soporte de Vercel si persiste

### 11. Monitoreo Post-Deploy

1. **Vercel Dashboard**

   - Revisa métricas de rendimiento
   - Monitorea errores
   - Verifica analytics

2. **Google Search Console**

   - Agrega tu sitio
   - Verifica propiedad
   - Envía sitemap: `https://tudominio.com/sitemap.xml`

3. **Google Analytics** (opcional)
   - Crea propiedad
   - Agrega código de seguimiento
   - Configura eventos personalizados

## ✅ Checklist Final

- [ ] Build local exitoso (`npm run build`)
- [ ] Código en GitHub
- [ ] Proyecto importado en Vercel
- [ ] Deploy inicial exitoso
- [ ] Dominio agregado en Vercel
- [ ] DNS configurados
- [ ] SSL/HTTPS funcionando
- [ ] Variables de entorno configuradas
- [ ] Sitemap accesible
- [ ] robots.txt configurado
- [ ] Google Search Console verificado
- [ ] Rendimiento verificado en Lighthouse

## 🎉 ¡Listo!

Tu sitio está en producción en: **https://tudominio.com**

---

**Soporte:**

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- [Next.js Docs](https://nextjs.org/docs)
