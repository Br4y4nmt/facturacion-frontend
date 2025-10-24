import { ChevronRight, ChevronLeft, ShoppingCart, Bell, User } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function Header({ collapsed, setCollapsed }) {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-[64px] px-6 flex items-center justify-between font-[Montserrat]">
      {/* 🔹 Lado izquierdo: Botón toggle + botones rápidos */}
      <div className="flex items-center gap-2">
        {/* Botón para colapsar/desplegar Sidebar */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 shadow-sm transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Botones rectangulares */}
        <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#1E40AF] font-semibold text-sm px-3 py-2 rounded-md shadow-sm transition-all">
          + NC
        </button>
        <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#1E40AF] font-semibold text-sm px-3 py-2 rounded-md shadow-sm transition-all">
          + POS
        </button>
        <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#1E40AF] font-semibold text-sm px-3 py-2 rounded-md shadow-sm transition-all">
          + ME
        </button>
        <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#1E40AF] font-semibold text-sm px-3 py-2 rounded-md shadow-sm transition-all">
          ⋯
        </button>

        {/* Separador */}
        <div className="h-6 w-px bg-gray-300 mx-3"></div>

        {/* Toggle PROD */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">PROD</span>
          <div className="relative inline-flex items-center w-10 h-5 bg-green-500 rounded-full shadow-inner">
            <div className="w-4 h-4 bg-white rounded-full shadow absolute left-[20px] transition-all"></div>
          </div>
        </div>
      </div>

      {/* 🔹 Lado derecho: Iconos y usuario */}
      <div className="flex items-center gap-6">
        {/* Ícono carrito */}
        <div className="relative cursor-pointer text-gray-600 hover:text-blue-600 transition-colors">
          <ShoppingCart size={20} />
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-semibold rounded-full px-[4px] py-[1px]">
            0
          </span>
        </div>

        {/* Ícono notificaciones */}
        <div className="relative cursor-pointer text-gray-600 hover:text-blue-600 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-semibold rounded-full px-[5px] py-[1px]">
            7
          </span>
        </div>

        {/* Usuario */}
        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="text-sm font-semibold text-gray-700 leading-tight">
              {user?.nombre || "CESAR PAUL VARA TORATTO"}
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              {user?.email || "ssstic@gmail.com"}
            </p>
          </div>
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 border border-gray-300">
            <User size={16} className="text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
