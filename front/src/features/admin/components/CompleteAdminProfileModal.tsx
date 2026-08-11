"use client";

import { useEffect, useState } from "react";
import { Alert, Badge, Button, IconBuilding, IconCheck, IconX, Input, Select } from "@/components/ui";
import { getCities, registerAdministrator, type CityItem } from "../api/administrators.api";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: () => void;
}

const FALLBACK_CITIES: CityItem[] = [
  { id: "11001", name: "Bogotá D.C." },
  { id: "05001", name: "Medellín" },
  { id: "76001", name: "Cali" },
  { id: "08001", name: "Barranquilla" },
  { id: "68001", name: "Bucaramanga" },
  { id: "13001", name: "Cartagena" },
  { id: "66001", name: "Pereira" },
  { id: "17001", name: "Manizales" },
];

export function CompleteAdminProfileModal({ isOpen, onClose, onSuccess }: Props) {
  const [personType, setPersonType] = useState<"NATURAL" | "JURIDICA">("NATURAL");
  const [nameOrBusinessName, setNameOrBusinessName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [cityId, setCityId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [legalRepresentative, setLegalRepresentative] = useState("");
  const [cities, setCities] = useState<CityItem[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [completedSuccessfully, setCompletedSuccessfully] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    getCities()
      .then((data) => {
        const nextCities = Array.isArray(data) && data.length > 0 ? data : FALLBACK_CITIES;
        setCities(nextCities);
        setCityId(nextCities[0].id);
      })
      .catch(() => {
        setCities(FALLBACK_CITIES);
        setCityId(FALLBACK_CITIES[0].id);
      })
      .finally(() => setLoadingCities(false));
  }, [isOpen]);

  if (!isOpen) return null;

  function validateForm() {
    const errs: Record<string, string> = {};
    if (!nameOrBusinessName.trim()) {
      errs.nameOrBusinessName = personType === "NATURAL"
        ? "El nombre completo es obligatorio."
        : "La razón social es obligatoria.";
    }
    if (!taxId.trim()) {
      errs.taxId = personType === "NATURAL"
        ? "El número de documento / cédula es obligatorio."
        : "El NIT de la empresa es obligatorio.";
    } else if (taxId.replace(/[^0-9-]/g, "").length < 6) {
      errs.taxId = "Ingresa un documento o NIT válido (mínimo 6 dígitos).";
    }
    if (!cityId) errs.cityId = "Por favor selecciona una ciudad.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await registerAdministrator({
        personType,
        nameOrBusinessName: nameOrBusinessName.trim(),
        taxId: taxId.trim(),
        cityId,
        phoneNumber: phoneNumber.trim() || undefined,
        address: address.trim() || undefined,
        legalRepresentative: personType === "JURIDICA" && legalRepresentative.trim()
          ? legalRepresentative.trim()
          : undefined,
      });
      setCompletedSuccessfully(true);
      setTimeout(() => {
        onSuccess();
        onClose?.();
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No se pudo completar el registro del perfil. Por favor verifica los datos e intenta de nuevo.";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  }

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-md transition-all duration-300 animate-in fade-in sm:p-5">
      <div className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-[1.25rem] border border-slate-200/90 bg-white shadow-2xl shadow-slate-950/20 dark:border-zinc-800 dark:bg-zinc-950 sm:max-h-[92vh]">
        <div className="h-1 w-full" style={{ backgroundColor: "var(--accent-color)" }} />

        <div className="relative isolate overflow-hidden bg-slate-950 px-5 py-5 text-white sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-44 rotate-[-4deg] rounded-xl bg-[#8e8069]/45 blur-[1px]" />
          <div className="pointer-events-none absolute right-24 top-8 h-16 w-32 rotate-[-2deg] rounded-lg bg-[#5d6878]/50" />
          <div className="pointer-events-none absolute -bottom-10 right-4 h-20 w-40 rotate-[3deg] rounded-lg bg-[#8e8069]/30" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-950 shadow-lg shadow-black/20">
                <IconBuilding className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl">Completar Registro</h2>
                  <Badge tone="indigo">Administrador PH</Badge>
                </div>
                <p className="mt-1 max-w-lg text-xs leading-relaxed text-slate-300 sm:text-sm">
                  Información requerida para habilitar la gestión de copropiedades.
                </p>
              </div>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar modal"
                className="shrink-0 rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <IconX className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {completedSuccessfully ? (
          <div className="space-y-3 px-5 py-14 text-center animate-pop-in sm:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner dark:bg-emerald-950/60 dark:text-emerald-400">
              <IconCheck className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">¡Perfil completado con éxito!</h3>
            <p className="mx-auto max-w-sm text-xs text-slate-500 dark:text-zinc-400">Tus datos de administrador han sido guardados. Accediendo al panel de control...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
            {errorMsg && <Alert tone="red" title="Atención">{errorMsg}</Alert>}

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-zinc-400">Tipo de Persona</label>
              <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-zinc-800 dark:bg-zinc-900">
                {(["NATURAL", "JURIDICA"] as const).map((type) => {
                  const selected = personType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => { setPersonType(type); setFieldErrors({}); }}
                      aria-pressed={selected}
                      className={`flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] sm:px-3 ${selected ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/70 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700" : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200"}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: selected ? "var(--accent-color)" : "transparent" }} />
                      {type === "NATURAL" ? "Persona Natural" : "Persona Jurídica"}
                    </button>
                  );
                })}
              </div>
            </div>

            <Input
              label={personType === "NATURAL" ? "Nombre Completo" : "Razón Social de la Empresa"}
              placeholder={personType === "NATURAL" ? "Ej: Carlos Alberto Gómez" : "Ej: Soluciones de Administración Inmobiliaria S.A.S."}
              value={nameOrBusinessName}
              onChange={(e) => { setNameOrBusinessName(e.target.value); clearFieldError("nameOrBusinessName"); }}
              error={fieldErrors.nameOrBusinessName}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label={personType === "NATURAL" ? "Cédula de Ciudadanía / Documento" : "NIT (Número de Identificación Tributaria)"}
                placeholder={personType === "NATURAL" ? "Ej: 1020304050" : "Ej: 901.456.789-1"}
                value={taxId}
                onChange={(e) => { setTaxId(e.target.value); clearFieldError("taxId"); }}
                error={fieldErrors.taxId}
                required
              />
              <Select
                label="Ciudad Principal de Operación"
                value={cityId}
                onChange={(e) => { setCityId(e.target.value); clearFieldError("cityId"); }}
                error={fieldErrors.cityId}
                required
                disabled={loadingCities}
              >
                {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
              </Select>
            </div>

            {personType === "JURIDICA" && (
              <Input
                label="Representante Legal (Opcional)"
                placeholder="Ej: María Fernanda López"
                value={legalRepresentative}
                onChange={(e) => setLegalRepresentative(e.target.value)}
              />
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Teléfono / Celular de Contacto" placeholder="Ej: 310 456 7890" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <Input label="Dirección de Oficina / Notificación" placeholder="Ej: Calle 100 # 15-20, Ofic 502" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--accent-color)" }} />
              <span><strong className="font-semibold text-slate-700 dark:text-zinc-200">Privacidad.</strong>{" "}Tus datos se utilizan únicamente para la representación legal y facturación del servicio en la copropiedad.</span>
            </div>

            <div className="mt-1 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              {onClose && <Button type="button" variant="secondary" onClick={onClose} disabled={submitting} className="w-full sm:w-auto">Cancelar</Button>}
              <Button type="submit" disabled={submitting} className="w-full min-w-[160px] sm:w-auto">
                {submitting ? <span className="flex items-center justify-center gap-2"><span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Guardando...</span> : "Guardar y Continuar"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
