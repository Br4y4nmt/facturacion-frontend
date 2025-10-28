import { useState } from "react";
import SidebarAdmin from "@/components/layout/SidebarAdmin";
import HeaderAdmin from "@/components/layout/HeaderAdmin";

export default function LayoutAdmin({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1 transition-all duration-300">
        <HeaderAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
