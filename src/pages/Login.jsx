import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import EcommerceImage from "@/assets/Logo3.png";

export default function Login() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      window.location.href = "/home";
    } catch {
      setError("Credenciales inválidas. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* 🔹 Columna izquierda (imagen) */}
      <div className="hidden lg:flex w-2/3 h-screen overflow-hidden items-center justify-center bg-white">
        <img
          src={EcommerceImage}
          alt="Ilustración"
          className="w-auto max-w-none h-[110vh] object-contain"
        />
      </div>

      {/* 🔹 Columna derecha (formulario) */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/3 bg-white shadow-xl relative z-10">
        <div className="w-full max-w-xl px-12 py-10">
          {/* Encabezado */}
          <h2 className="text-2xl font-normal text-[#6A647D] tracking-wide text-center mb-1 font-[Montserrat]">
            BIENVENIDO A
          </h2>
          <h3 className="text-lg font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 mb-6 font-[Montserrat]">
            CORPORACION SSSTIC E.I.R.L
          </h3>

          <p className="text-center text-gray-500 mb-8 font-[Montserrat]">
            Ingresa a tu cuenta
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center text-sm font-[Montserrat]">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-5 font-[Montserrat]">
            {/* Campo de correo */}
            <div>
              <label className="block text-[#6A647D] text-sm font-normal mb-1 font-[Montserrat]">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-md p-2.5 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 focus:border-[#3B82F6]/40 shadow-sm transition-all duration-200"
                required
              />
            </div>

            {/* Campo de contraseña */}
            <div>
              <div className="flex justify-between items-center mb-2">
              <label className="block text-[#6A647D] text-sm font-normal mb-1 font-[Montserrat]">
                  Contraseña
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                >
                  ¿Has olvidado tu contraseña?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-md p-2.5 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 focus:border-[#3B82F6]/40 shadow-sm transition-all duration-200"
                required
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-2.5 rounded-md transition duration-300 shadow-md bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500"
            >
              {loading ? "Ingresando..." : "INICIAR SESIÓN"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-8 font-[Montserrat]">
            © {new Date().getFullYear()} BRYAN MEDINA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
