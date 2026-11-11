import React from "react";
import { Sparkles, Heart, School, ShieldCheck } from "lucide-react";

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
              <span>SincroAula v3</span>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "#94a3b8" }}>
              Plataforma colaborativa e interactiva para la coordinación en tiempo real entre docentes de nivel inicial, acompañantes terapéuticos y tutores familiares.
            </p>
          </div>

          <div>
            <div style={{ color: "white", fontWeight: "700", fontSize: "0.95rem", marginBottom: "0.75rem" }}>
              Marco Académico e Institucional
            </div>
            <ul style={{ listStyle: "none", fontSize: "0.85rem", lineHeight: 1.8 }}>
              <li>Instituto Politécnico Formosa</li>
              <li>Tecnicatura Superior en Desarrollo de Software Multiplataforma</li>
              <li>Práctica Profesionalizante · Unidad N° 1 - Innovación</li>
              <li>Profesor: Miguel Mateo Badaracco</li>
            </ul>
          </div>

          <div>
            <div style={{ color: "white", fontWeight: "700", fontSize: "0.95rem", marginBottom: "0.75rem" }}>
              Equipo RedNeC
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
              Desarrollado con dedicación por Acevedo Cristian, Falcón Santiago y Sánchez Gastón para impulsar la inclusión educativa en Formosa.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", fontSize: "0.8rem", color: "#38bdf8" }}>
              <ShieldCheck size={16} />
              <span>Sequelize Paranoid · JWT HttpOnly · RBAC</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "1.25rem", textAlign: "center", fontSize: "0.775rem", color: "#64748b" }}>
          © 2026 SincroAula v3. Diseñado con estándares de accesibilidad e interacción inspirados en Pitch.com.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
