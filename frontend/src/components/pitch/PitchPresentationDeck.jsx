import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  AlertTriangle,
  HeartHandshake,
  ShieldCheck,
  Brain,
  Sliders,
  CheckCircle2,
  Users,
  Compass,
} from "lucide-react";

export const PitchPresentationDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoSemaforo, setDemoSemaforo] = useState("VERDE");

  const slides = [
    {
      id: 1,
      tag: "EL PROBLEMA REAL",
      title: "Descoordinación en el Nivel Inicial",
      subtitle: "Mensajes contradictorios hacia el alumno con acompañamiento",
      color: "#f43f5e",
      content: (
        <div>
          <p style={{ fontSize: "1.05rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            En las salas de 4 y 5 años con educación inclusiva en Formosa, la falta de un canal compartido entre la docente (Lucía) y el acompañante terapéutico (Mateo) genera instrucciones opuestas hacia el niño (Mauricio).
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "rgba(244, 63, 94, 0.12)", border: "1px solid rgba(244, 63, 94, 0.3)", padding: "1rem", borderRadius: "12px" }}>
              <div style={{ fontWeight: "700", color: "#fda4af", marginBottom: "0.25rem" }}>Sin SincroAula</div>
              <ul style={{ fontSize: "0.85rem", color: "#e2e8f0", paddingLeft: "1.2rem", lineHeight: 1.5 }}>
                <li>Pasillos y cuadernos informales</li>
                <li>El AT no conoce la planificación del día</li>
                <li>Desregulación emocional y frustración del niño</li>
              </ul>
            </div>
            <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "1rem", borderRadius: "12px" }}>
              <div style={{ fontWeight: "700", color: "#6ee7b7", marginBottom: "0.25rem" }}>Con SincroAula v3</div>
              <ul style={{ fontSize: "0.85rem", color: "#e2e8f0", paddingLeft: "1.2rem", lineHeight: 1.5 }}>
                <li>Protocolos sensoriales unificados</li>
                <li>Planificación compartida anticipadamente</li>
                <li>Alertas instantáneas y bitácora clínica</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      tag: "ECOSISTEMA INTERACTIVO",
      title: "SincroAula v3: Comunicación en Tiempo Real",
      subtitle: "La primera plataforma diseñada para la tríada educativa y de salud",
      color: "#3b82f6",
      content: (
        <div>
          <p style={{ fontSize: "1.05rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            Un espacio de trabajo interactivo que conecta a tres actores fundamentales en un entorno unificado y seguro:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            <div style={{ background: "rgba(37, 99, 235, 0.15)", border: "1px solid rgba(37, 99, 235, 0.3)", padding: "1rem", borderRadius: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>🎓</div>
              <div style={{ fontWeight: "700", color: "#93c5fd" }}>Docente</div>
              <div style={{ fontSize: "0.8rem", color: "#bfdbfe", marginTop: "0.25rem" }}>Semáforo de aula, alertas rápidas al AT y bitácora pedagógica</div>
            </div>
            <div style={{ background: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.3)", padding: "1rem", borderRadius: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>🩺</div>
              <div style={{ fontWeight: "700", color: "#c4b5fd" }}>Terapeuta / AT</div>
              <div style={{ fontSize: "0.8rem", color: "#ddd6fe", marginTop: "0.25rem" }}>Caja sensorial, pautas de autorregulación y evolución</div>
            </div>
            <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "1rem", borderRadius: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>👨‍👩‍👦</div>
              <div style={{ fontWeight: "700", color: "#6ee7b7" }}>Tutor / Familia</div>
              <div style={{ fontSize: "0.8rem", color: "#a7f3d0", marginTop: "0.25rem" }}>Resumen diario transparente, medallas de logros y notas</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      tag: "INNOVACIÓN VISUAL",
      title: "Semáforo Sensorial y Emocional en Vivo",
      subtitle: "Un lenguaje visual común para anticipar y regular estímulos",
      color: "#f59e0b",
      content: (
        <div>
          <p style={{ fontSize: "1.05rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "1rem" }}>
            Permite conocer el estado del alumno de un vistazo durante toda la jornada. ¡Pruébalo interactuando con los botones abajo!
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", justifyContent: "center" }}>
            <button
              onClick={() => setDemoSemaforo("VERDE")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "2px solid #10b981",
                background: demoSemaforo === "VERDE" ? "#10b981" : "transparent",
                color: demoSemaforo === "VERDE" ? "white" : "#6ee7b7",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              🟢 Verde (Calmo)
            </button>
            <button
              onClick={() => setDemoSemaforo("AMARILLO")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "2px solid #f59e0b",
                background: demoSemaforo === "AMARILLO" ? "#f59e0b" : "transparent",
                color: demoSemaforo === "AMARILLO" ? "white" : "#fde68a",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              🟡 Amarillo (Inquieto)
            </button>
            <button
              onClick={() => setDemoSemaforo("ROJO")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "2px solid #ef4444",
                background: demoSemaforo === "ROJO" ? "#ef4444" : "transparent",
                color: demoSemaforo === "ROJO" ? "white" : "#fca5a5",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              🔴 Rojo (Pausa)
            </button>
          </div>

          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              background:
                demoSemaforo === "VERDE"
                  ? "rgba(16, 185, 129, 0.2)"
                  : demoSemaforo === "AMARILLO"
                  ? "rgba(245, 158, 11, 0.2)"
                  : "rgba(239, 68, 68, 0.2)",
              border: `1px solid ${demoSemaforo === "VERDE" ? "#10b981" : demoSemaforo === "AMARILLO" ? "#f59e0b" : "#ef4444"}`,
              textAlign: "center",
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ fontWeight: "800", fontSize: "1.1rem", color: "white" }}>
              Estado Actual: {demoSemaforo}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#e2e8f0", marginTop: "0.25rem" }}>
              {demoSemaforo === "VERDE" && "El alumno se encuentra enfocado, receptivo y jugando armoniosamente en la sala."}
              {demoSemaforo === "AMARILLO" && "Sobrecarga de estímulos auditivos. Se activa la estrategia de pausas sensoriales."}
              {demoSemaforo === "ROJO" && "Desregulación motriz o llanto. El AT interviene en el rincón de calma sin invadir."}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      tag: "ARQUITECTURA & ESTÁNDARES",
      title: "Solidez Técnica: Buenas Prácticas IPF",
      subtitle: "Diseñado cumpliendo con todas las consignas académicas del Politécnico",
      color: "#8b5cf6",
      content: (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <div style={{ fontWeight: "700", color: "#38bdf8", marginBottom: "0.5rem" }}>Base de Datos Relacional</div>
              <ul style={{ fontSize: "0.825rem", color: "#cbd5e1", lineHeight: 1.6, paddingLeft: "1.2rem" }}>
                <li>Sequelize ORM con <code>paranoid: true</code> para borrado lógico</li>
                <li>Relaciones 1:1, 1:N y N:M sin redundancia</li>
                <li>Soporte MySQL (WampServer) + SQLite portable</li>
              </ul>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <div style={{ fontWeight: "700", color: "#a78bfa", marginBottom: "0.5rem" }}>Seguridad y Validaciones</div>
              <ul style={{ fontSize: "0.825rem", color: "#cbd5e1", lineHeight: 1.6, paddingLeft: "1.2rem" }}>
                <li>JWT firmado en cookies <code>httpOnly</code> seguras</li>
                <li>Contraseñas cifradas con <code>bcrypt</code></li>
                <li><code>express-validator</code> con <code>.optional()</code> y <code>matchedData()</code></li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Auto-play timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const current = slides[currentSlide];

  return (
    <div className="card-pitch-dark" style={{ overflow: "hidden", position: "relative", marginBottom: "2rem" }}>
      {/* Barra Superior estilo Pitch */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(15, 23, 42, 0.6)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span
            style={{
              background: current.color,
              color: "white",
              padding: "0.2rem 0.6rem",
              borderRadius: "6px",
              fontSize: "0.725rem",
              fontWeight: "800",
              letterSpacing: "0.05em",
            }}
          >
            {current.tag}
          </span>
          <span style={{ fontSize: "0.825rem", color: "#94a3b8" }}>
            Diapositiva {currentSlide + 1} de {slides.length}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              color: "white",
              padding: "0.4rem 0.75rem",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.75rem",
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? "Pausar" : "Auto-avance"}</span>
          </button>
          <button
            onClick={prevSlide}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              color: "white",
              padding: "0.4rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextSlide}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              color: "white",
              padding: "0.4rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Contenido Dinámico de la Diapositiva */}
      <div style={{ padding: "2rem 2.25rem", minHeight: "260px" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#ffffff", marginBottom: "0.35rem" }}>
          {current.title}
        </h2>
        <div style={{ fontSize: "0.95rem", color: current.color, fontWeight: "600", marginBottom: "1.25rem" }}>
          {current.subtitle}
        </div>
        {current.content}
      </div>

      {/* Selector de diapositivas inferior (dots interactivos) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "0.85rem",
          background: "rgba(15, 23, 42, 0.4)",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            style={{
              width: idx === currentSlide ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: idx === currentSlide ? s.color : "rgba(255, 255, 255, 0.2)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PitchPresentationDeck;
