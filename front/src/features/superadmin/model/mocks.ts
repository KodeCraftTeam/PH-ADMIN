// Literal status values stay in Spanish: they render directly in the UI
// (badges, table cells) for the Colombian end user.
export type PlatformPropertyStatus = "Activo" | "En onboarding" | "Invitación enviada";

export interface PlatformProperty {
  id: string;
  name: string;
  city: string;
  units: number | null; // null until onboarding finishes
  adminName: string;
  adminEmail: string;
  status: PlatformPropertyStatus;
  createdAt: string;
}

export const PROPERTIES_MOCK: PlatformProperty[] = [
  {
    id: "cj1",
    name: "Conjunto Residencial Altos del Virrey",
    city: "Bogotá D.C.",
    units: 18,
    adminName: "Diana Carolina Herrera",
    adminEmail: "administracion@altosdelvirrey.co",
    status: "Activo",
    createdAt: "2026-07-22",
  },
  {
    id: "cj2",
    name: "Edificio Mirador de la Cabrera",
    city: "Bogotá D.C.",
    units: 42,
    adminName: "Julián Esteban Mora",
    adminEmail: "admin@miradorcabrera.co",
    status: "Activo",
    createdAt: "2026-06-30",
  },
  {
    id: "cj3",
    name: "Conjunto Cerros de Provenza",
    city: "Medellín",
    units: null,
    adminName: "Natalia Restrepo Gil",
    adminEmail: "nrestrepo@cerrosprovenza.co",
    status: "En onboarding",
    createdAt: "2026-07-18",
  },
  {
    id: "cj4",
    name: "Centro Comercial Plaza del Norte",
    city: "Barranquilla",
    units: null,
    adminName: "Camilo Andrés Torres",
    adminEmail: "ctorres@plazadelnorte.co",
    status: "Invitación enviada",
    createdAt: "2026-07-21",
  },
];
