import { useEffect, useState } from "react";
import type { Disaster } from "../types/models";
import { listDisasters } from "../api/disasters";

export function DisastersPage() {
  const [items, setItems] = useState<Disaster[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    try {
      const data = await listDisasters();
      setItems(data);
    } catch (e: any) {
      setError(JSON.stringify(e?.response?.data ?? "Failed to load disasters"));
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-semibold">Disasters</h1>
        <button className="ml-auto rounded bg-gray-900 text-white px-4 py-2" onClick={refresh}>
          Refresh
        </button>
      </div>

      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

      <div className="grid gap-3">
        {items.map((d) => (
          <div key={d.id} className="border rounded bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="font-semibold">{d.disasterType}</div>
              <span className="text-xs px-2 py-1 rounded bg-gray-100">Severity: {d.severityLevel}</span>
              <span className="text-xs px-2 py-1 rounded bg-gray-100">Status: {d.status}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">Location: {d.location}</div>
            <div className="text-sm text-gray-600">Start: {d.startDate}</div>
            <p className="mt-2">{d.description}</p>
            <div className="mt-2 text-sm text-gray-500">ID: {d.id}</div>
          </div>
        ))}

        {!items.length && <div className="text-sm text-gray-500">No disasters found.</div>}
      </div>
    </div>
  );
}
