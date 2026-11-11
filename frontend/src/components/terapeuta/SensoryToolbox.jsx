import React, { useState, useEffect } from "react";
import { Wind, Headphones, Compass, ShieldAlert, Sparkles, Check, RefreshCw } from "lucide-react";

export const SensoryToolbox = ({ onEstrategiaSeleccionada }) => {
  const [faseRespiracion, setFaseRespiracion] = useState("Inhala");
  const [contador, setContador] = useState(4);
  const [activo, setActivo] = useState(false);

  // Animación del ciclo de respiración 4-4-4
  useEffect(() => {
    let timer = null;
    if (activo) {
      timer = setInterval(() => {
        setContador((prev) => {
          if (prev > 1) return prev - 1;

          // Cambio de fase
          if (faseRespiracion === "Inhala") {
            setFaseRespiracion("Sostén");
            return 4;
          } else if (faseRespiracion === "Sostén") {
            setFaseRespiracion("Exhala");
            return 4;
          } else {
            setFaseRespiracion("Inhala");
            return 4;
          }
        });
      }, 1000);
    } else {
      setFaseRespiracion("Inhala");
      setContador(4);
    }
    return () => clearInterval(timer);
  }, [activo, faseRespiracion]);

  const tecnicas = [
    {
      titulo: "Protocolo Auditivo",
      desc: "Colocar protectores auditivos de 22dB en música o actos.",
      color: "#f59e0b",
      icono: Headphones,
    },
    {
      titulo: "Pausa en Rincón de Calma",
      desc: "Retiro momentáneo de 7 min con cojín de peso sensorial.",
      color: "#8b5cf6",
      icono: ShieldAlert,
    },
    {
      titulo: "Apoyo con Pictogramas",
      desc: "Mostrar secuencia física 'Primero actividad, luego merienda'.",
      color: "#3b82f6",
      icono: Compass,
    },
  ];

  return (
    <div className="card" style={{ borderLeft: "4px solid var(--terapeuta-color)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ background: "var(--terapeuta-bg)", padding: "0.45rem", borderRadius: "8px", color: "var(--terapeuta-color)" }}>
            <Wind size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#0f172a" }}>Caja de Herramientas Sensoriales</h3>
            <p style={{ fontSize: "0.75rem", color: "#64748b" }}>Intervenciones clínicas y autorregulación para el aula</p>
          </div>
        </div>
      </div>

      {/* Ejercicio Interactivo de Respiración Guiada */}
      <div
        style={{
          background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
          border: "1px solid #ddd6fe",
          borderRadius: "14px",
          padding: "1.25rem",
          textAlign: "center",
          marginBottom: "1.25rem",
        }}
      >
        <div style={{ fontSize: "0.825rem", fontWeight: "700", color: "#6d28d9", marginBottom: "0.5rem" }}>
          Guía de Respiración 4-4-4 (Descompresión Sensorial)
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "1rem 0" }}>
          <div
            style={{
              width: activo ? (faseRespiracion === "Inhala" ? "110px" : faseRespiracion === "Sostén" ? "110px" : "75px") : "85px",
              height: activo ? (faseRespiracion === "Inhala" ? "110px" : faseRespiracion === "Sostén" ? "110px" : "75px") : "85px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "900",
              boxShadow: activo ? "0 0 25px rgba(124, 58, 237, 0.45)" : "none",
              transition: "all 3.8s ease-in-out",
            }}
          >
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>{activo ? faseRespiracion : "Listo"}</span>
            {activo && <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{contador}</span>}
          </div>
        </div>

        <button
          onClick={() => setActivo(!activo)}
          className="btn btn-sm"
          style={{
            background: activo ? "#ef4444" : "var(--terapeuta-color)",
            color: "white",
            margin: "0 auto",
          }}
        >
          {activo ? "Detener Ejercicio" : "Iniciar Guía con Alumno"}
        </button>
      </div>

      {/* Protocolos rápidos de 1-clic */}
      <div>
        <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>
          Protocolos Rápidos para Sugerir a Docente:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {tecnicas.map((t, idx) => {
            const IconComponent = t.icono;
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.6rem 0.8rem",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <IconComponent size={16} color={t.color} />
                  <div>
                    <div style={{ fontSize: "0.825rem", fontWeight: "700", color: "#1e293b" }}>{t.titulo}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{t.desc}</div>
                  </div>
                </div>
                {onEstrategiaSeleccionada && (
                  <button
                    onClick={() => onEstrategiaSeleccionada(t.titulo)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                  >
                    Usar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SensoryToolbox;
