"use client";

import { useState } from "react";
import { Button, Input, Select, IconX } from "@/components/ui";
import { type PlatformPlan, type PlatformProperty } from "../model/mocks";

interface AdminForm {
  name: string;
  email: string;
  phone: string;
  property: string;
  city: string;
  plan: PlatformPlan;
  estimatedUnits: string;
  notes: string;
}

const EMPTY_FORM: AdminForm = {
  name: "",
  email: "",
  phone: "",
  property: "",
  city: "Bogotá D.C.",
  plan: "Pro",
  estimatedUnits: "",
  notes: "",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newProp: PlatformProperty) => void;
}

export function CreateAdminModal({ isOpen, onClose, onCreate }: Props) {
  const [form, setForm] = useState<AdminForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof AdminForm, string>>>({});

  if (!isOpen) return null;

  function set(field: keyof AdminForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleSubmit() {
    const next: typeof errors = {};
    (["name", "email", "property"] as const).forEach((f) => {
      if (!form[f].trim()) next[f] = "Obligatorio";
    });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = "Correo electrónico inválido";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const mrrByPlan: Record<PlatformPlan, number> = {
      Starter: 550000,
      Pro: 1100000,
      Enterprise: 2200000,
      Demo: 0,
    };

    const newProperty: PlatformProperty = {
      id: `cj${Date.now()}`,
      name: form.property,
      city: form.city,
      units: form.estimatedUnits ? parseInt(form.estimatedUnits, 10) : null,
      adminName: form.name,
      adminEmail: form.email,
      adminPhone: form.phone || "+57 300 000 0000",
      status: form.plan === "Demo" ? "Demo (Prueba)" : "Invitación enviada",
      plan: form.plan,
      billingStatus: form.plan === "Demo" ? "Prueba (14 días)" : "Pendiente",
      mrr: mrrByPlan[form.plan],
      createdAt: new Date().toISOString().slice(0, 10),
      lastActivity: "Invitación enviada ahora",
      salesRepresentative: "SuperAdmin Directo",
      notes: form.notes,
    };

    onCreate(newProperty);
    setForm(EMPTY_FORM);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-zinc-950/80 p-4 backdrop-blur-xs animate-pop-in">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-slate-100 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              Crear Nuevo Administrador de Copropiedad
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
              Recibirá un correo de bienvenida con la contraseña temporal e instrucciones.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="mt-4 space-y-3.5">
          <Input
            label="Nombre Completo del Administrador"
            placeholder="Ej: Laura Victoria Sáenz"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Correo Electrónico Directo"
              type="email"
              placeholder="lsaenz@torresparque.co"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
              required
            />
            <Input
              label="Teléfono Móvil"
              placeholder="310 555 1234"
              value={form.phone}
              onChange={set("phone")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nombre del Conjunto / Edificio"
              placeholder="Conjunto Torres del Parque"
              value={form.property}
              onChange={set("property")}
              error={errors.property}
              required
            />
            <Select label="Ciudad Principal" value={form.city} onChange={set("city")}>
              <option>Bogotá D.C.</option>
              <option>Medellín</option>
              <option>Cali</option>
              <option>Barranquilla</option>
              <option>Bucaramanga</option>
              <option>Cartagena</option>
              <option>Pereira</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select label="Plan Comercial Asignado" value={form.plan} onChange={set("plan")}>
              <option value="Starter">Starter (Hasta 60 uds - $550k COP)</option>
              <option value="Pro">Pro (Hasta 150 uds - $1.1M COP)</option>
              <option value="Enterprise">Enterprise (Ilimitado - $2.2M COP)</option>
              <option value="Demo">Demo Gratuito (14 Días)</option>
            </Select>
            <Input
              label="Estimado de Unidades (Aprox)"
              type="number"
              placeholder="Ej: 120"
              value={form.estimatedUnits}
              onChange={set("estimatedUnits")}
            />
          </div>

          <div>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-zinc-300">
                Notas Comerciales Internas (Opcional)
              </span>
              <textarea
                rows={2}
                className="w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-slate-800 dark:focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="Observaciones de negociación, módulos adicionales requeridos..."
                value={form.notes}
                onChange={set("notes")}
              />
            </label>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Crear y Enviar Invitación
          </Button>
        </div>
      </div>
    </div>
  );
}
