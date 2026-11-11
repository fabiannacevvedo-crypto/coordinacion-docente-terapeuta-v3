import React from "react";
import { Link } from "react-router-dom";
import { PitchPresentationDeck } from "../components/pitch/PitchPresentationDeck.jsx";
import { Sparkles, ArrowLeft, Download, ShieldCheck, School, HeartHandshake } from "lucide-react";

export const PitchWorkspace = () => {
  return (
    <div style={{ maxWidth: "1080px", margin: "1rem auto 3rem auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--primary)", fontSize: "0.85rem", fontWeight: "700" }}>
          <ArrowLeft size={16} /> Volver a SincroAula
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#64748b" }}>
          <Sparkles size={14} color="#7c3aed" />
          <span>Modo Pitch Workspace · Defensa y Exposición de Proyecto</span>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "900", color: "#0f172a" }}>
          Presentación Ejecutiva SincroAula v3
        </h1>
        <p style={{ color: "#64748b", maxWidth: "680px", margin: "0.5rem auto 0 auto" }}>
          Diapositivas interactivas estructuradas para la evaluación de la materia Práctica Profesionalizante I - Instituto Politécnico Formosa
        </p>
      </div>

      {/* Deck Interactivo */}
      <PitchPresentationDeck />

      {/* Notas de Defensa Técnica para el Alumno / Expositor */}
      <div className="card" style={{ marginTop: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.75rem" }}>
          Guía Rápida para la Defensa Oral del Proyecto
        </h3>
        <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6, marginBottom: "1rem" }}>
          Durante la exposición, puedes utilizar este workspace en pantalla completa navegando con las flechas o activando el auto-avance.
        </p>
        
        <div className="grid-3" style={{ gap: "1rem" }}>
          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontWeight: "700", color: "#2563eb", marginBottom: "0.25rem" }}>1. Justificación</div>
            <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Explicar el caso real de Formosa: en nivel inicial no existía un canal digital unificado para que la docente y el AT sincronicen la jornada de alumnos como Mauricio.
            </p>
          </div>

          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontWeight: "700", color: "#7c3aed", marginBottom: "0.25rem" }}>2. Arquitectura Backend</div>
            <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Destacar la separación en dos controladores: <code>user.controller.js</code> (CRUD con soft delete) y <code>auth.controller.js</code> (registro/login con cookies HttpOnly seguras).
            </p>
          </div>

          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontWeight: "700", color: "#059669", marginBottom: "0.25rem" }}>3. Innovación Visual</div>
            <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Mostrar el semáforo interactivo en tiempo real y la caja de herramientas sensoriales (animación respiración 4-4-4) inspirada en Pitch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchWorkspace;
