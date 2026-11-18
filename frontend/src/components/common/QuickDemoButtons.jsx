import React from "react";
import { GraduationCap, Stethoscope, Users, ShieldAlert, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export const QuickDemoButtons = ({ onSelect = null }) => {
  const { quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async (rol) => {
    if (onSelect) {
      onSelect(rol);
      return;
    }

    try {
      await quickDemoLogin(rol);
      if (rol === "DOCENTE") navigate("/dashboard/docente");
      else if (rol === "TERAPEUTA") navigate("/dashboard/terapeuta");
      else if (rol === "FAMILIAR") navigate("/dashboard/familiar");
      else if (rol === "ADMIN") navigate("/dashboard/admin");
    } catch (err) {
      console.error("Error al iniciar sesión por rol:", err);
    }
  };

  return (
    <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "14px", border: "1px dashed #cbd5e1" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.825rem", fontWeight: "700", color: "#475569", marginBottom: "0.75rem" }}>
        <Sparkles size={16} color="#2563eb" />
        <span>Acceso Directo por Rol (1 Clic)</span>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={() => handleDemoClick("DOCENTE")}
          className="btn btn-secondary btn-sm"
          style={{ borderLeft: "4px solid var(--docente-color)", justifyContent: "flex-start", textAlign: "left" }}
        >
          <GraduationCap size={16} color="var(--docente-color)" />
          <span>Rol Docente</span>
        </button>

        <button
          type="button"
          onClick={() => handleDemoClick("TERAPEUTA")}
          className="btn btn-secondary btn-sm"
          style={{ borderLeft: "4px solid var(--terapeuta-color)", justifyContent: "flex-start", textAlign: "left" }}
        >
          <Stethoscope size={16} color="var(--terapeuta-color)" />
          <span>Rol Terapeuta</span>
        </button>

        <button
          type="button"
          onClick={() => handleDemoClick("FAMILIAR")}
          className="btn btn-secondary btn-sm"
          style={{ borderLeft: "4px solid var(--familiar-color)", justifyContent: "flex-start", textAlign: "left" }}
        >
          <Users size={16} color="var(--familiar-color)" />
          <span>Familiar / Tutor</span>
        </button>

        <button
          type="button"
          onClick={() => handleDemoClick("ADMIN")}
          className="btn btn-secondary btn-sm"
          style={{ borderLeft: "4px solid var(--admin-color)", justifyContent: "flex-start", textAlign: "left" }}
        >
          <ShieldAlert size={16} color="var(--admin-color)" />
          <span>Administrador</span>
        </button>
      </div>
    </div>
  );
};

export default QuickDemoButtons;
