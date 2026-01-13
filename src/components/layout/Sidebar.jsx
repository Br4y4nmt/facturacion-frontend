import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { 
  Building2, 
  MapPin, 
  ShieldCheck,
  CreditCard,
  BarChart3,
  Activity,
  Settings,
  Package,
  Receipt,
  History,
  FileText,
  TrendingUp,
  PieChart,
  Gauge,
  AlertCircle,
  Bell,
  Server,
  Database,
  Mail,
  Wrench
} from "lucide-react";
import logoFull from "@/assets/logos/innovasolution.webp";
import "./Sidebar.css";
import DashboardIcon from "@/components/icons/DashboardIcon";
import VentasIcon from "@/components/icons/VentasIcon";
import ClientesIcon from "@/components/icons/ClientesIcon";
import ConfigIcon from "@/components/icons/ConfigIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [openMenu, setOpenMenu] = React.useState(null);

  const icons = {
    dashboard: <DashboardIcon className="w-5 h-5 shrink-0" />,
    empresas: <Building2 className="w-5 h-5 shrink-0" />,
    ventas: <VentasIcon className="w-5 h-5 shrink-0" />,
    clientes: <ClientesIcon className="w-5 h-5 shrink-0" />,
    config: <ConfigIcon className="w-5 h-5 shrink-0" />,
    locales: <MapPin className="w-5 h-5 shrink-0" />,
    roles: <ShieldCheck className="w-5 h-5 shrink-0" />,
    suscripciones: <CreditCard className="w-5 h-5 shrink-0" />,
    reportes: <BarChart3 className="w-5 h-5 shrink-0" />,
    monitoreo: <Activity className="w-5 h-5 shrink-0" />,
    configuracion: <Settings className="w-5 h-5 shrink-0" />,
  };

  const menuItems = React.useMemo(
    () => [
      {
        label: "DASHBOARD",
        path: user?.rolId === 1 ? "/superadmin" : "/adminempresa",
        icon: icons.dashboard,
      },

      ...(user?.rolId === 1
        ? [
            {
              label: "EMPRESAS",
              icon: icons.empresas,
              submenu: [
                { label: "Lista de Empresas", path: "/superadmin/empresas", exact: true },
                { label: "Locales / Puntos de Emisión", path: "/superadmin/empresas/locales" },
                { label: "Usuarios por Empresa", path: "/superadmin/empresas/usuarios" },
                { label: "Configuración Fiscal", path: "/superadmin/empresas/configuracion" },
                { label: "Series y Numeración", path: "/superadmin/empresas/series" },
                { label: "Estado SUNAT", path: "/superadmin/empresas/sunat" },
                { label: "Auditoría / Estado", path: "/superadmin/empresas/auditoria" },
                { label: "Roles y Permisos", path: "/superadmin/empresas/roles" },
              ],
            },

            {
              label: "SUSCRIPCIONES",
              icon: icons.suscripciones,
              submenu: [
                { label: "Planes de Servicio", path: "/superadmin/suscripciones/planes" },
                { label: "Suscripciones Activas", path: "/superadmin/suscripciones/activas" },
                { label: "Historial de Pagos", path: "/superadmin/suscripciones/pagos" },
                { label: "Facturas del Sistema", path: "/superadmin/suscripciones/facturas" },
              ],
            },
            {
              label: "REPORTES",
              icon: icons.reportes,
              submenu: [
                { label: "Ingresos del Sistema", path: "/superadmin/reportes/ingresos" },
                { label: "Empresas por Plan", path: "/superadmin/reportes/empresas-plan" },
                { label: "Uso del Sistema", path: "/superadmin/reportes/uso" },
                { label: "Métricas SUNAT", path: "/superadmin/reportes/sunat" },
              ],
            },
            {
              label: "MONITOREO",
              icon: icons.monitoreo,
              submenu: [
                { label: "Actividad Global", path: "/superadmin/monitoreo/actividad" },
                { label: "Errores del Sistema", path: "/superadmin/monitoreo/errores" },
                { label: "Alertas", path: "/superadmin/monitoreo/alertas" },
                { label: "Estado de Servicios", path: "/superadmin/monitoreo/servicios" },
              ],
            },
            {
              label: "CONFIGURACIÓN",
              icon: icons.configuracion,
              submenu: [
                { label: "Catálogos SUNAT", path: "/superadmin/configuracion/catalogos" },
                { label: "Parámetros Globales", path: "/superadmin/configuracion/parametros" },
                { label: "Correos del Sistema", path: "/superadmin/configuracion/correos" },
                { label: "Mantenimiento", path: "/superadmin/configuracion/mantenimiento" },
              ],
            },
          ]
        : []),

      ...(user?.rolId !== 1
        ? [
            {
              label: "VENTAS",
              icon: icons.ventas,
              submenu: [
                { label: "Comprobantes electrónicos", path: "/ventas/comprobantes" },
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
              label: "CONFIGURACIÓN",
              path: "/configuracion",
              icon: icons.config,
            },
          ]
        : []),
    ],
    [user?.rolId]
  );

  React.useEffect(() => {
    if (collapsed) {
      setOpenMenu(null);
      return;
    }

    const currentPath = location.pathname;

    const menuWithCurrentPath = menuItems.find((item) => {
      if (item.submenu) {
        return item.submenu.some((sub) =>
          sub.exact ? currentPath === sub.path : currentPath.startsWith(sub.path)
        );
      }
      return false;
    });

    if (menuWithCurrentPath) {
      setOpenMenu(menuWithCurrentPath.label);
    }
  }, [location.pathname, collapsed, menuItems]);

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
            collapsed ? "w-32" : "w-68"
          }`}
        />
      </div>

      <nav className="flex-1 overflow-y-auto py-5">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            const isActive =
              (!hasSubmenu && location.pathname === item.path) ||
              (hasSubmenu &&
                item.submenu.some((s) =>
                  s.exact
                    ? location.pathname === s.path
                    : location.pathname.startsWith(s.path)
                ));

            const open = openMenu === item.label;

            return (
              <li key={item.label}>
                <button
                  onClick={() => {
                    if (hasSubmenu) {
                      setOpenMenu(open ? null : item.label);
                    } else if (item.path) {
                      navigate(item.path);
                    }
                  }}
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
                    <ChevronRightIcon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        open ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </button>

                {!collapsed && hasSubmenu && (
                  <ul
                    className={`sidebar-submenu bg-[#161D31] rounded-b-lg px-3 border-x border-b border-[#2C3A52] overflow-hidden transition-all duration-300 ease-in-out ${
                      open ? "max-h-[1000px] py-2 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.submenu.map((sub, idx) => {
                      const subActive = sub.exact
                        ? location.pathname === sub.path
                        : location.pathname.startsWith(sub.path);

                      return (
                        <li key={idx}>
                          <Link
                            to={sub.path}
                            className={`relative flex items-center text-[13px] font-[Montserrat] py-[3px] px-3 rounded-md transition-all duration-200 ease-in-out before:mr-[6px] before:text-[23px]
                              ${
                                subActive
                                  ? "bg-[#0B1437] text-white font-semibold before:content-['●'] before:text-white"
                                  : "text-[#E2E8F0] hover:text-white before:content-['◦'] before:text-[#E2E8F0] hover:before:text-white hover:translate-x-[6px]"
                              }`}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
