import React from "react";
import { Sparkles, ShieldCheck, Brain, HeartHandshake } from "lucide-react";

export const Footer = () => {
  return (
    <footer
      style={{
        background: "#0f172a",
        color: "#94a3b8",
        padding: "2.5rem 1rem 1.5rem 1rem",
        borderTop: "1px solid #1e293b",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "white", fontWeight: "800", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
              <Sparkles size={18} color="#38bdf8" />
              <span>SincroAula</span>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "#94a3b8" }}>
              Plataforma colaborativa e interactiva para la coordinación en tiempo real entre docentes, acompañantes terapéuticos y tutores familiares con enfoque especializado en TDAH.
            </p>
          </div>

          <div>
            <div style={{ color: "white", fontWeight: "700", fontSize: "0.95rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Brain size={16} color="#a78bfa" />
              <span>Abordaje Neuroeducativo TDAH</span>
            </div>
            <ul style={{ listStyle: "none", fontSize: "0.85rem", lineHeight: 1.8 }}>
              <li>Adaptación Curricular y Micro-segmentación (Chunking)</li>
              <li>Monitoreo Emocional y Función Ejecutiva en Vivo</li>
              <li>Presentaciones Pedagógicas de Bajo Estímulo Distractor</li>
              <li>Comunicación Tripartita Docente · Terapeuta · Familia</li>
            </ul>
          </div>

          <div>
            <div style={{ color: "white", fontWeight: "700", fontSize: "0.95rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <HeartHandshake size={16} color="#10b981" />
              <span>Innovación y Tecnología Inclusiva</span>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
              Impulsando la inclusión escolar y el bienestar integral de cada alumno mediante herramientas digitales de acompañamiento terapéutico y pedagógico en tiempo real.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", fontSize: "0.8rem", color: "#38bdf8" }}>
              <ShieldCheck size={16} />
              <span>Seguridad Clínico-Pedagógica · JWT HttpOnly · RBAC</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "1.25rem", textAlign: "center", fontSize: "0.775rem", color: "#64748b" }}>
          © 2026 SincroAula · Plataforma de Coordinación Educativa y Terapéutica.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
