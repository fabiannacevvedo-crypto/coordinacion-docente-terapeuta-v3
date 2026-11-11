import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { PitchPresentationDeck } from "../components/pitch/PitchPresentationDeck.jsx";
import { QuickDemoButtons } from "../components/common/QuickDemoButtons.jsx";
import {
  Sparkles,
  GraduationCap,
  Stethoscope,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Activity,
  Zap,
} from "lucide-react";

export const Home = () => {
  const { user, roles } = useAuth();

  return (
    <div>
      {/* Hero Section inspirado en Pitch */}
      <section
        style={{
          textAlign: "center",
          padding: "3rem 1rem 2.5rem 1rem",
          maxWidth: "880px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(37, 99, 235, 0.08)",
            border: "1px solid rgba(37, 99, 235, 0.2)",
            padding: "0.35rem 0.85rem",
            borderRadius: "9999px",
            fontSize: "0.825rem",
            fontWeight: "700",
            color: "var(--primary)",
            marginBottom: "1.25rem",
          }}
        >
          <Sparkles size={16} />
          <span>Innovación Educativa · Instituto Politécnico Formosa</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: "900",
            lineHeight: 1.15,
            color: "#0f172a",
            marginBottom: "1.25rem",
          }}
        >
          Coordinación en tiempo real para el{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Aula Inclusiva
          </span>
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#475569",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          SincroAula conecta a <strong>docentes de nivel inicial</strong>, <strong>acompañantes terapéuticos</strong> y <strong>familias</strong> en una misma frecuencia: con semáforos emocionales en vivo, estrategias compartidas y alertas preventivas.
        </p>

        {/* Botones de Acción */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {user ? (
            <Link
              to={
                roles.includes("DOCENTE")
                  ? "/dashboard/docente"
                  : roles.includes("TERAPEUTA")
                  ? "/dashboard/terapeuta"
                  : roles.includes("FAMILIAR")
                  ? "/dashboard/familiar"
                  : "/dashboard/admin"
              }
              className="btn btn-primary"
              style={{ padding: "0.85rem 1.75rem", fontSize: "1rem" }}
            >
              <span>Ir a mi Panel de Trabajo</span>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: "0.85rem 1.75rem", fontSize: "1rem" }}>
                <span>Crear Cuenta con Verificación</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: "0.85rem 1.5rem", fontSize: "1rem" }}>
                Iniciar Sesión
              </Link>
            </>
          )}

          <Link to="/pitch" className="btn btn-pitch" style={{ padding: "0.85rem 1.5rem", fontSize: "1rem" }}>
            <Sparkles size={18} />
            <span>Presentación Pitch</span>
          </Link>
        </div>

        {/* Acceso Rápido Demo para Evaluar al Instante */}
        <div style={{ maxWidth: "680px", margin: "0 auto 2.5rem auto" }}>
          <QuickDemoButtons />
        </div>
      </section>

      {/* Espacio de Diapositivas Interactivo estilo Pitch */}
      <section style={{ maxWidth: "980px", margin: "0 auto 3rem auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: "800", color: "#334155", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Zap size={16} color="var(--primary)" />
            <span>Showcase Interactivo: Proyecto SincroAula</span>
          </div>
          <Link to="/pitch" style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "700" }}>
            Abrir modo presentación completa →
          </Link>
        </div>
        <PitchPresentationDeck />
      </section>

      {/* Tres Pilares / Roles */}
      <section style={{ maxWidth: "1140px", margin: "0 auto 3.5rem auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#0f172a" }}>Diseñado para Cada Rol del Equipo</h2>
          <p style={{ color: "#64748b" }}>Cada sección adaptada con herramientas visuales e intuitivas</p>
        </div>

        <div className="grid-3">
          {/* Docente */}
          <div className="card" style={{ borderTop: "4px solid var(--docente-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ background: "var(--docente-bg)", padding: "0.5rem", borderRadius: "10px", color: "var(--docente-color)" }}>
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800" }}>Docente de Sala</h3>
                <span className="badge badge-docente">Nivel Inicial</span>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Supervisa el semáforo sensorial de la sala, comparte la planificación antes de empezar la jornada y emite alertas instantáneas al AT sin interrumpir la clase.
            </p>
            <ul style={{ fontSize: "0.825rem", color: "#334155", lineHeight: 1.8, paddingLeft: "1.2rem" }}>
              <li>Semáforo del aula en vivo</li>
              <li>Avisos rápidos de cambio de actividad</li>
              <li>Bitácora pedagógica compartida</li>
            </ul>
          </div>

          {/* Terapeuta */}
          <div className="card" style={{ borderTop: "4px solid var(--terapeuta-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ background: "var(--terapeuta-bg)", padding: "0.5rem", borderRadius: "10px", color: "var(--terapeuta-color)" }}>
                <Stethoscope size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800" }}>Terapeuta / AT</h3>
                <span className="badge badge-terapeuta">Salud y Apoyo</span>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Accede a la planificación docente para anticipar estrategias, dispone de una caja de herramientas sensoriales (respiración 4-4-4) y registra la evolución clínica.
            </p>
            <ul style={{ fontSize: "0.825rem", color: "#334155", lineHeight: 1.8, paddingLeft: "1.2rem" }}>
              <li>Caja de herramientas sensoriales</li>
              <li>Monitoreo de desregulación acústica</li>
              <li>Sugerencias psicopedagógicas activas</li>
            </ul>
          </div>

          {/* Familiar */}
          <div className="card" style={{ borderTop: "4px solid var(--familiar-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ background: "var(--familiar-bg)", padding: "0.5rem", borderRadius: "10px", color: "var(--familiar-color)" }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800" }}>Tutor / Familia</h3>
                <span className="badge badge-familiar">Hogar y Cuidado</span>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Un portal cálido y comprensible: consulta de inmediato cómo estuvo su hijo hoy, celebra las medallas de logros alcanzadas y coordina con el equipo docente.
            </p>
            <ul style={{ fontSize: "0.825rem", color: "#334155", lineHeight: 1.8, paddingLeft: "1.2rem" }}>
              <li>Resumen diario "¿Cómo estuvo hoy?"</li>
              <li>Muro de logros y medallas del día</li>
              <li>Canal directo con la docente y el AT</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
