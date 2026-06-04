import { useEffect, useMemo, useState } from "react";
import type { Shelter } from "../../types/models";
import { listShelters, updateShelter } from "../../api/shelters";

export function ShelterManagerPage() {
  const [items, setItems] = useState<Shelter[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const sorted = useMemo(() => items.slice().sort((a, b) => a.shelterName.localeCompare(b.shelterName)), [items]);

  async function refresh() {
    setError(null);
    const data = await listShelters();
    setItems(data);
  }

  useEffect(() => {
    refresh().catch((e) => setError(JSON.stringify(e?.response?.data ?? "Failed to load shelters")));
  }, []);

  async function onSave(s: Shelter) {
    setBusyId(s.id);
    setError(null);
    try {
      await updateShelter(s.id, {
        shelterName: s.shelterName,
        address: s.address,
        totalCapacity: s.totalCapacity,
        currentOccupancy: s.currentOccupancy,
      });
      await refresh();
    } catch (e: any) {
      setError(JSON.stringify(e?.response?.data ?? "Update failed"));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Shelter Manager</h1>
        <button className="ml-auto rounded bg-gray-900 text-white px-4 py-2" onClick={() => refresh()}>
          Refresh
        </button>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid gap-3">
        {sorted.map((s) => (
          <div key={s.id} className="border rounded bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="font-semibold">{s.shelterName}</div>
              <div className="ml-auto text-xs text-gray-500">ID: {s.id}</div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 mt-3">
              <div>
                <label className="text-sm">Shelter Name</label>
                <input
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={s.shelterName}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x) => (x.id === s.id ? { ...x, shelterName: e.target.value } : x)))
                  }
                />
              </div>

              <div>
                <label className="text-sm">Address</label>
                <input
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={s.address}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x) => (x.id === s.id ? { ...x, address: e.target.value } : x)))
                  }
                />
              </div>

              <div>
                <label className="text-sm">Total Capacity</label>
                <input
                  type="number"
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={s.totalCapacity}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((x) => (x.id === s.id ? { ...x, totalCapacity: Number(e.target.value) } : x))
                    )
                  }
                />
              </div>

              <div>
                <label className="text-sm">Current Occupancy</label>
                <input
                  type="number"
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={s.currentOccupancy}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((x) => (x.id === s.id ? { ...x, currentOccupancy: Number(e.target.value) } : x))
                    )
                  }
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button
                  className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-60"
                  disabled={busyId === s.id}
                  onClick={() => onSave(s)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ))}

        {!sorted.length && <div className="text-sm text-gray-500">No shelters found.</div>}
      </div>
    </div>
  );
}
