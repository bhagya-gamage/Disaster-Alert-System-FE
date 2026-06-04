import { useMemo, useState } from "react";
import type { EmergencyRequest } from "../types/models";
import { createSOS, mySOS, allSOS, updateSOSStatus } from "../api/sos";
import { useAuth } from "../auth/AuthContext";

const STATUSES: EmergencyRequest["status"][] = [
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESCUED",
  "CANCELLED",
];

export function SosPage() {
  const { roles } = useAuth();
  const isCitizen = roles.includes("CITIZEN");
  const isTeamOrAdmin = roles.includes("EMERGENCY_TEAM") || roles.includes("ADMIN");

  const [createForm, setCreateForm] = useState({
    location: "6.9271, 79.8612",
    requestType: "Medical Emergency",
  });

  const [myList, setMyList] = useState<EmergencyRequest[]>([]);
  const [allList, setAllList] = useState<EmergencyRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const canSeeAnything = isCitizen || isTeamOrAdmin;

  const visibleMy = useMemo(() => myList.slice().sort((a, b) => b.id - a.id), [myList]);
  const visibleAll = useMemo(() => allList.slice().sort((a, b) => b.id - a.id), [allList]);

  async function refreshMine() {
    setError(null);
    try {
      const data = await mySOS();
      setMyList(data);
    } catch (e: any) {
      setError(JSON.stringify(e?.response?.data ?? "Failed to load my SOS"));
    }
  }

  async function refreshAll() {
    setError(null);
    try {
      const data = await allSOS();
      setAllList(data);
    } catch (e: any) {
      setError(JSON.stringify(e?.response?.data ?? "Failed to load all SOS"));
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy("create");
    setError(null);
    try {
      await createSOS(createForm);
      await refreshMine();
    } catch (err: any) {
      setError(JSON.stringify(err?.response?.data ?? "Create SOS failed"));
    } finally {
      setBusy(null);
    }
  }

  async function onUpdateStatus(id: number, status: EmergencyRequest["status"]) {
    setBusy(`status-${id}`);
    setError(null);
    try {
      await updateSOSStatus(id, status);
      await refreshAll();
    } catch (err: any) {
      setError(JSON.stringify(err?.response?.data ?? "Update status failed"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      <h1 className="text-xl font-semibold">SOS Requests</h1>

      {error && <div className="text-sm text-red-600">{error}</div>}

      {!canSeeAnything && (
        <div className="border rounded bg-white p-4 text-sm">
          You don’t have permission to use SOS features. Your role must be CITIZEN, EMERGENCY_TEAM, or ADMIN.
        </div>
      )}

      {isCitizen && (
        <div className="border rounded bg-white p-4">
          <h2 className="font-semibold mb-3">Create SOS (Citizen)</h2>
          <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm">Location ("lat, lng")</label>
              <input
                className="mt-1 w-full border rounded px-3 py-2"
                value={createForm.location}
                onChange={(e) => setCreateForm((s) => ({ ...s, location: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm">Request Type</label>
              <input
                className="mt-1 w-full border rounded px-3 py-2"
                value={createForm.requestType}
                onChange={(e) => setCreateForm((s) => ({ ...s, requestType: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-60"
                disabled={busy === "create"}
              >
                Create
              </button>
              <button
                type="button"
                className="rounded bg-gray-900 text-white px-4 py-2 disabled:opacity-60"
                disabled={busy === "mine"}
                onClick={() => {
                  setBusy("mine");
                  refreshMine().finally(() => setBusy(null));
                }}
              >
                Refresh My SOS
              </button>
            </div>
          </form>
        </div>
      )}

      {isCitizen && (
        <div className="border rounded bg-white p-4">
          <h2 className="font-semibold mb-3">My SOS Requests</h2>
          <div className="space-y-2">
            {visibleMy.map((r) => (
              <div key={r.id} className="border rounded p-3">
                <div className="font-semibold">SOS #{r.id}</div>
                <div className="text-sm text-gray-600">{r.requestType}</div>
                <div className="text-sm">Location: {r.location}</div>
                <div className="text-sm">Status: {r.status}</div>
              </div>
            ))}
            {!visibleMy.length && <div className="text-sm text-gray-500">No SOS requests yet.</div>}
          </div>
        </div>
      )}

      {isTeamOrAdmin && (
        <div className="border rounded bg-white p-4">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-semibold">All SOS Requests (Team/Admin)</h2>
            <button
              className="ml-auto rounded bg-gray-900 text-white px-4 py-2 disabled:opacity-60"
              disabled={busy === "all"}
              onClick={() => {
                setBusy("all");
                refreshAll().finally(() => setBusy(null));
              }}
            >
              Refresh All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {visibleAll.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">{r.id}</td>
                    <td className="p-3">{r.requestType}</td>
                    <td className="p-3">{r.location}</td>
                    <td className="p-3">{r.status}</td>
                    <td className="p-3">
                      <select
                        className="border rounded px-2 py-1"
                        value={r.status}
                        disabled={busy === `status-${r.id}`}
                        onChange={(e) => onUpdateStatus(r.id, e.target.value as EmergencyRequest["status"])}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}

                {!visibleAll.length && (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={5}>
                      No SOS requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
