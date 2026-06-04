import { useState } from "react";
import { createAlert } from "../../api/alerts";

export function AdminCreateAlertPage() {
  const [form, setForm] = useState({
    title: "Flood Warning",
    message: "Move to higher ground immediately.",
    alertDate: new Date().toISOString().slice(0, 16),
    disasterId: 1,
  });
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    try {
      await createAlert({ ...form, alertDate: new Date(form.alertDate).toISOString() });
      setStatus("Alert created!");
    } catch (err: any) {
      setStatus(JSON.stringify(err?.response?.data ?? "Create failed"));
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-xl font-semibold mb-4">Create Alert (Admin)</h1>

      <form onSubmit={onSubmit} className="space-y-3 border rounded bg-white p-4">
        <input className="w-full border rounded px-3 py-2" value={form.title}
          onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="Title" />
        <textarea className="w-full border rounded px-3 py-2" value={form.message}
          onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} placeholder="Message" />
        <input type="datetime-local" className="w-full border rounded px-3 py-2" value={form.alertDate}
          onChange={(e) => setForm((s) => ({ ...s, alertDate: e.target.value }))} />
        <input type="number" className="w-full border rounded px-3 py-2" value={form.disasterId}
          onChange={(e) => setForm((s) => ({ ...s, disasterId: Number(e.target.value) }))} />
        <button className="rounded bg-gray-900 text-white px-4 py-2">Create</button>
      </form>

      {status && <div className="mt-3 text-sm">{status}</div>}
    </div>
  );
}
