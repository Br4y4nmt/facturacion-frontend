import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import logoFull from "@/assets/logos/innovasolution.webp";
import "./Sidebar.css";
import DashboardIcon from "@/components/icons/DashboardIcon";
import VentasIcon from "@/components/icons/VentasIcon";
import ClientesIcon from "@/components/icons/ClientesIcon";
import ConfigIcon from "@/components/icons/ConfigIcon";
import LogoutIcon from "@/components/icons/LogoutIcon";

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [openMenu, setOpenMenu] = React.useState(null);

  React.useEffect(() => {
    if (collapsed) setOpenMenu(null);
  }, [collapsed]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const icons = {
    dashboard: <DashboardIcon />,
    ventas: <VentasIcon />,
    clientes: <ClientesIcon />,
    config: <ConfigIcon />,
  };

  const menuItems = [
    {
      label: "DASHBOARD",
      path: user?.rolId === 1 ? "/superadmin" : "/adminempresa",
      icon: icons.dashboard,
    },
    {
      label: "VENTAS",
      icon: icons.ventas,
      submenu: [
        { label: "Comprobantes electronicos", path: "/ventas/comprobantes" },
        { label: "Notas de Venta", path: "/ventas/notas" },
        { label: "Cotizaciones", path: "/ventas/cotizaciones" },
      ],
    },
    {
      label: "CLIENTES",
      path: "/clientes",
      icon: icons.clientes,
    },
    {
      label: "Configuración",
      path: "/configuracion",
      icon: icons.config,
    },
  ];

  return (
    <aside
      className={`bg-[#1E293B] text-gray-100 h-screen flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex items-center justify-center px-4 py-5">
        <img
          src={logoFull}
          alt="LOGO"
          className={`object-contain transition-all duration-300 ${
            collapsed ? "w-10" : "w-32"
          }`}
        />
      </div>

      <nav className="flex-1 overflow-y-auto py-5">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const open = openMenu === item.label;
            const isActive = location.pathname === item.path;
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <li key={item.label}>
                <button
                  onClick={() => hasSubmenu && setOpenMenu(open ? null : item.label)}
                  className={`sidebar-button w-full flex items-center justify-between py-2 rounded-lg transition-all duration-200
                    ${collapsed ? "justify-center" : "px-4 gap-4"}
                    ${
                      open
                        ? "open bg-[#0C102A] text-white border border-[#2C3A52] border-t border-l border-r rounded-t-md"
                        : isActive
                        ? "bg-gradient-to-r from-[#3f87ff] to-[#0047ff] text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
                        : "text-gray-300 hover:-translate-x-[8px]"
                    } transition-transform duration-200 ease-in-out transform`}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-6 h-6">
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="text-[12px] font-normal font-[Montserrat] tracking-wide">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {!collapsed && hasSubmenu && (
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        open ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>

                {!collapsed && hasSubmenu && (
                  <ul
                    className={`sidebar-submenu bg-[#161D31] rounded-b-lg px-3 border-x border-b border-[#2C3A52] overflow-hidden transition-all duration-300 ease-in-out ${
                      open ? "max-h-40 py-[0px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.submenu.map((sub, idx) => (
                      <li key={idx}>
                        <Link
                          to={sub.path}
                          className="relative flex items-center text-[#E2E8F0] hover:text-white text-[13px] font-[Montserrat] py-[0.5px] px-3 rounded-md transition-transform duration-200 ease-in-out hover:translate-x-[6px] before:content-['◦'] before:mr-[6px] before:text-[#E2E8F0] hover:before:text-white before:text-[23px]"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-4"
          } text-sm text-red-400 hover:text-red-300 transition-colors`}
        >
          <span className="flex items-center justify-center w-6 h-6">
            <LogoutIcon />
          </span>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
