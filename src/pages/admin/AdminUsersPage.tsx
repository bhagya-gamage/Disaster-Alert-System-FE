import { useEffect, useState } from "react";
import type { User } from "../../types/models";
import { deleteUser, listUsers, updateUserRole } from "../../api/adminUsers";

const ROLES: User["role"][] = ["CITIZEN", "SHELTER_MANAGER", "EMERGENCY_TEAM", "ADMIN"];

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function refresh() {
    setError(null);
    const data = await listUsers();
    setUsers(data);
  }

  useEffect(() => {
    refresh().catch((e) => setError(e?.response?.data?.message ?? "Failed to load users"));
  }, []);

  async function onChangeRole(userId: number, role: User["role"]) {
    setBusyId(userId);
    setError(null);
    try {
      await updateUserRole(userId, role);
      await refresh();
    } catch (e: any) {
      setError(JSON.stringify(e?.response?.data ?? "Role update failed"));
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(userId: number) {
    if (!confirm("Delete this user?")) return;
    setBusyId(userId);
    setError(null);
    try {
      await deleteUser(userId);
      await refresh();
    } catch (e: any) {
      setError(JSON.stringify(e?.response?.data ?? "Delete failed"));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="text-xl font-semibold mb-4">Admin – Users</h1>
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <div className="overflow-x-auto border rounded bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone}</td>
                <td className="p-3">
                  <select
                    className="border rounded px-2 py-1"
                    value={u.role}
                    disabled={busyId === u.id}
                    onChange={(e) => onChangeRole(u.id, e.target.value as User["role"])}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <button
                    className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-60"
                    disabled={busyId === u.id}
                    onClick={() => onDelete(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!users.length && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={6}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
