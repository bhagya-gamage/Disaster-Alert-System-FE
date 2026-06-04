import { useEffect, useMemo, useState } from "react";
import type { Disaster } from "../../types/models";
import {
  createDisaster,
  listDisasters,
  updateDisaster,
  deleteDisaster,
  type UpsertDisasterRequest,
} from "../../api/disasters";

const SEVERITIES: Disaster["severityLevel"][] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUSES: Disaster["status"][] = ["ACTIVE", "RESOLVED", "CANCELLED"];

function toLocalDatetimeInput(iso: string) {
  // Accept either "2026-06-04T10:30:00" or ISO with Z
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AdminDisastersPage() {
  const [items, setItems] = useState<Disaster[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const [form, setForm] = useState<{ editingId: number | null } & UpsertDisasterRequest>({
    editingId: null,
    disasterType: "Flood",
    description: "River overflow in low-lying areas",
    severityLevel: "HIGH",
    location: "Colombo",
    startDate: new Date().toISOString(),
    status: "ACTIVE",
  });

  const sorted = useMemo(() => items.slice().sort((a, b) => b.id - a.id), [items]);

  async function refresh() {
    setError(null);
    const data = await listDisasters();
    setItems(data);
  }

  useEffect(() => {
    refresh().catch((e) => setError(JSON.stringify(e?.response?.data ?? "Failed to load disasters")));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy("save");
    setError(null);
    try {
      const payload: UpsertDisasterRequest = {
        disasterType: form.disasterType,
        description: form.description,
        severityLevel: form.severityLevel,
        location: form.location,
        startDate: form.startDate,
        status: form.status,
      };

      if (form.editingId) {
        await updateDisaster(form.editingId, payload);
      } else {
        await createDisaster(payload);
      }

      setForm((s) => ({ ...s, editingId: null }));
      await refresh();
    } catch (e: any) {
      setError(JSON.stringify(e?.response?.data ?? "Save failed"));
    } finally {
      setBusy(null);
    }
  }

  function onEdit(d: Disaster) {
    setForm({
      editingId: d.id,
      disasterType: d.disasterType,
      description: d.description,
      severityLevel: d.severityLevel,
      location: d.location,
      startDate: d.startDate,
      status: d.status,
    });
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this disaster?")) return;
    setBusy(`delete-${id}`);
    setError(null);
    try {
      await deleteDisaster(id);
      await refresh();
    } catch (e: any) {
      setError(JSON.stringify(e?.response?.data ?? "Delete failed"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Admin – Disasters</h1>
        <button className="ml-auto rounded bg-gray-900 text-white px-4 py-2" onClick={() => refresh()}>
          Refresh
        </button>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="border rounded bg-white p-4">
        <h2 className="font-semibold mb-3">{form.editingId ? `Update Disaster #${form.editingId}` : "Create Disaster"}</h2>

        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm">Disaster Type</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.disasterType}
              onChange={(e) => setForm((s) => ({ ...s, disasterType: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm">Location</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.location}
              onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm">Description</label>
            <textarea
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm">Severity</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.severityLevel}
              onChange={(e) => setForm((s) => ({ ...s, severityLevel: e.target.value as Disaster["severityLevel"] }))}
            >
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">Status</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.status}
              onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as Disaster["status"] }))}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm">Start Date</label>
            <input
              type="datetime-local"
              className="mt-1 w-full border rounded px-3 py-2"
              value={toLocalDatetimeInput(form.startDate)}
              onChange={(e) => {
                const v = e.target.value;
                // backend examples use "2026-06-04T10:30:00" (no Z)
                // we'll send without seconds if user enters without seconds; otherwise convert to ISO-like string
                setForm((s) => ({ ...s, startDate: v.length === 16 ? `${v}:00` : v }));
              }}
            />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-60" disabled={busy === "save"}>
              {form.editingId ? "Update" : "Create"}
            </button>
            {form.editingId && (
              <button
                type="button"
                className="rounded bg-gray-200 text-gray-900 px-4 py-2"
                onClick={() => setForm((s) => ({ ...s, editingId: null }))}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="border rounded bg-white p-4">
        <h2 className="font-semibold mb-3">Existing Disasters</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-3">{d.id}</td>
                  <td className="p-3">{d.disasterType}</td>
                  <td className="p-3">{d.location}</td>
                  <td className="p-3">{d.severityLevel}</td>
                  <td className="p-3">{d.status}</td>
                  <td className="p-3 flex gap-2">
                    <button className="rounded bg-gray-900 text-white px-3 py-1" onClick={() => onEdit(d)}>
                      Edit
                    </button>
                    <button
                      className="rounded bg-red-600 text-white px-3 py-1 disabled:opacity-60"
                      disabled={busy === `delete-${d.id}`}
                      onClick={() => onDelete(d.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!sorted.length && (
                <tr>
                  <td className="p-3 text-gray-500" colSpan={6}>
                    No disasters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
