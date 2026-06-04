import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function NavBar() {
  const { roles, logout } = useAuth();
  const isAdmin = roles.includes("ADMIN");

  return (
    <div className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link to="/" className="font-semibold">Disaster Alert</Link>

        <Link to="/alerts" className="text-sm">Alerts</Link>
        <Link to="/disasters" className="text-sm">Disasters</Link>
        <Link to="/sos" className="text-sm">SOS</Link>
        <Link to="/map" className="text-sm">Map</Link>

        {isAdmin && (
          <>
            <Link to="/admin/users" className="text-sm">Admin Users</Link>
            <Link to="/admin/alerts" className="text-sm">Create Alert</Link>
            <Link to="/admin/disasters" className="text-sm">Admin Disasters</Link>
          </>
        )}

        <div className="flex-1" />
        <button onClick={logout} className="text-sm px-3 py-1 rounded bg-gray-900 text-white">
          Logout
        </button>
      </div>
    </div>
  );
}
