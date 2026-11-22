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
  ArrowRight,
  Zap,
  Brain,
  CheckCircle2,
  Sliders,
  MessageSquare,
} from "lucide-react";

export const Home = () => {
  const { user, roles } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "2.75rem 1rem 2.25rem 1rem",
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
          <Brain size={16} />
          <span>Plataforma de Coordinación Neuroeducativa · Especializada en TDAH</span>
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
          <strong>SincroAula</strong> conecta al <strong>Rol Docente</strong>, al <strong>Rol Terapeuta</strong> y al <strong>Familiar / Tutor</strong> en una misma frecuencia: con adaptación clínica de tareas orientadas al TDAH, presentaciones adaptadas para el alumno, semáforos emocionales en vivo y comunicación instantánea.
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
                <span>Registrarse por Rol</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: "0.85rem 1.5rem", fontSize: "1rem" }}>
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>

        {/* Acceso Rápido Demo por Rol */}
        <div style={{ maxWidth: "680px", margin: "0 auto 2.5rem auto" }}>
          <QuickDemoButtons />
        </div>
      </section>

      {/* Showcase Interactivo: Proyecto SincroAula */}
      <section style={{ maxWidth: "980px", margin: "0 auto 3rem auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: "800", color: "#334155", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Zap size={16} color="var(--primary)" />
            <span>Showcase Interactivo: Proyecto SincroAula</span>
          </div>
          <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>
            Recorrido interactivo del sistema
          </span>
        </div>
        <PitchPresentationDeck />
      </section>

      {/* Sección Científica y Tecnológica: El Ayudante Terapéutico en TDAH llevado a lo Digital */}
      <section style={{ maxWidth: "1140px", margin: "0 auto 3.5rem auto" }}>
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "white",
            border: "1px solid #334155",
            padding: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#38bdf8", fontWeight: "800", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            <Brain size={18} />
            <span>INNOVACIÓN TERAPÉUTICA Y TECNOLÓGICA EN TDAH</span>
          </div>
          <h2 style={{ fontSize: "1.65rem", fontWeight: "900", marginBottom: "0.75rem" }}>
            ¿Cómo transforma SincroAula la labor del Acompañante Terapéutico en el TDAH?
          </h2>
          <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            Recopilamos las prácticas clínicas y neuroeducativas más actuales utilizadas en el abordaje del <strong>Trastorno por Déficit de Atención e Hiperactividad (TDAH)</strong> y las integramos en herramientas digitales interactivas que conectan el aula, el gabinete y el hogar:
          </p>

          <div className="grid-3">
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.25rem", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontWeight: "800", color: "#60a5fa", marginBottom: "0.4rem", fontSize: "1rem" }}>
                1. Andamiaje de Función Ejecutiva (Chunking)
              </div>
              <p style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                En lugar de enviar tareas extensas que saturan la memoria de trabajo del alumno con TDAH, el Docente crea la consigna y el <strong>Terapeuta la micro-segmenta en pasos cortos</strong> con apoyos visuales antes de que llegue al Tutor Familiar.
              </p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.25rem", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontWeight: "800", color: "#c084fc", marginBottom: "0.4rem", fontSize: "1rem" }}>
                2. Externalización del Tiempo y Autoinstrucciones
              </div>
              <p style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                La percepción del tiempo suele verse alterada en el TDAH. Incorporamos un <strong>Temporizador Visual Pomodoro Escolar</strong>, guía de <strong>Autoinstrucciones de Meichenbaum</strong> para frenar la impulsividad y un <strong>Termómetro de Atención/Hiperactividad</strong>.
              </p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.25rem", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontWeight: "800", color: "#34d399", marginBottom: "0.4rem", fontSize: "1rem" }}>
                3. Refuerzo Inmediato y Bucle Familiar
              </div>
              <p style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                El cerebro con TDAH requiere retroalimentación inmediata. El Tutor visualiza la tarea adaptada con el nombre del Docente y del Terapeuta, aplica la guía en casa y envía un <strong>reporte directo a cada profesional o a ambos</strong> sobre cómo estuvo su hijo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tres Pilares / Roles */}
      <section style={{ maxWidth: "1140px", margin: "0 auto 3.5rem auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#0f172a" }}>Funcionalidades por Rol en SincroAula</h2>
          <p style={{ color: "#64748b" }}>Herramientas especializadas que favorecen la coordinación continua</p>
        </div>

        <div className="grid-3">
          {/* Docente */}
          <div className="card" style={{ borderTop: "4px solid var(--docente-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ background: "var(--docente-bg)", padding: "0.5rem", borderRadius: "10px", color: "var(--docente-color)" }}>
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800" }}>Rol Docente</h3>
                <span className="badge badge-docente">Gestión Pedagógica</span>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Gestiona el aula inclusiva, registra nuevos alumnos, diseña presentaciones adaptadas y coordina las tareas con el terapeuta antes de enviarlas al hogar.
            </p>
            <ul style={{ fontSize: "0.825rem", color: "#334155", lineHeight: 1.8, paddingLeft: "1.2rem" }}>
              <li><strong>Creación de Presentaciones Adaptadas</strong> para el alumno</li>
              <li><strong>Registro de Alumnos</strong> y perfil neuroeducativo</li>
              <li><strong>Asignación de Tareas</strong> (en conjunto o individual) enviadas al Terapeuta</li>
              <li><strong>Chat en Tiempo Real</strong> con padres/tutores y terapeutas</li>
            </ul>
          </div>

          {/* Terapeuta */}
          <div className="card" style={{ borderTop: "4px solid var(--terapeuta-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ background: "var(--terapeuta-bg)", padding: "0.5rem", borderRadius: "10px", color: "var(--terapeuta-color)" }}>
                <Stethoscope size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800" }}>Rol Terapeuta</h3>
                <span className="badge badge-terapeuta">Adaptación TDAH y Clínica</span>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Recibe las tareas del docente, las adapta según pautas específicas orientadas al TDAH de cada alumno y utiliza la caja de herramientas clínicas expandida.
            </p>
            <ul style={{ fontSize: "0.825rem", color: "#334155", lineHeight: 1.8, paddingLeft: "1.2rem" }}>
              <li><strong>Bandeja de Adaptación TDAH</strong> (previo al envío al tutor)</li>
              <li><strong>Caja de Herramientas Expandida:</strong> Respiración 4-4-4, Temporizador Pomodoro, Autoinstrucciones y Economía de Fichas</li>
              <li><strong>Registro ABC Conductual</strong> y comunicación directa</li>
            </ul>
          </div>

          {/* Familiar */}
          <div className="card" style={{ borderTop: "4px solid var(--familiar-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ background: "var(--familiar-bg)", padding: "0.5rem", borderRadius: "10px", color: "var(--familiar-color)" }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800" }}>Familiar / Tutor</h3>
                <span className="badge badge-familiar">Seguimiento en el Hogar</span>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Accede a las tareas ya adaptadas para TDAH, visualiza los profesionales responsables y envía reportes sobre cómo estuvo su hijo en cada actividad.
            </p>
            <ul style={{ fontSize: "0.825rem", color: "#334155", lineHeight: 1.8, paddingLeft: "1.2rem" }}>
              <li><strong>Tareas Enviadas + Adaptación TDAH</strong> paso a paso</li>
              <li><strong>Identificación clara</strong> del Docente, Terapeuta y Tutor</li>
              <li><strong>Envío de Reportes o Mensajes</strong> al Docente, al Terapeuta o a ambos</li>
              <li><strong>Acceso a Presentaciones Adaptadas</strong> y logros del día</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
