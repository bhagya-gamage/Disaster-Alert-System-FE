import { useEffect, useMemo, useState } from "react";
import type { Resource } from "../types/resources";
import type { Shelter } from "../types/models";
import { listShelters } from "../api/shelters";
import { createResource, deleteResource, listResources, updateResource } from "../api/resources";

export function ResourcesPage() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedShelterId, setSelectedShelterId] = useState<number | "ALL">("ALL");

  const [form, setForm] = useState<Omit<Resource, "id">>({
    shelterId: 1,
    resourceName: "Water Bottles",
    quantity: 100,
  });

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = resources.slice().sort((a, b) => b.id - a.id);
    if (selectedShelterId === "ALL") return list;
    return list.filter((r) => r.shelterId === selectedShelterId);
  }, [resources, selectedShelterId]);

  async function refresh() {
    setError(null);
    try {
      const [s, r] = await Promise.all([listShelters(), listResources()]);
      setShelters(s);
      setResources(r);
      if (s.length && form.shelterId === 1) {
        setForm((prev) => ({ ...prev, shelterId: s[0].id }));
      }
    } catch (e: any) {
      setError(JSON.stringify(e?.response?.data ?? "Failed to load resources"));
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy("create");
    setError(null);
    try {
      await createResource(form);
      await refresh();
    } catch (e: any) {
      setError(JSON.stringify(e?.response?.data ?? "Create failed"));
    } finally {
      setBusy(null);
    }
  }

  async function onUpdate(r: Resource) {
    setBusy(`update-${r.id}`);
    setError(null);
    try {
      await updateResource(r.id, {
        shelterId: r.shelterId,
        resourceName: r.resourceName,
        quantity: r.quantity,
      });
      await refresh();
    } catch (e: any) {
      setError(JSON.stringify(e?.response?.data ?? "Update failed"));
    } finally {
      setBusy(null);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this resource?")) return;
    setBusy(`delete-${id}`);
    setError(null);
    try {
      await deleteResource(id);
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
        <h1 className="text-xl font-semibold">Resources</h1>
        <button className="ml-auto rounded bg-gray-900 text-white px-4 py-2" onClick={refresh}>
          Refresh
        </button>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="border rounded bg-white p-4">
        <h2 className="font-semibold mb-3">Create Resource</h2>
        <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-sm">Shelter</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.shelterId}
              onChange={(e) => setForm((s) => ({ ...s, shelterId: Number(e.target.value) }))}
            >
              {shelters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shelterName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">Resource Name</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.resourceName}
              onChange={(e) => setForm((s) => ({ ...s, resourceName: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm">Quantity</label>
            <input
              type="number"
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.quantity}
              onChange={(e) => setForm((s) => ({ ...s, quantity: Number(e.target.value) }))}
            />
          </div>

          <div className="md:col-span-3">
            <button className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-60" disabled={busy === "create"}>
              Create
            </button>
          </div>
        </form>
      </div>

      <div className="border rounded bg-white p-4">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="font-semibold">All Resources</h2>
          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm text-gray-600">Filter shelter:</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedShelterId}
              onChange={(e) => setSelectedShelterId(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
            >
              <option value="ALL">ALL</option>
              {shelters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shelterName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Shelter</th>
                <th className="p-3">Resource</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.shelterId}</td>
                  <td className="p-3">
                    <input
                      className="border rounded px-2 py-1 w-56"
                      value={r.resourceName}
                      onChange={(e) =>
                        setResources((prev) => prev.map((x) => (x.id === r.id ? { ...x, resourceName: e.target.value } : x)))
                      }
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-28"
                      value={r.quantity}
                      onChange={(e) =>
                        setResources((prev) => prev.map((x) => (x.id === r.id ? { ...x, quantity: Number(e.target.value) } : x)))
                      }
                    />
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="rounded bg-gray-900 text-white px-3 py-1 disabled:opacity-60"
                      disabled={busy === `update-${r.id}`}
                      onClick={() => onUpdate(r)}
                    >
                      Save
                    </button>
                    <button
                      className="rounded bg-red-600 text-white px-3 py-1 disabled:opacity-60"
                      disabled={busy === `delete-${r.id}`}
                      onClick={() => onDelete(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!filtered.length && (
                <tr>
                  <td className="p-3 text-gray-500" colSpan={5}>
                    No resources found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          Uses backend endpoints: GET/POST /api/resources, PUT/DELETE /api/resources/{{id}}.
        </div>
      </div>
    </div>
  );
}
