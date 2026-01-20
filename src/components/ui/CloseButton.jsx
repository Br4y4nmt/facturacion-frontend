import React from "react";

export default function CloseButton({ onClick, children = "Cerrar", className = "", style = {}, fontFamily }) {
  const defaultFont = fontFamily || 'Montserrat, Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
  return (
    <button
      onClick={onClick}
      type="button"
      className={`px-3 py-2 rounded-sm bg-[#424B52] hover:bg-[#212529] text-white transition shadow-sm text-sm font-medium ${className}`}
      style={{ fontFamily: defaultFont, ...style }}
    >
      {children}
    </button>
  );
}
