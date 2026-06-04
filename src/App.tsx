import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { RequireAuth } from "./routes/RequireAuth";
import { RequireRole } from "./routes/RequireRole";
import { NavBar } from "./components/NavBar";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AlertsPage } from "./pages/AlertsPage";
import { DisastersPage } from "./pages/DisastersPage";
import { SheltersPage } from "./pages/SheltersPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { MapPage } from "./pages/MapPage";
import { SosPage } from "./pages/SosPage";
import { AdminCreateAlertPage } from "./pages/admin/AdminCreateAlertPage";
import { AdminDisastersPage } from "./pages/admin/AdminDisastersPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { ShelterManagerPage } from "./pages/manager/ShelterManagerPage";

function AppLayout() {
  return (
    <div className="min-h-full bg-gray-50">
      <NavBar />
      <Outlet />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/alerts" replace />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/disasters" element={<DisastersPage />} />
            <Route path="/shelters" element={<SheltersPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/sos" element={<SosPage />} />
            <Route path="/map" element={<MapPage />} />

            <Route element={<RequireRole anyOf={["ADMIN"]} />}>
              <Route path="/admin/alerts" element={<AdminCreateAlertPage />} />
              <Route path="/admin/disasters" element={<AdminDisastersPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>

            <Route element={<RequireRole anyOf={["SHELTER_MANAGER", "ADMIN"]} />}>
              <Route path="/manager/shelters" element={<ShelterManagerPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
