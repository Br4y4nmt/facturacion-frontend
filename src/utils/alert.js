import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Configuración base con tu estilo corporativo
const baseConfig = {
  confirmButtonColor: "#3B82F6", 
  cancelButtonColor: "#EF4444", 
  background: "#ffffff",
  color: "#333333",
  customClass: {
    popup: "rounded-xl shadow-lg",
    title: "font-semibold text-gray-800",
  },
};

// Éxito
export const showSuccess = (title, text = "") => {
  return Swal.fire({
    ...baseConfig,
    icon: "success",
    title,
    text,
  });
};

// Error
export const showError = (title, text = "") => {
  return Swal.fire({
    ...baseConfig,
    icon: "error",
    title,
    text,
  });
};

// Info
export const showInfo = (title, text = "") => {
  return Swal.fire({
    ...baseConfig,
    icon: "info",
    title,
    text,
  });
};

// Confirmación
export const showConfirm = async (title, text = "") => {
  const result = await Swal.fire({
    ...baseConfig,
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  });
  return result.isConfirmed;
};

// Alerta de bloqueo o error crítico (NO TOCADA)
export const showBlockAlert = (title, text = "") => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#3B82F6",
    background: "#ffffff",
    color: "#333333",
    customClass: {
      popup: "rounded-xl shadow-lg",
      title: "font-semibold text-gray-800",
      confirmButton: "px-6 py-2",
    },
  });
};

// Toast corporativo BryanDev (fondo blanco, iconos clásicos)
export const showToast = (icon = "info", title = "", position = "bottom-end") => {
  const iconColors = {
    success: "#22c55e", 
    error: "#ef4444",   
    warning: "#f59e0b", 
    info: "#3b82f6",   
  };

  return Swal.fire({
    toast: true,
    position,
    icon,
    title,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: "#ffffff",
    color: "#333333",
    iconColor: iconColors[icon] || "#3b82f6",
    customClass: {
      popup: "rounded-lg shadow-md border border-gray-100 backdrop-blur-sm",
      title: "font-semibold tracking-wide text-gray-700 text-sm",
    },
    didOpen: (toast) => {
      const progressBar = toast.querySelector(".swal2-timer-progress-bar");
      if (progressBar)
        progressBar.style.background = iconColors[icon] || "#3b82f6";
    },
  });
};

// Toast de bienvenida (inferior derecha, moderno y elegante)
export const showWelcomeAlert = (nombre = "USUARIO") => {
  const toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    showCloseButton: true,
    timer: 3000,
    timerProgressBar: true,
    background: "#ffffff",
    color: "#333333",
    iconColor: "#22c55e",
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  toast.fire({
    icon: "success",
    title: `Bienvenido ${nombre}`,
  });
};


