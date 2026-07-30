"use client";

import { useState } from "react";
import { Alert, Button, Card, Input, Select } from "@/components/ui";
import { BROADCASTS_MOCK, GlobalBroadcast } from "../model/mocks";

export function BroadcastsView() {
  const [broadcasts, setBroadcasts] = useState<GlobalBroadcast[]>(BROADCASTS_MOCK);
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState<GlobalBroadcast["targetAudience"]>("Todos los administradores");
  const [content, setContent] = useState("");
  const [sentAlert, setSentAlert] = useState<string | null>(null);

  function sendBroadcast() {
    if (!title.trim() || !content.trim()) return;

    const newBc: GlobalBroadcast = {
      id: `BC-${Date.now().toString().slice(-3)}`,
      title,
      targetAudience: audience,
      sentAt: new Date().toISOString().slice(0, 10),
      readRate: "100%",
      status: "Enviado",
    };

    setBroadcasts((prev) => [newBc, ...prev]);
    setSentAlert(`Comunicado masivo "${title}" enviado exitosamente.`);
    setTitle("");
    setContent("");
  }

  return (
    <div className="space-y-6 animate-pop-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
          Comunicados Globales & Anuncios de Plataforma
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Difusión masiva de notificaciones, novedades de ley 675 y avisos de mantenimiento
        </p>
      </div>

      {sentAlert && (
        <Alert tone="green" title="Envío Exitoso">
          {sentAlert}
        </Alert>
      )}

      {/* Broadcast Creator Form */}
      <Card className="p-5 border border-slate-200 dark:border-zinc-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800 pb-2">
          Redactar Nuevo Anuncio Masivo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Título del Anuncio"
              placeholder="Ej: Mantenimiento programado de servidores PSE"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Select
              label="Audiencia Objetivo"
              value={audience}
              onChange={(e) => setAudience(e.target.value as any)}
            >
              <option value="Todos los administradores">Todos los Administradores</option>
              <option value="Planes Pro & Enterprise">Planes Pro & Enterprise</option>
              <option value="En Onboarding">En proceso de Onboarding</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-zinc-300">
              Contenido del Comunicado (Soporta HTML & Markdown)
            </span>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-slate-800 dark:focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="Escribe el mensaje formal que se desplegará en los paneles de administración..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
        </div>

        <div className="flex justify-end">
          <Button onClick={sendBroadcast}>
            Enviar Comunicado Masivo
          </Button>
        </div>
      </Card>

      {/* Broadcast History */}
      <Card className="overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
            Historial de Envíos Anteriores
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                <th className="px-5 py-3.5">Título del Anuncio</th>
                <th className="px-5 py-3.5">Audiencia</th>
                <th className="px-5 py-3.5">Fecha de Envío</th>
                <th className="px-5 py-3.5">Tasa de Apertura</th>
                <th className="px-5 py-3.5 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
              {broadcasts.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-zinc-100">{b.title}</td>
                  <td className="px-5 py-4 text-xs text-slate-600 dark:text-zinc-300 font-medium">{b.targetAudience}</td>
                  <td className="px-5 py-4 text-xs text-slate-500 dark:text-zinc-400">{b.sentAt}</td>
                  <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400 text-xs">{b.readRate}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
