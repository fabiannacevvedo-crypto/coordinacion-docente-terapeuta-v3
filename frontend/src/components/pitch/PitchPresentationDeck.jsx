import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Brain,
  CheckCircle2,
  GraduationCap,
  Stethoscope,
  Users,
  Activity,
  Clock,
  Sliders,
  ArrowRight,
  AlertTriangle,
  Layers,
  MessageSquare,
  FileCheck,
} from "lucide-react";

export const PitchPresentationDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Estados interactivos de cada diapositiva del carrusel
  const [modoComparacion, setModoComparacion] = useState("CON_SINCROAULA");
  const [rolExplorado, setRolExplorado] = useState("TERAPEUTA");
  const [demoSemaforo, setDemoSemaforo] = useState("VERDE");
  const [pasoCircuito, setPasoCircuito] = useState(1);
  const [pautaInteractiva, setPautaInteractiva] = useState("CHUNKING");

  const detalleRoles = {
    DOCENTE: {
      titulo: "Rol Docente · Gestión Pedagógica y Neuroeducativa",
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.14)",
      border: "rgba(59, 130, 246, 0.35)",
      acciones: [
        "Registra alumnos con perfil neuroeducativo y subtipo de TDAH",
        "Crea Presentaciones Adaptadas sin distractores visuales (1 consigna por pantalla)",
        "Asigna tareas individuales o en conjunto enviándolas primero al Terapeuta",
        "Coordina en vivo mediante el Radar Sensorial de Aula y el Chat Multicanal",
      ],
    },
    TERAPEUTA: {
      titulo: "Rol Terapeuta / AT · Adaptación Clínica TDAH y Andamiaje Ejecutivo",
      color: "#a855f7",
      bg: "rgba(168, 85, 247, 0.14)",
      border: "rgba(168, 85, 247, 0.35)",
      acciones: [
        "Recibe la tarea del Docente antes de que sea enviada a la familia",
        "Aplica micro-segmentación (Chunking), tiempos Pomodoro y pausas kinestésicas",
        "Opera la Caja Clínica TDAH: Respiración 4-4-4, Time-Timer, Meichenbaum y Economía de Fichas",
        "Registra matrices conductuales ABC y emite recomendaciones directas al aula",
      ],
    },
    FAMILIAR: {
      titulo: "Familiar / Tutor · Acompañamiento Guiado y Devolución desde el Hogar",
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.14)",
      border: "rgba(16, 185, 129, 0.35)",
      acciones: [
        "Visualiza la tarea ya adaptada paso a paso con el nombre del Docente y Terapeuta",
        "Aplica en casa el checklist interactivo de micro-misiones y pausas sugeridas",
        "Envía un reporte o mensaje sobre cómo estuvo su hijo eligiendo destinatario (Docente, Terapeuta o Ambos)",
        "Celebra logros semanales y mantiene comunicación fluida sin tecnicismos complejos",
      ],
    },
  };

  const slides = [
    {
      id: 1,
      tabLabel: "1. Problema vs Solución",
      tag: "EL PROBLEMA REAL",
      title: "Descoordinación en el Aula Inclusiva",
      subtitle: "Impacto de las instrucciones fragmentadas en el alumno con TDAH",
      color: "#f43f5e",
      content: (
        <div>
          <p style={{ fontSize: "0.975rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "1rem" }}>
            En las salas escolares con educación inclusiva, la falta de un canal digital compartido entre el rol docente y el acompañante terapéutico genera instrucciones opuestas o tareas sin adaptar hacia el alumno con TDAH, saturando su memoria de trabajo.
          </p>

          {/* Selector interactivo Antes / Después */}
          <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={() => setModoComparacion("SIN_SINCROAULA")}
              style={{
                flex: 1,
                padding: "0.6rem 1rem",
                borderRadius: "10px",
                border: `1px solid ${modoComparacion === "SIN_SINCROAULA" ? "#f43f5e" : "rgba(255,255,255,0.12)"}`,
                background: modoComparacion === "SIN_SINCROAULA" ? "rgba(244, 63, 94, 0.2)" : "rgba(255,255,255,0.04)",
                color: modoComparacion === "SIN_SINCROAULA" ? "#fda4af" : "#94a3b8",
                fontWeight: "800",
                fontSize: "0.825rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
              }}
            >
              <AlertTriangle size={15} />
              <span>Escenario Tradicional (Sin SincroAula)</span>
            </button>

            <button
              type="button"
              onClick={() => setModoComparacion("CON_SINCROAULA")}
              style={{
                flex: 1,
                padding: "0.6rem 1rem",
                borderRadius: "10px",
                border: `1px solid ${modoComparacion === "CON_SINCROAULA" ? "#10b981" : "rgba(255,255,255,0.12)"}`,
                background: modoComparacion === "CON_SINCROAULA" ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.04)",
                color: modoComparacion === "CON_SINCROAULA" ? "#6ee7b7" : "#94a3b8",
                fontWeight: "800",
                fontSize: "0.825rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
              }}
            >
              <CheckCircle2 size={15} />
              <span>Ecosistema SincroAula (Sincronizado)</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div
              style={{
                background: modoComparacion === "SIN_SINCROAULA" ? "rgba(244, 63, 94, 0.16)" : "rgba(244, 63, 94, 0.08)",
                border: `1px solid ${modoComparacion === "SIN_SINCROAULA" ? "#f43f5e" : "rgba(244, 63, 94, 0.25)"}`,
                padding: "1.1rem",
                borderRadius: "12px",
                transition: "all 0.25s",
              }}
            >
              <div style={{ fontWeight: "800", color: "#fda4af", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <AlertTriangle size={16} />
                <span>Sin SincroAula</span>
              </div>
              <ul style={{ fontSize: "0.84rem", color: "#e2e8f0", paddingLeft: "1.1rem", lineHeight: 1.6 }}>
                <li>Comunicación informal de pasillo o cuadernos sueltos</li>
                <li>Tareas enviadas al hogar sin adaptación previa para TDAH</li>
                <li>Sobrecarga cognitiva, fatiga ejecutiva y frustración familiar</li>
              </ul>
            </div>

            <div
              style={{
                background: modoComparacion === "CON_SINCROAULA" ? "rgba(16, 185, 129, 0.16)" : "rgba(16, 185, 129, 0.08)",
                border: `1px solid ${modoComparacion === "CON_SINCROAULA" ? "#10b981" : "rgba(16, 185, 129, 0.25)"}`,
                padding: "1.1rem",
                borderRadius: "12px",
                transition: "all 0.25s",
              }}
            >
              <div style={{ fontWeight: "800", color: "#6ee7b7", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <CheckCircle2 size={16} />
                <span>Con SincroAula</span>
              </div>
              <ul style={{ fontSize: "0.84rem", color: "#e2e8f0", paddingLeft: "1.1rem", lineHeight: 1.6 }}>
                <li>Circuito validado: Docente → Terapeuta (Adaptación TDAH) → Tutor</li>
                <li>Presentaciones adaptadas y micro-segmentación en pasos cortos</li>
                <li>Chat multicanal en vivo y reporte directo desde el hogar</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      tabLabel: "2. Tríada Interactiva",
      tag: "ARQUITECTURA DE ROLES",
      title: "SincroAula: Coordinación Tripartita en Tiempo Real",
      subtitle: "Haz clic en cada rol para explorar sus herramientas conectadas",
      color: "#3b82f6",
      content: (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={() => setRolExplorado("DOCENTE")}
              style={{
                background: rolExplorado === "DOCENTE" ? "rgba(37, 99, 235, 0.28)" : "rgba(37, 99, 235, 0.1)",
                border: `2px solid ${rolExplorado === "DOCENTE" ? "#60a5fa" : "rgba(37, 99, 235, 0.25)"}`,
                padding: "0.85rem",
                borderRadius: "12px",
                textAlign: "left",
                cursor: "pointer",
                color: "white",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <GraduationCap size={20} color="#93c5fd" />
                <span style={{ fontWeight: "800", color: "#93c5fd" }}>Rol Docente</span>
              </div>
              <div style={{ fontSize: "0.775rem", color: "#cbd5e1" }}>
                Presentaciones adaptadas, registro de alumnos y asignación de tareas
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRolExplorado("TERAPEUTA")}
              style={{
                background: rolExplorado === "TERAPEUTA" ? "rgba(124, 58, 237, 0.28)" : "rgba(124, 58, 237, 0.1)",
                border: `2px solid ${rolExplorado === "TERAPEUTA" ? "#c084fc" : "rgba(124, 58, 237, 0.25)"}`,
                padding: "0.85rem",
                borderRadius: "12px",
                textAlign: "left",
                cursor: "pointer",
                color: "white",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <Stethoscope size={20} color="#c4b5fd" />
                <span style={{ fontWeight: "800", color: "#c4b5fd" }}>Rol Terapeuta</span>
              </div>
              <div style={{ fontSize: "0.775rem", color: "#cbd5e1" }}>
                Adaptación curricular TDAH, caja clínica y monitoreo ejecutivo
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRolExplorado("FAMILIAR")}
              style={{
                background: rolExplorado === "FAMILIAR" ? "rgba(16, 185, 129, 0.28)" : "rgba(16, 185, 129, 0.1)",
                border: `2px solid ${rolExplorado === "FAMILIAR" ? "#34d399" : "rgba(16, 185, 129, 0.25)"}`,
                padding: "0.85rem",
                borderRadius: "12px",
                textAlign: "left",
                cursor: "pointer",
                color: "white",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <Users size={20} color="#6ee7b7" />
                <span style={{ fontWeight: "800", color: "#6ee7b7" }}>Familiar / Tutor</span>
              </div>
              <div style={{ fontSize: "0.775rem", color: "#cbd5e1" }}>
                Recepción de tareas adaptadas y reporte de actividad al equipo
              </div>
            </button>
          </div>

          {/* Detalle dinámico del rol seleccionado */}
          <div
            style={{
              background: detalleRoles[rolExplorado].bg,
              border: `1px solid ${detalleRoles[rolExplorado].border}`,
              borderRadius: "12px",
              padding: "1rem 1.25rem",
            }}
          >
            <div style={{ fontWeight: "800", color: "white", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
              {detalleRoles[rolExplorado].titulo}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {detalleRoles[rolExplorado].acciones.map((acc, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.45rem", fontSize: "0.82rem", color: "#e2e8f0" }}>
                  <CheckCircle2 size={15} color={detalleRoles[rolExplorado].color} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{acc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      tabLabel: "3. Simulador Circuito TDAH",
      tag: "FLUJO DE TRABAJO INNOVADOR",
      title: "Circuito de Adaptación de Tareas para TDAH",
      subtitle: "Simula los 3 pasos desde que el Docente crea la tarea hasta que el Tutor reporta el resultado",
      color: "#8b5cf6",
      content: (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.65rem", marginBottom: "1rem" }}>
            {[
              { step: 1, title: "Paso 1: Docente Asigna", sub: "Individual o en Conjunto", color: "#3b82f6" },
              { step: 2, title: "Paso 2: Terapeuta Adapta", sub: "Pautas específicas TDAH", color: "#8b5cf6" },
              { step: 3, title: "Paso 3: Tutor Reporta", sub: "Devolución desde el hogar", color: "#10b981" },
            ].map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => setPasoCircuito(item.step)}
                style={{
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: `2px solid ${pasoCircuito === item.step ? item.color : "rgba(255,255,255,0.1)"}`,
                  background: pasoCircuito === item.step ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                  color: "white",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: "0.825rem", fontWeight: "800", color: pasoCircuito === item.step ? "#ffffff" : "#94a3b8" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#cbd5e1" }}>{item.sub}</div>
              </button>
            ))}
          </div>

          {pasoCircuito === 1 && (
            <div style={{ background: "rgba(37, 99, 235, 0.14)", border: "1px solid rgba(59, 130, 246, 0.35)", padding: "1.1rem", borderRadius: "12px" }}>
              <div style={{ fontWeight: "800", color: "#93c5fd", marginBottom: "0.35rem" }}>
                1. El Rol Docente diseña la consigna pedagógica original
              </div>
              <p style={{ fontSize: "0.85rem", color: "#e2e8f0", lineHeight: 1.55 }}>
                El docente selecciona si la actividad es para un alumno puntual o para toda la sala en conjunto. En lugar de enviarla en bruto a la familia, el sistema la deriva automáticamente a la bandeja clínica del <strong>Rol Terapeuta</strong> (`PENDIENTE_TERAPEUTA`).
              </p>
            </div>
          )}

          {pasoCircuito === 2 && (
            <div style={{ background: "rgba(139, 92, 246, 0.14)", border: "1px solid rgba(168, 85, 247, 0.35)", padding: "1.1rem", borderRadius: "12px" }}>
              <div style={{ fontWeight: "800", color: "#c4b5fd", marginBottom: "0.35rem" }}>
                2. El Rol Terapeuta transforma la consigna con pautas neuroeducativas TDAH
              </div>
              <p style={{ fontSize: "0.85rem", color: "#e2e8f0", lineHeight: 1.55 }}>
                El terapeuta micro-segmenta la tarea en 3 misiones cortas (*Chunking*), incorpora bloques de enfoque con Temporizador Visual Pomodoro (5 min), intercalando pausas kinestésicas y reduciendo estímulos distractores antes de remitirla al Tutor (`ADAPTADA_ENVIADA_TUTOR`).
              </p>
            </div>
          )}

          {pasoCircuito === 3 && (
            <div style={{ background: "rgba(16, 185, 129, 0.14)", border: "1px solid rgba(16, 185, 129, 0.35)", padding: "1.1rem", borderRadius: "12px" }}>
              <div style={{ fontWeight: "800", color: "#6ee7b7", marginBottom: "0.35rem" }}>
                3. El Familiar / Tutor visualiza la adaptación y envía su reporte
              </div>
              <p style={{ fontSize: "0.85rem", color: "#e2e8f0", lineHeight: 1.55 }}>
                El tutor ve la tarea con los nombres del Docente y del Terapeuta, realiza los pasos cortos con su hijo y envía un reporte calificando el nivel de atención en casa, eligiendo si notificar al <strong>Rol Docente</strong>, al <strong>Rol Terapeuta</strong> o a <strong>Ambos</strong>.
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 4,
      tabLabel: "4. Semáforo Ejecutivo",
      tag: "REGULACIÓN ATENCIONAL EN VIVO",
      title: "Semáforo Sensorial y Ejecutivo Interactivo",
      subtitle: "Lenguaje visual compartido para anticipar la fatiga atencional y la hiperactividad",
      color: "#f59e0b",
      content: (
        <div>
          <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: 1.55, marginBottom: "0.9rem" }}>
            Permite sincronizar en tiempo real el estado de foco atencional y regulación motriz del alumno. Prueba cada estado para ver el protocolo clínico que se activa:
          </p>
          <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setDemoSemaforo("VERDE")}
              style={{
                padding: "0.55rem 1.1rem",
                borderRadius: "10px",
                border: "2px solid #10b981",
                background: demoSemaforo === "VERDE" ? "#10b981" : "transparent",
                color: demoSemaforo === "VERDE" ? "white" : "#6ee7b7",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              <span className="semaforo-dot semaforo-verde" />
              <span>Estado Verde (Foco Activo)</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoSemaforo("AMARILLO")}
              style={{
                padding: "0.55rem 1.1rem",
                borderRadius: "10px",
                border: "2px solid #f59e0b",
                background: demoSemaforo === "AMARILLO" ? "#f59e0b" : "transparent",
                color: demoSemaforo === "AMARILLO" ? "white" : "#fde68a",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              <span className="semaforo-dot semaforo-amarillo" />
              <span>Estado Amarillo (Inquietud / Distracción)</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoSemaforo("ROJO")}
              style={{
                padding: "0.55rem 1.1rem",
                borderRadius: "10px",
                border: "2px solid #ef4444",
                background: demoSemaforo === "ROJO" ? "#ef4444" : "transparent",
                color: demoSemaforo === "ROJO" ? "white" : "#fca5a5",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              <span className="semaforo-dot semaforo-rojo" />
              <span>Estado Rojo (Sobrecarga / Pausa)</span>
            </button>
          </div>

          <div
            style={{
              padding: "1.1rem",
              borderRadius: "12px",
              background:
                demoSemaforo === "VERDE"
                  ? "rgba(16, 185, 129, 0.18)"
                  : demoSemaforo === "AMARILLO"
                  ? "rgba(245, 158, 11, 0.18)"
                  : "rgba(239, 68, 68, 0.18)",
              border: `1px solid ${demoSemaforo === "VERDE" ? "#10b981" : demoSemaforo === "AMARILLO" ? "#f59e0b" : "#ef4444"}`,
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ fontWeight: "800", fontSize: "1.05rem", color: "white", marginBottom: "0.3rem" }}>
              Protocolo Activo en Sala para Estado {demoSemaforo}:
            </div>
            <div style={{ fontSize: "0.875rem", color: "#e2e8f0", lineHeight: 1.55 }}>
              {demoSemaforo === "VERDE" &&
                "Atención sostenida óptima. El alumno avanza con presentaciones adaptadas de consigna única y recibe refuerzo inmediato en el tablero de Economía de Fichas."}
              {demoSemaforo === "AMARILLO" &&
                "Se detecta fatiga en memoria de trabajo o hiperactividad motora. Se activa pausa kinestésica de 2 minutos, encargo activo en el aula y Temporizador Visual Time-Timer."}
              {demoSemaforo === "ROJO" &&
                "Sobrecarga sensorial o bloqueo ejecutivo. El Acompañante Terapéutico interviene con la Guía de Respiración 4-4-4 y reducción de estímulos acústicos sin connotación de castigo."}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      tabLabel: "5. Herramientas TDAH",
      tag: "TECNOLOGÍA NEUROEDUCATIVA",
      title: "Andamiaje Ejecutivo Digital para el TDAH",
      subtitle: "Explora cómo llevamos las técnicas del Acompañante Terapéutico a herramientas interactivas",
      color: "#06b6d4",
      content: (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginBottom: "1rem" }}>
            {[
              { id: "CHUNKING", label: "Micro-segmentación" },
              { id: "TIMER", label: "Reloj Visual TDAH" },
              { id: "MEICHENBAUM", label: "Autoinstrucciones" },
              { id: "FICHAS", label: "Economía de Fichas" },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setPautaInteractiva(b.id)}
                style={{
                  padding: "0.55rem 0.5rem",
                  borderRadius: "8px",
                  border: `1px solid ${pautaInteractiva === b.id ? "#38bdf8" : "rgba(255,255,255,0.12)"}`,
                  background: pautaInteractiva === b.id ? "rgba(6, 182, 212, 0.22)" : "rgba(255,255,255,0.04)",
                  color: pautaInteractiva === b.id ? "#7dd3fc" : "#cbd5e1",
                  fontWeight: "700",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1.1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.12)" }}>
            {pautaInteractiva === "CHUNKING" && (
              <div>
                <div style={{ fontWeight: "800", color: "#38bdf8", marginBottom: "0.35rem" }}>
                  Micro-segmentación de Consignas (Chunking Ejecutivo)
                </div>
                <p style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                  Divide actividades largas en 3 pasos cortos y secuenciales con una sola instrucción visible a la vez. Evita la parálisis por sobrecarga en la memoria de trabajo verbal y no verbal del alumno con TDAH.
                </p>
              </div>
            )}
            {pautaInteractiva === "TIMER" && (
              <div>
                <div style={{ fontWeight: "800", color: "#38bdf8", marginBottom: "0.35rem" }}>
                  Externalización del Tiempo (Time-Timer / Bloques Pomodoro)
                </div>
                <p style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                  Compensa la dificultad en la percepción temporal propia del TDAH mediante barras visuales regresivas de 3, 5 y 10 minutos, combinando momentos de enfoque corto con pausas motoras programadas.
                </p>
              </div>
            )}
            {pautaInteractiva === "MEICHENBAUM" && (
              <div>
                <div style={{ fontWeight: "800", color: "#38bdf8", marginBottom: "0.35rem" }}>
                  Autoinstrucciones Cognitivas de Meichenbaum
                </div>
                <p style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                  Entrena el freno inhibitorio y el lenguaje interno mediante 4 pasos interactivos: 1. Paro y miro, 2. ¿Qué tengo que hacer?, 3. Lo hago con calma y 4. Reviso y me felicito.
                </p>
              </div>
            )}
            {pautaInteractiva === "FICHAS" && (
              <div>
                <div style={{ fontWeight: "800", color: "#38bdf8", marginBottom: "0.35rem" }}>
                  Economía de Fichas y Refuerzo Dopaminérgico Inmediato
                </div>
                <p style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                  El alumno con TDAH requiere retroalimentación positiva inmediata para sostener la motivación. Cada micro-paso completado en el aula o en el hogar otorga progreso visual hacia metas acordadas.
                </p>
              </div>
            )}
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
      }, 5500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const current = slides[currentSlide];

  return (
    <div className="card-pitch-dark" style={{ overflow: "hidden", position: "relative", marginBottom: "2rem" }}>
      {/* Barra de Progreso Superior Animada */}
      <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.08)" }}>
        <div
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            height: "100%",
            background: current.color,
            transition: "width 0.35s ease",
          }}
        />
      </div>

      {/* Cabecera y Pestañas Rápidas del Carrusel */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
          padding: "0.9rem 1.4rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(15, 23, 42, 0.7)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              style={{
                background: idx === currentSlide ? s.color : "rgba(255, 255, 255, 0.06)",
                color: idx === currentSlide ? "white" : "#94a3b8",
                border: "none",
                padding: "0.3rem 0.65rem",
                borderRadius: "6px",
                fontSize: "0.73rem",
                fontWeight: "800",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {s.tabLabel}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white",
              padding: "0.38rem 0.75rem",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? "Pausar" : "Auto-avance"}</span>
          </button>
          <button
            type="button"
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
            type="button"
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

      {/* Cuerpo del Carrusel */}
      <div style={{ padding: "1.75rem 2rem", minHeight: "285px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
          <span
            style={{
              background: current.color,
              color: "white",
              padding: "0.18rem 0.55rem",
              borderRadius: "6px",
              fontSize: "0.68rem",
              fontWeight: "800",
              letterSpacing: "0.05em",
            }}
          >
            {current.tag}
          </span>
          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "600" }}>
            Módulo {currentSlide + 1} de {slides.length}
          </span>
        </div>

        <h2 style={{ fontSize: "1.65rem", fontWeight: "900", color: "#ffffff", marginBottom: "0.25rem" }}>
          {current.title}
        </h2>
        <div style={{ fontSize: "0.92rem", color: current.color, fontWeight: "600", marginBottom: "1.15rem" }}>
          {current.subtitle}
        </div>
        {current.content}
      </div>

      {/* Indicadores Inferiores */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1.5rem",
          background: "rgba(15, 23, 42, 0.45)",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
          Showcase Interactivo SincroAula · Navega haciendo clic en las pestañas o flechas
        </span>
        <div style={{ display: "flex", gap: "0.45rem" }}>
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
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
    </div>
  );
};

export default PitchPresentationDeck;
