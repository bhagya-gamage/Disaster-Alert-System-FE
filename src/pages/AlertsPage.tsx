import { useEffect, useState } from "react";
import { listAlerts } from "../api/alerts";
import type { Alert } from "../types/models";

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listAlerts().then(setAlerts).catch((e) => setError(e?.response?.data?.message ?? "Failed to load alerts"));
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="text-xl font-semibold mb-4">Alerts</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid gap-3">
        {alerts.map((a) => (
          <div key={a.id} className="border rounded p-3 bg-white">
            <div className="font-semibold">{a.title}</div>
            <div className="text-sm text-gray-600">{a.alertDate}</div>
            <p className="mt-2">{a.message}</p>
            <div className="mt-2 text-sm text-gray-500">Disaster ID: {a.disasterId}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
