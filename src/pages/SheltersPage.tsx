import { useEffect, useMemo, useState } from "react";
import type { Shelter } from "../types/models";
import { listShelters } from "../api/shelters";

export function SheltersPage() {
  const [items, setItems] = useState<Shelter[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(() => items.slice().sort((a, b) => a.shelterName.localeCompare(b.shelterName)), [items]);

  async function refresh() {
    setError(null);
    try {
      const data = await listShelters();
      setItems(data);
    } catch (e: any) {
      setError(JSON.stringify(e?.response?.data ?? "Failed to load shelters"));
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-semibold">Shelters</h1>
        <button className="ml-auto rounded bg-gray-900 text-white px-4 py-2" onClick={refresh}>
          Refresh
        </button>
      </div>

      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

      <div className="grid gap-3 md:grid-cols-2">
        {sorted.map((s) => (
          <div key={s.id} className="border rounded bg-white p-4">
            <div className="font-semibold">{s.shelterName}</div>
            <div className="text-sm text-gray-600 mt-1">{s.address}</div>
            <div className="mt-2 text-sm">
              Capacity: <span className="font-medium">{s.currentOccupancy}</span> / {s.totalCapacity}
            </div>
            <div className="mt-1 text-xs text-gray-500">Shelter ID: {s.id}</div>
          </div>
        ))}

        {!sorted.length && <div className="text-sm text-gray-500">No shelters found.</div>}
      </div>
    </div>
  );
}
