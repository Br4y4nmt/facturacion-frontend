import React from "react";
import { Link } from "react-router-dom";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon"; 

export default function SidebarItem({
  item,
  collapsed,
  isActive,
  open,
  onToggle,
}) {
  const hasSubmenu = !!item.submenu?.length;

  const buttonClass = `
    sidebar-button w-full flex items-center justify-between py-2 rounded-lg transition-all duration-200
    ${collapsed ? "justify-center" : "px-4 gap-4"}
    ${
      open
        ? "open bg-[#0C102A] text-white border border-[#2C3A52] border-t border-l border-r rounded-t-md"
        : isActive
        ? "bg-gradient-to-r from-[#3f87ff] to-[#0047ff] text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
        : "text-gray-300 hover:-translate-x-[8px]"
    }
    transition-transform duration-200 ease-in-out transform
  `;

  const Content = (
    <>
      <div className="flex items-center gap-4">
        <span className="flex items-center justify-center w-6 h-6">{item.icon}</span>
        {!collapsed && (
          <span className="text-[12px] font-normal font-[Montserrat] tracking-wide">
            {item.label}
          </span>
        )}
      </div>

      {!collapsed && hasSubmenu && (
        <span className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}>
          <ChevronRightIcon className="w-4 h-4" />
        </span>
      )}
    </>
  );

  return (
    <li>
      {hasSubmenu ? (
        <button onClick={onToggle} className={buttonClass}>
          {Content}
        </button>
      ) : (
        <Link to={item.path} className={buttonClass}>
          {Content}
        </Link>
      )}

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
}
