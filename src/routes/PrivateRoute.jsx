import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

/**
 * PrivateRoute protege rutas que requieren autenticación.
 * Opcionalmente puede restringir el acceso por rol.
 *
 * @param {Array<number>} rolesPermitidos - Lista de IDs de rol que pueden acceder (ej: [1, 2])
 */
export default function PrivateRoute({ rolesPermitidos = [] }) {
  const { user, token } = useAuthStore();

  // 1️⃣ Verifica si el usuario está logueado
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Si se especificaron roles permitidos, verificamos acceso
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(user.rolId)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Acceso denegado
          </h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta sección.
          </p>
        </div>
      </div>
    );
  }

  // 3️⃣ Si pasa las validaciones, renderiza la ruta interna
  return <Outlet />;
}
