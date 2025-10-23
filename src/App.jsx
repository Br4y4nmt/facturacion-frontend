import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

// 🔹 Páginas y rutas
import Login from "@/pages/auth/Login";
import PrivateRoute from "@/routes/PrivateRoute";
import SuperAdminLayout from "@/pages/superadmin/Layout";
import SuperAdminDashboard from "@/pages/superadmin/Dashboard";
import AdminLayout from "@/pages/adminempresa/Layout";
import AdminDashboard from "@/pages/adminempresa/Dashboard";

function App() {
  const { checkSession, loading, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Solo verificar sesión si:
    // 1. No estamos en proceso de logout
    // 2. No estamos en la página de login
    if (!sessionStorage.getItem('logging_out') && 
        window.location.pathname !== '/login') {
      checkSession();
    } else {
      // Si estamos en login o en proceso de logout, asegurarse de que loading sea false
      useAuthStore.setState({ loading: false });
    }
  }, []);

  // No mostrar pantalla de carga si estamos en login o en proceso de logout
  if (loading && !sessionStorage.getItem('logging_out') && 
      window.location.pathname !== '/login') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 text-lg font-semibold animate-pulse">
          Verificando sesión...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz - Redirige según rol */}
        <Route
          path="/"
          element={
            isAuthenticated && user ? (
              user.rolId === 1 ? (
                <Navigate to="/superadmin" replace />
              ) : user.rolId === 2 ? (
                <Navigate to="/adminempresa" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Ruta de login - Redirige si ya está autenticado */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={user?.rolId === 1 ? "/superadmin" : "/adminempresa"} />
            ) : (
              <Login />
            )
          }
        />

        {/* 🔹 SuperAdmin */}
        <Route element={<PrivateRoute rolesPermitidos={[1]} />}>
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="empresas" element={<div>Empresas</div>} />
          </Route>
        </Route>

        {/* 🔹 AdminEmpresa */}
        <Route element={<PrivateRoute rolesPermitidos={[2]} />}>
          <Route path="/adminempresa" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Ruta 404 - Redirige según autenticación */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to={user?.rolId === 1 ? "/superadmin" : "/adminempresa"} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
