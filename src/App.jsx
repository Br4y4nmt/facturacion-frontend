import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import PrivateRoute from "@/routes/PrivateRoute";
import SuperAdminLayout from "@/pages/superadmin/Layout";
import SuperAdminDashboard from "@/pages/superadmin/Dashboard";
import AdminLayout from "@/pages/adminempresa/Layout";
import AdminDashboard from "@/pages/adminempresa/Dashboard";
import Clientes from "@/pages/adminempresa/Clientes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* SuperAdmin */}
        <Route element={<PrivateRoute rolesPermitidos={[1]} />}>
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="empresas" element={<div>Empresas</div>} />
          </Route>
        </Route>

        {/* AdminEmpresa */}
        <Route element={<PrivateRoute rolesPermitidos={[2]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="clientes" element={<Clientes />} />
          </Route>
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
