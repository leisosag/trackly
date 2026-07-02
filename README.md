# Trackly

Aplicación personal para registrar movimientos financieros (ingresos y gastos), construida como proyecto de portfolio con foco en arquitectura limpia, testing y buenas prácticas de React moderno.

## Stack

- **React 19 + TypeScript** — Vite como bundler
- **Tailwind CSS v4** — sistema de diseño, sin librería de componentes
- **Radix UI (primitives)** — accesibilidad de bajo nivel (`Dialog` para el modal), sin estilos propios
- **@phosphor-icons/react** — set de iconos
- **sonner** — toasts de confirmación
- **Vitest + React Testing Library + user-event** — testing unitario y de componentes

## Arquitectura

El proyecto está organizado **por feature**, no por tipo de archivo, para que cada dominio quede autocontenido y sea fácil de extender:

```
src/
├── app/                        # (reservado para providers/router futuros)
├── features/
│   ├── movements/               # Movimientos: listado, alta, edición, borrado
│   │   ├── components/          # MovementList, MovementGroup, MovementItem, BalanceHeader
│   │   ├── hooks/                # useMovements
│   │   ├── data/                 # movementsRepository (localStorage)
│   │   ├── types.ts
│   │   └── index.ts              # barrel export (API pública del feature)
│   ├── categories/               # Categorías de ingreso/gasto (seed estático)
│   │   ├── data/                 # categoriesSeed, getCategoryById
│   │   ├── types.ts
│   │   └── index.ts
│   └── movement-form/            # Wizard de carga/edición de movimientos
│       ├── components/           # MovementForm, Calculator, CategoryPicker
│       ├── utils/                 # evaluateExpression (parser de la calculadora)
│       └── index.ts
├── shared/
│   ├── components/                # Fab, Modal, DateField, DescriptionField
│   └── utils/                     # groupByDay, formatCurrency, calculateSummary,
│                                    # dateInput, iconMap
└── App.tsx                        # composición: conecta features entre sí
```

### Principios clave

- **Repository pattern**: `movementsRepository` es la única puerta de entrada/salida a los datos. Hoy usa `localStorage`; el día que haya backend en AWS, solo cambia este archivo — ningún componente se entera.
- **Barrel exports (`index.ts`)**: cada feature expone solo lo que otros features necesitan consumir. Dentro de un mismo feature, los imports son relativos; entre features, se usa el barrel del feature vecino (vía alias `@/`).
- **Componentes controlados**: estado que necesita sobrevivir a cambios de vista (como `Calculator`) vive en el componente padre que no se desmonta, no en el hijo.
- **Sin librería de formularios** (por ahora): el `MovementForm` es un wizard de 2 pasos con validación implícita por estructura (no se puede avanzar sin categoría, no se puede confirmar sin monto válido), no un formulario tradicional de una sola pantalla — así que `react-hook-form` no aporta valor todavía. Se evaluará para el feature de presupuestos.

### Alias de imports

Configurado `@/` → `src/` (ver `vite.config.ts` y `tsconfig.app.json`).

## Features implementados (MVP)

- **Listado de movimientos**, agrupado por día (orden local, no UTC), con ícono y nombre de categoría, descripción opcional, y monto con signo según tipo (`+` para ingreso, `-` para gasto).
- **Header fijo (`sticky`)** con saldo total, ingreso y gasto acumulados.
- **Alta de movimiento** vía FAB → modal con wizard de 2 pasos:
  1. Selección de categoría, agrupada visualmente en "Ingresos" / "Gastos".
  2. Fecha (editable, default "Hoy", picker nativo del navegador/OS), descripción (opcional) y monto vía calculadora custom con soporte de operaciones matemáticas básicas (`+ - * /`).
- **Edición y eliminación** de un movimiento existente, tocándolo desde el listado (mismo modal, precargado, con confirmación en 2 pasos para eliminar).
- **Toasts** de confirmación al crear, editar o eliminar.

## Testing

Cada archivo de lógica o componente relevante tiene su test al lado (`Component.test.tsx`). Se prioriza testear **comportamiento visible** (RTL) y **reglas de negocio** (parser de la calculadora, agrupamiento por día, cálculo de resumen) por sobre detalles de implementación.

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

- [ ] Filtro por mes en el listado principal
- [ ] Presupuestos (mensual único, y múltiples por categoría/grupo)
- [ ] Tarjetas de crédito (compras en un pago y en cuotas)
- [ ] Despliegue en AWS (S3 + CloudFront para el front; API Gateway + Lambda + DynamoDB si se suma backend real)

## Decisiones de arquitectura notables

- **Fechas**: se separa cuidadosamente la fecha "para mostrar/editar" (formato local `yyyy-mm-dd`, vía `dateInput.ts`) de la fecha "guardada" (ISO completo con hora). El agrupamiento por día (`groupByDay`) usa el día **local**, no el prefijo crudo del string UTC, para evitar que movimientos cargados de noche aparezcan agrupados en el día siguiente.
- **Íconos dinámicos**: se resuelven con `createElement` en lugar de usarse como componente JSX (`<Icon />`) directo, para cumplir con la regla de lint `react-hooks/static-components` del nuevo React Compiler.
- **Calculadora**: parser de expresiones matemáticas simple, escrito a mano (sin `eval` ni librerías), con precedencia de operadores (`*`/`/` antes que `+`/`-`).
