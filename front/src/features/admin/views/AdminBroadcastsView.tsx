"use client";

import { useState } from "react";
import { Alert, Button, Card, Input, Select } from "@/components/ui";
import { ADMIN_BROADCASTS_MOCK, AdminBroadcast } from "../model/adminMocks";

export function AdminBroadcastsView() {
  const [broadcasts, setBroadcasts] = useState<AdminBroadcast[]>(ADMIN_BROADCASTS_MOCK);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AdminBroadcast["category"]>("Circular General");
  const [content, setContent] = useState("");
  const [sentAlert, setSentAlert] = useState<string | null>(null);

  function sendBroadcast() {
    if (!title.trim() || !content.trim()) return;

    const newBc: AdminBroadcast = {
      id: `BC-${Date.now().toString().slice(-2)}`,
      title,
      category,
      date: new Date().toISOString().slice(0, 10),
      target: "Todos los residentes",
      readPercentage: "100%",
    };

    setBroadcasts((prev) => [newBc, ...prev]);
    setSentAlert(`Comunicado "${title}" publicado en la cartelera digital y enviado por correo a los residentes.`);
    setTitle("");
    setContent("");
  }

  return (
    <div className="space-y-6 animate-pop-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
          Comunicados & Cartelera Digital del Conjunto
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Publicación de avisos de mantenimiento, convocatorias a asambleas y circulares oficiales
        </p>
      </div>

      {sentAlert && (
        <Alert tone="green" title="Circular Publicada">
          {sentAlert}
        </Alert>
      )}

      {/* Broadcast Form */}
      <Card className="p-5 border border-slate-200 dark:border-zinc-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800 pb-2">
          Publicar Nueva Circular a Propietarios
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Título del Comunicado"
              placeholder="Ej: Suspensión temporal del servicio de agua por mantenimiento"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Select
              label="Categoría"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="Circular General">Circular General</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Asamblea">Asamblea & Votación</option>
              <option value="Cobranza">Aviso de Cobranza</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-zinc-300">
              Contenido Formal de la Circular
            </span>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none"
              placeholder="Escribe el texto formal que recibirán los propietarios por correo electrónico..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
        </div>

        <div className="flex justify-end">
          <Button onClick={sendBroadcast}>
            Publicar Circular & Notificar Residentes
          </Button>
        </div>
      </Card>

      {/* Broadcast History */}
      <Card className="overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
            Historial de Circulares Publicadas
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                <th className="px-5 py-3.5">Título del Comunicado</th>
                <th className="px-5 py-3.5">Categoría</th>
                <th className="px-5 py-3.5">Fecha de Publicación</th>
                <th className="px-5 py-3.5 text-right">Lectura Confirmada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
              {broadcasts.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-zinc-100">{b.title}</td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-600 dark:text-zinc-300">{b.category}</td>
                  <td className="px-5 py-4 text-xs text-slate-500 dark:text-zinc-400">{b.date}</td>
                  <td className="px-5 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400 text-xs">{b.readPercentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
