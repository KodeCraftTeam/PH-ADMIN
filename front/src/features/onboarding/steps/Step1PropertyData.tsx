"use client";

import { useState } from "react";
import { Card, Input, Select } from "@/components/ui";
import { StepFooter } from "../components/StepFooter";
import { useWizardDispatch, useWizardState } from "../model/WizardContext";
import type { PropertyData } from "../model/types";

const REQUIRED_FIELDS: Array<{ field: keyof PropertyData; name: string }> = [
  { field: "name", name: "Nombre del conjunto" },
  { field: "taxId", name: "NIT" },
  { field: "address", name: "Dirección" },
  { field: "city", name: "Ciudad" },
  { field: "type", name: "Tipo de conjunto" },
  { field: "totalUnits", name: "Número total de unidades" },
  { field: "totalTowers", name: "Número de torres/bloques" },
  { field: "adminName", name: "Nombre del administrador" },
  { field: "adminEmail", name: "Correo del administrador" },
];

export function Step1PropertyData() {
  const { property } = useWizardState();
  const dispatch = useWizardDispatch();
  const [errors, setErrors] = useState<Partial<Record<keyof PropertyData, string>>>(
    {}
  );

  function set(field: keyof PropertyData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      dispatch({ type: "SET_PROPERTY", field, value: e.target.value });
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function validate(): boolean {
    const next: typeof errors = {};
    for (const { field } of REQUIRED_FIELDS) {
      if (!property[field].trim()) next[field] = "Este campo es obligatorio";
    }
    if (property.adminEmail && !/^\S+@\S+\.\S+$/.test(property.adminEmail)) {
      next.adminEmail = "Correo inválido";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Datos del conjunto</h1>
      <p className="mt-1 text-sm text-slate-500">
        Información básica de la copropiedad. Estos datos aparecerán en facturas y
        comunicados.
      </p>

      <Card className="mt-6 p-6">
        <div className="grid grid-cols-2 gap-5">
          <Input
            label="Nombre del conjunto"
            placeholder="Conjunto Residencial Altos del Virrey"
            value={property.name}
            onChange={set("name")}
            error={errors.name}
            required
          />
          <Input
            label="NIT"
            placeholder="901.456.789-2"
            value={property.taxId}
            onChange={set("taxId")}
            error={errors.taxId}
            required
          />
          <Input
            label="Dirección"
            placeholder="Cra. 7 # 127-45"
            value={property.address}
            onChange={set("address")}
            error={errors.address}
            required
          />
          <Input
            label="Ciudad"
            placeholder="Bogotá D.C."
            value={property.city}
            onChange={set("city")}
            error={errors.city}
            required
          />
          <Select
            label="Tipo de conjunto"
            value={property.type}
            onChange={set("type")}
            error={errors.type}
            required
          >
            <option value="">Seleccione…</option>
            <option value="Residencial">Residencial</option>
            <option value="Comercial">Comercial</option>
            <option value="Mixto">Mixto</option>
          </Select>
          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Total de unidades"
              type="number"
              min={1}
              placeholder="18"
              value={property.totalUnits}
              onChange={set("totalUnits")}
              error={errors.totalUnits}
              required
            />
            <Input
              label="Torres / bloques"
              type="number"
              min={1}
              placeholder="3"
              value={property.totalTowers}
              onChange={set("totalTowers")}
              error={errors.totalTowers}
              required
            />
          </div>
          <Input
            label="Nombre del administrador"
            placeholder="Diana Carolina Herrera"
            value={property.adminName}
            onChange={set("adminName")}
            error={errors.adminName}
            required
          />
          <Input
            label="Correo del administrador"
            type="email"
            placeholder="administracion@altosdelvirrey.co"
            value={property.adminEmail}
            onChange={set("adminEmail")}
            error={errors.adminEmail}
            required
          />
        </div>
      </Card>

      <StepFooter onAdvance={validate} />
    </div>
  );
}
