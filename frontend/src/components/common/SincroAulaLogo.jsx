import React from "react";

export const SincroAulaLogo = ({ size = 42, showText = true, darkText = true }) => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem" }}>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(0 6px 14px rgba(37, 99, 235, 0.28))" }}
        >
          <defs>
            <linearGradient id="sincroBgGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="triadRingGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="docenteNode" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="terapeutaNode" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="tutorNode" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Escudo Hexagonal Suavizado */}
          <rect x="3" y="3" width="58" height="58" rx="16" fill="url(#sincroBgGrad)" stroke="url(#triadRingGrad)" strokeWidth="2.5" />

          {/* Órbita de Sincronización Tripartita */}
          <circle cx="32" cy="33" r="16" stroke="url(#triadRingGrad)" strokeWidth="2.2" strokeDasharray="5 3" opacity="0.85" />

          {/* Líneas de Sinapsis Neuroeducativa al Centro */}
          <line x1="32" y1="15" x2="32" y2="33" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="17" y1="42" x2="32" y2="33" stroke="#c084fc" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="47" y1="42" x2="32" y2="33" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" />

          {/* Triángulo de Conexión Directa */}
          <path d="M32 15 L17 42 L47 42 Z" stroke="rgba(255,255,255,0.22)" strokeWidth="1.4" fill="rgba(59, 130, 246, 0.08)" />

          {/* Pulso Central (El Alumno en Foco) */}
          <circle cx="32" cy="33" r="5.5" fill="#ffffff" />
          <circle cx="32" cy="33" r="2.8" fill="#06b6d4" />

          {/* Nodo Superior: Rol Docente (Azul) */}
          <circle cx="32" cy="15" r="6" fill="url(#docenteNode)" stroke="#ffffff" strokeWidth="1.5" />

          {/* Nodo Inferior Izquierdo: Rol Terapeuta (Violeta) */}
          <circle cx="17" cy="42" r="6" fill="url(#terapeutaNode)" stroke="#ffffff" strokeWidth="1.5" />

          {/* Nodo Inferior Derecho: Familiar / Tutor (Esmeralda) */}
          <circle cx="47" cy="42" r="6" fill="url(#tutorNode)" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
      </div>

      {showText && (
        <div>
          <div
            style={{
              fontSize: "1.3rem",
              fontWeight: "900",
              fontFamily: "var(--font-heading)",
              color: darkText ? "#0f172a" : "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              display: "flex",
              alignItems: "center",
              gap: "0.15rem",
            }}
          >
            <span>Sincro</span>
            <span
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 55%, #059669 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Aula
            </span>
          </div>
          <div
            style={{
              fontSize: "0.68rem",
              color: darkText ? "#64748b" : "#94a3b8",
              fontWeight: "700",
              letterSpacing: "0.02em",
            }}
          >
            SINAPSIS DOCENTE · TERAPEUTA · FAMILIA
          </div>
        </div>
      )}
    </div>
  );
};

export default SincroAulaLogo;
