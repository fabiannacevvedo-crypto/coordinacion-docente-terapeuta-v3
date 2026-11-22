import React from "react";
import {
  FileText,
  Sun,
  Calendar,
  BookOpen,
  Sliders,
  Send,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

/**
 * Barra Horizontal Interactiva y Desplazable de las 6 Etapas del Circuito TDAH:
 * 1. Ficha Médica & Gravedad -> 2. Sincronizador Matutino -> 3. Agenda Diaria ->
 * 4. Actividad / Presentación -> 5. Adaptación Terapeuta -> 6. Envío y Reporte Tutor
 */
export const CircuitoTDAHStepper = ({
  etapaActiva = 1,
  onSelectEtapa,
  alumno = null,
  tieneSincronizadorHoy = false,
  tieneAgendaHoy = false,
  tieneTareasAdaptadas = false,
}) => {
  const gravedad = alumno?.gravedad_tdah || "MODERADO";

  const colorGravedad =
    gravedad === "SEVERO"
      ? { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", label: "Gravedad Severa (Foco 6 min)" }
      : gravedad === "MODERADO"
      ? { bg: "#fffbeb", text: "#d97706", border: "#fde68a", label: "Gravedad Moderada (Foco 10 min)" }
      : { bg: "#ecfdf5", text: "#059669", border: "#a7f3d0", label: "Gravedad Leve (Foco 15 min)" };

  const etapas = [
    {
      num: 1,
      id: "FICHA_MEDICA",
      titulo: "1. Ficha Médica",
      sub: colorGravedad.label,
      Icono: FileText,
      color: "#2563eb",
      completada: true,
    },
    {
      num: 2,
      id: "SINCRONIZADOR",
      titulo: "2. Sincronizador",
      sub: tieneSincronizadorHoy ? "3 Pautas Listas" : "Pre-Aula Hogar",
      Icono: Sun,
      color: "#059669",
      completada: tieneSincronizadorHoy,
    },
    {
      num: 3,
      id: "AGENDA",
      titulo: "3. Agenda Diaria",
      sub: tieneAgendaHoy ? "Personalizada" : "Según Contexto",
      Icono: Calendar,
      color: "#0284c7",
      completada: tieneAgendaHoy,
    },
    {
      num: 4,
      id: "ACTIVIDAD",
      titulo: "4. Actividad",
      sub: "Docente Diseña",
      Icono: BookOpen,
      color: "#4f46e5",
      completada: true,
    },
    {
      num: 5,
      id: "ADAPTACION",
      titulo: "5. Adaptación TDAH",
      sub: "Gabinete AT",
      Icono: Sliders,
      color: "#7c3aed",
      completada: tieneTareasAdaptadas,
    },
    {
      num: 6,
      id: "PADRE",
      titulo: "6. Envío al Padre",
      sub: "Hogar y Reporte",
      Icono: Send,
      color: "#10b981",
      completada: tieneTareasAdaptadas,
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "18px",
        padding: "0.95rem 1.15rem",
        marginBottom: "1.35rem",
        border: "1px solid #334155",
        boxShadow: "0 12px 28px -8px rgba(15, 23, 42, 0.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          marginBottom: "0.7rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              background: "#2563eb",
              color: "white",
              fontSize: "0.66rem",
              fontWeight: "800",
              padding: "0.18rem 0.55rem",
              borderRadius: "6px",
              letterSpacing: "0.05em",
            }}
          >
            CIRCUITO PERSONALIZADO TDAH
          </span>
          {alumno && (
            <span style={{ color: "#e2e8f0", fontSize: "0.8rem", fontWeight: "700" }}>
              {alumno.nombre} {alumno.apellido}
            </span>
          )}
        </div>

        <span
          style={{
            background: colorGravedad.bg,
            color: colorGravedad.text,
            border: `1px solid ${colorGravedad.border}`,
            fontSize: "0.7rem",
            fontWeight: "800",
            padding: "0.15rem 0.65rem",
            borderRadius: "999px",
          }}
        >
          {colorGravedad.label}
        </span>
      </div>

      {/* Pista Horizontal Desplazable de las 6 Etapas */}
      <div
        className="horizontal-scroll-track"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, minmax(145px, 1fr))",
          gap: "0.55rem",
          overflowX: "auto",
          paddingBottom: "0.2rem",
        }}
      >
        {etapas.map((et) => {
          const IconComp = et.Icono;
          const active = etapaActiva === et.num;
          return (
            <button
              key={et.num}
              type="button"
              onClick={() => onSelectEtapa && onSelectEtapa(et.num)}
              style={{
                background: active
                  ? `linear-gradient(135deg, ${et.color} 0%, #1e293b 130%)`
                  : "rgba(255, 255, 255, 0.05)",
                border: `1.5px solid ${active ? "#ffffff" : et.completada ? et.color : "rgba(255,255,255,0.12)"}`,
                borderRadius: "12px",
                padding: "0.6rem 0.7rem",
                textAlign: "left",
                color: "white",
                cursor: "pointer",
                transition: "all 0.22s ease",
                transform: active ? "translateY(-2px)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.4rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    background: active ? "rgba(255,255,255,0.2)" : `${et.color}30`,
                    color: active ? "#ffffff" : "#93c5fd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconComp size={15} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: "800", lineHeight: 1.15 }}>
                    {et.titulo}
                  </div>
                  <div style={{ fontSize: "0.66rem", color: "#cbd5e1", marginTop: "0.1rem" }}>
                    {et.sub}
                  </div>
                </div>
              </div>
              {et.completada && <CheckCircle2 size={14} color="#34d399" style={{ flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CircuitoTDAHStepper;
