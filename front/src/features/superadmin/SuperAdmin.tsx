"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  Card,
  IconBuilding,
  IconCheck,
  IconX,
  Input,
  Select,
} from "@/components/ui";
import {
  PROPERTIES_MOCK,
  type PlatformProperty,
  type PlatformPropertyStatus,
} from "./model/mocks";

function StatusBadge({ status }: { status: PlatformPropertyStatus }) {
  if (status === "Activo") {
    return (
      <Badge tone="green">
        <IconCheck className="h-3 w-3" /> Activo
      </Badge>
    );
  }
  if (status === "En onboarding") return <Badge tone="blue">En onboarding</Badge>;
  return <Badge tone="amber">Invitación enviada</Badge>;
}

interface AdminForm {
  name: string;
  email: string;
  phone: string;
  property: string;
  city: string;
}

const EMPTY_FORM: AdminForm = {
  name: "",
  email: "",
  phone: "",
  property: "",
  city: "Bogotá D.C.",
};

export function SuperAdmin() {
  const [properties, setProperties] = useState<PlatformProperty[]>(PROPERTIES_MOCK);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AdminForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof AdminForm, string>>>({});
  const [invitationSent, setInvitationSent] = useState<string | null>(null);

  const active = properties.filter((c) => c.status === "Activo").length;
  const inProgress = properties.length - active;

  function set(field: keyof AdminForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function createAdmin() {
    const next: typeof errors = {};
    (["name", "email", "property"] as const).forEach((f) => {
      if (!form[f].trim()) next[f] = "Obligatorio";
    });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = "Correo inválido";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setProperties((prev) => [
      {
        id: `cj${Date.now()}`,
        name: form.property,
        city: form.city,
        units: null,
        adminName: form.name,
        adminEmail: form.email,
        status: "Invitación enviada",
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setInvitationSent(form.email);
    setForm(EMPTY_FORM);
    setModalOpen(false);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ph-800 text-white">
            <IconBuilding />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">KodeCraft PH</p>
            <p className="text-xs text-slate-400">Super administración</p>
          </div>
          <nav className="ml-auto flex items-center gap-4 text-xs">
            <span className="font-medium text-slate-900">Conjuntos</span>
            <Link href="/onboarding" className="text-slate-400 hover:text-slate-700">
              Onboarding (demo)
            </Link>
            <Link href="/admin" className="text-slate-400 hover:text-slate-700">
              Panel admin (demo)
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Conjuntos</h1>
            <p className="mt-1 text-sm text-slate-500">
              Crea el usuario administrador de cada conjunto; recibirá una invitación
              para completar el onboarding por su cuenta.
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)}>+ Crear administrador</Button>
        </div>

        {invitationSent && (
          <div className="mt-4">
            <Alert tone="green" title="Invitación enviada">
              Se envió un correo a <strong>{invitationSent}</strong> con el enlace
              para crear su contraseña e iniciar la configuración del conjunto
              (wizard de 6 pasos). Soporte solo interviene si la validación falla.
            </Alert>
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Conjuntos activos
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{active}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              En proceso de onboarding
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{inProgress}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Administradores
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {properties.length}
            </p>
          </Card>
        </div>

        <Card className="mt-6 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Conjunto</th>
                <th className="px-4 py-3">Ciudad</th>
                <th className="px-4 py-3 text-right">Unidades</th>
                <th className="px-4 py-3">Administrador</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Creado</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.city}</td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    {c.units ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700">{c.adminName}</p>
                    <p className="text-xs text-slate-400">{c.adminEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{c.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Crear usuario administrador
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Recibirá un correo para completar el onboarding de su conjunto.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Cerrar"
              >
                <IconX />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <Input
                label="Nombre completo"
                placeholder="Laura Victoria Sáenz"
                value={form.name}
                onChange={set("name")}
                error={errors.name}
                required
              />
              <Input
                label="Correo"
                type="email"
                placeholder="lsaenz@torresdelparque.co"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
                required
              />
              <Input
                label="Teléfono"
                placeholder="310 555 12 34"
                value={form.phone}
                onChange={set("phone")}
              />
              <Input
                label="Nombre del conjunto que administrará"
                placeholder="Conjunto Torres del Parque"
                value={form.property}
                onChange={set("property")}
                error={errors.property}
                required
              />
              <Select label="Ciudad" value={form.city} onChange={set("city")}>
                <option>Bogotá D.C.</option>
                <option>Medellín</option>
                <option>Cali</option>
                <option>Barranquilla</option>
                <option>Bucaramanga</option>
              </Select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={createAdmin}>Crear y enviar invitación</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
