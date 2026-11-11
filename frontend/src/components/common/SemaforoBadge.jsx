import React from "react";

export const SemaforoBadge = ({ estado = "VERDE", size = "normal" }) => {
  const configs = {
    VERDE: {
      label: "Regulado / Participativo",
      className: "semaforo-verde",
      bg: "var(--semaforo-verde-bg)",
      border: "var(--semaforo-verde-border)",
      color: "#065f46",
    },
    AMARILLO: {
      label: "Inquieto / En Alerta",
      className: "semaforo-amarillo",
      bg: "var(--semaforo-amarillo-bg)",
      border: "var(--semaforo-amarillo-border)",
      color: "#92400e",
    },
    ROJO: {
      label: "Desregulación / Pausa",
      className: "semaforo-rojo",
      bg: "var(--semaforo-rojo-bg)",
      border: "var(--semaforo-rojo-border)",
      color: "#991b1b",
    },
  };

  const current = configs[estado] || configs["VERDE"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.45rem",
        padding: size === "sm" ? "0.2rem 0.55rem" : "0.3rem 0.75rem",
        borderRadius: "9999px",
        background: current.bg,
        border: `1px solid ${current.border}`,
        color: current.color,
        fontSize: size === "sm" ? "0.75rem" : "0.825rem",
        fontWeight: "700",
      }}
    >
      <span className={`semaforo-dot ${current.className}`} />
      {estado} - {current.label}
    </span>
  );
};

export default SemaforoBadge;
