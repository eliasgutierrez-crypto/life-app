# Life App

Life App es una aplicación web en desarrollo cuyo objetivo es reunir herramientas para organizar y dar seguimiento a distintos aspectos de la vida personal. La idea es que una persona o una pareja pueda administrar información relacionada con finanzas, hábitos, comidas, despensa, inversiones y agenda desde una sola aplicación.

## Estado del proyecto

El proyecto tiene la estructura inicial de Next.js, autenticación de Clerk configurada, modelos de datos de Prisma para PostgreSQL y un panel de desarrollo para comprobar que las tablas responden.

Actualmente:

- Las páginas de registro e inicio de sesión de Clerk están disponibles.
- Los modelos de Prisma y las migraciones iniciales están en el repositorio.
- El panel `/dev/database` muestra el número de registros de cada modelo en modo desarrollo.
- Prisma Studio permite consultar y modificar los registros directamente.
- La página principal de la aplicación todavía es una pantalla inicial.
- Aún no están implementados los módulos de producto para crear y consultar estos datos desde la interfaz normal.
- No se incluyen datos de ejemplo ni una base de datos local; cada desarrollador debe configurar PostgreSQL.
- Las migraciones incluidas deben aplicarse a la base elegida antes de que las tablas estén disponibles.

Por lo tanto, los modelos representan la estructura inicial de los datos, no funcionalidades completas de finanzas, hábitos u otras áreas.

## Tecnologías

- **Next.js 16 y App Router:** estructura de páginas y ejecución del servidor.
- **React 19 y TypeScript:** interfaz y tipos estáticos.
- **Tailwind CSS 4:** estilos.
- **Clerk:** registro, inicio de sesión e identificación de usuarios.
- **Prisma ORM 6:** definición del esquema y acceso tipado a PostgreSQL.
- **PostgreSQL:** motor de base de datos. Supabase es una opción planeada para alojarlo.
- **Render:** plataforma de despliegue considerada; el proyecto aún no tiene una configuración de despliegue declarativa.

## Qué contiene el esquema

Los modelos están divididos por área dentro de `prisma/models/`. El archivo `prisma/schema.prisma` contiene la configuración común del cliente y del proveedor PostgreSQL; Prisma carga también los archivos de la carpeta `prisma/`.

| Archivo | Modelos | Para qué sirven |
| --- | --- | --- |
| `couple.prisma` | `Couple` | Asocia dos identificadores de usuario de Clerk. El segundo miembro puede estar vacío mientras se completa la pareja. |
| `finance.prisma` | `Account`, `Category`, `Transaction`, `CreditCard`, `InstallmentPlan`, `InstallmentPayment` | Representa cuentas, categorías, movimientos, tarjetas y compras a plazos con sus pagos. Incluye los enums `AccountType` y `TransactionType`. |
| `debt.prisma` | `Debt`, `DebtPayment` | Registra una deuda y sus pagos programados. |
| `habits.prisma` | `Habit`, `HabitEntry` | Define hábitos, su frecuencia y los registros de cumplimiento. |
| `investment.prisma` | `Investment`, `InvestmentContribution` | Guarda inversiones y sus aportaciones. |
| `meals.prisma` | `Recipe`, `MealPlan`, `MealPlanEntry` | Organiza recetas y comidas dentro de un plan semanal. |
| `pantry.prisma` | `PantryItem` | Registra artículos, cantidades, unidades, existencias mínimas y vencimientos de la despensa. |
| `schedule.prisma` | `ScheduleBlock` | Representa bloques de agenda repetidos en días y horarios específicos. |

Las relaciones entre modelos están definidas en el esquema. Por ejemplo, los pagos pertenecen a una deuda o a un plan de pagos, y las entradas de un plan de comidas enlazan el plan con una receta.

El esquema utiliza tipos y características de PostgreSQL, como enums, arreglos y columnas `Decimal`. SQLite no es un reemplazo directo sin adaptar los modelos.

### Reglas que ya expresa el esquema

- `Couple.memberAId` y `Couple.memberBId` son únicos; `memberBId` es opcional para poder representar una pareja que todavía espera a su segundo miembro.
- `userId` es un identificador de Clerk guardado como texto. Clerk es un servicio externo, así que esos valores no tienen una relación de clave foránea con una tabla `User` local.
- Los importes de dinero usan `Decimal`, no `Float`, para conservar precisión decimal.
- `TransactionType` incluye `EXPENSE`, `INCOME`, `TRANSFER`, `SAVING`, `INVESTMENT` y `DEBT_PAYMENT`. `AccountType` incluye `CHECKING`, `SAVINGS`, `INVESTMENT` y `CASH`.
- `HabitFrequency` permite `DAILY`, `WEEKLY_X` y `SPECIFIC_DAYS`; `timesPerWeek` y `daysOfWeek` guardan los valores asociados a esas frecuencias.
- `MealType` incluye `BREAKFAST`, `LUNCH` y `DINNER`. Un plan de comidas evita repetir el mismo tipo de comida en el mismo día de la semana.
- `MealPlanEntry.dayOfWeek` usa `0` para lunes y `6` para domingo. `ScheduleBlock.daysOfWeek` usa `0` para domingo y `6` para sábado; son convenciones distintas documentadas por cada modelo.
- Los pagos de deuda y de planes a plazos tienen números de pago únicos dentro de su entidad principal. Las entradas de hábitos también evitan duplicar el mismo hábito en una fecha.

## Estructura del proyecto

```text
prisma/
  schema.prisma                   Configuración compartida del esquema Prisma
  models/                         Modelos organizados por área
  migrations/                     SQL versionado para crear y actualizar tablas
prisma.config.ts                 Configuración del CLI de Prisma y conexión de migraciones
src/
  app/
    dev/database/                 Panel local con conteos de modelos
    sign-in/                      Página de inicio de sesión de Clerk
    sign-up/                      Página de registro de Clerk
    layout.tsx                    Layout raíz y ClerkProvider
    page.tsx                      Página inicial
  components/
    database-model-counts.tsx     Conteos del panel de desarrollo
  generated/prisma/               Cliente generado por Prisma; no editar a mano
  lib/
    auth.ts                       Helpers para obtener el usuario/pareja actual
    couple.ts                     Helper para buscar o crear una pareja
    db.ts                         Instancia compartida de PrismaClient
  proxy.ts                        Middleware de Clerk
```

## Requisitos

- Node.js compatible con Next.js 16 y npm.
- PostgreSQL local para desarrollo, o una base de pruebas a la que tengas permiso de conectarte.
- Una instancia de Clerk y sus claves para probar registro e inicio de sesión.

No uses una base de producción para las pruebas descritas en esta guía. Prisma Studio permite editar y borrar datos.

## Variables de entorno

Los archivos `.env*` contienen configuración local y no deben subirse a Git. No compartas ni pegues claves privadas en el README, en el código o en reportes públicos.

### Clerk: `.env.local`

Configura las claves que proporciona tu proyecto de Clerk:

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

`CLERK_SECRET_KEY` es una clave privada: no debe llevar el prefijo `NEXT_PUBLIC_` ni exponerse en el navegador.

### PostgreSQL y Prisma: `.env`

Configura las URLs de tu base de datos:

```dotenv
DATABASE_URL=
DIRECT_URL=
```

- `DATABASE_URL` es la conexión que utiliza la aplicación en tiempo de ejecución.
- `DIRECT_URL` es la conexión que usa el CLI de Prisma para migraciones cuando está definida.
- Si `DIRECT_URL` no está definida o está vacía, la configuración del CLI usa `DATABASE_URL`.
- Para una base PostgreSQL local, puedes usar la misma URL en ambas variables.

Ejemplo de formato (reemplaza el usuario y la contraseña por los de tu PostgreSQL local):

```dotenv
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/life_app_dev?schema=public"
DIRECT_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/life_app_dev?schema=public"
```

Si una contraseña contiene caracteres reservados para URLs, codifícalos correctamente. Prisma CLI carga la configuración de `prisma.config.ts`; Next.js carga las variables de entorno de la aplicación. Mantén ambas URLs apuntando a la misma base local mientras haces estas pruebas.

## Preparar y ejecutar el proyecto en local

1. **Instala las dependencias** desde la raíz del repositorio:

   ```bash
   npm ci
   ```

2. **Inicia PostgreSQL** y crea una base vacía, por ejemplo `life_app_dev`. Este repositorio no incluye un servidor PostgreSQL ni un archivo Docker Compose.

3. **Configura `.env` y `.env.local`** con tus URLs de la base local y las claves de Clerk. Antes de continuar, confirma que `DATABASE_URL` y `DIRECT_URL` no apuntan a producción.

4. **Valida el esquema y genera el cliente:**

   ```bash
   npm run db:validate
   npm run db:generate
   ```

5. **Aplica las migraciones a la base seleccionada:**

   ```bash
   npm run db:migrate
   ```

   Este comando ejecuta `prisma migrate dev`: crea las tablas si la base está vacía y crea una nueva migración cuando detecta cambios locales en el esquema.

6. **Inicia Next.js:**

   ```bash
   npm run dev
   ```

7. Abre [http://localhost:3000](http://localhost:3000). Para comprobar la conexión y los conteos de tablas, visita [http://localhost:3000/dev/database](http://localhost:3000/dev/database).

8. **Abre Prisma Studio** en otra terminal para crear, editar y relacionar registros:

   ```bash
   npm run db:studio
   ```

   Prisma Studio normalmente queda disponible en [http://localhost:5555](http://localhost:5555). El panel `/dev/database` muestra los conteos; Studio es la herramienta para explorar y modificar filas.

Las tablas aparecerán vacías después de crear la base. El proyecto no incluye un proceso de seed ni inserta datos de ejemplo automáticamente.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm ci` | Instala exactamente las dependencias registradas en `package-lock.json`. |
| `npm run dev` | Inicia Next.js en modo desarrollo. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run build` | Genera la compilación de producción de Next.js. |
| `npm run start` | Ejecuta localmente la compilación de producción. |
| `npm run db:validate` | Comprueba que Prisma pueda interpretar y validar el esquema. |
| `npm run db:generate` | Genera el cliente Prisma en `src/generated/prisma`. |
| `npm run db:migrate` | Ejecuta `prisma migrate dev` sobre la base indicada por las variables de entorno. |
| `npm run db:studio` | Abre la interfaz gráfica de Prisma Studio. |
| `npx prisma migrate deploy` | Aplica migraciones ya creadas en un entorno de despliegue; no crea migraciones nuevas. |

`db:migrate` y `migrate deploy` no son intercambiables: usa `migrate dev` en desarrollo para crear y aplicar migraciones; usa `migrate deploy` en despliegues para aplicar migraciones ya revisadas y versionadas.

## Panel local y autenticación

La ruta `/dev/database` consulta el número de filas de cada modelo mediante Prisma. Es de solo lectura y solo está habilitada cuando Next.js se ejecuta en modo desarrollo. En producción, la ruta devuelve 404. La página principal muestra un enlace al panel únicamente en desarrollo.

El layout configura `ClerkProvider`, y el middleware de `src/proxy.ts` conecta Clerk con las rutas de Next.js. Los helpers de `src/lib/auth.ts` permiten obtener el usuario autenticado y su pareja. La existencia de esos helpers no significa que todas las operaciones de base de datos ya estén limitadas al usuario actual: los módulos de producto y sus reglas de autorización aún deben implementarse.

Usa una base local o de pruebas en el panel y en Prisma Studio. El modo desarrollo no convierte una conexión a producción en una base segura para experimentar.

## Flujo para cambiar el esquema

Cuando agregues o modifiques modelos:

1. Actualiza el archivo de `prisma/models/` correspondiente.
2. Asegúrate de declarar ambos lados de cada relación Prisma.
3. Valida el esquema y regenera el cliente:

   ```bash
   npm run db:validate
   npm run db:generate
   ```

4. Con las variables apuntando a una base local, crea y aplica una migración:

   ```bash
   npm run db:migrate -- --name descripcion_del_cambio
   ```

5. Revisa el SQL y el resultado de la migración antes de incluirla en Git.
6. Actualiza los tipos, componentes y documentación relacionados con el cambio.

Las migraciones son la historia versionada de los cambios en la base de datos. No edites una migración que ya se aplicó en un entorno compartido; crea una migración nueva para corregir el esquema. No edites manualmente los archivos generados dentro de `src/generated/prisma`.

## Pruebas y verificación

Antes de integrar cambios, ejecuta las comprobaciones pertinentes:

```bash
npm run db:validate
npm run db:generate
npm run lint
npx tsc --noEmit
npm run build
```

La validación del esquema y la compilación no prueban que PostgreSQL esté disponible ni que las credenciales funcionen. Para verificar la conexión y las tablas, inicia la base local, aplica las migraciones y abre `/dev/database` o Prisma Studio.

## Despliegue

El proyecto todavía no incluye un `render.yaml` ni una configuración de despliegue lista para producción. Render y Supabase son opciones consideradas, pero sus servicios y conexiones deben configurarse y verificarse por separado.

Como referencia, una compilación de un servicio Node podría necesitar:

- **Build command:** `npm ci && npm run db:generate && npm run build`
- **Start command:** `npm run start`
- Variables de Clerk y de PostgreSQL configuradas en el panel del proveedor, no copiadas desde archivos locales.
- Un paso de despliegue controlado que ejecute `npx prisma migrate deploy` después de revisar las migraciones.

La conexión, las direcciones de red, las credenciales y la ejecución de migraciones deben probarse en el entorno de despliegue. Una compilación local exitosa no confirma que la aplicación pueda conectarse a Supabase o Render.

## Documentación de las tecnologías

- [Next.js](https://nextjs.org/docs)
- [Clerk para Next.js](https://clerk.com/docs/quickstarts/nextjs)
- [Prisma ORM](https://www.prisma.io/docs)
- [Prisma con Supabase](https://supabase.com/docs/guides/database/prisma)
- [Conexiones PostgreSQL de Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Despliegue de aplicaciones Node en Render](https://render.com/docs/deploy-node-express-app)
