import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";

export function RegisterPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "Kasun Perera",
    email: "kasun@example.com",
    password: "123456",
    phone: "0771234567",
  });
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      nav("/login");
    } catch (err: any) {
      setError(JSON.stringify(err?.response?.data ?? "Register failed"));
    }
  }

  return (
    <div className="min-h-full grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded border bg-white p-6 space-y-4">
        <h1 className="text-xl font-semibold">Register</h1>
        {error && <div className="text-sm text-red-600">{error}</div>}

        {(["name", "email", "password", "phone"] as const).map((k) => (
          <div key={k}>
            <label className="text-sm capitalize">{k}</label>
            <input
              type={k === "password" ? "password" : "text"}
              className="mt-1 w-full border rounded px-3 py-2"
              value={form[k]}
              onChange={(e) => setForm((s) => ({ ...s, [k]: e.target.value }))}
            />
          </div>
        ))}

        <button className="w-full rounded bg-blue-600 text-white py-2">Create account</button>
        <div className="text-sm">
          Have an account? <Link to="/login" className="text-blue-600 underline">Login</Link>
        </div>
      </form>
    </div>
  );
}
