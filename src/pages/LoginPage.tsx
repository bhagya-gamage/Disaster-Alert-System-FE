import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const nav = useNavigate();
  const { setToken } = useAuth();

  const [email, setEmail] = useState("kasun@example.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await login({ email, password });
      setToken(res.token);
      nav("/");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Login failed");
    }
  }

  return (
    <div className="min-h-full grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded border bg-white p-6 space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div>
          <label className="text-sm">Email</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label className="text-sm">Password</label>
          <input type="password" className="mt-1 w-full border rounded px-3 py-2"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="w-full rounded bg-blue-600 text-white py-2">Sign in</button>

        <div className="text-sm">
          No account? <Link to="/register" className="text-blue-600 underline">Register</Link>
        </div>
      </form>
    </div>
  );
}
