import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "./routes/RequireAuth";
import { RequireRole } from "./routes/RequireRole";
import { NavBar } from "./components/NavBar";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AlertsPage } from "./pages/AlertsPage";
import { MapPage } from "./pages/MapPage";
import { AdminCreateAlertPage } from "./pages/admin/AdminCreateAlertPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<RequireAuth />}>
          <Route
            element={
              <div className="min-h-full bg-gray-50">
                <NavBar />
              </div>
            }
          >
            <Route path="/" element={<Navigate to="/alerts" replace />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/map" element={<MapPage />} />

            <Route element={<RequireRole anyOf={["ADMIN"]} />}>
              <Route path="/admin/alerts" element={<AdminCreateAlertPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
