# KodeCraft PH — Plataforma de administración de propiedad horizontal

Monorepo (npm workspaces) con dos aplicaciones:

```
ph-admin/
├── front/   → Next.js 15 + TypeScript + Tailwind v4 (demo navegable del onboarding)
└── back/    → NestJS con arquitectura hexagonal (solo estructura, sin lógica)
```

## Correr el demo (frontend)

```bash
cd front
npm run dev
# abre http://localhost:3000 → redirige a /superadmin
```

## Correr el backend (estructura vacía)

```bash
cd back
npm run start:dev
# expone http://localhost:4000/api/onboarding/* (stubs)
```

## Flujo del demo

1. `/superadmin` → el super administrador crea un usuario administrador y "envía" la invitación.
2. `/onboarding` → el administrador invitado completa el wizard de 6 pasos self-service.
3. `/admin` → al activar el conjunto, cae en su panel de administración.

La raíz `/` redirige a `/superadmin`. Los headers tienen enlaces (demo) entre vistas.

## Arquitectura del frontend (`front/src`)

Código (identificadores, comentarios, nombres de archivo) en inglés. Los textos
visibles al usuario (labels, mensajes, datos mock) se mantienen en español porque
el producto es para el mercado colombiano.

```
app/                        → routes (App Router); composition only, no logic
├── superadmin/page.tsx     → super admin view (create admins, property list)
├── admin/page.tsx          → property admin panel (KPIs, balance)
├── onboarding/page.tsx
components/ui/              → minimal design system (Button, Card, Input, Badge…)
features/superadmin/        → SuperAdmin.tsx + model/mocks.ts (properties, invite statuses)
features/admin/             → AdminDashboard.tsx (KPIs and balance for the activated property)
features/onboarding/        → self-contained feature
├── Wizard.tsx               → orchestrator: header + progress bar + current step
├── model/                   → state and data
│   ├── types.ts             → wizard domain types
│   ├── WizardContext.tsx    → global state via useReducer (going back keeps data)
│   └── mocks.ts             → mock dataset (18 units, 4 with errors, balance)
├── components/              → ProgressBar, StepFooter, SuccessScreen (confetti), HelpWidget
└── steps/                   → one component per step (Step1…Step6)
```

## Arquitectura del backend (`back/src/modules/onboarding`)

Hexagonal (ports & adapters). Solo estructura — los casos de uso son stubs.

```
domain/                      → core, no framework dependencies
├── entities/                → Property (aggregate root), Unit, InitialBalance
├── value-objects/           → TaxId, Coefficient (rule: sum must equal 100%)
└── ports/out/                → interfaces: repositories + notifications
application/
├── use-cases/                → CreateProperty, ImportUnits, LoadBalance, ActivateProperty
└── dto/
infrastructure/adapters/
├── in/http/                  → OnboardingController (driving adapter)
└── out/
    ├── persistence/          → InMemoryPropertyRepository (swappable for Postgres)
    └── notification/         → ConsoleNotificationAdapter (swappable for real email)
onboarding.module.ts          → wires ports → adapters (Nest DI)
```

## Paleta

Minimal monocromo (escala zinc en `--color-ph-*`, `globals.css`); el color solo
aparece en estados semánticos: verde OK, rojo error, ámbar advertencia.
Para cambiar de marca solo hay que redefinir los tokens `--color-ph-*`.
