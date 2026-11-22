import React, { useState } from "react";
import { ChevronDown, ChevronUp, Stethoscope, Brain, CheckCircle2 } from "lucide-react";

/**
 * Desplegable opcional ("flechita") para explicar de forma profesional y médica
 * por qué se utiliza una funcionalidad en el TDAH y cómo ayuda al alumno.
 * Se oculta automáticamente cuando el usuario activo es TERAPEUTA.
 */
export const ExplicacionMedicaToggle = ({
  rolActual = "DOCENTE",
  titulo = "Fundamento Médico y Neuroeducativo TDAH",
  porQueSeUsa = "",
  comoAyudaAlAlumno = "",
  color = "#2563eb",
}) => {
  const [abierto, setAbierto] = useState(false);

  // El terapeuta ya conoce la clínica del padecimiento, por lo que no se le muestra
  if (rolActual === "TERAPEUTA") {
    return null;
  }

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          background: abierto ? "rgba(37, 99, 235, 0.08)" : "transparent",
          border: "1px solid #cbd5e1",
          borderRadius: "999px",
          padding: "0.22rem 0.65rem",
          fontSize: "0.72rem",
          fontWeight: "700",
          color: "#475569",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        title="Ver fundamento profesional y médico de esta herramienta"
      >
        <Stethoscope size={13} color={color} />
        <span>{abierto ? "Ocultar fundamento clínico" : "¿Por qué se usa en TDAH?"}</span>
        {abierto ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {abierto && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.85rem 1rem",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)",
            borderLeft: `4px solid ${color}`,
            borderTop: "1px solid #e2e8f0",
            borderRight: "1px solid #e2e8f0",
            borderBottom: "1px solid #e2e8f0",
            fontSize: "0.78rem",
            color: "#1e293b",
            lineHeight: 1.5,
            animation: "fadeInSlide 0.22s ease-out",
          }}
        >
          <div style={{ fontWeight: "800", color, marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Brain size={15} />
            <span>{titulo}</span>
          </div>
          {porQueSeUsa && (
            <div style={{ marginBottom: "0.3rem" }}>
              <strong>Justificación Médica y Clínica:</strong> {porQueSeUsa}
            </div>
          )}
          {comoAyudaAlAlumno && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.35rem", color: "#0f172a" }}>
              <CheckCircle2 size={14} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>
                <strong>Impacto en el Alumno:</strong> {comoAyudaAlAlumno}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplicacionMedicaToggle;
