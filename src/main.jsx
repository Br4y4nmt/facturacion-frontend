import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";

// 👇 Elimina StrictMode para evitar doble ejecución de efectos
createRoot(document.getElementById("root")).render(
  //<StrictMode>
    <App />
  //</StrictMode>
);
