import React, { useState, useEffect } from "react";
import {
  Wind,
  Headphones,
  Compass,
  ShieldAlert,
  Clock,
  Brain,
  Award,
  Activity,
  CheckCircle2,
  RotateCcw,
  Play,
  Pause,
  Star,
  Gift,
  BarChart3,
  FileText,
  Send,
} from "lucide-react";

export const SensoryToolbox = ({ onEstrategiaSeleccionada, onEmitirRecomendacionRapida }) => {
  const [herramientaActiva, setHerramientaActiva] = useState("RESPIRACION");

  // 1. Estado de Respiración 4-4-4
  const [faseRespiracion, setFaseRespiracion] = useState("Inhala");
  const [contador, setContador] = useState(4);
  const [activo, setActivo] = useState(false);

  // 2. Estado de Temporizador Visual Time-Timer / Pomodoro TDAH
  const [tiempoPomodoro, setTiempoPomodoro] = useState(300);
  const [pomodoroTotal, setPomodoroTotal] = useState(300);
  const [pomodoroActivo, setPomodoroActivo] = useState(false);

  // 3. Estado de Autoinstrucciones de Meichenbaum (Control de Impulsividad TDAH - Sin Emojis)
  const [pasosMeichenbaum, setPasosMeichenbaum] = useState([
    { id: 1, titulo: "1. PARO Y MIRO", desc: "Freno mis manos, respiro y miro la hoja antes de empezar.", completado: false },
    { id: 2, titulo: "2. ¿QUÉ TENGO QUE HACER?", desc: "Leo o escucho solo el primer paso corto de la misión.", completado: false },
    { id: 3, titulo: "3. LO HAGO CON CALMA", desc: "Avanzo paso a paso siguiendo mi reloj visual sin apurarme.", completado: false },
    { id: 4, titulo: "4. REVISO Y ME FELICITO", desc: "Verifico si terminé el paso y celebro mi esfuerzo.", completado: false },
  ]);

  // 4. Economía de Fichas Dopaminérgica TDAH
  const [estrellasGanadas, setEstrellasGanadas] = useState(3);
  const metaEstrellas = 5;
  const [recompensaElegida, setRecompensaElegida] = useState("Elegir el juego de cierre o ser Ayudante de Sala");

  // 5. Termómetro de Función Ejecutiva y Atención TDAH
  const [nivelAtencion, setNivelAtencion] = useState(82);
  const [nivelHiperactividad, setNivelHiperactividad] = useState(30);
  const [nivelRegulacionEmocional, setNivelRegulacionEmocional] = useState(88);

  // 6. Registro Funcional ABC (Antecedente - Conducta - Consecuencia)
  const [abcForm, setAbcForm] = useState({
    antecedente: "Transición de actividad grupal con ruido en el pasillo",
    conducta: "Inquietud motora y dificultad para sostener el foco en la consigna",
    consecuencia: "Se aplicó micro-segmentación en 2 pasos + pausa activa con retorno a estado Verde",
  });
  const [abcGuardado, setAbcGuardado] = useState(false);

  useEffect(() => {
    let timer = null;
    if (activo) {
      timer = setInterval(() => {
        setContador((prev) => {
          if (prev > 1) return prev - 1;
          if (faseRespiracion === "Inhala") {
            setFaseRespiracion("Sostén");
            return 4;
          } else if (faseRespiracion === "Sostén") {
            setFaseRespiracion("Exhala");
            return 4;
          } else {
            setFaseRespiracion("Inhala");
            return 4;
          }
        });
      }, 1000);
    } else {
      setFaseRespiracion("Inhala");
      setContador(4);
    }
    return () => clearInterval(timer);
  }, [activo, faseRespiracion]);

  useEffect(() => {
    let timer = null;
    if (pomodoroActivo && tiempoPomodoro > 0) {
      timer = setInterval(() => {
        setTiempoPomodoro((prev) => prev - 1);
      }, 1000);
    } else if (tiempoPomodoro === 0) {
      setPomodoroActivo(false);
    }
    return () => clearInterval(timer);
  }, [pomodoroActivo, tiempoPomodoro]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const togglePasoMeichenbaum = (id) => {
    setPasosMeichenbaum((prev) =>
      prev.map((p) => (p.id === id ? { ...p, completado: !p.completado } : p))
    );
  };

  const tecnicas = [
    {
      titulo: "Micro-segmentación (Chunking)",
      desc: "Dividir la actividad en bloques de 1 sola instrucción visible para no saturar la memoria de trabajo.",
      color: "#10b981",
      icono: Compass,
    },
    {
      titulo: "Descarga Kinestésica Regulada",
      desc: "Permitir pausa motora de 2 min o rol de ayudante de materiales ante inquietud motriz.",
      color: "#f59e0b",
      icono: Activity,
    },
    {
      titulo: "Filtro Acústico y Visual",
      desc: "Reducir estímulos distractores en mesa y utilizar auriculares atenuadores de 22dB si hay ruido.",
      color: "#3b82f6",
      icono: Headphones,
    },
    {
      titulo: "Anclaje de Foco en Rincón de Calma",
      desc: "Pausa breve con presión propioceptiva y retorno gradual sin connotación de castigo.",
      color: "#8b5cf6",
      icono: ShieldAlert,
    },
  ];

  return (
    <div className="card" style={{ borderLeft: "4px solid var(--terapeuta-color)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <div style={{ background: "var(--terapeuta-bg)", padding: "0.5rem", borderRadius: "8px", color: "var(--terapeuta-color)" }}>
            <Brain size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#0f172a" }}>
              Caja de Herramientas Clínicas y Ejecutivas TDAH
            </h3>
            <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Andamiaje ejecutivo, autorregulación e intervención sincronizada
            </p>
          </div>
        </div>
      </div>

      {/* Pestañas de Herramientas Interactivas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem", marginBottom: "1rem" }}>
        <button
          type="button"
          onClick={() => setHerramientaActiva("RESPIRACION")}
          className="btn btn-sm"
          style={{
            background: herramientaActiva === "RESPIRACION" ? "var(--terapeuta-color)" : "#f1f5f9",
            color: herramientaActiva === "RESPIRACION" ? "white" : "#334155",
            fontSize: "0.72rem",
            padding: "0.4rem 0.5rem",
          }}
        >
          <Wind size={13} /> Respiración
        </button>

        <button
          type="button"
          onClick={() => setHerramientaActiva("POMODORO")}
          className="btn btn-sm"
          style={{
            background: herramientaActiva === "POMODORO" ? "var(--terapeuta-color)" : "#f1f5f9",
            color: herramientaActiva === "POMODORO" ? "white" : "#334155",
            fontSize: "0.72rem",
            padding: "0.4rem 0.5rem",
          }}
        >
          <Clock size={13} /> Reloj TDAH
        </button>

        <button
          type="button"
          onClick={() => setHerramientaActiva("MEICHENBAUM")}
          className="btn btn-sm"
          style={{
            background: herramientaActiva === "MEICHENBAUM" ? "var(--terapeuta-color)" : "#f1f5f9",
            color: herramientaActiva === "MEICHENBAUM" ? "white" : "#334155",
            fontSize: "0.72rem",
            padding: "0.4rem 0.5rem",
          }}
        >
          <Brain size={13} /> Meichenbaum
        </button>

        <button
          type="button"
          onClick={() => setHerramientaActiva("FICHAS")}
          className="btn btn-sm"
          style={{
            background: herramientaActiva === "FICHAS" ? "var(--terapeuta-color)" : "#f1f5f9",
            color: herramientaActiva === "FICHAS" ? "white" : "#334155",
            fontSize: "0.72rem",
            padding: "0.4rem 0.5rem",
          }}
        >
          <Award size={13} /> Fichas
        </button>

        <button
          type="button"
          onClick={() => setHerramientaActiva("ABC")}
          className="btn btn-sm"
          style={{
            background: herramientaActiva === "ABC" ? "var(--terapeuta-color)" : "#f1f5f9",
            color: herramientaActiva === "ABC" ? "white" : "#334155",
            fontSize: "0.72rem",
            padding: "0.4rem 0.5rem",
            gridColumn: "span 2",
          }}
        >
          <FileText size={13} /> Matriz Conductual ABC
        </button>
      </div>

      {/* HERRAMIENTA 1: Guía de Respiración 4-4-4 */}
      {herramientaActiva === "RESPIRACION" && (
        <div
          style={{
            background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
            border: "1px solid #ddd6fe",
            borderRadius: "14px",
            padding: "1.15rem",
            textAlign: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ fontSize: "0.825rem", fontWeight: "700", color: "#6d28d9", marginBottom: "0.4rem" }}>
            Guía de Respiración 4-4-4 (Descompresión Sensorial y Vagal)
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0.85rem 0" }}>
            <div
              style={{
                width: activo ? (faseRespiracion === "Inhala" ? "105px" : faseRespiracion === "Sostén" ? "105px" : "72px") : "82px",
                height: activo ? (faseRespiracion === "Inhala" ? "105px" : faseRespiracion === "Sostén" ? "105px" : "72px") : "82px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "900",
                boxShadow: activo ? "0 0 25px rgba(124, 58, 237, 0.45)" : "none",
                transition: "all 3.8s ease-in-out",
              }}
            >
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase" }}>{activo ? faseRespiracion : "Listo"}</span>
              {activo && <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{contador}</span>}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActivo(!activo)}
            className="btn btn-sm"
            style={{
              background: activo ? "#ef4444" : "var(--terapeuta-color)",
              color: "white",
              margin: "0 auto",
            }}
          >
            {activo ? "Detener Ejercicio" : "Iniciar Guía con Alumno"}
          </button>
        </div>
      )}

      {/* HERRAMIENTA 2: Temporizador Visual Time-Timer / Pomodoro TDAH */}
      {herramientaActiva === "POMODORO" && (
        <div
          style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            border: "1px solid #bfdbfe",
            borderRadius: "14px",
            padding: "1.15rem",
            textAlign: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ fontSize: "0.825rem", fontWeight: "800", color: "#1d4ed8", marginBottom: "0.25rem" }}>
            Temporizador Visual de Enfoque TDAH (Time-Timer)
          </div>
          <p style={{ fontSize: "0.725rem", color: "#475569", marginBottom: "0.75rem" }}>
            Externaliza el paso del tiempo para sostener la atención ejecutiva sin ansiedad
          </p>

          <div style={{ fontSize: "2.1rem", fontWeight: "900", color: "#0f172a", fontFamily: "monospace", marginBottom: "0.5rem" }}>
            {formatTime(tiempoPomodoro)}
          </div>

          <div style={{ width: "100%", height: "10px", background: "#cbd5e1", borderRadius: "999px", overflow: "hidden", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: `${(tiempoPomodoro / pomodoroTotal) * 100}%`,
                height: "100%",
                background: tiempoPomodoro > 60 ? "#2563eb" : "#f59e0b",
                transition: "width 0.5s linear",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
            {[
              { label: "3 min (Corto)", sec: 180 },
              { label: "5 min (Foco)", sec: 300 },
              { label: "10 min (Misión)", sec: 600 },
            ].map((b) => (
              <button
                key={b.sec}
                type="button"
                onClick={() => {
                  setPomodoroActivo(false);
                  setPomodoroTotal(b.sec);
                  setTiempoPomodoro(b.sec);
                }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: "0.7rem", padding: "0.25rem 0.5rem" }}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => setPomodoroActivo(!pomodoroActivo)}
              className="btn btn-primary btn-sm"
            >
              {pomodoroActivo ? <Pause size={14} /> : <Play size={14} />}
              <span>{pomodoroActivo ? "Pausar" : "Iniciar Bloque"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPomodoroActivo(false);
                setTiempoPomodoro(pomodoroTotal);
              }}
              className="btn btn-secondary btn-sm"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      )}

      {/* HERRAMIENTA 3: Autoinstrucciones de Meichenbaum */}
      {herramientaActiva === "MEICHENBAUM" && (
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            borderRadius: "14px",
            padding: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ fontSize: "0.825rem", fontWeight: "800", color: "#4c1d95", marginBottom: "0.25rem" }}>
            Guía de Autoinstrucciones de Meichenbaum (TDAH)
          </div>
          <p style={{ fontSize: "0.725rem", color: "#64748b", marginBottom: "0.65rem" }}>
            Entrenamiento metacognitivo en 4 pasos para frenar la respuesta impulsiva:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {pasosMeichenbaum.map((p) => (
              <div
                key={p.id}
                onClick={() => togglePasoMeichenbaum(p.id)}
                style={{
                  padding: "0.55rem 0.75rem",
                  borderRadius: "8px",
                  background: p.completado ? "#ecfdf5" : "white",
                  border: `1px solid ${p.completado ? "#10b981" : "#e2e8f0"}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: "800", color: p.completado ? "#065f46" : "#1e293b" }}>
                    {p.titulo}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{p.desc}</div>
                </div>
                <CheckCircle2 size={18} color={p.completado ? "#10b981" : "#cbd5e1"} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HERRAMIENTA 4: Economía de Fichas Dopaminérgica */}
      {herramientaActiva === "FICHAS" && (
        <div
          style={{
            background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
            border: "1px solid #fde68a",
            borderRadius: "14px",
            padding: "1.1rem",
            textAlign: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ fontSize: "0.825rem", fontWeight: "800", color: "#92400e", marginBottom: "0.25rem" }}>
            Tablero de Economía de Fichas y Refuerzo Inmediato
          </div>
          <p style={{ fontSize: "0.725rem", color: "#78350f", marginBottom: "0.65rem" }}>
            Recompensa dopaminérgica por cada micro-meta cumplida ({estrellasGanadas}/{metaEstrellas} logros)
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.45rem", marginBottom: "0.75rem" }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setEstrellasGanadas(num)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "none",
                  background: num <= estrellasGanadas ? "#f59e0b" : "white",
                  color: num <= estrellasGanadas ? "white" : "#cbd5e1",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: num <= estrellasGanadas ? "0 4px 10px rgba(245, 158, 11, 0.35)" : "none",
                }}
              >
                <Star size={20} fill={num <= estrellasGanadas ? "white" : "none"} />
              </button>
            ))}
          </div>

          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#92400e", background: "rgba(255,255,255,0.7)", padding: "0.45rem 0.65rem", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
            <Gift size={14} color="#d97706" />
            <span>Meta acordada: {recompensaElegida}</span>
          </div>
        </div>
      )}

      {/* HERRAMIENTA 5: Matriz Funcional Conductual ABC */}
      {herramientaActiva === "ABC" && (
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            borderRadius: "14px",
            padding: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ fontSize: "0.825rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.3rem" }}>
            Matriz de Evaluación Conductual ABC (TDAH)
          </div>
          <p style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "0.65rem" }}>
            Registra el Antecedente, la Conducta observada y la Consecuencia/Intervención para sincronizar con el Docente:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginBottom: "0.65rem" }}>
            <div>
              <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "#475569" }}>A · Antecedente (Disparador)</label>
              <input
                type="text"
                value={abcForm.antecedente}
                onChange={(e) => setAbcForm({ ...abcForm, antecedente: e.target.value })}
                className="form-input"
                style={{ fontSize: "0.75rem", padding: "0.4rem 0.6rem" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "#475569" }}>B · Conducta Observada</label>
              <input
                type="text"
                value={abcForm.conducta}
                onChange={(e) => setAbcForm({ ...abcForm, conducta: e.target.value })}
                className="form-input"
                style={{ fontSize: "0.75rem", padding: "0.4rem 0.6rem" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "#475569" }}>C · Consecuencia / Pauta Exitosa</label>
              <input
                type="text"
                value={abcForm.consecuencia}
                onChange={(e) => setAbcForm({ ...abcForm, consecuencia: e.target.value })}
                className="form-input"
                style={{ fontSize: "0.75rem", padding: "0.4rem 0.6rem" }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setAbcGuardado(true);
              if (onEmitirRecomendacionRapida) {
                onEmitirRecomendacionRapida(
                  `Registro Clínico ABC: [Antecedente] ${abcForm.antecedente} -> [Conducta] ${abcForm.conducta} -> [Pauta Exitosa] ${abcForm.consecuencia}`
                );
              }
              setTimeout(() => setAbcGuardado(false), 4000);
            }}
            className="btn btn-primary btn-sm btn-block"
            style={{ background: "var(--terapeuta-color)", fontSize: "0.75rem" }}
          >
            <Send size={13} />
            <span>{abcGuardado ? "Matriz ABC Compartida con Docente y Tutor" : "Compartir Matriz ABC con el Equipo"}</span>
          </button>
        </div>
      )}

      {/* Termómetro Ejecutivo en Vivo (Foco vs Hiperactividad vs Regulación) */}
      <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "1rem" }}>
        <div style={{ fontSize: "0.775rem", fontWeight: "800", color: "#334155", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <BarChart3 size={15} color="var(--terapeuta-color)" />
          <span>Monitoreo de Función Ejecutiva en Vivo (TDAH)</span>
        </div>
        <div style={{ marginBottom: "0.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.725rem", fontWeight: "700", color: "#059669" }}>
            <span>Foco Atencional Sostenido</span>
            <span>{nivelAtencion}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={nivelAtencion}
            onChange={(e) => setNivelAtencion(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#10b981" }}
          />
        </div>
        <div style={{ marginBottom: "0.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.725rem", fontWeight: "700", color: "#d97706" }}>
            <span>Inquietud Motora / Impulsividad</span>
            <span>{nivelHiperactividad}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={nivelHiperactividad}
            onChange={(e) => setNivelHiperactividad(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#f59e0b" }}
          />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.725rem", fontWeight: "700", color: "#2563eb" }}>
            <span>Autorregulación Emocional</span>
            <span>{nivelRegulacionEmocional}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={nivelRegulacionEmocional}
            onChange={(e) => setNivelRegulacionEmocional(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#2563eb" }}
          />
        </div>
      </div>

      {/* Protocolos rápidos de 1-clic */}
      <div>
        <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>
          Pautas Rápidas TDAH para Aplicar o Sugerir al Docente:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          {tecnicas.map((t, idx) => {
            const IconComponent = t.icono;
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.55rem 0.75rem",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <IconComponent size={16} color={t.color} />
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#1e293b" }}>{t.titulo}</div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{t.desc}</div>
                  </div>
                </div>
                {onEstrategiaSeleccionada && (
                  <button
                    type="button"
                    onClick={() => onEstrategiaSeleccionada(t.titulo)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                  >
                    Aplicar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SensoryToolbox;
