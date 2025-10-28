import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
  Bell,
  User,
  LogOut,
  CreditCard,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function Header({ collapsed, setCollapsed }) {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Cierra el menú si haces clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
const handleLogout = async () => {
  await logout();
  window.location.href = "/login"; // o usa navigate("/login", { replace: true });
};

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-[64px] px-6 flex items-center justify-between font-[Montserrat] relative">
      {/* 🔹 Lado izquierdo: Botón toggle + botones rápidos */}
      <div className="flex items-center gap-2">
        {/* Botón para colapsar/desplegar Sidebar */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2.5 ml-[-20px] rounded-md text-[#60769a] bg-transparent hover:bg-gray-100/60 transition-all duration-300"
        >
          {collapsed ? <ChevronRight size={25} /> : <ChevronLeft size={25} />}
        </button>

        {/* Botones rectangulares */}
        {["+ NC", "+ POS", "+ ME", "⋯"].map((label, i) => {
          const [symbol, text] = label.split(" ");
          const isEdit = label === "⋯";
          return (
            <button
              key={i}
              className="h-[52px] w-[53px] flex flex-col items-center justify-center bg-gray-50 hover:bg-[#0F172A] hover:text-white text-[#60769a] font-[Montserrat] font-bold text-[13px] rounded-[10px] border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-300 leading-tight"
            >
              {isEdit ? (
                <>
                  <i className="fas fa-fw fa-pen text-[12px] mb-[2px]" />
                  <span className="text-[14px] font-bold">⋯</span>
                </>
              ) : (
                <>
                  <span className="text-[18px] leading-none">{symbol}</span>
                  <span className="text-[13px] font-bold mt-[2px]">{text}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* 🔹 Lado derecho: Toggle PROD + Iconos y usuario */}
      <div className="flex items-center gap-6" ref={menuRef}>
        {/* Toggle PROD */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center w-10 h-5 bg-green-500 rounded-full shadow-inner pl-[2px]">
            <div className="w-4 h-4 bg-white rounded-full shadow transition-all"></div>
          </div>
          <span className="text-sm font-medium text-[#60769a]">PROD</span>
        </div>

        {/* Ícono carrito */}
        <div className="relative cursor-pointer text-[#60769a]">
          <ShoppingCart size={20} />
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-semibold rounded-full px-[4px] py-[1px]">
            0
          </span>
        </div>

        {/* Ícono notificaciones */}
        <div className="relative cursor-pointer text-[#60769a]">
          <Bell size={20} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-semibold rounded-full px-[5px] py-[1px]">
            7
          </span>
        </div>

        {/* Usuario */}
        <div
          className="flex items-center gap-2 text-right cursor-pointer select-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div>
            <p className="text-[12px] font-semibold text-[#60769a] leading-tight">
              {user?.nombre || "CESAR PAUL VARA TORATTO"}
            </p>
            <p className="text-[11px] text-[#60769a] leading-tight">
              {user?.email || "ssstic@gmail.com"}
            </p>
          </div>
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 border border-gray-300">
            <User size={16} className="text-[#60769a]" />
          </div>
        </div>

        {/* 🔽 Menú desplegable */}
       {menuOpen && (
  <div className="absolute right-4 top-[60px] w-52 bg-white rounded-lg shadow-lg z-50 py-2.5 animate-fadeIn">
    <button className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#8a8f9a] hover:bg-[#283046] hover:text-white transition-all">
      <i className="fas fa-dollar-sign text-[13px] text-[#8a8f9a] group-hover:text-white"></i>
      <span>Mis Pagos</span>
    </button>

    <hr className="my-1.5 border-gray-200" />

    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#8a8f9a] hover:bg-[#283046] hover:text-white transition-all"
    >
      <i className="fas fa-power-off text-[13px] text-[#8a8f9a]"></i>
      <span>Salir</span>
    </button>
  </div>
)}


      </div>
    </header>
  );
}
