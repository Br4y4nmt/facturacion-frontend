import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import PrivateRoute from "@/routes/PrivateRoute";
import Login from "@/pages/auth/Login";
import SuperAdminLayout from "@/pages/superadmin/Layout";
import SuperAdminDashboard from "@/pages/superadmin/Dashboard";
import AdminLayout from "@/pages/adminempresa/Layout";
import AdminDashboard from "@/pages/adminempresa/Dashboard";

export default function App() {
  const { checkAuth, isAuthenticated, user, loading } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Valida cookie en el backend
  }, [checkAuth]);

  const getDefaultRoute = () => {
    if (!isAuthenticated || !user) return "/login";
    switch (user.rolId) {
      case 1:
        return "/superadmin";
      case 2:
        return "/adminempresa";
      default:
        return "/home";
    }
  };

  // Espera mientras se valida la sesión
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm font-[Montserrat]">
          Verificando sesión...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute()} replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/superadmin"
          element={<PrivateRoute rolesPermitidos={[1]} />}
        >
          <Route element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="empresas" element={<div>Empresas</div>} />
          </Route>
        </Route>

        <Route
          path="/adminempresa"
          element={<PrivateRoute rolesPermitidos={[2]} />}
        >
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
