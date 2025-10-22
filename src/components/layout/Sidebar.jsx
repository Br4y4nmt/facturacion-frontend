import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-gray-100 h-screen flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">Mi Sistema</h2>

      <nav className="flex flex-col gap-2">
        <Link to="/superadmin" className="hover:bg-gray-700 px-3 py-2 rounded">🏠 Dashboard</Link>
        <Link to="/superadmin/empresas" className="hover:bg-gray-700 px-3 py-2 rounded">🏢 Empresas</Link>
        <Link to="/admin/clientes" className="hover:bg-gray-700 px-3 py-2 rounded">👥 Clientes</Link>
        <Link to="/admin/ventas" className="hover:bg-gray-700 px-3 py-2 rounded">🧾 Ventas</Link>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          className="text-sm text-red-400 hover:text-red-300"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
