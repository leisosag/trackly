# Trackly

Aplicación personal de finanzas (ingresos, gastos, presupuestos y tarjetas de crédito), construida como proyecto de portfolio con foco en arquitectura limpia, testing y buenas prácticas de React moderno.

## Stack

- **React 19 + TypeScript** — Vite como bundler
- **Tailwind CSS v4** — sistema de diseño, sin librería de componentes
- **Radix UI (primitives)** — accesibilidad de bajo nivel (`Dialog` para los modales), sin estilos propios
- **@phosphor-icons/react** — set de iconos
- **sonner** — toasts de confirmación
- **Vitest + React Testing Library + user-event** — testing unitario y de componentes
- **pnpm** — gestor de paquetes

## Arquitectura

El proyecto está organizado **por feature**, no por tipo de archivo, para que cada dominio quede autocontenido y sea fácil de extender:

```
src/
├── features/
│   ├── budgets/                 # Presupuestos: general (único) y personalizados (por categoría)
│   │   ├── components/          # BudgetForm, BudgetList, BudgetCard, BudgetsPage
│   │   ├── hooks/               # useBudgets
│   │   ├── data/                # budgetsRepository (localStorage)
│   │   ├── types.ts             # Budget, BudgetProgress, BudgetStatus
│   │   └── index.ts             # barrel export (API pública del feature)
│   │
│   ├── budget-form/             # Wizard de carga/edición de presupuestos
│   │   ├── components/          # AmountInput, BudgetForm
│   │   └── index.ts             # barrel export (API pública del feature)
│   │
│   ├── categories/               # Categorías de ingreso/gasto (seed estático)
│   │   ├── data/                 # categoriesSeed, getCategoryById
│   │   ├── types.ts              # Category, CategoryType, CategoryColorScheme
│   │   └── index.ts              # barrel export (API pública del feature)
│   │
│   ├── credit-cards/            # Tarjetas de crédito: alta, edición, activar/desactivar
│   │   ├── components/          # CreditCardForm, CreditCardList, CreditCardsPage
│   │   ├── hooks/               # useCreditCards
│   │   ├── data/                # creditCardsRepository (localStorage)
│   │   ├── utils/               # needsClosingDayReminder
│   │   ├── types.ts             # CreditCard
│   │   └── index.ts             # barrel export (API pública del feature)
│   │
│   ├── movement-form/           # Wizard de carga/edición de movimientos
│   │   ├── components/          # MovementForm, Calculator, DateField, InstallmentsField,
│   │   │                        # PaymentMethodSelect
│   │   ├── utils/               # evaluateExpression (parser de la calculadora)
│   │   └── index.ts             # barrel export (API pública del feature)
│   │
│   ├── movements/               # Movimientos: listado, alta, edición, borrado, filtros
│   │   ├── components/          # MovementList, MovementGroup, MovementItem, BalanceHeader,
│   │   │                        # MovementsPage, FilteredSummary, MovementFilterModal,
│   │   │                        # PaymentMethodMultiSelect, CategoryFilterModal
│   │   ├── hooks/               # useMovements, useMovementFilters
│   │   ├── data/                # movementsRepository (localStorage)
│   │   ├── types.ts             # Movement, NewMovementInput, MovementFilters
│   │   └── index.ts             # barrel export (API pública del feature)
│   │
│   ├── payment-methods/         # Medios de pago: fijos (efectivo, débito) + tarjetas dinámicas
│   │   ├── data/                # paymentMethodsSeed, getPaymentMethods, getPaymentMethodById
│   │   ├── types.ts             # PaymentMethod, PaymentMethodKind
│   │   └── index.ts             # barrel export (API pública del feature)
│   │
├── shared/
│   ├── components/              # Componentes cross-feature: Modal, Input, Fab, BottomNav,
│   │                            # MonthSelector, CategoryIcon, CategoryMultiSelect,
│   │                            # ConfirmActionButton, ConfirmButton
│   └── context/                 # SelectedMonthContext (mes navegado, global a la app)
│   └── utils/                   # groupByDay, formatCurrency, calculateSummary,
│                                # calculateBudgetProgress, getBudgetMovements,
│                                # getCreditCardMovements, groupMovementsByCard,
│                                # generateInstallments, statementPeriod, dateInput,
│                                # amountInput, canDeactivateCreditCard,
│                                # filterMovementsByPeriod, filterMovementsByCategories,
│                                # filterMovementsByPaymentMethods, applyMovementFilters,
│                                # formatMovementFiltersDescription, iconMap, cn
└── App.tsx                      # composición: conecta features entre sí (navegación por tabs)
```

### Principios clave

- **Repository pattern**: cada feature con persistencia (`movements`, `budgets`, `credit-cards`) tiene su propio repository como única puerta de entrada/salida a los datos. Hoy usan `localStorage`; el día que haya backend en AWS, solo cambian estos archivos — ningún componente se entera.
- **Shared vs. feature-local**: un componente/util vive en su feature mientras solo lo use ese feature. Se sube a `shared/` recién cuando lo necesita un segundo feature (ej.: `CategoryMultiSelect` empezó en Presupuestos y se subió a `shared/components` al sumarse el filtro de Movimientos).
- **Barrel exports (`index.ts`)**: cada feature expone solo lo que otros features necesitan consumir. Dentro de un mismo feature, los imports son relativos; entre features, se usa el barrel del feature vecino (vía alias `@/`).
- **Reuse over duplication**: filtrado, cálculos y componentes se extraen como funciones puras o componentes reutilizables en `shared/utils`/`shared/components` en vez de reimplementarse por pantalla (ej.: `getBudgetMovements`, `calculateBudgetProgress`, `applyMovementFilters`).
- **Componentes controlados**: estado que necesita sobrevivir a cambios de vista (como `Calculator`) vive en el componente padre que no se desmonta, no en el hijo.
- **Sin librería de formularios** (por ahora): tanto `MovementForm` como `BudgetForm`/`CreditCardForm` son wizards/formularios simples con validación implícita por estructura, así que `react-hook-form` no aporta valor todavía.

### Alias de imports

Configurado `@/` → `src/` (ver `vite.config.ts` y `tsconfig.app.json`).

## Features implementados

### Movimientos

- Listado agrupado por día (orden local, no UTC), con ícono y nombre de categoría, descripción opcional, medio de pago, y monto con signo según tipo.
- Header fijo (`sticky`) con saldo, ingreso y gasto totales del mes seleccionado.
- Alta vía FAB → modal con wizard de 2 pasos: categoría (agrupada en Ingresos/Gastos), luego fecha, descripción, medio de pago y monto vía calculadora custom (`+ - * /`).
- Edición y eliminación (confirmación en 2 pasos o vía modal, según el caso).
- **Filtro por categoría y/o medio de pago**: modal con chips de selección múltiple para ambas dimensiones (reutiliza `CategoryMultiSelect` y `PaymentMethodMultiSelect`). Ambos filtros se combinan por intersección (AND); dentro de cada dimensión, es OR (varias categorías o varios medios de pago a la vez). El saldo del header no se ve afectado por el filtro; un resumen aparte (`FilteredSummary`) muestra ingreso/gasto/balance de los movimientos filtrados, junto con los nombres de las categorías y medios de pago activos.
- Compras con tarjeta de crédito en cuotas: cada cuota se genera como un movimiento independiente, reubicado en el mes de su resumen (`statementPeriod`) según el día de cierre de la tarjeta.
- Toasts de confirmación al crear, editar o eliminar.

### Presupuestos

- Presupuesto general (único, cubre todas las categorías) creado automáticamente, y presupuestos personalizados por categoría.
- Barra de progreso con estado (`ok` / `warning` / `exceeded`) según el porcentaje gastado del mes.
- Modal con el detalle de movimientos que componen cada presupuesto.
- Edición y eliminación (el presupuesto general no se puede eliminar).

### Tarjetas de crédito

- Alta de tarjetas con día de cierre configurable.
- Resumen mensual agrupado por tarjeta, filtrado por `statementPeriod` del mes seleccionado.
- Activar/desactivar tarjetas; no se puede desactivar una con movimientos del mes actual o futuros (`canDeactivateCreditCard`).
- Recordatorio (toast) si el día de cierre no fue confirmado/actualizado en el mes en curso.

### Navegación por mes

- Selector de mes global (`MonthSelector` + `SelectedMonthContext`), compartido entre Movimientos, Presupuestos y Tarjetas de crédito.

## Testing

Cada archivo de lógica o componente relevante tiene su test al lado (`Component.test.tsx`). Se prioriza testear **comportamiento visible** (RTL) y **reglas de negocio** (parser de la calculadora, agrupamiento por día, cálculo de resumen, generación de cuotas) por sobre detalles de implementación.

Patrones usados en todo el proyecto:

- `vi.useFakeTimers({ toFake: ['Date'] })` (no fake timers completos) cuando se combina con `userEvent`, para no bloquear los timers internos de React.
- Fechas de fixtures en UTC de mediodía (`T10:00:00.000Z`) para evitar problemas de huso horario en los tests.
- `<Toaster />` montado en los tests que verifican toasts.
- Componentes que usan `useSelectedMonth` se envuelven en `SelectedMonthProvider` al testear.
- `getByRole` preferido sobre `getByText` para evitar matches ambiguos (especialmente relevante en modales que se superponen a listados con nombres repetidos, como categorías o medios de pago).

```bash
pnpm test        # corre Vitest en modo watch
```

## Scripts

```bash
pnpm dev          # servidor de desarrollo
pnpm build        # build de producción
pnpm test         # tests
pnpm lint         # ESLint
```

## Roadmap

- [ ] Filtro por monto y búsqueda de texto en Movimientos (misma arquitectura de `applyMovementFilters`, sumando una dimensión más)
- [ ] Presupuestos con período distinto a mensual (semanal, anual)
- [ ] PWA (instalabilidad, `vite-plugin-pwa` en modo `injectManifest`)
- [ ] Despliegue en AWS (S3 + CloudFront para el front; API Gateway + Lambda + DynamoDB si se suma backend real)
- [ ] Autenticación y sincronización de datos entre dispositivos

## Decisiones de arquitectura notables

- **Fechas**: se separa cuidadosamente la fecha "para mostrar/editar" (formato local `yyyy-mm-dd`, vía `dateInput.ts`) de la fecha "guardada" (ISO completo con hora). El agrupamiento por día (`groupByDay`) usa el día **local**, no el prefijo crudo del string UTC, para evitar que movimientos cargados de noche aparezcan agrupados en el día siguiente.
- **Cuotas de crédito**: `date` de cada cuota se reubica en el mes de su `statementPeriod` (mismo día/hora de la compra original, pero mes/año del resumen en que factura). Así, todas las vistas que filtran por `date` (balance, listado, presupuestos) descuentan cada cuota del mes correcto, sin lógica especial adicional.
- **Filtros de Movimientos**: cada dimensión de filtro (categoría, medio de pago) es una función pura e independiente en `shared/utils`, combinadas por `applyMovementFilters`. Esto permite sumar nuevas dimensións (monto, búsqueda) sin modificar `MovementsPage` ni las funciones existentes.
- **Íconos dinámicos**: se resuelven con `createElement` en lugar de usarse como componente JSX (`<Icon />`) directo, para cumplir con la regla de lint `react-hooks/static-components` del nuevo React Compiler.
- **Calculadora**: parser de expresiones matemáticas simple, escrito a mano (sin `eval` ni librerías), con precedencia de operadores (`*`/`/` antes que `+`/`-`).
