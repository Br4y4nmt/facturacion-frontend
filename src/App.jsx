import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import PrivateRoute from "@/routes/PrivateRoute";
import Login from "@/pages/auth/Login";
import SuperAdminLayout from "@/pages/superadmin/Layout";
import SuperAdminDashboard from "@/pages/superadmin/Dashboard";
import AdminLayout from "@/pages/adminempresa/Layout";
import AdminDashboard from "@/pages/adminempresa/Dashboard";
import Clientes from "@/pages/adminempresa/Clientes";
import Empresas from "@/pages/superadmin/Empresas";
import Suscripciones from "@/pages/superadmin/Suscripciones";



export default function App() {
  const { checkAuth, isAuthenticated, user, checking  } = useAuthStore();

  useEffect(() => {
    checkAuth(); 
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

  if (checking) {
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
            <Route path="empresas/*" element={<Empresas />} />
            <Route path="suscripciones/*" element={<Suscripciones />} />
          </Route>
        </Route>

        <Route
          path="/adminempresa"
          element={<PrivateRoute rolesPermitidos={[2]} />}
        >
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="clientes" element={<Clientes />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
