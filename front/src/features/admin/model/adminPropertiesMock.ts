export interface ManagedProperty {
  id: string;
  name: string;
  nit: string;
  city: string;
  type: "Residencial" | "Comercial" | "Mixto";
  unitsCount: number;
  status: "Activo" | "En Onboarding" | "En Mora" | "Configuración";
  plan: "Starter" | "Pro" | "Enterprise";
  pendingBalance: number; // Cartera pendiente
  recaudoPercentage: number; // % recaudo mes actual
  overdueUnits: number; // Cantidad unidades en mora
  pendingPqrs: number;
  lastBackupDate: string;
  imageAccent: string; // Tailwind color string for subtle gradient badge
}

export const ADMIN_MANAGED_PROPERTIES: ManagedProperty[] = [
  {
    id: "prop-1",
    name: "Altos del Virrey",
    nit: "901.456.789-2",
    city: "Bogotá D.C.",
    type: "Residencial",
    unitsCount: 18,
    status: "Activo",
    plan: "Enterprise",
    pendingBalance: 4034000,
    recaudoPercentage: 82,
    overdueUnits: 5,
    pendingPqrs: 2,
    lastBackupDate: "Hoy 08:30 AM",
    imageAccent: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
  },
  {
    id: "prop-2",
    name: "Torres del Parque Central",
    nit: "900.812.345-6",
    city: "Medellín",
    type: "Residencial",
    unitsCount: 120,
    status: "Activo",
    plan: "Pro",
    pendingBalance: 12450000,
    recaudoPercentage: 94,
    overdueUnits: 8,
    pendingPqrs: 4,
    lastBackupDate: "Ayer 06:15 PM",
    imageAccent: "from-sky-500/20 to-blue-500/10 border-sky-500/30",
  },
  {
    id: "prop-3",
    name: "Edificio Mirador del Sol",
    nit: "901.987.654-3",
    city: "Cali",
    type: "Mixto",
    unitsCount: 51,
    status: "En Onboarding",
    plan: "Starter",
    pendingBalance: 1200000,
    recaudoPercentage: 68,
    overdueUnits: 1,
    pendingPqrs: 1,
    lastBackupDate: "Hace 2 días",
    imageAccent: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
  },
  {
    id: "prop-4",
    name: "Residencial Las Palmas Norte",
    nit: "901.334.556-8",
    city: "Barranquilla",
    type: "Residencial",
    unitsCount: 80,
    status: "Activo",
    plan: "Pro",
    pendingBalance: 3800000,
    recaudoPercentage: 91,
    overdueUnits: 3,
    pendingPqrs: 0,
    lastBackupDate: "Hoy 10:00 AM",
    imageAccent: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30",
  },
];
