# AI Driven E-Commerce

SPA de e-commerce con dos roles de usuario (customer/admin), autenticación con Firebase, catálogo con filtros y búsqueda, carrito con Context API + useReducer, checkout con órdenes persistidas, panel de administración con upload de imágenes a AWS S3 vía presigned URLs, y testing con Vitest + React Testing Library. Proyecto Integrador 5 — Henry, especialización Frontend.

**Demo en vivo:** https://ai-ecommerce-sigma.vercel.app

## Contexto del proyecto

Patagonix Tech es una software factory especializada en aplicaciones web para retail. Este proyecto simula una plataforma de e-commerce solicitada por un cliente del sector, que necesita soportar dos tipos de usuarios: clientes que navegan y compran, y administradores que gestionan catálogo y órdenes — con una solución basada en servicios administrados (BaaS) para reducir costos de infraestructura.

## Stack tecnológico

- **Frontend:** React 18 + TypeScript + Vite + React Router
- **Backend as a Service:** Firebase (Authentication + Firestore)
- **Almacenamiento de imágenes:** AWS S3 con presigned URLs
- **Backend serverless:** Vercel Serverless Functions
- **Estado global:** Context API + useReducer (carrito), Context API (auth)
- **Testing:** Vitest + React Testing Library
- **Deploy:** Vercel

## Arquitectura

El proyecto está organizado **por features** (Screaming Architecture): con solo mirar `src/features/`, se entiende que es un e-commerce con auth, productos, carrito, órdenes y administración — sin necesidad de abrir el código.

```
src/
├─ features/
│  ├─ auth/          # Login, registro (email + Google), Context de sesión y rol
│  │  ├─ components/ contexts/ hooks/ services/ types/ utils/
│  ├─ products/       # Catálogo: listar, filtrar, buscar, ver detalle
│  │  ├─ components/ hooks/ services/ types/
│  ├─ cart/           # Carrito: Context + useReducer
│  │  ├─ contexts/ reducers/ hooks/ types/
│  ├─ orders/         # Checkout y órdenes del customer
│  │  ├─ components/ services/ types/
│  └─ admin/          # Panel de administración
│     ├─ components/ services/ pages/ types/
│
├─ pages/             # Vistas que orquestan varios features (Login, Cart, Checkout...)
├─ components/        # UI compartida entre features (Header)
├─ routes/            # ProtectedRoute (sesión) y AdminRoute (sesión + rol)
├─ services/          # firebase.ts — inicialización compartida por todos los features
├─ hooks/             # useDebounce — utilidad genérica sin dominio propio
└─ test/              # Setup de Vitest, wrapper de providers, tests de integración

api/
└─ get-upload-url.ts  # Función serverless: genera presigned URLs para subir a S3
```

## Decisiones arquitectónicas

**Organización por features, no por capas técnicas.** Con dos experiencias de usuario tan distintas (customer vs. admin) y cinco dominios de negocio claros, agrupar por feature evita mezclar en una misma carpeta código que en la práctica nunca se toca en la misma sesión de trabajo.

**Dos Contexts separados (Auth y Cart), nunca uno solo.** Son dominios de estado independientes — mezclarlos generaría acoplamiento innecesario entre identidad y compras, dificultando testear cada uno por separado.

**useReducer en vez de useState para el carrito.** El carrito tiene múltiples acciones que transforman el estado de formas distintas. Centralizar esa lógica en un reducer puro la hace predecible, fácil de leer de punta a punta, y trivial de testear (mismo estado + misma acción = siempre el mismo resultado).

**El rol de usuario vive en Firestore, no en Firebase Auth.** Firebase Auth solo maneja identidad. Se modela como un campo `role` en `users/{uid}`, y las reglas de Firestore bloquean cualquier intento de que un usuario edite su propio rol (`allow update: if false`).

**Presigned URLs para subir imágenes, nunca directo con credenciales en el frontend.** El navegador jamás recibe las credenciales de AWS. Pide a nuestra función serverless una URL temporal firmada, y sube el archivo directo a S3 con esa URL.

**`onSnapshot` (tiempo real) para el admin, `getDocs` (consulta puntual) para el customer.** El catálogo público no necesita reflejar cambios en vivo. El panel admin sí se beneficia de ver cambios reflejados al instante.

## Flujo de upload de imágenes con presigned URLs

1. El admin selecciona una imagen en el formulario de producto.
2. El frontend le pide a `/api/get-upload-url` (función serverless) una URL de subida, mandando nombre y tipo del archivo.
3. La función valida esos datos, arma un `PutObjectCommand` describiendo la operación exacta (bucket, key única con timestamp, tipo de contenido), y usa `getSignedUrl` para firmarlo con las credenciales del servidor.
4. Devuelve dos URLs: una temporal firmada (válida 5 minutos, para subir) y una pública permanente (para mostrar la imagen después).
5. El frontend usa la URL temporal para subir el archivo **directo a S3** con un `PUT`, sin pasar por nuestro servidor.
6. La URL pública permanente se guarda en Firestore como `imageUrl` del producto.

Este diseño evita que las credenciales de AWS viajen al navegador, y que el archivo pesado tenga que pasar por Vercel Functions.

## Instalación y desarrollo local

Requiere Node 18+, una cuenta de Firebase con Authentication (Email/Password + Google) y Firestore habilitados, y una cuenta de AWS con un bucket de S3 configurado.

```bash
git clone https://github.com/GonzaloB1/ProyectoM5_GonzaloBastias.git
cd ProyectoM5_GonzaloBastias
npm install
cp .env.example .env
vercel dev
```

Se usa `vercel dev` en vez de `npm run dev` porque el proyecto incluye una función serverless que Vite por sí solo no puede servir.

### Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el frontend con Vite (no sirve `/api/*`) |
| `vercel dev` | Levanta frontend + función serverless simulada |
| `npm run build` | Type-check (`tsc -b`) + build de producción |
| `npm run test` | Corre la suite de Vitest |
| `npm run preview` | Sirve el build de producción localmente |

### Configuración del bucket de S3

1. Crear un bucket en S3 (ACLs disabled, Block Public Access activado por defecto).
2. Configurar CORS del bucket permitiendo `PUT` y `GET` desde los orígenes de desarrollo y producción.
3. Desbloquear específicamente las dos opciones de "bucket policies" en Block Public Access, y aplicar una bucket policy que otorgue `s3:GetObject` público — solo lectura.
4. Crear un usuario IAM sin acceso a consola, con policy `AmazonS3FullAccess`, y generar sus Access Keys.

## Variables de entorno

`.env` nunca se sube al repositorio; `.env.example` sí, sin valores reales. Las variables `VITE_*` son visibles desde el navegador — las de AWS solo existen del lado del servidor.

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Frontend | Config del proyecto de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Frontend | Dominio de autenticación de Firebase |
| `VITE_FIREBASE_PROJECT_ID` | Frontend | ID del proyecto de Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Frontend | Bucket de Firebase Storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Frontend | Sender ID de Firebase Cloud Messaging |
| `VITE_FIREBASE_APP_ID` | Frontend | ID de la app de Firebase |
| `AWS_REGION` | Serverless (`api/`) | Región de AWS donde vive el bucket de S3 |
| `AWS_ACCESS_KEY_ID` | Serverless (`api/`) | Credencial de un usuario IAM con permisos de S3 |
| `AWS_SECRET_ACCESS_KEY` | Serverless (`api/`) | Secret correspondiente al access key |
| `AWS_S3_BUCKET_NAME` | Serverless (`api/`) | Nombre del bucket donde se guardan las imágenes |

En Vercel, guardar una variable nueva no alcanza para que un deploy ya existente la tome — hace falta un redeploy (`vercel --prod`).

## Testing

```bash
npm run test
```

- **Reducer del carrito**: cubre las 4 acciones, incluyendo el caso borde de cantidad ≤ 0.
- **Custom hooks aislados**: `useDebounce` con fake timers, `useCart` con un wrapper de providers.
- **Wrapper de providers**: centraliza `BrowserRouter` + `AuthProvider` + `CartProvider` para reusar en cualquier test.
- **Componente con mock de auth**: `AdminRoute` mockeando `useAuth`, verificando las 4 ramas de decisión.
- **Test de integración**: simula agregar un producto al carrito y confirma sincronización entre componentes vía `CartProvider` real.

## Seguridad

- `.env` está en `.gitignore`; `.env.example` documenta las claves sin valores reales.
- Las credenciales de AWS nunca llegan al bundle del cliente — solo existen dentro de `api/get-upload-url.ts`.
- Las reglas de Firestore verifican el rol de admin del lado del servidor para escribir productos y actualizar órdenes — no dependen únicamente de `AdminRoute`, que es solo protección de UX.
- Un usuario no puede modificar su propio rol (`allow update: if false` en `users`).
- Toda orden nueva se valida del lado del servidor para que nazca en estado `"pending"`.
- El bucket de S3 solo permite lectura pública; subir y borrar están cerrados salvo con una presigned URL válida.

## Bitácora de uso de IA

Se utilizó Claude (Anthropic) como asistente durante todo el desarrollo, en modalidad guiada paso a paso: se pedía la explicación conceptual de cada etapa antes de escribir código, y cada bloque se revisaba y ejecutaba manualmente antes de avanzar.

### 1. Decisión de arquitectura: features vs. capas técnicas

**Consulta:** se preguntó explícitamente cuál organización de carpetas convenía para este proyecto, dado que ya se conocía el enfoque por capas técnicas de un proyecto anterior.

**Aprendizaje:** la elección depende de la cantidad de dominios de negocio distintos y de cuánto se solapan. Con un solo dominio, capas técnicas alcanza; con cinco dominios bien diferenciados y dos experiencias de usuario casi independientes, organizar por feature hace que la estructura "cuente la historia" del proyecto sin leer código.

**Decisión:** se adoptó organización por features, con la justificación lista para defender en la presentación.

### 2. Por qué useReducer y no useState para el carrito

**Consulta:** antes de escribir el reducer, se pidió explicar el motivo detrás de usar `useReducer` en vez de varios `useState`.

**Aprendizaje:** con múltiples acciones que transforman el mismo estado de formas distintas, `useState` dispersa la lógica en varias funciones separadas. `useReducer` centraliza toda esa lógica en una función pura, más predecible y trivial de testear sin mocks.

**Decisión:** se implementó `cartReducer` con 4 acciones tipadas mediante una unión discriminada, aprovechando que TypeScript infiere la forma del `payload` según el `type`.

### 3. Debugging del checksum automático de AWS SDK en presigned URLs

**Situación:** al subir una imagen desde el formulario de admin, la petición `PUT` a S3 fallaba con `ERR_FAILED`, un error de red genérico.

**Aprendizaje:** en vez de asumir que era CORS (la causa más común de ese síntoma), se investigó capa por capa. Se confirmó que la función serverless generaba la URL correctamente, y se identificó que el SDK v3 de AWS calcula automáticamente un checksum al firmar la URL — pero el archivo real todavía no existe en ese momento, así que el checksum no coincide con lo que el navegador sube después.

**Decisión:** se desactivó ese cálculo automático explícitamente (`requestChecksumCalculation: "WHEN_REQUIRED"`) en el cliente de S3.

### 4. Validación de alcance: pago simulado, sin pasarela real

**Consulta:** se consultó cómo estructurar el flujo de checkout antes de implementarlo.

**Aprendizaje:** la consigna es explícita en que el pago es simulado, sin integración con ninguna pasarela real. Se discutió el orden correcto de operaciones: crear la orden antes de vaciar el carrito, para que un error no le haga perder al usuario su selección sin haber completado la compra.

**Decisión:** el botón de confirmar compra crea directamente la orden con estado `"pending"`, sin simulación de procesamiento de pago adicional.

### 5. Corrección de rutas de SPA en producción (404 en Vercel)

**Situación:** en producción, entrar directamente a `/login` o recargar en cualquier ruta devolvía un error 404, algo que nunca pasaba en desarrollo local.

**Aprendizaje:** el servidor de desarrollo de Vite sirve automáticamente `index.html` para cualquier ruta. Vercel en producción no asume ese comportamiento por defecto — busca un archivo o carpeta con ese nombre exacto.

**Decisión:** se agregó `vercel.json` con una regla de rewrite para que cualquier ruta no reconocida sirva igual `index.html`, delegando el ruteo real a React Router del lado del cliente.

### 6. Priorización de tiempo: funcionalidad antes que diseño visual

**Consulta:** se consultó cuánto tiempo dedicarle al CSS para que el proyecto "aparente una tienda real y profesional".

**Aprendizaje:** dado el volumen de pantallas distintas de un e-commerce, el CSS podía llevar varias horas — y la rúbrica de corrección pesa mucho más la arquitectura, la seguridad y la funcionalidad completa que el pulido visual.

**Decisión:** se dejó el CSS para el final del proyecto, priorizando tener una aplicación evaluable y estable antes que una visualmente atractiva pero con riesgo de quedar incompleta.