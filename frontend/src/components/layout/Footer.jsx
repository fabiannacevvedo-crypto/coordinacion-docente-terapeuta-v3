import React from "react";
import { ShieldCheck, Brain, HeartHandshake, Layers } from "lucide-react";
import { SincroAulaLogo } from "../common/SincroAulaLogo.jsx";

export const Footer = () => {
  return (
    <footer
      style={{
        background: "#090d16",
        color: "#94a3b8",
        padding: "2.75rem 1rem 1.75rem 1rem",
        borderTop: "1px solid #1e293b",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2.25rem", marginBottom: "2rem" }}>
          <div>
            <div style={{ marginBottom: "0.85rem" }}>
              <SincroAulaLogo size={38} showText={true} darkText={false} />
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "#94a3b8" }}>
              Ecosistema digital de sincronización neuroeducativa en tiempo real que articula la labor del Rol Docente, el Rol Terapeuta y el Familiar / Tutor con herramientas clínicas orientadas al TDAH.
            </p>
          </div>

          <div>
            <div style={{ color: "white", fontWeight: "800", fontSize: "0.95rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <Brain size={17} color="#a78bfa" />
              <span>Tecnología Aplicada al TDAH</span>
            </div>
            <ul style={{ listStyle: "none", fontSize: "0.84rem", lineHeight: 1.85 }}>
              <li>Andamiaje Ejecutivo y Micro-segmentación (Chunking)</li>
              <li>Externalización del Tiempo (Reloj Visual Pomodoro)</li>
              <li>Autoinstrucciones Cognitivas de Meichenbaum</li>
              <li>Presentaciones Adaptadas sin Estímulos Distractores</li>
            </ul>
          </div>

          <div>
            <div style={{ color: "white", fontWeight: "800", fontSize: "0.95rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <HeartHandshake size={17} color="#10b981" />
              <span>Coordinación e Inclusión</span>
            </div>
            <p style={{ fontSize: "0.84rem", lineHeight: 1.65 }}>
              Diseñado para transformar el acompañamiento terapéutico tradicional en un circuito colaborativo continuo entre el aula escolar, el gabinete clínico y el hogar.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.85rem", fontSize: "0.8rem", color: "#38bdf8", fontWeight: "600" }}>
              <ShieldCheck size={16} />
              <span>Arquitectura Segura · JWT HttpOnly · Control RBAC</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "1.25rem", textAlign: "center", fontSize: "0.775rem", color: "#64748b" }}>
          © 2026 SincroAula · Plataforma Interactiva de Coordinación Docente, Terapeuta y Familia.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
