# Life App

Life App es una aplicación web construida con Next.js para organizar los aspectos personales y compartidos de una pareja desde un único espacio. El proyecto ya incluye autenticación con Clerk, un modelo de datos compartido con Prisma/PostgreSQL y módulos funcionales para despensa, finanzas, hábitos, agenda, deudas, inversiones y comidas.

## Índice

- [Estado actual](#estado-actual)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura completa](#estructura-completa)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Modelos de datos](#modelos-de-datos)
- [Autenticación y parejas](#autenticación-y-parejas)
- [Patrones de implementación](#patrones-de-implementación)
- [Componentes compartidos](#componentes-compartidos)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Comandos disponibles](#comandos-disponibles)
- [Flujo de desarrollo](#flujo-de-desarrollo)
- [Estado de los módulos](#estado-de-los-módulos)
- [Próximas mejoras](#próximas-mejoras)
- [Verificación y calidad](#verificación-y-calidad)

## Estado actual

El proyecto se encuentra en una fase funcional y madura para continuar su desarrollo.

Implementado:

- Registro e inicio de sesión con Clerk.
- Onboarding para crear o unirse a una pareja mediante código.
- Asociación de registros a una pareja mediante `coupleId`.
- Navegación lateral de todos los módulos principales.
- Despensa con creación, edición y eliminación.
- Finanzas con cuentas, categorías, movimientos, tarjetas y planes a meses.
- Hábitos con frecuencia, seguimiento diario y historial.
- Agenda semanal por días y bloques de tiempo.
- Deudas con creación automática de pagos y amortización.
- Inversiones con valor actual y aportaciones.
- Recetas y planes semanales de comidas.
- Ajustes con código de invitación y miembros de la pareja.
- Compilación de producción con Next.js 16 y Cache Components.

Verificado al momento de esta documentación:

- `npm run lint`: pasa sin errores ni advertencias.
- `npx tsc --noEmit`: pasa sin errores.
- `npm run build`: compila y genera las rutas de la aplicación.

## Stack tecnológico

| Tecnología | Versión declarada | Uso |
| --- | --- | --- |
| Next.js | 16.4.6 | App Router, Server Components, Server Actions y compilación |
| React | 19.3.0 | Componentes y estado de formularios |
| TypeScript | 5 | Tipado estricto |
| Tailwind CSS | 4.3.3 | Diseño mediante utilidades |
| Clerk | 7.10.1 | Sesiones e identidad de usuarios |
| Prisma | 6.19.3 | ORM, esquema, migraciones y cliente generado |
| PostgreSQL | — | Base de datos relacional |
| Zod | 4.6.7 | Validación de formularios y datos |
| ESLint | 9 | Revisión estática |

## Arquitectura

### Renderizado

El proyecto utiliza el App Router de Next.js con:

- Server Components para consultar datos.
- Client Components para formularios con `useActionState`.
- Server Actions para crear, actualizar, eliminar y cambiar estados.
- Suspense alrededor de componentes que usan autenticación o base de datos.
- Cache Components habilitado en `next.config.ts`.
- `partialPrefetching` habilitado.

No se usa `export const dynamic`. Las páginas protegidas o dependientes de sesiones utilizan un componente de página no async que pinta el shell y un componente async separado dentro de Suspense.

### Aislamiento por pareja

Las consultas y mutaciones principales utilizan `requireCouple()` y filtran por `coupleId`.

El flujo general es:

1. Clerk proporciona el `userId`.
2. `requireCouple()` busca el registro `Couple` al que pertenece el usuario.
3. Devuelve `userId` y `coupleId`.
4. Las queries usan `coupleId` en `where`.
5. Las actualizaciones y eliminaciones buscan primero el registro con `id` y `coupleId`.

Esto evita que un miembro modifique registros de otra pareja.

### Base de datos

La aplicación importa `PrismaClient` desde `src/generated/prisma/client`. El cliente se crea una sola vez y se reutiliza fuera de producción para evitar instancias adicionales durante el desarrollo.

Prisma carga el esquema desde `prisma/`, donde `schema.prisma` contiene la configuración común y `prisma/models/*.prisma` contiene los modelos separados por área.

### Autorización

El proxy protege todas las rutas excepto inicio de sesión, registro y cierre de sesión. Las páginas protegidas también llaman a `requireSessionPage()`, que:

- Redirige a `/sign-in` sin sesión.
- Redirige a `/onboarding/couple` si el usuario no pertenece a una pareja.
- Devuelve el contexto del usuario y la pareja cuando ambos existen.

## Estructura completa

```text
life-app/
├── .env                      # Variables PostgreSQL/Prisma
├── .env.local                # Variables locales de Clerk y Next.js
├── AGENTS.md                 # Reglas especiales para agentes del repositorio
├── README.md                 # Documentación del proyecto
├── eslint.config.mjs         # Configuración de ESLint
├── next-env.d.ts             # Referencias generadas de Next.js
├── next.config.ts            # Cache Components, Turbopack y prefetch parcial
├── package.json              # Dependencias y scripts
├── prisma.config.ts          # Configuración del CLI de Prisma
├── tsconfig.json             # TypeScript estricto y alias @/*
├── tsconfig.tsbuildinfo      # Caché incremental de TypeScript
├── prisma/
│   ├── schema.prisma         # Configuración y motor Prisma
│   ├── migrations/
│   │   ├── migration_lock.toml
│   │   └── 20261117044158_init_couple_model/
│   │       └── migration.sql
│   └── models/
│       ├── couple.prisma
│       ├── debt.prisma
│       ├── finance.prisma
│       ├── habits.prisma
│       ├── investment.prisma
│       ├── meals.prisma
│       ├── pantry.prisma
│       └── schedule.prisma
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── src/
    ├── proxy.ts
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── error.tsx
    │   ├── not-found.tsx
    │   ├── favicon.ico
    │   ├── sign-in/[[...sign-in]]/page.tsx
    │   ├── sign-up/[[...sign-up]]/page.tsx
    │   ├── sign-out/page.tsx
    │   ├── onboarding/couple/page.tsx
    │   ├── dev/database/page.tsx
    │   └── (app)/
    │       ├── layout.tsx
    │       ├── loading.tsx
    │       ├── page.tsx
    │       ├── pantry/
    │       ├── finance/
    │       ├── habits/
    │       ├── schedule/
    │       ├── debts/
    │       ├── investments/
    │       ├── meals/
    │       └── settings/
    ├── components/
    │   ├── database-model-counts.tsx
    │   ├── forms/
    │   │   └── form-field.tsx
    │   └── ui/
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── confirm-dialog.tsx
    │       ├── currency-input.tsx
    │       ├── date-picker.tsx
    │       ├── empty-state.tsx
    │       ├── error-message.tsx
    │       ├── form-field.tsx
    │       ├── input.tsx
    │       ├── loading.tsx
    │       ├── modal.tsx
    │       ├── page-header.tsx
    │       ├── select.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       └── toast.tsx
    ├── generated/prisma/
    │   ├── client.ts
    │   ├── browser.ts
    │   ├── commonInputTypes.ts
    │   ├── enums.ts
    │   ├── models.ts
    │   ├── internal/
    │   └── models/
    └── lib/
        ├── auth.ts
        ├── constants.ts
        ├── couple.ts
        ├── db.ts
        ├── decimal.ts
        ├── debts-utils.ts
        ├── finance-utils.ts
        ├── format.ts
        ├── habits-utils.ts
        ├── investments-utils.ts
        ├── meals-utils.ts
        ├── pantry-utils.ts
        ├── prisma-errors.ts
        ├── schedule-utils.ts
        └── validations/
            ├── debts.ts
            ├── finance.ts
            ├── habits.ts
            ├── investments.ts
            ├── meals.ts
            ├── pantry.ts
            └── schedule.ts
```

El directorio `src/generated/prisma/` es generado por Prisma. No debe editarse manualmente.

### Archivos principales de configuración

- `next.config.ts`: activa `cacheComponents`, `partialPrefetching` y el procesador Tailwind para Turbopack.
- `tsconfig.json`: usa modo estricto, resolución `bundler`, JSX React 19 y el alias `@/*`.
- `prisma.config.ts`: configura el esquema desde `prisma/`, las migraciones y la URL directa del CLI.
- `eslint.config.mjs`: integra las reglas de Next.js y el proyecto.
- `src/proxy.ts`: protege las rutas con Clerk.
- `src/app/layout.tsx`: aplica `ClerkProvider`, idioma español y metadatos globales.
- `src/app/(app)/layout.tsx`: pinta el sidebar y exige una sesión con pareja.

## Rutas de la aplicación

### Autenticación y onboarding

| Ruta | Propósito |
| --- | --- |
| `/sign-in/*` | Inicio de sesión Clerk |
| `/sign-up/*` | Registro Clerk |
| `/sign-out` | Cierre de sesión |
| `/onboarding/couple` | Crear pareja o unirse mediante código |

### Aplicación principal

| Ruta | Propósito |
| --- | --- |
| `/` | Inicio y resumen de despensa |
| `/pantry` | Lista de artículos de la despensa |
| `/pantry/new` | Crear artículo |
| `/pantry/[id]/edit` | Editar artículo |
| `/finance` | Resumen financiero |
| `/finance/accounts` | Cuentas |
| `/finance/accounts/new` | Crear cuenta |
| `/finance/accounts/[id]/edit` | Editar cuenta |
| `/finance/categories` | Categorías |
| `/finance/categories/new` | Crear categoría |
| `/finance/categories/[id]/edit` | Editar categoría |
| `/finance/transactions` | Movimientos |
| `/finance/transactions/new` | Crear movimiento |
| `/finance/transactions/[id]/edit` | Editar movimiento |
| `/finance/credit-cards` | Tarjetas de crédito |
| `/finance/credit-cards/new` | Crear tarjeta |
| `/finance/credit-cards/[id]` | Detalle de tarjeta |
| `/finance/credit-cards/[id]/edit` | Editar tarjeta |
| `/finance/installments` | Planes a meses |
| `/finance/installments/new` | Crear plan |
| `/finance/installments/[id]` | Pagos del plan |
| `/habits` | Lista y estado diario de hábitos |
| `/habits/new` | Crear hábito |
| `/habits/[id]` | Detalle e historial |
| `/habits/[id]/edit` | Editar hábito |
| `/schedule` | Agenda semanal |
| `/schedule/new` | Crear bloque |
| `/schedule/[id]/edit` | Editar bloque |
| `/debts` | Lista y progreso de deudas |
| `/debts/new` | Crear deuda |
| `/debts/[id]` | Tabla de pagos |
| `/debts/[id]/edit` | Editar deuda |
| `/investments` | Lista de inversiones |
| `/investments/new` | Crear inversión |
| `/investments/[id]` | Valor, aportaciones e historial |
| `/investments/[id]/edit` | Editar inversión |
| `/meals` | Redirección a `/meals/recipes` |
| `/meals/recipes` | Lista de recetas |
| `/meals/recipes/new` | Crear receta |
| `/meals/recipes/[id]/edit` | Editar receta |
| `/meals/plans` | Lista de planes semanales |
| `/meals/plans/new` | Crear plan |
| `/meals/plans/[id]` | Cuadrícula semanal editable |
| `/settings` | Código de invitación y miembros |

### Herramientas locales

| Ruta | Propósito |
| --- | --- |
| `/dev/database` | Conteos de registros por modelo; solo aparece en desarrollo |

## Modelos de datos

Todos los registros compartidos pertenecen a una pareja mediante `coupleId`.

### `Couple`

- Identificador interno `id`.
- `memberAId` y `memberBId`, ambos IDs de usuario de Clerk.
- `inviteCode` único de ocho caracteres.
- Relaciones inversas con todos los modelos principales.

### Despensa

`PantryItem` guarda nombre, cantidad actual, unidad, cantidad mínima y fecha opcional de vencimiento.

### Finanzas

`Account` representa cuentas corrientes, ahorros, inversión y efectivo. `Category` clasifica movimientos. `Transaction` registra importes, fechas, descripciones y relaciones opcionales con categoría, cuenta y tarjeta.

`CreditCard` guarda límite, adeudo actual, días de corte y pago, e interés opcional. `InstallmentPlan` representa compras a meses y contiene pagos únicos por número.

Enums principales:

- `AccountType`: `CHECKING`, `SAVINGS`, `INVESTMENT`, `CASH`.
- `TransactionType`: `EXPENSE`, `INCOME`, `TRANSFER`, `SAVING`, `INVESTMENT`, `DEBT_PAYMENT`.

### Hábitos

`Habit` contiene nombre, descripción y una frecuencia entre `DAILY`, `WEEKLY_X` y `SPECIFIC_DAYS`. `HabitEntry` registra por fecha si el hábito fue completado y evita duplicados para una misma fecha.

### Agenda

`ScheduleBlock` guarda título, descripción, color, hora inicial, hora final y un arreglo de días. Las horas se representan como minutos desde medianoche, entre `0` y `1439`.

Convención de días: `0` corresponde a domingo y `6` a sábado.

### Deudas

`Debt` guarda principal, tasa anual simple, fecha inicial y plazo. `DebtPayment` contiene número, vencimiento, monto, capital, interés y estado de pago.

Al crear una deuda se genera una tabla de amortización con mensualidades. Una acción permite alternar el estado pagado o pendiente.

### Inversiones

`Investment` guarda nombre, tipo y valor actual. `InvestmentContribution` conserva el importe, fecha y nota de cada aporte.

Las utilidades pueden calcular el total aportado y la diferencia entre valor actual y aportaciones.

### Comidas

`Recipe` contiene nombre, tipo de comida, ingredientes y notas. `MealPlan` representa una semana identificada por `weekStart`. `MealPlanEntry` relaciona una posición de la cuadrícula con una receta.

`MealType` contiene `BREAKFAST`, `LUNCH` y `DINNER`.

Convención de días de comida: `0` corresponde a lunes y `6` a domingo.

## Autenticación y parejas

### Creación de pareja

`ensureCouple()` busca una pareja existente para el usuario. Si no existe, crea una pareja con el `userId` de Clerk como `memberAId` y genera un código aleatorio.

### Unión a una pareja

`joinCouple()`:

- Rechaza a un usuario que ya pertenece a una pareja.
- Normaliza y valida un código de ocho caracteres.
- Busca el código exacto.
- Rechaza parejas completas y que el miembro principal se una a sí mismo.
- Guarda al segundo usuario en `memberBId`.

### Sign-out

La ruta `/sign-out` contiene un `SignOutButton` de Clerk que redirige a `/sign-in`.

## Patrones de implementación

### Páginas

Las páginas que consultan autenticación o Prisma siguen este patrón:

- Componente exportado que solo pinta el shell y Suspense.
- Componente async separado que llama a `requireCouple()` o `requireSessionPage()`.
- Fallback visible mientras se resuelve la carga.
- `notFound()` cuando un recurso no existe o no pertenece a la pareja.
- Pasaje de Decimal y fechas como strings hacia Client Components.

### Formularios

Los formularios cliente usan:

- `useActionState`.
- `FormField`, `Input`, `Select` y componentes UI compartidos.
- El primer mensaje Zod cuando la validación falla.
- `disabled={pending}` mientras se ejecuta una acción.

Los componentes de edición usan `bind` con el ID del recurso antes de enviar el estado y `FormData`.

### Server Actions

Las acciones siguen estas reglas:

- Comienzan con `"use server"`.
- Consultan `requireCouple()` como primera operación.
- Validan `FormData` con Zod o comprobaciones explícitas.
- Devuelven `{ error }` ante datos inválidos.
- Releen el recurso por `id` y `coupleId`.
- Ejecutan `revalidatePath()` después de mutaciones.
- Redirigen al listado después de crear o actualizar.

### Números decimales

Prisma entrega columnas Decimal como objetos Decimal. Antes de enviarlos a componentes cliente se convierten con `.toString()` o `Number()`.

Las utilidades `formatCurrency()` y `formatMoney()` presentan valores con formato mexicano y moneda MXN.

## Componentes compartidos

### `src/components/ui`

| Componente | Responsabilidad |
| --- | --- |
| `button.tsx` | Variantes primary, secondary, danger y ghost; soporte de botón o enlace |
| `card.tsx` | Contenedor con título opcional y acción |
| `badge.tsx` | Estados default, success, warning, danger e info |
| `input.tsx` | Input base con clases Tailwind |
| `select.tsx` | Select base |
| `form-field.tsx` | Etiqueta y campo reutilizables |
| `table.tsx` | Tabla responsiva con encabezados |
| `empty-state.tsx` | Estado vacío con acción opcional |
| `page-header.tsx` | Encabezado de página con acción |
| `error-message.tsx` | Mensaje de error en rojo |
| `loading.tsx` | Indicador giratorio |
| `modal.tsx` | Modal cliente mínimo |
| `confirm-dialog.tsx` | Confirmación mínima |
| `date-picker.tsx` | Input de fecha |
| `currency-input.tsx` | Input numérico monetario |
| `toast.tsx` | Toast visual fijo |
| `tabs.tsx` | Contenedor de pestañas mínimo |

Los componentes UI son deliberadamente simples y no dependen de una biblioteca externa.

## Variables de entorno

### Clerk

Archivo esperado: `.env.local`

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

`CLERK_SECRET_KEY` es privada y nunca debe exponerse.

### PostgreSQL

Archivo esperado: `.env`

```dotenv
DATABASE_URL=
DIRECT_URL=
```

- `DATABASE_URL`: conexión usada por la aplicación.
- `DIRECT_URL`: conexión usada por el CLI para migraciones.
- Si `DIRECT_URL` está vacío, Prisma CLI usa `DATABASE_URL`.
- En desarrollo, ambas pueden apuntar a la misma base local.

Ejemplo:

```dotenv
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/life_app_dev?schema=public"
DIRECT_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/life_app_dev?schema=public"
```

No incluyas contraseñas reales en Git ni capturas públicas.

## Instalación y ejecución

Requisitos:

- Node.js compatible con Next.js 16.
- npm.
- PostgreSQL local o una base de pruebas.
- Proyecto Clerk con claves válidas.

Pasos:

1. Instalar dependencias:

   ```bash
   npm ci
   ```

2. Crear una base PostgreSQL vacía.

3. Configurar `.env` y `.env.local`.

4. Validar el esquema:

   ```bash
   npm run db:validate
   ```

5. Generar el cliente:

   ```bash
   npm run db:generate
   ```

6. Aplicar migraciones en la base seleccionada:

   ```bash
   npm run db:migrate
   ```

7. Iniciar el servidor:

   ```bash
   npm run dev
   ```

8. Abrir [http://localhost:3000](http://localhost:3000).

9. Abrir Prisma Studio si se necesitan inspeccionar datos:

   ```bash
   npm run db:studio
   ```

`/dev/database` permanece disponible en modo desarrollo para mostrar el conteo de registros de los modelos. En producción esta ruta devuelve 404.

## Comandos disponibles

| Comando | Acción |
| --- | --- |
| `npm ci` | Instala dependencias desde `package-lock.json` |
| `npm run dev` | Inicia Next.js con Turbopack |
| `npm run lint` | Ejecuta ESLint |
| `npm run build` | Construye la aplicación de producción |
| `npm run start` | Ejecuta el build de producción |
| `npm run db:validate` | Ejecuta `prisma validate` |
| `npm run db:generate` | Ejecuta `prisma generate` |
| `npm run db:migrate` | Ejecuta `prisma migrate dev` |
| `npm run db:studio` | Abre Prisma Studio |
| `npx prisma migrate deploy` | Aplica migraciones existentes en despliegues |
| `npx tsc --noEmit` | Ejecuta TypeScript sin generar archivos |

## Flujo de desarrollo

### Cambiar un modelo Prisma

1. Editar el archivo correspondiente dentro de `prisma/models/`.
2. Definir o actualizar las relaciones Prisma completas.
3. Ejecutar:

   ```bash
   npm run db:validate
   npm run db:generate
   npm run db:migrate -- --name descripcion_del_cambio
   ```

4. Revisar el SQL creado.
5. Añadir o ajustar validaciones Zod.
6. Actualizar Server Actions y páginas que consuman el modelo.
7. Confirmar que no se pasan Decimals directamente a Client Components.
8. Ejecutar lint, TypeScript y build.

No se deben editar manualmente los archivos de `src/generated/prisma/`. Una migración aplicada en entornos compartidos debe corregirse con una migración nueva, no modificando el historial anterior.

### Añadir una ruta protegida

1. Crear la carpeta dentro de `src/app/(app)/`.
2. Usar Suspense y un componente async separado si se usa Prisma o autenticación.
3. Consultar siempre con `requireCouple()`.
4. Añadir el enlace al sidebar si debe ser accesible globalmente.
5. Crear rutas de creación y edición siguiendo el patrón de los módulos existentes.
6. Validar y agregar la acción en un archivo `actions.ts`.

## Estado de los módulos

| Módulo | Estado | Capacidades principales |
| --- | --- | --- |
| Despensa | Implementado | Crear, listar, editar, eliminar, bajo stock y vencimiento |
| Finanzas | Implementado | Cuentas, categorías, movimientos, tarjetas y planes a meses |
| Hábitos | Implementado | Crear, editar, eliminar, alternar completado, detalle e historial |
| Agenda | Implementado | Vista semanal y creación/edición/eliminación de bloques |
| Deudas | Implementado | Crear tabla de amortización, listar progreso y alternar pagos |
| Inversiones | Implementado | Crear inversión y gestionar aportaciones |
| Comidas | Implementado | Recetas y plan semanal editable |
| Ajustes | Implementado | Código de invitación y miembros |
| Onboarding | Implementado | Crear pareja o unirse mediante código |
| Autenticación | Implementado | Clerk sign-in, sign-up y sign-out |
| Diagnóstico DB | Implementado | Conteos locales en `/dev/database` |

### Limitaciones conocidas

- El dashboard principal todavía contiene textos antiguos de “Aún no implementado” en las tarjetas de finanzas y hábitos.
- Las relaciones de movimientos con categorías, cuentas y tarjetas usan campos basados en IDs en algunos formularios; todavía pueden mejorar con selects cargados desde Prisma.
- El plan de comidas utiliza el mismo grid para leer y modificar, pero no tiene edición más avanzada ni drag-and-drop.
- Las utilidades de hábitos permiten calcular rachas y tasas, pero el listado usa principalmente el estado diario.
- Los saldos de cuentas y tarjetas no se recalculan automáticamente en todas las operaciones financieras.
- No hay pruebas automatizadas unitarias o end-to-end todavía.
- No hay proceso de seed ni datos iniciales.
- No hay configuración declarativa de despliegue para Render o Supabase.
- La UI no incluye todavía un sistema completo de notificaciones Toast.

Estas limitaciones representan trabajo pendiente real y no errores detectados por el build actual.

## Próximas mejoras

Prioridades recomendadas:

1. Actualizar el dashboard principal con resúmenes reales de finanzas y hábitos.
2. Añadir selects completos para categoría, cuenta y tarjeta en movimientos.
3. Recalcular saldos de cuentas y tarjetas con las transacciones.
4. Completar la relación visual de pagos de deudas e inversiones.
5. Añadir pruebas unitarias para utilidades y validaciones.
6. Añadir pruebas end-to-end para autenticación, pareja y módulos principales.
7. Crear un seed seguro opcional para datos de desarrollo.
8. Mejorar responsive en agenda y cuadrícula semanal de comidas.
9. Integrar mensajes de éxito y error consistentes.
10. Documentar y automatizar el despliegue.
11. Añadir CI para lint, TypeScript, build y migraciones.
12. Revisar controles de autorización en todas las Server Actions.

## Verificación y calidad

Ejecutar antes de entregar cambios:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run db:validate
npm run db:generate
```

El build actual confirma que TypeScript y todas las rutas pueden compilarse. No reemplaza:

- Una prueba real contra PostgreSQL.
- Una prueba real de autenticación Clerk.
- Pruebas de permisos entre parejas.
- Pruebas de mutaciones y relaciones.
