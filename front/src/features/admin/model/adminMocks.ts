export interface AdminPqrs {
  id: string;
  unit: string;
  residentName: string;
  subject: string;
  category: "Mantenimiento" | "Ruido" | "Facturación" | "Parqueaderos" | "Mascotas";
  priority: "Alta" | "Media" | "Baja";
  status: "Pendiente" | "En proceso" | "Resuelto";
  date: string;
}

export interface AdminBroadcast {
  id: string;
  title: string;
  category: "Asamblea" | "Mantenimiento" | "Circular General" | "Cobranza";
  date: string;
  target: "Todos los residentes" | "Propietarios morosos" | "Torre 1";
  readPercentage: string;
}

export const ADMIN_PQRS_MOCK: AdminPqrs[] = [
  {
    id: "PQ-201",
    unit: "Apto 302",
    residentName: "Carlos Eduardo Silva",
    subject: "Filtración de agua en techo del parqueadero #42",
    category: "Mantenimiento",
    priority: "Alta",
    status: "Pendiente",
    date: "Hace 3 horas",
  },
  {
    id: "PQ-198",
    unit: "Apto 104",
    residentName: "Ana Maria Gutiérrez",
    subject: "Ruido excesivo en áreas comunes después de las 10:00 PM",
    category: "Ruido",
    priority: "Media",
    status: "En proceso",
    date: "Ayer",
  },
  {
    id: "PQ-195",
    unit: "Local 1",
    residentName: "Comercial Gourmet S.A.S",
    subject: "Revisión de cobro extraordinario de cuota de vigilancia",
    category: "Facturación",
    priority: "Baja",
    status: "Resuelto",
    date: "Hace 3 días",
  },
];

export const ADMIN_BROADCASTS_MOCK: AdminBroadcast[] = [
  {
    id: "BC-10",
    title: "Mantenimiento y lavado preventivo de tanques de agua potable",
    category: "Mantenimiento",
    date: "2026-07-26",
    target: "Todos los residentes",
    readPercentage: "92.5%",
  },
  {
    id: "BC-09",
    title: "Convocatoria a Asamblea General Ordinaria 2026",
    category: "Asamblea",
    date: "2026-07-15",
    target: "Todos los residentes",
    readPercentage: "98.1%",
  },
  {
    id: "BC-08",
    title: "Aviso de cierre de periodo de pago con descuento de pronto pago",
    category: "Circular General",
    date: "2026-07-05",
    target: "Todos los residentes",
    readPercentage: "87.3%",
  },
];
