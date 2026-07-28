export type PlatformPropertyStatus =
  | "Activo"
  | "En onboarding"
  | "Demo (Prueba)"
  | "Invitación enviada";

export type PlatformPlan = "Starter" | "Pro" | "Enterprise" | "Demo";

export type BillingStatus = "Al día" | "Prueba (14 días)" | "Moroso" | "Pendiente";

export interface PlatformProperty {
  id: string;
  name: string;
  city: string;
  units: number | null;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  status: PlatformPropertyStatus;
  plan: PlatformPlan;
  billingStatus: BillingStatus;
  mrr: number;
  createdAt: string;
  lastActivity: string;
  salesRepresentative: string;
  notes?: string;
}

export interface MRRHistoryPoint {
  month: string;
  mrr: number;
  activeProperties: number;
}

export interface SupportTicket {
  id: string;
  propertyName: string;
  adminName: string;
  subject: string;
  category: "Onboarding" | "Facturación" | "Contabilidad NIIF" | "Citofonía" | "Soporte Técnico";
  priority: "Alta" | "Media" | "Baja";
  status: "Abierto" | "En revisión" | "Resuelto";
  createdAt: string;
}

export interface GlobalBroadcast {
  id: string;
  title: string;
  targetAudience: "Todos los administradores" | "Planes Pro & Enterprise" | "En Onboarding";
  sentAt: string;
  readRate: string;
  status: "Enviado" | "Borrador";
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Ejecutivo de Ventas" | "Líder de Soporte" | "Ingeniero Dev";
  status: "Activo" | "Ausente";
  propertiesManaged: number;
}

export const MRR_HISTORY_MOCK: MRRHistoryPoint[] = [
  { month: "Feb 2026", mrr: 1850000, activeProperties: 2 },
  { month: "Mar 2026", mrr: 2900000, activeProperties: 3 },
  { month: "Abr 2026", mrr: 4200000, activeProperties: 5 },
  { month: "May 2026", mrr: 5800000, activeProperties: 7 },
  { month: "Jun 2026", mrr: 7950000, activeProperties: 9 },
  { month: "Jul 2026", mrr: 10450000, activeProperties: 12 },
];

export const PROPERTIES_MOCK: PlatformProperty[] = [
  {
    id: "cj1",
    name: "Conjunto Residencial Altos del Virrey",
    city: "Bogotá D.C.",
    units: 148,
    adminName: "Diana Carolina Herrera",
    adminEmail: "administracion@altosdelvirrey.co",
    adminPhone: "+57 315 890 1234",
    status: "Activo",
    plan: "Enterprise",
    billingStatus: "Al día",
    mrr: 1850000,
    createdAt: "2026-02-10",
    lastActivity: "Hace 10 minutos",
    salesRepresentative: "Santiago Gómez",
    notes: "Copropiedad premium con 4 torres y control de parqueaderos VIP.",
  },
  {
    id: "cj2",
    name: "Edificio Mirador de la Cabrera",
    city: "Bogotá D.C.",
    units: 42,
    adminName: "Julián Esteban Mora",
    adminEmail: "admin@miradorcabrera.co",
    adminPhone: "+57 300 456 7890",
    status: "Activo",
    plan: "Pro",
    billingStatus: "Al día",
    mrr: 950000,
    createdAt: "2026-03-15",
    lastActivity: "Hace 2 horas",
    salesRepresentative: "Camila Restrepo",
    notes: "Edificio automatizado con citofonía virtual activa.",
  },
  {
    id: "cj3",
    name: "Conjunto Cerros de Provenza",
    city: "Medellín",
    units: 96,
    adminName: "Natalia Restrepo Gil",
    adminEmail: "nrestrepo@cerrosprovenza.co",
    adminPhone: "+57 312 345 6789",
    status: "En onboarding",
    plan: "Pro",
    billingStatus: "Prueba (14 días)",
    mrr: 1200000,
    createdAt: "2026-07-18",
    lastActivity: "Hace 1 día",
    salesRepresentative: "Santiago Gómez",
    notes: "Completó paso 3 de onboarding (Carga de balance inicial pendiente).",
  },
  {
    id: "cj4",
    name: "Centro Comercial Plaza del Norte",
    city: "Barranquilla",
    units: null,
    adminName: "Camilo Andrés Torres",
    adminEmail: "ctorres@plazadelnorte.co",
    adminPhone: "+57 318 654 3210",
    status: "Invitación enviada",
    plan: "Starter",
    billingStatus: "Pendiente",
    mrr: 650000,
    createdAt: "2026-07-21",
    lastActivity: "Invitación enviada ayer",
    salesRepresentative: "Valentina Ríos",
    notes: "Lead empresarial corporativo proveniente de campaña comercial.",
  },
  {
    id: "cj5",
    name: "Torres de San Fernando",
    city: "Cali",
    units: 210,
    adminName: "Carlos Alberto Mendoza",
    adminEmail: "gerencia@torressanfernando.com",
    adminPhone: "+57 301 789 0123",
    status: "Activo",
    plan: "Enterprise",
    billingStatus: "Al día",
    mrr: 2300000,
    createdAt: "2026-04-02",
    lastActivity: "Hace 5 minutos",
    salesRepresentative: "Santiago Gómez",
    notes: "Incluye módulo contable avanzado NIIF y nómina de ronderos.",
  },
  {
    id: "cj6",
    name: "Residencial Parque 93",
    city: "Bogotá D.C.",
    units: 64,
    adminName: "Mariana Ospina Ruiz",
    adminEmail: "m.ospina@parque93ph.com",
    adminPhone: "+57 310 987 6543",
    status: "Demo (Prueba)",
    plan: "Demo",
    billingStatus: "Prueba (14 días)",
    mrr: 0,
    createdAt: "2026-07-24",
    lastActivity: "Hace 3 horas",
    salesRepresentative: "Camila Restrepo",
  },
  {
    id: "cj7",
    name: "Urbanización Bosques del Poblado",
    city: "Medellín",
    units: 180,
    adminName: "Felipe Jaramillo Botero",
    adminEmail: "faramillo@bosquespoblado.co",
    adminPhone: "+57 314 567 8901",
    status: "Activo",
    plan: "Enterprise",
    billingStatus: "Al día",
    mrr: 2100000,
    createdAt: "2026-05-19",
    lastActivity: "Hace 4 horas",
    salesRepresentative: "Santiago Gómez",
  },
  {
    id: "cj8",
    name: "Edificio Portal de Cabecera",
    city: "Bucaramanga",
    units: 52,
    adminName: "Pilar Ramírez Duarte",
    adminEmail: "administracion@portalcabecera.com",
    adminPhone: "+57 316 234 5678",
    status: "Activo",
    plan: "Pro",
    billingStatus: "Moroso",
    mrr: 850000,
    createdAt: "2026-05-01",
    lastActivity: "Hace 2 días",
    salesRepresentative: "Valentina Ríos",
  },
];

export const TICKETS_MOCK: SupportTicket[] = [
  {
    id: "TCK-1092",
    propertyName: "Conjunto Cerros de Provenza",
    adminName: "Natalia Restrepo Gil",
    subject: "Error de ajuste en suma de coeficientes en Paso 4 del Onboarding",
    category: "Onboarding",
    priority: "Alta",
    status: "En revisión",
    createdAt: "Hace 2 horas",
  },
  {
    id: "TCK-1088",
    propertyName: "Edificio Portal de Cabecera",
    adminName: "Pilar Ramírez Duarte",
    subject: "Solicitud de comprobante de pago mensualidad de Julio",
    category: "Facturación",
    priority: "Media",
    status: "Abierto",
    createdAt: "Hace 5 horas",
  },
  {
    id: "TCK-1075",
    propertyName: "Torres de San Fernando",
    adminName: "Carlos Alberto Mendoza",
    subject: "Configuración de firma electrónica en módulo NIIF",
    category: "Contabilidad NIIF",
    priority: "Baja",
    status: "Resuelto",
    createdAt: "Ayer",
  },
  {
    id: "TCK-1064",
    propertyName: "Edificio Mirador de la Cabrera",
    adminName: "Julián Esteban Mora",
    subject: "Integración de citofonía IP con portería principal",
    category: "Citofonía",
    priority: "Alta",
    status: "Resuelto",
    createdAt: "Hace 3 días",
  },
];

export const BROADCASTS_MOCK: GlobalBroadcast[] = [
  {
    id: "BC-501",
    title: "Nueva funcionalidad: Citofonía Virtual y Control de Visitas QR",
    targetAudience: "Todos los administradores",
    sentAt: "2026-07-25",
    readRate: "89.4%",
    status: "Enviado",
  },
  {
    id: "BC-498",
    title: "Mantenimiento Programado de Plataforma — Domingo 2:00 AM",
    targetAudience: "Todos los administradores",
    sentAt: "2026-07-15",
    readRate: "94.2%",
    status: "Enviado",
  },
  {
    id: "BC-485",
    title: "Actualización de Regulación Ley 675 en Informes de Asambleas",
    targetAudience: "Planes Pro & Enterprise",
    sentAt: "2026-07-01",
    readRate: "91.0%",
    status: "Enviado",
  },
];

export const TEAM_MEMBERS_MOCK: TeamMember[] = [
  {
    id: "usr-1",
    name: "Santiago Gómez",
    email: "sgomez@kodecraft.co",
    role: "Super Admin",
    status: "Activo",
    propertiesManaged: 5,
  },
  {
    id: "usr-2",
    name: "Camila Restrepo",
    email: "crestrepo@kodecraft.co",
    role: "Ejecutivo de Ventas",
    status: "Activo",
    propertiesManaged: 3,
  },
  {
    id: "usr-3",
    name: "Valentina Ríos",
    email: "vrios@kodecraft.co",
    role: "Líder de Soporte",
    status: "Activo",
    propertiesManaged: 2,
  },
  {
    id: "usr-4",
    name: "Mateo Villamizar",
    email: "mvillamizar@kodecraft.co",
    role: "Ingeniero Dev",
    status: "Ausente",
    propertiesManaged: 0,
  },
];
