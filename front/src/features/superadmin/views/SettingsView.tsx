"use client";

import { useState } from "react";
import { Alert, Button, Card, Input, Select } from "@/components/ui";

export function SettingsView() {
  const [savedAlert, setSavedAlert] = useState<string | null>(null);

  // Form State
  const [wompiPublicKey, setWompiPublicKey] = useState("pub_prod_wompi_890123");
  const [wompiPrivateKey, setWompiPrivateKey] = useState("prv_prod_wompi_998877");
  const [dianNit, setDianNit] = useState("901.888.777-5");
  const [dianResolution, setDianResolution] = useState("1876400012389");
  const [smtpServer, setSmtpServer] = useState("smtp.resend.com");
  const [webhooksEnabled, setWebhooksEnabled] = useState(true);

  function handleSave() {
    setSavedAlert("Configuración de pasarelas y DIAN guardada correctamente.");
    setTimeout(() => setSavedAlert(null), 4000);
  }

  return (
    <div className="space-y-6 animate-pop-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
          Configuración SaaS & Integraciones Nacionales
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Parámetros de conexión con pasarelas colombianas, facturación electrónica DIAN y webhooks
        </p>
      </div>

      {savedAlert && (
        <Alert tone="green" title="Cambios Guardados">
          {savedAlert}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pasarelas de Pago Colombia */}
        <Card className="p-5 border border-slate-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              Pasarelas de Pago Colombia (Wompi / PSE / PayU)
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Conectado
            </span>
          </div>

          <div className="space-y-3">
            <Input
              label="Wompi Public API Key"
              value={wompiPublicKey}
              onChange={(e) => setWompiPublicKey(e.target.value)}
            />
            <Input
              label="Wompi Private API Key"
              type="password"
              value={wompiPrivateKey}
              onChange={(e) => setWompiPrivateKey(e.target.value)}
            />
            <Select label="Modo de Operación Wompi">
              <option value="production">Producción (Live Payments)</option>
              <option value="sandbox">Sandbox (Pruebas)</option>
            </Select>
          </div>
        </Card>

        {/* Facturación Electrónica DIAN */}
        <Card className="p-5 border border-slate-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              Facturación Electrónica DIAN (Proveedor Tecnológico)
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
              Habilitado
            </span>
          </div>

          <div className="space-y-3">
            <Input
              label="NIT Emisor DIAN"
              value={dianNit}
              onChange={(e) => setDianNit(e.target.value)}
            />
            <Input
              label="Resolución de Facturación Numeración"
              value={dianResolution}
              onChange={(e) => setDianResolution(e.target.value)}
            />
            <Select label="Proveedor Tecnológico DIAN">
              <option value="facturatech">Facturatech / Siigo API</option>
              <option value="alegra">Alegra API</option>
              <option value="direct">Directo DIAN Webservice</option>
            </Select>
          </div>
        </Card>

        {/* Servidor SMTP & Notificaciones */}
        <Card className="p-5 border border-slate-200 dark:border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3">
            Servidores de Correo Transaccional (Resend / SendGrid)
          </h3>

          <div className="space-y-3">
            <Input
              label="Host SMTP / API Provider"
              value={smtpServer}
              onChange={(e) => setSmtpServer(e.target.value)}
            />
            <Input
              label="Remitente por Defecto"
              value="no-reply@kodecraft.co"
              readOnly
            />
          </div>
        </Card>

        {/* Backups & Mantenimiento */}
        <Card className="p-5 border border-slate-200 dark:border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3">
            Mantenimiento & Backups PostgreSQL
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-zinc-100">Copia de Seguridad Automática</p>
                <p className="text-slate-400 dark:text-zinc-500">Ejecutada diariamente a las 3:00 AM COT</p>
              </div>
              <Button variant="secondary" className="text-xs">Ejecutar Backup Ahora</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} className="shadow-md">
          Guardar Cambios de Configuración
        </Button>
      </div>
    </div>
  );
}
