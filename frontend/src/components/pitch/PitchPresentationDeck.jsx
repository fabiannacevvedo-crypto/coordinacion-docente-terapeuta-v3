import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Brain,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const PitchPresentationDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoSemaforo, setDemoSemaforo] = useState("VERDE");

  const slides = [
    {
      id: 1,
      tag: "EL PROBLEMA REAL",
      title: "Descoordinación en el Aula Inclusiva",
      subtitle: "Mensajes contradictorios hacia el alumno con acompañamiento terapéutico",
      color: "#f43f5e",
      content: (
        <div>
          <p style={{ fontSize: "1.05rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            En las salas escolares con educación inclusiva, la falta de un canal digital compartido entre el rol docente y el acompañante terapéutico genera instrucciones opuestas o desfasadas hacia el alumno con TDAH, afectando su atención ejecutiva y su autorregulación.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "rgba(244, 63, 94, 0.12)", border: "1px solid rgba(244, 63, 94, 0.3)", padding: "1rem", borderRadius: "12px" }}>
              <div style={{ fontWeight: "700", color: "#fda4af", marginBottom: "0.25rem" }}>Sin SincroAula</div>
              <ul style={{ fontSize: "0.85rem", color: "#e2e8f0", paddingLeft: "1.2rem", lineHeight: 1.5 }}>
                <li>Comunicación informal de pasillo o cuadernos sueltos</li>
                <li>Tareas enviadas al hogar sin adaptación previa para TDAH</li>
                <li>Sobrecarga cognitiva, desatención y frustración escolar</li>
              </ul>
            </div>
            <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "1rem", borderRadius: "12px" }}>
              <div style={{ fontWeight: "700", color: "#6ee7b7", marginBottom: "0.25rem" }}>Con SincroAula</div>
              <ul style={{ fontSize: "0.85rem", color: "#e2e8f0", paddingLeft: "1.2rem", lineHeight: 1.5 }}>
                <li>Circuito Docente → Terapeuta (Adaptación TDAH) → Tutor</li>
                <li>Presentaciones adaptadas y micro-segmentación de tareas</li>
                <li>Chat en tiempo real y monitoreo conductual unificado</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      tag: "FLUJO NEUROEDUCATIVO TDAH",
      title: "SincroAula: Coordinación Tripartita en Tiempo Real",
      subtitle: "El puente tecnológico entre la enseñanza, la clínica terapéutica y la familia",
      color: "#3b82f6",
      content: (
        <div>
          <p style={{ fontSize: "1.05rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            Cada rol cuenta con herramientas específicas que transforman el acompañamiento terapéutico tradicional en un ecosistema digital sincronizado:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            <div style={{ background: "rgba(37, 99, 235, 0.15)", border: "1px solid rgba(37, 99, 235, 0.3)", padding: "1rem", borderRadius: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>🎓</div>
              <div style={{ fontWeight: "700", color: "#93c5fd" }}>Rol Docente</div>
              <div style={{ fontSize: "0.8rem", color: "#bfdbfe", marginTop: "0.25rem" }}>
                Registro de alumnos, creación de presentaciones adaptadas, envío de tareas al terapeuta y chat con familias
              </div>
            </div>
            <div style={{ background: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.3)", padding: "1rem", borderRadius: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>🩺</div>
              <div style={{ fontWeight: "700", color: "#c4b5fd" }}>Rol Terapeuta</div>
              <div style={{ fontSize: "0.8rem", color: "#ddd6fe", marginTop: "0.25rem" }}>
                Adaptación de tareas con pautas TDAH (Chunking, Pomodoro, Autoinstrucciones) y caja clínica avanzada
              </div>
            </div>
            <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "1rem", borderRadius: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>👨‍👩‍👦</div>
              <div style={{ fontWeight: "700", color: "#6ee7b7" }}>Familiar / Tutor</div>
              <div style={{ fontSize: "0.8rem", color: "#a7f3d0", marginTop: "0.25rem" }}>
                Visualización de tareas adaptadas y envío de reportes de actividad al Docente, al Terapeuta o a ambos
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      tag: "REGULACIÓN ATENCIONAL Y EMOCIONAL",
      title: "Semáforo Sensorial y Ejecutivo en Vivo",
      subtitle: "Un lenguaje visual común para anticipar la fatiga atencional y la hiperactividad",
      color: "#f59e0b",
      content: (
        <div>
          <p style={{ fontSize: "1.05rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "1rem" }}>
            Permite conocer el nivel de autorregulación y foco atencional del alumno en tiempo real. ¡Interactúa con los estados abajo!
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
              🟢 Verde (Foco Activo)
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
              🟡 Amarillo (Inquietud / Distracción)
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
              🔴 Rojo (Sobrecarga / Pausa)
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
              Estado Actual del Alumno: {demoSemaforo}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#e2e8f0", marginTop: "0.25rem" }}>
              {demoSemaforo === "VERDE" && "Atención sostenida óptima. Trabajando con consignas divididas en pasos cortos y refuerzo positivo."}
              {demoSemaforo === "AMARILLO" && "Aparece fatiga ejecutiva o inquietud motora. Se activa pausa kinestésica de 2 minutos y reloj visual."}
              {demoSemaforo === "ROJO" && "Desregulación por exceso de estímulos. Se aplica protocolo de respiración 4-4-4 y reducción sensorial."}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      tag: "TECNOLOGÍA APLICADA AL TDAH",
      title: "Andamiaje Ejecutivo y Adaptación Clínica Digital",
      subtitle: "Lo más actual del acompañamiento terapéutico integrado en la plataforma",
      color: "#8b5cf6",
      content: (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <div style={{ fontWeight: "700", color: "#38bdf8", marginBottom: "0.5rem" }}>Intervención en Función Ejecutiva</div>
              <ul style={{ fontSize: "0.825rem", color: "#cbd5e1", lineHeight: 1.6, paddingLeft: "1.2rem" }}>
                <li>Micro-segmentación de tareas (Chunking) para memoria de trabajo</li>
                <li>Temporizadores visuales interactivos (Time-Timer / Bloques Pomodoro)</li>
                <li>Autoinstrucciones de Meichenbaum para control de impulsividad</li>
              </ul>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <div style={{ fontWeight: "700", color: "#a78bfa", marginBottom: "0.5rem" }}>Trazabilidad y Feedback Familiar</div>
              <ul style={{ fontSize: "0.825rem", color: "#cbd5e1", lineHeight: 1.6, paddingLeft: "1.2rem" }}>
                <li>Doble validación: Docente diseña → Terapeuta adapta → Tutor recibe</li>
                <li>Economía de fichas digital con refuerzo dopaminérgico inmediato</li>
                <li>Reportes desde el hogar dirigidos al Docente, al Terapeuta o a ambos</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ];

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
            Paso {currentSlide + 1} de {slides.length}
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

      <div style={{ padding: "2rem 2.25rem", minHeight: "260px" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#ffffff", marginBottom: "0.35rem" }}>
          {current.title}
        </h2>
        <div style={{ fontSize: "0.95rem", color: current.color, fontWeight: "600", marginBottom: "1.25rem" }}>
          {current.subtitle}
        </div>
        {current.content}
      </div>

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
