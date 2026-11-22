import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { PitchPresentationDeck } from "../components/pitch/PitchPresentationDeck.jsx";
import { QuickDemoButtons } from "../components/common/QuickDemoButtons.jsx";
import { ExplicacionMedicaToggle } from "../components/common/ExplicacionMedicaToggle.jsx";
import {
  GraduationCap,
  Stethoscope,
  Users,
  ArrowRight,
  Zap,
  Brain,
  FileText,
  Sun,
  Calendar,
  BookOpen,
  Sliders,
  Send,
} from "lucide-react";

export const Home = () => {
  const { user, roles } = useAuth();
  const rolActivo = roles?.[0] || "DOCENTE";

  const pasosCircuito = [
    { num: "01", titulo: "Ficha Médica", sub: "Gravedad TDAH", Icono: FileText, color: "#2563eb" },
    { num: "02", titulo: "Sincronizador", sub: "3 Pautas Pre-Aula", Icono: Sun, color: "#059669" },
    { num: "03", titulo: "Agenda Diaria", sub: "Bloques Calibrados", Icono: Calendar, color: "#0284c7" },
    { num: "04", titulo: "Actividad", sub: "Presentación Aula", Icono: BookOpen, color: "#4f46e5" },
    { num: "05", titulo: "Adaptación AT", sub: "Chunking + Reloj", Icono: Sliders, color: "#7c3aed" },
    { num: "06", titulo: "Envío al Padre", sub: "Hogar y Reporte", Icono: Send, color: "#10b981" },
  ];

  return (
    <div>
      {/* Hero Compacto y Visual */}
      <section
        style={{
          textAlign: "center",
          padding: "2rem 1rem 1.75rem 1rem",
          maxWidth: "920px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            background: "rgba(37, 99, 235, 0.08)",
            border: "1px solid rgba(37, 99, 235, 0.2)",
            padding: "0.3rem 0.85rem",
            borderRadius: "9999px",
            fontSize: "0.78rem",
            fontWeight: "800",
            color: "var(--primary)",
            marginBottom: "1rem",
          }}
        >
          <Brain size={15} />
          <span>Ecosistema Neuroeducativo TDAH · Paneles Interactivos Desplazables</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
            fontWeight: "900",
            lineHeight: 1.12,
            color: "#0f172a",
            marginBottom: "0.85rem",
          }}
        >
          Sincronización Clínica y Pedagógica en{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 55%, #059669 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Tiempo Real
          </span>
        </h1>

        {/* Pista Visual de 6 Pasos del Circuito TDAH */}
        <div
          className="horizontal-scroll-track"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(130px, 1fr))",
            gap: "0.5rem",
            overflowX: "auto",
            margin: "1.25rem 0 1.5rem 0",
            padding: "0.25rem",
          }}
        >
          {pasosCircuito.map((p) => {
            const IconC = p.Icono;
            return (
              <div
                key={p.num}
                className="float-hover"
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderTop: `3px solid ${p.color}`,
                  borderRadius: "12px",
                  padding: "0.65rem 0.5rem",
                  textAlign: "center",
                  boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    background: `${p.color}15`,
                    color: p.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.35rem auto",
                  }}
                >
                  <IconC size={16} />
                </div>
                <div style={{ fontSize: "0.76rem", fontWeight: "900", color: "#0f172a" }}>
                  {p.num}. {p.titulo}
                </div>
                <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600" }}>{p.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Botones de Acción */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
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
              style={{ padding: "0.75rem 1.5rem", fontSize: "0.95rem" }}
            >
              <span>Abrir mi Panel Interactivo</span>
              <ArrowRight size={17} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: "0.75rem 1.5rem", fontSize: "0.95rem" }}>
                <span>Registrarse por Rol</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: "0.75rem 1.35rem", fontSize: "0.95rem" }}>
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>

        {/* Acceso Rápido Demo por Rol */}
        <div style={{ maxWidth: "680px", margin: "0 auto 1.5rem auto" }}>
          <QuickDemoButtons />
        </div>
      </section>

      {/* Showcase Interactivo: Proyecto SincroAula */}
      <section style={{ maxWidth: "1020px", margin: "0 auto 2.5rem auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#334155", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Zap size={16} color="var(--primary)" />
            <span>Showcase Interactivo: Proyecto SincroAula</span>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>
            5 Módulos Interactivos
          </span>
        </div>
        <PitchPresentationDeck />
      </section>

      {/* Tarjetas Compactas por Rol con Flechita Opcional de Fundamento Médico */}
      <section style={{ maxWidth: "1140px", margin: "0 auto 2.5rem auto" }}>
        <div className="grid-3">
          {/* Docente */}
          <div className="card movable-panel-card" style={{ borderTop: "4px solid var(--docente-color)", padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.65rem" }}>
              <div style={{ background: "var(--docente-bg)", padding: "0.5rem", borderRadius: "10px", color: "var(--docente-color)" }}>
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.08rem", fontWeight: "900" }}>Rol Docente</h3>
                <span className="badge badge-docente">Aula y Presentaciones</span>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.5rem" }}>
              {["Ficha Médica + Gravedad", "Agenda Diaria", "Presentaciones Adaptadas", "Tareas → Terapeuta", "Chat en Vivo"].map((chip) => (
                <span key={chip} style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "0.72rem", fontWeight: "700", padding: "0.2rem 0.55rem", borderRadius: "6px" }}>
                  {chip}
                </span>
              ))}
            </div>

            <ExplicacionMedicaToggle
              rolActual={rolActivo === "TERAPEUTA" ? "TERAPEUTA" : "DOCENTE"}
              titulo="Fundamento Clínico de las Herramientas del Docente"
              porQueSeUsa="Integra la ficha médica (gravedad del TDAH) con las 3 pautas matutinas del hogar para calibrar bloques de atención cortos y presentaciones sin estímulos distractores."
              comoAyudaAlAlumno="Previene la saturación de la memoria de trabajo y sostiene la motivación en sala."
              color="#2563eb"
            />
          </div>

          {/* Terapeuta */}
          <div className="card movable-panel-card" style={{ borderTop: "4px solid var(--terapeuta-color)", padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.65rem" }}>
              <div style={{ background: "var(--terapeuta-bg)", padding: "0.5rem", borderRadius: "10px", color: "var(--terapeuta-color)" }}>
                <Stethoscope size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.08rem", fontWeight: "900" }}>Rol Terapeuta / AT</h3>
                <span className="badge badge-terapeuta">Adaptación y Regulador</span>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {["Adaptador Chunking TDAH", "Regulador Neuro-Ejecutivo", "Time-Timer Pomodoro", "Esfera 4-4-4", "Meichenbaum", "Matriz ABC"].map((chip) => (
                <span key={chip} style={{ background: "#f5f3ff", color: "#5b21b6", fontSize: "0.72rem", fontWeight: "700", padding: "0.2rem 0.55rem", borderRadius: "6px" }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Familiar */}
          <div className="card movable-panel-card" style={{ borderTop: "4px solid var(--familiar-color)", padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.65rem" }}>
              <div style={{ background: "var(--familiar-bg)", padding: "0.5rem", borderRadius: "10px", color: "var(--familiar-color)" }}>
                <Users size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.08rem", fontWeight: "900" }}>Familiar / Tutor</h3>
                <span className="badge badge-familiar">Sincronizador Pre-Aula</span>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.5rem" }}>
              {["3 Pautas Pre-Aula", "Ficha Médica", "Tareas Adaptadas", "Nombres Docente y AT", "Reporte Directo"].map((chip) => (
                <span key={chip} style={{ background: "#ecfdf5", color: "#065f46", fontSize: "0.72rem", fontWeight: "700", padding: "0.2rem 0.55rem", borderRadius: "6px" }}>
                  {chip}
                </span>
              ))}
            </div>

            <ExplicacionMedicaToggle
              rolActual={rolActivo === "TERAPEUTA" ? "TERAPEUTA" : "FAMILIAR"}
              titulo="Fundamento Clínico del Portal Familiar"
              porQueSeUsa="Releva las 3 pautas matutinas antes de entrar al aula y entrega actividades ya fraccionadas por el Terapeuta."
              comoAyudaAlAlumno="Cierra el bucle terapéutico entre hogar y escuela reduciendo la frustración familiar."
              color="#059669"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
